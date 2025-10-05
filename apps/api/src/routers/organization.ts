import { redis } from "bun";
import z from "zod";
import { auth } from "../utils/auth";
import { type CachedSubscriptionData, protectedProcedure } from "../utils/orpc";

export const organizationRouter = {
  createOrg: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
      })
    )
    .handler(async ({ context: { headers, resHeaders }, input }) => {
      const data = await auth.api.createOrganization({
        headers,
        body: input,
      });

      const { headers: sessionHeaders } = await auth.api.setActiveOrganization({
        headers,
        returnHeaders: true,
        body: {
          organizationId: data?.id,
        },
      });

      const cookies = sessionHeaders.getSetCookie();
      for (const cookie of cookies) {
        resHeaders?.append("set-cookie", cookie);
      }

      return data;
    }),

  checkSlugAvailability: protectedProcedure
    .input(z.string().min(1))
    .output(z.boolean())
    .handler(async ({ input }) => {
      try {
        const { status } = await auth.api.checkOrganizationSlug({
          body: {
            slug: input,
          },
        });

        return status;
      } catch {
        return false;
      }
    }),

  getFullOrg: protectedProcedure.handler(async ({ context: { headers } }) => {
    const org = await auth.api.getFullOrganization({ headers });
    return org;
  }),

  getOrgList: protectedProcedure.handler(async ({ context: { headers } }) => {
    return await auth.api.listOrganizations({ headers });
  }),

  getMembers: protectedProcedure.handler(async ({ context: { headers } }) => {
    const [members, invites] = await Promise.all([
      auth.api.listMembers({ headers }),
      auth.api.listInvitations({ headers }),
    ]);

    return { members, invites };
  }),

  inviteMember: protectedProcedure
    .input(
      z.object({
        email: z.email(),
        role: z.union([
          z.enum(["admin", "member", "owner"]),
          z.array(z.enum(["admin", "member", "owner"])),
        ]),
      })
    )
    .handler(async ({ context: { headers }, input }) => {
      await auth.api.createInvitation({
        headers,
        body: {
          email: input.email,
          role: input.role,
          resend: true,
        },
      });
    }),

  acceptInvitation: protectedProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ context: { headers, resHeaders }, input }) => {
      const data = await auth.api.acceptInvitation({
        headers,
        body: { invitationId: input.id },
      });

      const { headers: sessionHeaders } = await auth.api.setActiveOrganization({
        headers,
        returnHeaders: true,
        body: {
          organizationId: data?.invitation.organizationId,
        },
      });

      const cookies = sessionHeaders.getSetCookie();
      for (const cookie of cookies) {
        resHeaders?.append("set-cookie", cookie);
      }
    }),

  setActive: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .handler(async ({ context: { headers, resHeaders }, input }) => {
      const { headers: sessionHeaders } = await auth.api.setActiveOrganization({
        headers,
        returnHeaders: true,
        body: {
          organizationId: input.organizationId,
        },
      });

      const cookies = sessionHeaders.getSetCookie();
      for (const cookie of cookies) {
        resHeaders?.append("set-cookie", cookie);
      }
    }),

  getSubscription: protectedProcedure.handler(
    async ({ context: { session } }) => {
      if (!session?.activeOrganizationId) {
        return null;
      }

      try {
        const subscription = await redis.get(session.activeOrganizationId);
        const parsedSubscription = subscription
          ? (JSON.parse(subscription) as CachedSubscriptionData)
          : null;

        return parsedSubscription;
      } catch (error) {
        // Log error and return null instead of letting exception bubble up
        console.error("Failed to get subscription from Redis:", error);
        return null;
      }
    }
  ),
};
