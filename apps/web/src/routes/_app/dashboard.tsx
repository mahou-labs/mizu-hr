import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { orpc } from "@/utils/orpc-client";

export const Route = createFileRoute("/_app/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useRouteContext({ from: "/_app" });
  const { data: privateData } = useQuery(orpc.privateData.queryOptions());

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-6 font-semibold text-2xl text-foreground">Dashboard</h1>
      <div className="grid gap-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-card-foreground text-lg">Welcome {user?.name}</p>
          <p className="mt-2 text-muted-foreground text-sm">privateData: {privateData?.message}</p>
        </div>
      </div>
    </div>
  );
}
