import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  // const privateData = useQuery(orpc.privateData.queryOptions());
  return <p>Dashboard</p>;
  // const navigate = Route.useNavigate();
  // const { data: session, isPending } = authClient.useSession();

  // console.log(session?.session.activeOrganizationId);

  // useEffect(() => {
  //   if (!(session || isPending)) {
  //     navigate({
  //       to: "/login",
  //     });
  //   } else if (session && !session.session.activeOrganizationId) {
  //     navigate({
  //       to: "/onboarding",
  //     });
  //   }
  // }, [session, isPending, navigate]);

  // if (isPending) {
  //   return <div>Loading...</div>;
  // }

  // return (
  //   <div>
  //     <h1>Dashboard</h1>
  //     <p>Welcome {session?.user.name}</p>
  //     <p>privateData: {privateData.data?.message}</p>
  //     <p>org: {session?.session.activeOrganizationId}</p>
  //   </div>
  // );
}
