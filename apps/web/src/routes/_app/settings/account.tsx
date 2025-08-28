import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";

export const Route = createFileRoute("/_app/settings/account")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <AlertCircle className="size-5 text-gray-600" />
        <h2 className="font-semibold text-gray-900 text-xl">
          Account Settings
        </h2>
      </div>
      <p className="text-gray-600">
        Manage your personal account settings and preferences.
      </p>
    </div>
  );
}
