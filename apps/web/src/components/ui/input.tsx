import { Input as InputPrimitive } from "@base-ui-components/react/input";
import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

function Input(props: ComponentProps<typeof InputPrimitive>) {
  return (
    <InputPrimitive
      {...props}
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-input bg-input px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-foreground-muted disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        props.className
      )}
    />
  );
}

export { Input };
