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
  department: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.enum(["full-time", "part-time", "contract", "internship"]),
  experienceLevel: z.enum(["entry", "mid", "senior", "lead"]).optional(),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  salaryCurrency: z.string().default("USD"),
  remote: z.boolean().default(false),
  status: z.enum(["draft", "published", "closed", "archived"]).default("draft"),
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
          publishedAt: input.status === "published" ? new Date() : null,
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
    .input(z.object({ id: z.string() }).merge(jobSchema.partial()))
    .handler(async ({ input, context }) => {
      const { id, ...updates } = input;
      const orgId = context.session?.activeOrganizationId;
      if (!orgId) {
        throw new ORPCError("BAD_REQUEST", {
          message: "No active organization selected",
        });
      }

      // If status is being changed to published and publishedAt is not set, set it
      const updateData: typeof updates & { publishedAt?: Date | null } = {
        ...updates,
      };
      if (updates.status === "published") {
        // Check if job already has publishedAt
        const existing = await db
          .select()
          .from(job)
          .where(and(eq(job.id, id), eq(job.organizationId, orgId)));
        if (existing[0] && !existing[0].publishedAt) {
          updateData.publishedAt = new Date();
        }
      }

      const { data, error } = await tryCatch(
        db
          .update(job)
          .set(updateData)
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
