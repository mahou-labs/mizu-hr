import type { Context as HonoContext } from "hono";
import { getAuth } from "./auth";
import { getDb } from "./db";

export async function createContext(c: HonoContext) {
  const db = getDb();
  const auth = getAuth(db);

  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  return {
    session,
    db,
    auth,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
