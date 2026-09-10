"use client";

import { useMemo } from "react";
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
  Activity,
  FileSearch,
} from "lucide-react";

import {
  clusters,
  problems,
} from "@/lib/mockData";

export default function GovernmentClusterDetailPage() {
  const params = useParams();
  const router = useRouter();

  const clusterId = params.id as string;

  const cluster = useMemo(() => {
    return clusters.find((item) => item.id === clusterId);
  }, [clusterId]);

  const linkedProblems = useMemo(() => {
    if (!cluster) return [];

    return problems.filter((problem) =>
      cluster.problemIds.includes(problem.id)
    );
  }, [cluster]);

  if (!cluster) {
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
            <Layers3 className="mx-auto text-slate-400" size={32} />

            <h1 className="mt-4 text-xl font-bold text-slate-900">
              Cluster Not Found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              The requested problem cluster could not be found.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* BACK */}
        <button
          onClick={() => router.back()}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
        >
          <ArrowLeft size={18} />
          Back to Clusters
        </button>

        {/* HEADER */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">

            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                  {cluster.id}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {cluster.category}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    cluster.status === "Critical"
                      ? "bg-red-50 text-red-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {cluster.status}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {cluster.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} />
                  {cluster.location}
                </span>

                <span className="inline-flex items-center gap-2">
                  <Layers3 size={16} />
                  {cluster.problems} Related Problems
                </span>
              </div>
            </div>

            <div className="w-fit rounded-xl bg-teal-50 px-4 py-3">
              <p className="text-xs font-semibold text-teal-700">
                Solution Progress
              </p>

              <p className="mt-1 text-2xl font-bold text-teal-800">
                {cluster.progress}%
              </p>
            </div>
          </div>
        </section>

        {/* OVERVIEW STATS */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Related Problems"
            value={cluster.problems}
            icon={<Layers3 size={18} />}
          />

          <StatCard
            title="Critical Problems"
            value={cluster.critical}
            icon={<AlertCircle size={18} />}
            danger
          />

          <StatCard
            title="Resolved Problems"
            value={cluster.resolved}
            icon={<CheckCircle2 size={18} />}
            success
          />

          <StatCard
            title="Progress"
            value={`${cluster.progress}%`}
            icon={<Activity size={18} />}
          />

        </section>

        {/* MAIN CONTENT */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* LEFT */}
          <div className="space-y-6 lg:col-span-2">

            {/* CLUSTER OVERVIEW */}
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
                    Summary of the related citizen problems identified in
                    this cluster.
                  </p>
                </div>
              </div>

              <p className="mt-5 leading-7 text-slate-600">
                {cluster.description}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <InfoBox
                  icon={<MapPin size={16} />}
                  label="Location"
                  value={cluster.location}
                />

                <InfoBox
                  icon={<Building2 size={16} />}
                  label="Category"
                  value={cluster.category}
                />

                <InfoBox
                  icon={<Users size={16} />}
                  label="Affected Problems"
                  value={`${cluster.problems} citizen problem reports`}
                />

                <InfoBox
                  icon={<Activity size={16} />}
                  label="Current Progress"
                  value={`${cluster.progress}% solution progress`}
                />

              </div>
            </section>

            {/* AI CLUSTER ANALYSIS */}
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
                    AI-assisted insights for identifying patterns across
                    related citizen reports.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Pattern Identified
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Multiple citizen reports in this cluster indicate a
                  recurring {cluster.category.toLowerCase()}-related issue
                  that may require coordinated intervention rather than
                  isolated problem resolution.
                </p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold text-slate-500">
                    Common Category
                  </p>

                  <p className="mt-2 font-semibold text-teal-700">
                    {cluster.category}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold text-slate-500">
                    Cluster Priority
                  </p>

                  <p
                    className={`mt-2 font-semibold ${
                      cluster.status === "Critical"
                        ? "text-red-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {cluster.status}
                  </p>
                </div>

              </div>
            </section>

            {/* RELATED PROBLEMS */}
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
                    Citizen reports grouped under this problem cluster.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">

                {linkedProblems.length > 0 ? (
                  linkedProblems.map((problem) => (
                    <div
                      key={problem.id}
                      className="rounded-xl border border-slate-200 p-4 transition hover:border-teal-200 hover:shadow-sm"
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-teal-600">
                              {problem.id}
                            </span>

                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                              {problem.category}
                            </span>

                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-700">
                              {problem.priority}
                            </span>
                          </div>

                          <h3 className="mt-2 font-bold text-slate-900">
                            {problem.title}
                          </h3>

                          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                            <MapPin size={14} />
                            {problem.location}, {problem.district}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/government/problems/${problem.id}`
                            )
                          }
                          className="inline-flex w-fit items-center gap-2 rounded-xl bg-teal-50 px-3 py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-600 hover:text-white"
                        >
                          View Problem
                        </button>

                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl bg-slate-50 p-8 text-center">
                    <p className="text-sm font-semibold text-slate-600">
                      No related problems found.
                    </p>
                  </div>
                )}

              </div>
            </section>

          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-6">

            {/* GOVERNMENT MONITORING */}
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
                Monitor the cluster as a group of related challenges and
                coordinate institutional intervention.
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
                  Recommended Action
                </p>

                <p className="mt-1 text-sm font-bold text-teal-700">
                  Coordinate a shared intervention
                </p>
              </div>

            </section>

            {/* PROGRESS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  Solution Progress
                </h2>

                <span className="text-sm font-bold text-teal-700">
                  {cluster.progress}%
                </span>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-teal-600 transition-all duration-500"
                  style={{
                    width: `${cluster.progress}%`,
                  }}
                />
              </div>

              <div className="mt-4 flex justify-between text-xs text-slate-500">
                <span>Problems Identified</span>
                <span>Intervention Progress</span>
              </div>

            </section>

          </aside>
        </div>
      </div>

      {/* FOOTER */}
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
              onClick={() => router.push("/government/problems")}
              className="text-[11px] font-medium text-slate-400 transition hover:text-teal-400"
            >
              Challenges
            </button>

            <button
              onClick={() => router.push("/government/map")}
              className="text-[11px] font-medium text-slate-400 transition hover:text-teal-400"
            >
              Impact Map
            </button>

            <button
              onClick={() => router.push("/government/projects")}
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
            className={`mt-2 text-3xl font-bold ${
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

      <p className="mt-2 font-semibold text-slate-800">
        {value}
      </p>

    </div>
  );
}