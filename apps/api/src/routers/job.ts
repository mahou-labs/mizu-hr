import { ORPCError } from "@orpc/server";
import { and, desc, eq } from "drizzle-orm";
import z from "zod";
import { job } from "@/schema/job";
import { db } from "@/utils/db";
import { tryCatch } from "@/utils/try-catch";
import { protectedProcedure } from "../utils/orpc";

const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  employmentType: z.enum(["full-time", "part-time", "contract", "internship"]),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  recruiters: z.array(z.string()).default([]),
});

const jobUpdateSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  location: z.string().min(1, "Location is required").optional(),
  employmentType: z.enum(["full-time", "part-time", "contract", "internship"]).optional(),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  recruiters: z.array(z.string()).optional(),
});

export const jobRouter = {
  create: protectedProcedure.input(jobSchema).handler(async ({ input, context }) => {
    const orgId = context.session?.activeOrganizationId;
    if (!context.user?.id) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "User not authenticated",
      });
    }

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
          createdBy: context.user.id,
        })
        .returning(),
    );

    if (error) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to create job posting",
        cause: error,
      });
    }

    return data[0];
  }),

  list: protectedProcedure.handler(async ({ context }) => {
    const orgId = context.session?.activeOrganizationId;
    if (!orgId) {
      throw new ORPCError("BAD_REQUEST", {
        message: "No active organization selected",
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

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const orgId = context.session?.activeOrganizationId;
      if (!orgId) {
        throw new ORPCError("BAD_REQUEST", {
          message: "No active organization selected",
        });
      }

      const { data, error } = await tryCatch(
        db
          .select()
          .from(job)
          .where(and(eq(job.id, input.id), eq(job.organizationId, orgId))),
      );

      if (error) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to fetch job details",
          cause: error,
        });
      }

      if (!data[0]) {
        throw new ORPCError("NOT_FOUND", {
          message: "Job posting not found",
        });
      }

      return data[0];
    }),

  update: protectedProcedure
    .input(jobUpdateSchema)
    .handler(async ({ input, context }) => {
      const { id, ...updates } = input;
      const orgId = context.session?.activeOrganizationId;
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

      if (!data[0]) {
        throw new ORPCError("NOT_FOUND", {
          message: "Job posting not found",
        });
      }

      return data[0];
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const orgId = context.session?.activeOrganizationId;
      if (!orgId) {
        throw new ORPCError("BAD_REQUEST", {
          message: "No active organization selected",
        });
      }

      const { error } = await tryCatch(
        db.delete(job).where(and(eq(job.id, input.id), eq(job.organizationId, orgId))),
      );

      if (error) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to delete job posting",
          cause: error,
        });
      }

      return { success: true };
    }),
};
