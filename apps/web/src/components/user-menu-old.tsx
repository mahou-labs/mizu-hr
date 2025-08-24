import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouteContext, useRouter } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/utils/auth-client";
import { Button } from "./ui/button";

export default function UserMenuOld() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { session } = useRouteContext({ from: "/_app" });
  const user = session?.user;

  if (!user) {
    return (
      <Button asChild variant="outline">
        <Link to="/auth/signin">Sign In</Link>
      </Button>
    );
  }

  const handleLogout = async () => {
    await authClient.signOut();
    await queryClient.invalidateQueries();
    router.invalidate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{user.name}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{user.email}</DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            className="w-full"
            onClick={handleLogout}
            variant="destructive"
          >
            Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
