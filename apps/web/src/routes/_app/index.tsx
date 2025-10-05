import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { authClient } from "@/utils/auth-client";
import { orpc } from "@/utils/orpc-client";

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

      <div className="flex gap-2">
        <button
          className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={() => {
            if (!session?.activeOrganizationId) return;

            authClient.checkout({
              products: [
                "542964f0-f9e4-4863-aa5a-9c787317ae54",
                "68c79948-d014-4c70-9e83-baa37b76e7cb",
              ],
              referenceId: session.activeOrganizationId,
            });
          }}
          type="button"
        >
          Checkout - Starter
        </button>
        <button
          className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={() => {
            if (!session?.activeOrganizationId) return;

            authClient.checkout({
              products: [
                "899737cc-96c5-4d17-bc43-e3455434cc01",
                "f7e2348d-101d-4762-9a46-e5dd6b1adf27",
              ],
              // slug: "pro",
              referenceId: session.activeOrganizationId,
            });
          }}
          type="button"
        >
          Checkout - Growth
        </button>

        <button
          className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={async () => {
            if (!session?.activeOrganizationId) return;

            const { data } = await authClient.customer.portal({
              query: { referenceId: session.activeOrganizationId },
            });

            if (data?.url) window.open(data?.url, "_blank");
          }}
          type="button"
        >
          Portal
        </button>
      </div>
    </div>
  );
}
