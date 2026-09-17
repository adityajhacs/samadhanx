
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Layers3,
  AlertCircle,
  Users,
  Building2,
  Sparkles,
  CheckCircle2,
  FileSearch,
  ExternalLink,
} from "lucide-react";

/* =============================================================
   TYPES
============================================================= */

type BackendCluster = {
  cluster_id: string;
  name: string;
  common_theme: string | null;
  possible_root_cause: string | null;
  problem_count: number;
};

type ClusterAnalysis = {
  cluster_id: string;
  common_theme: string | null;
  possible_root_cause: string | null;
};

type RelatedProblem = {
  id: string;
  title: string;
  description: string | null;
  district: string | null;
  category: string | null;
  severity_score: number | null;
  status: string | null;
  citizen_id: string | null;
};

/* =============================================================
   PAGE
============================================================= */

export default function GovernmentClusterDetailPage() {
  const params = useParams();
  const router = useRouter();

  const clusterId = params.id as string;

  const [cluster, setCluster] = useState<BackendCluster | null>(null);
  const [analysis, setAnalysis] = useState<ClusterAnalysis | null>(null);
  const [relatedProblems, setRelatedProblems] = useState<
    RelatedProblem[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(true);
  const [problemsLoading, setProblemsLoading] = useState(true);

  const [error, setError] = useState("");

  /* ===========================================================
     GET TOKEN
  =========================================================== */

  const getAuthToken = () => {
    if (typeof window === "undefined") {
      return null;
    }

    return (
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  /* ===========================================================
     FETCH CLUSTER
  =========================================================== */

  useEffect(() => {
    const fetchCluster = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getAuthToken();

        if (!token) {
          setError("Authentication token not found.");
          return;
        }

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:8000";

        const response = await fetch(`${apiUrl}/api/clusters`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Unauthorized. Please login again."
            );
          }

          throw new Error(
            `Failed to load clusters. Status: ${response.status}`
          );
        }

        const data: BackendCluster[] = await response.json();

        const selectedCluster = data.find(
          (item) =>
            String(item.cluster_id) === String(clusterId)
        );

        if (!selectedCluster) {
          throw new Error("Cluster not found.");
        }

        setCluster(selectedCluster);
      } catch (err) {
        console.error("Cluster fetch error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load cluster."
        );
      } finally {
        setLoading(false);
      }
    };

    if (clusterId) {
      fetchCluster();
    }
  }, [clusterId]);

  /* ===========================================================
     FETCH AI ANALYSIS
  =========================================================== */

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setAnalysisLoading(true);

        const token = getAuthToken();

        if (!token) {
          return;
        }

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:8000";

        const response = await fetch(
          `${apiUrl}/api/clusters/${clusterId}/analysis`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        /*
         * Backend returns 404 if analysis has not
         * been generated yet.
         */

        if (response.status === 404) {
          setAnalysis(null);
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Failed to load cluster analysis. Status: ${response.status}`
          );
        }

        const data: ClusterAnalysis = await response.json();

        setAnalysis(data);
      } catch (err) {
        console.error(
          "Cluster analysis fetch error:",
          err
        );

        setAnalysis(null);
      } finally {
        setAnalysisLoading(false);
      }
    };

    if (clusterId) {
      fetchAnalysis();
    }
  }, [clusterId]);

  /* ===========================================================
     FETCH RELATED PROBLEMS
  =========================================================== */

  useEffect(() => {
    const fetchRelatedProblems = async () => {
      try {
        setProblemsLoading(true);

        const token = getAuthToken();

        if (!token) {
          return;
        }

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:8000";

        const response = await fetch(
          `${apiUrl}/api/clusters/${clusterId}/problems`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            setRelatedProblems([]);
            return;
          }

          throw new Error(
            `Failed to load related problems. Status: ${response.status}`
          );
        }

        const data: RelatedProblem[] = await response.json();

        setRelatedProblems(data);
      } catch (err) {
        console.error(
          "Related problems fetch error:",
          err
        );

        setRelatedProblems([]);
      } finally {
        setProblemsLoading(false);
      }
    };

    if (clusterId) {
      fetchRelatedProblems();
    }
  }, [clusterId]);

  /* ===========================================================
     LOADING
  =========================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
          >
            <ArrowLeft size={18} />
            Back to Clusters
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" />

            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading cluster details...
            </p>

          </div>
        </div>
      </main>
    );
  }

  /* ===========================================================
     ERROR / NOT FOUND
  =========================================================== */

  if (error || !cluster) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">

        <div className="mx-auto max-w-5xl">

          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
          >
            <ArrowLeft size={18} />
            Back to Clusters
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <Layers3
              className="mx-auto text-slate-400"
              size={36}
            />

            <h1 className="mt-4 text-xl font-bold text-slate-900">
              Cluster Not Found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error ||
                "The requested problem cluster could not be found."}
            </p>

          </div>

        </div>
      </main>
    );
  }

  /* ===========================================================
     DERIVED VALUES
  =========================================================== */

  const commonTheme =
    analysis?.common_theme ||
    cluster.common_theme ||
    "No common theme available.";

  const possibleRootCause =
    analysis?.possible_root_cause ||
    cluster.possible_root_cause ||
    "No possible root cause available.";

  const criticalProblems = relatedProblems.filter(
    (problem) =>
      typeof problem.severity_score === "number" &&
      problem.severity_score >= 70
  ).length;

  const resolvedProblems = relatedProblems.filter(
    (problem) =>
      (problem.status || "").toLowerCase() === "resolved"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* =====================================================
            BACK
        ===================================================== */}

        <button
          onClick={() => router.back()}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
        >
          <ArrowLeft size={18} />
          Back to Clusters
        </button>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">

            <div>

              <div className="mb-3 flex flex-wrap items-center gap-2">

                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                  Problem Cluster
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {cluster.cluster_id}
                </span>

              </div>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {cluster.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">

                <span className="inline-flex items-center gap-2">
                  <Layers3 size={16} />
                  {cluster.problem_count} Related Problems
                </span>

                <span className="inline-flex items-center gap-2">
                  <Building2 size={16} />
                  Government Innovation Workspace
                </span>

              </div>

            </div>

            <div className="w-fit rounded-xl bg-teal-50 px-4 py-3">

              <p className="text-xs font-semibold text-teal-700">
                Grouped Problems
              </p>

              <p className="mt-1 text-2xl font-bold text-teal-800">
                {cluster.problem_count}
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            OVERVIEW STATS
        ===================================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Related Problems"
            value={cluster.problem_count}
            icon={<Layers3 size={18} />}
          />

          <StatCard
            title="Critical Problems"
            value={
              problemsLoading
                ? "..."
                : criticalProblems
            }
            icon={<AlertCircle size={18} />}
            danger
          />

          <StatCard
            title="Resolved Problems"
            value={
              problemsLoading
                ? "..."
                : resolvedProblems
            }
            icon={<CheckCircle2 size={18} />}
            success
          />

          <StatCard
            title="AI Analysis"
            value={
              analysisLoading
                ? "..."
                : analysis
                ? "Available"
                : "Not Generated"
            }
            icon={<Sparkles size={18} />}
          />

        </section>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* ===================================================
              LEFT
          =================================================== */}

          <div className="space-y-6 lg:col-span-2">

            {/* =================================================
                CLUSTER OVERVIEW
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start gap-3">

                <div className="rounded-xl bg-teal-50 p-2 text-teal-700">
                  <FileSearch size={20} />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Cluster Overview
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Backend-generated information about the
                    related citizen problem cluster.
                  </p>

                </div>

              </div>

              <div className="mt-6">

                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Common Theme
                </p>

                <div className="mt-2 rounded-xl bg-slate-50 p-5">

                  <p className="text-sm leading-7 text-slate-700">
                    {commonTheme}
                  </p>

                </div>

              </div>

              <div className="mt-5">

                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Possible Root Cause
                </p>

                <div className="mt-2 rounded-xl bg-slate-50 p-5">

                  <p className="text-sm leading-7 text-slate-700">
                    {possibleRootCause}
                  </p>

                </div>

              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <InfoBox
                  icon={<Layers3 size={16} />}
                  label="Cluster ID"
                  value={cluster.cluster_id}
                />

                <InfoBox
                  icon={<Users size={16} />}
                  label="Related Problems"
                  value={`${cluster.problem_count} citizen problem reports`}
                />

              </div>

            </section>

            {/* =================================================
                AI CLUSTER ANALYSIS
            ================================================= */}

            <section className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">

              <div className="flex items-start gap-3">

                <div className="rounded-xl bg-teal-50 p-2 text-teal-700">
                  <Sparkles size={20} />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    AI Cluster Analysis
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    AI-assisted analysis generated by the
                    backend cluster analysis service.
                  </p>

                </div>

              </div>

              {analysisLoading ? (

                <div className="mt-6 rounded-xl bg-slate-50 p-6 text-center">

                  <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" />

                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    Loading AI analysis...
                  </p>

                </div>

              ) : analysis ? (

                <>

                  <div className="mt-6 rounded-xl bg-slate-50 p-5">

                    <div className="flex items-center gap-2">

                      <Sparkles
                        size={16}
                        className="text-teal-600"
                      />

                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Common Theme
                      </p>

                    </div>

                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      {analysis.common_theme ||
                        "No common theme has been generated."}
                    </p>

                  </div>

                  <div className="mt-4 rounded-xl border border-slate-200 p-5">

                    <div className="flex items-center gap-2">

                      <AlertCircle
                        size={16}
                        className="text-teal-600"
                      />

                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Possible Root Cause
                      </p>

                    </div>

                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      {analysis.possible_root_cause ||
                        "No possible root cause has been generated."}
                    </p>

                  </div>

                </>

              ) : (

                <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">

                  <Sparkles
                    className="mx-auto text-slate-400"
                    size={28}
                  />

                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    AI cluster analysis is not available yet.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Analysis can be generated through the backend
                    cluster analysis endpoint.
                  </p>

                </div>

              )}

              <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4">

                <p className="text-xs font-semibold text-amber-700">
                  AI Verification Notice
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  AI-generated cluster insights are hypotheses
                  and should be validated against field-level
                  information before taking administrative action.
                </p>

              </div>

            </section>

            {/* =================================================
                RELATED PROBLEMS
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start gap-3">

                <div className="rounded-xl bg-teal-50 p-2 text-teal-700">
                  <Layers3 size={20} />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Related Problems
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Actual citizen problems grouped under this
                    cluster.
                  </p>

                </div>

              </div>

              {/* LOADING */}

              {problemsLoading ? (

                <div className="mt-5 rounded-xl bg-slate-50 p-8 text-center">

                  <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" />

                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    Loading related problems...
                  </p>

                </div>

              ) : relatedProblems.length > 0 ? (

                <div className="mt-5 space-y-3">

                  {relatedProblems.map((problem) => {

                    const severity =
                      typeof problem.severity_score ===
                      "number"
                        ? problem.severity_score
                        : null;

                    const status =
                      problem.status || "Unknown";

                    return (
                      <div
                        key={problem.id}
                        className="rounded-xl border border-slate-200 p-4 transition hover:border-teal-200 hover:shadow-sm"
                      >

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                          <div className="min-w-0">

                            {/* BADGES */}

                            <div className="flex flex-wrap items-center gap-2">

                              <span className="text-xs font-bold text-teal-600">
                                {problem.id}
                              </span>

                              {problem.category ? (
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                                  {problem.category}
                                </span>
                              ) : (
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-400">
                                  Category unavailable
                                </span>
                              )}

                              {severity !== null && (
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                    severity >= 70
                                      ? "bg-red-50 text-red-700"
                                      : severity >= 40
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-emerald-50 text-emerald-700"
                                  }`}
                                >
                                  Severity {severity}
                                </span>
                              )}

                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                                {status}
                              </span>

                            </div>

                            {/* TITLE */}

                            <h3 className="mt-2 font-bold text-slate-900">
                              {problem.title}
                            </h3>

                            {/* DESCRIPTION */}

                            {problem.description && (
                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {problem.description}
                              </p>
                            )}

                            {/* LOCATION */}

                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">

                              {problem.district && (
                                <span className="inline-flex items-center gap-2">
                                  <MapPin size={14} />
                                  {problem.district}
                                </span>
                              )}

                              <span className="inline-flex items-center gap-2">
                                <Users size={14} />
                                Citizen Report
                              </span>

                            </div>

                          </div>

                          {/* VIEW PROBLEM */}

                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/government/problems/${problem.id}`
                              )
                            }
                            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-teal-50 px-3 py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-600 hover:text-white"
                          >
                            View Problem
                            <ExternalLink size={14} />
                          </button>

                        </div>

                      </div>
                    );
                  })}

                </div>

              ) : (

                <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

                  <Layers3
                    className="mx-auto text-slate-400"
                    size={30}
                  />

                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    No related problems found.
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    This cluster currently has no problems
                    available through the backend endpoint.
                  </p>

                </div>

              )}

            </section>

          </div>

          {/* ===================================================
              RIGHT SIDEBAR
          =================================================== */}

          <aside className="space-y-6">

            {/* =================================================
                GOVERNMENT MONITORING
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-teal-50 p-2 text-teal-700">
                  <Building2 size={20} />
                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  Government Monitoring
                </h2>

              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Monitor this cluster as a group of related citizen
                challenges and use backend-generated insights to
                understand recurring patterns.
              </p>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">

                <p className="text-xs font-semibold text-slate-500">
                  Current Stage
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  Problem Clustered
                </p>

              </div>

              <div className="mt-3 rounded-xl bg-slate-50 p-4">

                <p className="text-xs font-semibold text-slate-500">
                  Grouped Reports
                </p>

                <p className="mt-1 text-sm font-bold text-teal-700">
                  {cluster.problem_count} Problems
                </p>

              </div>

            </section>

            {/* =================================================
                CLUSTER DATA
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-bold text-slate-900">
                Cluster Data
              </h2>

              <div className="mt-5 space-y-3">

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold text-slate-500">
                    Cluster ID
                  </p>

                  <p className="mt-1 break-all text-xs font-semibold text-slate-800">
                    {cluster.cluster_id}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold text-slate-500">
                    Problems in Cluster
                  </p>

                  <p className="mt-1 text-xl font-bold text-teal-700">
                    {cluster.problem_count}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold text-slate-500">
                    Critical Problems
                  </p>

                  <p className="mt-1 text-xl font-bold text-red-700">
                    {problemsLoading
                      ? "..."
                      : criticalProblems}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold text-slate-500">
                    Resolved Problems
                  </p>

                  <p className="mt-1 text-xl font-bold text-emerald-700">
                    {problemsLoading
                      ? "..."
                      : resolvedProblems}
                  </p>

                </div>

              </div>

            </section>

          </aside>

        </div>
      </div>

      {/* =======================================================
          FOOTER
      ======================================================= */}

      <footer className="mt-10 w-full border-t border-slate-800 bg-black text-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-3 lg:min-w-[280px]">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white">
              S
            </div>

            <div>

              <p className="text-sm font-bold tracking-tight">
                SamadhanX
              </p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Ideas → Action → Impact
              </p>

            </div>

          </div>

          <div className="text-center">

            <p className="text-[11px] font-medium text-slate-400">
              © 2026 SamadhanX. Government Innovation Workspace.
            </p>

          </div>

          <div className="flex items-center justify-center gap-5 lg:min-w-[280px] lg:justify-end">

            <button
              onClick={() =>
                router.push("/government/problems")
              }
              className="text-[11px] font-medium text-slate-400 transition hover:text-teal-400"
            >
              Challenges
            </button>

            <button
              onClick={() =>
                router.push("/government/map")
              }
              className="text-[11px] font-medium text-slate-400 transition hover:text-teal-400"
            >
              Impact Map
            </button>

            <button
              onClick={() =>
                router.push("/government/projects")
              }
              className="text-[11px] font-medium text-slate-400 transition hover:text-teal-400"
            >
              Solutions
            </button>

          </div>

        </div>

      </footer>

    </main>
  );
}

/* =============================================================
   STAT CARD
============================================================= */

function StatCard({
  title,
  value,
  icon,
  danger = false,
  success = false,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  danger?: boolean;
  success?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            {title}
          </p>

          <p
            className={`mt-2 text-2xl font-bold ${
              danger
                ? "text-red-700"
                : success
                ? "text-emerald-700"
                : "text-teal-700"
            }`}
          >
            {value}
          </p>

        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            danger
              ? "bg-red-50 text-red-600"
              : success
              ? "bg-emerald-50 text-emerald-600"
              : "bg-teal-50 text-teal-600"
          }`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

/* =============================================================
   INFO BOX
============================================================= */

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        {icon}
        {label}
      </div>

      <p className="mt-2 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>

    </div>
  );
}
