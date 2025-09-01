import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Member, type MemberRole } from "@/components/member";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app/settings/organization")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");

  const { data: orgMembers } = useQuery(
    orpc.organization.getMembers.queryOptions()
  );

  const { data: invites } = useQuery(
    orpc.organization.getInvites.queryOptions()
  );

  const { mutateAsync: inviteMember } = useMutation(
    orpc.organization.inviteMember.mutationOptions()
  );

  const handleInvite = async () => {
    try {
      await inviteMember({ email, role: "member" });
      await queryClient.invalidateQueries(
        orpc.organization.getInvites.queryOptions()
      );
      toast.success("Invitation sent");
    } catch (error) {
      console.error(error);
      toast.error("Failed to invite member, try again later");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <Building2 className="size-5 text-muted-foreground" />
        <h2 className="font-semibold text-foreground text-xl">
          Organization Settings
        </h2>
      </div>
      <p className="text-muted-foreground">
        Configure your organization settings and manage team preferences.
      </p>

      <div className="mt-8">
        <h3 className="mb-4 font-medium text-foreground text-lg">
          Team Members
        </h3>

        <div className="mb-6 flex gap-2">
          <input
            className="flex-1 rounded-md border border-input bg-input px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            type="email"
            value={email}
          />
          <button
            className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            onClick={handleInvite}
            type="button"
          >
            Send Invite
          </button>
        </div>

        <div className="space-y-3">
          {/* Current Members */}
          {orgMembers?.members?.map((member) => (
            <Member
              email={member.user.email}
              key={member.id}
              name={member.user.name || member.user.email}
              role={member.role as MemberRole}
            />
          ))}

          {/* Pending Invites */}
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
      </div>
    </div>
  );
}
