
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  Search,
} from "lucide-react";

import { getAuthToken } from "@/lib/api/client";

type ProjectStage =
  | "Prototype"
  | "RealityCheck"
  | "Testing"
  | "Pilot / Impact";

type Project = {
  id: string;
  title: string;
  problem: string;
  university: string;
  stage: ProjectStage;
  progress: number;
  description: string;
};

type ApiProject = {
  id: string;
  problem_id: string | null;
  solution_id: string | null;
  title: string;
  description: string | null;
  status: string | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  prototype_name: string | null;
  prototype_url: string | null;
  university_name: string | null;
  member_count?: number;
};

const stageOptions = [
  "All Stages",
  "Prototype",
  "RealityCheck",
  "Testing",
  "Pilot / Impact",
];

const PROJECTS_PER_PAGE = 6;

/*
 * University workflow:
 *
 * Prototype
 *      ↓
 * RealityCheck
 *      ↓
 * Testing
 *      ↓
 * Pilot / Impact
 *
 * Backend project statuses are mapped to this workflow.
 */

const statusToStage: Record<string, ProjectStage> = {
  IDEA: "Prototype",
  VALIDATION: "Prototype",
  TEAM_FORMATION: "Prototype",
  SOLUTION_DESIGN: "Prototype",
  PROTOTYPE: "Prototype",

  FIELD_PILOT: "RealityCheck",

  DEPLOYED: "Testing",

  IMPACT_MEASUREMENT: "Pilot / Impact",
};

const statusToProgress: Record<string, number> = {
  IDEA: 25,
  VALIDATION: 30,
  TEAM_FORMATION: 35,
  SOLUTION_DESIGN: 40,
  PROTOTYPE: 50,

  FIELD_PILOT: 70,

  DEPLOYED: 85,

  IMPACT_MEASUREMENT: 100,
};

function mapApiProject(project: ApiProject): Project {
  const status = project.status ?? "";

  return {
    id: project.id,

    title: project.title,

    problem:
      project.description ??
      "No project description available.",

    university:
      project.university_name ??
      "University not specified",

    stage:
      statusToStage[status] ??
      "Prototype",

    progress:
      statusToProgress[status] ??
      25,

    description:
      project.description ??
      "No project description available.",
  };
}

async function getProjects(): Promise<Project[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";

  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(
    `${baseUrl}/api/projects`,
    {
      method: "GET",

      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },

      cache: "no-store",
    }
  );

  if (!response.ok) {
    let message =
      `Failed to load projects (${response.status})`;

    try {
      const body = await response.json();

      if (body?.detail) {
        message = body.detail;
      }
    } catch {}

    throw new Error(message);
  }

  const data =
    (await response.json()) as ApiProject[];

  return data.map(mapApiProject);
}

function getStageStyle(stage: ProjectStage) {
  switch (stage) {
    case "Prototype":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "RealityCheck":
      return "border-sky-200 bg-sky-50 text-sky-700";

    case "Testing":
      return "border-teal-200 bg-teal-50 text-teal-700";

    case "Pilot / Impact":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
}

export default function IndustryProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [university, setUniversity] =
    useState("All Universities");

  const [stage, setStage] =
    useState("All Stages");

  const [currentPage, setCurrentPage] =
    useState(1);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        setLoading(true);
        setError("");

        const data = await getProjects();

        if (!cancelled) {
          setProjects(data);
        }
      } catch (err) {
        console.error(
          "Failed to load industry projects:",
          err
        );

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load projects."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Get actual universities from projects.
   *
   * This means the university filter automatically
   * updates according to backend data.
   */

  const universityOptions = useMemo(() => {
    const universities = projects
      .map((project) => project.university)
      .filter(
        (name) =>
          name &&
          name !== "University not specified"
      );

    return [
      "All Universities",
      ...Array.from(
        new Set(universities)
      ).sort(),
    ];
  }, [projects]);

  /*
   * Apply filters.
   *
   * Only filters based on real project data are used.
   */

  const filteredProjects = useMemo(() => {
    const query =
      search.toLowerCase().trim();

    return projects.filter((project) => {
      const matchesSearch =
        !query ||
        project.title
          .toLowerCase()
          .includes(query) ||
        project.description
          .toLowerCase()
          .includes(query) ||
        project.university
          .toLowerCase()
          .includes(query);

      const matchesUniversity =
        university === "All Universities" ||
        project.university === university;

      const matchesStage =
        stage === "All Stages" ||
        project.stage === stage;

      return (
        matchesSearch &&
        matchesUniversity &&
        matchesStage
      );
    });
  }, [
    projects,
    search,
    university,
    stage,
  ]);

  const totalPages = Math.ceil(
    filteredProjects.length /
      PROJECTS_PER_PAGE
  );

  const visibleProjects =
    filteredProjects.slice(
      (currentPage - 1) *
        PROJECTS_PER_PAGE,
      currentPage *
        PROJECTS_PER_PAGE
    );

  function resetPage() {
    setCurrentPage(1);
  }

  function handleSearch(value: string) {
    setSearch(value);
    resetPage();
  }

  function handleUniversity(value: string) {
    setUniversity(value);
    resetPage();
  }

  function handleStage(value: string) {
    setStage(value);
    resetPage();
  }

  /*
   * Active projects are projects currently
   * between RealityCheck and Testing.
   */

  const activeProjects =
    projects.filter(
      (project) =>
        project.stage === "RealityCheck" ||
        project.stage === "Testing"
    ).length;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">

      {/* ================================================== */}
      {/* NAVBAR */}
      {/* ================================================== */}

      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}

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

          {/* Navigation */}

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


      {/* ================================================== */}
      {/* HERO */}
      {/* ================================================== */}

      <section className="relative overflow-hidden border-b border-teal-900 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900">

        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />

        <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-12">

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

            <div className="max-w-3xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-400/40 bg-teal-800/60 px-3 py-1.5 text-xs font-semibold text-teal-100 shadow-sm">

                <Building2 size={14} />

                Industry Innovation Network

              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">

                Discover Innovation Projects

                <span className="block text-teal-100">
                  Ready for Industry Support.
                </span>

              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-teal-50 sm:text-base">
                Explore university-led projects solving
                real community challenges and discover
                opportunities for industry collaboration.
              </p>

            </div>


            <div className="grid grid-cols-2 gap-3 sm:w-fit">

              <div className="rounded-2xl border border-teal-100 bg-white px-5 py-4 shadow-sm">

                <p className="text-2xl font-bold text-teal-700">
                  {projects.length}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Available Projects
                </p>

              </div>


              <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">

                <p className="text-2xl font-bold text-emerald-700">
                  {activeProjects}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Active Projects
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================================================== */}
      {/* FILTERS */}
      {/* ================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-7">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-base font-bold text-slate-900">
                Find the Right Project
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Search and filter projects by university
                and current project stage.
              </p>

            </div>

            <div className="w-fit rounded-xl bg-teal-50 px-3 py-2 text-xs font-bold text-teal-700">
              {filteredProjects.length} projects found
            </div>

          </div>


          <div className="grid gap-3 md:grid-cols-3">

            {/* Search */}

            <div className="relative">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  handleSearch(e.target.value)
                }
                placeholder="Search projects or universities..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />

            </div>


            {/* University */}

            <select
              value={university}
              onChange={(e) =>
                handleUniversity(e.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
            >
              {universityOptions.map(
                (option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                )
              )}
            </select>


            {/* Stage */}

            <select
              value={stage}
              onChange={(e) =>
                handleStage(e.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
            >
              {stageOptions.map(
                (option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                )
              )}
            </select>

          </div>

        </div>
      </section>


      {/* ================================================== */}
      {/* PROJECTS */}
      {/* ================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-10">

        <div className="mb-5 flex items-end justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Innovation Pipeline
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Projects Open for Collaboration
            </h2>

          </div>


          {filteredProjects.length > 0 && (
            <p className="hidden text-sm text-slate-500 sm:block">

              Showing{" "}
              {(currentPage - 1) *
                PROJECTS_PER_PAGE +
                1}
              –
              {Math.min(
                currentPage *
                  PROJECTS_PER_PAGE,
                filteredProjects.length
              )}{" "}
              of {filteredProjects.length}

            </p>
          )}

        </div>


        {/* Loading */}

        {loading ? (

          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">

            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Loading projects...
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Fetching projects from the SamadhanX backend.
            </p>

          </div>

        ) : error ? (

          /* Error */

          <div className="rounded-2xl border border-rose-200 bg-white px-6 py-16 text-center">

            <h3 className="text-lg font-bold text-slate-900">
              Unable to load projects
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-rose-600">
              {error}
            </p>

          </div>

        ) : visibleProjects.length === 0 ? (

          /* Empty */

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <Search size={24} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No projects found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Try changing your search, university,
              or project stage filter.
            </p>

          </div>

        ) : (

          /* Project cards */

          <div className="grid gap-5 lg:grid-cols-2">

            {visibleProjects.map(
              (project) => (

                <article
                  key={project.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg"
                >

                  <div className="h-1.5 bg-gradient-to-r from-teal-600 via-emerald-500 to-sky-500" />


                  <div className="p-6">

                    {/* Header */}

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex min-w-0 items-start gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                          <Lightbulb size={21} />
                        </div>

                        <div className="min-w-0">

                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Project
                          </p>

                          <h3 className="mt-1 text-lg font-bold leading-snug text-slate-900">
                            {project.title}
                          </h3>

                        </div>

                      </div>


                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStageStyle(
                          project.stage
                        )}`}
                      >
                        {project.stage}
                      </span>

                    </div>


                    {/* Description */}

                    <div className="mt-5 rounded-xl bg-slate-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Project Description
                      </p>

                      <p className="mt-1 text-sm font-semibold leading-5 text-slate-800">
                        {project.problem}
                      </p>

                    </div>


                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      {project.description}
                    </p>


                    {/* University */}

                    <div className="mt-5">

                      <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">

                          <GraduationCap size={18} />

                        </div>

                        <div className="min-w-0">

                          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                            University
                          </p>

                          <p className="truncate text-sm font-semibold text-slate-700">
                            {project.university}
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* Progress */}

                    <div className="mt-5">

                      <div className="mb-2 flex items-center justify-between">

                        <span className="text-xs font-bold text-slate-500">
                          University Project Progress
                        </span>

                        <span className="text-xs font-bold text-teal-700">
                          {project.progress}%
                        </span>

                      </div>


                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className="h-full rounded-full bg-teal-600 transition-all"
                          style={{
                            width: `${project.progress}%`,
                          }}
                        />

                      </div>


                      {/* Workflow */}

                      <div className="mt-2 flex items-center justify-between text-[10px] font-semibold">

                        <span
                          className={
                            project.stage ===
                            "Prototype"
                              ? "text-teal-700"
                              : "text-slate-400"
                          }
                        >
                          Prototype
                        </span>

                        <span
                          className={
                            project.stage ===
                            "RealityCheck"
                              ? "text-teal-700"
                              : "text-slate-400"
                          }
                        >
                          RealityCheck
                        </span>

                        <span
                          className={
                            project.stage ===
                            "Testing"
                              ? "text-teal-700"
                              : "text-slate-400"
                          }
                        >
                          Testing
                        </span>

                        <span
                          className={
                            project.stage ===
                            "Pilot / Impact"
                              ? "text-teal-700"
                              : "text-slate-400"
                          }
                        >
                          Pilot / Impact
                        </span>

                      </div>

                    </div>


                    {/* Bottom */}

                    <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-center gap-2">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                          <CheckCircle2 size={17} />
                        </div>

                        <div>

                          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                            Collaboration
                          </p>

                          <p className="text-xs font-bold text-slate-700">
                            Open for Collaboration
                          </p>

                        </div>

                      </div>


                      <Link
                        href={`/industry/projects/${project.id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700"
                      >
                        View Project
                        <ArrowRight size={16} />
                      </Link>

                    </div>

                  </div>

                </article>

              )
            )}

          </div>
        )}


        {/* Pagination */}

        {totalPages > 1 && (

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row">

            <button
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      page - 1,
                      1
                    )
                )
              }
              disabled={currentPage === 1}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={16} />
              Previous
            </button>


            <div className="flex items-center gap-2">

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) =>
                  index + 1
              ).map((page) => (

                <button
                  key={page}
                  onClick={() =>
                    setCurrentPage(page)
                  }
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition ${
                    currentPage === page
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                  }`}
                >
                  {page}
                </button>

              ))}

            </div>


            <button
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      page + 1,
                      totalPages
                    )
                )
              }
              disabled={
                currentPage === totalPages
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ArrowRight size={16} />
            </button>

          </div>

        )}

      </section>


      {/* ================================================== */}
      {/* CTA */}
      {/* ================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-12">

        <div className="overflow-hidden rounded-3xl bg-slate-900 p-7 text-white shadow-lg sm:p-9">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex items-center gap-2 text-teal-300">

                <CheckCircle2 size={18} />

                <span className="text-xs font-bold uppercase tracking-wider">
                  Industry × Innovation
                </span>

              </div>

              <h2 className="mt-2 text-2xl font-bold">
                Found a project worth supporting?
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Connect with university teams and
                contribute funding, mentorship,
                hardware, testing, or prototyping
                support.
              </p>

            </div>


            <Link
              href="/industry/collaborations"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-400"
            >
              Explore Collaborations
              <ArrowRight size={17} />
            </Link>

          </div>

        </div>

      </section>


      {/* ================================================== */}
      {/* FOOTER */}
      {/* ================================================== */}

      <footer className="border-t border-slate-200 bg-white py-5 text-center text-[11px] text-slate-400">
        © 2026 SamadhanX • Ideas → Action → Impact
      </footer>

    </main>
  );
}

