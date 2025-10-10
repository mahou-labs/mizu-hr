import { Field as FieldPrimitive } from "@base-ui-components/react/field";
import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

function Root(props: ComponentProps<typeof FieldPrimitive.Root>) {
  return (
    <FieldPrimitive.Root
      {...props}
      className={cn("space-y-2", props.className)}
      data-slot="field-root"
    />
  );
}

function Label(props: ComponentProps<typeof FieldPrimitive.Label>) {
  return (
    <FieldPrimitive.Label
      {...props}
      className={cn(
        "flex select-none items-center gap-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        props.className
      )}
      data-slot="field-label"
    />
  );
}

function Control(props: ComponentProps<typeof FieldPrimitive.Control>) {
  return (
    <FieldPrimitive.Control
      {...props}
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-input bg-input px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-foreground-muted disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        props.className
      )}
      data-slot="field-control"
    />
  );
}

function Description(props: ComponentProps<typeof FieldPrimitive.Description>) {
  return (
    <FieldPrimitive.Description
      {...props}
      className={cn("text-muted-foreground text-sm", props.className)}
      data-slot="field-description"
    />
  );
}

function FieldError(props: ComponentProps<typeof FieldPrimitive.Error>) {
  return (
    <FieldPrimitive.Error
      {...props}
      className={cn("text-destructive text-sm", props.className)}
      data-slot="field-error"
    />
  );
}

function Validity(props: ComponentProps<typeof FieldPrimitive.Validity>) {
  return <FieldPrimitive.Validity {...props} />;
}

export const Field = {
  Root,
  Label,
  Control,
  Description,
  Error: FieldError,
  Validity,
};
