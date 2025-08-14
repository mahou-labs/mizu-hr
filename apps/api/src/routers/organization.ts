import { eq } from "drizzle-orm";
import z from "zod";
import { organization } from "../schema/auth";
import { getDb } from "../utils/db";
import { publicProcedure } from "../utils/orpc";
import { getAuth } from "../utils/auth";

export const organizationRouter = {
  checkSlugAvailability: publicProcedure.input(z.object({ slug: z.string().min(1) })).handler(async ({input}) => {
    
    const auth = getAuth();
    const { data } = await auth.api.checkOrganizationSlug({
    body: {
        slug: input.slug, // required
    },
  });

    return {
      available: data.available,
      slug: input.slug,
    };
  }),
};