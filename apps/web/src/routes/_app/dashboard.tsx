import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { Page } from "@/components/page";
import { orpc } from "@/utils/orpc-client";

export const Route = createFileRoute("/_app/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useRouteContext({ from: "/_app" });
  const { data: privateData } = useQuery(orpc.privateData.queryOptions());

  return (
    <Page title="Dashboard" description="Overview of your workspace">
      <div className="grid gap-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-card-foreground text-lg">Welcome {user?.name}</p>
          <p className="mt-2 text-muted-foreground text-sm">privateData: {privateData?.message}</p>
        </div>
      </div>
    </Page>
  );
}
