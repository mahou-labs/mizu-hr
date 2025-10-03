import { Menu as MenuPrimitive } from "@base-ui-components/react/menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

function Root(props: ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root {...props} data-slot="dropdown-menu" />;
}

function Portal(props: ComponentProps<typeof MenuPrimitive.Portal>) {
  return <MenuPrimitive.Portal {...props} data-slot="dropdown-menu-portal" />;
}

function Trigger(props: ComponentProps<typeof MenuPrimitive.Trigger>) {
  return <MenuPrimitive.Trigger {...props} data-slot="dropdown-menu-trigger" />;
}

function Positioner(props: ComponentProps<typeof MenuPrimitive.Positioner>) {
  return (
    <MenuPrimitive.Positioner
      {...props}
      className={cn("outline-none", props.className)}
    />
  );
}

function Popup({
  className,
  sideOffset = 4,
  ...props
}: ComponentProps<typeof MenuPrimitive.Popup> & { sideOffset?: number }) {
  return (
    <MenuPrimitive.Popup
      {...props}
      className={cn(
        "z-50 min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border border-border bg-light p-1 text-foreground shadow-md",
        "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        "data-[ending-style]:scale-90 data-[starting-style]:scale-90",
        "transition-[transform,scale,opacity]",
        className
      )}
      data-slot="dropdown-menu-content"
    />
  );
}

function Group(props: ComponentProps<typeof MenuPrimitive.Group>) {
  return <MenuPrimitive.Group {...props} data-slot="dropdown-menu-group" />;
}

function Item({
  className,
  inset,
  variant = "default",
  ...props
}: ComponentProps<typeof MenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenuPrimitive.Item
      {...props}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden",
        "hover:bg-default",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-foreground-muted [&_svg]:pointer-events-none [&_svg]:shrink-0",
        inset && "pl-8",
        variant === "destructive" &&
          "text-destructive data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive",
        className
      )}
      data-slot="dropdown-menu-item"
    />
  );
}

function CheckboxItem({
  className,
  children,
  checked,
  ...props
}: ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return (
    <MenuPrimitive.CheckboxItem
      {...props}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden hover:bg-default data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      data-slot="dropdown-menu-checkbox-item"
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon className="size-4" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

function RadioGroup(props: ComponentProps<typeof MenuPrimitive.RadioGroup>) {
  return (
    <MenuPrimitive.RadioGroup
      {...props}
      data-slot="dropdown-menu-radio-group"
    />
  );
}

function RadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return (
    <MenuPrimitive.RadioItem
      {...props}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden hover:bg-default data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      data-slot="dropdown-menu-radio-item"
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenuPrimitive.RadioItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

function GroupLabel({
  className,
  inset,
  ...props
}: ComponentProps<typeof MenuPrimitive.GroupLabel> & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.GroupLabel
      {...props}
      className={cn(
        "px-2 py-1.5 font-medium text-sm",
        inset && "pl-8",
        className
      )}
      data-slot="dropdown-menu-label"
    />
  );
}

function Separator({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      {...props}
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      data-slot="dropdown-menu-separator"
    />
  );
}

function Shortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      {...props}
      className={cn(
        "ml-auto text-foreground-muted text-xs tracking-widest",
        className
      )}
      data-slot="dropdown-menu-shortcut"
    />
  );
}

function SubMenuTrigger({
  className,
  inset,
  children,
  ...props
}: ComponentProps<typeof MenuPrimitive.SubmenuTrigger> & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      {...props}
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden hover:bg-default data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        inset && "pl-8",
        className
      )}
      data-slot="dropdown-menu-sub-trigger"
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

export const DropdownMenu = {
  Root,
  Portal,
  Trigger,
  Positioner,
  Popup,
  Group,
  Item,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  GroupLabel,
  Separator,
  Shortcut,
  SubMenuTrigger,
};
