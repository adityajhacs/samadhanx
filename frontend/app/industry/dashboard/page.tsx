
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CircleDollarSign,
  Clock3,
  FlaskConical,
  GraduationCap,
  Handshake,
  Lightbulb,
  LogOut,
  Target,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";

import { logout } from "@/lib/api/auth";
import { apiRequest, getAuthToken } from "@/lib/api/client";

type CollaborationType =
  | "FUNDING"
  | "MENTORSHIP"
  | "HARDWARE"
  | "TESTING"
  | "PROTOTYPING";

type CollaborationStatus =
  | "REQUESTED"
  | "UNDER_REVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "COMPLETED";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  created_by: string | null;
  university_name: string | null;
  budget: number | null;
  expected_impact: number | null;
  member_count: number;
  deadline: string | null;
}

interface Collaboration {
  id: string;
  project_id: string | null;
  industry_partner_id: string | null;
  collaboration_type: CollaborationType | null;
  amount: number | null;
  status: CollaborationStatus | null;
  description: string | null;
  created_at: string | null;
}

interface Activity {
  id: string;
  title: string;
  project: string;
  time: string;
  icon: typeof CircleDollarSign;
}

const collaborationTypeLabels: Record<CollaborationType, string> = {
  FUNDING: "Funding",
  MENTORSHIP: "Mentorship",
  HARDWARE: "Hardware",
  TESTING: "Testing",
  PROTOTYPING: "Prototyping",
};

const collaborationTypeIcons: Record<
  CollaborationType,
  typeof CircleDollarSign
> = {
  FUNDING: CircleDollarSign,
  MENTORSHIP: Users,
  HARDWARE: Wrench,
  TESTING: FlaskConical,
  PROTOTYPING: Wrench,
};

const collaborationTypeStyles: Record<
  CollaborationType,
  {
    bg: string;
    color: string;
  }
> = {
  FUNDING: {
    bg: "bg-amber-100",
    color: "text-amber-700",
  },
  MENTORSHIP: {
    bg: "bg-teal-100",
    color: "text-teal-700",
  },
  HARDWARE: {
    bg: "bg-slate-100",
    color: "text-slate-700",
  },
  TESTING: {
    bg: "bg-sky-100",
    color: "text-sky-700",
  },
  PROTOTYPING: {
    bg: "bg-emerald-100",
    color: "text-emerald-700",
  },
};

function formatTime(dateString: string | null): string {
  if (!dateString) {
    return "Recently";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  return date.toLocaleDateString();
}

function formatAmount(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function IndustryDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [collaborations, setCollaborations] = useState<Collaboration[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const token = getAuthToken();

        if (!token) {
          throw new Error("Authentication required");
        }

        const [projectData, collaborationData] = await Promise.all([
          apiRequest<Project[]>("/api/projects", {
            method: "GET",
            token,
          }),

          apiRequest<Collaboration[]>("/api/collaborations", {
            method: "GET",
            token,
          }),
        ]);

        setProjects(projectData);
        setCollaborations(collaborationData);
      } catch (err) {
        console.error("Industry dashboard error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load industry dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const projectMap = useMemo(() => {
    const map = new Map<string, Project>();

    for (const project of projects) {
      map.set(project.id, project);
    }

    return map;
  }, [projects]);

  const activeCollaborations = useMemo(() => {
    return collaborations.filter((collaboration) =>
      ["REQUESTED", "UNDER_REVIEW", "ACCEPTED"].includes(
        collaboration.status ?? ""
      )
    );
  }, [collaborations]);

  const fundingSupported = useMemo(() => {
    return collaborations
      .filter(
        (collaboration) =>
          collaboration.collaboration_type === "FUNDING" &&
          ["ACCEPTED", "COMPLETED"].includes(
            collaboration.status ?? ""
          )
      )
      .reduce(
        (total, collaboration) =>
          total + Number(collaboration.amount ?? 0),
        0
      );
  }, [collaborations]);

  const projectsWithCollaboration = useMemo(() => {
    return new Set(
      collaborations
        .map((collaboration) => collaboration.project_id)
        .filter(Boolean)
    );
  }, [collaborations]);

  const projectsNeedingSupport = useMemo(() => {
    return projects.filter(
      (project) => !projectsWithCollaboration.has(project.id)
    ).length;
  }, [projects, projectsWithCollaboration]);

  const stats = [
    {
      value: loading ? "—" : String(projects.length),
      label: "Available Projects",
      icon: Lightbulb,
      bg: "bg-teal-100",
      iconColor: "text-teal-700",
      valueColor: "text-teal-800",
    },
    {
      value: loading ? "—" : String(activeCollaborations.length),
      label: "Active Collaborations",
      icon: Handshake,
      bg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      valueColor: "text-emerald-800",
    },
    {
      value: loading ? "—" : formatAmount(fundingSupported),
      label: "Funding Supported",
      icon: CircleDollarSign,
      bg: "bg-amber-100",
      iconColor: "text-amber-700",
      valueColor: "text-amber-800",
    },
    {
      value: loading ? "—" : String(projectsNeedingSupport),
      label: "Projects Needing Support",
      icon: Target,
      bg: "bg-sky-100",
      iconColor: "text-sky-700",
      valueColor: "text-sky-800",
    },
  ];

  const activities: Activity[] = collaborations
    .slice()
    .sort((a, b) => {
      const first = a.created_at
        ? new Date(a.created_at).getTime()
        : 0;

      const second = b.created_at
        ? new Date(b.created_at).getTime()
        : 0;

      return second - first;
    })
    .slice(0, 3)
    .map((collaboration) => {
      const type =
        collaboration.collaboration_type ?? "MENTORSHIP";

      const Icon = collaborationTypeIcons[type];

      const project = collaboration.project_id
        ? projectMap.get(collaboration.project_id)
        : null;

      return {
        id: collaboration.id,
        title: `${collaborationTypeLabels[type]} collaboration ${(
          collaboration.status ?? "REQUESTED"
        )
          .toLowerCase()
          .replace("_", " ")}`,
        project: project?.title ?? "Project",
        time: formatTime(collaboration.created_at),
        icon: Icon,
      };
    });

  const supportTypes = (
    [
      "FUNDING",
      "MENTORSHIP",
      "HARDWARE",
      "TESTING",
      "PROTOTYPING",
    ] as CollaborationType[]
  ).map((type) => {
    const matchingCollaborations = collaborations.filter(
      (collaboration) =>
        collaboration.collaboration_type === type
    );

    return {
      name: collaborationTypeLabels[type],
      description:
        type === "FUNDING"
          ? "Financial support"
          : type === "MENTORSHIP"
          ? "Industry expertise"
          : type === "HARDWARE"
          ? "Equipment & resources"
          : type === "TESTING"
          ? "Product validation"
          : "Build & engineering",
      count: matchingCollaborations.length,
      icon: collaborationTypeIcons[type],
      bg: collaborationTypeStyles[type].bg,
      color: collaborationTypeStyles[type].color,
    };
  });

  const visibleProjects = projects.slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* ================= NAVBAR ================= */}

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
              className="text-sm font-semibold text-teal-700"
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

            <button
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="mx-auto max-w-7xl px-6 pt-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        </div>
      )}

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden border-b border-teal-200 bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-teal-200/50 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-14">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm">
              <Building2 size={16} />
              Industry Innovation Workspace
            </div>

            <h2 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Turn Innovation Into
              <br />
              <span className="text-teal-600">
                Real-World Impact.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Discover university-led solutions, support promising
              projects, and bring innovation closer to real-world
              deployment through meaningful industry collaboration.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/industry/projects"
                className="rounded-xl bg-teal-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700"
              >
                Explore Projects →
              </Link>

              <Link
                href="/industry/collaborations"
                className="rounded-xl border border-teal-200 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50"
              >
                View Collaborations
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-teal-100">
                  <Building2
                    size={16}
                    className="text-teal-700"
                  />
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-emerald-100">
                  <GraduationCap
                    size={16}
                    className="text-emerald-700"
                  />
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-amber-100">
                  <Lightbulb
                    size={16}
                    className="text-amber-700"
                  />
                </div>
              </div>

              <span>
                Industry, universities and innovators building together
              </span>
            </div>
          </div>

          {/* Hero Impact Card */}

          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-teal-200 bg-white/90 p-6 shadow-xl">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-teal-100 blur-2xl" />

              <div className="relative">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Industry Overview
                    </p>

                    <h3 className="mt-1 text-2xl font-bold">
                      Innovation Impact
                    </h3>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                    ● Active
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Projects supported
                      </p>

                      <p className="mt-2 text-4xl font-bold">
                        {loading
                          ? "—"
                          : projectsWithCollaboration.size}
                      </p>
                    </div>

                    <div className="rounded-xl bg-teal-500/15 p-3">
                      <TrendingUp
                        size={23}
                        className="text-teal-300"
                      />
                    </div>
                  </div>

                  <div className="mt-7 h-3 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className="h-full rounded-full bg-teal-500 transition-all"
                      style={{
                        width: `${
                          projects.length > 0
                            ? Math.min(
                                100,
                                Math.round(
                                  (projectsWithCollaboration.size /
                                    projects.length) *
                                    100
                                )
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>

                  <div className="mt-3 flex justify-between text-xs text-slate-400">
                    <span>
                      Projects with collaboration
                    </span>

                    <span>
                      {projects.length > 0
                        ? Math.round(
                            (projectsWithCollaboration.size /
                              projects.length) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-teal-50 p-5">
                    <p className="text-sm text-slate-500">
                      Active Support
                    </p>

                    <p className="mt-1 text-2xl font-bold text-teal-700">
                      {loading
                        ? "—"
                        : formatAmount(fundingSupported)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-5">
                    <p className="text-sm text-slate-500">
                      Projects Impacted
                    </p>

                    <p className="mt-1 text-2xl font-bold text-emerald-700">
                      {loading
                        ? "—"
                        : projectsWithCollaboration.size}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.iconColor}`}
                  >
                    <Icon size={21} />
                  </div>

                  <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
                    <TrendingUp size={12} />
                    Live
                  </div>
                </div>

                <p
                  className={`mt-5 text-3xl font-bold ${stat.valueColor}`}
                >
                  {stat.value}
                </p>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= PROJECTS ================= */}

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-semibold text-teal-600">
              OPPORTUNITIES FOR INDUSTRY
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Projects That Need Support
            </h2>

            <p className="mt-3 max-w-3xl text-slate-600">
              Explore university-led projects where your organisation
              can contribute funding, expertise, technology or field
              support.
            </p>
          </div>

          <Link
            href="/industry/projects"
            className="text-sm font-semibold text-teal-600 hover:text-teal-700"
          >
            View all projects →
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : visibleProjects.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <Lightbulb
              size={32}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 text-lg font-bold">
              No projects available
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              University projects will appear here when they are
              available.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {visibleProjects.map((project, index) => {
              const icons = [
                Wrench,
                FlaskConical,
                CircleDollarSign,
              ];

              const accents = [
                "bg-teal-600",
                "bg-sky-600",
                "bg-amber-500",
              ];

              const Icon = icons[index % icons.length];
              const accent = accents[index % accents.length];

              return (
                <div
                  key={project.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl"
                >
                  <div className={`h-1.5 ${accent}`} />

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                        <Icon size={21} />
                      </div>

                      <span className="rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-bold text-teal-700">
                        {project.status ?? "IDEA"}
                      </span>
                    </div>

                    <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {project.id.slice(0, 8)}
                    </p>

                    <h3 className="mt-1 text-lg font-bold">
                      {project.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                      {project.description ??
                        "No project description available."}
                    </p>

                    <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <GraduationCap
                          size={16}
                          className="mt-0.5 shrink-0 text-teal-600"
                        />

                        <span>
                          {project.university_name ??
                            "University not specified"}
                        </span>
                      </div>
                    </div>

                    {/* Project progress removed */}

                    <div className="mt-5 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Team Members
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {project.member_count ?? 0}
                        </p>
                      </div>

                      <Link
                        href={`/industry/projects/${project.id}`}
                        className="flex items-center gap-1 text-sm font-semibold text-teal-600 transition group-hover:text-teal-700"
                      >
                        View
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= COLLABORATION TYPES ================= */}

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6 shadow-sm md:p-8">
          <div>
            <p className="font-semibold text-teal-600">
              YOUR COLLABORATION ACTIVITY
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Collaboration Types
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your current collaboration requests grouped by support
              type.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {supportTypes.map((type) => {
              const Icon = type.icon;

              return (
                <Link
                  key={type.name}
                  href="/industry/collaborations"
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${type.bg} ${type.color}`}
                    >
                      <Icon size={19} />
                    </div>

                    <ArrowRight
                      size={17}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-600"
                    />
                  </div>

                  <h3 className="mt-4 font-bold">
                    {type.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {type.description}
                  </p>

                  <p className="mt-3 text-xs font-semibold text-teal-600">
                    {type.count} collaboration
                    {type.count === 1 ? "" : "s"}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= ACTIVITY ================= */}

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-teal-600">
                  RECENT ACTIVITY
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Collaboration Updates
                </h2>
              </div>

              <Link
                href="/industry/collaborations"
                className="text-sm font-semibold text-teal-600 hover:text-teal-700"
              >
                View all →
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {loading ? (
                [1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-16 animate-pulse rounded-2xl bg-slate-100"
                  />
                ))
              ) : activities.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <Handshake
                    size={28}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No collaboration activity yet
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Explore projects and send your first collaboration
                    request.
                  </p>
                </div>
              ) : (
                activities.map((activity) => {
                  const Icon = activity.icon;

                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-teal-100 hover:bg-teal-50/40"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm">
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800">
                          {activity.title}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {activity.project}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock3 size={13} />
                        {activity.time}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Actions */}

          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-lg">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-500/20 blur-2xl" />

            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-wider text-teal-300">
                Industry Workspace
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Ready to make an impact?
              </h2>

              <div className="mt-6 space-y-3">
                <Link
                  href="/industry/projects"
                  className="flex items-center gap-3 rounded-xl bg-white/10 p-4 transition hover:bg-teal-600/20"
                >
                  <Lightbulb
                    size={19}
                    className="text-teal-300"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      Discover Projects
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Find solutions needing support
                    </p>
                  </div>

                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/industry/collaborations"
                  className="flex items-center gap-3 rounded-xl bg-white/10 p-4 transition hover:bg-teal-600/20"
                >
                  <Handshake
                    size={19}
                    className="text-teal-300"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      My Collaborations
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Track your partnerships
                    </p>
                  </div>

                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/industry/profile"
                  className="flex items-center gap-3 rounded-xl bg-white/10 p-4 transition hover:bg-teal-600/20"
                >
                  <Building2
                    size={19}
                    className="text-teal-300"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      Organisation Profile
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Manage capabilities
                    </p>
                  </div>

                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-teal-600 px-8 py-14 text-white shadow-xl md:px-14">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-teal-200">
                BUILD WITH PURPOSE
              </p>

              <h2 className="mt-2 max-w-2xl text-3xl font-bold">
                Your expertise can move a solution from prototype to
                impact.
              </h2>

              <p className="mt-3 max-w-xl text-teal-100">
                Support promising projects through funding, mentorship,
                testing, prototyping or field deployment.
              </p>
            </div>

            <Link
              href="/industry/projects"
              className="rounded-xl bg-white px-6 py-4 font-semibold text-teal-600 shadow-sm transition hover:bg-slate-50"
            >
              Explore Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold">
                S
              </div>

              <div>
                <p className="font-semibold">SamadhanX</p>

                <p className="text-sm text-slate-400">
                  Ideas → Action → Impact
                </p>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-slate-400">
            © 2026 SamadhanX. All rights reserved.
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-slate-300">
            <Link
              href="/industry/profile"
              className="hover:text-white"
            >
              Profile
            </Link>

            <Link
              href="/industry/collaborations"
              className="hover:text-white"
            >
              Collaborations
            </Link>

            <Link
              href="/help"
              className="hover:text-white"
            >
              Help
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

