/** biome-ignore-all lint/correctness/noUndeclaredVariables: biome shenanigans */
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  APP_URL: z.string().min(1, "APP_URL is required"),
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  BETTER_AUTH_URL: z.string().min(1, "BETTER_AUTH_URL is required"),
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, "STRIPE_WEBHOOK_SECRET is required"),
  NODE_ENV: z.enum(["development", "production"]).default("production"),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
});

export type Environment = z.infer<typeof envSchema>;

export const env: Environment = envSchema.parse({
  DATABASE_URL: Bun.env.DATABASE_URL,
  APP_URL: Bun.env.APP_URL,
  BETTER_AUTH_SECRET: Bun.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: Bun.env.BETTER_AUTH_URL,
  STRIPE_SECRET_KEY: Bun.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: Bun.env.STRIPE_WEBHOOK_SECRET,
  NODE_ENV: Bun.env.NODE_ENV,
  RESEND_API_KEY: Bun.env.RESEND_API_KEY,
});
