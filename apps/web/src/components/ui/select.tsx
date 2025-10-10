import { Select as SelectPrimitive } from "@base-ui-components/react/select";
import { Check, ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

function Root(props: ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root {...props} />;
}

function Trigger(props: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      {...props}
      className={cn(
        "flex h-9 w-full min-w-0 items-center justify-between rounded-md border border-input bg-input px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        props.className
      )}
      data-slot="select-trigger"
    />
  );
}

function Value(props: ComponentProps<typeof SelectPrimitive.Value>) {
  return (
    <SelectPrimitive.Value
      {...props}
      className={cn("flex-1 text-left", props.className)}
    />
  );
}

function Icon(props: ComponentProps<typeof SelectPrimitive.Icon>) {
  return (
    <SelectPrimitive.Icon {...props}>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  );
}

function Portal(props: ComponentProps<typeof SelectPrimitive.Portal>) {
  return <SelectPrimitive.Portal {...props} />;
}

function Positioner(props: ComponentProps<typeof SelectPrimitive.Positioner>) {
  return <SelectPrimitive.Positioner {...props} sideOffset={4} />;
}

function Popup(props: ComponentProps<typeof SelectPrimitive.Popup>) {
  return (
    <SelectPrimitive.Popup
      {...props}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-input bg-popover text-popover-foreground shadow-md outline-none",
        "data-[starting-style]:fade-in-0 data-[starting-style]:zoom-in-95 data-[starting-style]:animate-in",
        "data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-95 data-[ending-style]:animate-out",
        props.className
      )}
      data-slot="select-popup"
    />
  );
}

function ScrollUpArrow(props: ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      {...props}
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        props.className
      )}
    >
      <ChevronDown className="h-4 w-4 rotate-180" />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function ScrollDownArrow(props: ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      {...props}
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        props.className
      )}
    >
      <ChevronDown className="h-4 w-4" />
    </SelectPrimitive.ScrollDownArrow>
  );
}

function Item(props: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      {...props}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:bg-accent focus-visible:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        props.className
      )}
      data-slot="select-item"
    />
  );
}

function ItemText(props: ComponentProps<typeof SelectPrimitive.ItemText>) {
  return <SelectPrimitive.ItemText {...props} />;
}

function ItemIndicator(props: ComponentProps<typeof SelectPrimitive.ItemIndicator>) {
  return (
    <SelectPrimitive.ItemIndicator
      {...props}
      className={cn(
        "absolute right-2 flex h-4 w-4 items-center justify-center",
        props.className
      )}
    >
      <Check className="h-4 w-4" />
    </SelectPrimitive.ItemIndicator>
  );
}

export const Select = {
  Root,
  Trigger,
  Value,
  Icon,
  Portal,
  Positioner,
  Popup,
  ScrollUpArrow,
  ScrollDownArrow,
  Item,
  ItemText,
  ItemIndicator,
};
