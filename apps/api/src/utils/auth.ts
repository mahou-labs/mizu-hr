import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { and, eq } from "drizzle-orm";
import Stripe from "stripe";
import * as schema from "../schema/auth";
import { db } from "./db";
import { sendOrgInvite } from "./email";
import { env } from "./env";

const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

export const getActiveOrganization = async (userId: string) => {
  try {
    const userOrganizations = await db
      .select({ id: schema.organization.id })
      .from(schema.member)
      .innerJoin(
        schema.organization,
        eq(schema.member.organizationId, schema.organization.id)
      )
      .where(eq(schema.member.userId, userId));

    if (userOrganizations.length === 0) {
      return null;
    }

    // For now, return the first organization
    const activeOrg = userOrganizations[0];

    return activeOrg?.id;
  } catch (error) {
    throw new Error(
      `Failed to fetch active organization: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  trustedOrigins: [env.APP_URL],
  emailAndPassword: {
    enabled: true,
  },
  secret: env.BETTER_AUTH_SECRET,
  // baseURL: env.BETTER_AUTH_URL,
  basePath: "/auth",
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      partitioned: true,
      domain: env.NODE_ENV === "production" ? ".mizuhr.com" : undefined,
    },
  },
  session: {
    cookieCache: {
      enabled: false,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      allowUserToJoinOrganization: true,
      async sendInvitationEmail(data) {
        const inviteLink = `https://app.mizuhr.com/invite?id=${data.id}`;
        await sendOrgInvite({
          email: data.email,
          invitedByUsername: data.inviter.user.name,
          invitedByEmail: data.inviter.user.email,
          teamName: data.organization.name,
          inviteLink,
        });
      },
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "starter",
            priceId: "price_1S5oh140kyaaroEs4Z6yITRA",
          },
        ],
        authorizeReference: async ({ user, referenceId }) => {
          const member = await db
            .select()
            .from(schema.member)
            .where(
              and(
                eq(schema.member.userId, user.id),
                eq(schema.member.organizationId, referenceId)
              )
            )
            .then((res) => res[0]);

          return member?.role === "owner" || member?.role === "admin";
        },
      },
    }),
  ],
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const orgId = await getActiveOrganization(session.userId);
          return {
            data: {
              ...session,
              activeOrganizationId: orgId,
            },
          };
        },
      },
    },
  },
});
