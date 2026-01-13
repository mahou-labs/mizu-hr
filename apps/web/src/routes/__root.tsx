import { scan } from "react-scan";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { orpc } from "@/utils/orpc-client";
import appCss from "../index.css?url";
import { AnchoredToastProvider, ToastProvider } from "@mizu-hr/ui/toast";
// import { ThemeProvider } from "@/utils/theme-provider";
import { ThemeProvider } from "better-themes";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@mizu-hr/ui/empty";
import { Button } from "@mizu-hr/ui/button";
import { CircleX } from "lucide-react";

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
  // ssr: "data-only",
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
  notFoundComponent: NotFoundPage,
  beforeLoad: async ({ context }) => {
    const authSession = await context.queryClient.ensureQueryData(
      orpc.user.getSession.queryOptions(),
    );

    return { session: authSession?.session, user: authSession?.user };
  },
});

function NotFoundPage() {
  return (
    <div className="flex h-svh items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleX />
          </EmptyMedia>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription>
            The page you're looking for doesn't exist or has been moved.
          </EmptyDescription>
        </EmptyHeader>
        <Button render={<Link to="/" />}>Go to Dashboard</Button>
      </Empty>
    </div>
  );
}

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
      <body className="h-svh">
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <ToastProvider>
            <AnchoredToastProvider>
              <Outlet />
            </AnchoredToastProvider>
          </ToastProvider>
        </ThemeProvider>

        <TanStackDevtools
          plugins={[
            {
              name: "TanStack Query",
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: "TanStack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
        <Posthog />
      </body>
    </html>
  );
}
