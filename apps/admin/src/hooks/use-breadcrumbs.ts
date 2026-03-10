import { useLocation } from "@tanstack/react-router";

type BreadcrumbItem = {
  label: string;
  href: string;
};

/** Human-readable labels for known route segments. */
const segmentLabels: Record<string, string> = {
  jobs: "Jobs",
  settings: "Settings",
  account: "Account",
  organization: "Organization",
  new: "New",
  edit: "Edit",
};

/** UUID pattern to detect dynamic params (UUIDv7, UUIDv4, etc.) */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function formatSegment(segment: string): string {
  if (UUID_REGEX.test(segment)) {
    return segment.slice(0, 8);
  }

  if (segmentLabels[segment]) {
    return segmentLabels[segment];
  }

  // Convert kebab-case to Title Case
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const location = useLocation();
  const pathname = location.pathname;

  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      label: formatSegment(segment),
      href: currentPath,
    });
  }

  return breadcrumbs;
}
