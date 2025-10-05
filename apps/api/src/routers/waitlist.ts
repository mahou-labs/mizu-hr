import z from "zod";
import { waitlist } from "@/schema/waitlist";
import { db } from "@/utils/db";
import { publicProcedure } from "../utils/orpc";

export const waitlistRouter = {
  addEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .handler(async ({ input }) => {
      await db
        .insert(waitlist)
        .values({
          email: input.email,
        })
        .onConflictDoNothing({ target: waitlist.email })
        .returning();

      return { success: true };
    }),
};
