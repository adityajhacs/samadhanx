
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Layers3,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Target,
} from "lucide-react";

type BackendCluster = {
  cluster_id: string;
  name: string;
  common_theme: string | null;
  possible_root_cause: string | null;
  problem_count: number;
};

function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("access_token") ||
    sessionStorage.getItem("token")
  );
}

export default function GovernmentClustersPage() {
  const router = useRouter();

  const [clusters, setClusters] = useState<BackendCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClusters = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error(
          "Government authentication token not found."
        );
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:8000";

      const response = await fetch(
        `${apiUrl}/api/clusters`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        let message = "Failed to load problem clusters.";

        try {
          const errorData = await response.json();

          if (typeof errorData?.detail === "string") {
            message = errorData.detail;
          }
        } catch {
          // Keep default error message
        }

        throw new Error(message);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid cluster data received from backend."
        );
      }

      setClusters(data);
    } catch (err) {
      console.error("Failed to load clusters:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load problem clusters."
      );

      setClusters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadClusters();
  }, []);

  const totalProblems = useMemo(() => {
    return clusters.reduce(
      (total, cluster) =>
        total + Number(cluster.problem_count || 0),
      0
    );
  }, [clusters]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8">

        <section className="relative overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 text-white shadow-sm">

          {/* Decorative background */}

          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative px-6 py-7 sm:px-8 sm:py-8">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              {/* LEFT SIDE */}

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                  <Layers3 size={24} />
                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <Sparkles
                      size={13}
                      className="text-teal-100"
                    />

                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-100">
                      Infrastructure Intelligence
                    </p>

                  </div>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                    Problem Clusters
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-teal-50">
                    Identify recurring citizen challenges grouped
                    around common themes to help departments
                    coordinate targeted interventions.
                  </p>

                </div>

              </div>

              {/* HEADER SUMMARY */}

              <div className="grid shrink-0 grid-cols-2 gap-3">

                <SummaryBox
                  label="Total Clusters"
                  value={clusters.length}
                  description="AI-identified patterns"
                />

                <SummaryBox
                  label="Problems Grouped"
                  value={totalProblems}
                  description="Across all clusters"
                />

              </div>

            </div>

          </div>

        </section>

      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

        {/* =====================================================
            STATS
        ===================================================== */}

        <section className="grid gap-4 sm:grid-cols-3">

          <Stat
            title="Total Clusters"
            value={clusters.length}
            icon={<Layers3 size={19} />}
            description="AI-identified patterns"
          />

          <Stat
            title="Problems Grouped"
            value={totalProblems}
            icon={<Target size={19} />}
            description="Problems linked to clusters"
          />

          <Stat
            title="Cluster Analysis"
            value={clusters.length}
            icon={<CheckCircle2 size={19} />}
            description="Available for review"
          />

        </section>

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 bg-white p-5 sm:p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                <Layers3 size={19} />
              </div>

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Infrastructure Clusters
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Review recurring citizen problems grouped by
                  common themes and identified root causes.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            LOADING STATE
        ===================================================== */}

        {loading && (

          <section className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3].map((item) => (

              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >

                <div className="h-1 w-full bg-slate-200" />

                <div className="animate-pulse p-5">

                  <div className="h-3 w-24 rounded bg-slate-200" />

                  <div className="mt-3 h-5 w-3/4 rounded bg-slate-200" />

                  <div className="mt-5 h-16 rounded-xl bg-slate-100" />

                  <div className="mt-3 h-16 rounded-xl bg-slate-100" />

                  <div className="mt-5 h-10 rounded-xl bg-slate-200" />

                </div>

              </div>

            ))}

          </section>

        )}

        {/* =====================================================
            ERROR STATE
        ===================================================== */}

        {!loading && error && (

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <AlertCircle size={21} />
            </div>

            <h3 className="mt-4 text-center text-sm font-bold text-slate-900">
              Unable to load clusters
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-center text-xs leading-5 text-slate-500">
              {error}
            </p>

            <div className="mt-5 flex justify-center">

              <button
                type="button"
                onClick={loadClusters}
                className="rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-teal-700"
              >
                Try Again
              </button>

            </div>

          </section>

        )}

        {/* =====================================================
            CLUSTER GRID
        ===================================================== */}

        {!loading && !error && clusters.length > 0 && (

          <section className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {clusters.map((cluster) => (

              <article
                key={cluster.cluster_id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
              >

                {/* Teal top accent */}

                <div className="h-1 w-full bg-teal-600" />

                <div className="p-5">

                  {/* CARD HEADER */}

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-600">
                        Cluster
                      </p>

                      <h3 className="mt-1 text-base font-bold leading-6 text-slate-900 transition group-hover:text-teal-700">
                        {cluster.name}
                      </h3>

                    </div>

                    <span className="shrink-0 rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-teal-700">
                      {cluster.problem_count} Problems
                    </span>

                  </div>

                  {/* CLUSTER ID */}

                  <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3">

                    <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Cluster ID
                    </p>

                    <p className="mt-1 break-all font-mono text-[10px] text-slate-600">
                      {cluster.cluster_id}
                    </p>

                  </div>

                  {/* COMMON THEME */}

                  <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3">

                    <div className="flex items-center gap-2">

                      <Layers3
                        size={14}
                        className="shrink-0 text-teal-600"
                      />

                      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                        Common Theme
                      </p>

                    </div>

                    <p className="mt-2 text-xs leading-5 text-slate-600">
                      {cluster.common_theme ||
                        "No common theme available."}
                    </p>

                  </div>

                  {/* ROOT CAUSE */}

                  <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3">

                    <div className="flex items-center gap-2">

                      <Target
                        size={14}
                        className="shrink-0 text-teal-600"
                      />

                      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                        Possible Root Cause
                      </p>

                    </div>

                    <p className="mt-2 text-xs leading-5 text-slate-600">
                      {cluster.possible_root_cause ||
                        "Root cause analysis not available."}
                    </p>

                  </div>

                  {/* PROBLEM COUNT */}

                  <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">

                    <div className="flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                        <AlertCircle size={15} />
                      </div>

                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                          Related Problems
                        </p>

                        <p className="mt-0.5 text-sm font-bold text-slate-900">
                          {cluster.problem_count}
                        </p>

                      </div>

                    </div>

                    <span className="text-[10px] font-semibold text-slate-400">
                      Linked
                    </span>

                  </div>

                  {/* ACTION */}

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/government/clusters/${cluster.cluster_id}`
                      )
                    }
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300"
                  >

                    View Related Problems

                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />

                  </button>

                </div>

              </article>

            ))}

          </section>

        )}

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {!loading && !error && clusters.length === 0 && (

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 ring-1 ring-teal-100">
              <Layers3 size={22} />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-800">
              No clusters found
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              No problem clusters are currently available.
            </p>

          </section>

        )}

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="mt-10 w-full border-t border-slate-800 bg-slate-950 text-white">

        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8">

          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">

            {/* BRAND */}

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold shadow-lg shadow-teal-900/20">
                S
              </div>

              <div>

                <p className="text-sm font-bold">
                  SamadhanX
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Ideas → Action → Impact
                </p>

              </div>

            </div>

            {/* LINKS */}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">

              <button
                type="button"
                onClick={() =>
                  router.push("/government/problems")
                }
                className="text-xs font-medium text-slate-400 transition hover:text-teal-400"
              >
                Challenges
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push("/government/map")
                }
                className="text-xs font-medium text-slate-400 transition hover:text-teal-400"
              >
                Impact Map
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push("/government/projects")
                }
                className="text-xs font-medium text-slate-400 transition hover:text-teal-400"
              >
                Projects
              </button>

            </div>

          </div>

          <div className="mt-7 border-t border-slate-800 pt-4">

            <p className="text-center text-[11px] text-slate-500 md:text-left">
              © 2026 SamadhanX. Government Innovation Workspace.
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}

/* =============================================================
   SUMMARY BOX
============================================================= */

function SummaryBox({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="min-w-[135px] rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">

      <p className="text-[10px] font-bold uppercase tracking-wide text-teal-100">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-teal-100">
        {description}
      </p>

    </div>
  );
}

/* =============================================================
   STAT COMPONENT
============================================================= */

function Stat({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="absolute left-0 top-0 h-full w-1 bg-teal-600" />

      <div className="flex items-center justify-between">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            {description}
          </p>

        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-4 ring-teal-50">
          {icon}
        </div>

      </div>

    </div>
  );
}
