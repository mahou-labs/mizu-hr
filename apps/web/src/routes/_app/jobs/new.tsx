import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { IconArrowLeftFromLineOutline24, IconSpinnerLoaderOutline24 } from "nucleo-core-outline-24";
import { z } from "zod";
import { orpc } from "@/utils/orpc-client";
import { Button } from "@mizu-hr/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mizu-hr/ui/card";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxValue,
} from "@mizu-hr/ui/combobox";
import { Field, FieldError, FieldLabel } from "@mizu-hr/ui/field";
import { Input } from "@mizu-hr/ui/input";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@mizu-hr/ui/select";
import { toastManager } from "@mizu-hr/ui/toast";
import { JobDescriptionEditor } from "@/components/job-description-editor";

export const Route = createFileRoute("/_app/jobs/new")({
  component: NewJobRoute,
});

type EmploymentType = "full-time" | "part-time" | "contract" | "internship";

type JobFormValues = {
  title: string;
  description: string;
  location: string;
  employmentType: EmploymentType;
  salaryMin: number | undefined;
  salaryMax: number | undefined;
  recruiters: string[];
};

const defaultFormValues: JobFormValues = {
  title: "",
  description: "",
  location: "",
  employmentType: "full-time",
  salaryMin: undefined,
  salaryMax: undefined,
  recruiters: [],
};

function NewJobRoute() {
  const router = useRouter();

  const { data: membersData } = useQuery(orpc.organization.getMembers.queryOptions());

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
          <IconArrowLeftFromLineOutline24 className="size-4" />
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
              <form.Field
                name="location"
                validators={{
                  onBlur: z.string().min(1, "Location is required"),
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel>Location *</FieldLabel>
                    <Input
                      disabled={isSubmitting}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. San Francisco, CA"
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
            </div>
          </CardContent>
        </Card>

        {/* Recruiters */}
        <Card>
          <CardHeader>
            <CardTitle>Recruiters</CardTitle>
            <CardDescription>
              Assign team members to manage this job posting (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form.Field name="recruiters">
              {(field) => (
                <Field>
                  <FieldLabel>Assigned Recruiters</FieldLabel>
                  <Combobox
                    disabled={isSubmitting}
                    multiple
                    onValueChange={(values) => field.handleChange(values.map((v) => v.id))}
                    value={membersData?.members.filter((m) => field.state.value.includes(m.id))}
                  >
                    <ComboboxChips>
                      <ComboboxValue>
                        {(value: { id: string; name: string; email: string }[]) => (
                          <>
                            {value?.map((item) => (
                              <ComboboxChip aria-label={item.name} key={item.id}>
                                {item.name}
                              </ComboboxChip>
                            ))}
                            <ComboboxInput
                              aria-label="Select recruiters"
                              placeholder={value.length > 0 ? undefined : "Select recruiters..."}
                            />
                          </>
                        )}
                      </ComboboxValue>
                    </ComboboxChips>
                    <ComboboxPopup>
                      <ComboboxEmpty>No members found</ComboboxEmpty>
                      <ComboboxList>
                        {membersData?.members.map((member) => (
                          <ComboboxItem key={member.id} value={member}>
                            <div className="flex flex-col">
                              <span>{member.user.name}</span>
                              <span className="text-muted-foreground text-xs">
                                {member.user.email}
                              </span>
                            </div>
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxPopup>
                  </Combobox>
                </Field>
              )}
            </form.Field>
          </CardContent>
        </Card>

        {/* Compensation (Optional) */}
        <Card>
          <CardHeader>
            <CardTitle>Compensation</CardTitle>
            <CardDescription>Salary range for this position (optional)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
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
            </div>
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
