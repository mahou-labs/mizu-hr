import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/utils/auth-client";
import { orpc } from "@/utils/orpc-client";

export const Route = createFileRoute("/auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(value, {
        onSuccess: async () => {
          toast.success("Sign up successful");
          await queryClient.fetchQuery(orpc.user.getSession.queryOptions());
          await navigate({ to: redirect ?? "/dashboard" });
        },
        onError: (error) => {
          toast.error(error.error.message || error.error.statusText);
        },
      });
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  return (
    <div className="mx-auto mt-10 w-full max-w-md p-6">
      <h1 className="mb-6 text-center font-bold text-3xl text-foreground">
        Create Account
      </h1>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          <form.Field name="name">
            {(field) => (
              <Field.Root>
                <Field.Label htmlFor={field.name}>Name</Field.Label>
                <Input
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  value={field.state.value}
                />
                {field.state.meta.errors.map((error) => (
                  <Field.Error key={error?.message}>
                    {error?.message}
                  </Field.Error>
                ))}
              </Field.Root>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="email">
            {(field) => (
              <Field.Root>
                <Field.Label htmlFor={field.name}>Email</Field.Label>
                <Input
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="email"
                  value={field.state.value}
                />
                {field.state.meta.errors.map((error) => (
                  <Field.Error key={error?.message}>
                    {error?.message}
                  </Field.Error>
                ))}
              </Field.Root>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <Field.Root>
                <Field.Label htmlFor={field.name}>Password</Field.Label>
                <Input
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="password"
                  value={field.state.value}
                />
                {field.state.meta.errors.map((error) => (
                  <Field.Error key={error?.message}>
                    {error?.message}
                  </Field.Error>
                ))}
              </Field.Root>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {(state) => (
            <Button
              className="w-full"
              disabled={!state.canSubmit || state.isSubmitting}
              type="submit"
            >
              {state.isSubmitting ? "Submitting..." : "Sign Up"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Button
          onClick={() => navigate({ to: "/auth/signin", search: { redirect } })}
          variant="link"
        >
          Already have an account? Sign In
        </Button>
      </div>
    </div>
  );
}
