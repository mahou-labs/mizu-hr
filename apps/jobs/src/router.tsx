import { createRouter } from "@tanstack/react-router";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";
import { orpc } from "./utils/orpc-client";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 1000 * 60 * 5,
      },
    },
  });

  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: () => <div>Not Found</div>,
    context: { orpc, queryClient },
    defaultPreload: "intent",
    Wrap: ({ children }) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    },
  });

  setupRouterSsrQueryIntegration({ router, queryClient });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
