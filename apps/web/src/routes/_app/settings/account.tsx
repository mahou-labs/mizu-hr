import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";

export const Route = createFileRoute("/_app/settings/account")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <AlertCircle className="size-5 text-muted-foreground" />
        <h2 className="font-semibold text-foreground text-xl">Account Settings</h2>
      </div>
      <p className="text-muted-foreground">
        Manage your personal account settings and preferences.
      </p>
    </div>
  );
}
