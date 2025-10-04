import z from "zod";
import { waitlist } from "@/schema/waitlist";
import { db } from "@/utils/db";
import { publicProcedure } from "../utils/orpc";

export const waitlistRouter = {
  addEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .handler(async ({ input }) => {
      return await db.insert(waitlist).values({
        email: input.email,
      });
    }),
};
