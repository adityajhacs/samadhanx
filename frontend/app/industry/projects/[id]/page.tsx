
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  createCollaboration,
  getProject,
  getProjectTasks,
  type Project as ApiProject,
  type CollaborationType,
  type ProjectTask,
} from "@/lib/api/collaborations";

import { getAuthToken } from "@/lib/api/client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  GraduationCap,
  Handshake,
  Lightbulb,
  ListChecks,
  Target,
  Users,
  Wrench,
} from "lucide-react";

type ProjectStage =
  | "Solution Proposed"
  | "Project In Progress"
  | "Pilot / Validation"
  | "Impact / Deployment";

type ProjectDetail = {
  id: string;
  title: string;
  problem: string;
  university: string;
  stage: ProjectStage;
  status: string;
  description: string;
  solution: string;
  prototypeName: string;
  prototypeUrl: string | null;
  deadline: string | null;
  budget: number | null;
  expectedImpact: number | null;
  memberCount: number;
};

function mapStage(status: string | null): ProjectStage {
  switch ((status ?? "").toUpperCase()) {
    case "VALIDATION":
    case "TEAM_FORMATION":
    case "SOLUTION_DESIGN":
    case "PROTOTYPE":
      return "Project In Progress";

    case "FIELD_PILOT":
      return "Pilot / Validation";

    case "DEPLOYED":
    case "IMPACT_MEASUREMENT":
      return "Impact / Deployment";

    case "IDEA":
    default:
      return "Solution Proposed";
  }
}

function formatDeadline(deadline: string | null) {
  if (!deadline) {
    return "No deadline specified";
  }

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return "No deadline specified";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatBudget(budget: number | null) {
  if (budget === null || budget === undefined) {
    return "Not specified";
  }

  return `₹${budget.toLocaleString("en-IN")}`;
}

function mapApiProject(project: ApiProject): ProjectDetail {
  return {
    id: project.id,
    title: project.title,

    problem:
      project.problem_name ??
      "No problem is linked to this project.",

    university:
      project.university_name ??
      "University not linked",

    stage: mapStage(project.status),

    status: project.status ?? "IDEA",

    description:
      project.description ??
      "No project description is available.",

    solution:
      project.solution_name ??
      "No solution is linked to this project yet.",

    prototypeName:
      project.prototype_name ??
      "Prototype details not available.",

    prototypeUrl:
      project.prototype_url ?? null,

    deadline:
      project.deadline ?? null,

    budget:
      project.budget !== null &&
      project.budget !== undefined
        ? project.budget
        : null,

    expectedImpact:
      project.expected_impact !== null &&
      project.expected_impact !== undefined
        ? project.expected_impact
        : null,

    memberCount:
      project.member_count ?? 0,
  };
}

function getTaskProgress(tasks: ProjectTask[]) {
  if (tasks.length === 0) {
    return 0;
  }

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  return Math.round(
    (completedTasks / tasks.length) * 100
  );
}

function getTaskStatusLabel(
  status: ProjectTask["status"]
) {
  switch (status) {
    case "COMPLETED":
      return "Completed";

    case "IN_PROGRESS":
      return "In Progress";

    case "PENDING":
    default:
      return "Pending";
  }
}

function getTaskStatusClasses(
  status: ProjectTask["status"]
) {
  switch (status) {
    case "COMPLETED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "IN_PROGRESS":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "PENDING":
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

export default function IndustryProjectDetailPage() {
  const params = useParams();

  const projectId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const validProjectId =
    typeof projectId === "string"
      ? projectId
      : "";

  const [project, setProject] =
    useState<ProjectDetail | null>(null);

  const [tasks, setTasks] =
    useState<ProjectTask[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ============================================================
  // COLLABORATION REQUEST STATE
  // ============================================================

  const [showCollaborationForm, setShowCollaborationForm] =
    useState(false);

  const [collaborationType, setCollaborationType] =
    useState<CollaborationType>("MENTORSHIP");

  const [collaborationAmount, setCollaborationAmount] =
    useState("");

  const [collaborationDescription, setCollaborationDescription] =
    useState("");

  const [collaborationLoading, setCollaborationLoading] =
    useState(false);

  const [collaborationSuccess, setCollaborationSuccess] =
    useState("");

  const [collaborationError, setCollaborationError] =
    useState("");

  // ============================================================
  // LOAD PROJECT + TASKS
  // ============================================================

  useEffect(() => {
    if (!validProjectId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("Project not found.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadProject() {
      try {
        setLoading(true);
        setError("");

        const [projectData, taskData] =
          await Promise.all([
            getProject(validProjectId),
            getProjectTasks(validProjectId),
          ]);

        if (!cancelled) {
          setProject(
            mapApiProject(projectData)
          );

          setTasks(taskData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load project details."
          );

          setProject(null);
          setTasks([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [validProjectId]);

  // ============================================================
  // SEND COLLABORATION REQUEST
  // ============================================================

  const handleSendCollaboration = async () => {
    if (!project) {
      return;
    }

    setCollaborationError("");
    setCollaborationSuccess("");

    if (!collaborationDescription.trim()) {
      setCollaborationError(
        "Please describe how your industry can collaborate on this project."
      );
      return;
    }

    if (
      collaborationType === "FUNDING" &&
      collaborationAmount.trim() !== ""
    ) {
      const amount = Number(collaborationAmount);

      if (
        Number.isNaN(amount) ||
        amount < 0
      ) {
        setCollaborationError(
          "Please enter a valid funding amount."
        );
        return;
      }
    }

    try {
      setCollaborationLoading(true);

      const token = getAuthToken();

      if (!token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      // --------------------------------------------------------
      // Get currently logged-in user
      // --------------------------------------------------------

      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:8000";

      const userResponse = await fetch(
        `${apiBaseUrl}/api/auth/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!userResponse.ok) {
        let message =
          "Unable to load your account information.";

        try {
          const data =
            await userResponse.json();

          if (typeof data.detail === "string") {
            message = data.detail;
          }
        } catch {
          // Keep default message.
        }

        throw new Error(message);
      }

      const currentUser =
        await userResponse.json();

      // --------------------------------------------------------
      // Industry must be linked to an IndustryPartner
      // --------------------------------------------------------

      if (!currentUser.industry_id) {
        throw new Error(
          "Your account is not linked to an industry profile."
        );
      }

      // --------------------------------------------------------
      // Create collaboration request
      // --------------------------------------------------------

      await createCollaboration({
        project_id: project.id,
        industry_partner_id:
          currentUser.industry_id,
        collaboration_type:
          collaborationType,
        amount:
          collaborationType === "FUNDING" &&
          collaborationAmount.trim() !== ""
            ? Number(collaborationAmount)
            : null,
        description:
          collaborationDescription.trim(),
      });

      setCollaborationSuccess(
        "Collaboration request sent successfully."
      );

      setCollaborationDescription("");
      setCollaborationAmount("");
      setCollaborationType("MENTORSHIP");

      setShowCollaborationForm(false);
    } catch (err) {
      setCollaborationError(
        err instanceof Error
          ? err.message
          : "Failed to send collaboration request."
      );
    } finally {
      setCollaborationLoading(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm font-medium text-slate-600">
            Loading project details...
          </p>
        </div>
      </main>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error || !project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-rose-700">
            {error || "Project not found."}
          </p>

          <Link
            href="/industry/projects"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  // ============================================================
  // TASK COUNTS
  // ============================================================

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "PENDING"
  ).length;

  const taskProgress =
    getTaskProgress(tasks);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">

      {/* ========================================================
          NAVBAR
      ======================================================== */}

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
              className="text-sm font-semibold text-teal-700"
            >
              Projects
            </Link>

            <Link
              href="/industry/collaborations"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
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
              href="/industry/projects"
              className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
            >
              Explore Projects
            </Link>

          </div>
        </div>
      </nav>

      {/* ========================================================
          HERO
      ======================================================== */}

      <section className="relative overflow-hidden border-b border-teal-900 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900">

        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl" />

        <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-10">

          <Link
            href="/industry/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-teal-100 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

          <div className="mt-7 max-w-4xl">

            <div className="flex flex-wrap items-center gap-2">

              <span className="rounded-full border border-teal-300/40 bg-teal-800/70 px-3 py-1.5 text-xs font-bold text-teal-100">
                {project.id}
              </span>

              <span className="rounded-full border border-emerald-300/40 bg-emerald-800/60 px-3 py-1.5 text-xs font-bold text-emerald-100">
                {project.stage}
              </span>

              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white">
                {project.status}
              </span>

            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              {project.title}
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-teal-50">
              {project.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-teal-100">

              <span className="inline-flex items-center gap-2">
                <GraduationCap size={16} />
                {project.university}
              </span>

              <span className="inline-flex items-center gap-2">
                <Clock3 size={16} />
                Deadline:{" "}
                {formatDeadline(project.deadline)}
              </span>

              <span className="inline-flex items-center gap-2">
                <Users size={16} />
                {project.memberCount}{" "}
                {project.memberCount === 1
                  ? "Member"
                  : "Members"}
              </span>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MAIN
      ======================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-8">

        <div className="grid gap-6 lg:grid-cols-[1fr_330px]">

          <div className="space-y-6">

            {/* ==================================================
                PROBLEM
            ================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start gap-4">

                <div className="rounded-xl bg-rose-100 p-3">
                  <Target className="h-5 w-5 text-rose-700" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
                    Community Problem
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Problem being addressed
                  </h2>
                </div>

              </div>

              <div className="mt-5 rounded-xl border border-rose-100 bg-rose-50 p-5">

                <p className="text-base font-semibold leading-7 text-slate-800">
                  {project.problem}
                </p>

              </div>
            </section>

            {/* ==================================================
                SOLUTION
            ================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start gap-4">

                <div className="rounded-xl bg-teal-100 p-3">
                  <Lightbulb className="h-5 w-5 text-teal-700" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    Proposed Solution
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Solution linked to this project
                  </h2>
                </div>

              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                {project.solution}
              </p>

            </section>

            {/* ==================================================
                PROTOTYPE
            ================================================== */}

            <section className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6 shadow-sm">

              <div className="flex items-start gap-4">

                <div className="rounded-xl bg-teal-600 p-3">
                  <Wrench className="h-5 w-5 text-white" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    Prototype
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Current prototype
                  </h2>
                </div>

              </div>

              <p className="mt-5 text-sm leading-7 text-slate-700">
                {project.prototypeName}
              </p>

              {project.prototypeUrl && (
                <a
                  href={project.prototypeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2.5 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
                >
                  View Prototype
                  <ExternalLink size={15} />
                </a>
              )}

            </section>

            {/* ==================================================
                TASK PROGRESS
            ================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-4">

                  <div className="rounded-xl bg-teal-100 p-3">
                    <ListChecks className="h-5 w-5 text-teal-700" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                      Team Tasks
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      Project Work Progress
                    </h2>
                  </div>

                </div>

                <span className="text-2xl font-bold text-teal-700">
                  {taskProgress}%
                </span>

              </div>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-teal-600 transition-all"
                  style={{
                    width: `${taskProgress}%`,
                  }}
                />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-4">

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Total
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {totalTasks}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-medium text-emerald-700">
                    Completed
                  </p>

                  <p className="mt-1 text-2xl font-bold text-emerald-700">
                    {completedTasks}
                  </p>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-medium text-amber-700">
                    In Progress
                  </p>

                  <p className="mt-1 text-2xl font-bold text-amber-700">
                    {inProgressTasks}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Pending
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-700">
                    {pendingTasks}
                  </p>
                </div>

              </div>

              <div className="mt-6">

                <div className="flex items-center justify-between">

                  <h3 className="text-sm font-bold text-slate-900">
                    Tasks
                  </h3>

                  <span className="text-xs text-slate-500">
                    Read-only view
                  </span>

                </div>

                {tasks.length === 0 ? (
                  <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">

                    <ListChecks className="mx-auto h-7 w-7 text-slate-400" />

                    <p className="mt-2 text-sm font-medium text-slate-600">
                      No tasks have been added to this project yet.
                    </p>

                  </div>
                ) : (
                  <div className="mt-4 space-y-3">

                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-xl border border-slate-200 bg-white p-4"
                      >

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                          <div className="flex items-start gap-3">

                            {task.status === "COMPLETED" ? (
                              <CheckCircle2
                                size={20}
                                className="mt-0.5 shrink-0 text-emerald-600"
                              />
                            ) : (
                              <Clock3
                                size={20}
                                className="mt-0.5 shrink-0 text-slate-400"
                              />
                            )}

                            <div>

                              <p className="text-sm font-semibold text-slate-900">
                                {task.title}
                              </p>

                              {task.description && (
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                  {task.description}
                                </p>
                              )}

                            </div>

                          </div>

                          <span
                            className={`inline-flex w-fit shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${getTaskStatusClasses(
                              task.status
                            )}`}
                          >
                            {getTaskStatusLabel(
                              task.status
                            )}
                          </span>

                        </div>

                      </div>
                    ))}

                  </div>
                )}

              </div>

              <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50 p-4">

                <p className="text-sm leading-6 text-slate-700">
                  Project progress is calculated from actual
                  task completion: completed tasks divided by
                  total tasks.
                </p>

              </div>

            </section>

            {/* ==================================================
                EXPECTED IMPACT
            ================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start gap-4">

                <div className="rounded-xl bg-emerald-100 p-3">
                  <Target className="h-5 w-5 text-emerald-700" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Expected Impact
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Expected project impact
                  </h2>
                </div>

              </div>

              <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-5">

                {project.expectedImpact !== null ? (
                  <p className="text-sm leading-7 text-slate-700">
                    Expected impact value:{" "}
                    <span className="font-bold">
                      {project.expectedImpact}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm leading-7 text-slate-600">
                    Expected impact has not been specified for
                    this project yet.
                  </p>
                )}

              </div>

            </section>

          </div>

          {/* ====================================================
              SIDEBAR
          ==================================================== */}

          <aside className="space-y-5">

            {/* ==================================================
                COLLABORATION
            ================================================== */}

            <div className="rounded-2xl border border-teal-200 bg-white p-5 shadow-sm">

              <div className="w-fit rounded-xl bg-teal-100 p-3">
                <Handshake className="h-5 w-5 text-teal-700" />
              </div>

              <h2 className="mt-4 text-lg font-bold">
                Collaboration Opportunity
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Offer your industry&apos;s support to the
                university team through the SamadhanX
                collaboration workflow.
              </p>

              {/* Success message when form has already been submitted */}
              {collaborationSuccess && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-sm font-medium text-emerald-700">
                    {collaborationSuccess}
                  </p>
                </div>
              )}

              {!showCollaborationForm ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowCollaborationForm(true);
                    setCollaborationError("");
                    setCollaborationSuccess("");
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  Offer Collaboration
                  <ArrowRight size={16} />
                </button>
              ) : (
                <div className="mt-5 space-y-4">

                  {/* Collaboration Type */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Collaboration Type
                    </label>

                    <select
                      value={collaborationType}
                      onChange={(event) =>
                        setCollaborationType(
                          event.target
                            .value as CollaborationType
                        )
                      }
                      disabled={collaborationLoading}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                    >
                      <option value="FUNDING">
                        Funding
                      </option>

                      <option value="MENTORSHIP">
                        Mentorship
                      </option>

                      <option value="HARDWARE">
                        Hardware
                      </option>

                      <option value="TESTING">
                        Testing
                      </option>

                      <option value="PROTOTYPING">
                        Prototyping
                      </option>
                    </select>

                  </div>

                  {/* Funding Amount */}
                  {collaborationType === "FUNDING" && (
                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Funding Amount
                      </label>

                      <div className="relative">

                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                          ₹
                        </span>

                        <input
                          type="number"
                          min="0"
                          value={collaborationAmount}
                          onChange={(event) =>
                            setCollaborationAmount(
                              event.target.value
                            )
                          }
                          placeholder="Enter amount"
                          disabled={
                            collaborationLoading
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-8 pr-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                        />

                      </div>

                    </div>
                  )}

                  {/* Description */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Collaboration Details
                    </label>

                    <textarea
                      value={
                        collaborationDescription
                      }
                      onChange={(event) =>
                        setCollaborationDescription(
                          event.target.value
                        )
                      }
                      placeholder="Explain how your industry can support this project..."
                      rows={5}
                      disabled={
                        collaborationLoading
                      }
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />

                  </div>

                  {/* Error */}
                  {collaborationError && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-3">
                      <p className="text-xs leading-5 text-rose-700">
                        {collaborationError}
                      </p>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-2">

                    <button
                      type="button"
                      onClick={() => {
                        setShowCollaborationForm(
                          false
                        );
                        setCollaborationError("");
                      }}
                      disabled={
                        collaborationLoading
                      }
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleSendCollaboration
                      }
                      disabled={
                        collaborationLoading
                      }
                      className="flex-1 rounded-xl bg-teal-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {collaborationLoading
                        ? "Sending..."
                        : "Send Request"}
                    </button>

                  </div>

                </div>
              )}

            </div>

            {/* ==================================================
                UNIVERSITY
            ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-slate-100 p-3">
                  <GraduationCap className="h-5 w-5 text-slate-700" />
                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    University Partner
                  </p>

                  <h3 className="mt-1 text-sm font-bold">
                    {project.university}
                  </h3>

                </div>

              </div>

              <div className="mt-4 border-t border-slate-100 pt-4">

                <p className="text-xs leading-5 text-slate-500">
                  The university team is responsible for
                  developing and progressing the project through
                  its current lifecycle stage.
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-600">

                  <Users
                    size={14}
                    className="text-teal-600"
                  />

                  {project.memberCount}{" "}
                  {project.memberCount === 1
                    ? "project member"
                    : "project members"}

                </div>

              </div>

            </div>

            {/* ==================================================
                PROJECT OVERVIEW
            ================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Project Overview
              </p>

              <div className="mt-4 space-y-4">

                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500">
                    Stage
                  </span>

                  <span className="text-right text-sm font-bold">
                    {project.stage}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500">
                    Status
                  </span>

                  <span className="text-right text-sm font-bold">
                    {project.status}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500">
                    Deadline
                  </span>

                  <span className="text-right text-sm font-bold">
                    {formatDeadline(
                      project.deadline
                    )}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500">
                    Budget
                  </span>

                  <span className="text-right text-sm font-bold">
                    {formatBudget(project.budget)}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-500">
                    Task Progress
                  </span>

                  <span className="text-right text-sm font-bold text-teal-700">
                    {taskProgress}%
                  </span>
                </div>

              </div>

            </div>

          </aside>

        </div>
      </section>

      {/* ========================================================
          BOTTOM CTA
      ======================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-10">

        <div className="overflow-hidden rounded-2xl bg-slate-950">

          <div className="flex flex-col gap-6 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-2xl">

              <p className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Ready to contribute?
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Help take this project toward real-world impact.
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Industry partners can offer funding, mentorship,
                hardware, testing, or prototyping support.
              </p>

            </div>

            <button
              type="button"
              onClick={() => {
                setShowCollaborationForm(true);
                setCollaborationError("");
                setCollaborationSuccess("");
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-500"
            >
              Start Collaboration
              <ArrowRight size={16} />
            </button>

          </div>

        </div>

      </section>

      {/* ========================================================
          FOOTER
      ======================================================== */}

      <footer className="border-t border-slate-800 bg-slate-950 py-5 text-center text-xs text-slate-500">
        © 2026 SamadhanX • Ideas → Action → Impact
      </footer>

    </main>
  );
}

