import { env } from "cloudflare:workers";

const parseAllowedOrigins = () => {
  return env.CORS_ORIGIN.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

export const ALLOWED_ORIGINS = new Set(parseAllowedOrigins());
