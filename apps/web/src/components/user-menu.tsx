import { Avatar } from "@base-ui-components/react/avatar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useNavigate,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/utils/auth-client";
import { cn } from "@/utils/cn";
import { orpc } from "@/utils/orpc";
import { Menu } from "./ui/menu";

const WHITESPACE_REGEX = /\s+/;

function getAvatarInitials(name?: string | null): string {
  if (!name) return "";

  const parts = name.trim().split(WHITESPACE_REGEX);
  if (parts.length > 1) {
    return (parts[0][0] + parts.at(-1)?.[0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

type UserMenuProps = {
  isCollapsed?: boolean;
};

export function UserMenu({ isCollapsed = false }: UserMenuProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { session } = useRouteContext({ from: "/_app" });
  const {
    data: organizations,
    isPending,
    isError,
  } = useQuery(orpc.organization.getOrgList.queryOptions());

  if (isPending) {
    return <UserMenuSkeleton isCollapsed={isCollapsed} />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const signOut = async () => {
    await authClient.signOut();
    queryClient.invalidateQueries();
    router.invalidate();
  };

  const activeOrgId = session?.session.activeOrganizationId;
  const activeOrg = organizations.find((org) => org.id === activeOrgId);

  return (
    <Menu.Root>
      <Menu.Trigger
        className={cn(
          "focus-visible:-outline-offset-1 flex w-full cursor-pointer select-none items-center rounded-lg p-2 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring",
          isCollapsed ? "justify-center" : "gap-3"
        )}
      >
        <Avatar.Root className="inline-flex size-8 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-sidebar-accent align-middle font-medium text-sidebar-accent-foreground text-sm">
          <Avatar.Image
            className="size-full object-cover"
            height="32"
            src={session?.user.image ?? undefined}
            width="32"
          />
          <Avatar.Fallback className="flex size-full items-center justify-center text-sm">
            {getAvatarInitials(session?.user.name)}
          </Avatar.Fallback>
        </Avatar.Root>
        <div
          className={cn(
            "flex flex-col items-start transition-all duration-200",
            isCollapsed ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100"
          )}
        >
          <span className="truncate font-medium text-sidebar-foreground text-sm">
            {session?.user.name}
          </span>
          <span className="truncate text-sidebar-foreground/60 text-xs">
            {activeOrg?.name}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "size-4 transition-all duration-200",
            isCollapsed ? "w-0 opacity-0" : "ml-auto w-auto opacity-100"
          )}
        />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className="outline-none" sideOffset={8}>
          <Menu.Popup className="dark:-outline-offset-1 origin-[var(--transform-origin)] rounded-md bg-[canvas] py-1 text-gray-900 shadow-gray-200 shadow-lg outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[starting-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 dark:shadow-none dark:outline-gray-300">
            {/* <Menu.Arrow className="data-[side=right]:-rotate-90 data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=top]:bottom-[-8px] data-[side=right]:left-[-13px] data-[side=left]:rotate-90 data-[side=top]:rotate-180">
                <ArrowSvg />
              </Menu.Arrow> */}
            <Menu.Item onClick={() => navigate({ to: "/settings" })}>
              Settings
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item>Favorite</Menu.Item>
            <Menu.Item
              className="text-red-500 data-[highlighted]:before:bg-red-500"
              onClick={signOut}
            >
              Sign Out
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function UserMenuSkeleton({ isCollapsed = false }: { isCollapsed?: boolean }) {
  return (
    <div
      className={cn(
        "flex cursor-pointer select-none items-center rounded-lg p-2",
        isCollapsed ? "justify-center" : "gap-3"
      )}
    >
      {/* Avatar skeleton */}
      <Skeleton className="size-8 shrink-0 rounded-full" />

      {/* Text content skeleton */}
      <div
        className={cn(
          "flex flex-col gap-1 transition-all duration-200",
          isCollapsed ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100"
        )}
      >
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>

      {/* Chevron icon skeleton */}
      <Skeleton
        className={cn(
          "size-4 transition-all duration-200",
          isCollapsed ? "w-0 opacity-0" : "ml-auto w-auto opacity-100"
        )}
      />
    </div>
  );
}
