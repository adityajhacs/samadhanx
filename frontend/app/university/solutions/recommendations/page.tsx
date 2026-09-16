
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Loader2,
  Sparkles,
  Target,
} from "lucide-react";

import {
  getMyUniversityProblems,
  type UniversityProblem,
} from "@/lib/api/universities";

import {
  getSolutionMemory,
  getSolutionRecommendation,
  getSolutions,
  type Solution,
  type SolutionMemoryItem,
  type SolutionRecommendation,
} from "@/lib/api/solutions";

export default function SolutionRecommendationsPage() {
  const [problems, setProblems] = useState<UniversityProblem[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [memory, setMemory] = useState<SolutionMemoryItem[]>([]);

  const [selectedProblemId, setSelectedProblemId] = useState("");
  const [selectedSolutionId, setSelectedSolutionId] = useState("");

  const [recommendation, setRecommendation] =
    useState<SolutionRecommendation | null>(null);

  const [loadingProblems, setLoadingProblems] = useState(true);
  const [loadingMemory, setLoadingMemory] = useState(false);
  const [loadingRecommendation, setLoadingRecommendation] =
    useState(false);

  const [error, setError] = useState("");

  /*
   * Load problems for the current university.
   */
  async function loadProblems() {
    try {
      setError("");
      setLoadingProblems(true);

      const data = await getMyUniversityProblems();

      setProblems(data);

      if (data.length > 0) {
        setSelectedProblemId(data[0].id);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load university problems."
      );
    } finally {
      setLoadingProblems(false);
    }
  }

  /*
   * Load solutions and solution memory for the selected problem.
   */
  async function loadProblemData(problemId: string) {
    try {
      setError("");
      setLoadingMemory(true);
      setRecommendation(null);
      setSelectedSolutionId("");

      const [solutionData, memoryData] = await Promise.all([
        getSolutions({
          problem_id: problemId,
        }),
        getSolutionMemory(problemId, 10),
      ]);

      setSolutions(solutionData);
      setMemory(memoryData);

      if (solutionData.length > 0) {
        setSelectedSolutionId(solutionData[0].id);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load solution data."
      );

      setSolutions([]);
      setMemory([]);
    } finally {
      setLoadingMemory(false);
    }
  }

  /*
   * Generate AI recommendation for the selected solution.
   */
  async function handleRecommendation() {
    if (!selectedProblemId || !selectedSolutionId) {
      return;
    }

    try {
      setError("");
      setRecommendation(null);
      setLoadingRecommendation(true);

      const data = await getSolutionRecommendation(
        selectedProblemId,
        selectedSolutionId
      );

      setRecommendation(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate recommendation."
      );
    } finally {
      setLoadingRecommendation(false);
    }
  }

  /*
   * Format money values.
   */
  function formatMoney(value?: string | number | null) {
    if (value === null || value === undefined || value === "") {
      return "Not specified";
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return String(value);
    }

    return `₹${numericValue.toLocaleString("en-IN")}`;
  }

  /*
   * Format dates.
   */
  function formatDate(value?: string | null) {
    if (!value) {
      return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  /*
   * Backend may return score as either:
   * 0.85 or 85
   */
  function formatPercentage(value?: number | null) {
    if (value === null || value === undefined) {
      return null;
    }

    const normalized = value <= 1 ? value * 100 : value;

    return `${Math.round(normalized)}%`;
  }

  /*
   * Load initial problems.
   */
  useEffect(() => {
    loadProblems();
  }, []);

  /*
   * Whenever problem changes, load its solutions and solution memory.
   */
  useEffect(() => {
    if (!selectedProblemId) {
      setSolutions([]);
      setMemory([]);
      setSelectedSolutionId("");
      setRecommendation(null);
      return;
    }

    loadProblemData(selectedProblemId);
  }, [selectedProblemId]);

  const selectedProblem = useMemo(
    () =>
      problems.find(
        (problem) => problem.id === selectedProblemId
      ),
    [problems, selectedProblemId]
  );

  const selectedSolution = useMemo(
    () =>
      solutions.find(
        (solution) => solution.id === selectedSolutionId
      ),
    [solutions, selectedSolutionId]
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* =========================================================
          NAVBAR
      ========================================================== */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/university/dashboard"
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
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
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
              href="/university/profile"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* =========================================================
          MAIN
      ========================================================== */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/university/my-solutions"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Solutions
          </Link>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <BrainCircuit className="h-5 w-5" />
              </div>

              <span className="text-sm font-semibold uppercase tracking-wider text-teal-700">
                AI Recommendation
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Solution Recommendation
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Compare existing solutions from the solution memory and
              generate an AI-assisted recommendation for a selected
              solution.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* =======================================================
            PROBLEM + SOLUTION SELECTOR
        ======================================================== */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Select Problem & Solution
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose a university problem and one of its solutions.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Problem */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Problem
              </label>

              <div className="relative">
                <select
                  value={selectedProblemId}
                  onChange={(event) =>
                    setSelectedProblemId(event.target.value)
                  }
                  disabled={
                    loadingProblems || problems.length === 0
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                >
                  {loadingProblems ? (
                    <option>Loading problems...</option>
                  ) : problems.length === 0 ? (
                    <option>No university problems found</option>
                  ) : (
                    problems.map((problem) => (
                      <option key={problem.id} value={problem.id}>
                        {problem.title}
                      </option>
                    ))
                  )}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Solution */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Solution
              </label>

              <div className="relative">
                <select
                  value={selectedSolutionId}
                  onChange={(event) =>
                    setSelectedSolutionId(event.target.value)
                  }
                  disabled={
                    loadingMemory || solutions.length === 0
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                >
                  {loadingMemory ? (
                    <option>Loading solutions...</option>
                  ) : solutions.length === 0 ? (
                    <option>No solutions found</option>
                  ) : (
                    solutions.map((solution) => (
                      <option key={solution.id} value={solution.id}>
                        {solution.solution_title}
                      </option>
                    ))
                  )}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Selected Problem */}
          {selectedProblem && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Selected Problem
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {selectedProblem.title}
              </p>

              {selectedProblem.description && (
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                  {selectedProblem.description}
                </p>
              )}
            </div>
          )}

          {/* Generate */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleRecommendation}
              disabled={
                !selectedProblemId ||
                !selectedSolutionId ||
                loadingRecommendation
              }
              className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingRecommendation ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Recommendation
                </>
              )}
            </button>
          </div>
        </section>

        {/* =======================================================
            SELECTED SOLUTION
        ======================================================== */}
        {selectedSolution && (
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Target className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Selected Solution
                </h2>

                <p className="text-sm text-slate-500">
                  Solution being evaluated
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {selectedSolution.solution_title}
                  </h3>

                  {selectedSolution.description && (
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                      {selectedSolution.description}
                    </p>
                  )}
                </div>

                {selectedSolution.prototype_status && (
                  <span className="w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                    {selectedSolution.prototype_status.replaceAll(
                      "_",
                      " "
                    )}
                  </span>
                )}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-400">
                    Estimated Cost
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatMoney(selectedSolution.estimated_cost)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-400">
                    Funding Received
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatMoney(selectedSolution.funding_received)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-400">
                    Created
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatDate(selectedSolution.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =======================================================
            SOLUTION MEMORY
        ======================================================== */}
        <section className="mb-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Solution Memory
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Existing solutions related to the selected problem.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {memory.length} results
            </span>
          </div>

          {loadingMemory ? (
            <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-16">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-teal-700" />
                Loading solution memory...
              </div>
            </div>
          ) : memory.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <BrainCircuit className="mx-auto h-10 w-10 text-slate-300" />

              <h3 className="mt-4 text-base font-semibold text-slate-800">
                No solution memory available
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                There are no related solutions available for the
                selected problem yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {memory.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {item.solution_title}
                      </h3>

                      {item.prototype_status && (
                        <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                          {item.prototype_status.replaceAll(
                            "_",
                            " "
                          )}
                        </span>
                      )}
                    </div>

                    {item.similarity !== null &&
                      item.similarity !== undefined && (
                        <div className="shrink-0 text-right">
                          <p className="text-xs text-slate-400">
                            Similarity
                          </p>

                          <p className="mt-1 text-sm font-bold text-teal-700">
                            {formatPercentage(item.similarity)}
                          </p>
                        </div>
                      )}
                  </div>

                  {item.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  )}

                  {item.recommendation && (
                    <div className="mt-4 rounded-xl bg-teal-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                        Recommendation
                      </p>

                      <p className="mt-1 text-sm leading-6 text-teal-900">
                        {item.recommendation}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[11px] font-medium text-slate-400">
                        Estimated Cost
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {formatMoney(item.estimated_cost)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[11px] font-medium text-slate-400">
                        Funding
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {formatMoney(item.funding_received)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =======================================================
            AI RECOMMENDATION
        ======================================================== */}
        <section className="mb-10 rounded-2xl border border-teal-200 bg-white shadow-sm">
          <div className="border-b border-teal-100 bg-teal-50/60 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  AI Solution Recommendation
                </h2>

                <p className="text-sm text-slate-500">
                  Backend-generated recommendation for the selected
                  solution.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {!recommendation ? (
              <div className="py-10 text-center">
                <Sparkles className="mx-auto h-10 w-10 text-slate-300" />

                <h3 className="mt-4 text-base font-semibold text-slate-800">
                  No recommendation generated yet
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  Select a problem and solution above, then click
                  &quot;Generate Recommendation&quot; to request the
                  backend recommendation.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Scores */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {recommendation.compatibility_score !== null &&
                    recommendation.compatibility_score !==
                      undefined && (
                      <div className="rounded-2xl border border-slate-200 p-5">
                        <p className="text-sm font-medium text-slate-500">
                          Compatibility Score
                        </p>

                        <p className="mt-2 text-3xl font-bold text-teal-700">
                          {formatPercentage(
                            recommendation.compatibility_score
                          ) ?? "—"}
                        </p>
                      </div>
                    )}

                  {recommendation.confidence !== null &&
                    recommendation.confidence !== undefined && (
                      <div className="rounded-2xl border border-slate-200 p-5">
                        <p className="text-sm font-medium text-slate-500">
                          Confidence
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                          {formatPercentage(
                            recommendation.confidence
                          ) ?? "—"}
                        </p>
                      </div>
                    )}
                </div>

                {/* Relevance Explanation */}
                {recommendation.relevance_explanation && (
                  <div className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="font-semibold text-slate-900">
                      Relevance Explanation
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {recommendation.relevance_explanation}
                    </p>
                  </div>
                )}

                {/* Key Matches */}
                {recommendation.key_matches &&
                  recommendation.key_matches.length > 0 && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                        <h3 className="font-semibold text-slate-900">
                          Key Matches
                        </h3>
                      </div>

                      <ul className="mt-4 space-y-3">
                        {recommendation.key_matches.map(
                          (match, index) => (
                            <li
                              key={`${match}-${index}`}
                              className="flex items-start gap-3 text-sm leading-6 text-slate-700"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />

                              <span>{match}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {/* Limitations */}
                {recommendation.limitations &&
                  recommendation.limitations.length > 0 && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                      <div className="flex items-center gap-2">
                        <CircleAlert className="h-5 w-5 text-amber-600" />

                        <h3 className="font-semibold text-slate-900">
                          Limitations
                        </h3>
                      </div>

                      <ul className="mt-4 space-y-3">
                        {recommendation.limitations.map(
                          (limitation, index) => (
                            <li
                              key={`${limitation}-${index}`}
                              className="flex items-start gap-3 text-sm leading-6 text-slate-700"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />

                              <span>{limitation}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {/* Empty backend explanation */}
                {!recommendation.relevance_explanation &&
                  (!recommendation.key_matches ||
                    recommendation.key_matches.length === 0) &&
                  (!recommendation.limitations ||
                    recommendation.limitations.length === 0) && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                      The backend returned a recommendation, but no
                      additional explanation fields were provided.
                    </div>
                  )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* =========================================================
          FOOTER
      ========================================================== */}
      <footer className="bg-slate-950 px-6 py-8 text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-white">SamadhanX</p>

            <p className="mt-1">
              Ideas → Action → Impact
            </p>
          </div>

          <p>University Solution Recommendation</p>
        </div>
      </footer>
    </div>
  );
}

