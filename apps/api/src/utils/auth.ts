import {
  checkout,
  polar,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import * as schema from "../schema/auth";
import { db } from "./db";
import { sendOrgInvite } from "./email";
import { env } from "./env";

const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  // Use 'sandbox' if you're using the Polar Sandbox environment
  // Remember that access tokens, products, etc. are completely separated between environments.
  // Access tokens obtained in Production are for instance not usable in the Sandbox environment.
  server: "sandbox",
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
    autoSignIn: true,
    password: {
      hash: (password) => Bun.password.hash(password),
      verify: ({ hash, password }) => Bun.password.verify(password, hash),
    },
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/auth",
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
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
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      allowUserToJoinOrganization: true,
      async sendInvitationEmail(data) {
        const inviteLink = `${env.APP_URL}/invite?id=${data.id}`;
        await sendOrgInvite({
          email: data.email,
          invitedByUsername: data.inviter.user.name,
          invitedByEmail: data.inviter.user.email,
          teamName: data.organization.name,
          inviteLink,
        });
      },
    }),
    polar({
      client: polarClient,
      createCustomerOnSignUp: false,
      use: [
        checkout({
          products: [
            {
              productId: "123-456-789", // ID of Product from Polar Dashboard
              slug: "pro", // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
            },
          ],
          successUrl: "/success?checkout_id={CHECKOUT_ID}",
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
          onCustomerStateChanged: async (payload) => console.log(payload), // Triggered when anything regarding a customer changes
          onOrderPaid: async (payload) => console.log(payload), // Triggered when an order was paid (purchase, subscription renewal, etc.)
          // Over 25 granular webhook handlers
          onPayload: async (payload) => console.log(payload), // Catch-all for all events
        }),
      ],
    }),
  ],
});
