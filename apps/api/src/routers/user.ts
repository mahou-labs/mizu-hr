import z from "zod";
import { auth } from "../utils/auth";
import { publicProcedure } from "../utils/orpc";

export const userRouter = {
  getSession: publicProcedure
    .output(
      z
        .object({
          session: z.object({
            id: z.string(),
            userId: z.string(),
            expiresAt: z.date(),
            createdAt: z.date(),
            updatedAt: z.date(),
            token: z.string(),
            ipAddress: z.string().nullable().optional(),
            userAgent: z.string().nullable().optional(),
            activeOrganizationId: z.string().nullable().optional(),
          }),
          user: z.object({
            id: z.string(),
            email: z.string(),
            emailVerified: z.boolean(),
            name: z.string(),
            createdAt: z.date(),
            updatedAt: z.date(),
            image: z.string().nullable().optional(),
          }),
        })
        .nullable()
    )
    .handler(async ({ context: { headers } }) => {
      return await auth.api.getSession({ headers });
    }),
};
