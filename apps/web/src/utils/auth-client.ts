import { polarClient } from "@polar-sh/better-auth";
import { useSuspenseQuery } from "@tanstack/react-query";
import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { sessionQueryOptions } from "./session";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  basePath: "/auth",
  plugins: [organizationClient()],
});

const useAuthentication = () => {
  const { data: session } = useSuspenseQuery(sessionQueryOptions);
  return { session, isAuthenticated: !!session };
};

export const useAuthenticatedUser = () => {
  const { session } = useAuthentication();

  if (!session) {
    throw new Error("User is not authenticated!");
  }

  return session;
};
