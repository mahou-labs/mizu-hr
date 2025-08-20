// import { polarClient } from "@polar-sh/better-auth";

import { createAuthClientInstance } from "@mizu-hr/auth";
import { useSuspenseQuery } from "@tanstack/react-query";
import { sessionQueryOptions } from "./session";

export const authClient = createAuthClientInstance({
  baseURL: import.meta.env.VITE_API_URL,
});

const useAuthentication = () => {
  const { data: session } = useSuspenseQuery(sessionQueryOptions);
  return { session, isAuthenticated: !!session };
};

export const useAuthenticatedUser = () => {
  const { session } = useAuthentication();

  // if (!session) {
  // throw new Error("User is not authenticated!");
  // }

  return session ?? { user: null, session: null };
};
