import { ORPCError } from "@orpc/server";
import z from "zod";
import { publicProcedure } from "../utils/orpc";
import { resend } from "@/utils/email";

export const waitlistRouter = {
  addEmail: publicProcedure.input(z.object({ email: z.email() })).handler(async ({ input }) => {
    const { error } = await resend.contacts.create({
      email: input.email,
      segments: [{ id: "5aea1008-77ea-4724-9f15-8ca5cb55516a" }],
    });

    if (error) {
      console.error(error);
      throw new ORPCError("Failed to add email to waitlist");
    }

    return { success: true };
  }),
};
