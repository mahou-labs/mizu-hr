import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "./env";

export const db = drizzle(
  new Pool({
    connectionString: env.DATABASE_URL,
    max: 5,
  }),
);

// TODO: use bun sql
// import { drizzle } from "drizzle-orm/bun-sql";
// import { env } from "./env";
// export const db = drizzle(env.DATABASE_URL);
