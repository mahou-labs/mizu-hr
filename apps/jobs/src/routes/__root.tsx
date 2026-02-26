import { orpc } from "@/utils/orpc-client";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import PostHogProvider from "@/contexts/posthog-context";

type RouterAppContext = {
  orpc: typeof orpc;
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Job Board | Mizu HR" },
      { name: "description", content: "Browse open positions and apply today." },
    ],
  }),
  component: RootDocument,
  notFoundComponent: NotFoundPage,
});

function NotFoundPage() {
  return (
    <div className="flex h-svh items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <p className="mt-2 text-muted-foreground">Page not found</p>
      </div>
    </div>
  );
}

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-svh bg-background text-foreground antialiased">
        <PostHogProvider>
          <Outlet />
        </PostHogProvider>

        <TanStackDevtools
          plugins={[
            { name: "TanStack Query", render: <ReactQueryDevtoolsPanel /> },
            { name: "TanStack Router", render: <TanStackRouterDevtoolsPanel /> },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
