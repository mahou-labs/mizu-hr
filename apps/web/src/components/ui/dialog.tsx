import { Dialog as DialogPrimitive } from "@base-ui-components/react/dialog";
import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

function Root(props: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

function Trigger(props: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return (
    <DialogPrimitive.Trigger
      {...props}
      className={cn(
        "flex h-10 select-none items-center justify-center rounded-md border border-input bg-default px-3.5 font-medium text-foreground text-sm hover:bg-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        props.className
      )}
    />
  );
}

function Portal(props: ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal {...props} />;
}

function Backdrop(props: ComponentProps<typeof DialogPrimitive.Backdrop>) {
  return (
    <DialogPrimitive.Backdrop
      {...props}
      className={cn(
        "fixed inset-0 bg-black/80 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        props.className
      )}
    />
  );
}

function Popup(props: ComponentProps<typeof DialogPrimitive.Popup>) {
  return (
    <DialogPrimitive.Popup
      {...props}
      className={cn(
        "-mt-8 -translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 w-96 max-w-[calc(100vw-3rem)] rounded-lg border border-border bg-default p-6 text-foreground shadow-lg transition-all duration-150 data-[ending-style]:scale-90 data-[starting-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        props.className
      )}
    />
  );
}

function Title(props: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      {...props}
      className={cn("text-foreground", props.className)}
    />
  );
}

function Description(
  props: ComponentProps<typeof DialogPrimitive.Description>
) {
  return (
    <DialogPrimitive.Description
      {...props}
      className={cn("text-foreground", props.className)}
    />
  );
}

function Close(props: ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
      {...props}
      className={cn(
        "flex h-10 select-none items-center justify-center rounded-md border border-input bg-default px-3.5 font-medium text-foreground text-sm hover:bg-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        props.className
      )}
    />
  );
}

export const Dialog = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Popup,
  Title,
  Description,
  Close,
};
