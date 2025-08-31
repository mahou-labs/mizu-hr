import { useMutation, useQuery } from "@tanstack/react-query";
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
      // setEmail("");
      toast.success("Invitation sent");
    } catch (error) {
      console.error(error);
      toast.error("Failed to invite member, try again later");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <Building2 className="size-5 text-gray-600" />
        <h2 className="font-semibold text-gray-900 text-xl">
          Organization Settings
        </h2>
      </div>
      <p className="text-gray-600">
        Configure your organization settings and manage team preferences.
      </p>

      <div className="mt-8">
        <h3 className="mb-4 font-medium text-gray-900 text-lg">Team Members</h3>

        <div className="mb-6 flex gap-2">
          <input
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            type="email"
            value={email}
          />
          <button
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
          {invites?.map((invite) => (
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
