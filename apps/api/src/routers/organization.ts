import z from "zod";
import { auth } from "../utils/auth";
import { protectedProcedure } from "../utils/orpc";

export const organizationRouter = {
  createOrg: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
      })
    )
    .handler(async ({ context: { headers }, input }) => {
      const data = await auth.api.createOrganization({
        headers,
        body: input,
      });

      await auth.api.setActiveOrganization({
        headers,
        body: {
          organizationId: data?.id,
        },
      });
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

  getInvites: protectedProcedure.handler(async ({ context: { headers } }) => {
    return await auth.api.listInvitations({ headers });
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
    .handler(async ({ context: { headers }, input }) => {
      const data = await auth.api.acceptInvitation({
        headers,
        body: { invitationId: input.id },
      });

      await auth.api.setActiveOrganization({
        headers,
        body: {
          organizationId: data?.invitation.organizationId,
        },
      });
    }),

  setActive: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .handler(async ({ context: { headers }, input }) => {
      await auth.api.setActiveOrganization({
        headers,
        body: {
          organizationId: input.organizationId,
        },
      });
    }),

  getSubscription: protectedProcedure.handler(
    async ({ context: { headers, session } }) => {
      return await auth.api.subscriptions({
        query: {
          referenceId: session?.activeOrganizationId ?? undefined,
        },
        headers,
      });
    }
  ),
};
