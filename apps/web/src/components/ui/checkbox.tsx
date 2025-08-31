import { Checkbox as CheckboxPrimitive } from "@base-ui-components/react/checkbox";
import { CheckIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

function Root(props: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      {...props}
      className={cn(
        "peer size-4 shrink-0 rounded-[4px] border border-input bg-input shadow-xs outline-none transition-shadow focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[checked]:border-primary data-[checked]:bg-primary data-[checked]:text-primary-foreground",
        props.className
      )}
      data-slot="checkbox"
    />
  );
}

function Indicator(props: ComponentProps<typeof CheckboxPrimitive.Indicator>) {
  return (
    <CheckboxPrimitive.Indicator
      {...props}
      className={cn(
        "flex items-center justify-center text-current transition-none",
        props.className
      )}
      data-slot="checkbox-indicator"
    >
      <CheckIcon className="size-3.5" />
    </CheckboxPrimitive.Indicator>
  );
}

export const Checkbox = {
  Root,
  Indicator,
};
