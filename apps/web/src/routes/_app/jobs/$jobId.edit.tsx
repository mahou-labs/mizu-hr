import { jobsCollection } from "@/utils/collections";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { JobForm, type JobFormValues } from "@/components/job-form";
import { Page } from "@/components/page";

export const Route = createFileRoute("/_app/jobs/$jobId/edit")({
  component: EditJobRoute,
});

function EditJobRoute() {
  const navigate = useNavigate();
  const { jobId } = Route.useParams();
  const { data: job } = useLiveQuery((q) =>
    q
      .from({ jobs: jobsCollection })
      .where(({ jobs }) => eq(jobs.id, jobId))
      .findOne(),
  );

  const updateJob = async (values: JobFormValues) => {
    jobsCollection.update(jobId, (draft) => Object.assign(draft, values));
    await navigate({ to: "/jobs" });
  };

  if (!job) return null;

  return (
    <Page
      title="Edit Job Posting"
      description="Update the job posting details"
    >
      <JobForm
        mode="edit"
        defaultValues={{
          title: job.title,
          description: job.description,
          department: job.department ?? "",
          location: job.location,
          remote: job.remote,
          employmentType: job.employmentType as JobFormValues["employmentType"],
          experienceLevel: (job.experienceLevel as JobFormValues["experienceLevel"]) ?? "",
          salaryMin: job.salaryMin ?? null,
          salaryMax: job.salaryMax ?? null,
          salaryCurrency: job.salaryCurrency ?? "USD",
          status: job.status as JobFormValues["status"],
          recruiters: job.recruiters ?? [],
        }}
        onSubmit={updateJob}
      />
    </Page>
  );
}
