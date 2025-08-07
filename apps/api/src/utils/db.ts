import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/node-postgres";

export const getDb = () => drizzle(env.DATABASE_URL || "");
