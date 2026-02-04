import * as z from "zod";
import { auth } from "../utils/auth";
import { protectedProcedure } from "../utils/orpc";

const roleSchema = z.union([
  z.enum(["admin", "member", "owner"]),
  z.array(z.enum(["admin", "member", "owner"])),
]);

export const orgInviteRouter = {
  list: protectedProcedure.handler(async ({ context: { headers } }) => {
    return await auth.api.listInvitations({ headers });
  }),

  create: protectedProcedure
    .input(
      z.object({
        email: z.email(),
        role: roleSchema,
      }),
    )
    .handler(async ({ context: { headers }, input }) => {
      return await auth.api.createInvitation({
        headers,
        body: {
          email: input.email,
          role: input.role,
          resend: true,
        },
      });
    }),

  accept: protectedProcedure
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

      return data;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ context: { headers }, input }) => {
      return await auth.api.cancelInvitation({
        headers,
        body: { invitationId: input.id },
      });
    }),
};
