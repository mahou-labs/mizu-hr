import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export function getDb() {
  const pool = new Pool({
    connectionString: env.HYPERDRIVE.connectionString,
    max: 5,
  });

  return drizzle(pool);
}
// export const getDb = () => drizzle(env.DATABASE_URL || "");
