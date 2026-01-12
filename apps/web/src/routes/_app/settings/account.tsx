import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/settings/account")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="pt-4">
      <p className="text-muted-foreground">
        Manage your personal account settings and preferences.
      </p>
    </div>
  );
}
