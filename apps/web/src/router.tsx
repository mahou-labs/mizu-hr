import {
  createRouter as createTanStackRouter,
  Link,
} from "@tanstack/react-router";
import Loader from "./components/loader";
import "./index.css";
import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack";
import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack";
import { QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { authClient } from "./utils/auth-client";
import { orpc, queryClient } from "./utils/orpc";

export const createRouter = () => {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: { orpc, queryClient },
    defaultPendingComponent: () => <Loader />,
    defaultNotFoundComponent: () => <div>Not Found</div>,
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <AuthQueryProvider>
          <AuthUIProviderTanstack
            authClient={authClient}
            Link={({ href, ...props }) => <Link to={href} {...props} />}
            navigate={(href) => router.navigate({ href })}
            onSessionChange={() => router.invalidate()}
            persistClient={false}
            replace={(href) => router.navigate({ href, replace: true })}
          >
            {children}
          </AuthUIProviderTanstack>
        </AuthQueryProvider>
      </QueryClientProvider>
    ),
  });
  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
