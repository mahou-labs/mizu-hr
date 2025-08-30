import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app/settings/organization")({
  component: RouteComponent,
});

function RouteComponent() {
  const [email, setEmail] = useState("");

  const { data: members } = useQuery(
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

      <input
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        value={email}
      />
      <button onClick={handleInvite} type="button">
        Invite
      </button>
      <pre>{JSON.stringify(members, null, 2)}</pre>
      <pre>{JSON.stringify(invites, null, 2)}</pre>
    </div>
  );
}
