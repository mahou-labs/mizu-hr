import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { organizations } from "./auth";
import { job } from "./job";
import { createInsertSchema, createUpdateSchema } from "drizzle-orm/zod";

export const candidate = pgTable(
  "candidates",
  {
    id: text("id")
      .primaryKey()
      .default(sql`uuidv7()`),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [unique().on(t.email, t.organizationId)],
);

export const candidateCreateSchema = createInsertSchema(candidate);
export const candidateUpdateSchema = createUpdateSchema(candidate);

export const application = pgTable("applications", {
  id: text("id")
    .primaryKey()
    .default(sql`uuidv7()`),
  candidateId: text("candidate_id")
    .notNull()
    .references(() => candidate.id, { onDelete: "cascade" }),
  jobId: text("job_id")
    .notNull()
    .references(() => job.id, { onDelete: "cascade" }),
  status: text("status").default("pending").notNull(), // pending, reviewing, interview, offered, hired, rejected
  coverLetter: text("cover_letter"),
  resumeUrl: text("resume_url"),
  notes: text("notes"),
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const applicationCreateSchema = createInsertSchema(application);
export const applicationUpdateSchema = createUpdateSchema(application);
