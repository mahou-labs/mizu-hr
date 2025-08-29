// import { checkout, polar, portal } from "@polar-sh/better-auth";
// import { Polar } from "@polar-sh/sdk";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import * as schema from "../schema/auth";
import { db } from "./db";
import { env } from "./env";
import { ALLOWED_ORIGINS } from "./origins";

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

    return activeOrg.id;
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
  trustedOrigins: [...ALLOWED_ORIGINS],
  emailAndPassword: {
    enabled: true,
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
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
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      allowUserToJoinOrganization: true,
    }),
    // polar({
    //   client: new Polar({
    //     accessToken: env.POLAR_ACCESS_TOKEN,
    //     server: "sandbox",
    //   }),
    //   createCustomerOnSignUp: true,
    //   use: [
    //     portal(),
    //     // webhooks({
    //     //   secret: env.POLAR_WEBHOOK_SECRET,
    //     //   onOrganizationUpdated: (payload) => {
    //     //     console.log("organization updated", payload);
    //     //   },
    //     // }),
    //     checkout({
    //       products: [
    //         {
    //           productId: "b5208a27-6aec-47fc-bb00-4d2fc50195a2",
    //           slug: "hiring-test-product", // Custom slug for easy reference in Checkout URL, e.g. /checkout/hiring-test-product
    //         },
    //       ],
    //       successUrl: process.env.POLAR_SUCCESS_URL,
    //       authenticatedUsersOnly: true,
    //     }),
    //   ],
    // }),
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
