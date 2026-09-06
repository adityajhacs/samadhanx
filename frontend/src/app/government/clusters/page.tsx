"use client";

import { useMemo, useState } from "react";
import {
  clusters,
  problems,
  type ProblemCategory,
} from "@/lib/mockData";

export default function GovernmentClustersPage() {
  const [category, setCategory] = useState<"All" | ProblemCategory>("All");
  const [selectedCluster, setSelectedCluster] = useState<string | null>(
    null
  );

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

  // Open linked problems for a cluster
  const handleViewProblems = (clusterId: string) => {
    setSelectedCluster(clusterId);

    // Scroll to linked problems section after state updates
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
    <main className="min-h-screen bg-[#f6f9f9] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#115e59] via-[#0f766e] to-[#0d9488] p-6 text-white shadow-xl sm:p-8">

          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />

          <div className="relative">

            <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              Infrastructure Intelligence
            </span>

            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
              Problem Clusters
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-teal-50">
              Group related citizen problems by location and service
              category to help departments prioritize action.
            </p>

          </div>
        </section>

        {/* ================= STATS ================= */}

        <section className="mt-6 grid gap-4 sm:grid-cols-3">

          <Stat
            title="Total Clusters"
            value={clusters.length}
          />

          <Stat
            title="Active Clusters"
            value={active}
          />

          <Stat
            title="Critical Clusters"
            value={critical}
          />

        </section>

        {/* ================= FILTER ================= */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Infrastructure Clusters
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Select a cluster to inspect linked problems.
              </p>
            </div>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value as "All" | ProblemCategory
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-teal-400"
            >
              <option value="All">All</option>
              <option value="Roads">Roads</option>
              <option value="Water">Water</option>
              <option value="Electricity">
                Electricity
              </option>
              <option value="Sanitation">
                Sanitation
              </option>
            </select>

          </div>

        </section>

        {/* ================= CLUSTER GRID ================= */}

        <section className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {filteredClusters.map((cluster) => (

            <div
              key={cluster.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                selectedCluster === cluster.id
                  ? "border-teal-400 ring-2 ring-teal-100"
                  : "border-slate-200 hover:border-teal-300"
              }`}
            >

              {/* Cluster Header */}

              <div className="flex items-start justify-between gap-3">

                <div>
                  <p className="text-[10px] font-bold text-teal-600">
                    {cluster.id}
                  </p>

                  <h2 className="mt-1 text-base font-bold text-slate-900">
                    {cluster.name}
                  </h2>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                    cluster.status === "Critical"
                      ? "bg-red-50 text-red-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {cluster.status}
                </span>

              </div>

              {/* Location */}

              <p className="mt-3 text-xs text-slate-500">
                📍 {cluster.location}
              </p>

              {/* Metrics */}

              <div className="mt-4 flex gap-2">

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

              {/* Progress */}

              <div className="mt-5">

                <div className="flex justify-between text-[10px] font-bold">

                  <span className="text-slate-500">
                    Solution Progress
                  </span>

                  <span className="text-teal-600">
                    {cluster.progress}%
                  </span>

                </div>

                <div className="mt-2 h-2 rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-teal-500 transition-all duration-500"
                    style={{
                      width: `${cluster.progress}%`,
                    }}
                  />

                </div>

              </div>

              {/* ================= CLICKABLE VIEW LINKED PROBLEMS ================= */}

              <button
                type="button"
                onClick={() => handleViewProblems(cluster.id)}
                className="mt-4 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-teal-600 transition hover:bg-teal-50 hover:text-teal-800 hover:underline focus:outline-none focus:ring-2 focus:ring-teal-300"
              >
                View linked problems
                <span aria-hidden="true">
                  →
                </span>
              </button>

            </div>

          ))}

        </section>

        {/* ================= SELECTED CLUSTER / LINKED PROBLEMS ================= */}

        {selected && (
          <section
            id="linked-problems"
            className="mt-6 scroll-mt-6 rounded-2xl border border-teal-100 bg-white shadow-sm"
          >

            {/* Selected Cluster Header */}

            <div className="border-b border-slate-200 p-5">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wide text-teal-600">
                    Selected Cluster
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {selected.name}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {selected.description}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCluster(null)}
                  className="self-start rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                >
                  Close
                </button>

              </div>

            </div>

            {/* Linked Problems */}

            {linkedProblems.length > 0 ? (

              <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">

                {linkedProblems.map((problem) => (

                  <div
                    key={problem.id}
                    className="rounded-xl border border-slate-200 p-4 transition hover:border-teal-200 hover:shadow-sm"
                  >

                    <p className="text-xs font-bold text-teal-600">
                      {problem.id}
                    </p>

                    <h3 className="mt-1 text-sm font-bold text-slate-800">
                      {problem.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-500">
                      📍 {problem.location}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Department: {problem.department}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-2">

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                        {problem.category}
                      </span>

                      <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-teal-700">
                        {problem.solutionId}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <div className="p-8 text-center">

                <p className="text-sm font-semibold text-slate-600">
                  No linked problems found.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  This cluster currently has no matching problem records.
                </p>

              </div>

            )}

          </section>
        )}

        {/* ================= FOOTER ================= */}

        <footer className="mt-8 border-t border-slate-200 py-5 text-[10px] text-slate-400">
          SamadhanX • Infrastructure Clustering • M2 Prototype
        </footer>

      </div>
    </main>
  );
}

/* ================= STAT COMPONENT ================= */

function Stat({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-xs font-bold uppercase text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

/* ================= METRIC COMPONENT ================= */

function Metric({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="flex-1 rounded-xl bg-slate-50 p-3 text-center">

      <p className="text-lg font-bold text-slate-800">
        {value}
      </p>

      <p className="text-[9px] text-slate-400">
        {label}
      </p>

    </div>
  );
}