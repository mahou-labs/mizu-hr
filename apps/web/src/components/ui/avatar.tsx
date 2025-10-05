import { Avatar as AvatarPrimitive } from "@base-ui-components/react/avatar";
import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

function Root(props: ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      {...props}
      className={cn(
        "relative inline-flex size-9 shrink-0 overflow-hidden rounded-full",
        props.className
      )}
    />
  );
}

function Image(props: ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      {...props}
      className={cn(
        "aspect-square h-full w-full object-cover",
        props.className
      )}
    />
  );
}

function Fallback(props: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      {...props}
      className={cn(
        "flex h-full w-full items-center justify-center bg-default font-medium text-foreground-muted text-sm",
        props.className
      )}
    />
  );
}

export const Avatar = {
  Root,
  Image,
  Fallback,
};
