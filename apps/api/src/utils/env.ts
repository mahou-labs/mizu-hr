import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),
  APP_URL: z.string().min(1, "APP_URL is required"),
  SITE_URL: z.string().min(1, "SITE_URL is required"),
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  BETTER_AUTH_URL: z.string().min(1, "BETTER_AUTH_URL is required"),
  POLAR_ACCESS_TOKEN: z.string().min(1, "POLAR_ACCESS_TOKEN is required"),
  POLAR_WEBHOOK_SECRET: z.string().min(1, "POLAR_WEBHOOK_SECRET is required"),
  NODE_ENV: z.enum(["development", "production"]).default("production"),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  ELECTRIC_SQL_URL: z.url(),
});

export type Environment = z.infer<typeof envSchema>;

export const env: Environment = envSchema.parse({
  DATABASE_URL: Bun.env.DATABASE_URL,
  REDIS_URL: Bun.env.REDIS_URL,
  APP_URL: Bun.env.APP_URL,
  SITE_URL: Bun.env.SITE_URL,
  BETTER_AUTH_SECRET: Bun.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: Bun.env.BETTER_AUTH_URL,
  POLAR_ACCESS_TOKEN: Bun.env.POLAR_ACCESS_TOKEN,
  POLAR_WEBHOOK_SECRET: Bun.env.POLAR_WEBHOOK_SECRET,
  NODE_ENV: Bun.env.NODE_ENV,
  RESEND_API_KEY: Bun.env.RESEND_API_KEY,
  ELECTRIC_SQL_URL: Bun.env.ELECTRIC_SQL_URL,
});
