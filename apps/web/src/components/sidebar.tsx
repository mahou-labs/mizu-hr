import type { ToOptions } from "@tanstack/react-router";
import { Link, useLocation } from "@tanstack/react-router";
import {
  IconSuitcaseOutline24,
  IconHouse6Outline24,
  IconLayoutLeftOutline24,
  IconGearOutline24,
} from "nucleo-core-outline-24";
import { useState } from "react";
import { useKeyPress } from "@/hooks/useKeyPress";
import { cn } from "@/utils/cn";
import { OrgMenu } from "./org-menu";
import { Separator } from "@mizu-hr/ui/separator";
import {
  Tooltip,
  TooltipCreateHandle,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@mizu-hr/ui/tooltip";
import { UserMenu } from "./user-menu";
import { SearchBar } from "./search-bar";

const tooltipHandle = TooltipCreateHandle<React.ComponentType>();

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  useKeyPress("b", () => setIsCollapsed((prev) => !prev), { mod: true, preventDefault: true });

  return (
    <div
      className={cn(
        "relative flex h-full flex-col gap-3 bg-default bg-sidebar px-4 py-2 transition-[width] duration-200 ease-in-out motion-reduce:transition-none",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <OrgMenu isCollapsed={isCollapsed} />
      <nav className="mt-4 flex flex-1 flex-col gap-1.5">
        <SearchBar isCollapsed={isCollapsed} />
        <TooltipProvider delay={0} timeout={500}>
          <Tooltip disabled={!isCollapsed}>
            <TooltipTrigger
              render={
                <SidebarItem
                  href="/"
                  icon={IconHouse6Outline24}
                  isActive={location.pathname === "/"}
                  isCollapsed={isCollapsed}
                  label="Dashboard"
                />
              }
            />
            <TooltipPopup side="right">
              <span>Dashboard</span>
            </TooltipPopup>
          </Tooltip>

          <Tooltip disabled={!isCollapsed}>
            <TooltipTrigger
              render={
                <SidebarItem
                  href="/jobs"
                  icon={IconSuitcaseOutline24}
                  isActive={location.pathname.startsWith("/jobs")}
                  isCollapsed={isCollapsed}
                  label="Jobs"
                />
              }
            />
            <TooltipPopup side="right">
              <span>Jobs</span>
            </TooltipPopup>
          </Tooltip>

          <Separator className="mt-auto h-0 bg-transparent" orientation="horizontal" />
          <SidebarItem
            href="/settings"
            icon={IconGearOutline24}
            isActive={location.pathname.startsWith("/settings")}
            isCollapsed={isCollapsed}
            label="Settings"
          />

          <Tooltip disabled={!isCollapsed} handle={tooltipHandle}>
            {({ payload: Payload }) => (
              <TooltipPopup side="right">{Payload !== undefined && <Payload />}</TooltipPopup>
            )}
          </Tooltip>
        </TooltipProvider>
      </nav>
      <button
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-light text-foreground transition-all hover:bg-default"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        type="button"
      >
        {isCollapsed ? (
          <IconLayoutLeftOutline24 className="h-4 w-4" />
        ) : (
          <IconLayoutLeftOutline24 className="h-4 w-4" />
        )}
      </button>
      <UserMenu isCollapsed={isCollapsed} />
    </div>
  );
}

type SidebarItemProps = {
  icon: React.FC<{ className?: string }>;
  label: string;
  href: ToOptions["to"];
  isActive?: boolean;
  badge?: string | number;
  isCollapsed?: boolean;
  onClick?: () => void;
} & Omit<React.ComponentProps<typeof Link>, "to" | "className" | "onClick">;

function SidebarItem({
  icon: Icon,
  label,
  href,
  isActive = false,
  badge,
  isCollapsed = false,
  onClick,
  ...props
}: SidebarItemProps) {
  return (
    <Link
      {...props}
      className={cn(
        "group relative flex h-8 w-full items-center gap-3 rounded-lg px-2 font-medium text-foreground text-sm",
        "outline-border hover:bg-background hover:outline",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isActive && "bg-background outline",
      )}
      onClick={onClick}
      title={undefined}
      aria-label={label}
      to={href}
      preload="intent"
    >
      <Icon className="size-4 shrink-0 text-foreground-muted" />

      <div
        className={cn(
          "flex flex-1 items-center justify-between transition-opacity duration-200",
          isCollapsed ? "opacity-0" : "w-auto opacity-100",
        )}
      >
        <span className="truncate">{label}</span>
        {badge !== undefined && (
          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 font-medium text-primary-foreground text-xs">
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
}
