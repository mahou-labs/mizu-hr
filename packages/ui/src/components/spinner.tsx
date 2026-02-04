import { IconCircularLoaderOutline24 } from "nucleo-core-outline-24";
import type { ComponentProps } from "react";
import { cn } from "../utils/cn";

type IconProps = ComponentProps<typeof IconCircularLoaderOutline24>;

function Spinner({ className, ...props }: IconProps) {
  return (
    <IconCircularLoaderOutline24
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      role="status"
      {...props}
    />
  );
}

export { Spinner };
