import { orpc } from "@/utils/orpc-client";
import { Button } from "@mizu-hr/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@mizu-hr/ui/empty";
import { AnchoredToastProvider, ToastProvider } from "@mizu-hr/ui/toast";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { scan } from "react-scan";
// import { hotkeysDevtoolsPlugin } from "@tanstack/react-hotkeys-devtools";
// import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { ThemeProvider } from "better-themes";
import { IconCircleXmarkOutline24 } from "nucleo-core-outline-24";

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
        title: "Mizu HR",
      },
    ],
  }),

  component: RootDocument,
  notFoundComponent: NotFoundPage,
  errorComponent: (e) => <pre>{JSON.stringify(e, null, 2)}</pre>,
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
            <IconCircleXmarkOutline24 />
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
    <html lang="en" suppressHydrationWarning>
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
            // formDevtoolsPlugin(),
            // hotkeysDevtoolsPlugin(),
          ]}
        />
        <Scripts />
        <Posthog />
      </body>
    </html>
  );
}
