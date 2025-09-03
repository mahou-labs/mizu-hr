import { Separator as SeparatorPrimitive } from "@base-ui-components/react/separator";
import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

function Separator(props: ComponentProps<typeof SeparatorPrimitive>) {
  return (
    <SeparatorPrimitive
      {...props}
      className={cn("w-px bg-border", props.className)}
      orientation={props.orientation || "vertical"}
    />
  );
}

export { Separator };
