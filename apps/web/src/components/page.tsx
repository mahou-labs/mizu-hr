import { IconLayoutLeftOutline24 } from "nucleo-core-outline-24";
import { type ReactNode } from "react";
import { useSidebar } from "@/contexts/sidebar-context";

type PageProps = {
  children: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function Page({ children, title, description, actions }: PageProps) {
  return (
    <>
      <PageHeader />
      <div className="flex flex-1 flex-col gap-6 p-6 pt-4">
        <PageTitle title={title} description={description} actions={actions} />
        {children}
      </div>
    </>
  );
}

function PageHeader() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <div className="flex w-full items-center pl-6">
      <button
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-light text-foreground transition-all hover:bg-default"
        onClick={toggleSidebar}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        type="button"
      >
        {isCollapsed ? (
          <IconLayoutLeftOutline24 className="h-4 w-4" />
        ) : (
          <IconLayoutLeftOutline24 className="h-4 w-4" />
        )}
      </button>

      <div className="flex items-center justify-center ml-4 text-sm">breadcrumbs/will/go-here</div>
    </div>
  );
}

function PageTitle({ title, description, actions }: Omit<PageProps, "children">) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-heading text-2xl">{title}</h1>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
