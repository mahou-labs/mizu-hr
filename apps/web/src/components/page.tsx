import { IconLayoutLeftOutline18 } from "nucleo-ui-outline-18";
import { Fragment, type ReactNode } from "react";
import { useSidebar } from "@/contexts/sidebar-context";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mizu-hr/ui/breadcrumb";
import { Link } from "@tanstack/react-router";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { SearchBar } from "./search-bar";

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
  const breadcrumbs = useBreadcrumbs();

  return (
    <div className="sticky top-0 z-10 flex w-full items-center border-b bg-background px-6 py-4">
      <button
        className="flex h-8 w-8 mr-2 items-center justify-center rounded-md border border-border bg-light text-foreground transition-all hover:bg-default"
        onClick={toggleSidebar}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        type="button"
      >
        <IconLayoutLeftOutline18 className="h-4 w-4" />
      </button>

      <SearchBar />

      {/*<Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <Fragment key={crumb.href}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link to={crumb.href} />}>{crumb.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>*/}
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
