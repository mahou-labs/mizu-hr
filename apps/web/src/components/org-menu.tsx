import { useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { Building2, Check, ChevronDown, Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import { orpc } from "@/utils/orpc";
import { Avatar } from "./ui/avatar";
import { Menu } from "./ui/menu";

type OrgMenuProps = {
  isCollapsed?: boolean;
};

export function OrgMenu({ isCollapsed = false }: OrgMenuProps) {
  const { session } = useRouteContext({ from: "/_app" });
  const { data: orgs } = useQuery(orpc.organization.getOrgList.queryOptions());

  const activeOrg = orgs?.find(
    (org) => org.id === session?.activeOrganizationId
  );

  const handleOrgChange = (id: string) => {
    // TODO: Implement organization switching logic
    console.log("Switching to organization:", id);
  };

  const handleCreateOrg = () => {
    // TODO: Implement create organization logic
    console.log("Creating new organization");
  };

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
          <span className="truncate text-foreground/60 text-xs">Pro plan</span>
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

            <Menu.Item onClick={handleCreateOrg}>
              <Plus className="size-4" />
              <span>Create Organization</span>
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
