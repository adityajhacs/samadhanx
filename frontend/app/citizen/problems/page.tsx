
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  University,
  Wrench,
  Rocket,
  Target,
  Handshake,
} from "lucide-react";

import {
  getMyProblems,
  getProblemProgress,
  type Problem,
  type ProblemProgress,
} from "@/lib/api/problems";

const categories = [
  "All Categories",
  "Road Infrastructure",
  "Education",
  "Healthcare",
  "Environment",
  "Public Safety",
  "Transport",
  "Sanitation",
  "Water Management",
  "Agriculture",
];

const statuses = [
  "All Status",
  "Pending",
  "Under Review",
  "In Progress",
  "Resolved",
  "Rejected",
];

const lifecycleStages = [
  {
    key: "reported",
    label: "Reported",
    description: "Problem submitted",
    icon: FileText,
  },
  {
    key: "ai_analysis",
    label: "AI Analysis",
    description: "Problem understanding",
    icon: Sparkles,
  },
  {
    key: "university_matching",
    label: "University Matching",
    description: "Finding solution partners",
    icon: University,
  },
  {
    key: "solution",
    label: "Solution",
    description: "Solution development",
    icon: Wrench,
  },
  {
    key: "project",
    label: "Project",
    description: "Project execution",
    icon: Target,
  },
  {
    key: "industry_collaboration",
    label: "Industry Support",
    description: "Industry collaboration",
    icon: Handshake,
  },
  {
    key: "prototype",
    label: "Prototype",
    description: "Prototype / pilot",
    icon: Rocket,
  },
  {
    key: "deployment",
    label: "Deployment",
    description: "Solution deployed",
    icon: CheckCircle2,
  },
  {
    key: "resolved",
    label: "Resolved",
    description: "Problem resolved",
    icon: CheckCircle2,
  },
];

function getStatusClasses(status: string) {
  switch (status?.toLowerCase()) {
    case "resolved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "in progress":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "under review":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function getStatusIcon(status: string) {
  switch (status?.toLowerCase()) {
    case "resolved":
      return <CheckCircle2 size={14} />;

    case "in progress":
      return <Loader2 size={14} />;

    case "under review":
      return <Clock3 size={14} />;

    default:
      return <FileText size={14} />;
  }
}

function getCategoryClasses(category: string) {
  switch (category) {
    case "Road Infrastructure":
      return "bg-orange-50 text-orange-700";

    case "Education":
      return "bg-blue-50 text-blue-700";

    case "Healthcare":
      return "bg-red-50 text-red-700";

    case "Environment":
      return "bg-emerald-50 text-emerald-700";

    case "Public Safety":
      return "bg-violet-50 text-violet-700";

    case "Transport":
      return "bg-cyan-50 text-cyan-700";

    case "Sanitation":
      return "bg-yellow-50 text-yellow-700";

    case "Water Management":
      return "bg-sky-50 text-sky-700";

    case "Agriculture":
      return "bg-lime-50 text-lime-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return "Date unavailable";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getProgressMessage(progress?: ProblemProgress) {
  if (!progress) {
    return "Loading the latest progress update...";
  }

  switch (progress.current_stage.toLowerCase()) {
    case "reported":
      return "Your problem has been successfully reported and is awaiting further processing.";

    case "ai analysis":
      return "Your problem is being analyzed to understand its severity, causes and affected sector.";

    case "university matching":
      return "AI analysis is complete. Suitable university partners are now being identified.";

    case "solution":
      return "A solution is being developed for your reported problem.";

    case "project":
      return "Your problem has moved into project execution.";

    case "industry support":
    case "industry collaboration":
      return "Industry support is being connected to help move the project forward.";

    case "prototype":
      return "The solution has moved towards prototype or pilot development.";

    case "deployment":
      return "The solution is moving towards real-world deployment.";

    case "resolved":
      return "This problem has been resolved.";

    default:
      return `Current stage: ${progress.current_stage}`;
  }
}

function ProgressTracker({
  progress,
  loading,
}: {
  progress?: ProblemProgress;
  loading: boolean;
}) {
  if (loading || !progress) {
    return (
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-4 w-36 rounded bg-slate-200" />
            <div className="h-4 w-10 rounded bg-slate-200" />
          </div>

          <div className="mt-4 h-2 rounded-full bg-slate-200" />

          <div className="mt-6 h-24 rounded-xl bg-slate-100" />
        </div>
      </div>
    );
  }

  const backendStages = progress.stages;

  const currentIndex = backendStages.findIndex(
    (stage) => !stage.completed
  );

  const lastCompletedIndex =
    currentIndex === -1
      ? backendStages.length - 1
      : currentIndex - 1;

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-bold text-slate-900">
            Problem Progress
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Current stage:{" "}
            <span className="font-semibold text-teal-700">
              {progress.current_stage}
            </span>
          </p>
        </div>

        <span className="text-sm font-bold text-teal-700">
          {progress.progress}%
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-teal-600 transition-all duration-500"
          style={{
            width: `${progress.progress}%`,
          }}
        />
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        {getProgressMessage(progress)}
      </p>

      <div className="mt-6 overflow-x-auto pb-3">
        <div className="flex min-w-[1050px] items-start px-2">
          {backendStages.map((backendStage, index) => {
            const stage =
              lifecycleStages.find(
                (item) => item.key === backendStage.key
              );

            if (!stage) return null;

            const Icon = stage.icon;

            const completed = backendStage.completed;
            const current =
              index === currentIndex ||
              (currentIndex === -1 &&
                index === lastCompletedIndex);

            return (
              <div
                key={backendStage.key}
                className="flex flex-1 items-start"
              >
                <div className="flex w-full min-w-[105px] flex-col items-center text-center">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                      completed
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-slate-300 bg-white text-slate-400"
                    } ${
                      current
                        ? "ring-4 ring-teal-100"
                        : ""
                    }`}
                  >
                    <Icon size={17} />
                  </div>

                  <p
                    className={`mt-2 whitespace-nowrap text-xs font-semibold ${
                      completed
                        ? "text-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    {stage.label}
                  </p>

                  <p className="mt-1 min-h-[32px] max-w-[115px] text-[10px] leading-4 text-slate-400">
                    {stage.description}
                  </p>
                </div>

                {index < backendStages.length - 1 && (
                  <div
                    className={`mt-5 h-0.5 min-w-[20px] flex-1 ${
                      index < lastCompletedIndex
                        ? "bg-teal-500"
                        : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ProblemCard({
  problem,
  progress,
  progressLoading,
}: {
  problem: Problem;
  progress?: ProblemProgress;
  progressLoading: boolean;
}) {
  const severity =
    problem.severity_score !== null &&
    problem.severity_score !== undefined
      ? problem.severity_score >= 0.8
        ? {
            label: "Critical",
            classes:
              "border-red-200 bg-red-50 text-red-700",
          }
        : problem.severity_score >= 0.6
          ? {
              label: "High",
              classes:
                "border-orange-200 bg-orange-50 text-orange-700",
            }
          : problem.severity_score >= 0.4
            ? {
                label: "Medium",
                classes:
                  "border-amber-200 bg-amber-50 text-amber-700",
              }
            : {
                label: "Low",
                classes:
                  "border-emerald-200 bg-emerald-50 text-emerald-700",
              }
      : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-200 hover:shadow-md">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getCategoryClasses(
                problem.category
              )}`}
            >
              {problem.category}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                problem.status
              )}`}
            >
              {getStatusIcon(problem.status)}
              {problem.status || "Pending"}
            </span>

            {severity && (
              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${severity.classes}`}
              >
                {severity.label}
              </span>
            )}
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {problem.title}
          </h2>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
            {problem.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} />
              Reported {formatDate(problem.created_at)}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} />
              {problem.district || "Location unavailable"}
            </span>
          </div>
        </div>

        <Link
          href={`/problems/${problem.id}`}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
        >
          View Details
          <ChevronRight size={16} />
        </Link>
      </div>

      <ProgressTracker
        progress={progress}
        loading={progressLoading}
      />

      <div className="mt-4 flex flex-col justify-between gap-3 rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            Current update
          </p>

          <p className="mt-1 text-sm text-slate-700">
            {getProgressMessage(progress)}
          </p>
        </div>

        <Link
          href={`/problems/${problem.id}`}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-teal-700 transition hover:text-teal-800"
        >
          Open problem
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

function ProblemSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="h-6 w-32 rounded-full bg-slate-200" />
          <div className="h-6 w-24 rounded-full bg-slate-200" />
        </div>

        <div className="h-6 w-3/4 rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-100" />
        <div className="h-4 w-2/3 rounded bg-slate-100" />
        <div className="h-32 rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}

export default function MyProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [progressMap, setProgressMap] = useState<
    Record<string, ProblemProgress>
  >({});
  const [progressLoading, setProgressLoading] =
    useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState("All Categories");
  const [status, setStatus] =
    useState("All Status");

  async function loadProblems() {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProblems();
      setProblems(data);

      const loadingState: Record<string, boolean> = {};

      data.forEach((problem) => {
        loadingState[problem.id] = true;
      });

      setProgressLoading(loadingState);

      const results = await Promise.all(
        data.map(async (problem) => {
          try {
            const progress =
              await getProblemProgress(problem.id);

            return {
              id: problem.id,
              progress,
            };
          } catch (progressError) {
            console.error(
              `Failed to load progress for ${problem.id}:`,
              progressError
            );

            return {
              id: problem.id,
              progress: null,
            };
          }
        })
      );

      const nextMap: Record<
        string,
        ProblemProgress
      > = {};

      results.forEach((result) => {
        if (result.progress) {
          nextMap[result.id] = result.progress;
        }
      });

      setProgressMap(nextMap);

      const finishedState: Record<string, boolean> = {};

      data.forEach((problem) => {
        finishedState[problem.id] = false;
      });

      setProgressLoading(finishedState);
    } catch (loadError) {
      console.error(
        "Failed to load my problems:",
        loadError
      );

      if (loadError instanceof Error) {
        setError(loadError.message);
      } else {
        setError("Failed to load your problems.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProblems();
  }, []);

  const filteredProblems = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return problems.filter((problem) => {
      const matchesSearch =
        !searchTerm ||
        problem.title
          ?.toLowerCase()
          .includes(searchTerm) ||
        problem.description
          ?.toLowerCase()
          .includes(searchTerm) ||
        problem.category
          ?.toLowerCase()
          .includes(searchTerm) ||
        problem.district
          ?.toLowerCase()
          .includes(searchTerm);

      const matchesCategory =
        category === "All Categories" ||
        problem.category === category;

      const matchesStatus =
        status === "All Status" ||
        problem.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    problems,
    search,
    category,
    status,
  ]);

  const statusCounts = useMemo(() => {
    return {
      total: problems.length,

      pending: problems.filter(
        (problem) =>
          problem.status?.toLowerCase() === "pending"
      ).length,

      review: problems.filter(
        (problem) =>
          problem.status?.toLowerCase() ===
          "under review"
      ).length,

      progress: problems.filter(
        (problem) =>
          problem.status?.toLowerCase() ===
          "in progress"
      ).length,

      resolved: problems.filter(
        (problem) =>
          problem.status?.toLowerCase() ===
          "resolved"
      ).length,
    };
  }, [problems]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/citizen/dashboard"
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
              href="/citizen/dashboard"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Dashboard
            </Link>

            <Link
              href="/problems"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              All Problems
            </Link>

            <Link
              href="/citizen/problems"
              className="text-sm font-semibold text-teal-700"
            >
              My Problems
            </Link>

            <Link
              href="/help"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Help
            </Link>

            <Link
              href="/citizen/report"
              className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
            >
              Report Problem
            </Link>
          </div>

          <Link
            href="/citizen/report"
            className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 md:hidden"
          >
            Report Problem
          </Link>
        </div>
      </nav>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
              <FileText size={14} />
              Your reported problems
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              My Problems
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Track every problem you have reported and follow its journey
              from submission to resolution.
            </p>
          </div>

          <Link
            href="/citizen/report"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
          >
            <Plus size={17} />
            Report a Problem
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            [
              "Total",
              statusCounts.total,
              "Problems reported",
            ],
            [
              "Pending",
              statusCounts.pending,
              "Awaiting review",
            ],
            [
              "Under Review",
              statusCounts.review,
              "Being evaluated",
            ],
            [
              "In Progress",
              statusCounts.progress,
              "Action underway",
            ],
            [
              "Resolved",
              statusCounts.resolved,
              "Successfully resolved",
            ],
          ].map(
            ([label, value, description]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-medium text-slate-500">
                  {label}
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {loading ? "—" : value}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {description}
                </p>
              </div>
            )
          )}
        </div>

        {/* Filters */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search your problems..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!loading && !error && (
          <div className="mt-7 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Your reported problems
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredProblems.length} of{" "}
                {problems.length} problem
                {problems.length === 1 ? "" : "s"}.
              </p>
            </div>

            {(search ||
              category !== "All Categories" ||
              status !== "All Status") && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All Categories");
                  setStatus("All Status");
                }}
                className="text-sm font-semibold text-teal-700 transition hover:text-teal-800"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {error && !loading && (
          <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <div>
                  <h2 className="font-semibold text-red-900">
                    Unable to load your problems
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-red-700">
                    {error}
                  </p>
                </div>
              </div>

              <button
                onClick={loadProblems}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              >
                <RefreshCw size={15} />
                Retry
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-7 space-y-4">
            <ProblemSkeleton />
            <ProblemSkeleton />
            <ProblemSkeleton />
          </div>
        )}

        {!loading &&
          !error &&
          problems.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <FileText size={26} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                You haven't reported any problems yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Help your community by reporting a local problem. Once
                submitted, you can track its complete progress here.
              </p>

              <Link
                href="/citizen/report"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                <Plus size={17} />
                Report Your First Problem
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          problems.length > 0 &&
          filteredProblems.length === 0 && (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Search size={23} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                No matching problems found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or filters.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All Categories");
                  setStatus("All Status");
                }}
                className="mt-5 text-sm font-semibold text-teal-700 transition hover:text-teal-800"
              >
                Clear filters
              </button>
            </div>
          )}

        {!loading &&
          !error &&
          filteredProblems.length > 0 && (
            <div className="mt-7 space-y-5">
              {filteredProblems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  progress={progressMap[problem.id]}
                  progressLoading={
                    progressLoading[problem.id] ?? false
                  }
                />
              ))}
            </div>
          )}

        {!loading &&
          !error &&
          problems.length > 0 && (
            <div className="mt-10 rounded-2xl border border-teal-100 bg-teal-50 p-6 sm:p-7">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Found another problem?
                  </h2>

                  <p className="mt-1 text-sm text-slate-600">
                    Report it and track its journey from problem to impact.
                  </p>
                </div>

                <Link
                  href="/citizen/report"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
                >
                  Report Problem
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-8 text-white">
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold">
                S
              </div>

              <div>
                <p className="font-semibold">
                  SamadhanX
                </p>

                <p className="text-sm text-slate-400">
                  Ideas → Action → Impact
                </p>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-slate-400 md:absolute md:left-1/2 md:-translate-x-1/2">
            <p>
              © 2026 SamadhanX. Building solutions that matter.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-5 text-sm text-slate-300">
            <Link
              href="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/problems"
              className="transition hover:text-white"
            >
              Problems
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

