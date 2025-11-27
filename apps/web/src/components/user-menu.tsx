import { useQueryClient } from "@tanstack/react-query";
import {
  useNavigate,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { authClient } from "@/utils/auth-client";
import { cn } from "@/utils/cn";
import { getInitials } from "@/utils/initials";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuSeparator,
  MenuTrigger,
} from "./ui/menu";

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
        <Avatar>
          <AvatarImage src={user?.image ?? undefined} />
          <AvatarFallback className="rounded-md">
            {getInitials(user?.name)}
          </AvatarFallback>
        </Avatar>

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
            {user?.email}
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
