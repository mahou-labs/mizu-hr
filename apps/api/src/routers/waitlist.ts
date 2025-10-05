import { eq } from "drizzle-orm";
import z from "zod";
import { waitlist } from "@/schema/waitlist";
import { db } from "@/utils/db";
import { publicProcedure } from "../utils/orpc";

export const waitlistRouter = {
  addEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .handler(async ({ input }) => {
      // Check if email already exists
      const existing = await db
        .select()
        .from(waitlist)
        .where(eq(waitlist.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        return { success: true, alreadyExists: true };
      }

      await db.insert(waitlist).values({
        email: input.email,
      });

      return { success: true, alreadyExists: false };
    }),
};
