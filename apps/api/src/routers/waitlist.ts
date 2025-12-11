import { ORPCError } from "@orpc/server";
import z from "zod";
import { waitlist } from "@/schema/waitlist";
import { db } from "@/utils/db";
import { tryCatch } from "@/utils/try-catch";
import { publicProcedure } from "../utils/orpc";

export const waitlistRouter = {
  addEmail: publicProcedure.input(z.object({ email: z.email() })).handler(async ({ input }) => {
    const { error } = await tryCatch(
      db
        .insert(waitlist)
        .values({
          email: input.email,
        })
        .onConflictDoNothing({ target: waitlist.email }),
    );

    if (error) {
      throw new ORPCError("Failed to add email to waitlist");
    }

    return { success: true };
  }),
};
