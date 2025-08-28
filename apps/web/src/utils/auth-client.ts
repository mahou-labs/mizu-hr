// import { polarClient } from "@polar-sh/better-auth";

import { createAuthClientInstance } from "@mizu-hr/auth";

export const authClient = createAuthClientInstance({
  baseURL: import.meta.env.VITE_API_URL,
});
