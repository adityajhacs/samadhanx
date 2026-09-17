
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Construction,
  Map as MapIcon,
  Network,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wrench,
  Clock3,
  FolderKanban,
  BarChart3,
  Handshake,
  BellRing,
  Brain,
  GraduationCap,
  Lightbulb,
  Rocket,
} from "lucide-react";
import { apiRequest, getAuthToken } from "@/lib/api/client";

type Problem = {
  id: string;
  title: string;
  description?: string | null;
  district?: string | null;
  category?: string | null;
  severity_score?: number | null;
  status?: string | null;
  created_at?: string | null;
};

type Project = {
  id: string;
  title: string;
  status?: string | null;
  problem_id?: string | null;
  created_at?: string | null;
};

type Cluster = {
  cluster_id: string;
  name: string;
  common_theme?: string | null;
  possible_root_cause?: string | null;
  problem_count?: number | null;
};

type DashboardOverview = {
  total_projects: number;
  active_projects: number;
  total_industry_partners: number;
  total_collaborations: number;
  active_collaborations: number;
  total_funding: number;

  reported_count: number;
  ai_analysis_count: number;
  university_matching_count: number;
  solution_count: number;
  project_count: number;
  industry_support_count: number;
  prototype_count: number;
  deployment_count: number;
  resolved_count: number;
};

type CategoryItem = {
  name: string;
  count: string;
  icon: LucideIcon;
};

type PipelineItem = {
  step: string;
  title: string;
  count: number;
  description: string;
  icon: LucideIcon;
};

function normalizeStatus(status?: string | null) {
  return (status || "").trim().toLowerCase();
}

function getProblemStatusLabel(problem: Problem) {
  const status = normalizeStatus(problem.status);

  if (
    status.includes("critical") ||
    (problem.severity_score !== null &&
      problem.severity_score !== undefined &&
      problem.severity_score >= 0.8)
  ) {
    return "Critical";
  }

  if (
    status.includes("progress") ||
    status.includes("active") ||
    status.includes("assigned")
  ) {
    return "In Progress";
  }

  if (
    status.includes("resolved") ||
    status.includes("complete") ||
    status.includes("closed")
  ) {
    return "Resolved";
  }

  return "Pending";
}

function getStatusClass(status: string) {
  switch (status) {
    case "Critical":
      return "bg-red-50 text-red-700 border-red-100";

    case "In Progress":
      return "bg-teal-50 text-teal-700 border-teal-100";

    case "Resolved":
      return "bg-green-50 text-green-700 border-green-100";

    default:
      return "bg-amber-50 text-amber-700 border-amber-100";
  }
}

export default function GovernmentDashboard() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const token = getAuthToken();

        if (!token) {
          throw new Error("Authentication required");
        }

        const [problemData, projectData, clusterData, overviewData] =
          await Promise.all([
            apiRequest<Problem[]>("/api/problems", {
              method: "GET",
              token,
            }),

            apiRequest<Project[]>("/api/projects", {
              method: "GET",
              token,
            }),

            apiRequest<Cluster[]>("/api/clusters", {
              method: "GET",
              token,
            }),

            apiRequest<DashboardOverview>(
              "/api/dashboard/overview",
              {
                method: "GET",
                token,
              }
            ),
          ]);

        setProblems(problemData || []);
        setProjects(projectData || []);
        setClusters(clusterData || []);
        setOverview(overviewData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load government dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const resolved = problems.filter((problem) =>
      normalizeStatus(problem.status).includes("resolved")
    ).length;

    const critical = problems.filter((problem) => {
      const status = normalizeStatus(problem.status);

      return (
        status.includes("critical") ||
        (problem.severity_score !== null &&
          problem.severity_score !== undefined &&
          problem.severity_score >= 0.8)
      );
    }).length;

    const pending = problems.filter((problem) => {
      const status = normalizeStatus(problem.status);

      return (
        !status.includes("resolved") &&
        !status.includes("complete") &&
        !status.includes("closed")
      );
    }).length;

    return {
      totalProblems: overview?.reported_count ?? problems.length,
      critical,
      resolved: overview?.resolved_count ?? resolved,
      pending,
      totalProjects: overview?.total_projects ?? projects.length,
      totalClusters: clusters.length,
    };
  }, [problems, projects, clusters, overview]);

  const recentProblems = useMemo(() => {
    return [...problems]
      .sort((a, b) => {
        const first = a.created_at
          ? new Date(a.created_at).getTime()
          : 0;

        const second = b.created_at
          ? new Date(b.created_at).getTime()
          : 0;

        return second - first;
      })
      .slice(0, 4)
      .map((problem) => {
        const status = getProblemStatusLabel(problem);

        return {
          id: problem.id,
          title: problem.title,
          location: problem.district || "Location not specified",
          category: problem.category || "General",
          status,
          statusClass: getStatusClass(status),
        };
      });
  }, [problems]);

  const categories = useMemo<CategoryItem[]>(() => {
    const counts = new Map<string, number>();

    problems.forEach((problem) => {
      const category =
        problem.category?.trim() || "Other";

      counts.set(
        category,
        (counts.get(category) ?? 0) + 1
      );
    });

    const categoryIcons: LucideIcon[] = [
      Construction,
      BellRing,
      Sparkles,
      ShieldCheck,
    ];

    const entries = Array.from(counts.entries());

    entries.sort((a, b) => b[1] - a[1]);

    return entries
      .slice(0, 4)
      .map(([name, count], index) => ({
        name,
        count: String(count),
        icon: categoryIcons[index % categoryIcons.length],
      }));
  }, [problems]);

  /*
   * EXACT SAMADHANX LIFECYCLE
   *
   * Counts come directly from backend dashboard overview.
   *
   * Reported              -> problems
   * AI Analysis           -> problem_ai_analysis
   * University Matching   -> university_problem_interest
   * Solution              -> solutions
   * Project               -> projects
   * Industry Support      -> collaborations
   * Prototype             -> solutions.prototype_status
   * Deployment            -> projects.status
   * Resolved              -> problems.status
   */
  const pipeline = useMemo<PipelineItem[]>(() => {
    return [
      {
        step: "01",
        title: "Reported",
        count: overview?.reported_count ?? 0,
        description: "Community challenges received",
        icon: AlertCircle,
      },
      {
        step: "02",
        title: "AI Analysis",
        count: overview?.ai_analysis_count ?? 0,
        description: "Challenges analysed by AI",
        icon: Brain,
      },
      {
        step: "03",
        title: "University Matching",
        count: overview?.university_matching_count ?? 0,
        description: "Challenges matched with universities",
        icon: GraduationCap,
      },
      {
        step: "04",
        title: "Solution",
        count: overview?.solution_count ?? 0,
        description: "Solutions proposed for challenges",
        icon: Lightbulb,
      },
      {
        step: "05",
        title: "Project",
        count: overview?.project_count ?? 0,
        description: "Solutions converted into projects",
        icon: FolderKanban,
      },
      {
        step: "06",
        title: "Industry Support",
        count: overview?.industry_support_count ?? 0,
        description: "Industry collaboration connected",
        icon: Handshake,
      },
      {
        step: "07",
        title: "Prototype",
        count: overview?.prototype_count ?? 0,
        description: "Solutions moving into prototype",
        icon: Wrench,
      },
      {
        step: "08",
        title: "Deployment",
        count: overview?.deployment_count ?? 0,
        description: "Projects deployed for impact",
        icon: Rocket,
      },
      {
        step: "09",
        title: "Resolved",
        count: overview?.resolved_count ?? 0,
        description: "Challenges successfully resolved",
        icon: CheckCircle2,
      },
    ];
  }, [overview]);

  const activePipelinePercentage = useMemo(() => {
    if (!overview || overview.reported_count === 0) {
      return 0;
    }

    const active =
      overview.reported_count - overview.resolved_count;

    return Math.round(
      (Math.max(0, active) / overview.reported_count) * 100
    );
  }, [overview]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-xl text-white">
              S
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                SamadhanX
              </h1>

              <p className="text-xs text-slate-500">
                Ideas → Action → Impact
              </p>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="grid items-center gap-12 py-6 lg:grid-cols-2 lg:py-10">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700">
                <Sparkles size={15} strokeWidth={2} />

                <span>
                  Turning community challenges into coordinated action
                </span>
              </div>

              <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
                Your Challenges.
                <br />
                <span className="text-teal-600">
                  Government Action.
                </span>
                <br />
                Real Impact.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                SamadhanX gives government teams a unified view of
                community-reported challenges, recurring problem clusters,
                geographical hotspots and the solutions working to resolve
                them.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/government/problems"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-teal-700"
                >
                  Explore Challenges
                  <ArrowRight size={17} strokeWidth={2} />
                </Link>

                <Link
                  href="/government/map"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-slate-50"
                >
                  <MapIcon size={17} strokeWidth={2} />
                  Explore Impact Map
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-teal-100 text-teal-700">
                    <ShieldCheck size={17} strokeWidth={2} />
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-green-100 text-green-700">
                    <Construction size={17} strokeWidth={2} />
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-amber-100 text-amber-700">
                    <Wrench size={17} strokeWidth={2} />
                  </div>
                </div>

                <span>
                  Government teams turning reported needs into measurable
                  outcomes
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-teal-100/60 blur-3xl" />

              <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Government Overview
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      Live Impact
                    </h2>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    {loading ? "Loading" : "Active"}
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-900 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Challenges being addressed
                      </p>

                      <p className="mt-2 text-4xl font-bold">
                        {loading ? "—" : stats.pending}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-teal-400">
                      <TrendingUp size={19} strokeWidth={2} />
                    </div>
                  </div>

                  <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className="h-full rounded-full bg-teal-500 transition-all"
                      style={{
                        width: `${activePipelinePercentage}%`,
                      }}
                    />
                  </div>

                  <div className="mt-3 flex justify-between text-xs text-slate-400">
                    <span>Active solution pipeline</span>

                    <span>
                      {loading
                        ? "—"
                        : `${activePipelinePercentage}% active`}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <Link
                    href="/government/clusters"
                    className="rounded-2xl bg-teal-50 p-5 transition hover:bg-teal-100"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                        <Network size={15} strokeWidth={2} />
                      </div>

                      <p className="text-sm text-slate-500">
                        Active Clusters
                      </p>
                    </div>

                    <p className="mt-2 text-2xl font-bold text-teal-700">
                      {loading ? "—" : stats.totalClusters}
                    </p>
                  </Link>

                  <Link
                    href="/government/problems"
                    className="rounded-2xl bg-green-50 p-5 transition hover:bg-green-100"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-700">
                        <CheckCircle2 size={15} strokeWidth={2} />
                      </div>

                      <p className="text-sm text-slate-500">
                        Resolved
                      </p>
                    </div>

                    <p className="mt-2 text-2xl font-bold text-green-700">
                      {loading ? "—" : stats.resolved}
                    </p>
                  </Link>
                </div>

                <Link
                  href="/government/problems"
                  className="mt-4 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 transition hover:border-teal-100 hover:bg-teal-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Clock3 size={17} strokeWidth={2} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        Awaiting action
                      </p>

                      <p className="text-sm font-bold text-slate-900">
                        {loading
                          ? "Loading..."
                          : `${stats.pending} pending challenges`}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={17}
                    className="text-slate-300"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* GOVERNMENT OPERATIONS */}
        <section className="mt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                Government Workspace
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Where should action begin?
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Move from citizen-reported challenges to coordinated
                intervention, project monitoring and measurable impact.
              </p>
            </div>

            <Link
              href="/government/problems"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-800"
            >
              View all challenges
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <Link
              href="/government/problems"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <AlertCircle size={20} strokeWidth={2} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Community Challenges
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review citizen-reported challenges and identify issues
                that need government attention.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-teal-700">
                Explore Challenges
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </div>
            </Link>

            <Link
              href="/government/clusters"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Network size={20} strokeWidth={2} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Challenge Clusters
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Discover recurring challenges grouped by location,
                category and community need.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-teal-700">
                Explore Clusters
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </div>
            </Link>

            <Link
              href="/government/map"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MapIcon size={20} strokeWidth={2} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Impact Map
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Visualise challenge hotspots and understand where
                intervention is needed most.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-teal-700">
                Open Impact Map
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </div>
            </Link>

            <Link
              href="/government/projects"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <FolderKanban size={20} strokeWidth={2} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Innovation Projects
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Track solutions as they move from verified challenges
                towards measurable impact.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-teal-700">
                View Projects
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </div>
            </Link>
          </div>
        </section>

        {/* PLATFORM SNAPSHOT */}
        <section className="mt-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <BarChart3 size={20} strokeWidth={2} />
                  </div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                    Platform Snapshot
                  </p>
                </div>

                <h2 className="mt-5 max-w-xl text-3xl font-bold tracking-tight text-slate-900">
                  Community needs are becoming actionable insights.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">
                  SamadhanX helps government teams understand reported
                  challenges, identify recurring patterns and monitor the
                  solutions being developed to create measurable impact.
                </p>

                <Link
                  href="/government/problems"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-800"
                >
                  View Challenges
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <Link
                  href="/government/problems"
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-teal-200 hover:bg-teal-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                      <AlertCircle size={18} />
                    </div>

                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        {loading ? "—" : stats.totalProblems}
                      </p>

                      <p className="text-xs text-slate-500">
                        Challenges
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={16}
                    className="text-slate-300"
                  />
                </Link>

                <Link
                  href="/government/clusters"
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-teal-200 hover:bg-teal-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                      <Network size={18} />
                    </div>

                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        {loading ? "—" : stats.totalClusters}
                      </p>

                      <p className="text-xs text-slate-500">
                        Clusters
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={16}
                    className="text-slate-300"
                  />
                </Link>

                <Link
                  href="/government/projects"
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-teal-200 hover:bg-teal-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Wrench size={18} />
                    </div>

                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        {loading ? "—" : stats.totalProjects}
                      </p>

                      <p className="text-xs text-slate-500">
                        Projects
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={16}
                    className="text-slate-300"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* RECENT COMMUNITY CHALLENGES */}
        <section className="mt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                Community Intelligence
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                What communities are reporting
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                A quick view of the latest challenges that require
                government review, coordination or follow-up.
              </p>
            </div>

            <Link
              href="/government/problems"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-800"
            >
              View all challenges
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Latest Challenges
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Recently reported community issues
                    </p>
                  </div>

                  <Link
                    href="/government/problems"
                    className="rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-100"
                  >
                    Open Queue
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {loading ? (
                  <div className="px-5 py-8 text-center text-sm text-slate-500">
                    Loading challenges...
                  </div>
                ) : recentProblems.length === 0 ? (
                  <div className="px-5 py-8 text-center text-sm text-slate-500">
                    No challenges found.
                  </div>
                ) : (
                  recentProblems.map((problem) => (
                    <Link
                      key={problem.id}
                      href="/government/problems"
                      className="group block px-5 py-5 transition hover:bg-slate-50"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="max-w-[180px] truncate text-[10px] font-bold uppercase tracking-wide text-slate-400">
                              {problem.id}
                            </span>

                            <span className="h-1 w-1 rounded-full bg-slate-300" />

                            <span className="text-xs text-slate-400">
                              {problem.category}
                            </span>
                          </div>

                          <h3 className="mt-1 text-sm font-bold text-slate-900 transition group-hover:text-teal-700">
                            {problem.title}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {problem.location}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          <span
                            className={`rounded-full border px-3 py-1 text-[10px] font-bold ${problem.statusClass}`}
                          >
                            {problem.status}
                          </span>

                          <ArrowRight
                            size={16}
                            className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-600"
                          />
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Challenge Areas
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Areas currently receiving community attention.
                </p>
              </div>

              <div className="mt-5 space-y-3">
                {loading ? (
                  <p className="text-sm text-slate-500">
                    Loading categories...
                  </p>
                ) : categories.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No categories found.
                  </p>
                ) : (
                  categories.map((category) => {
                    const Icon = category.icon;

                    return (
                      <Link
                        key={category.name}
                        href="/government/problems"
                        className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition hover:border-teal-100 hover:bg-teal-50"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-teal-600 shadow-sm">
                            <Icon size={17} strokeWidth={2} />
                          </div>

                          <span className="truncate text-xs font-semibold text-slate-700 group-hover:text-teal-700">
                            {category.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-500">
                            {category.count}
                          </span>

                          <ArrowRight
                            size={14}
                            className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-600"
                          />
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>

              <Link
                href="/government/problems"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-semibold text-teal-700 transition hover:border-teal-200 hover:bg-teal-50"
              >
                View All Challenges
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* CHALLENGE CLUSTERS + SOLUTION PIPELINE */}
        <section className="mt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                Coordinated Action
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Challenge Clusters & Solution Pipeline
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Understand recurring community needs and monitor how
                challenges move through the complete SamadhanX lifecycle.
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            {/* CLUSTERS */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Challenge Clusters
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Recurring challenges grouped by AI-based similarity.
                  </p>
                </div>

                <Link
                  href="/government/clusters"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-100"
                >
                  View All
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="p-5">
                {loading ? (
                  <div className="px-5 py-8 text-center text-sm text-slate-500">
                    Loading clusters...
                  </div>
                ) : clusters.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
                    <Network
                      size={24}
                      className="mx-auto text-teal-600"
                    />

                    <p className="mt-3 text-sm font-semibold text-slate-800">
                      No clusters found
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      AI clustering has not produced any active
                      problem groups yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {clusters.slice(0, 4).map((cluster) => (
                      <Link
                        key={cluster.cluster_id}
                        href="/government/clusters"
                        className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-teal-100 hover:bg-teal-50"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                          <Network size={17} strokeWidth={2} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-800 group-hover:text-teal-700">
                            {cluster.name || "Untitled Cluster"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {cluster.problem_count ?? 0} related
                            challenges
                          </p>
                        </div>

                        <ArrowRight
                          size={15}
                          className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-600"
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SOLUTION PIPELINE */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Solution Pipeline
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Backend-driven 9-stage problem lifecycle.
                  </p>
                </div>

                <Link
                  href="/government/projects"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-100"
                >
                  Projects
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="p-5">
                {loading ? (
                  <div className="px-5 py-8 text-center text-sm text-slate-500">
                    Loading solution lifecycle...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pipeline.map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.step}
                          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-teal-600 shadow-sm">
                            <Icon size={16} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-slate-400">
                                  {item.step}
                                </span>

                                <p className="text-xs font-bold text-slate-800">
                                  {item.title}
                                </p>
                              </div>

                              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-teal-700">
                                {item.count}
                              </span>
                            </div>

                            <p className="mt-1 text-[10px] text-slate-500">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <Link
                  href="/government/projects"
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-semibold text-teal-700 transition hover:border-teal-200 hover:bg-teal-50"
                >
                  Monitor Solution Projects
                  <FolderKanban size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* INDUSTRY COLLABORATION */}
        <section className="mt-6">
          <Link
            href="/government/projects"
            className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Handshake size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Industry Collaboration
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Monitor industry support connected to solution
                    projects.
                  </p>
                </div>
              </div>

              <ArrowRight
                size={17}
                className="text-slate-300 transition group-hover:translate-x-1"
              />
            </div>
          </Link>
        </section>
      </div>

      <footer className="w-full border-t border-slate-800 bg-slate-950 text-white">
        <div className="px-6 py-5 text-center text-xs text-slate-500">
          © 2026 SamadhanX • Ideas → Action → Impact
        </div>
      </footer>
    </main>
  );
}
