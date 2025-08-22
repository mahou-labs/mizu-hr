import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";
import type { AppRouterClient } from "../../../api/src/routers/index";

const getIncomingHeaders = createIsomorphicFn()
  .client(() => ({}))
  .server(() => getHeaders());

const link = new RPCLink({
  url: `${import.meta.env.VITE_API_URL}/rpc`,
  fetch(url, options) {
    return fetch(url, {
      ...options,
      credentials: "include",
      headers: getIncomingHeaders() as HeadersInit,
    });
  },
});

const client: AppRouterClient = createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
