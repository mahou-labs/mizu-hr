import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";

export const Route = createFileRoute("/_app/settings/organization")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <Building2 className="size-5 text-gray-600" />
        <h2 className="font-semibold text-gray-900 text-xl">
          Organization Settings
        </h2>
      </div>
      <p className="text-gray-600">
        Configure your organization settings and manage team preferences.
      </p>
    </div>
  );
}
