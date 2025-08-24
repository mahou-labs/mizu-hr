import z from "zod";
import { getAuth } from "../utils/auth";
import { protectedProcedure } from "../utils/orpc";

export const organizationRouter = {
  checkSlugAvailability: protectedProcedure
    .input(z.string().min(1))
    .output(z.boolean())
    .handler(async ({ input }) => {
      const auth = getAuth();
      const { status } = await auth.api.checkOrganizationSlug({
        body: {
          slug: input,
        },
      });

      return status;
    }),

  getFullOrg: protectedProcedure.handler(
    async ({ context: { headers, db } }) => {
      const auth = getAuth(db);
      const org = await auth.api.getFullOrganization({ headers });
      return org;
    }
  ),

  getOrgList: protectedProcedure
    .output(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          slug: z.string(),
          createdAt: z.date(),
          logo: z.string().nullable().optional(),
        })
      )
    )
    .handler(async ({ context: { headers, db } }) => {
      const auth = getAuth(db);
      return await auth.api.listOrganizations({ headers });
    }),
};
