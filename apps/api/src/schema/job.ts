import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { organization, user } from "./auth";

export const job = pgTable("job", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  department: text("department"),
  location: text("location"),
  employmentType: text("employment_type").notNull(), // full-time, part-time, contract, internship
  experienceLevel: text("experience_level"), // entry, mid, senior, lead
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  salaryCurrency: text("salary_currency").default("USD"),
  remote: boolean("remote").default(false).notNull(),
  status: text("status").default("draft").notNull(), // draft, published, closed, archived
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  publishedAt: timestamp("published_at"),
  closedAt: timestamp("closed_at"),
});
