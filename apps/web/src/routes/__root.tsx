/** biome-ignore-all assist/source/organizeImports: react-scan */
import { scan } from "react-scan";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { orpc } from "@/utils/orpc";
import appCss from "../index.css?url";

const Posthog = () => {
  useEffect(() => {
    if (import.meta.env.PROD) {
      import("posthog-js").then(({ default: posthog }) => {
        posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
          api_host: import.meta.env.VITE_POSTHOG_HOST,
        });
      });
    }
  }, []);

  return null;
};

type RouterAppContext = {
  orpc: typeof orpc;
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "My App",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  component: RootDocument,
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(
      orpc.user.getSession.queryOptions()
    );

    return { session };
  },
});

function RootDocument() {
  useEffect(() => {
    scan({
      enabled: import.meta.env.DEV,
    });
  }, []);

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: dark mode script
          dangerouslySetInnerHTML={{
            __html: `
            let theme = localStorage.getItem('theme')
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            if((theme === 'system' || theme === null) && prefersDark) {
              theme = 'dark'
            }
            document.documentElement.classList.add(theme === 'dark' ? 'dark' : 'light');
          `,
          }}
        />
        <div className="h-svh bg-sidebar">
          <Outlet />
        </div>

        <Toaster richColors />
        <TanStackRouterDevtools position="bottom-left" />
        <ReactQueryDevtools buttonPosition="bottom-right" position="bottom" />
        <Scripts />
        <Posthog />
      </body>
    </html>
  );
}
