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
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session?.user.name}</p>
      <p>privateData: {privateData.data?.message}</p>
    </div>
  );
}
