import { application, candidate } from "@/schema/candidate";
import { job } from "@/schema/job";
import { db } from "@/utils/db";
import { tryCatch } from "@/utils/try-catch";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { publicProcedure } from "../utils/orpc";

export const candidateRouter = {
  apply: publicProcedure
    .input(
      z.object({
        jobId: z.string(),
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        coverLetter: z.string().optional(),
      }),
    )
    .handler(async ({ input }) => {
      const { jobId, name, email, phone, coverLetter } = input;

      // Verify the job exists and is published
      const { data: jobData, error: jobError } = await tryCatch(
        db
          .select()
          .from(job)
          .where(and(eq(job.id, jobId), eq(job.status, "published")))
          .then((rows) => rows[0]),
      );

      if (jobError) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to look up job posting",
          cause: jobError,
        });
      }

      if (!jobData) {
        throw new ORPCError("NOT_FOUND", {
          message: "Job posting not found or is not accepting applications",
        });
      }

      // Upsert candidate: insert or update existing (matched by email + org)
      const { data: candidateData, error: candidateError } = await tryCatch(
        db
          .insert(candidate)
          .values({
            name,
            email,
            phone,
            organizationId: jobData.organizationId,
          })
          .onConflictDoUpdate({
            target: [candidate.email, candidate.organizationId],
            set: { name, phone },
          })
          .returning()
          .then((rows) => rows[0]),
      );

      if (candidateError || !candidateData) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to create candidate record",
          cause: candidateError,
        });
      }

      // Create the application
      const { data: applicationData, error: applicationError } = await tryCatch(
        db
          .insert(application)
          .values({
            candidateId: candidateData.id,
            jobId,
            coverLetter,
          })
          .returning()
          .then((rows) => rows[0]),
      );

      if (applicationError) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to submit application",
          cause: applicationError,
        });
      }

      return applicationData;
    }),
};
