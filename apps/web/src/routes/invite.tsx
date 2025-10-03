import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { orpc } from "@/utils/orpc";

const inviteSearchSchema = z.object({
  id: z.string(),
});

export const Route = createFileRoute("/invite")({
  component: RouteComponent,
  validateSearch: zodValidator(inviteSearchSchema),
  beforeLoad: ({ context, location }) => {
    if (!context.session) {
      throw redirect({
        to: "/auth/signin",
        search: { redirect: location.href },
      });
    }
  },
});

function RouteComponent() {
  const { id } = Route.useSearch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync: acceptInvitation, isPending } = useMutation(
    orpc.organization.acceptInvitation.mutationOptions()
  );

  const handleInvitationAccept = async () => {
    await acceptInvitation({ id });
    toast.success("Invitation accepted");
    await queryClient.fetchQuery(orpc.user.getSession.queryOptions());
    await navigate({ to: "/dashboard" });
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2">
      <h1>Confirm joining ...</h1>
      <Button disabled={isPending} onClick={handleInvitationAccept}>
        Accept Invitation
      </Button>
    </div>
  );
}
