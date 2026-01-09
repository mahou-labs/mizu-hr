import { integer, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { organization, user } from "./auth";

export const job = pgTable("job", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  employmentType: text("employment_type").notNull(), // full-time, part-time, contract, internship
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  recruiters: json("recruiters").$type<string[]>().default([]).notNull(),
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
});
