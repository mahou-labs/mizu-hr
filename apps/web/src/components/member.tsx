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
  owner:
    "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
  admin:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  member:
    "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
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
        "flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-0 dark:border-gray-800 dark:bg-gray-900",
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
            <div className="-bottom-1 -right-1 absolute size-4 rounded-full border-2 border-white bg-orange-400 dark:border-gray-900 dark:bg-orange-500" />
          )}
        </div>

        {/* Member Info */}
        <div className="flex min-w-0 flex-1 flex-col sm:flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <span className="truncate font-medium text-gray-900 dark:text-gray-100">
              {name}
            </span>
            {isPending && (
              <span className="inline-flex w-fit items-center rounded-full border border-orange-200 bg-orange-100 px-2 py-0.5 font-medium text-orange-800 text-xs dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                Pending
              </span>
            )}
          </div>
          <span className="truncate text-gray-600 text-sm dark:text-gray-400">
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
