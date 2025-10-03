import { createRouter } from "@tanstack/react-router";
import Loader from "./components/loader";
import "./index.css";
import { ORPCError } from "@orpc/client";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { toast } from "sonner";
import { routeTree } from "./routeTree.gen";
import { orpc } from "./utils/orpc";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
    queryCache: new QueryCache({
      onError: async (error, query) => {
        if (error instanceof ORPCError) {
          if ("invalidSession" in error.data && error.data.invalidSession) {
            const currentLocation = router.state.location.pathname;
            await queryClient.fetchQuery(orpc.user.getSession.queryOptions());
            await router.navigate({
              to: "/auth/signin",
              search: { redirect: currentLocation },
            });
          }
        } else {
          toast.error(`Error: ${error.message}`, {
            action: {
              label: "retry",
              onClick: () => {
                query.reset();
                query.fetch();
                // queryClient.resetQueries({ type: "all" });
                // router.invalidate();
              },
            },
          });
        }
      },
    }),
  });

  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: () => <Loader />,
    defaultNotFoundComponent: () => <div>Not Found</div>,
    context: { orpc, queryClient },
    defaultPreload: "intent",
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <QueryClientProvider client={queryClient}>
          {props.children}
        </QueryClientProvider>
      );
    },
  });

  setupRouterSsrQueryIntegration({ router, queryClient });

  return router;
};

declare module "@tanstack/react-router" {
  // biome-ignore lint/nursery/useConsistentTypeDefinitions: boilerplate
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
