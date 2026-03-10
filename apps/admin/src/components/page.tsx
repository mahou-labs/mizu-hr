import { useSidebar } from "@/contexts/sidebar-context";
import { useModifierKey } from "@/hooks/use-modifier-key";
import { Button } from "@mizu-hr/ui/button";
import { Kbd, KbdGroup } from "@mizu-hr/ui/kbd";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@mizu-hr/ui/tooltip";
import { IconLayoutLeftOutline18 } from "nucleo-ui-outline-18";
import { type ReactNode } from "react";
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
  const { toggleSidebar } = useSidebar();
  const modifierKey = useModifierKey();
  // const breadcrumbs = useBreadcrumbs();

  return (
    <div className="sticky top-0 z-10 flex w-full items-center border-b bg-background px-6 py-4">
      <Tooltip>
        <TooltipTrigger delay={0}>
          <Button className="text-muted-foreground p-1" onClick={toggleSidebar} variant="link">
            <IconLayoutLeftOutline18 />
          </Button>
        </TooltipTrigger>
        <TooltipPopup>
          <KbdGroup>
            <Kbd>{modifierKey}</Kbd>
            <Kbd>B</Kbd>
          </KbdGroup>
        </TooltipPopup>
      </Tooltip>
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
