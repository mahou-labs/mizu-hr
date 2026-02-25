import { db } from "@/utils/db";
import { tryCatch } from "@/utils/try-catch";
import { job, jobCreateSchema, jobUpdateSchema } from "@/schema/job";
import { ORPCError } from "@orpc/server";
import { and, desc, eq } from "drizzle-orm";
import z from "zod";
import { protectedProcedure } from "../utils/orpc";

export const jobRouter = {
  getAll: protectedProcedure.handler(async ({ context }) => {
    const orgId = context.session.activeOrganizationId;
    if (!orgId) {
      throw new ORPCError("NOT_FOUND", {
        message: "Organization not found",
      });
    }

    const { data, error } = await tryCatch(
      db.select().from(job).where(eq(job.organizationId, orgId)).orderBy(desc(job.createdAt)),
    );

    if (error) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to fetch job listings",
        cause: error,
      });
    }

    return data;
  }),

  create: protectedProcedure.input(jobCreateSchema).handler(async ({ input, context }) => {
    const orgId = context.session.activeOrganizationId;
    const userId = context.user?.id;

    if (!orgId) {
      throw new ORPCError("BAD_REQUEST", {
        message: "No active organization selected",
      });
    }

    const { data, error } = await tryCatch(
      db
        .insert(job)
        .values({
          ...input,
          organizationId: orgId,
          createdBy: userId,
        })
        .returning(),
    );

    if (error) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to create job posting",
        cause: error,
      });
    }

    return data;
  }),

  update: protectedProcedure
    .input(jobUpdateSchema.extend({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const { id, ...updates } = input;
      const orgId = context.session.activeOrganizationId;

      if (!orgId) {
        throw new ORPCError("BAD_REQUEST", {
          message: "No active organization selected",
        });
      }

      const { data, error } = await tryCatch(
        db
          .update(job)
          .set(updates)
          .where(and(eq(job.id, id), eq(job.organizationId, orgId)))
          .returning(),
      );

      if (error) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to update job posting",
          cause: error,
        });
      }

      return data;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const orgId = context.session.activeOrganizationId;

      if (!orgId) {
        throw new ORPCError("BAD_REQUEST", {
          message: "No active organization selected",
        });
      }

      const { error } = await tryCatch(
        await db.delete(job).where(and(eq(job.id, input.id), eq(job.organizationId, orgId))),
      );

      if (error) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to delete job posting",
          cause: error,
        });
      }
    }),
};
