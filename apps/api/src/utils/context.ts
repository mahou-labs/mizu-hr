import type { ResponseHeadersPluginContext } from "@orpc/server/plugins";
import type { Context as HonoContext } from "hono";
import { auth } from "./auth";

export async function createContext(c: HonoContext) {
  const authSession = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  return {
    headers: c.req.raw.headers,
    session: authSession?.session,
    user: authSession?.user,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>> & ResponseHeadersPluginContext;
