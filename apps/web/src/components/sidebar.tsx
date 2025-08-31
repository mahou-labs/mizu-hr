import type { ToOptions } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";
import {
  Home,
  LayoutDashboard,
  ListTodo,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div
      className={cn(
        "relative flex h-full flex-col bg-sidebar transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center p-4",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        <div
          className={cn(
            "transition-opacity duration-200",
            isCollapsed ? "pointer-events-none opacity-0" : "opacity-100"
          )}
        >
          <h1 className="font-semibold text-sidebar-foreground text-xl">
            Mizu HR
          </h1>
        </div>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          type="button"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        <SidebarItem
          href="/"
          icon={Home}
          isActive={location.pathname === "/"}
          isCollapsed={isCollapsed}
          label="Home"
        />
        <SidebarItem
          href="/dashboard"
          icon={LayoutDashboard}
          isActive={location.pathname === "/dashboard"}
          isCollapsed={isCollapsed}
          label="Dashboard"
        />
        <SidebarItem
          href="/todos"
          icon={ListTodo}
          isActive={location.pathname === "/todos"}
          isCollapsed={isCollapsed}
          label="Todos"
        />
      </nav>

      {/* Theme Toggle */}
      <div className="px-3 pb-2">
        <ThemeToggle isCollapsed={isCollapsed} />
      </div>

      {/* User Menu */}
      <div className="p-3">
        <UserMenu isCollapsed={isCollapsed} />
      </div>
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
        "group relative flex w-full items-center rounded-lg px-3 py-2.5 font-medium text-sm transition-all duration-200",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground",
        isCollapsed ? "justify-center px-2" : "gap-3"
      )}
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      to={href}
    >
      <Icon
        className={cn(
          "shrink-0 transition-all duration-200",
          isCollapsed ? "h-5 w-5" : "h-4 w-4"
        )}
      />
      <div
        className={cn(
          "flex flex-1 items-center justify-between transition-all duration-200",
          isCollapsed ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100"
        )}
      >
        <span className="truncate">{label}</span>
        {badge !== undefined && (
          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1.5 font-medium text-sidebar-primary-foreground text-xs">
            {badge}
          </span>
        )}
      </div>

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-full z-50 ml-2 whitespace-nowrap rounded-md bg-sidebar-primary px-2 py-1 text-sidebar-primary-foreground text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {label}
          <div className="-translate-y-1/2 absolute top-1/2 right-full border-4 border-transparent border-r-sidebar-primary" />
        </div>
      )}
    </Link>
  );
}
