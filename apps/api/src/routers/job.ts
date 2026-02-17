import { ORPCError } from "@orpc/server";
import { and, eq, sql } from "drizzle-orm";
import z from "zod";
import { job, jobCreateSchema, jobUpdateSchema } from "@mizu-hr/schemas/job";
import { db, getTxid } from "@/utils/db";
import { tryCatch } from "@/utils/try-catch";
import { protectedProcedure } from "../utils/orpc";

export const jobRouter = {
  create: protectedProcedure
    .input(jobCreateSchema.omit({ createdAt: true, updatedAt: true, publishedAt: true }))
    .handler(async ({ input, context }) => {
      const orgId = context.session?.activeOrganizationId;
      if (!context.user) {
        throw new ORPCError("UNAUTHORIZED", {
          message: "User not authenticated",
        });
      }

      if (!orgId) {
        throw new ORPCError("BAD_REQUEST", {
          message: "No active organization selected",
        });
      }

      const userId = context.user.id;

      const { data, error } = await tryCatch(
        db.transaction(async (tx) => {
          const result = await tx
            .insert(job)
            .values({
              ...input,
              organizationId: orgId,
              createdBy: userId,
            })
            .returning();

          const txid = await getTxid(tx);
          return { result, txid };
        }),
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
      const orgId = context.session?.activeOrganizationId;
      if (!orgId) {
        throw new ORPCError("BAD_REQUEST", {
          message: "No active organization selected",
        });
      }

      const { data, error } = await tryCatch(
        db.transaction(async (tx) => {
          const result = await tx
            .update(job)
            .set(updates)
            .where(and(eq(job.id, id), eq(job.organizationId, orgId)))
            .returning();

          const txid = await getTxid(tx);
          return { result, txid };
        }),
      );

      if (error) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to update job posting",
          cause: error,
        });
      }

      if (!data.result[0]) {
        throw new ORPCError("NOT_FOUND", {
          message: "Job posting not found",
        });
      }

      return data;
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

      const { data: txid, error } = await tryCatch(
        db.transaction(async (tx) => {
          await tx.delete(job).where(and(eq(job.id, input.id), eq(job.organizationId, orgId)));
          const txid = await getTxid(tx);
          return txid;
        }),
      );

      if (error) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to delete job posting",
          cause: error,
        });
      }

      return { txid };
    }),
};
