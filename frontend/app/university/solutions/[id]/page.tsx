
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  DollarSign,
  FlaskConical,
  Lightbulb,
  Loader2,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import { apiRequest, getAuthToken } from "@/lib/api/client";

type Solution = {
  id: string;
  problem_id?: string | null;
  university_id?: string | null;
  project_id?: string | null;

  solution_title: string;
  description?: string | null;

  prototype_status?: string | null;

  estimated_cost?: string | number | null;
  funding_received?: string | number | null;

  prototype_description?: string | null;
  how_it_works?: string | null;
  key_features?: string | null;
  problem_solution?: string | null;

  created_at?: string | null;
};

type Problem = {
  id: string;
  title: string;
  description?: string | null;
  district?: string | null;
  category?: string | null;
  severity_score?: number | null;
  status?: string | null;
};

type University = {
  id: string;
  name: string;
  district?: string | null;
  department?: string | null;
};

type Project = {
  id: string;
  title?: string | null;
  name?: string | null;
  status?: string | null;
};

type RealityCheckRisk = {
  id: string;
  reality_check_id: string;
  risk_category: string;
  risk_description: string;
  risk_level: string;
  impact: string;
  mitigation: string;
  created_at?: string | null;
};

type RealityCheck = {
  id: string;
  solution_id: string;

  feasibility_score: number;
  overall_summary: string;
  confidence: number;
  uncertainty_notes: string;

  created_at?: string | null;

  risks: RealityCheckRisk[];
};

function normalizeStatus(status?: string | null) {
  return (status || "IDEA").trim().toUpperCase();
}

function getStatusLabel(status?: string | null) {
  const normalized = normalizeStatus(status);

  switch (normalized) {
    case "FIELD_TEST":
      return "Field Test";

    case "PROTOTYPE":
      return "Prototype";

    case "DEPLOYED":
      return "Deployed";

    case "DESIGN":
      return "Design";

    default:
      return "Idea";
  }
}

function getStatusType(status?: string | null) {
  const normalized = normalizeStatus(status);

  if (normalized === "DEPLOYED") {
    return "ready";
  }

  if (
    normalized === "DESIGN" ||
    normalized === "PROTOTYPE" ||
    normalized === "FIELD_TEST"
  ) {
    return "development";
  }

  return "idea";
}

function formatCurrency(
  value?: string | number | null
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not specified";
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return `₹${numericValue.toLocaleString("en-IN")}`;
}

function getRiskClasses(level: string) {
  const normalized = level.trim().toLowerCase();

  if (normalized === "high") {
    return {
      wrapper:
        "border-red-200 bg-red-50",
      badge:
        "bg-red-100 text-red-700",
      icon:
        "text-red-600",
    };
  }

  if (normalized === "medium") {
    return {
      wrapper:
        "border-amber-200 bg-amber-50",
      badge:
        "bg-amber-100 text-amber-700",
      icon:
        "text-amber-600",
    };
  }

  return {
    wrapper:
      "border-emerald-200 bg-emerald-50",
    badge:
      "bg-emerald-100 text-emerald-700",
    icon:
      "text-emerald-600",
  };
}

function getFeasibilityLabel(score: number) {
  if (score >= 80) {
    return "High Feasibility";
  }

  if (score >= 60) {
    return "Moderate Feasibility";
  }

  if (score >= 40) {
    return "Limited Feasibility";
  }

  return "Low Feasibility";
}

function getFeasibilityClasses(score: number) {
  if (score >= 80) {
    return {
      wrapper:
        "border-emerald-200 bg-emerald-50",
      text:
        "text-emerald-700",
      icon:
        "text-emerald-600",
    };
  }

  if (score >= 60) {
    return {
      wrapper:
        "border-amber-200 bg-amber-50",
      text:
        "text-amber-700",
      icon:
        "text-amber-600",
    };
  }

  return {
    wrapper:
      "border-red-200 bg-red-50",
    text:
      "text-red-700",
    icon:
      "text-red-600",
  };
}

export default function SolutionDetailPage() {
  const params = useParams();

  const solutionId = String(params.id);

  const [solution, setSolution] =
    useState<Solution | null>(null);

  const [problem, setProblem] =
    useState<Problem | null>(null);

  const [university, setUniversity] =
    useState<University | null>(null);

  const [project, setProject] =
    useState<Project | null>(null);

  const [realityCheck, setRealityCheck] =
    useState<RealityCheck | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [realityCheckLoading, setRealityCheckLoading] =
    useState(false);

  const [pageError, setPageError] =
    useState("");

  const [realityCheckError, setRealityCheckError] =
    useState("");

  const token = getAuthToken();

  async function loadSolutionData() {
    if (!token) {
      setPageError("Please login first.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setPageError("");

      const solutionData =
        await apiRequest<Solution>(
          `/api/solutions/${solutionId}`,
          {
            method: "GET",
            token,
          }
        );

      setSolution(solutionData);

      const [
        problemsData,
        universitiesData,
        projectsData,
      ] = await Promise.all([
        apiRequest<Problem[]>(
          "/api/problems",
          {
            method: "GET",
            token,
          }
        ),
        apiRequest<University[]>(
          "/api/universities",
          {
            method: "GET",
            token,
          }
        ),
        apiRequest<Project[]>(
          "/api/projects",
          {
            method: "GET",
            token,
          }
        ),
      ]);

      if (solutionData.problem_id) {
        const matchedProblem =
          problemsData.find(
            (item) =>
              item.id === solutionData.problem_id
          ) || null;

        setProblem(matchedProblem);
      } else {
        setProblem(null);
      }

      if (solutionData.university_id) {
        const matchedUniversity =
          universitiesData.find(
            (item) =>
              item.id ===
              solutionData.university_id
          ) || null;

        setUniversity(matchedUniversity);
      } else {
        setUniversity(null);
      }

      if (solutionData.project_id) {
        const matchedProject =
          projectsData.find(
            (item) =>
              item.id === solutionData.project_id
          ) || null;

        setProject(matchedProject);
      } else {
        setProject(null);
      }

      // ----------------------------------------------------
      // Try loading an existing RealityCheck.
      // 404 is expected when it has never been run.
      // ----------------------------------------------------

      try {
        const existingRealityCheck =
          await apiRequest<RealityCheck>(
            `/api/solutions/${solutionId}/reality-check`,
            {
              method: "GET",
              token,
            }
          );

        setRealityCheck(
          existingRealityCheck
        );
      } catch {
        setRealityCheck(null);
      }
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Failed to load solution."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSolutionData();
  }, [solutionId]);

  async function handleRealityCheck() {
    if (!token) {
      setRealityCheckError(
        "Please login first."
      );
      return;
    }

    try {
      setRealityCheckLoading(true);
      setRealityCheckError("");

      const result =
        await apiRequest<RealityCheck>(
          `/api/solutions/${solutionId}/reality-check`,
          {
            method: "POST",
            token,
          }
        );

      setRealityCheck(result);
    } catch (error) {
      setRealityCheckError(
        error instanceof Error
          ? error.message
          : "RealityCheck could not be completed."
      );
    } finally {
      setRealityCheckLoading(false);
    }
  }

  const statusType = useMemo(
    () =>
      getStatusType(
        solution?.prototype_status
      ),
    [solution?.prototype_status]
  );

  const statusLabel = useMemo(
    () =>
      getStatusLabel(
        solution?.prototype_status
      ),
    [solution?.prototype_status]
  );

  const feasibilityClasses =
    realityCheck
      ? getFeasibilityClasses(
          realityCheck.feasibility_score
        )
      : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin text-teal-700" />
            Loading solution...
          </div>
        </div>
      </div>
    );
  }

  if (pageError || !solution) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Link
            href="/university/solutions"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Solutions
          </Link>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {pageError || "Solution not found."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* -------------------------------------------------- */}
      {/* Header */}
      {/* -------------------------------------------------- */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Link
            href="/university/solutions"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Solutions
          </Link>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div className="max-w-4xl">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={[
                    "rounded-full px-3 py-1 text-xs font-bold",
                    statusType === "ready"
                      ? "bg-emerald-100 text-emerald-700"
                      : statusType ===
                          "development"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-teal-100 text-teal-700",
                  ].join(" ")}
                >
                  {statusLabel}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Solution
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                {solution.solution_title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                {university && (
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {university.name}
                  </span>
                )}

                {problem && (
                  <span className="flex items-center gap-1.5">
                    <Lightbulb className="h-4 w-4" />
                    {problem.title}
                  </span>
                )}

                {problem?.district && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {problem.district}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={handleRealityCheck}
                disabled={realityCheckLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {realityCheckLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running RealityCheck...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {realityCheck
                      ? "Run Again"
                      : "Run RealityCheck"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* ------------------------------------------------ */}
        {/* RealityCheck Error */}
        {/* ------------------------------------------------ */}

        {realityCheckError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {realityCheckError}
          </div>
        )}

        {/* ------------------------------------------------ */}
        {/* Overview Cards */}
        {/* ------------------------------------------------ */}

        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Status
              </span>

              <CheckCircle2 className="h-5 w-5 text-teal-700" />
            </div>

            <p className="text-xl font-bold text-slate-900">
              {statusLabel}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Current prototype stage
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Estimated Cost
              </span>

              <DollarSign className="h-5 w-5 text-teal-700" />
            </div>

            <p className="text-xl font-bold text-slate-900">
              {formatCurrency(
                solution.estimated_cost
              )}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Planned solution cost
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Funding Received
              </span>

              <Zap className="h-5 w-5 text-teal-700" />
            </div>

            <p className="text-xl font-bold text-slate-900">
              {formatCurrency(
                solution.funding_received
              )}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Current funding
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                AI Feasibility
              </span>

              <FlaskConical className="h-5 w-5 text-teal-700" />
            </div>

            <p className="text-xl font-bold text-slate-900">
              {realityCheck
                ? `${realityCheck.feasibility_score}/100`
                : "Not checked"}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {realityCheck
                ? getFeasibilityLabel(
                    realityCheck.feasibility_score
                  )
                : "Run RealityCheck to analyze"}
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ============================================== */}
          {/* Main Content */}
          {/* ============================================== */}

          <div className="space-y-8 lg:col-span-2">
            {/* Solution Description */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                  <Lightbulb className="h-5 w-5 text-teal-700" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Solution Description
                  </h2>

                  <p className="text-sm text-slate-500">
                    What this solution proposes
                  </p>
                </div>
              </div>

              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {solution.description ||
                  "No solution description has been provided."}
              </p>
            </section>

            {/* Problem */}

            {problem && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                    <ShieldAlert className="h-5 w-5 text-amber-600" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Related Problem
                    </h2>

                    <p className="text-sm text-slate-500">
                      The civic problem this solution addresses
                    </p>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {problem.title}
                </h3>

                {problem.description && (
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {problem.description}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {problem.category && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {problem.category}
                    </span>
                  )}

                  {problem.district && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {problem.district}
                    </span>
                  )}

                  {problem.status && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {problem.status}
                    </span>
                  )}
                </div>
              </section>
            )}

            {/* Prototype Details */}

            {(solution.prototype_description ||
              solution.how_it_works ||
              solution.key_features ||
              solution.problem_solution) && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                    <FlaskConical className="h-5 w-5 text-teal-700" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Prototype Details
                    </h2>

                    <p className="text-sm text-slate-500">
                      Technical and implementation details
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {solution.prototype_description && (
                    <div>
                      <h3 className="mb-2 text-sm font-bold text-slate-900">
                        What the Prototype Does
                      </h3>

                      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                        {
                          solution.prototype_description
                        }
                      </p>
                    </div>
                  )}

                  {solution.how_it_works && (
                    <div>
                      <h3 className="mb-2 text-sm font-bold text-slate-900">
                        How It Works
                      </h3>

                      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                        {solution.how_it_works}
                      </p>
                    </div>
                  )}

                  {solution.key_features && (
                    <div>
                      <h3 className="mb-2 text-sm font-bold text-slate-900">
                        Key Features
                      </h3>

                      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                        {solution.key_features}
                      </p>
                    </div>
                  )}

                  {solution.problem_solution && (
                    <div>
                      <h3 className="mb-2 text-sm font-bold text-slate-900">
                        How This Solution Solves the Problem
                      </h3>

                      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                        {solution.problem_solution}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ============================================ */}
            {/* RealityCheck */}
            {/* ============================================ */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                    <Sparkles className="h-5 w-5 text-teal-700" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      AI RealityCheck
                    </h2>

                    <p className="text-sm text-slate-500">
                      AI-generated feasibility and risk analysis
                    </p>
                  </div>
                </div>

                {realityCheck && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    Confidence:{" "}
                    {realityCheck.confidence}%
                  </span>
                )}
              </div>

              {!realityCheck ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <Sparkles className="mx-auto h-8 w-8 text-teal-700" />

                  <h3 className="mt-3 text-sm font-bold text-slate-900">
                    RealityCheck has not been run yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                    Run RealityCheck to analyze the solution's
                    feasibility, risks, confidence, and
                    important uncertainties using the AI
                    service.
                  </p>

                  <button
                    type="button"
                    onClick={handleRealityCheck}
                    disabled={realityCheckLoading}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800 disabled:opacity-60"
                  >
                    {realityCheckLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Run RealityCheck
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Feasibility */}

                  <div
                    className={[
                      "rounded-2xl border p-5",
                      feasibilityClasses?.wrapper,
                    ].join(" ")}
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          AI Feasibility Score
                        </p>

                        <p
                          className={[
                            "mt-1 text-3xl font-bold",
                            feasibilityClasses?.text,
                          ].join(" ")}
                        >
                          {
                            realityCheck.feasibility_score
                          }
                          /100
                        </p>

                        <p
                          className={[
                            "mt-1 text-sm font-semibold",
                            feasibilityClasses?.text,
                          ].join(" ")}
                        >
                          {getFeasibilityLabel(
                            realityCheck.feasibility_score
                          )}
                        </p>
                      </div>

                      <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white shadow-sm">
                        <span
                          className={[
                            "text-lg font-bold",
                            feasibilityClasses?.text,
                          ].join(" ")}
                        >
                          {
                            realityCheck.feasibility_score
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}

                  <div>
                    <h3 className="mb-2 text-sm font-bold text-slate-900">
                      Overall Assessment
                    </h3>

                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                      {
                        realityCheck.overall_summary
                      }
                    </p>
                  </div>

                  {/* Uncertainty */}

                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                      <div>
                        <h3 className="text-sm font-bold text-amber-900">
                          Important Uncertainties
                        </h3>

                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-amber-800">
                          {
                            realityCheck.uncertainty_notes
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Risks */}

                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">
                        Identified Risks
                      </h3>

                      <span className="text-xs font-semibold text-slate-500">
                        {realityCheck.risks.length}{" "}
                        risks
                      </span>
                    </div>

                    {realityCheck.risks.length ===
                    0 ? (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                        No specific risks were returned by
                        the AI analysis.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {realityCheck.risks.map(
                          (risk) => {
                            const classes =
                              getRiskClasses(
                                risk.risk_level
                              );

                            return (
                              <div
                                key={risk.id}
                                className={[
                                  "rounded-xl border p-5",
                                  classes.wrapper,
                                ].join(" ")}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-3">
                                    <ShieldAlert
                                      className={[
                                        "mt-0.5 h-5 w-5 shrink-0",
                                        classes.icon,
                                      ].join(" ")}
                                    />

                                    <div>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <h4 className="text-sm font-bold text-slate-900">
                                          {
                                            risk.risk_category
                                          }
                                        </h4>

                                        <span
                                          className={[
                                            "rounded-full px-2.5 py-1 text-[11px] font-bold",
                                            classes.badge,
                                          ].join(
                                            " "
                                          )}
                                        >
                                          {
                                            risk.risk_level
                                          }
                                        </span>
                                      </div>

                                      <p className="mt-2 text-sm leading-6 text-slate-700">
                                        {
                                          risk.risk_description
                                        }
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-4 grid gap-4 border-t border-slate-200/70 pt-4 md:grid-cols-2">
                                  <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                      Impact
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-slate-700">
                                      {risk.impact}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                      Mitigation
                                    </p>

                                    <div className="mt-1 flex gap-2">
                                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                                      <p className="text-sm leading-6 text-slate-700">
                                        {
                                          risk.mitigation
                                        }
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>

                  <p className="text-xs leading-5 text-slate-400">
                    AI-generated analysis is a hypothesis and
                    should not be treated as verified field
                    evidence.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* ============================================== */}
          {/* Sidebar */}
          {/* ============================================== */}

          <aside className="space-y-6">
            {/* University */}

            {university && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-sm font-bold text-slate-900">
                  University
                </h2>

                <div className="mt-4 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                    <Users className="h-5 w-5 text-teal-700" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {university.name}
                    </p>

                    {university.department && (
                      <p className="mt-1 text-xs text-slate-500">
                        {university.department}
                      </p>
                    )}

                    {university.district && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {university.district}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Project */}

            {project && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-sm font-bold text-slate-900">
                  Project Connection
                </h2>

                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-900">
                    {project.title ||
                      project.name ||
                      "Project"}
                  </p>

                  {project.status && (
                    <span className="mt-2 inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                      {project.status}
                    </span>
                  )}
                </div>

                <Link
                  href={`/university/projects/${project.id}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-800"
                >
                  View Project
                  <Zap className="h-4 w-4" />
                </Link>
              </section>
            )}

            {/* Cost */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-bold text-slate-900">
                Financial Information
              </h2>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Estimated Cost
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {formatCurrency(
                      solution.estimated_cost
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Funding Received
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {formatCurrency(
                      solution.funding_received
                    )}
                  </span>
                </div>
              </div>
            </section>

            {/* AI note */}

            <section className="rounded-2xl border border-teal-200 bg-teal-50 p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />

                <div>
                  <h2 className="text-sm font-bold text-teal-900">
                    AI-generated hypothesis
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-teal-800">
                    RealityCheck uses the available solution
                    and problem information. Results should
                    be validated through field verification
                    before making implementation decisions.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

