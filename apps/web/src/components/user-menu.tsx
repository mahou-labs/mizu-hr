import { Avatar } from "@base-ui-components/react/avatar";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouteContext, useRouter } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/utils/auth-client";
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

export function UserMenu() {
  return (
    <Suspense fallback={<OrgSwitcherSkeleton />}>
      <UserMenuComponent />
    </Suspense>
  );
}

function UserMenuComponent() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { session } = useRouteContext({ from: "/_app" });
  const { data: organizations } = useSuspenseQuery(
    orpc.organization.getOrgList.queryOptions()
  );

  const activeOrgId = session?.session.activeOrganizationId;

  if (!organizations) {
    return null;
  }

  const signOut = async () => {
    await authClient.signOut();
    queryClient.invalidateQueries();
    router.invalidate();
  };

  const activeOrg = organizations.find((org) => org.id === activeOrgId);

  return (
    <Menu.Root>
      <Menu.Trigger className="focus-visible:-outline-offset-1 flex cursor-pointer select-none items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-blue-800">
        <Avatar.Root className="inline-flex size-9 select-none items-center justify-center overflow-hidden rounded-full bg-gray-100 align-middle font-medium text-base text-black">
          <Avatar.Image
            className="size-full object-cover"
            height="48"
            src={session?.user.image ?? undefined}
            width="48"
          />
          <Avatar.Fallback className="flex size-full items-center justify-center text-base">
            {getAvatarInitials(session?.user.name)}
          </Avatar.Fallback>
        </Avatar.Root>
        <div className="flex flex-col items-start">
          <span className="font-medium text-sm">{session?.user.name}</span>
          <span className="text-gray-500 text-xs">{activeOrg?.name}</span>
        </div>
        <ChevronDown className="ml-auto size-4" />{" "}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className="outline-none" sideOffset={8}>
          <Menu.Popup className="dark:-outline-offset-1 origin-[var(--transform-origin)] rounded-md bg-[canvas] py-1 text-gray-900 shadow-gray-200 shadow-lg outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[starting-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 dark:shadow-none dark:outline-gray-300">
            {/* <Menu.Arrow className="data-[side=right]:-rotate-90 data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=top]:bottom-[-8px] data-[side=right]:left-[-13px] data-[side=left]:rotate-90 data-[side=top]:rotate-180">
                <ArrowSvg />
              </Menu.Arrow> */}
            <Menu.Item>Add to Library</Menu.Item>
            <Menu.Item>Add to Playlist</Menu.Item>
            <Menu.Separator />
            <Menu.Item>Play Next</Menu.Item>
            <Menu.Item>Play Last</Menu.Item>
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

function OrgSwitcherSkeleton() {
  return (
    <div className="flex cursor-pointer select-none items-center gap-2 rounded-md">
      {/* Avatar skeleton */}
      <Skeleton className="size-9 rounded-full" />

      {/* Text content skeleton */}
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>

      {/* Chevron icon skeleton */}
      <Skeleton className="ml-auto size-4" />
    </div>
  );
}
