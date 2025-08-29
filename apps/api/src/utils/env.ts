/** biome-ignore-all lint/correctness/noUndeclaredVariables: biome shenanigans */
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CORS_ORIGIN: z.string().min(1, "CORS_ORIGIN is required"),
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  BETTER_AUTH_URL: z.string().min(1, "BETTER_AUTH_URL is required"),
  SUCCESS_URL: z.string().min(1, "SUCCESS_URL is required"),
  POLAR_ACCESS_TOKEN: z.string().min(1, "POLAR_ACCESS_TOKEN is required"),
  POLAR_WEBHOOK_SECRET: z.string().optional(),
});

export type Environment = z.infer<typeof envSchema>;

export const env: Environment = envSchema.parse({
  DATABASE_URL: Bun.env.DATABASE_URL,
  CORS_ORIGIN: Bun.env.CORS_ORIGIN,
  BETTER_AUTH_SECRET: Bun.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: Bun.env.BETTER_AUTH_URL,
  SUCCESS_URL: Bun.env.SUCCESS_URL,
  POLAR_ACCESS_TOKEN: Bun.env.POLAR_ACCESS_TOKEN,
  POLAR_WEBHOOK_SECRET: Bun.env.POLAR_WEBHOOK_SECRET,
});
