import { useForm, useStore } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useDebounce } from "@uidotdev/usehooks";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { orpc } from "@/utils/orpc-client";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogBackdrop,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from "./ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

type CreateOrgDialogProps = {
  allowClosing?: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

const onboardingSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  slug: z
    .string()
    .trim() // ignore accidental leading/trailing spaces
    .min(4, "Slug must be at least 4 characters.")
    .regex(/^[a-z0-9-]+$/, "Use only lowercase letters, numbers, and hyphens.")
    .refine((s) => !(s.startsWith("-") || s.endsWith("-")), {
      message: "Slug cannot start or end with a hyphen.",
    })
    .refine((s) => !s.includes("--"), {
      message: "Slug cannot contain consecutive hyphens.",
    }),
});

export function CreateOrgDialog({
  allowClosing = false,
  isOpen,
  onSuccess,
  onOpenChange,
}: CreateOrgDialogProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync: createOrg } = useMutation(
    orpc.organization.createOrg.mutationOptions()
  );

  const form = useForm({
    defaultValues: { name: "", slug: "" },
    validators: { onSubmit: onboardingSchema },
    onSubmit: async ({ value }) => {
      const org = await createOrg({
        name: value.name.trim(),
        slug: value.slug.trim(),
      });

      if (org) {
        toast.success("Organization created successfully!");

        await queryClient.invalidateQueries(
          orpc.organization.getOrgList.queryOptions()
        );
        await queryClient.fetchQuery(orpc.user.getSession.queryOptions());
        await router.invalidate();
        form.reset();
        onSuccess();
      } else {
        toast.error("Failed to create organization");
      }
    },
  });

  const slug = useStore(form.store, (state) => state.values.slug);
  const isSlugValid = onboardingSchema.shape.slug.safeParse(slug).success;
  const debouncedSlug = useDebounce(isSlugValid ? slug : "", 500);

  const { data: slugAvailable, isLoading } = useQuery(
    orpc.organization.checkSlugAvailability.queryOptions({
      input: debouncedSlug,
      enabled: isSlugValid && slug === debouncedSlug,
    })
  );

  return (
    <Dialog
      disablePointerDismissal={!allowClosing}
      onOpenChange={onOpenChange}
      open={isOpen}
    >
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <DialogTitle>Create new organization</DialogTitle>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.Field name="name">
              {(field) => (
                <Field>
                  <FieldLabel>Organization Name</FieldLabel>
                  <Input
                    disabled={form.state.isSubmitting}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your organization name"
                    value={field.state.value}
                  />
                  {field.state.meta.errors.map((error) => (
                    <FieldError key={error?.message}>
                      {error?.message}
                    </FieldError>
                  ))}
                </Field>
              )}
            </form.Field>

            <form.Field
              name="slug"
              validators={{
                onChange: onboardingSchema.shape.slug,
              }}
            >
              {(field) => {
                const isTyping = field.state.value !== debouncedSlug;

                return (
                  <Field>
                    <FieldLabel>Organization Slug</FieldLabel>
                    <Input
                      disabled={form.state.isSubmitting}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="your-organization-slug"
                      value={field.state.value}
                    />
                    {field.state.meta.errors.map((error) => (
                      <FieldError key={error?.message}>
                        {error?.message}
                      </FieldError>
                    ))}
                    {field.state.meta.errors.length === 0 &&
                      field.state.value && (
                        <FieldDescription>
                          {isTyping || isLoading ? (
                            "Checking availability..."
                          ) : slugAvailable ? (
                            <span className="flex gap-1 text-success">
                              <Check className="size-4" /> Available
                            </span>
                          ) : (
                            <span className="flex gap-1 text-destructive">
                              <X className="size-4" /> Taken
                            </span>
                          )}
                        </FieldDescription>
                      )}
                  </Field>
                );
              }}
            </form.Field>

            <Button
              className="w-full"
              disabled={
                !form.state.canSubmit ||
                form.state.isSubmitting ||
                slug !== debouncedSlug ||
                (debouncedSlug.length >= 4 && isLoading) ||
                !slugAvailable
              }
              type="submit"
            >
              {form.state.isSubmitting ? "Creating..." : "Create Organization"}
            </Button>
          </form>

          {/* <Dialog.Close>Close</Dialog.Close> */}
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );

  // return (
  // <div className="flex h-full items-center justify-center p-4">
  //   <Card className="w-full max-w-md">
  //     <CardHeader className="text-center">
  //       <CardTitle>Welcome to Mizu HR!</CardTitle>
  //       <CardDescription>
  //         Let's get you started by creating your organization
  //       </CardDescription>
  //     </CardHeader>
  //     <CardContent>
  //       <form
  //         className="space-y-4"
  //         onSubmit={(e) => {
  //           e.preventDefault();
  //           form.handleSubmit();
  //         }}
  //       >
  //         <form.Field name="name">
  //           {(field) => (
  //             <div className="space-y-2">
  //               <Label>Organization Name</Label>
  //               <Input
  //                 disabled={form.state.isSubmitting}
  //                 onChange={(e) => field.handleChange(e.target.value)}
  //                 placeholder="Enter your organization name"
  //                 value={field.state.value}
  //               />
  //               {field.state.meta.errors.map((error) => (
  //                 <p
  //                   className="text-destructive text-sm"
  //                   key={error?.message}
  //                 >
  //                   {error?.message}
  //                 </p>
  //               ))}
  //             </div>
  //           )}
  //         </form.Field>

  //         <form.Field
  //           name="slug"
  //           validators={{
  //             onChange: onboardingSchema.shape.slug,
  //           }}
  //         >
  //           {(field) => {
  //             const isTyping = field.state.value !== debouncedSlug;

  //             return (
  //               <div className="space-y-2">
  //                 <Label>Organization Slug</Label>
  //                 <Input
  //                   disabled={form.state.isSubmitting}
  //                   onChange={(e) => field.handleChange(e.target.value)}
  //                   placeholder="your-organization-slug"
  //                   value={field.state.value}
  //                 />
  //                 {field.state.meta.errors.map((error) => (
  //                   <p
  //                     className="text-destructive text-sm"
  //                     key={error?.message}
  //                   >
  //                     {error?.message}
  //                   </p>
  //                 ))}
  //                 {field.state.meta.errors.length === 0 &&
  //                   field.state.value && (
  //                     <p className="text-muted-foreground text-sm">
  //                       {isTyping || isLoading
  //                         ? "Checking availability..."
  //                         : slugAvailable
  //                           ? "✓ Available"
  //                           : "✗ Taken"}
  //                     </p>
  //                   )}
  //               </div>
  //             );
  //           }}
  //         </form.Field>

  //         <Button
  //           className="w-full"
  //           disabled={
  //             !form.state.canSubmit ||
  //             form.state.isSubmitting ||
  //             slug !== debouncedSlug ||
  //             (debouncedSlug.length >= 4 && isLoading) ||
  //             !slugAvailable
  //           }
  //           type="submit"
  //         >
  //           {form.state.isSubmitting ? "Creating..." : "Create Organization"}
  //         </Button>
  //       </form>
  //     </CardContent>
  //   </Card>
  // </div>
}
