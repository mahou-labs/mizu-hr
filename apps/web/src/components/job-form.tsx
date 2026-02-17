import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { IconArrowLeftFromLineOutline24 } from "nucleo-core-outline-24";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@mizu-hr/ui/avatar";
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
import { Form } from "@mizu-hr/ui/form";
import { Input } from "@mizu-hr/ui/input";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@mizu-hr/ui/select";
import { Switch } from "@mizu-hr/ui/switch";
import { JobDescriptionEditor } from "@/components/job-description-editor";
import { orpc } from "@/utils/orpc-client";

type EmploymentType = "full-time" | "part-time" | "contract" | "internship";
type ExperienceLevel = "entry" | "mid" | "senior" | "lead";
type JobStatus = "draft" | "published" | "closed" | "archived";

export type JobFormValues = {
  title: string;
  description: string;
  department: string;
  location: string;
  remote: boolean;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel | "";
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  status: JobStatus;
  recruiters: string[];
};

export const defaultJobFormValues: JobFormValues = {
  title: "",
  description: "",
  department: "",
  location: "",
  remote: false,
  employmentType: "full-time",
  experienceLevel: "",
  salaryMin: null,
  salaryMax: null,
  salaryCurrency: "USD",
  status: "draft",
  recruiters: [],
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

type JobFormProps = {
  defaultValues?: JobFormValues;
  onSubmit: (values: JobFormValues) => void | Promise<void>;
  mode: "create" | "edit";
};

export function JobForm({ defaultValues = defaultJobFormValues, onSubmit, mode }: JobFormProps) {
  const { data: membersData } = useQuery(orpc.organization.getMembers.queryOptions());

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value as JobFormValues);
    },
  });

  const isCreate = mode === "create";

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" render={<Link to="/jobs" />}>
          <IconArrowLeftFromLineOutline24 className="size-4" />
        </Button>
        <div>
          <h1 className="font-heading text-2xl">
            {isCreate ? "Create Job Posting" : "Edit Job Posting"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isCreate
              ? "Fill in the details to create a new job posting"
              : "Update the job posting details"}
          </p>
        </div>
      </div>

      <Form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
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
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. Engineering"
                      value={field.state.value}
                    />
                  </Field>
                )}
              </form.Field>

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
                      onCheckedChange={(checked) => field.handleChange(checked)}
                    />
                  )}
                </form.Field>
              </div>
            </Field>
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
                    multiple
                    onValueChange={(values) => field.handleChange(values.map((v) => v.id))}
                    value={membersData?.members.filter((m) => field.state.value.includes(m.id))}
                  >
                    <ComboboxChips>
                      <ComboboxValue>
                        {(
                          value: {
                            id: string;
                            user: { name: string; email: string; image?: string | null };
                          }[],
                        ) => (
                          <>
                            {value?.map((item) => (
                              <ComboboxChip aria-label={item.user.name} key={item.id}>
                                <Avatar className="mr-1.5 size-5">
                                  <AvatarImage
                                    src={item.user.image ?? undefined}
                                    alt={item.user.name}
                                  />
                                  <AvatarFallback className="text-[10px]">
                                    {getInitials(item.user.name || item.user.email)}
                                  </AvatarFallback>
                                </Avatar>
                                {item.user.name || item.user.email}
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
                            <div className="flex items-center gap-2">
                              <Avatar className="size-6">
                                <AvatarImage
                                  src={member.user.image ?? undefined}
                                  alt={member.user.name}
                                />
                                <AvatarFallback className="text-[10px]">
                                  {getInitials(member.user.name || member.user.email)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span>{member.user.name}</span>
                                <span className="text-muted-foreground text-xs">
                                  {member.user.email}
                                </span>
                              </div>
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

        {/* Compensation */}
        <Card>
          <CardHeader>
            <CardTitle>Compensation</CardTitle>
            <CardDescription>Salary range for this position (optional)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <form.Field name="salaryMin">
                {(field) => (
                  <Field>
                    <FieldLabel>Min Salary</FieldLabel>
                    <Input
                      onChange={(e) =>
                        field.handleChange(e.target.value ? Number(e.target.value) : null)
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
                      onChange={(e) =>
                        field.handleChange(e.target.value ? Number(e.target.value) : null)
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
          <Button variant="outline" render={<Link to="/jobs" />}>
            Cancel
          </Button>
          <Button type="submit">{isCreate ? "Create Job" : "Update Job"}</Button>
        </div>
      </Form>
    </div>
  );
}
