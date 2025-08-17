import { eq } from "drizzle-orm";
import z from "zod";
import { organization } from "../schema/auth";
import { getDb } from "../utils/db";
import { protectedProcedure } from "../utils/orpc";
import { getAuth } from "../utils/auth";

export const organizationRouter = {
  checkSlugAvailability: protectedProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .handler(async ({ input }) => {
      try {
        const auth = getAuth();
        const { status } = await auth.api.checkOrganizationSlug({
          body: {
            slug: input.slug, // required
          },
        });

        console.log({ status });

        return status;
      } catch (error) {
        console.error(error);
      }
    }),
};
