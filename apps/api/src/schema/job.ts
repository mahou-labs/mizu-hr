import { boolean, integer, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { randomUUIDv7 } from "bun";
import { organization, user } from "./auth";

export const job = pgTable("job", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  department: text("department"),
  location: text("location").notNull(),
  remote: boolean("remote").default(false).notNull(),
  employmentType: text("employment_type").notNull(), // full-time, part-time, contract, internship
  experienceLevel: text("experience_level"), // entry, mid, senior, lead
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  salaryCurrency: text("salary_currency").default("USD"),
  status: text("status").default("draft").notNull(), // draft, published, closed, archived
  recruiters: json("recruiters").$type<string[]>().default([]).notNull(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
