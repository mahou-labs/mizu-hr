import { IconCircularLoaderOutline24 } from "nucleo-core-outline-24";

import { cn } from "@/utils/cn";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
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
