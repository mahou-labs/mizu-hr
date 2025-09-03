/// <reference types="vite/client" />
/** biome-ignore-all lint/complexity/noBannedTypes: vite-env */
/** biome-ignore-all lint/nursery/useConsistentTypeDefinitions: vite-env */

type ViteTypeOptions = {};

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_POSTHOG_KEY: string;
  readonly VITE_POSTHOG_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
