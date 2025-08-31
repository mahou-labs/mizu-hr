import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = useRouteContext({ from: "__root__" });
  const privateData = useQuery(orpc.privateData.queryOptions());

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">Dashboard</h1>
      <div className="grid gap-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-lg text-card-foreground">Welcome {session?.user.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">privateData: {privateData.data?.message}</p>
        </div>
      </div>
    </div>
  );
}
