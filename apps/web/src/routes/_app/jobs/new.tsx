import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { z } from "zod";
import { orpc } from "@/utils/orpc-client";
import { Button } from "@mizu-hr/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mizu-hr/ui/card";
import { Field, FieldError, FieldLabel } from "@mizu-hr/ui/field";
import { Input } from "@mizu-hr/ui/input";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@mizu-hr/ui/select";
import { Switch } from "@mizu-hr/ui/switch";
import { toastManager } from "@mizu-hr/ui/toast";
import { JobDescriptionEditor } from "@/components/job-description-editor";

export const Route = createFileRoute("/_app/jobs/new")({
  component: NewJobRoute,
});

type EmploymentType = "full-time" | "part-time" | "contract" | "internship";
type ExperienceLevel = "entry" | "mid" | "senior" | "lead";
type JobStatus = "draft" | "published" | "closed" | "archived";

type JobFormValues = {
  title: string;
  description: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel | undefined;
  salaryMin: number | undefined;
  salaryMax: number | undefined;
  salaryCurrency: string;
  remote: boolean;
  status: JobStatus;
};

const defaultFormValues: JobFormValues = {
  title: "",
  description: "",
  department: "",
  location: "",
  employmentType: "full-time",
  experienceLevel: undefined,
  salaryMin: undefined,
  salaryMax: undefined,
  salaryCurrency: "USD",
  remote: false,
  status: "draft",
};

function NewJobRoute() {
  const router = useRouter();

  const createMutation = useMutation(
    orpc.job.create.mutationOptions({
      onSuccess: () => {
        toastManager.add({ title: "Job created successfully", type: "success" });
        router.navigate({ to: "/jobs" });
      },
      onError: (error: Error) => {
        toastManager.add({ title: error.message || "Failed to create job", type: "error" });
      },
    }),
  );

  const form = useForm({
    defaultValues: defaultFormValues,
    onSubmit: async ({ value }) => {
      createMutation.mutate(value as JobFormValues);
    },
  });

  const isSubmitting = createMutation.isPending;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" render={<Link to="/jobs" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="font-heading text-2xl">Create Job Posting</h1>
          <p className="text-muted-foreground text-sm">
            Fill in the details to create a new job posting
          </p>
        </div>
      </div>

      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>The main details about this position</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.Field
              name="title"
              validators={{
                onBlur: z.string().min(1, "Job title is required"),
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel>Job Title *</FieldLabel>
                  <Input
                    disabled={isSubmitting}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    value={field.state.value}
                  />
                  {field.state.meta.errors.map((error) => (
                    <FieldError key={typeof error === "string" ? error : error?.message}>
                      {typeof error === "string" ? error : error?.message}
                    </FieldError>
                  ))}
                </Field>
              )}
            </form.Field>

            <div className="grid grid-cols-2 gap-4">
              <form.Field name="department">
                {(field) => (
                  <Field>
                    <FieldLabel>Department</FieldLabel>
                    <Input
                      disabled={isSubmitting}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Engineering"
                      value={field.state.value}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="location">
                {(field) => (
                  <Field>
                    <FieldLabel>Location</FieldLabel>
                    <Input
                      disabled={isSubmitting}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      value={field.state.value}
                    />
                  </Field>
                )}
              </form.Field>
            </div>

            <form.Field
              name="description"
              validators={{
                onBlur: z.string().min(1, "Job description is required"),
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel>Job Description *</FieldLabel>
                  <JobDescriptionEditor
                    disabled={isSubmitting}
                    onChange={(value) => field.handleChange(value)}
                    value={field.state.value}
                  />
                  {field.state.meta.errors.map((error) => (
                    <FieldError key={typeof error === "string" ? error : error?.message}>
                      {typeof error === "string" ? error : error?.message}
                    </FieldError>
                  ))}
                </Field>
              )}
            </form.Field>
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
            <CardDescription>Work arrangement and requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <form.Field name="employmentType">
                {(field) => (
                  <Field>
                    <FieldLabel>Employment Type *</FieldLabel>
                    <Select
                      disabled={isSubmitting}
                      onValueChange={(value) => field.handleChange(value as EmploymentType)}
                      value={field.state.value}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectPopup>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectPopup>
                    </Select>
                  </Field>
                )}
              </form.Field>

              <form.Field name="experienceLevel">
                {(field) => (
                  <Field>
                    <FieldLabel>Experience Level</FieldLabel>
                    <Select
                      disabled={isSubmitting}
                      onValueChange={(value) => field.handleChange(value as ExperienceLevel)}
                      value={field.state.value ?? ""}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectPopup>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior Level</SelectItem>
                        <SelectItem value="lead">Lead / Principal</SelectItem>
                      </SelectPopup>
                    </Select>
                  </Field>
                )}
              </form.Field>
            </div>

            <Field>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <FieldLabel className="mb-0">Remote Position</FieldLabel>
                  <p className="text-muted-foreground text-sm">This position allows remote work</p>
                </div>
                <form.Field name="remote">
                  {(field) => (
                    <Switch
                      checked={field.state.value}
                      disabled={isSubmitting}
                      onCheckedChange={(checked) => field.handleChange(checked)}
                    />
                  )}
                </form.Field>
              </div>
            </Field>
          </CardContent>
        </Card>

        {/* Compensation */}
        <Card>
          <CardHeader>
            <CardTitle>Compensation</CardTitle>
            <CardDescription>Salary range for this position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <form.Field name="salaryMin">
                {(field) => (
                  <Field>
                    <FieldLabel>Min Salary</FieldLabel>
                    <Input
                      disabled={isSubmitting}
                      onChange={(e) =>
                        field.handleChange(e.target.value ? Number(e.target.value) : undefined)
                      }
                      placeholder="50000"
                      type="number"
                      value={field.state.value ?? ""}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="salaryMax">
                {(field) => (
                  <Field>
                    <FieldLabel>Max Salary</FieldLabel>
                    <Input
                      disabled={isSubmitting}
                      onChange={(e) =>
                        field.handleChange(e.target.value ? Number(e.target.value) : undefined)
                      }
                      placeholder="80000"
                      type="number"
                      value={field.state.value ?? ""}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="salaryCurrency">
                {(field) => (
                  <Field>
                    <FieldLabel>Currency</FieldLabel>
                    <Select
                      disabled={isSubmitting}
                      onValueChange={(value) => field.handleChange(value ?? "USD")}
                      value={field.state.value}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectPopup>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                      </SelectPopup>
                    </Select>
                  </Field>
                )}
              </form.Field>
            </div>
          </CardContent>
        </Card>

        {/* Publishing */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
            <CardDescription>Control the visibility of this job posting</CardDescription>
          </CardHeader>
          <CardContent>
            <form.Field name="status">
              {(field) => (
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={(value) => field.handleChange(value as JobStatus)}
                    value={field.state.value}
                  >
                    <SelectTrigger className="max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectPopup>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectPopup>
                  </Select>
                </Field>
              )}
            </form.Field>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" disabled={isSubmitting} render={<Link to="/jobs" />}>
            Cancel
          </Button>
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Job"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
