// @ts-check

import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      API_URL: envField.string({ context: "client", access: "public" }),
    },
  },
  adapter: cloudflare(),
  integrations: [react()],
});
