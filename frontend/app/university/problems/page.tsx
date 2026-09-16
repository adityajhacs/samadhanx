
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { getCurrentUser } from "@/lib/api/auth";

import {
  acceptUniversityProblem,
  getMyUniversityId,
  getMyUniversityProblems,
  rejectUniversityProblem,
  UniversityProblem,
} from "@/lib/api/universities";

const categories = [
  "All",
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

export default function UniversityProblemsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [problems, setProblems] = useState<UniversityProblem[]>([]);

  const [universityId, setUniversityId] = useState("");
  const [userRole, setUserRole] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [pendingProblem, setPendingProblem] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // ============================================================
  // ROLE-BASED MANAGEMENT ACCESS
  // ============================================================

  const canManageProblems =
    userRole === "university" || userRole === "faculty";

  // ============================================================
  // LOAD MATCHED PROBLEMS
  // ============================================================

  useEffect(() => {
    async function loadProblems() {
      try {
        setLoading(true);
        setError("");

        const [user, id, data] = await Promise.all([
          getCurrentUser(),
          getMyUniversityId(),
          getMyUniversityProblems(),
        ]);

        setUserRole((user.role || "").trim().toLowerCase());
        setUniversityId(id);
        setProblems(data);
      } catch (error) {
        console.error("Failed to load university problems:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load community problems."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProblems();
  }, []);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const searchText = search.toLowerCase().trim();

      const title = problem.title?.toLowerCase() || "";
      const categoryText = problem.category?.toLowerCase() || "";
      const district = problem.district?.toLowerCase() || "";

      const matchesSearch =
        title.includes(searchText) ||
        categoryText.includes(searchText) ||
        district.includes(searchText);

      const matchesCategory =
        category === "All" || problem.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [problems, search, category]);

  // ============================================================
  // ACCEPT PROBLEM
  // ============================================================

  const confirmAccept = async () => {
    if (!pendingProblem || !universityId || !canManageProblems) return;

    try {
      setActionLoading(pendingProblem.id);

      await acceptUniversityProblem(
        universityId,
        pendingProblem.id
      );

      // Reload from backend so UI reflects actual DB state
      const updatedProblems = await getMyUniversityProblems();

      setProblems(updatedProblems);
      setPendingProblem(null);
    } catch (error) {
      console.error("Failed to accept problem:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to accept problem."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================================
  // REJECT PROBLEM
  // ============================================================

  const handleReject = async (problemId: string) => {
    if (!universityId || !canManageProblems) return;

    try {
      setActionLoading(problemId);

      await rejectUniversityProblem(
        universityId,
        problemId
      );

      // Reload from backend
      const updatedProblems = await getMyUniversityProblems();

      setProblems(updatedProblems);
    } catch (error) {
      console.error("Failed to reject problem:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to reject problem."
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* ================= NAVBAR ================= */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <a
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
          </a>

          {/* Right Navbar */}
          <div className="hidden items-center gap-6 md:flex">
            <a
              href="/university/dashboard"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Dashboard
            </a>

            <a
              href="/university/problems"
              className="text-sm font-semibold text-teal-600"
            >
              Problems
            </a>

            <a
              href="/university/projects"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Projects
            </a>

            <a
              href="/university/solutions"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Solutions
            </a>

            <a
              href="/university/teams"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Teams
            </a>

            <a
              href="/university/profile"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Profile
            </a>
          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        {/* ================= TOP BANNER ================= */}
        <div className="mb-9 overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-teal-500 p-7 text-white shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <BookOpen className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-teal-50">
                Community Challenges
              </p>

              <h2 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                Explore Problems
              </h2>
            </div>
          </div>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-teal-50 md:text-base">
            Discover real-world problems reported by citizens and find
            opportunities where universities can contribute their knowledge,
            research and expertise.
          </p>
        </div>

        {/* ================= COMMUNITY PROBLEMS HEADING ================= */}
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-600" />

            <h3 className="text-2xl font-bold tracking-tight">
              Community Problems
            </h3>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Explore problems where university knowledge and expertise can
            create real impact.
          </p>
        </div>

        {/* ================= SEARCH + FILTER ================= */}
        <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search problems..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-11 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100 md:w-64"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Loading matched community problems...
            </p>
          </div>
        )}

        {/* ================= PROBLEMS ================= */}
        {!loading && filteredProblems.length > 0 && (
          <div className="space-y-5">
            {filteredProblems.map((problem) => {
              const isAccepted =
                problem.status?.toUpperCase() === "ACCEPTED";

              const isRejected =
                problem.status?.toUpperCase() === "REJECTED";

              const matchPercentage =
                problem.match_score !== null &&
                problem.match_score !== undefined
                  ? Math.round(problem.match_score * 100)
                  : null;

              const severity =
                problem.severity_score !== null &&
                problem.severity_score !== undefined
                  ? problem.severity_score >= 70
                    ? "High"
                    : problem.severity_score >= 40
                      ? "Medium"
                      : "Low"
                  : "Unknown";

              const location = problem.district
                ? `${problem.district}, Jharkhand`
                : "Location unavailable";

              const expertise =
                problem.match_reasons &&
                problem.match_reasons.length > 0
                  ? problem.match_reasons[0]
                  : "Relevant university expertise";

              const reason =
                problem.match_reasons &&
                problem.match_reasons.length > 0
                  ? problem.match_reasons.join(" • ")
                  : "This problem has been matched with your university based on available expertise and AI similarity.";

              return (
                <div
                  key={problem.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:border-teal-300 hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                    {/* ================= PROBLEM CONTENT ================= */}
                    <div className="min-w-0 flex-1">
                      {/* Tags */}
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
                          {problem.category || "Community Problem"}
                        </span>

                        {/* Severity */}
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                            severity === "High"
                              ? "bg-red-50 text-red-600"
                              : severity === "Medium"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {severity} Severity
                        </span>

                        {isAccepted && (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Accepted
                          </span>
                        )}

                        {isRejected && (
                          <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                            Rejected
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <a
                        href={`/university/problems/${problem.id}`}
                        className="block text-xl font-bold leading-snug text-slate-900 transition group-hover:text-teal-700 md:text-2xl"
                      >
                        {problem.title}
                      </a>

                      {/* Location */}
                      <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="h-4 w-4 text-teal-600" />
                        {location}
                      </div>

                      {/* Expertise Match */}
                      <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50 p-5">
                        <p className="text-xs font-bold uppercase tracking-wide text-teal-600">
                          Expertise Match
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {expertise}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {reason}
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
                        {canManageProblems &&
                          !isRejected &&
                          !isAccepted && (
                            <button
                              type="button"
                              disabled={actionLoading === problem.id}
                              onClick={() =>
                                setPendingProblem({
                                  id: problem.id,
                                  title: problem.title,
                                })
                              }
                              className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <CheckCircle2 className="h-4 w-4" />

                              {actionLoading === problem.id
                                ? "Processing..."
                                : "Accept Problem"}
                            </button>
                          )}

                        {canManageProblems && isAccepted && (
                          <button
                            type="button"
                            disabled={actionLoading === problem.id}
                            onClick={() =>
                              handleReject(problem.id)
                            }
                            className="flex items-center gap-2 rounded-xl bg-teal-50 px-5 py-2.5 text-sm font-semibold text-teal-700 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <CheckCircle2 className="h-4 w-4" />

                            {actionLoading === problem.id
                              ? "Processing..."
                              : "Reject Problem"}
                          </button>
                        )}

                        <a
                          href={`/university/problems/${problem.id}`}
                          className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                        >
                          Explore Problem
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    {/* ================= AI MATCH SCORE ================= */}
                    <div className="flex w-full shrink-0 items-start justify-center lg:w-[190px] lg:pt-[116px]">
                      <div className="w-full rounded-2xl border border-teal-100 bg-teal-50 p-5 lg:w-[180px]">
                        <div className="text-center">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                            AI Match Score
                          </p>

                          <p className="mt-1 text-2xl font-bold text-teal-600">
                            {matchPercentage !== null
                              ? `${matchPercentage}%`
                              : "N/A"}
                          </p>

                          <div className="mt-3 h-1.5 rounded-full bg-teal-100">
                            <div
                              className="h-1.5 rounded-full bg-teal-600"
                              style={{
                                width:
                                  matchPercentage !== null
                                    ? `${matchPercentage}%`
                                    : "0%",
                              }}
                            />
                          </div>

                          <a
                            href={`/university/problems/${problem.id}`}
                            className="mt-4 flex items-center justify-center gap-1 text-xs font-bold text-slate-700 transition hover:text-teal-700"
                          >
                            View details
                            <ArrowRight className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!loading && filteredProblems.length === 0 && (
          <div className="rounded-2xl border border-dashed border-teal-300 bg-teal-50 p-12 text-center">
            <Search className="mx-auto h-10 w-10 text-teal-500" />

            <h3 className="mt-4 text-xl font-bold">
              No problems found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try a different search term or category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-5 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* ================= CONFIRMATION MODAL ================= */}
      {pendingProblem && canManageProblems && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">
            {/* Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50">
              <CheckCircle2 className="h-7 w-7 text-teal-600" />
            </div>

            <h3 className="mt-5 text-center text-xl font-bold text-slate-900">
              Are you sure?
            </h3>

            <p className="mt-3 text-center text-sm leading-6 text-slate-500">
              Do you want to accept{" "}
              <span className="font-semibold text-slate-800">
                {pendingProblem.title}
              </span>{" "}
              and work towards developing a solution for this challenge?
            </p>

            {/* Confirmation Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setPendingProblem(null)}
                className="flex-1 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoading === pendingProblem.id}
                onClick={confirmAccept}
                className="flex-1 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading === pendingProblem.id
                  ? "Accepting..."
                  : "Yes, Accept"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="mt-12 bg-slate-950 px-6 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">
          {/* Logo */}
          <a
            href="/university/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">
              S
            </div>

            <div>
              <p className="text-lg font-bold">SamadhanX</p>

              <p className="text-sm text-slate-400">
                Ideas → Action → Impact
              </p>
            </div>
          </a>

          {/* Copyright */}
          <p className="text-sm text-slate-400">
            © 2026 SamadhanX. Building solutions that matter.
          </p>

          {/* Links */}
          <div className="flex gap-5 text-sm text-slate-400">
            <a
              href="/university/dashboard"
              className="transition hover:text-white"
            >
              Dashboard
            </a>

            <a
              href="/help"
              className="transition hover:text-white"
            >
              Help
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

