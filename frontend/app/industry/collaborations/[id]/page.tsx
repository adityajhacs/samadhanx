
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Handshake,
  Target,
  Users,
  Wrench,
} from "lucide-react";

import {
  type Project,
  type ProjectTask,
} from "@/lib/api/collaborations";

import {
  apiRequest,
  getAuthToken,
} from "@/lib/api/client";

type CollaborationStatus =
  | "Pending Review"
  | "Under Discussion"
  | "Active"
  | "Completed"
  | "Declined";

type CollaborationDetail = {
  id: string;
  projectId: string;
  project: string;
  problem: string;
  university: string;
  supportType: string;
  status: CollaborationStatus;
  commitment: string;
  progress: number | null;
  submitted: string;
  overview: string;
  supportScope: string;
  nextAction: string;
  tasks: ProjectTask[];
};

type ApiCollaboration = {
  id: string;
  project_id: string | null;
  industry_partner_id: string | null;
  collaboration_type: string | null;
  amount: number | null;
  status: string | null;
  description: string | null;
  created_at: string | null;
};

const statusMap: Record<string, CollaborationStatus> = {
  REQUESTED: "Pending Review",
  UNDER_REVIEW: "Under Discussion",
  ACCEPTED: "Active",
  COMPLETED: "Completed",
  REJECTED: "Declined",
};

const supportTypeMap: Record<string, string> = {
  FUNDING: "Funding",
  MENTORSHIP: "Mentorship",
  HARDWARE: "Hardware",
  TESTING: "Testing",
  PROTOTYPING: "Prototyping",
};

const statusOrder: CollaborationStatus[] = [
  "Pending Review",
  "Under Discussion",
  "Active",
  "Completed",
];

function formatAmount(amount: number | null) {
  if (amount == null) {
    return "—";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(date: string | null) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getTaskProgress(tasks: ProjectTask[]) {
  if (tasks.length === 0) {
    return null;
  }

  const completed = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  return Math.round((completed / tasks.length) * 100);
}

function getTaskCounts(tasks: ProjectTask[]) {
  return {
    total: tasks.length,
    completed: tasks.filter(
      (task) => task.status === "COMPLETED"
    ).length,
    inProgress: tasks.filter(
      (task) => task.status === "IN_PROGRESS"
    ).length,
    pending: tasks.filter(
      (task) => task.status === "PENDING"
    ).length,
  };
}

function getTaskStatusLabel(status: ProjectTask["status"]) {
  switch (status) {
    case "COMPLETED":
      return "Completed";

    case "IN_PROGRESS":
      return "In Progress";

    case "PENDING":
      return "Pending";

    default:
      return status;
  }
}

function getTaskStatusClass(status: ProjectTask["status"]) {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "IN_PROGRESS":
      return "bg-sky-50 text-sky-700 border-sky-200";

    case "PENDING":
      return "bg-slate-100 text-slate-600 border-slate-200";

    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

/*
 * Authenticated GET helper.
 *
 * Earlier this page manually searched localStorage/sessionStorage.
 * Now it uses the project's central getAuthToken() helper so the
 * same authentication mechanism is used throughout the frontend.
 */
async function getAuthenticatedApiData<T>(
  path: string
): Promise<T> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required. Please login again.");
  }

  return apiRequest<T>(path, {
    method: "GET",
    token,
  });
}

export default function CollaborationDetailPage() {
  const params = useParams<{ id: string }>();

  const collaborationId = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const [collaboration, setCollaboration] =
    useState<CollaborationDetail | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!collaborationId) {
        setError("Collaboration ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        /*
         * Collaboration itself is protected by authentication.
         */
        const apiCollaboration =
          await getAuthenticatedApiData<ApiCollaboration>(
            `/api/collaborations/${encodeURIComponent(
              collaborationId
            )}`
          );

        let project: Project | null = null;
        let tasks: ProjectTask[] = [];

        if (apiCollaboration.project_id) {
          /*
           * IMPORTANT:
           * Do NOT use the old getProject() helper here because
           * the project endpoint is authenticated as well.
           *
           * We now explicitly pass the authenticated token.
           */
          try {
            project =
              await getAuthenticatedApiData<Project>(
                `/api/projects/${encodeURIComponent(
                  apiCollaboration.project_id
                )}`
              );
          } catch (projectError) {
            console.warn(
              "Project details could not be loaded:",
              projectError
            );
          }

          /*
           * Project tasks are also authenticated.
           */
          try {
            tasks =
              await getAuthenticatedApiData<ProjectTask[]>(
                `/api/project-tasks/project/${encodeURIComponent(
                  apiCollaboration.project_id
                )}`
              );
          } catch (taskError) {
            console.warn(
              "Project tasks could not be loaded:",
              taskError
            );
          }
        }

        const mappedStatus =
          statusMap[apiCollaboration.status ?? ""] ??
          "Pending Review";

        const progress = getTaskProgress(tasks);

        const mapped: CollaborationDetail = {
          id: apiCollaboration.id,

          projectId:
            apiCollaboration.project_id ?? "",

          project:
            project?.title ??
            "Untitled Project",

          problem:
            project?.description ??
            apiCollaboration.description ??
            "No project description available.",

          university:
            project?.university_name ??
            "University information unavailable",

          supportType:
            supportTypeMap[
              apiCollaboration.collaboration_type ?? ""
            ] ??
            "Collaboration Support",

          status: mappedStatus,

          commitment:
            formatAmount(apiCollaboration.amount),

          progress,

          submitted:
            formatDate(apiCollaboration.created_at),

          overview:
            project?.description ??
            apiCollaboration.description ??
            "No collaboration overview available.",

          supportScope:
            apiCollaboration.description ??
            "No additional collaboration scope has been provided.",

          nextAction:
            mappedStatus === "Completed"
              ? "Collaboration completed. Review the project outcomes and future opportunities."
              : mappedStatus === "Declined"
                ? "This collaboration request was declined."
                : "Continue the collaboration according to the agreed scope and project work.",

          tasks,
        };

        if (!cancelled) {
          setCollaboration(mapped);
        }
      } catch (err) {
        console.error(
          "Failed to load collaboration:",
          err
        );

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load collaboration."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [collaborationId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Loading collaboration...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Fetching partnership workspace
          </p>
        </div>
      </main>
    );
  }

  if (error || !collaboration) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-lg rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <Handshake className="h-6 w-6" />
          </div>

          <h1 className="mt-4 text-lg font-bold text-slate-900">
            Unable to load collaboration
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error ||
              "The requested collaboration could not be found."}
          </p>

          <Link
            href="/industry/collaborations"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Collaborations
          </Link>
        </div>
      </main>
    );
  }

  const currentIndex = statusOrder.indexOf(
    collaboration.status
  );

  const taskCounts = getTaskCounts(
    collaboration.tasks
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            href="/industry/dashboard"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-sm font-bold text-white shadow-sm">
              S
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">
                SamadhanX
              </p>

              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Ideas → Action → Impact
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-7 md:flex">

            <Link
              href="/industry/dashboard"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Dashboard
            </Link>

            <Link
              href="/industry/projects"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Projects
            </Link>

            <Link
              href="/industry/collaborations"
              className="text-sm font-semibold text-teal-700"
            >
              Collaborations
            </Link>

            <Link
              href="/industry/profile"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Profile
            </Link>
           
<Link
  href={`/industry/collaborations/${collaboration.id}/contact`}
  className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
>
  Contact
</Link>


            <Link
              href="/industry/projects"
              className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
            >
              Explore Projects
            </Link>

          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="border-b border-teal-900 bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950">
        <div className="mx-auto max-w-7xl px-6 py-8">

          <Link
            href="/industry/collaborations"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-teal-200 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Collaborations
          </Link>

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-3xl">

              <div className="mb-3 flex flex-wrap items-center gap-2">

                <span className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-teal-100">
                  {collaboration.id}
                </span>

                {collaboration.projectId && (
                  <span className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-teal-100">
                    Project: {collaboration.projectId}
                  </span>
                )}

                <StatusBadge
                  status={collaboration.status}
                />

              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {collaboration.project}
              </h1>

              <p className="mt-3 text-sm leading-6 text-teal-100/80 sm:text-base">
                {collaboration.problem}
              </p>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-teal-100/80">

                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-teal-300" />
                  {collaboration.university}
                </span>

                <span className="flex items-center gap-2">
                  <Handshake className="h-4 w-4 text-teal-300" />
                  {collaboration.supportType}
                </span>

              </div>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">

              <p className="text-xs font-semibold uppercase tracking-wider text-teal-200">
                Support Commitment
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {collaboration.commitment}
              </p>

              <p className="mt-1 text-xs text-teal-100/70">
                {collaboration.supportType}
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* Collaboration Lifecycle */}
      <section className="mx-auto max-w-7xl px-6 pt-7">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Collaboration Lifecycle
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Partnership Progress
              </h2>
            </div>

            <span className="text-sm font-bold text-teal-700">
              {collaboration.progress == null
                ? "Task progress unavailable"
                : `${collaboration.progress}% task progress`}
            </span>

          </div>

          <div className="relative">

            <div className="absolute left-0 right-0 top-5 hidden h-0.5 bg-slate-200 md:block" />

            <div
              className="absolute left-0 top-5 hidden h-0.5 bg-teal-600 transition-all md:block"
              style={{
                width:
                  currentIndex <= 0
                    ? "0%"
                    : `${(currentIndex / (statusOrder.length - 1)) * 100}%`,
              }}
            />

            <div className="relative grid gap-5 md:grid-cols-4">

              {statusOrder.map((status, index) => {

                const completed =
                  index <= currentIndex;

                const current =
                  index === currentIndex;

                return (
                  <div
                    key={status}
                    className="flex gap-3 md:block"
                  >

                    <div
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white ${
                        completed
                          ? "bg-teal-600 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {completed ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-current" />
                      )}
                    </div>

                    <div className="pt-1 md:mt-3 md:pt-0">

                      <p
                        className={`text-xs font-bold ${
                          current
                            ? "text-teal-700"
                            : completed
                              ? "text-slate-700"
                              : "text-slate-400"
                        }`}
                      >
                        {status}
                      </p>

                      <p className="mt-1 text-[11px] leading-4 text-slate-400">
                        {getLifecycleDescription(status)}
                      </p>

                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-7 lg:grid-cols-[1fr_340px]">

        {/* Left */}
        <div className="space-y-6">

          {/* Overview */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <SectionHeading
              icon={Handshake}
              label="Collaboration Overview"
            />

            <p className="mt-5 text-sm leading-7 text-slate-600">
              {collaboration.overview}
            </p>

            <div className="mt-6 rounded-xl border border-teal-100 bg-teal-50/60 p-5">

              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Collaboration Scope
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {collaboration.supportScope}
              </p>

            </div>

          </section>

          {/* Project Task Progress */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <SectionHeading
                icon={Target}
                label="Project Work Progress"
              />

              {collaboration.progress != null && (
                <span className="text-sm font-bold text-teal-700">
                  {collaboration.progress}% complete
                </span>
              )}

            </div>

            {collaboration.tasks.length === 0 ? (

              <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">

                <Target className="mx-auto h-7 w-7 text-slate-400" />

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No project tasks available
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Task-based progress will appear here once the
                  university project team creates tasks.
                </p>

              </div>

            ) : (

              <div className="mt-6">

                <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 transition-all"
                    style={{
                      width: `${collaboration.progress ?? 0}%`,
                    }}
                  />

                </div>

                <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

                  <TaskStat
                    label="Total"
                    value={taskCounts.total}
                  />

                  <TaskStat
                    label="Completed"
                    value={taskCounts.completed}
                  />

                  <TaskStat
                    label="In Progress"
                    value={taskCounts.inProgress}
                  />

                  <TaskStat
                    label="Pending"
                    value={taskCounts.pending}
                  />

                </div>

                <div className="space-y-3">

                  {collaboration.tasks.map((task) => (

                    <div
                      key={task.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"
                    >

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                        <div className="min-w-0">

                          <h3 className="text-sm font-bold text-slate-900">
                            {task.title}
                          </h3>

                          {task.description && (
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {task.description}
                            </p>
                          )}

                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getTaskStatusClass(
                            task.status
                          )}`}
                        >
                          {getTaskStatusLabel(task.status)}
                        </span>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            )}

          </section>

          {/* Responsibilities */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <SectionHeading
              icon={Users}
              label="Partnership Responsibilities"
            />

            <div className="mt-5 grid gap-4 md:grid-cols-3">

              <RoleCard
                title="University"
                subtitle="Solution Development"
                description="The university team develops and executes the project solution."
                icon={Building2}
                iconBg="bg-teal-50"
                iconColor="text-teal-700"
              />

              <RoleCard
                title="Industry"
                subtitle="Support & Expertise"
                description="The industry partner provides the agreed collaboration support and domain expertise."
                icon={Wrench}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-700"
              />

              <RoleCard
                title="Project"
                subtitle="Execution & Progress"
                description="Project progress is tracked through the actual tasks created for the project."
                icon={Target}
                iconBg="bg-sky-50"
                iconColor="text-sky-700"
              />

            </div>

          </section>

          {/* Collaboration Milestones */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <SectionHeading
              icon={Target}
              label="Collaboration Milestones"
            />

            <div className="mt-6 space-y-4">

              <Milestone
                number={1}
                title="Collaboration Submitted"
                description="The collaboration proposal was submitted."
                status="Completed"
                date={collaboration.submitted}
              />

              <Milestone
                number={2}
                title="Current Collaboration Status"
                description={`Current status: ${collaboration.status}.`}
                status={
                  collaboration.status === "Completed"
                    ? "Completed"
                    : "Current"
                }
                date="Current"
              />

              <Milestone
                number={3}
                title="Project Work Progress"
                description={
                  collaboration.progress == null
                    ? "Project task progress is not available yet."
                    : `${taskCounts.completed} of ${taskCounts.total} project tasks are completed.`
                }
                status={
                  collaboration.progress === 100
                    ? "Completed"
                    : "Upcoming"
                }
                date={
                  collaboration.progress === 100
                    ? "Completed"
                    : "Ongoing"
                }
              />

            </div>

          </section>

        </div>

        {/* Right */}
        <aside className="space-y-5">

          {/* Current Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Current Status
            </p>

            <div className="mt-3 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              </div>

              <div>

                <p className="text-base font-bold text-slate-900">
                  {collaboration.status}
                </p>

                <p className="text-xs text-slate-500">
                  Collaboration lifecycle stage
                </p>

              </div>

            </div>

            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between">

                <span className="text-xs font-semibold text-slate-500">
                  Project task progress
                </span>

                <span className="text-sm font-bold text-teal-700">
                  {collaboration.progress == null
                    ? "—"
                    : `${collaboration.progress}%`}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500"
                  style={{
                    width: `${collaboration.progress ?? 0}%`,
                  }}
                />

              </div>

            </div>

          </div>

          {/* Next Action */}
          <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50 p-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
              <Target className="h-5 w-5" />
            </div>

            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-teal-700">
              Next Action
            </p>

            <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
              {collaboration.nextAction}
            </p>

          </div>

          {/* Support Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Support Details
            </p>

            <div className="mt-4 space-y-4">

              <DetailRow
                icon={Handshake}
                label="Support Type"
                value={collaboration.supportType}
              />

              <DetailRow
                icon={CircleDollarSign}
                label="Commitment"
                value={collaboration.commitment}
              />

              <DetailRow
                icon={Clock3}
                label="Submitted"
                value={collaboration.submitted}
              />

              <DetailRow
                icon={Building2}
                label="University"
                value={collaboration.university}
              />

            </div>

          </div>

          {/* Project Link */}
          {collaboration.projectId && (
            <Link
              href={`/industry/projects/${collaboration.projectId}`}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white transition hover:bg-slate-800"
            >
              <div>

                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                  Linked Project
                </p>

                <p className="mt-1 text-sm font-bold">
                  View Project Details
                </p>

              </div>

              <ArrowRight className="h-5 w-5 text-teal-300" />

            </Link>
          )}

        </aside>

      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-center text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">

          <p>
            © 2026 SamadhanX • Ideas → Action → Impact
          </p>

          <p>
            Industry Innovation Network
          </p>

        </div>

      </footer>

    </main>
  );
}

function StatusBadge({
  status,
}: {
  status: CollaborationStatus;
}) {
  const styles: Record<
    CollaborationStatus,
    string
  > = {
    "Pending Review":
      "bg-amber-400/15 text-amber-100 border-amber-300/20",

    "Under Discussion":
      "bg-sky-400/15 text-sky-100 border-sky-300/20",

    Active:
      "bg-emerald-400/15 text-emerald-100 border-emerald-300/20",

    Completed:
      "bg-teal-400/15 text-teal-100 border-teal-300/20",

    Declined:
      "bg-rose-400/15 text-rose-100 border-rose-300/20",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function SectionHeading({
  icon: Icon,
  label,
}: {
  icon: typeof Handshake;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
        <Icon className="h-4 w-4" />
      </div>

      <h2 className="text-base font-bold text-slate-900">
        {label}
      </h2>

    </div>
  );
}

function RoleCard({
  title,
  subtitle,
  description,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Building2;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}
      >
        <Icon
          className={`h-4 w-4 ${iconColor}`}
        />
      </div>

      <p className="mt-4 text-sm font-bold text-slate-900">
        {title}
      </p>

      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-700">
        {subtitle}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Handshake;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold leading-5 text-slate-700">
          {value}
        </p>

      </div>

    </div>
  );
}

function TaskStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">

      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

function Milestone({
  number,
  title,
  description,
  status,
  date,
}: {
  number: number;
  title: string;
  description: string;
  status: "Completed" | "Current" | "Upcoming";
  date: string;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        status === "Current"
          ? "border-teal-200 bg-teal-50/50"
          : "border-slate-100 bg-slate-50/50"
      }`}
    >

      <div className="flex gap-4">

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            status === "Completed"
              ? "bg-teal-600 text-white"
              : status === "Current"
                ? "bg-teal-100 text-teal-700"
                : "bg-slate-200 text-slate-400"
          }`}
        >
          {status === "Completed" ? (
            <Check className="h-4 w-4" />
          ) : (
            <span className="text-xs font-bold">
              {number}
            </span>
          )}
        </div>

        <div className="flex-1">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h3 className="text-sm font-bold text-slate-900">
                {title}
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {description}
              </p>

            </div>

            <div className="shrink-0">

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  status === "Completed"
                    ? "bg-teal-100 text-teal-700"
                    : status === "Current"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {status}
              </span>

              <p className="mt-2 text-right text-[10px] text-slate-400">
                {date}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

function getLifecycleDescription(
  status: CollaborationStatus
) {
  const descriptions: Record<
    CollaborationStatus,
    string
  > = {
    "Pending Review":
      "Proposal submitted",

    "Under Discussion":
      "Terms and scope",

    Active:
      "Execution underway",

    Completed:
      "Impact delivered",

    Declined:
      "Proposal declined",
  };

  return descriptions[status];
}

