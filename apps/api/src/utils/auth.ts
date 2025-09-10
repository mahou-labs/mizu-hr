import { checkout, polar, portal } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import * as schema from "../schema/auth";
import { db } from "./db";
import { sendOrgInvite } from "./email";
import { env } from "./env";

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
    polar({
      client: new Polar({
        accessToken: env.POLAR_ACCESS_TOKEN,
        server: "sandbox",
      }),
      createCustomerOnSignUp: true,
      use: [
        portal(),
        // webhooks({
        //   secret: env.POLAR_WEBHOOK_SECRET,
        //   onOrganizationUpdated: (payload) => {
        //     console.log("organization updated", payload);
        //   },
        // }),
        checkout({
          products: [
            {
              productId: "542964f0-f9e4-4863-aa5a-9c787317ae54",
              slug: "starter-monthly",
            },
            {
              productId: "68c79948-d014-4c70-9e83-baa37b76e7cb",
              slug: "starter-yearly",
            },
            {
              productId: "899737cc-96c5-4d17-bc43-e3455434cc01",
              slug: "growth-monthly",
            },
            {
              productId: "f7e2348d-101d-4762-9a46-e5dd6b1adf27",
              slug: "growth-yearly",
            },
          ],
          successUrl: "/success?checkout_id={CHECKOUT_ID}",
          authenticatedUsersOnly: true,
        }),
      ],
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
