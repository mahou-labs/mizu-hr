import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

const authSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
  validateSearch: zodValidator(authSearchSchema),
  beforeLoad: ({ context }) => {
    if (context.session) {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
