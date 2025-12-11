import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { User, UserPlus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@mizu-hr/ui/avatar";
import { Button } from "@mizu-hr/ui/button";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@mizu-hr/ui/dialog";
import { Field, FieldError, FieldLabel } from "@mizu-hr/ui/field";
import { Form } from "@mizu-hr/ui/form";
import { Input } from "@mizu-hr/ui/input";
import { Skeleton } from "@mizu-hr/ui/skeleton";
import { cn } from "@/utils/cn";
import { orpc } from "@/utils/orpc-client";
import { toastManager } from "@mizu-hr/ui/toast";

const inviteSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export const Route = createFileRoute("/_app/settings/organization")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isPending } = useQuery(orpc.organization.getMembers.queryOptions());

  const { mutateAsync: inviteMember } = useMutation(
    orpc.organization.inviteMember.mutationOptions(),
  );

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: inviteSchema },
    onSubmit: async ({ value }) => {
      try {
        await inviteMember({ email: value.email, role: "member" });
        await queryClient.invalidateQueries(orpc.organization.getMembers.queryOptions());
        toastManager.add({ title: "Invitation sent", type: "success" });
        setIsDialogOpen(false);
        form.reset();
      } catch (error) {
        console.error(error);
        toastManager.add({
          title: "Failed to invite member, try again later",
          type: "error",
        });
      }
    },
  });

  return (
    <div className="pt-4">
      <h3 className="mb-4 font-medium text-foreground text-lg">Members</h3>

      <div className="flex flex-col gap-3">
        {isPending ? (
          <MemberSkeleton />
        ) : (
          <>
            {data?.members?.members.map((member) => (
              <Member
                email={member.user.email}
                key={member.id}
                name={member.user.name || member.user.email}
                role={member.role as MemberRole}
              />
            ))}

            {data?.invites
              ?.filter((invite) => invite.status === "pending")
              .map((invite) => (
                <Member
                  email={invite.email}
                  isPending={true}
                  key={invite.id}
                  name={invite.email.split("@")[0]}
                  role={invite.role}
                />
              ))}
          </>
        )}
      </div>

      <Button className="mt-4" onClick={() => setIsDialogOpen(true)} variant="outline">
        <UserPlus className="mr-2 size-4" />
        Invite Member
      </Button>

      <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
        {/*<DialogTrigger render={<Button variant="outline" />}>Open Dialog</DialogTrigger>*/}
        <DialogPopup className="sm:max-w-sm">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              {/*<DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DialogDescription>*/}
            </DialogHeader>
            <DialogPanel className="grid gap-4">
              <form.Field name="email" validators={{ onChange: inviteSchema.shape.email }}>
                {(field) => (
                  <Field>
                    <FieldLabel>Email Address</FieldLabel>
                    <Input
                      disabled={form.state.isSubmitting}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="member@example.com"
                      type="email"
                      value={field.state.value}
                    />
                    {field.state.meta.errors.map((error) => (
                      <FieldError key={error?.message}>{error?.message}</FieldError>
                    ))}
                  </Field>
                )}
              </form.Field>
            </DialogPanel>
            <DialogFooter>
              <DialogClose
                render={
                  <Button
                    disabled={form.state.isSubmitting}
                    onClick={() => setIsDialogOpen(false)}
                    type="button"
                    variant="ghost"
                  />
                }
              >
                Cancel
              </DialogClose>
              <Button disabled={!form.state.canSubmit || form.state.isSubmitting} type="submit">
                {form.state.isSubmitting ? "Sending..." : "Send Invite"}
              </Button>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>

      {/*<Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
        <DialogBackdrop />
        <DialogPopup>
          <DialogTitle>Invite Team Member</DialogTitle>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.Field name="email" validators={{ onChange: inviteSchema.shape.email }}>
              {(field) => (
                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <Input
                    disabled={form.state.isSubmitting}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="member@example.com"
                    type="email"
                    value={field.state.value}
                  />
                  {field.state.meta.errors.map((error) => (
                    <FieldError key={error?.message}>{error?.message}</FieldError>
                  ))}
                </Field>
              )}
            </form.Field>

            <div className="flex justify-end gap-2">
              <Button
                disabled={form.state.isSubmitting}
                onClick={() => setIsDialogOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={!form.state.canSubmit || form.state.isSubmitting} type="submit">
                {form.state.isSubmitting ? "Sending..." : "Send Invite"}
              </Button>
            </div>
          </form>
        </DialogPopup>
      </Dialog>*/}
    </div>
  );
}

type MemberRole = "owner" | "admin" | "member";

type MemberProps = {
  name: string;
  email: string;
  role: MemberRole;
  isPending?: boolean;
  avatarUrl?: string;
  className?: string;
};

const roleColors = {
  owner: "bg-primary text-primary-foreground border-primary",
  admin: "bg-chart-1 text-primary-foreground border-chart-1",
  member: "bg-muted text-muted-foreground border-border",
} as const;

const roleLabels = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
} as const;

function Member({ name, email, role, isPending = false, avatarUrl, className }: MemberProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "flex h-20 flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-0",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar>
            <AvatarImage alt={`${name}'s avatar`} src={avatarUrl} />
            <AvatarFallback>{initials || <User className="size-5" />}</AvatarFallback>
          </Avatar>

          {isPending && (
            <div className="-bottom-1 -right-1 absolute size-4 rounded-full border-2 border-card bg-chart-4" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col sm:flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <span className="truncate font-medium text-card-foreground">{name}</span>
            {isPending && (
              <span className="inline-flex w-fit items-center rounded-full border border-chart-4 bg-chart-4/10 px-2 py-0.5 font-medium text-chart-4 text-xs">
                Pending
              </span>
            )}
          </div>
          <span className="truncate text-muted-foreground text-sm">{email}</span>
        </div>
      </div>

      {/* Role Badge */}
      <div className="flex shrink-0 items-center justify-start gap-2 sm:justify-end">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 font-medium text-xs",
            roleColors[role],
          )}
        >
          {roleLabels[role]}
        </span>
      </div>
    </div>
  );
}

function MemberSkeleton() {
  return (
    <div className="flex h-20 flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Skeleton className="size-10 rounded-full" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-start gap-2 sm:justify-end">
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}
