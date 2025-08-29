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
      orpc.user.getUserSession.queryOptions()
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
    <html className="dark" lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="h-svh">
          <Outlet />
        </div>

        <Toaster richColors />
        <TanStackRouterDevtools position="bottom-left" />
        <ReactQueryDevtools buttonPosition="bottom-right" position="bottom" />
        <Scripts />
      </body>
    </html>
  );
}
