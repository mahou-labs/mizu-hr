import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
// import { authClient } from "./auth-client";

const getServerSession = createServerFn({
  method: "GET",
}).handler(async () => {
  const request = getWebRequest();
  if (!request.headers) {
    return null;
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/get-session`, {
    headers: request.headers,
    credentials: "include",
  });

  if (!res.ok) return null;
  const session = await res.json().catch(() => null);
  return session ?? null;
});

export const sessionQueryOptions = {
  queryKey: ["session"] as const,
  queryFn: async () => {
    return await getServerSession();
  },
  // Tune this: if your session cookie/refresh policy is stable,
  // consider a short staleTime to opportunistically reuse on client navs.
  staleTime: 60 * 1000, // 1 minute (adjust to taste)
};

export function isUnauthorized(err: unknown) {
  const e = err as { code?: string; status?: number; message?: string };
  return e?.code === "UNAUTHORIZED" || e?.status === 401;
}

export function handleUnauth() {
  // Clear session in cache so UI updates immediately
  // queryClient.setQueryData(["session"], null);
  // Optionally prevent automatic refetch loops:
  // queryClient.removeQueries({ queryKey: ["session"], exact: true });

  // Don’t bounce if we’re already on an auth page
  // const path = router.latestLocation.pathname;
  // if (!path.startsWith("/auth")) {
  //   router.navigate({
  //     to: "/auth/signin",
  //     search: {
  //       redirectUrl: typeof location !== "undefined" ? location.href : "/",
  //     },
  //   });
  // }
}
