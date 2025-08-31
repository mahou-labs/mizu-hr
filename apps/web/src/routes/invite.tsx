import { createFileRoute, redirect } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

const inviteSearchSchema = z.object({
  id: z.string().catch(null),
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

  return <div>Hello "/_app/invite"! ${id}</div>;
}
