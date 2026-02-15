import { RPCHandler } from "@orpc/server/fetch";
import { ResponseHeadersPlugin } from "@orpc/server/plugins";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { rateLimiter } from "hono-rate-limiter";
import { appRouter } from "./routers/index";
import { auth } from "./utils/auth";
import { createContext } from "./utils/context";
import { isTableAllowed, proxyShapeRequest } from "./utils/electric";
import { env } from "./utils/env";

const app = new Hono();
const handler = new RPCHandler(appRouter, {
  plugins: [new ResponseHeadersPlugin()],
});

app.use(requestId());

app.use(
  "/*",
  cors({
    origin: [env.APP_URL, env.SITE_URL],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "User-Agent"],
    credentials: true,
  }),
);
app.use(logger());

app.use(
  rateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    keyGenerator: async (c) => {
      const authSession = await auth.api.getSession({ headers: c.req.raw.headers });
      return authSession?.user.id ?? c.req.header("X-Forwarded-For") ?? "";
    },
    // store: new RedisStore({ client: redisClient }),
  }),
);

app.onError((err, c) => {
  const rid = c.get("requestId"); // if using requestId()

  if (err instanceof HTTPException) {
    // Expected HTTP errors
    console.warn({ requestId: rid, status: err.status, message: err.message });
    return err.getResponse();
  }

  console.error({
    requestId: rid,
    name: err?.name,
    message: err?.message,
    stack: err?.stack,
  });

  return c.json({ error: "Internal Server Error", requestId: rid }, 500);
});

app.get("/healthcheck", (c) => {
  return c.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/auth/*", (c) => auth.handler(c.req.raw));

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

app.get("/electric/:table", async (c) => {
  const context = await createContext(c);
  if (!context.session?.activeOrganizationId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const table = c.req.param("table");
  if (!isTableAllowed(table)) {
    return c.json({ error: "Invalid table" }, 400);
  }

  return proxyShapeRequest({
    table,
    orgId: context.session.activeOrganizationId,
    clientUrl: new URL(c.req.url),
    ifNoneMatch: c.req.header("if-none-match"),
  });
});

export default {
  port: 3000,
  fetch: app.fetch,
};
