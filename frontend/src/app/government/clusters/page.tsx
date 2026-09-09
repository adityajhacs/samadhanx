"use client";

import { useMemo, useState } from "react";
import {
  Layers3,
  MapPin,
  AlertCircle,
  Activity,
  X,
  Building2,
  ArrowRight,
} from "lucide-react";

import {
  clusters,
  problems,
  type ProblemCategory,
} from "@/lib/mockData";

export default function GovernmentClustersPage() {
  const [category, setCategory] =
    useState<"All" | ProblemCategory>("All");

  const [selectedCluster, setSelectedCluster] =
    useState<string | null>(null);

  const filteredClusters = useMemo(() => {
    if (category === "All") return clusters;

    return clusters.filter(
      (cluster) => cluster.category === category
    );
  }, [category]);

  const active = clusters.filter(
    (cluster) => cluster.status === "Active"
  ).length;

  const critical = clusters.filter(
    (cluster) => cluster.status === "Critical"
  ).length;

  const selected = clusters.find(
    (cluster) => cluster.id === selectedCluster
  );

  const linkedProblems = selected
    ? problems.filter((problem) =>
        selected.problemIds.includes(problem.id)
      )
    : [];

  const handleViewProblems = (clusterId: string) => {
    setSelectedCluster(clusterId);

    setTimeout(() => {
      document
        .getElementById("linked-problems")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-teal-800 bg-gradient-to-r from-teal-800 via-teal-700 to-teal-600 px-6 py-7 text-white shadow-md sm:px-8">

          {/* Decorative circles */}

          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-teal-500/20" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-teal-400/10" />

          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">

            {/* LEFT */}

            <div className="max-w-2xl">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
                  <Layers3
                    size={23}
                    strokeWidth={2}
                  />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.17em] text-teal-100">
                    INFRASTRUCTURE INTELLIGENCE
                  </p>

                  <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                    Problem Clusters
                  </h1>

                </div>

              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-teal-50">
                Group related citizen problems by location and
                service category to help departments identify
                patterns and prioritise action.
              </p>

            </div>


            {/* RIGHT — SUMMARY */}

            <div className="flex shrink-0 items-center gap-3">

              {/* TOTAL */}

              <div className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4 shadow-sm">

                <p className="text-[10px] font-bold uppercase tracking-wide text-sky-700">
                  Total Clusters
                </p>

                <p className="mt-1 text-2xl font-bold text-sky-900">
                  {clusters.length}
                </p>

              </div>


              {/* CRITICAL */}

              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 shadow-sm">

                <div className="flex items-center gap-2">

                  <AlertCircle
                    size={13}
                    className="text-red-600"
                  />

                  <p className="text-[10px] font-bold uppercase tracking-wide text-red-700">
                    Critical
                  </p>

                </div>

                <p className="mt-1 text-2xl font-bold text-red-700">
                  {critical}
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            STATS
        ===================================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-3">

          <Stat
            title="Total Clusters"
            value={clusters.length}
            icon={<Layers3 size={17} />}
            accent="teal"
          />

          <Stat
            title="Active Clusters"
            value={active}
            icon={<Activity size={17} />}
            accent="emerald"
          />

          <Stat
            title="Critical Clusters"
            value={critical}
            icon={<AlertCircle size={17} />}
            accent="red"
          />

        </section>


        {/* =====================================================
            CLUSTER SECTION HEADER + FILTER
        ===================================================== */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* LEFT */}

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                  <Layers3
                    size={18}
                    strokeWidth={2}
                  />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-teal-700">
                    Infrastructure Clusters
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Select a cluster to inspect its connected
                    citizen problems.
                  </p>

                </div>

              </div>

            </div>


            {/* FILTER */}

            <div className="flex items-center gap-3">

              <label className="text-xs font-semibold text-slate-500">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as
                      | "All"
                      | ProblemCategory
                  )
                }
                className="h-10 min-w-[155px] rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              >

                <option value="All">
                  All Categories
                </option>

                <option value="Roads">
                  Roads
                </option>

                <option value="Water">
                  Water
                </option>

                <option value="Electricity">
                  Electricity
                </option>

                <option value="Sanitation">
                  Sanitation
                </option>

              </select>

            </div>

          </div>

        </section>


        {/* =====================================================
            CLUSTER GRID
        ===================================================== */}

        <section className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {filteredClusters.map((cluster) => (

            <div
              key={cluster.id}
              className={`group rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                selectedCluster === cluster.id
                  ? "border-teal-400 ring-2 ring-teal-100"
                  : "border-slate-200 hover:border-teal-300"
              }`}
            >

              {/* CARD HEADER */}

              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">

                  <p className="text-[10px] font-bold uppercase tracking-wide text-teal-600">
                    {cluster.id}
                  </p>

                  <h2 className="mt-1 text-base font-bold leading-5 text-slate-900">
                    {cluster.name}
                  </h2>

                </div>


                {/* STATUS */}

                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold ${
                    cluster.status === "Critical"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {cluster.status}
                </span>

              </div>


              {/* LOCATION */}

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">

                <MapPin
                  size={14}
                  strokeWidth={2}
                  className="shrink-0 text-teal-600"
                />

                <span>
                  {cluster.location}
                </span>

              </div>


              {/* CATEGORY */}

              <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5">

                <Building2
                  size={13}
                  className="text-slate-400"
                />

                <span className="text-[10px] font-semibold text-slate-600">
                  {cluster.category}
                </span>

              </div>


              {/* METRICS */}

              <div className="mt-5 grid grid-cols-3 gap-2">

                <Metric
                  value={cluster.problems}
                  label="Problems"
                />

                <Metric
                  value={cluster.critical}
                  label="Critical"
                />

                <Metric
                  value={cluster.resolved}
                  label="Resolved"
                />

              </div>


              {/* PROGRESS */}

              <div className="mt-5">

                <div className="flex items-center justify-between">

                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Solution Progress
                  </span>

                  <span className="text-xs font-bold text-teal-600">
                    {cluster.progress}%
                  </span>

                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-teal-600 transition-all duration-500"
                    style={{
                      width: `${cluster.progress}%`,
                    }}
                  />

                </div>

              </div>


              {/* VIEW LINKED PROBLEMS */}

              <button
                type="button"
                onClick={() =>
                  handleViewProblems(cluster.id)
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2 text-[11px] font-bold text-teal-700 transition hover:bg-teal-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-300"
              >

                View linked problems

                <ArrowRight
                  size={13}
                  strokeWidth={2}
                />

              </button>

            </div>

          ))}

        </section>


        {/* =====================================================
            SELECTED CLUSTER
        ===================================================== */}

        {selected && (

          <section
            id="linked-problems"
            className="mt-7 scroll-mt-6 overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm"
          >

            {/* SELECTED HEADER */}

            <div className="border-b border-slate-200 bg-teal-50/70 p-5 sm:p-6">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <span className="rounded-full bg-teal-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-teal-700">
                      Selected Cluster
                    </span>

                    <span className="text-[10px] font-bold text-slate-400">
                      {selected.id}
                    </span>

                  </div>

                  <h2 className="mt-3 text-xl font-bold text-slate-900">
                    {selected.name}
                  </h2>

                  <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                    {selected.description}
                  </p>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setSelectedCluster(null)
                  }
                  className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                >

                  <X size={14} />

                  Close

                </button>

              </div>

            </div>


            {/* LINKED PROBLEMS */}

            {linkedProblems.length > 0 ? (

              <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">

                {linkedProblems.map((problem) => (

                  <div
                    key={problem.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-teal-200 hover:shadow-sm"
                  >

                    <div className="flex items-center justify-between gap-2">

                      <p className="text-xs font-bold text-teal-600">
                        {problem.id}
                      </p>

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                        {problem.category}
                      </span>

                    </div>


                    <h3 className="mt-2 text-sm font-bold text-slate-800">
                      {problem.title}
                    </h3>


                    {/* LOCATION */}

                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">

                      <MapPin
                        size={13}
                        className="text-teal-500"
                      />

                      {problem.location}

                    </div>


                    {/* DEPARTMENT */}

                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">

                      <Building2
                        size={13}
                        className="text-slate-400"
                      />

                      <span>
                        {problem.department}
                      </span>

                    </div>


                    {/* SOLUTION */}

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">

                      <span className="text-[10px] font-semibold text-slate-400">
                        Solution
                      </span>

                      <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-teal-700">
                        {problem.solutionId}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <div className="p-10 text-center">

                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">

                  <Layers3 size={18} />

                </div>

                <p className="mt-3 text-sm font-semibold text-slate-600">
                  No linked problems found.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  This cluster currently has no matching
                  problem records.
                </p>

              </div>

            )}

          </section>

        )}

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="w-full border-t border-slate-800 bg-black text-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">

          {/* LEFT — LOGO + TAGLINE */}

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


          {/* CENTER */}

          <div className="text-center">

            <p className="text-[11px] font-medium text-slate-400">
              © 2026 SamadhanX. Government Innovation Workspace.
            </p>

          </div>


          {/* RIGHT — LINKS */}

          <div className="flex items-center justify-center gap-5 lg:min-w-[280px] lg:justify-end">

            <a
              href="#"
              className="text-[11px] font-medium text-slate-400 transition hover:text-teal-400"
            >
              Challenges
            </a>

            <a
              href="#"
              className="text-[11px] font-medium text-slate-400 transition hover:text-teal-400"
            >
              Impact Map
            </a>

            <a
              href="#"
              className="text-[11px] font-medium text-slate-400 transition hover:text-teal-400"
            >
              Solutions
            </a>

          </div>

        </div>

      </footer>

    </main>
  );
}


/* =============================================================
   STAT COMPONENT
============================================================= */

function Stat({
  title,
  value,
  icon,
  accent,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  accent: "teal" | "emerald" | "red";
}) {

  const accentStyles = {
    teal: {
      box: "bg-teal-50 text-teal-600",
      value: "text-teal-700",
    },

    emerald: {
      box: "bg-emerald-50 text-emerald-600",
      value: "text-emerald-700",
    },

    red: {
      box: "bg-red-50 text-red-600",
      value: "text-red-700",
    },
  };

  const styles = accentStyles[accent];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
            {title}
          </p>

          <p className={`mt-2 text-3xl font-bold ${styles.value}`}>
            {value}
          </p>

        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.box}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


/* =============================================================
   METRIC COMPONENT
============================================================= */

function Metric({
  value,
  label,
}: {
  value: number;
  label: string;
}) {

  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center transition hover:bg-teal-50">

      <p className="text-lg font-bold text-slate-800">
        {value}
      </p>

      <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

    </div>
  );
}