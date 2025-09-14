import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { authClient } from "@/utils/auth-client";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app/")({
  component: HomeComponent,
});

const TITLE_TEXT = `
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 `;

function HomeComponent() {
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());
  const { session } = useRouteContext({ from: "/_app" });

  const getStatusText = () => {
    if (healthCheck.isLoading) {
      return "Checking...";
    }
    return healthCheck.data ? "Connected" : "Disconnected";
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <pre className="overflow-x-auto font-mono text-foreground text-sm">
        {TITLE_TEXT}
      </pre>
      <div className="grid gap-6">
        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-2 font-medium text-card-foreground">API Status</h2>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-chart-2" : "bg-destructive"}`}
            />
            <span className="text-muted-foreground text-sm">
              {getStatusText()}
            </span>
          </div>
        </section>
      </div>

      <button
        className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white"
        onClick={() =>
          authClient.subscription.upgrade({
            plan: "starter",
            successUrl: "/dashboard",
            cancelUrl: "/",
            annual: false, // Optional: upgrade to an annual plan
            referenceId: session?.activeOrganizationId, // Optional: defaults to the current logged in user ID
          })
        }
        type="button"
      >
        Checkout
      </button>

      {/*   <button
        className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white"
        onClick={() => authClient.customer.portal()}
        type="button"
      >
        Portal
      </button> */}
    </div>
  );
}
