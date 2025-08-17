import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  beforeLoad: async ({ context, location }) => {
    if (!context.session) {
      throw redirect({ to: "/auth/signin" });
    }

    if (
      !context.session.session.activeOrganizationId &&
      location.pathname !== "/onboarding"
    ) {
      throw redirect({ to: "/onboarding" });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
