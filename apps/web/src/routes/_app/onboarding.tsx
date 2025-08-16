import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useDebounce } from "@uidotdev/usehooks";
import { useCallback, useEffect, useState } from "react";
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

export const Route = createFileRoute("/_app/onboarding")({
  component: OnboardingComponent,
  beforeLoad: async ({ context }) => {
    if (context.session?.session.activeOrganizationId) {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function OnboardingComponent() {
  const router = useRouter();
  const navigate = Route.useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const [organizationName, setOrganizationName] = useState("");
  const [organizationSlug, setOrganizationSlug] = useState("");
  // const [debouncedSlug, setDebouncedSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [slugError, setSlugError] = useState("");
  const debouncedSlug = useDebounce(organizationSlug, 500);
  const { data: slugAvailable, isLoading: isCheckingSlug } = useQuery({
    ...orpc.organization.checkSlugAvailability.queryOptions({
      input: { slug: debouncedSlug },
    }),
    enabled: debouncedSlug.length > 0 && !slugError,
  });

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

  // Auto-generate slug from organization name
  useEffect(() => {
    if (organizationName && !organizationSlug) {
      const autoSlug = organizationName
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-");
      setOrganizationSlug(autoSlug);
      setSlugError(validateSlug(autoSlug));
    }
  }, [organizationName, organizationSlug, validateSlug]);

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
      const result = await authClient.organization.create({
        name: organizationName.trim(),
        slug: organizationSlug.trim(),
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to create organization");
        return;
      }

      toast.success("Organization created successfully!");

      await authClient.organization.setActive({
        organizationId: result.data.id,
      });

      router.invalidate();
      navigate({ to: "/dashboard" });
    } catch (error) {
      console.error("Error creating organization:", error);
      toast.error("Failed to create organization");
    } finally {
      setIsCreating(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">Loading...</div>
    );
  }

  if (!session) {
    return null;
  }

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
          <form onSubmit={handleCreateOrganization} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                type="text"
                placeholder="Enter your organization name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                disabled={isCreating}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationSlug">Organization Slug</Label>
              <Input
                id="organizationSlug"
                type="text"
                placeholder="your-organization-slug"
                value={organizationSlug}
                onChange={(e) => handleSlugChange(e.target.value)}
                disabled={isCreating}
                required
              />

              {/* Slug validation messages */}
              {slugError && <p className="text-red-600 text-sm">{slugError}</p>}

              {!slugError && organizationSlug && (
                <>
                  {isCheckingSlug ? (
                    <p className="text-gray-500 text-sm">
                      Checking availability...
                    </p>
                  ) : (
                    <p
                      className={`text-sm ${slugAvailable ? "text-green-600" : "text-red-600"}`}
                    >
                      {slugAvailable
                        ? "✓ This slug is available"
                        : "✗ This slug is already taken"}
                    </p>
                  )}
                </>
              )}

              <p className="text-gray-500 text-xs">
                This will be used in your organization URL. Only lowercase
                letters, numbers, and hyphens allowed.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                isCreating ||
                !organizationName.trim() ||
                !organizationSlug.trim() ||
                !!slugError ||
                !slugAvailable ||
                isCheckingSlug
              }
            >
              {isCreating ? "Creating..." : "Create Organization"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
