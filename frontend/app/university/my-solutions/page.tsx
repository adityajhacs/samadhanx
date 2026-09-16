
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Lightbulb,
  Loader2,
  Search,
} from "lucide-react";

import {
  getSolutions,
  Solution,
} from "@/lib/api/solutions";

import {
  getMyUniversityId,
  getMyUniversityProblems,
  UniversityProblem,
} from "@/lib/api/universities";

const STATUS_STYLES: Record<string, string> = {
  IDEA: "bg-slate-100 text-slate-700",
  DESIGN: "bg-blue-100 text-blue-700",
  PROTOTYPE: "bg-amber-100 text-amber-700",
  FIELD_TEST: "bg-purple-100 text-purple-700",
  DEPLOYED: "bg-emerald-100 text-emerald-700",
};

export default function MySolutionsPage() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [problems, setProblems] = useState<UniversityProblem[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMySolutions() {
      try {
        setLoading(true);
        setError("");

        // Current logged-in university
        const universityId = await getMyUniversityId();

        if (!universityId) {
          throw new Error(
            "Your account is not linked to a university."
          );
        }

        // ONLY current university's solutions
        const [solutionData, problemData] = await Promise.all([
          getSolutions({
            university_id: universityId,
          }),
          getMyUniversityProblems(),
        ]);

        setSolutions(solutionData);
        setProblems(problemData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load your solutions."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMySolutions();
  }, []);

  const problemMap = useMemo(() => {
    const map = new Map<string, UniversityProblem>();

    problems.forEach((problem) => {
      map.set(problem.id, problem);
    });

    return map;
  }, [problems]);

  const filteredSolutions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return solutions;
    }

    return solutions.filter((solution) => {
      const problem = solution.problem_id
        ? problemMap.get(solution.problem_id)
        : undefined;

      return (
        solution.solution_title
          .toLowerCase()
          .includes(query) ||
        solution.description
          ?.toLowerCase()
          .includes(query) ||
        solution.prototype_status
          ?.toLowerCase()
          .includes(query) ||
        problem?.title
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [solutions, search, problemMap]);

  const totalFunding = solutions.reduce(
    (sum, solution) =>
      sum + Number(solution.funding_received || 0),
    0
  );

  const totalEstimatedCost = solutions.reduce(
    (sum, solution) =>
      sum + Number(solution.estimated_cost || 0),
    0
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/university/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">
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
              href="/university/dashboard"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Dashboard
            </Link>

            <Link
              href="/university/problems"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Problems
            </Link>

            <Link
              href="/university/solutions"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Solutions
            </Link>

            <Link
              href="/university/my-solutions"
              className="text-sm font-semibold text-teal-700"
            >
              My Solutions
            </Link>

            <Link
              href="/university/projects"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Projects
            </Link>

            <Link
              href="/university/teams"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Teams
            </Link>

            <Link
              href="/university/profile"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= CONTENT ================= */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100">
                <Lightbulb className="h-6 w-6 text-teal-600" />
              </div>

              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-700">
                Your University
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              My Solutions
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Solutions created by your university for the problems
              you are working on.
            </p>
          </div>

          <Link
            href="/university/solutions"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:text-teal-700"
          >
            Explore All Solutions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<Lightbulb className="h-5 w-5" />}
            label="My Solutions"
            value={String(solutions.length)}
          />

          <StatCard
            icon={<CircleDollarSign className="h-5 w-5" />}
            label="Estimated Cost"
            value={formatCurrency(totalEstimatedCost)}
          />

          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Funding Received"
            value={formatCurrency(totalFunding)}
          />
        </div>

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search your solutions or problems..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
              Loading your solutions...
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredSolutions.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <FileText className="h-7 w-7 text-slate-400" />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                {search
                  ? "No matching solutions"
                  : "No solutions created yet"}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {search
                  ? "Try searching with another solution or problem name."
                  : "Solutions created by your university will appear here."}
              </p>
            </div>
          )}

        {/* Solutions */}
        {!loading &&
          !error &&
          filteredSolutions.length > 0 && (
            <div className="grid gap-5 lg:grid-cols-2">
              {filteredSolutions.map((solution) => {
                const problem = solution.problem_id
                  ? problemMap.get(solution.problem_id)
                  : undefined;

                const status =
                  solution.prototype_status || "IDEA";

                return (
                  <article
                    key={solution.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
                  >
                    {/* Top */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100">
                          <Lightbulb className="h-5 w-5 text-teal-600" />
                        </div>

                        <div className="min-w-0">
                          <h2 className="text-lg font-bold text-slate-900">
                            {solution.solution_title}
                          </h2>

                          <p className="mt-1 text-xs text-slate-500">
                            Problem:{" "}
                            {problem?.title ||
                              solution.problem_id ||
                              "Problem not available"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${
                          STATUS_STYLES[status] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {status.replaceAll("_", " ")}
                      </span>
                    </div>

                    {/* Description */}
                    {solution.description && (
                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
                        {solution.description}
                      </p>
                    )}

                    {/* Financial information */}
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <InfoCard
                        label="Estimated Cost"
                        value={formatCurrency(
                          solution.estimated_cost
                        )}
                      />

                      <InfoCard
                        label="Funding Received"
                        value={formatCurrency(
                          solution.funding_received
                        )}
                      />
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <Link
                        href={`/university/solutions/recommendations?problem=${solution.problem_id}&solution=${solution.id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
                      >
                        View Recommendation
                        <ArrowRight className="h-4 w-4" />
                      </Link>

                      <span className="text-xs text-slate-400">
                        {solution.created_at
                          ? new Date(
                              solution.created_at
                            ).toLocaleDateString("en-IN")
                          : "Date unavailable"}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
      </section>

      {/* Footer */}
      <footer className="mt-8 bg-slate-950 px-6 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold">
              S
            </div>

            <div>
              <p className="font-bold">SamadhanX</p>

              <p className="text-xs text-slate-400">
                Ideas → Action → Impact
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-400">
            © 2026 SamadhanX. Building solutions that matter.
          </p>
        </div>
      </footer>
    </main>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
          {icon}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function formatCurrency(value?: string | number | null) {
  if (value === null || value === undefined || value === "") {
    return "₹0";
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return "₹0";
  }

  return `₹${numericValue.toLocaleString("en-IN")}`;
}

