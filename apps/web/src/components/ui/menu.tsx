import { Menu as MenuPrimitive } from "@base-ui-components/react/menu";
import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

function Arrow(props: ComponentProps<typeof MenuPrimitive.Arrow>) {
  return (
    <MenuPrimitive.Arrow
      {...props}
      className={cn(
        "data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=top]:bottom-[-8px] data-[side=right]:left-[-13px]",
        "data-[side=right]:-rotate-90 data-[side=left]:rotate-90 data-[side=top]:rotate-180",
        props.className
      )}
    >
      <svg fill="none" height="10" viewBox="0 0 20 10" width="20">
        <title>Menu arrow</title>
        <path
          className="fill-popover"
          d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        />
        <path
          className="fill-border dark:fill-none"
          d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
        />
        <path
          className="dark:fill-border"
          d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
        />
      </svg>
    </MenuPrimitive.Arrow>
  );
}

function Backdrop(props: ComponentProps<typeof MenuPrimitive.Backdrop>) {
  return (
    <MenuPrimitive.Backdrop {...props} className={cn("", props.className)} />
  );
}

function CheckboxItem(
  props: ComponentProps<typeof MenuPrimitive.CheckboxItem>
) {
  return (
    <MenuPrimitive.CheckboxItem
      {...props}
      className={cn("", props.className)}
    />
  );
}

function CheckboxItemIndicator(
  props: ComponentProps<typeof MenuPrimitive.CheckboxItemIndicator>
) {
  return (
    <MenuPrimitive.CheckboxItemIndicator
      {...props}
      className={cn("", props.className)}
    />
  );
}

function Group(props: ComponentProps<typeof MenuPrimitive.Group>) {
  return <MenuPrimitive.Group {...props} className={cn("", props.className)} />;
}

function GroupLabel(props: ComponentProps<typeof MenuPrimitive.GroupLabel>) {
  return (
    <MenuPrimitive.GroupLabel {...props} className={cn("", props.className)} />
  );
}

function Item(props: ComponentProps<typeof MenuPrimitive.Item>) {
  return (
    <MenuPrimitive.Item
      {...props}
      className={cn(
        "flex cursor-pointer select-none outline-none",
        "py-2 pr-8 pl-4",
        "text-popover-foreground text-sm leading-4",
        "data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-accent-foreground",
        "data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-accent",
        props.className
      )}
    />
  );
}

function Popup(props: ComponentProps<typeof MenuPrimitive.Popup>) {
  return (
    <MenuPrimitive.Popup
      {...props}
      className={cn(
        "origin-[var(--transform-origin)]",
        "rounded-md bg-popover py-1 text-popover-foreground",
        "shadow-lg shadow-muted outline outline-border",
        "dark:-outline-offset-1 dark:shadow-none dark:outline-border",
        "transition-[transform,scale,opacity]",
        "data-[ending-style]:scale-90 data-[starting-style]:scale-90",
        "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        props.className
      )}
    />
  );
}

function Portal(props: ComponentProps<typeof MenuPrimitive.Portal>) {
  return <MenuPrimitive.Portal {...props} />;
}

function Positioner(props: ComponentProps<typeof MenuPrimitive.Positioner>) {
  return (
    <MenuPrimitive.Positioner {...props} className={cn("", props.className)} />
  );
}

function RadioGroup(props: ComponentProps<typeof MenuPrimitive.RadioGroup>) {
  return (
    <MenuPrimitive.RadioGroup {...props} className={cn("", props.className)} />
  );
}

function RadioItem(props: ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return (
    <MenuPrimitive.RadioItem {...props} className={cn("", props.className)} />
  );
}

function RadioItemIndicator(
  props: ComponentProps<typeof MenuPrimitive.RadioItemIndicator>
) {
  return (
    <MenuPrimitive.RadioItemIndicator
      {...props}
      className={cn("", props.className)}
    />
  );
}

function Root(props: ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root {...props} />;
}

function SubmenuRoot(props: ComponentProps<typeof MenuPrimitive.SubmenuRoot>) {
  return <MenuPrimitive.SubmenuRoot {...props} />;
}

function Trigger(props: ComponentProps<typeof MenuPrimitive.Trigger>) {
  return (
    <MenuPrimitive.Trigger {...props} className={cn("", props.className)} />
  );
}

function Separator(props: ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      {...props}
      className={cn("mx-4 my-1.5", "h-px bg-border", props.className)}
    />
  );
}

function SubmenuTrigger(
  props: ComponentProps<typeof MenuPrimitive.SubmenuTrigger>
) {
  return (
    <MenuPrimitive.SubmenuTrigger
      {...props}
      className={cn("", props.className)}
    />
  );
}

export const Menu = {
  Arrow,
  Backdrop,
  CheckboxItem,
  CheckboxItemIndicator,
  Group,
  GroupLabel,
  Item,
  Popup,
  Portal,
  Positioner,
  RadioGroup,
  RadioItem,
  RadioItemIndicator,
  Root,
  SubmenuRoot,
  Trigger,
  Separator,
  SubmenuTrigger,
};
