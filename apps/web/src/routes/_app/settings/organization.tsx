import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Member, type MemberRole } from "@/components/member";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { orpc } from "@/utils/orpc";

const inviteSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export const Route = createFileRoute("/_app/settings/organization")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: orgMembers } = useQuery(
    orpc.organization.getMembers.queryOptions()
  );

  const { data: invites } = useQuery(
    orpc.organization.getInvites.queryOptions()
  );

  const { mutateAsync: inviteMember } = useMutation(
    orpc.organization.inviteMember.mutationOptions()
  );

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: inviteSchema },
    onSubmit: async ({ value }) => {
      try {
        await inviteMember({ email: value.email, role: "member" });
        await queryClient.invalidateQueries(
          orpc.organization.getInvites.queryOptions()
        );
        toast.success("Invitation sent");
        setIsDialogOpen(false);
        form.reset();
      } catch (error) {
        console.error(error);
        toast.error("Failed to invite member, try again later");
      }
    },
  });

  return (
    <div className="pt-4">
      <h3 className="mb-4 font-medium text-foreground text-lg">Members</h3>

      <div className="space-y-3">
        {orgMembers?.members?.map((member) => (
          <Member
            email={member.user.email}
            key={member.id}
            name={member.user.name || member.user.email}
            role={member.role as MemberRole}
          />
        ))}

        {invites
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
      </div>

      <Button
        className="mt-4"
        onClick={() => setIsDialogOpen(true)}
        variant="outline"
      >
        <UserPlus className="mr-2 size-4" />
        Invite Member
      </Button>

      <Dialog.Root onOpenChange={setIsDialogOpen} open={isDialogOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/50" />
          <Dialog.Popup className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
            <Dialog.Title className="mb-4 font-semibold text-lg">
              Invite Team Member
            </Dialog.Title>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <form.Field
                name="email"
                validators={{ onChange: inviteSchema.shape.email }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      disabled={form.state.isSubmitting}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="member@example.com"
                      type="email"
                      value={field.state.value}
                    />
                    {field.state.meta.errors.map((error) => (
                      <p
                        className="text-destructive text-sm"
                        key={error?.message}
                      >
                        {error?.message}
                      </p>
                    ))}
                  </div>
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
                <Button
                  disabled={!form.state.canSubmit || form.state.isSubmitting}
                  type="submit"
                >
                  {form.state.isSubmitting ? "Sending..." : "Send Invite"}
                </Button>
              </div>
            </form>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
