import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouteContext, useRouter } from "@tanstack/react-router";
import { Building2, Check, ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { orpc } from "@/utils/orpc";
import { CreateOrgDialog } from "./create-org-dialog";
import { Avatar } from "./ui/avatar";
import { Menu } from "./ui/menu";
import { Skeleton } from "./ui/skeleton";

type OrgMenuProps = {
  isCollapsed?: boolean;
};

export function OrgMenu({ isCollapsed = false }: OrgMenuProps) {
  const [isCreateOrgDialogOpen, setIsCreateOrgDialogOpen] = useState(false);
  const { session } = useRouteContext({ from: "/_app" });
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: orgs } = useQuery(orpc.organization.getOrgList.queryOptions());
  const { mutateAsync: setActiveOrganization } = useMutation(
    orpc.organization.setActive.mutationOptions({
      onSuccess: async () => {
        await queryClient.fetchQuery(orpc.user.getSession.queryOptions());
        await router.invalidate();
      },
    })
  );

  const activeOrg = orgs?.find(
    (org) => org.id === session?.activeOrganizationId
  );

  const { data: subscription, isPending } = useQuery(
    orpc.organization.getSubscription.queryOptions()
  );

  const handleOrgChange = async (id: string) => {
    await setActiveOrganization({ organizationId: id });
  };

  const plan = subscription?.plan.toLowerCase();
  const subscriptionLabel = plan?.includes("starter")
    ? "Starter Plan"
    : plan?.includes("growth")
      ? "Growth Plan"
      : "Free Trial";

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="size-10 rounded-md" />
        <div
          className={cn(
            "flex flex-col gap-1.5 transition-opacity duration-300",
            isCollapsed && "opacity-0"
          )}
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="ml-auto size-4" />
      </div>
    );
  }

  return (
    <Menu.Root>
      <Menu.Trigger className="flex cursor-pointer select-none items-center gap-2">
        <Avatar.Root className="rounded-md outline outline-border">
          <Avatar.Image src={activeOrg?.logo ?? undefined} />
          <Avatar.Fallback>{activeOrg?.name?.[0]}</Avatar.Fallback>
        </Avatar.Root>

        <div
          className={cn(
            "flex flex-col items-start transition-opacity duration-300",
            isCollapsed && "opacity-0"
          )}
        >
          <span className="truncate font-semibold text-foreground text-sm">
            {activeOrg?.name}
          </span>
          <span className="truncate text-foreground/60 text-xs">
            {subscriptionLabel}
          </span>
        </div>

        <ChevronDown className="ml-auto size-4" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            {/* <Menu.Arrow /> */}
            {orgs?.map((org) => (
              <Menu.Item key={org.id} onClick={() => handleOrgChange(org.id)}>
                <Building2 className="size-4" />
                <span className="flex-1">{org.name}</span>
                {org.id === session?.activeOrganizationId && (
                  <Check className="size-4" />
                )}
              </Menu.Item>
            ))}

            <Menu.Separator className="mx-1 my-1 h-px bg-sidebar-border" />

            <Menu.Item onClick={() => setIsCreateOrgDialogOpen(true)}>
              <Plus className="size-4" />
              <span>Create Organization</span>
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>

      <CreateOrgDialog
        allowClosing
        isOpen={isCreateOrgDialogOpen}
        onOpenChange={setIsCreateOrgDialogOpen}
        onSuccess={() => {
          setIsCreateOrgDialogOpen(false);
        }}
      />
    </Menu.Root>
  );
}
