import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  IconSuitcaseOutline24,
  IconOfficeOutline24,
  IconClock2Outline24,
  IconCurrencyDollarOutline24,
  IconGlobeOutline24,
  IconSpinnerLoaderOutline24,
  IconMapPinOutline24,
  IconCirclePlusOutline24,
  IconTrashOutline24,
  IconUsersPlusOutline24,
} from "nucleo-core-outline-24";
import { Suspense, useState } from "react";
import { Page } from "@/components/page";
import { orpc } from "@/utils/orpc-client";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@mizu-hr/ui/alert-dialog";
import { Badge } from "@mizu-hr/ui/badge";
import { Button } from "@mizu-hr/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mizu-hr/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@mizu-hr/ui/empty";
import { toastManager } from "@mizu-hr/ui/toast";

export const Route = createFileRoute("/_app/jobs/")({
  component: JobsRoute,
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(orpc.job.list.queryOptions());
  },
});

type EmploymentType = "full-time" | "part-time" | "contract" | "internship";
type ExperienceLevel = "entry" | "mid" | "senior" | "lead";
type JobStatus = "draft" | "published" | "closed" | "archived";

const employmentTypeLabels: Record<EmploymentType, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
};

const experienceLevelLabels: Record<ExperienceLevel, string> = {
  entry: "Entry Level",
  mid: "Mid Level",
  senior: "Senior Level",
  lead: "Lead / Principal",
};

const statusVariants: Record<JobStatus, "success" | "warning" | "secondary" | "outline"> = {
  published: "success",
  draft: "secondary",
  closed: "warning",
  archived: "outline",
};

function formatSalary(min?: number | null, max?: number | null, currency = "USD") {
  if (!min && !max) return null;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }
  if (min) return `From ${formatter.format(min)}`;
  if (max) return `Up to ${formatter.format(max)}`;
  return null;
}

function JobsRoute() {
  return (
    <Page
      title="Job Postings"
      description="Manage your open positions and job listings"
      actions={
        <Button render={<Link to="/jobs/new" />}>
          <IconCirclePlusOutline24 className="mr-2 size-4" />
          Add Job
        </Button>
      }
    >
      <Suspense fallback={<IconSpinnerLoaderOutline24 />}>
        <JobsList />
      </Suspense>
    </Page>
  );
}

function JobsList() {
  const { data: jobs, refetch } = useQuery(orpc.job.list.queryOptions());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  const deleteMutation = useMutation(
    orpc.job.delete.mutationOptions({
      onSuccess: async () => {
        await refetch();
        toastManager.add({ title: "Job deleted successfully", type: "success" });
        setDeleteDialogOpen(false);
        setJobToDelete(null);
      },
      onError: (error: Error) => {
        toastManager.add({ title: error.message || "Failed to delete job", type: "error" });
      },
    }),
  );

  const handleDeleteClick = (jobId: string) => {
    setJobToDelete(jobId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (jobToDelete) {
      deleteMutation.mutate({ id: jobToDelete });
    }
  };

  return jobs?.length === 0 ? (
    <Empty className="flex-1 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconSuitcaseOutline24 />
        </EmptyMedia>
        <EmptyTitle>No job postings yet</EmptyTitle>
        <EmptyDescription>
          Create your first job posting to start attracting candidates.
        </EmptyDescription>
      </EmptyHeader>
      <Button render={<Link to="/jobs/new" />}>
        <IconCirclePlusOutline24 className="mr-2 size-4" />
        Create Job Posting
      </Button>
    </Empty>
  ) : (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {jobs?.map((job) => (
        <Link key={job.id} to="/jobs/$jobId/edit" params={{ jobId: job.id }}>
          <Card className="group relative transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <CardTitle className="line-clamp-1 text-lg">{job.title}</CardTitle>
                  {job.department && (
                    <CardDescription className="mt-1 flex items-center gap-1">
                      <IconOfficeOutline24 className="size-3" />
                      {job.department}
                    </CardDescription>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="opacity-0 transition-all group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteClick(job.id);
                  }}
                >
                  <IconTrashOutline24 className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={statusVariants[job.status as JobStatus]}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
                <Badge variant="outline">
                  {employmentTypeLabels[job.employmentType as EmploymentType]}
                </Badge>
                {job.remote && (
                  <Badge variant="outline">
                    <IconGlobeOutline24 className="mr-1 size-3" />
                    Remote
                  </Badge>
                )}
              </div>

              <div className="space-y-1.5 text-muted-foreground text-sm">
                {job.location && (
                  <div className="flex items-center gap-2">
                    <IconMapPinOutline24 className="size-3.5" />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.experienceLevel && (
                  <div className="flex items-center gap-2">
                    <IconUsersPlusOutline24 className="size-3.5" />
                    <span>{experienceLevelLabels[job.experienceLevel as ExperienceLevel]}</span>
                  </div>
                )}
                {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency ?? undefined) && (
                  <div className="flex items-center gap-2">
                    <IconCurrencyDollarOutline24 className="size-3.5" />
                    <span>
                      {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency ?? undefined)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <IconClock2Outline24 className="size-3.5" />
                  <span>
                    {job.publishedAt
                      ? `Published ${new Date(job.publishedAt).toLocaleDateString()}`
                      : `Created ${new Date(job.createdAt).toLocaleDateString()}`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Posting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job posting? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose
              render={
                <Button
                  disabled={deleteMutation.isPending}
                  type="button"
                  variant="ghost"
                />
              }
            >
              Cancel
            </AlertDialogClose>
            <Button
              disabled={deleteMutation.isPending}
              onClick={handleConfirmDelete}
              variant="destructive"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </div>
  );
}
