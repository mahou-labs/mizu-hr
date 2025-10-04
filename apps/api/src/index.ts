import { RPCHandler } from "@orpc/server/fetch";
import { ResponseHeadersPlugin } from "@orpc/server/plugins";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { appRouter } from "./routers/index";
import { auth } from "./utils/auth";
import { createContext } from "./utils/context";
import { env } from "./utils/env";

const app = new Hono();
const handler = new RPCHandler(appRouter, {
  plugins: [new ResponseHeadersPlugin()],
});

app.use(logger());
app.use(
  "/*",
  cors({
    origin: [env.APP_URL, env.SITE_URL],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/healthcheck", (c) => {
  return c.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw));

app.use("/rpc/*", async (c, next) => {
  const context = await createContext(c);
  const { matched, response } = await handler.handle(c.req.raw, {
    prefix: "/rpc",
    context,
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }

  await next();
});

export default {
  port: 3000,
  fetch: app.fetch,
};
