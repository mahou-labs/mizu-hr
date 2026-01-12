import { type ReactNode } from "react";

type PageProps = {
  children: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function Page({ children, title, description, actions }: PageProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-4">
      <PageHeader title={title} description={description} actions={actions} />
      {children}
    </div>
  );
}

function PageHeader({
  title,
  description,
  actions,
}: Omit<PageProps, "children">) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-heading text-2xl">{title}</h1>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
