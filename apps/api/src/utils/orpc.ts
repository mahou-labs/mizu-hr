import { os } from "@orpc/server";
import { Polar } from "@polar-sh/sdk";
import { redis } from "bun";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { organizations } from "@mizu-hr/schemas/auth";
import type { Context } from "./context";
import { db } from "./db";
import { env } from "./env";
import { tryCatch } from "./try-catch";

const polar = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: env.NODE_ENV === "production" ? "production" : "sandbox",
});

const TRIAL_PERIOD = 30 * 24 * 60 * 60 * 1000;

export type CachedSubscriptionData = {
  plan: string;
  status: string;
  currentPeriodEnd: Date | null;
};

export const o = os.$context<Context>();

export const requireAuth = o
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

    const { data: cachedData, error: redisError } = await tryCatch(redis.get(orgId));
    if (redisError) {
      console.error("Redis error:", redisError);
    }

    if (cachedData) {
      const subscriptionData = JSON.parse(cachedData) as CachedSubscriptionData;

      const isActive = subscriptionData.status === "active";
      const currentPeriodEnd = subscriptionData.currentPeriodEnd
        ? new Date(subscriptionData.currentPeriodEnd)
        : null;

      const isNotExpired = currentPeriodEnd ? currentPeriodEnd.getTime() > Date.now() : false;

      if (isActive && isNotExpired) {
        return next();
      }

      await tryCatch(redis.del(orgId));
    }

    const { data: subscriptions, error: polarError } = await tryCatch(
      polar.subscriptions.list({
        metadata: { referenceId: orgId },
        active: true,
        limit: 10,
        page: 1,
      }),
    );

    if (polarError) {
      console.error("Polar API error:", polarError);
    }

    if (subscriptions) {
      const activeSubscription = subscriptions.result.items.find((sub) => sub.status === "active");

      if (activeSubscription) {
        const subscriptionData: CachedSubscriptionData = {
          plan: activeSubscription.product.name,
          status: activeSubscription.status,
          currentPeriodEnd: activeSubscription.currentPeriodEnd,
        };

        const { error: cacheError } = await tryCatch(
          redis.set(orgId, JSON.stringify(subscriptionData)),
        );
        if (!cacheError) {
          await tryCatch(redis.expire(orgId, TRIAL_PERIOD / 1000));
        }

        return next();
      }
    }

    const { data: pgOrg, error: dbError } = await tryCatch(
      db
        .select()
        .from(organizations)
        .where(eq(organizations.id, orgId))
        .then((org) => org[0]),
    );

    if (dbError || !pgOrg) {
      throw errors.NO_SUBSCRIPTION({ data: { missingSubscription: true } });
    }

    const orgCreatedAt = new Date(pgOrg.createdAt);
    const now = new Date();
    const timeSinceCreation = now.getTime() - orgCreatedAt.getTime();

    if (timeSinceCreation < TRIAL_PERIOD) {
      return next();
    }

    throw errors.NO_SUBSCRIPTION({ data: { missingSubscription: true } });
  });

export const publicProcedure = o;
export const protectedProcedure = publicProcedure.use(requireAuth).use(requireSubscription);
