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
      const { status } = await auth.api.checkOrganizationSlug({
        body: {
          slug: input,
        },
      });

      return status;
    }),

  getFullOrg: protectedProcedure.handler(async ({ context: { headers } }) => {
    const org = await auth.api.getFullOrganization({ headers });
    return org;
  }),

  getOrgList: protectedProcedure
    .output(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          slug: z.string(),
          createdAt: z.date(),
          logo: z.string().nullable().optional(),
        })
      )
    )
    .handler(async ({ context: { headers } }) => {
      return await auth.api.listOrganizations({ headers });
    }),

  getMembers: protectedProcedure.handler(async ({ context: { headers } }) => {
    return await auth.api.listMembers({ headers });
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
};
