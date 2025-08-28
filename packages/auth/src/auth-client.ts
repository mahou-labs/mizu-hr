import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

type AuthConfig = {
  baseURL: string;
};

export const createAuthClientInstance = (config: AuthConfig) => {
  return createAuthClient({
    baseURL: config.baseURL,
    basePath: "/auth",
    plugins: [organizationClient()],
  });
};
