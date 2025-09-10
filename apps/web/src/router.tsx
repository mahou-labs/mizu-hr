import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import Loader from "./components/loader";
import "./index.css";
import { ORPCError } from "@orpc/client";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { routeTree } from "./routeTree.gen";
import { orpc } from "./utils/orpc";

export const createRouter = () => {
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
            await queryClient.refetchQueries(
              orpc.user.getSession.queryOptions()
            );
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

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: { orpc, queryClient },
    defaultPendingComponent: () => <Loader />,
    defaultNotFoundComponent: () => <div>Not Found</div>,
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
  return router;
};

declare module "@tanstack/react-router" {
  // biome-ignore lint/nursery/useConsistentTypeDefinitions: boilerplate
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
