import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouteContext, useRouter } from "@tanstack/react-router";
import { Building2, Check, ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { orpc } from "@/utils/orpc-client";
import { CreateOrgDialog } from "./create-org-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuSeparator,
  MenuTrigger,
} from "./ui/menu";
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

  const plan = subscription?.plan?.toLowerCase();
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
    <Menu>
      <MenuTrigger className="!px-0 flex cursor-pointer select-none items-center gap-2 rounded-lg">
        <Avatar className="rounded-md">
          <AvatarImage src={activeOrg?.logo ?? undefined} />
          <AvatarFallback className="rounded-md">
            {activeOrg?.name?.[0]}
          </AvatarFallback>
        </Avatar>

        <div
          className={cn(
            "flex min-w-0 flex-col items-start overflow-hidden transition-opacity duration-300",
            isCollapsed && "opacity-0"
          )}
        >
          <span className="w-full truncate font-semibold text-foreground text-sm">
            {activeOrg?.name}
          </span>
          <span className="w-full truncate text-start text-foreground-muted text-xs">
            {subscriptionLabel}
          </span>
        </div>

        <ChevronDown className="ml-auto size-4 text-foreground-muted" />
      </MenuTrigger>

      <MenuPortal>
        <MenuPopup>
          {/* <Menu.Arrow /> */}
          {orgs?.map((org) => (
            <MenuItem key={org.id} onClick={() => handleOrgChange(org.id)}>
              <Building2 className="size-4" />
              <span className="flex-1">{org.name}</span>
              {org.id === session?.activeOrganizationId && (
                <Check className="size-4" />
              )}
            </MenuItem>
          ))}

          <MenuSeparator />

          <MenuItem onClick={() => setIsCreateOrgDialogOpen(true)}>
            <Plus className="size-4" />
            <span>Create Organization</span>
          </MenuItem>
        </MenuPopup>
      </MenuPortal>

      <CreateOrgDialog
        allowClosing
        isOpen={isCreateOrgDialogOpen}
        onOpenChange={setIsCreateOrgDialogOpen}
        onSuccess={() => {
          setIsCreateOrgDialogOpen(false);
        }}
      />
    </Menu>
  );
}
