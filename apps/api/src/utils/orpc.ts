import { os } from "@orpc/server";
import { redis } from "bun";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { organization } from "@/schema/auth";
import { auth } from "./auth";
import type { Context } from "./context";
import { db } from "./db";

const TRIAL_PERIOD = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export type CachedSubscriptionData = {
  plan: string;
  status: string;
  currentPeriodEnd: Date | null;
};

export const o = os.$context<Context>();

const requireAuth = o
  .errors({
    UNAUTHORIZED: {
      status: 401,
      message: "Unauthorized",
      data: z.object({ invalidSession: z.boolean() }),
    },
  })
  .middleware(({ context, errors, next }) => {
    if (!context?.user) {
      throw errors.UNAUTHORIZED({ data: { invalidSession: true } });
    }

    return next();
  });

const requireSubscription = o
  .errors({
    NO_SUBSCRIPTION: {
      status: 402,
      message: "No subscription",
      data: z.object({ missingSubscription: z.boolean() }),
    },
  })
  .middleware(async ({ context, errors, next }) => {
    const orgId = context?.session?.activeOrganizationId;
    if (!orgId) {
      throw errors.NO_SUBSCRIPTION({ data: { missingSubscription: true } });
    }

    redis.del(orgId);

    // Step 1: Check Redis for cached subscription data
    const cachedData = await redis.get(orgId);
    if (cachedData) {
      try {
        const subscriptionData = JSON.parse(
          cachedData
        ) as CachedSubscriptionData;

        // Validate that the cached subscription is still active and not expired
        const isActive = subscriptionData.status === "active";
        const currentPeriodEnd = subscriptionData.currentPeriodEnd
          ? new Date(subscriptionData.currentPeriodEnd)
          : null;
        const isNotExpired = currentPeriodEnd
          ? currentPeriodEnd.getTime() > Date.now()
          : false;

        if (isActive && isNotExpired) {
          // Valid cached subscription, continue
          return next();
        }

        // Cached data is invalid, delete it and continue to check Polar
        await redis.del(orgId);
      } catch (error) {
        // Failed to parse cached data, delete it and continue
        console.error(error);
        await redis.del(orgId);
      }
    }

    // Step 2: Check Polar for active subscription
    try {
      const { result: subscriptions } = await auth.api.subscriptions({
        headers: context.headers,
        query: {
          referenceId: orgId,
          active: true,
          limit: 10,
          page: 1,
        },
      });

      // Find the first active subscription
      const activeSubscription = subscriptions.items.find(
        (sub) => sub.status === "active"
      );

      if (activeSubscription) {
        // Cache subscription details in Redis
        const subscriptionData: CachedSubscriptionData = {
          plan: activeSubscription.product.name,
          status: activeSubscription.status,
          currentPeriodEnd: activeSubscription.currentPeriodEnd,
        };

        await redis.set(orgId, JSON.stringify(subscriptionData));
        await redis.expire(orgId, TRIAL_PERIOD / 1000); // Convert ms to seconds

        return next();
      }
    } catch (error) {
      console.error(error);
      // Continue to check free trial if Polar check fails
    }

    // Step 3: Check Postgres for org creation date (free trial)
    const pgOrg = await db
      .select()
      .from(organization)
      .where(eq(organization.id, orgId))
      .then((org) => org[0]);

    if (!pgOrg) {
      throw errors.NO_SUBSCRIPTION({ data: { missingSubscription: true } });
    }

    // Check if org is within trial period
    const orgCreatedAt = new Date(pgOrg.createdAt);
    const now = new Date();
    const timeSinceCreation = now.getTime() - orgCreatedAt.getTime();

    if (timeSinceCreation < TRIAL_PERIOD) {
      // Organization is in free trial
      return next();
    }

    // Step 4: No subscription or trial found
    throw errors.NO_SUBSCRIPTION({ data: { missingSubscription: true } });
  });

export const publicProcedure = o;
export const protectedProcedure = publicProcedure
  .use(requireAuth)
  .use(requireSubscription);
