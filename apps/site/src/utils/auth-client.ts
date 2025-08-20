import { createAuthClientInstance } from "@mizu-hr/auth";

export const authClient = createAuthClientInstance({
  baseURL: "http://localhost:3000",
});
