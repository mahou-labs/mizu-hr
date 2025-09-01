import {
  createFileRoute,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { Tabs } from "@/components/ui/tabs";

export const Route = createFileRoute("/_app/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the current tab from the pathname
  const getActiveTab = () => {
    const pathSegments = location.pathname.split("/");
    const lastSegment = pathSegments.at(-1);

    // If we're at /settings (base route), show overview as active
    if (lastSegment === "settings") {
      return "overview";
    }

    // Otherwise return the last segment (account, organization, etc.)
    return lastSegment;
  };

  const activeTab = getActiveTab();

  const tabs = [
    { id: "overview", label: "Overview", to: "/settings" },
    { id: "organization", label: "Organization", to: "/settings/organization" },
    { id: "account", label: "Account", to: "/settings/account" },
  ];

  // Handle tab changes and navigate to corresponding route
  const handleTabChange = (value: string) => {
    const tab = tabs.find((t) => t.id === value);
    if (tab) {
      navigate({ to: tab.to });
    }
  };

  return (
    <div className="mx-auto flex max-w-[850px] flex-col gap-5">
      <div className="flex flex-col">
        <h1 className="font-semibold text-foreground text-xl">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account and organization settings.
        </p>
      </div>
      <Tabs.Root className="" onValueChange={handleTabChange} value={activeTab}>
        <Tabs.List className="relative z-0 flex gap-2 px-1 border-b border-border">
          {tabs.map((tab) => (
            <Tabs.Tab className="p-1 text-muted-foreground hover:text-foreground data-[selected]:text-foreground" key={tab.id} value={tab.id}>
              {tab.label}
            </Tabs.Tab>
          ))}
          <Tabs.Indicator className="-translate-y-1/2 absolute top-1/2 left-0 z-[-1] h-6 w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)] rounded-sm bg-primary" />
        </Tabs.List>

        <Tabs.Panel value={activeTab}>
          <Outlet />
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}
