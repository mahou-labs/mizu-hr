import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
// import { useWindowSize } from "@uidotdev/usehooks";
import { Sidebar } from "@/components/sidebar";
import { ScrollArea } from "@mizu-hr/ui/scroll-area";
import { orpc } from "@/utils/orpc-client";

export const Route = createFileRoute("/_app")({
  ssr: "data-only",
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/auth/signin" });
    }

    if (!context.session.activeOrganizationId) {
      throw redirect({ to: "/onboarding" });
    }
  },
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(orpc.organization.getOrgList.queryOptions());
  },
});

function RouteComponent() {
  // const { width } = useWindowSize();

  // if (width && width < 1024) {
  //   return <Outlet />;
  // }

  return (
    <div className="flex h-full overflow-hidden bg-sidebar py-2 pr-2">
      <Sidebar />
      {/* Native browser scroll implementation */}
      {/*<div className="h-full flex-1 overflow-y-auto overscroll-contain rounded-md border border-border bg-background p-4">
        <Outlet />
      </div> */}

      {/* Custom ScrollArea with themed scrollbar */}
      <ScrollArea
        orientation="vertical"
        className="h-full flex-1 rounded-md border border-border bg-background p-4"
      >
        <Outlet />
      </ScrollArea>
    </div>
  );
}
