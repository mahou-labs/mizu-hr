import { cn } from "@/utils/cn";
import { orpc } from "@/utils/orpc-client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Briefcase, Clock, DollarSign, MapPin, Monitor, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

const employmentTypeLabels: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
};

const experienceLevelLabels: Record<string, string> = {
  entry: "Entry Level",
  mid: "Mid Level",
  senior: "Senior",
  lead: "Lead",
};

function formatSalary(min?: number | null, max?: number | null, currency?: string | null) {
  const fmt = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "USD",
    maximumFractionDigits: 0,
  });
  if (min && max) return `${fmt.format(min)} - ${fmt.format(max)}`;
  if (min) return `From ${fmt.format(min)}`;
  if (max) return `Up to ${fmt.format(max)}`;
  return null;
}

function timeAgo(date: Date | string | null | undefined) {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    jobId: (search.jobId as string) || undefined,
  }),
  loaderDeps: ({ search }) => ({ jobId: search.jobId }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(orpc.job.listPublished.queryOptions());
  },
  component: JobBoardRoute,
});

function JobBoardRoute() {
  const { jobId } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const { data: jobs = [] } = useQuery(orpc.job.listPublished.queryOptions());

  const selectedJob = jobId ? jobs.find((j) => j.id === jobId) : null;

  const selectJob = useCallback(
    (id: string) => {
      navigate({ search: { jobId: id } });
    },
    [navigate],
  );

  const clearSelection = useCallback(() => {
    navigate({ search: { jobId: undefined } });
  }, [navigate]);

  // Close panel on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedJob) clearSelection();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedJob, clearSelection]);

  return (
    <div className="min-h-svh">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Careers</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {jobs.length} open {jobs.length === 1 ? "position" : "positions"}
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        {jobs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex gap-6">
            {/* Job list */}
            <div
              className={cn(
                "flex-1 space-y-3 transition-all duration-200",
                selectedJob && "max-w-[50%]",
              )}
            >
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSelected={job.id === jobId}
                  onClick={() => selectJob(job.id)}
                />
              ))}
            </div>

            {/* Detail panel */}
            {selectedJob && <JobDetailPanel job={selectedJob} onClose={clearSelection} />}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Components ---

type Job = {
  id: string;
  title: string;
  description: string;
  department: string | null;
  location: string;
  remote: boolean;
  employmentType: string;
  experienceLevel: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  publishedAt: Date | string | null;
};

function JobCard({
  job,
  isSelected,
  onClick,
}: {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
}) {
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group w-full cursor-pointer rounded-lg border bg-card p-5 text-left transition-all duration-150",
        "hover:border-zinc-300 hover:shadow-sm",
        isSelected && "border-zinc-400 shadow-sm ring-1 ring-zinc-200",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-card-foreground">{job.title}</h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
            {job.department && (
              <span className="flex items-center gap-1.5">
                <Briefcase className="size-3.5" />
                {job.department}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {job.location}
              {job.remote && " (Remote)"}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {employmentTypeLabels[job.employmentType] ?? job.employmentType}
            </span>
          </div>
        </div>

        <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(job.publishedAt)}</span>
      </div>

      {/* Tags row */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {job.experienceLevel && (
          <Tag>{experienceLevelLabels[job.experienceLevel] ?? job.experienceLevel}</Tag>
        )}
        {job.remote && <Tag>Remote</Tag>}
        {salary && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <DollarSign className="size-3" />
            {salary}
          </span>
        )}
      </div>
    </button>
  );
}

function JobDetailPanel({ job, onClose }: { job: Job; onClose: () => void }) {
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);
  const panelRef = useRef<HTMLDivElement>(null);

  // Scroll panel to top when job changes
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [job.id]);

  return (
    <div
      ref={panelRef}
      className="sticky top-0 h-[calc(100svh-140px)] w-full max-w-md shrink-0 animate-in fade-in slide-in-from-right-4 overflow-y-auto rounded-lg border bg-card"
    >
      {/* Panel header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card/95 px-6 py-4 backdrop-blur-sm">
        <h2 className="text-lg font-semibold">{job.title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="space-y-6 px-6 py-5">
        {/* Meta info */}
        <div className="space-y-3">
          <MetaRow icon={<MapPin className="size-4" />}>
            {job.location}
            {job.remote && " (Remote)"}
          </MetaRow>

          <MetaRow icon={<Clock className="size-4" />}>
            {employmentTypeLabels[job.employmentType] ?? job.employmentType}
          </MetaRow>

          {job.department && (
            <MetaRow icon={<Briefcase className="size-4" />}>{job.department}</MetaRow>
          )}

          {job.experienceLevel && (
            <MetaRow icon={<Monitor className="size-4" />}>
              {experienceLevelLabels[job.experienceLevel] ?? job.experienceLevel}
            </MetaRow>
          )}

          {salary && <MetaRow icon={<DollarSign className="size-4" />}>{salary}</MetaRow>}
        </div>

        <hr className="border-border" />

        {/* Description */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-foreground">About this role</h3>
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {job.description}
          </div>
        </div>

        {/* Published date */}
        {job.publishedAt && (
          <p className="text-xs text-muted-foreground">Posted {timeAgo(job.publishedAt)}</p>
        )}
      </div>
    </div>
  );
}

function MetaRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
      <span className="text-muted-foreground/70">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
      {children}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Briefcase className="size-12 text-muted-foreground/40" />
      <h2 className="mt-4 text-lg font-medium">No open positions</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        There are no job openings at this time. Check back later for new opportunities.
      </p>
    </div>
  );
}
