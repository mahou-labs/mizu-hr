import { Input as InputPrimitive } from "@base-ui-components/react/input";
import type { ComponentProps } from "react";

function Input(props: ComponentProps<typeof InputPrimitive>) {
  return <InputPrimitive {...props} />;
}

export { Input };
