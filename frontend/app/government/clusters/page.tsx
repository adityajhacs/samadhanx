"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Layers3,
  MapPin,
  AlertCircle,
  Activity,
  Building2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import {
  clusters,
  type ProblemCategory,
} from "@/lib/mockData";

export default function GovernmentClustersPage() {
  const router = useRouter();

  const [category, setCategory] =
    useState<"All" | ProblemCategory>("All");

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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      {/* CHANGED: Header is now contained instead of full width */}
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
              Identify recurring citizen challenges by location and
              service category to help departments coordinate
              targeted interventions.
            </p>
          </div>

        </div>

        {/* RIGHT SIDE SUMMARY */}
        <div className="grid shrink-0 grid-cols-2 gap-3">

          <div className="min-w-[135px] rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">

            <p className="text-[10px] font-bold uppercase tracking-wide text-teal-100">
              Total Clusters
            </p>

            <p className="mt-1 text-2xl font-bold">
              {clusters.length}
            </p>

            <p className="mt-1 text-[10px] text-teal-100">
              Identified patterns
            </p>

          </div>

          <div className="min-w-[135px] rounded-xl border border-red-200/20 bg-red-500/15 px-4 py-3 backdrop-blur-sm">

            <div className="flex items-center gap-2">
              <AlertCircle
                size={13}
                className="text-red-100"
              />

              <p className="text-[10px] font-bold uppercase tracking-wide text-red-100">
                Critical
              </p>
            </div>

            <p className="mt-1 text-2xl font-bold text-white">
              {critical}
            </p>

            <p className="mt-1 text-[10px] text-red-100">
              Require attention
            </p>

          </div>

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
            accent="teal"
            description="AI-identified patterns"
          />

          <Stat
            title="Active Clusters"
            value={active}
            icon={<Activity size={19} />}
            accent="emerald"
            description="Currently being addressed"
          />

          <Stat
            title="Critical Clusters"
            value={critical}
            icon={<AlertCircle size={19} />}
            accent="red"
            description="High-priority intervention"
          />

        </section>

        {/* =====================================================
            CLUSTER LIST HEADER
        ===================================================== */}

        <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 bg-gradient-to-r from-teal-50 via-white to-cyan-50 p-5 sm:p-6">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm shadow-teal-600/20">
                  <Layers3 size={19} />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Infrastructure Clusters
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Review recurring citizen problems grouped by
                    location and service category.
                  </p>

                </div>

              </div>

              {/* CATEGORY FILTER */}

              <div className="flex items-center gap-3">

                <label
                  htmlFor="cluster-category"
                  className="text-xs font-semibold text-slate-500"
                >
                  Category
                </label>

                <select
                  id="cluster-category"
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value as
                        | "All"
                        | ProblemCategory
                    )
                  }
                  className="h-10 min-w-[170px] rounded-xl border border-teal-100 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm outline-none transition hover:border-teal-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
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

          </div>

        </section>

        {/* =====================================================
            CLUSTER GRID
        ===================================================== */}

        <section className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {filteredClusters.map((cluster) => (

            <article
              key={cluster.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-900/5"
            >

              {/* Teal top accent */}

              <div className="h-1 w-full bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-400" />

              <div className="p-5">

                {/* CARD HEADER */}

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-600">
                      {cluster.id}
                    </p>

                    <h3 className="mt-1 text-base font-bold leading-6 text-slate-900 transition group-hover:text-teal-700">
                      {cluster.name}
                    </h3>

                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
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

                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                    <MapPin size={14} />
                  </span>

                  <span className="font-medium">
                    {cluster.location}
                  </span>

                </div>

                {/* CATEGORY */}

                <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5">

                  <Building2
                    size={13}
                    className="text-teal-600"
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
                    highlight="teal"
                  />

                  <Metric
                    value={cluster.critical}
                    label="Critical"
                    highlight="red"
                  />

                  <Metric
                    value={cluster.resolved}
                    label="Resolved"
                    highlight="emerald"
                  />

                </div>

                {/* PROGRESS */}

                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-3">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <CheckCircle2
                        size={14}
                        className="text-teal-600"
                      />

                      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        Solution Progress
                      </span>

                    </div>

                    <span className="text-xs font-bold text-teal-700">
                      {cluster.progress}%
                    </span>

                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 transition-all duration-500"
                      style={{
                        width: `${cluster.progress}%`,
                      }}
                    />

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="mt-5 flex gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/government/clusters/${cluster.id}`
                      )
                    }
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm shadow-teal-600/20 transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300"
                  >
                    View Related Problems

                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />

                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/government/clusters/${cluster.id}`
                      )
                    }
                    className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-2.5 text-xs font-bold text-teal-700 transition hover:border-teal-300 hover:bg-teal-100"
                  >
                    Details
                  </button>

                </div>

              </div>

            </article>

          ))}

        </section>

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {filteredClusters.length === 0 && (

          <section className="mt-6 rounded-2xl border border-teal-100 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-500">
              <Layers3 size={22} />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-800">
              No clusters found
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              No problem clusters match the selected category.
            </p>

            <button
              type="button"
              onClick={() => setCategory("All")}
              className="mt-4 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-700"
            >
              Clear Filter
            </button>

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
   STAT COMPONENT
============================================================= */

function Stat({
  title,
  value,
  icon,
  accent,
  description,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  accent: "teal" | "emerald" | "red";
  description: string;
}) {

  const accentStyles = {

    teal: {
      box: "bg-teal-50 text-teal-600 ring-teal-100",
      value: "text-teal-700",
      line: "bg-teal-600",
    },

    emerald: {
      box: "bg-emerald-50 text-emerald-600 ring-emerald-100",
      value: "text-emerald-700",
      line: "bg-emerald-500",
    },

    red: {
      box: "bg-red-50 text-red-600 ring-red-100",
      value: "text-red-700",
      line: "bg-red-500",
    },

  };

  const styles = accentStyles[accent];

  return (

    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div
        className={`absolute left-0 top-0 h-full w-1 ${styles.line}`}
      />

      <div className="flex items-center justify-between">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
            {title}
          </p>

          <p className={`mt-2 text-3xl font-bold ${styles.value}`}>
            {value}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            {description}
          </p>

        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ring-4 ${styles.box}`}
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
  highlight,
}: {
  value: number;
  label: string;
  highlight: "teal" | "red" | "emerald";
}) {

  const styles = {

    teal: {
      box: "bg-teal-50",
      value: "text-teal-700",
    },

    red: {
      box: "bg-red-50",
      value: "text-red-700",
    },

    emerald: {
      box: "bg-emerald-50",
      value: "text-emerald-700",
    },

  };

  const current = styles[highlight];

  return (

    <div
      className={`rounded-xl ${current.box} p-3 text-center transition hover:-translate-y-0.5`}
    >

      <p className={`text-lg font-bold ${current.value}`}>
        {value}
      </p>

      <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

    </div>

  );
}