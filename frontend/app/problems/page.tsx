
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bus,
  Construction,
  Droplets,
  GraduationCap,
  Hospital,
  Leaf,
  MapPin,
  Search,
  ShieldCheck,
  Trash2,
  Wheat,
} from "lucide-react";

import { getProblems, type Problem } from "@/lib/api/problems";

function getCategoryIcon(category?: string) {
  const value = (category || "").toLowerCase();

  if (value.includes("education")) return GraduationCap;
  if (value.includes("health")) return Hospital;
  if (value.includes("environment")) return Leaf;
  if (value.includes("safety")) return ShieldCheck;
  if (value.includes("transport")) return Bus;
  if (value.includes("sanitation")) return Trash2;
  if (value.includes("water")) return Droplets;
  if (value.includes("agriculture")) return Wheat;

  return Construction;
}

function getStatusClass(status?: string) {
  const value = (status || "Pending").toLowerCase();

  if (value.includes("resolved")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (value.includes("progress") || value.includes("matched")) {
    return "border-teal-200 bg-teal-50 text-teal-700";
  }

  if (
    value.includes("pending") ||
    value.includes("review") ||
    value.includes("submitted")
  ) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

export default function ProblemsPage() {
  const [apiProblems, setApiProblems] = useState<Problem[]>([]);
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [apiError, setApiError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadProblems();
  }, []);

  async function loadProblems() {
    try {
      setLoadingProblems(true);
      setApiError("");

      const data = await getProblems();
      setApiProblems(data);
    } catch (error) {
      console.error("Failed to load problems:", error);

      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Failed to load problems.");
      }
    } finally {
      setLoadingProblems(false);
    }
  }

  /*
   * Create unique filter options from actual API data.
   * Categories and districts are generated automatically
   * from the problems returned by the backend.
   */
  const categories = Array.from(
    new Set(
      apiProblems
        .map((problem) => problem.category?.trim())
        .filter(Boolean)
    )
  ).sort();

  const districts = Array.from(
    new Set(
      apiProblems
        .map((problem) => problem.district?.trim())
        .filter(Boolean)
    )
  ).sort();

  /*
   * Status filter is intentionally grouped instead of directly
   * showing raw database status values.
   */
  const statusOptions = [
    {
      value: "all",
      label: "All Statuses",
    },
    {
      value: "pending",
      label: "Pending / Under Review",
    },
    {
      value: "progress",
      label: "In Progress / Matched",
    },
    {
      value: "resolved",
      label: "Resolved",
    },
    {
      value: "other",
      label: "Other",
    },
  ];

  const filteredProblems = apiProblems.filter((problem) => {
    const query = search.toLowerCase().trim();

    /* ==================== SEARCH ==================== */
    const matchesSearch =
      !query ||
      problem.title.toLowerCase().includes(query) ||
      problem.description.toLowerCase().includes(query) ||
      (problem.category || "").toLowerCase().includes(query) ||
      (problem.district || "").toLowerCase().includes(query);

    /* ==================== CATEGORY ==================== */
    const matchesCategory =
      categoryFilter === "all" ||
      (problem.category || "").toLowerCase() ===
        categoryFilter.toLowerCase();

    /* ==================== DISTRICT ==================== */
    const matchesDistrict =
      districtFilter === "all" ||
      (problem.district || "").toLowerCase() ===
        districtFilter.toLowerCase();

    /* ==================== STATUS ==================== */
    const problemStatus = (problem.status || "Pending").toLowerCase();

    const isPending =
      problemStatus.includes("pending") ||
      problemStatus.includes("review") ||
      problemStatus.includes("submitted");

    const isProgress =
      problemStatus.includes("progress") ||
      problemStatus.includes("matched");

    const isResolved = problemStatus.includes("resolved");

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && isPending) ||
      (statusFilter === "progress" && isProgress) ||
      (statusFilter === "resolved" && isResolved) ||
      (statusFilter === "other" &&
        !isPending &&
        !isProgress &&
        !isResolved);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesDistrict &&
      matchesStatus
    );
  });

  const hasActiveFilters =
    search.trim() !== "" ||
    categoryFilter !== "all" ||
    districtFilter !== "all" ||
    statusFilter !== "all";

  function clearFilters() {
    setSearch("");
    setCategoryFilter("all");
    setDistrictFilter("all");
    setStatusFilter("all");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* ==================== NAVBAR ==================== */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
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

          {/* Navigation */}
          <div className="hidden items-center gap-7 md:flex">
            <Link
              href="/citizen/dashboard"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Dashboard
            </Link>

            <Link
              href="/problems"
              className="text-sm font-semibold text-teal-700"
            >
              All Problems
            </Link>

            <Link
              href="/citizen/problems"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
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

          {/* Mobile */}
          <Link
            href="/citizen/report"
            className="rounded-xl bg-teal-700 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 md:hidden"
          >
            Report Problem
          </Link>
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-10">
        <div className="max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
            <MapPin size={17} />
            Community Problems
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Problems that need a{" "}
            <span className="text-teal-700">Samadhan</span>
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Explore real challenges reported by citizens and discover
            opportunities to support meaningful solutions.
          </p>
        </div>

        {/* ==================== SEARCH + FILTERS ==================== */}
        <div className="mt-8">
          {/* Search */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search problems, categories or districts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-5 text-base outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            >
              <option value="all">All Categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* District */}
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            >
              <option value="all">All Districts</option>

              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Clear */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ==================== PROBLEMS ==================== */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        {loadingProblems ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ProblemSkeleton />
            <ProblemSkeleton />
            <ProblemSkeleton />
          </div>
        ) : apiError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
            <h2 className="text-lg font-semibold text-red-800">
              Unable to load problems
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {apiError}
            </p>

            <button
              onClick={loadProblems}
              className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Search size={24} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No problems found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Reported Problems
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredProblems.length} problem
                  {filteredProblems.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProblems.map((problem) => {
                const CategoryIcon = getCategoryIcon(problem.category);

                return (
                  <Link
                    key={problem.id}
                    href={`/problems/${problem.id}`}
                    className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                        <CategoryIcon size={21} />
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                              problem.status || "Pending"
                        )}`}
                      >
                        {problem.status || "Pending"}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="mt-5 line-clamp-2 text-xl font-bold text-slate-900 transition group-hover:text-teal-700">
                      {problem.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {problem.description}
                    </p>

                    {/* Tags */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {problem.category && (
                        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                          {problem.category}
                        </span>
                      )}

                      {problem.district && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          <MapPin size={12} />
                          {problem.district}
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
                      <span className="text-sm font-semibold text-teal-700">
                        View Problem
                      </span>

                      <ArrowRight
                        size={17}
                        className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-700"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-white">SamadhanX</p>

            <p className="mt-1 text-xs text-slate-400">
              Ideas → Action → Impact
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-400">
            <Link
              href="/citizen/dashboard"
              className="transition hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/problems"
              className="transition hover:text-white"
            >
              All Problems
            </Link>

            <Link
              href="/citizen/problems"
              className="transition hover:text-white"
            >
              My Problems
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

function ProblemSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-100" />

        <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
      </div>

      <div className="mt-5 h-6 w-4/5 animate-pulse rounded bg-slate-100" />

      <div className="mt-4 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="mt-6 flex gap-2">
        <div className="h-6 w-28 animate-pulse rounded-full bg-slate-100" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

