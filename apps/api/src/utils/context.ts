import type { Context as HonoContext } from "hono";
import { auth } from "./auth";

export async function createContext(c: HonoContext) {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  return {
    headers: c.req.raw.headers,
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
