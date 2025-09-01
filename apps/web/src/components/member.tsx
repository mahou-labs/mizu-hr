import { User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/utils/cn";

export type MemberRole = "owner" | "admin" | "member";

type MemberProps = {
  name: string;
  email: string;
  role: MemberRole;
  isPending?: boolean;
  avatarUrl?: string;
  className?: string;
};

const roleColors = {
  owner: "bg-primary text-primary-foreground border-primary",
  admin: "bg-chart-1 text-primary-foreground border-chart-1",
  member: "bg-muted text-muted-foreground border-border",
} as const;

const roleLabels = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
} as const;

export function Member({
  name,
  email,
  role,
  isPending = false,
  avatarUrl,
  className,
}: MemberProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-0",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <Avatar.Root>
            <Avatar.Image alt={`${name}'s avatar`} src={avatarUrl} />
            <Avatar.Fallback>
              {initials || <User className="size-5" />}
            </Avatar.Fallback>
          </Avatar.Root>

          {/* Pending indicator overlay */}
          {isPending && (
            <div className="-bottom-1 -right-1 absolute size-4 rounded-full border-2 border-card bg-chart-4" />
          )}
        </div>

        {/* Member Info */}
        <div className="flex min-w-0 flex-1 flex-col sm:flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <span className="truncate font-medium text-card-foreground">
              {name}
            </span>
            {isPending && (
              <span className="inline-flex w-fit items-center rounded-full border border-chart-4 bg-chart-4/10 px-2 py-0.5 font-medium text-chart-4 text-xs">
                Pending
              </span>
            )}
          </div>
          <span className="truncate text-muted-foreground text-sm">
            {email}
          </span>
        </div>
      </div>

      {/* Role Badge */}
      <div className="flex shrink-0 items-center justify-start gap-2 sm:justify-end">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 font-medium text-xs",
            roleColors[role]
          )}
        >
          {roleLabels[role]}
        </span>
      </div>
    </div>
  );
}
