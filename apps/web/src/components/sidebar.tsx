import type { ToOptions } from "@tanstack/react-router";
import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Home,
  LayoutDashboard,
  ListTodo,
  PanelLeftClose,
  PanelLeftOpen,
  // PanelLeftClose,
  // PanelLeftOpen,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { useKeyPress } from "@/hooks/useKeyPress";
import { cn } from "@/utils/cn";
import { OrgMenu } from "./org-menu";
import { ThemeToggle } from "./theme-toggle";
import { Separator } from "./ui/separator";
import { UserMenu } from "./user-menu";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  useKeyPress("s", () => setIsCollapsed((prev) => !prev));

  // pr-2.5 pl-4.5

  return (
    <div
      className={cn(
        "relative flex h-full flex-col gap-3 bg-default px-4 py-3 transition-[width] duration-200 ease-in-out motion-reduce:transition-none",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      {/* <div
        className={cn(
          "flex items-center py-4",
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
          className="flex h-8 w-8 items-center justify-center rounded-md bg-dark text-foreground transition-all hover:bg-default"
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
      </div> */}
      <OrgMenu isCollapsed={isCollapsed} />
      {/* Navigation */}
      <nav className="mt-6 flex flex-1 flex-col gap-1">
        <SidebarItem
          href="/"
          icon={Home}
          isActive={location.pathname === "/"}
          isCollapsed={isCollapsed}
          label="Home"
        />
        <SidebarItem
          href="/jobs"
          icon={Briefcase}
          isActive={location.pathname === "/jobs"}
          isCollapsed={isCollapsed}
          label="Jobs"
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

        <Separator className="mt-auto h-px w-full" orientation="horizontal" />
        <SidebarItem
          href="/settings"
          icon={Settings}
          isActive={location.pathname.startsWith("/settings")}
          isCollapsed={isCollapsed}
          label="Settings"
        />
      </nav>
      <button
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-light text-foreground transition-all hover:bg-default"
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
      <ThemeToggle isCollapsed={isCollapsed} />
      <UserMenu isCollapsed={isCollapsed} />
    </div>
  );
}

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
        "group relative flex h-9 w-full items-center gap-3 rounded-lg px-2 py-2 font-medium text-foreground text-sm",
        "hover:bg-light",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isActive && "bg-light"
      )}
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      to={href}
    >
      <Icon className="size-4 shrink-0 text-foreground-muted" />

      <div
        className={cn(
          "flex flex-1 items-center justify-between transition-opacity duration-200",
          isCollapsed ? "opacity-0" : "w-auto opacity-100"
        )}
      >
        <span className="truncate">{label}</span>
        {badge !== undefined && (
          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 font-medium text-primary-foreground text-xs">
            {badge}
          </span>
        )}
      </div>

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div
          className={cn(
            "-translate-y-1/2 pointer-events-none absolute top-1/2 left-full z-50",
            "ml-2 whitespace-nowrap rounded-md border border-border px-2 py-1",
            "bg-popover text-popover-foreground text-xs shadow-lg",
            "opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          )}
        >
          {label}
        </div>
      )}
    </Link>
  );
}
