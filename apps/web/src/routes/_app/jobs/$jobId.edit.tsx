import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { IconArrowLeftFromLineOutline24, IconSpinnerLoaderOutline24 } from "nucleo-core-outline-24";
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

export const Route = createFileRoute("/_app/jobs/$jobId/edit")({
  component: EditJobRoute,
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

function EditJobRoute() {
  const router = useRouter();
  const { jobId } = Route.useParams();

  const jobQuery = useQuery(orpc.job.get.queryOptions({ input: { id: jobId } }));

  const updateMutation = useMutation(
    orpc.job.update.mutationOptions({
      onSuccess: () => {
        toastManager.add({ title: "Job updated successfully", type: "success" });
        router.navigate({ to: "/jobs" });
      },
      onError: (error: Error) => {
        toastManager.add({ title: error.message || "Failed to update job", type: "error" });
      },
    }),
  );

  if (jobQuery.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <IconSpinnerLoaderOutline24 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (jobQuery.error || !jobQuery.data) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <p className="text-muted-foreground">Job not found</p>
        <Button variant="outline" render={<Link to="/jobs" />}>
          Back to Jobs
        </Button>
      </div>
    );
  }

  return (
    <EditJobForm
      job={jobQuery.data}
      isSubmitting={updateMutation.isPending}
      onSubmit={(values) => updateMutation.mutate({ id: jobId, ...values })}
    />
  );
}

type EditJobFormProps = {
  job: {
    title: string;
    description: string;
    department: string | null;
    location: string | null;
    employmentType: string;
    experienceLevel: string | null;
    salaryMin: number | null;
    salaryMax: number | null;
    salaryCurrency: string | null;
    remote: boolean;
    status: string;
  };
  isSubmitting: boolean;
  onSubmit: (values: JobFormValues) => void;
};

function EditJobForm({ job, isSubmitting, onSubmit }: EditJobFormProps) {
  const form = useForm({
    defaultValues: {
      title: job.title,
      description: job.description,
      department: job.department ?? "",
      location: job.location ?? "",
      employmentType: job.employmentType as EmploymentType,
      experienceLevel: (job.experienceLevel as ExperienceLevel) ?? undefined,
      salaryMin: job.salaryMin ?? undefined,
      salaryMax: job.salaryMax ?? undefined,
      salaryCurrency: job.salaryCurrency ?? "USD",
      remote: job.remote,
      status: job.status as JobStatus,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value as JobFormValues);
    },
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" render={<Link to="/jobs" />}>
          <IconArrowLeftFromLineOutline24 className="size-4" />
        </Button>
        <div>
          <h1 className="font-heading text-2xl">Edit Job Posting</h1>
          <p className="text-muted-foreground text-sm">Update the job posting details</p>
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
                <IconSpinnerLoaderOutline24 className="mr-2 size-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Job"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
