import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { authClient } from "./auth-client";

const getServerSession = createServerFn({
  method: "GET",
}).handler(async () => {
  const request = getWebRequest();

  console.log(`Debug headers: ${request.headers}`);

  const cookie = request.headers.get("cookie");

  if (!request.headers) {
    return null;
  }

  const { data: session } = await authClient.getSession({
    fetchOptions: { headers: { cookie }, redirect: "manual" },
  });

  return session ?? null;
});

export const sessionQueryOptions = {
  queryKey: ["session"] as const,
  queryFn: async () => {
    return await getServerSession();
  },
  staleTime: 60 * 1000, // 1 minute
};
