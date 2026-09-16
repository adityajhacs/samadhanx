
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  DollarSign,
  Filter,
  Lightbulb,
  Plus,
  Search,
  Sparkles,
  University as UniversityIcon,
  X,
} from "lucide-react";

import { apiRequest, getAuthToken } from "@/lib/api/client";

type PrototypeStatus =
  | "IDEA"
  | "DESIGN"
  | "PROTOTYPE"
  | "FIELD_TEST"
  | "DEPLOYED";

type UserRole =
  | "university"
  | "faculty"
  | "student"
  | "government"
  | "industry"
  | "citizen"
  | string;

type Solution = {
  id: string;
  problem_id?: string | null;
  university_id?: string | null;
  project_id?: string | null;

  solution_title: string;
  description?: string | null;

  prototype_description?: string | null;
  how_it_works?: string | null;
  key_features?: string | null;
  problem_solution?: string | null;

  prototype_status?: string | null;
  estimated_cost?: string | number | null;
  funding_received?: string | number | null;
  created_at?: string | null;
};

type Problem = {
  id: string;
  title: string;
};

type University = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  title: string;
};

type CurrentUser = {
  id: string;
  role?: UserRole | null;
  university_id?: string | null;
};

const STATUS_OPTIONS: PrototypeStatus[] = [
  "IDEA",
  "DESIGN",
  "PROTOTYPE",
  "FIELD_TEST",
  "DEPLOYED",
];

function normalizeStatus(status?: string | null): PrototypeStatus {
  const normalized = String(status || "IDEA")
    .trim()
    .toUpperCase()
    .replace(/-/g, "_")
    .replace(/ /g, "_");

  if (
    normalized === "DESIGN" ||
    normalized === "PROTOTYPE" ||
    normalized === "FIELD_TEST" ||
    normalized === "DEPLOYED"
  ) {
    return normalized;
  }

  return "IDEA";
}

function getStatusLabel(status?: string | null) {
  switch (normalizeStatus(status)) {
    case "IDEA":
      return "Idea Submitted";

    case "DESIGN":
      return "Design";

    case "PROTOTYPE":
      return "Prototype";

    case "FIELD_TEST":
      return "Field Testing";

    case "DEPLOYED":
      return "Deployed";

    default:
      return "Idea Submitted";
  }
}

function getStatusType(status?: string | null) {
  switch (normalizeStatus(status)) {
    case "DEPLOYED":
      return "ready";

    case "FIELD_TEST":
    case "PROTOTYPE":
    case "DESIGN":
      return "development";

    default:
      return "idea";
  }
}

function getStatusDescription(status?: string | null) {
  switch (normalizeStatus(status)) {
    case "DEPLOYED":
      return "Solution has been deployed and is being used in the field.";

    case "FIELD_TEST":
      return "Prototype is currently being tested in real-world conditions.";

    case "PROTOTYPE":
      return "Prototype is under development and testing.";

    case "DESIGN":
      return "Solution design is being developed and refined.";

    default:
      return "Solution idea has been submitted and is ready for further development.";
  }
}

function formatCurrency(value?: string | number | null) {
  if (value === null || value === undefined || value === "") {
    return "Not specified";
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return `₹${numericValue.toLocaleString("en-IN")}`;
}

export default function UniversitySolutionsPage() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(null);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [problemFilter, setProblemFilter] = useState("");
  const [universityFilter, setUniversityFilter] = useState("");

  const token = getAuthToken();

  const canCreateSolution =
    currentUser?.role === "university" ||
    currentUser?.role === "faculty";

  /* =========================================================
     LOAD PAGE DATA
  ========================================================= */

  useEffect(() => {
    async function loadPageData() {
      if (!token) {
        setPageError("Please login first.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setPageError("");

        const [
          solutionsData,
          problemsData,
          universitiesData,
          projectsData,
          userData,
        ] = await Promise.all([
          apiRequest<Solution[]>("/api/solutions", {
            method: "GET",
            token,
          }),

          apiRequest<Problem[]>("/api/problems", {
            method: "GET",
            token,
          }),

          apiRequest<University[]>("/api/universities", {
            method: "GET",
            token,
          }),

          apiRequest<Project[]>("/api/projects", {
            method: "GET",
            token,
          }),

          apiRequest<CurrentUser>("/api/auth/me", {
            method: "GET",
            token,
          }),
        ]);

        setSolutions(
          Array.isArray(solutionsData) ? solutionsData : []
        );

        setProblems(
          Array.isArray(problemsData) ? problemsData : []
        );

        setUniversities(
          Array.isArray(universitiesData)
            ? universitiesData
            : []
        );

        setProjects(
          Array.isArray(projectsData) ? projectsData : []
        );

        setCurrentUser(userData);
      } catch (error) {
        console.error(
          "Failed to load solutions page:",
          error
        );

        setPageError(
          error instanceof Error
            ? error.message
            : "Failed to load solutions."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPageData();
  }, [token]);

  /* =========================================================
     LOOKUP MAPS
  ========================================================= */

  const problemMap = useMemo(() => {
    return new Map(
      problems.map((problem) => [
        problem.id,
        problem.title,
      ])
    );
  }, [problems]);

  const universityMap = useMemo(() => {
    return new Map(
      universities.map((university) => [
        university.id,
        university.name,
      ])
    );
  }, [universities]);

  const projectMap = useMemo(() => {
    return new Map(
      projects.map((project) => [
        project.id,
        project.title,
      ])
    );
  }, [projects]);

  /* =========================================================
     FILTERED SOLUTIONS
  ========================================================= */

  const filteredSolutions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return solutions.filter((solution) => {
      const status = normalizeStatus(
        solution.prototype_status
      );

      const problemName =
        problemMap.get(solution.problem_id || "") ||
        "Unknown Problem";

      const universityName =
        universityMap.get(
          solution.university_id || ""
        ) || "Unknown University";

      const projectName = solution.project_id
        ? projectMap.get(solution.project_id) || ""
        : "";

      const matchesSearch =
        query === "" ||
        solution.solution_title
          .toLowerCase()
          .includes(query) ||
        String(solution.description || "")
          .toLowerCase()
          .includes(query) ||
        problemName.toLowerCase().includes(query) ||
        universityName.toLowerCase().includes(query) ||
        projectName.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "" ||
        status === statusFilter;

      const matchesProblem =
        problemFilter === "" ||
        solution.problem_id === problemFilter;

      const matchesUniversity =
        universityFilter === "" ||
        solution.university_id === universityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesProblem &&
        matchesUniversity
      );
    });
  }, [
    solutions,
    searchQuery,
    statusFilter,
    problemFilter,
    universityFilter,
    problemMap,
    universityMap,
    projectMap,
  ]);

  /* =========================================================
     STATS
  ========================================================= */

  const totalSolutions = solutions.length;

  const prototypeReady = useMemo(
    () =>
      solutions.filter(
        (solution) =>
          normalizeStatus(
            solution.prototype_status
          ) === "DEPLOYED"
      ).length,
    [solutions]
  );

  const inDevelopment = useMemo(
    () =>
      solutions.filter((solution) =>
        [
          "DESIGN",
          "PROTOTYPE",
          "FIELD_TEST",
        ].includes(
          normalizeStatus(
            solution.prototype_status
          )
        )
      ).length,
    [solutions]
  );

  const ideaSubmitted = useMemo(
    () =>
      solutions.filter(
        (solution) =>
          normalizeStatus(
            solution.prototype_status
          ) === "IDEA"
      ).length,
    [solutions]
  );

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setProblemFilter("");
    setUniversityFilter("");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "" ||
    problemFilter !== "" ||
    universityFilter !== "";

  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <nav className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
            <Link
              href="/university/dashboard"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">
                S
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  SamadhanX
                </h1>

                <p className="text-xs text-slate-500">
                  Ideas → Action → Impact
                </p>
              </div>
            </Link>
          </div>
        </nav>

        <section className="mx-auto flex max-w-7xl items-center justify-center px-6 py-32">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading solutions...
            </p>
          </div>
        </section>
      </main>
    );
  }

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* ================= NAVBAR ================= */}

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/university/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">
              S
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                SamadhanX
              </h1>

              <p className="text-xs text-slate-500">
                Ideas → Action → Impact
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/university/dashboard"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Dashboard
            </Link>

            <Link
              href="/university/problems"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Problems
            </Link>

            <Link
              href="/university/projects"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Projects
            </Link>

            <Link
              href="/university/solutions"
              className="text-sm font-semibold text-teal-600"
            >
              Solutions
            </Link>

            <Link
              href="/university/teams"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Teams
            </Link>

            <Link
              href="/university/profile"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}

      <section className="mx-auto max-w-7xl px-6 py-9">
        {/* ================= HEADING ================= */}

        <div className="mb-8 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100">
                <Lightbulb className="h-7 w-7 text-teal-600" />
              </div>

              <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-[44px]">
                Solutions
              </h2>
            </div>

            <p className="mt-3 max-w-xl text-base leading-6 text-slate-500">
              Develop innovative solutions and turn ideas
              into real-world impact.
            </p>
          </div>

          {/* ================= ACTION BUTTONS ================= */}

          <div className="flex flex-wrap gap-3">
            <Link
              href="/university/my-solutions"
              className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-white px-5 py-3 text-sm font-bold text-teal-700 shadow-sm transition hover:border-teal-400 hover:bg-teal-50"
            >
              <Lightbulb className="h-4 w-4" />

              My Solutions
            </Link>

            <Link
              href="/university/solutions/recommendations"
              className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow-sm transition hover:border-violet-400 hover:bg-violet-50"
            >
              <Sparkles className="h-4 w-4" />

              AI Recommended Solutions
            </Link>
          </div>
        </div>

        {/* ================= ERROR ================= */}

        {pageError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            {pageError}
          </div>
        )}

        {/* ================= STATS ================= */}

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("solutions-list")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
            className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-50 hover:shadow-md"
          >
            <p className="text-sm font-medium text-slate-500 group-hover:text-teal-700">
              Total Solutions
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900 group-hover:text-teal-700">
              {totalSolutions}
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("solutions-list")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
            className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-50 hover:shadow-md"
          >
            <p className="text-sm font-medium text-slate-500 group-hover:text-teal-700">
              Prototype Ready
            </p>

            <p className="mt-1 text-3xl font-bold text-teal-600">
              {prototypeReady}
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("solutions-list")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
            className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-50 hover:shadow-md"
          >
            <p className="text-sm font-medium text-slate-500 group-hover:text-teal-700">
              In Development
            </p>

            <p className="mt-1 text-3xl font-bold text-amber-600">
              {inDevelopment}
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("solutions-list")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
            className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-50 hover:shadow-md"
          >
            <p className="text-sm font-medium text-slate-500 group-hover:text-teal-700">
              Ideas Submitted
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-600">
              {ideaSubmitted}
            </p>
          </button>
        </div>

        {/* ================= SEARCH + FILTERS ================= */}

        <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4">
            {/* SEARCH */}

            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search solutions, problems, universities or projects..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
            </div>

            {/* FILTERS */}

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Filter className="h-4 w-4 text-teal-600" />

                Filters
              </div>

              <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-3">
                {/* STATUS */}

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="">
                      All Prototype Status
                    </option>

                    {STATUS_OPTIONS.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {getStatusLabel(status)}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>

                {/* PROBLEM */}

                <div className="relative">
                  <select
                    value={problemFilter}
                    onChange={(event) =>
                      setProblemFilter(event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="">
                      All Problems
                    </option>

                    {problems.map((problem) => (
                      <option
                        key={problem.id}
                        value={problem.id}
                      >
                        {problem.title}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>

                {/* UNIVERSITY */}

                <div className="relative">
                  <select
                    value={universityFilter}
                    onChange={(event) =>
                      setUniversityFilter(
                        event.target.value
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="">
                      All Universities
                    </option>

                    {universities.map((university) => (
                      <option
                        key={university.id}
                        value={university.id}
                      >
                        {university.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />

                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ================= RESULT COUNT ================= */}

        <div
          id="solutions-list"
          className="mb-4 flex items-center justify-between"
        >
          <p className="text-sm font-medium text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-800">
              {filteredSolutions.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-800">
              {solutions.length}
            </span>{" "}
            solutions
          </p>
        </div>

        {/* ================= SOLUTIONS ================= */}

        {filteredSolutions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Lightbulb className="h-7 w-7 text-slate-400" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No solutions found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try changing your search or filters to find
              solutions from different universities.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {filteredSolutions.map((solution) => {
              const status = normalizeStatus(
                solution.prototype_status
              );

              const statusType = getStatusType(
                solution.prototype_status
              );

              const problemName =
                problemMap.get(
                  solution.problem_id || ""
                ) || "Problem not available";

              const universityName =
                universityMap.get(
                  solution.university_id || ""
                ) || "University not available";

              const projectName = solution.project_id
                ? projectMap.get(solution.project_id) ||
                  "Project not available"
                : null;

              return (
                <div
                  key={solution.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-300 hover:shadow-md"
                >
                  <div className="flex flex-col gap-6 lg:flex-row">
                    {/* LEFT */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900 transition group-hover:text-teal-700">
                          {solution.solution_title}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            statusType === "ready"
                              ? "bg-emerald-50 text-emerald-600"
                              : statusType ===
                                  "development"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {getStatusLabel(
                            solution.prototype_status
                          )}
                        </span>
                      </div>

                      {/* UNIVERSITY */}

                      <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                        <UniversityIcon className="h-4 w-4 text-teal-600" />

                        <span>University:</span>

                        <span className="font-semibold text-slate-700">
                          {universityName}
                        </span>
                      </div>

                      {/* PROBLEM */}

                      <p className="mt-2 text-sm text-slate-500">
                        Solving:{" "}
                        <span className="font-medium text-slate-700">
                          {problemName}
                        </span>
                      </p>

                      {/* PROJECT */}

                      {projectName && (
                        <p className="mt-2 text-sm text-slate-500">
                          Project:{" "}
                          <span className="font-medium text-slate-700">
                            {projectName}
                          </span>
                        </p>
                      )}

                      {/* DESCRIPTION */}

                      {solution.description && (
                        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500">
                          {solution.description}
                        </p>
                      )}

                      {/* COST */}

                      <div className="mt-5">
                        <div className="max-w-xs rounded-xl bg-slate-50 p-4 transition hover:bg-teal-50">
                          <div className="flex items-center gap-2 text-slate-500">
                            <DollarSign className="h-4 w-4 text-teal-600" />

                            <span className="text-xs">
                              Estimated Cost
                            </span>
                          </div>

                          <p className="mt-2 font-bold text-slate-900">
                            {formatCurrency(
                              solution.estimated_cost
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}

                    <div className="flex w-full flex-col justify-between border-t border-slate-100 pt-5 lg:w-64 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                      <div>
                        <div className="flex items-center gap-2">
                          {status === "DEPLOYED" ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <Clock3 className="h-5 w-5 text-amber-500" />
                          )}

                          <p className="font-bold">
                            Prototype Status
                          </p>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {getStatusDescription(
                            solution.prototype_status
                          )}
                        </p>
                      </div>

                      <Link
                        href={`/university/solutions/${solution.id}`}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-teal-400 px-4 py-3 text-sm font-bold text-teal-600 transition hover:bg-teal-600 hover:text-white"
                      >
                        View Solution

                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= CREATE CTA ================= */}

        {canCreateSolution && (
          <div className="mt-8 rounded-3xl border border-teal-200 bg-teal-100 px-7 py-8 shadow-sm md:px-10">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Lightbulb className="h-6 w-6 text-teal-600" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Have an innovative solution?
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Submit your solution and turn your idea
                    into meaningful real-world impact.
                  </p>
                </div>
              </div>

              <Link
                href="/university/solutions/create"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 hover:shadow-md"
              >
                Create New Solution

                <Plus className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="mt-12 bg-slate-950 px-6 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">
          <Link
            href="/university/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">
              S
            </div>

            <div>
              <p className="text-lg font-bold">
                SamadhanX
              </p>

              <p className="text-sm text-slate-400">
                Ideas → Action → Impact
              </p>
            </div>
          </Link>

          <p className="text-sm text-slate-400">
            © 2026 SamadhanX. Building solutions that
            matter.
          </p>

          <div className="flex gap-5 text-sm text-slate-400">
            <Link
              href="/university/problems"
              className="transition hover:text-white"
            >
              Problems
            </Link>

            <Link
              href="/help"
              className="transition hover:text-white"
            >
              Help
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

