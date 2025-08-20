import { API_URL } from "astro:env/client";
import { createAuthClientInstance } from "@mizu-hr/auth";

export const authClient = createAuthClientInstance({
  baseURL: API_URL,
});
