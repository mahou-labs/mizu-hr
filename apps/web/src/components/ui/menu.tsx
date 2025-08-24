import { Menu as MenuPrimitive } from "@base-ui-components/react/menu";
import { cn } from "@/utils/cn";

function Arrow(props: React.ComponentProps<typeof MenuPrimitive.Arrow>) {
  return <MenuPrimitive.Arrow {...props} className={cn("", props.className)} />;
}

function Backdrop(props: React.ComponentProps<typeof MenuPrimitive.Backdrop>) {
  return (
    <MenuPrimitive.Backdrop {...props} className={cn("", props.className)} />
  );
}

function CheckboxItem(
  props: React.ComponentProps<typeof MenuPrimitive.CheckboxItem>
) {
  return (
    <MenuPrimitive.CheckboxItem
      {...props}
      className={cn("", props.className)}
    />
  );
}

function CheckboxItemIndicator(
  props: React.ComponentProps<typeof MenuPrimitive.CheckboxItemIndicator>
) {
  return (
    <MenuPrimitive.CheckboxItemIndicator
      {...props}
      className={cn("", props.className)}
    />
  );
}

function Group(props: React.ComponentProps<typeof MenuPrimitive.Group>) {
  return <MenuPrimitive.Group {...props} className={cn("", props.className)} />;
}

function GroupLabel(
  props: React.ComponentProps<typeof MenuPrimitive.GroupLabel>
) {
  return (
    <MenuPrimitive.GroupLabel {...props} className={cn("", props.className)} />
  );
}

function Item(props: React.ComponentProps<typeof MenuPrimitive.Item>) {
  return (
    <MenuPrimitive.Item
      {...props}
      className={cn(
        "flex cursor-pointer select-none py-2 pr-8 pl-4 text-sm text-white leading-4 outline-none",
        "data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900",
        props.className
      )}
    />
  );
}

function Popup(props: React.ComponentProps<typeof MenuPrimitive.Popup>) {
  return <MenuPrimitive.Popup {...props} className={cn("", props.className)} />;
}

function Portal(props: React.ComponentProps<typeof MenuPrimitive.Portal>) {
  return <MenuPrimitive.Portal {...props} />;
}

function Positioner(
  props: React.ComponentProps<typeof MenuPrimitive.Positioner>
) {
  return (
    <MenuPrimitive.Positioner {...props} className={cn("", props.className)} />
  );
}

function RadioGroup(
  props: React.ComponentProps<typeof MenuPrimitive.RadioGroup>
) {
  return (
    <MenuPrimitive.RadioGroup {...props} className={cn("", props.className)} />
  );
}

function RadioItem(
  props: React.ComponentProps<typeof MenuPrimitive.RadioItem>
) {
  return (
    <MenuPrimitive.RadioItem {...props} className={cn("", props.className)} />
  );
}

function RadioItemIndicator(
  props: React.ComponentProps<typeof MenuPrimitive.RadioItemIndicator>
) {
  return (
    <MenuPrimitive.RadioItemIndicator
      {...props}
      className={cn("", props.className)}
    />
  );
}

function Root(props: React.ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root {...props} />;
}

function SubmenuRoot(
  props: React.ComponentProps<typeof MenuPrimitive.SubmenuRoot>
) {
  return <MenuPrimitive.SubmenuRoot {...props} />;
}

function Trigger(props: React.ComponentProps<typeof MenuPrimitive.Trigger>) {
  return (
    <MenuPrimitive.Trigger {...props} className={cn("", props.className)} />
  );
}

function Separator(
  props: React.ComponentProps<typeof MenuPrimitive.Separator>
) {
  return (
    <MenuPrimitive.Separator
      {...props}
      className={cn("mx-4 my-1.5 h-px bg-gray-200", props.className)}
    />
  );
}

function SubmenuTrigger(
  props: React.ComponentProps<typeof MenuPrimitive.SubmenuTrigger>
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
