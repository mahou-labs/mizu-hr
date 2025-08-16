import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { authClient } from "./auth-client";

const getServerSession = createServerFn({
  method: "GET",
}).handler(async () => {
  const request = getWebRequest();
  if (!request.headers) {
    return null;
  }

  const { data: session } = await authClient.getSession({
    fetchOptions: { headers: request.headers },
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
