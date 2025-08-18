import { env } from "cloudflare:workers";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import * as schema from "../schema/auth";
import { getDb } from "./db";

export const getAuth = (db?: ReturnType<typeof getDb>) => {
  const database = db ?? getDb();

  return betterAuth({
    database: drizzleAdapter(database, {
      provider: "pg",
      schema,
    }),
    trustedOrigins: [env.CORS_ORIGIN],
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
        sameSite: "none", // Allows CORS-based cookie sharing across subdomains
        partitioned: true, // New browser standards will mandate this for foreign cookies
        domain: ".mizuhr.com",
      },
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // Cache duration in seconds
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
  });
};
