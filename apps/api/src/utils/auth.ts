import { checkout, polar, portal, usage, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import * as authSchema from "@mizu-hr/schemas/auth";
import { db } from "./db";
import { sendOrgInvite, sendPasswordResetEmail, sendVerificationEmail } from "./email";
import { env } from "./env";

const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
});

export const getActiveOrganization = async (userId: string) => {
  try {
    const userOrganizations = await db
      .select({ id: authSchema.organizations.id })
      .from(authSchema.members)
      .innerJoin(
        authSchema.organizations,
        eq(authSchema.members.organizationId, authSchema.organizations.id),
      )
      .where(eq(authSchema.members.userId, userId));

    if (userOrganizations.length === 0) {
      return null;
    }

    // For now, return the first organization
    const activeOrg = userOrganizations[0];

    return activeOrg?.id;
  } catch (error) {
    throw new Error(
      `Failed to fetch active organization: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
    usePlural: true,
  }),
  trustedOrigins: [env.APP_URL],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    password: {
      hash: (password) => Bun.password.hash(password),
      verify: ({ hash, password }) => Bun.password.verify(password, hash),
    },
    sendResetPassword: async ({ user, url }) => {
      void sendPasswordResetEmail({
        email: user.email,
        name: user.name,
        resetLink: url,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendVerificationEmail({
        email: user.email,
        name: user.name,
        verificationLink: url,
      });
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
  user: {
    deleteUser: {
      enabled: true,
      afterDelete: async (user) => {
        await polarClient.customers.deleteExternal({
          externalId: user.id,
        });
      },
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
    user: {
      create: {
        before: async (user) => {
          try {
            // Check if a Polar customer already exists with this email
            const { result: existingCustomers } = await polarClient.customers.list({
              email: user.email,
            });

            const existingCustomer = existingCustomers.items[0];

            if (existingCustomer?.externalId) {
              // Use the existing external ID as the user ID
              return {
                data: {
                  ...user,
                  id: existingCustomer.externalId,
                },
              };
            }
          } catch (error) {
            console.error(error);
          }

          // No existing customer, proceed with normal user creation
          return {
            data: user,
          };
        },
        after: async (user) => {
          try {
            // Check if customer already exists
            const { result: existingCustomers } = await polarClient.customers.list({
              email: user.email,
            });

            const existingCustomer = existingCustomers.items[0];

            if (existingCustomer) {
              return;
            }

            // Create new customer
            await polarClient.customers.create({
              email: user.email,
              name: user.name,
              externalId: user.id,
            });
          } catch (error) {
            console.error(error);
            // Don't throw - we don't want to fail user creation if Polar fails
          }
        },
      },
    },
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
          successUrl: `${env.APP_URL}/success?checkout_id={CHECKOUT_ID}`,
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
          onCustomerStateChanged: async (payload) => console.log(payload), // Triggered when anything regarding a customer changes
          onOrderPaid: async (payload) => console.log(payload), // Triggered when an order was paid (purchase, subscription renewal, etc.)
          // Over 25 granular webhook handlers
          onOrganizationUpdated: async (payload) => console.log(payload),
          onPayload: async (payload) => console.log(payload), // Catch-all for all events
        }),
      ],
    }),
  ],
});
