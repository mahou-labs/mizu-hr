import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "../../packages/schemas/src",
  out: "./src/drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
    ssl: "verify-full",
  },
});
