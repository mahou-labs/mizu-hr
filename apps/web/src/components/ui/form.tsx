import { Form as FormPrimitive } from "@base-ui-components/react/form";
import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

function Form(props: ComponentProps<typeof FormPrimitive>) {
  return (
    <FormPrimitive
      {...props}
      className={cn("space-y-6", props.className)}
      data-slot="form"
    />
  );
}

export { Form };
