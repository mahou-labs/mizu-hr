import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { Building2, ChevronDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/utils/auth-client";
import { cn } from "@/utils/cn";
import { orpc } from "@/utils/orpc";

export function OrganizationDropdown() {
  const { session } = useRouteContext({ from: "__root__" });
  const queryClient = useQueryClient();

  // @ts-expect-error - TODO: fix on orpc server
  const activeOrgId = session?.session.activeOrganizationId;

  const { data: organizations, isLoading: orgsLoading } = useQuery(
    orpc.organization.getOrgList.queryOptions()
  );

  const invalidateQuery = () => {
    queryClient.invalidateQueries({
      queryKey: orpc.organization.getOrgList.queryKey(),
    });
  };

  if (orgsLoading) {
    return <div>Loading...</div>;
  }

  if (!organizations) {
    return null;
  }

  const activeOrg = organizations.find((org) => org.id === activeOrgId);

  return (
    <div>
      <pre>{JSON.stringify(organizations, null, 2)}</pre>
      <button
        className="cursor-pointer rounded-md border bg-gray-900 p-1"
        onClick={invalidateQuery}
        type="button"
      >
        Invalidate
      </button>
    </div>
  );

  //   const organizationName = organization?.name;

  //   if (isCollapsed) {
  //     return (
  //       <div className="border-sidebar-border border-b px-3 py-4">
  //         <DropdownMenu>
  //           <DropdownMenuTrigger
  //             className={cn(
  //               "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
  //               "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  //               "text-sidebar-foreground"
  //             )}
  //             title={organizationName}
  //           >
  //             <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
  //               <Building2 className="h-4 w-4" />
  //             </div>
  //           </DropdownMenuTrigger>

  //           <DropdownMenuContent
  //             className="border-sidebar-border bg-sidebar"
  //             side="right"
  //           >
  //             <DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
  //               <Building2 className="mr-2 h-4 w-4" />
  //               Switch Organization
  //             </DropdownMenuItem>

  //             <DropdownMenuSeparator className="bg-sidebar-border" />

  //             <DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
  //               <Plus className="mr-2 h-4 w-4" />
  //               Create Organization
  //             </DropdownMenuItem>
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       </div>
  //     );
  //   }

  //   return (
  //     <div className="border-sidebar-border border-b px-3 py-4">
  //       <DropdownMenu>
  //         <DropdownMenuTrigger
  //           className={cn(
  //             "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors",
  //             "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  //             "text-sidebar-foreground"
  //           )}
  //         >
  //           <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
  //             <Building2 className="h-4 w-4" />
  //           </div>
  //           <div className="flex-1 truncate">
  //             <div className="truncate font-medium">{organizationName}</div>
  //             <div className="text-sidebar-foreground/70 text-xs">
  //               Organization
  //             </div>
  //           </div>
  //           <ChevronDown className="h-4 w-4 shrink-0" />
  //         </DropdownMenuTrigger>

  //         <DropdownMenuContent
  //           className="border-sidebar-border bg-sidebar"
  //           side="bottom"
  //         >
  //           <DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
  //             <Building2 className="mr-2 h-4 w-4" />
  //             Switch Organization
  //           </DropdownMenuItem>

  //           <DropdownMenuSeparator className="bg-sidebar-border" />

  //           <DropdownMenuItem className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
  //             <Plus className="mr-2 h-4 w-4" />
  //             Create Organization
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     </div>
  //   );
}

function OrgSwitcherSkeleton() {
  return (
    <div className="org-switcher-skeleton">
      <div className="skeleton-item" />
      <div className="skeleton-item" />
      <div className="skeleton-item" />
    </div>
  );
}
