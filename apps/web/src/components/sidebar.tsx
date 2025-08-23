import type { ToOptions } from "@tanstack/react-router";
import { Home, LayoutDashboard, ListTodo } from "lucide-react";
import { OrganizationDropdown } from "./organization-dropdown";
import UserMenu from "./user-menu";

export function Sidebar() {
  return (
    <div className="flex h-full w-56 flex-col gap-2 px-2">
      <SidebarItem href="/" icon={Home} label="Home" />
      <SidebarItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
      <SidebarItem href="/todos" icon={ListTodo} label="Todos" />
      <OrganizationDropdown />
      <UserMenu />
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

type SidebarItemProps = {
  icon: LucideIcon;
  label: string;
  href: ToOptions["to"];
  isActive?: boolean;
  badge?: string | number;
  isCollapsed?: boolean;
  onClick?: () => void;
};

function SidebarItem({
  icon: Icon,
  label,
  href,
  isActive = false,
  badge,
  isCollapsed = false,
  onClick,
}: SidebarItemProps) {
  return (
    <Link
      className={cn(
        "group flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground",
        isCollapsed ? "justify-center" : "gap-3"
      )}
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      to={href}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!isCollapsed && (
        <>
          <span className="truncate">{label}</span>
          {badge !== undefined && (
            <span className="ml-auto rounded-full bg-sidebar-primary px-2 py-0.5 text-sidebar-primary-foreground text-xs">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}
