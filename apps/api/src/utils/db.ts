import { drizzle } from "drizzle-orm/bun-sql";
import { sql } from "drizzle-orm";
import { env } from "./env";

export const db = drizzle(env.DATABASE_URL);

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export const getTxid = async (tx: Transaction): Promise<number> => {
  const [row] = await tx.execute<{ txid: number }>(
    sql`SELECT pg_current_xact_id()::xid::text::int as txid`,
  );

  if (!row) {
    throw new Error("Failed to retrieve transaction ID");
  }

  return row.txid;
};
