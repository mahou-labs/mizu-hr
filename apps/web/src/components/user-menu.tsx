import { Avatar } from "@base-ui-components/react/avatar";
import { useQueryClient } from "@tanstack/react-query";
import {
  useNavigate,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/utils/auth-client";
import { cn } from "@/utils/cn";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuSeparator,
  MenuTrigger,
} from "./ui/menu";

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
  const { user } = useRouteContext({ from: "/_app" });

  const signOut = async () => {
    await authClient.signOut();
    queryClient.clear();
    router.invalidate();
  };

  return (
    <Menu>
      <MenuTrigger className="flex w-full cursor-pointer select-none items-center gap-2 rounded-lg p-2 transition-colors hover:bg-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar.Root className="inline-flex size-8 shrink-0 select-none items-center justify-center overflow-hidden rounded-full border border-border bg-muted align-middle font-medium text-muted-foreground text-sm">
          <Avatar.Image
            alt={user?.name ?? ""}
            className="size-full object-cover"
            height="32"
            src={user?.image ?? undefined}
            width="32"
          />
          <Avatar.Fallback className="flex size-full items-center justify-center bg-muted text-muted-foreground text-sm">
            {getAvatarInitials(user?.name)}
          </Avatar.Fallback>
        </Avatar.Root>
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col items-start transition-opacity duration-300",
            isCollapsed && "opacity-0"
          )}
        >
          <span className="w-full truncate text-start font-medium text-foreground text-sm">
            {user?.name}
          </span>
          <span className="w-full truncate text-foreground-muted text-xs">
            {user?.email} lorem ipsum dolor sit amet consectetur adipisicing
            elit. Quisquam, quos.
          </span>
        </div>
        <ChevronDown
          className={cn(
            "ml-auto size-4 text-foreground-muted transition-opacity duration-300",
            isCollapsed && "opacity-0"
          )}
        />
      </MenuTrigger>
      <MenuPortal>
        <MenuPopup>
          <MenuItem onClick={() => navigate({ to: "/settings" })}>
            Settings
          </MenuItem>
          <MenuSeparator />
          <MenuItem>Favorite</MenuItem>
          <MenuItem onClick={signOut}>Sign Out</MenuItem>
        </MenuPopup>
      </MenuPortal>
    </Menu>
  );
}
function UserMenuSkeleton({ isCollapsed = false }: { isCollapsed?: boolean }) {
  return (
    <div className="flex cursor-pointer select-none items-center gap-2 rounded-lg bg-light p-2">
      {/* Avatar skeleton */}
      <Skeleton className="size-8 shrink-0 rounded-full" />

      {/* Text content skeleton */}
      <div
        className={cn(
          "flex flex-1 flex-col gap-1 transition-opacity duration-300",
          isCollapsed && "opacity-0"
        )}
      >
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>

      {/* Chevron icon skeleton */}
      <Skeleton
        className={cn(
          "ml-auto size-4 transition-opacity duration-300",
          isCollapsed && "opacity-0"
        )}
      />
    </div>
  );
}
