import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useDebounce } from "@uidotdev/usehooks";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/utils/auth-client";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingComponent,
  beforeLoad: ({ context }) => {
    if (context.session?.session.activeOrganizationId) {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function OnboardingComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [organizationName, setOrganizationName] = useState("");
  const [organizationSlug, setOrganizationSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [slugError, setSlugError] = useState("");
  const debouncedSlug = useDebounce(organizationSlug, 500);
  const { data: slugAvailable, isLoading: isCheckingSlug } = useQuery(
    orpc.organization.checkSlugAvailability.queryOptions({
      input: debouncedSlug,
      enabled: debouncedSlug.length > 0 && !slugError,
    })
  );

  // uKsion, navigate]);

  // Validate slug format
  const validateSlug = useCallback((slug: string) => {
    if (!slug) return "";
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return "Slug can only contain lowercase letters, numbers, and hyphens";
    }
    if (slug.startsWith("-") || slug.endsWith("-")) {
      return "Slug cannot start or end with a hyphen";
    }
    if (slug.includes("--")) {
      return "Slug cannot contain consecutive hyphens";
    }
    if (slug.length < 3) {
      return "Slug must be at least 3 characters";
    }
    return "";
  }, []);

  // Handle slug input with automatic formatting
  const handleSlugChange = (value: string) => {
    const formatted = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setOrganizationSlug(formatted);
    setSlugError(validateSlug(formatted));
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!organizationName.trim()) {
      toast.error("Organization name is required");
      return;
    }

    if (!organizationSlug.trim()) {
      toast.error("Organization slug is required");
      return;
    }

    if (slugError) {
      toast.error("Please fix slug errors before continuing");
      return;
    }

    if (!slugAvailable) {
      toast.error("This slug is already taken");
      return;
    }

    setIsCreating(true);

    try {
      const { data: org, error } = await authClient.organization.create({
        name: organizationName.trim(),
        slug: organizationSlug.trim(),
      });

      if (error) {
        toast.error(error.message || "Failed to create organization");
      } else {
        toast.success("Organization created successfully!");

        await authClient.organization.setActive({
          organizationId: org.id,
        });

        await queryClient.refetchQueries(orpc.user.getSession.queryOptions());
        navigate({ to: "/dashboard" });
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      toast.error("Failed to create organization");
    } finally {
      setIsCreating(false);
    }
  };

  // if (isPending) {
  //   return (
  //     <div className="flex h-full items-center justify-center">Loading...</div>
  //   );
  // }

  return (
    <div className="flex h-full items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome to Mizu HR!</CardTitle>
          <CardDescription>
            Let's get you started by creating your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleCreateOrganization}>
            <div className="space-y-2">
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                disabled={isCreating}
                id="organizationName"
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Enter your organization name"
                required
                type="text"
                value={organizationName}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationSlug">Organization Slug</Label>
              <Input
                disabled={isCreating}
                id="organizationSlug"
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="your-organization-slug"
                required
                type="text"
                value={organizationSlug}
              />

              {/* Slug validation messages */}
              {slugError && <p className="text-destructive text-sm">{slugError}</p>}

              {!slugError && organizationSlug && (
                <>
                  {isCheckingSlug ? (
                    <p className="text-muted-foreground text-sm">
                      Checking availability...
                    </p>
                  ) : (
                    <p
                      className={`text-sm ${slugAvailable ? "text-chart-2" : "text-destructive"}`}
                    >
                      {slugAvailable
                        ? "✓ This slug is available"
                        : "✗ This slug is already taken"}
                    </p>
                  )}
                </>
              )}

              <p className="text-muted-foreground text-xs">
                This will be used in your organization URL. Only lowercase
                letters, numbers, and hyphens allowed.
              </p>
            </div>

            <Button
              className="w-full"
              disabled={
                isCreating ||
                !organizationName.trim() ||
                !organizationSlug.trim() ||
                !!slugError ||
                !slugAvailable ||
                isCheckingSlug
              }
              type="submit"
            >
              {isCreating ? "Creating..." : "Create Organization"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
