import { createFileRoute } from "@tanstack/react-router";
import { ActivityIcon } from "lucide-react";

export const Route = createFileRoute("/_app/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <ActivityIcon className="size-5 text-gray-600" />
        <h2 className="font-semibold text-gray-900 text-xl">
          Settings Overview
        </h2>
      </div>
      <p className="text-gray-600">
        Welcome to the settings panel. Choose a tab above to configure your
        preferences.
      </p>
    </div>
  );
}
