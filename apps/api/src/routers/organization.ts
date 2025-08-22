import z from "zod";
import { getAuth } from "../utils/auth";
import { protectedProcedure } from "../utils/orpc";

export const organizationRouter = {
  checkSlugAvailability: protectedProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .handler(async ({ input }) => {
      const auth = getAuth();
      const { status } = await auth.api.checkOrganizationSlug({
        body: {
          slug: input.slug,
        },
      });

      return status;
    }),

  getOrgList: protectedProcedure.handler(
    async ({ context: { headers, db } }) => {
      const auth = getAuth(db);
      const organizations = await auth.api.listOrganizations({ headers });
      return organizations;
    }
  ),
};
