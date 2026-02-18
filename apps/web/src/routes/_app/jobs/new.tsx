import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { v7 as uuidv7 } from "uuid";
import { JobForm, type JobFormValues } from "@/components/job-form";
import { Page } from "@/components/page";
import { jobsCollection } from "@/utils/collections";

export const Route = createFileRoute("/_app/jobs/new")({
  component: NewJobRoute,
});

function NewJobRoute() {
  const navigate = useNavigate();

  const createJob = async (values: JobFormValues) => {
    jobsCollection.insert({
      ...values,
      id: uuidv7(),
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: null,
      organizationId: "",
      createdBy: "",
    });

    await navigate({ to: "/jobs" });
  };

  return (
    <Page
      title="Create Job Posting"
      description="Fill in the details to create a new job posting"
    >
      <JobForm mode="create" onSubmit={createJob} />
    </Page>
  );
}
