import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  Building2,
  Clock,
  DollarSign,
  Globe,
  Loader2,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { Page } from "@/components/page";
import { orpc } from "@/utils/orpc-client";
import { Badge } from "@mizu-hr/ui/badge";
import { Button } from "@mizu-hr/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mizu-hr/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@mizu-hr/ui/empty";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@mizu-hr/ui/menu";
import { toastManager } from "@mizu-hr/ui/toast";

export const Route = createFileRoute("/_app/jobs/")({
  component: JobsRoute,
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

type Job = {
  id: string;
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
  createdAt: Date;
  publishedAt: Date | null;
};

function JobsRoute() {
  const jobs = useQuery(orpc.job.list.queryOptions());

  const deleteMutation = useMutation(
    orpc.job.delete.mutationOptions({
      onSuccess: () => {
        jobs.refetch();
        toastManager.add({ title: "Job deleted successfully", type: "success" });
      },
      onError: (error: Error) => {
        toastManager.add({ title: error.message || "Failed to delete job", type: "error" });
      },
    }),
  );

  const handleDeleteJob = (jobId: string) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      deleteMutation.mutate({ id: jobId });
    }
  };

  const jobsData = jobs.data as Job[] | undefined;

  return (
    <Page
      title="Job Postings"
      description="Manage your open positions and job listings"
      actions={
        <Button render={<Link to="/jobs/new" />}>
          <Plus className="mr-2 size-4" />
          Add Job
        </Button>
      }
    >
      {jobs.isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : jobsData?.length === 0 ? (
        <Empty className="flex-1 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Briefcase />
            </EmptyMedia>
            <EmptyTitle>No job postings yet</EmptyTitle>
            <EmptyDescription>
              Create your first job posting to start attracting candidates.
            </EmptyDescription>
          </EmptyHeader>
          <Button render={<Link to="/jobs/new" />}>
            <Plus className="mr-2 size-4" />
            Create Job Posting
          </Button>
        </Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobsData?.map((job: Job) => (
            <Card key={job.id} className="group relative transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="line-clamp-1 text-lg">{job.title}</CardTitle>
                    {job.department && (
                      <CardDescription className="mt-1 flex items-center gap-1">
                        <Building2 className="size-3" />
                        {job.department}
                      </CardDescription>
                    )}
                  </div>
                  <Menu>
                    <MenuTrigger
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                      render={
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      }
                    />
                    <MenuPopup>
                      <MenuItem onClick={() => {}}>
                        <Link
                          to="/jobs/$jobId/edit"
                          params={{ jobId: job.id }}
                          className="flex items-center"
                        >
                          <Pencil className="mr-2 size-4" />
                          Edit
                        </Link>
                      </MenuItem>
                      <MenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </MenuItem>
                    </MenuPopup>
                  </Menu>
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
                      <Globe className="mr-1 size-3" />
                      Remote
                    </Badge>
                  )}
                </div>

                <div className="space-y-1.5 text-muted-foreground text-sm">
                  {job.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.experienceLevel && (
                    <div className="flex items-center gap-2">
                      <Users className="size-3.5" />
                      <span>{experienceLevelLabels[job.experienceLevel as ExperienceLevel]}</span>
                    </div>
                  )}
                  {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency ?? undefined) && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="size-3.5" />
                      <span>
                        {formatSalary(
                          job.salaryMin,
                          job.salaryMax,
                          job.salaryCurrency ?? undefined,
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="size-3.5" />
                    <span>
                      {job.publishedAt
                        ? `Published ${new Date(job.publishedAt).toLocaleDateString()}`
                        : `Created ${new Date(job.createdAt).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
}
