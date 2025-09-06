import { ScrollArea } from "@base-ui-components/react/scroll-area";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useWindowSize } from "@uidotdev/usehooks";
import { Sidebar } from "@/components/sidebar";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app")({
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
    context.queryClient.ensureQueryData(
      orpc.organization.getOrgList.queryOptions()
    );
  },
});

function RouteComponent() {
  const { width } = useWindowSize();

  if (width && width < 1024) {
    return <Outlet />;
  }

  return (
    <div className="flex h-full gap-2 overflow-hidden py-2 pr-2">
      <Sidebar />
      <ScrollArea.Root className="h-full flex-1">
        <ScrollArea.Viewport className="h-full overscroll-contain rounded-md bg-background p-2 pt-4">
          <Outlet />
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className="m-2 flex w-1 justify-center rounded bg-border opacity-0 transition-opacity delay-300 data-[hovering]:opacity-100 data-[scrolling]:opacity-100 data-[hovering]:delay-0 data-[scrolling]:delay-0 data-[hovering]:duration-75 data-[scrolling]:duration-75">
          <ScrollArea.Thumb className="w-full rounded bg-muted-foreground" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
