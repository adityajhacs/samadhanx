"use client";

import Link from "next/link";

const stats = [
  {
    label: "Total Problems",
    value: "8",
    description: "Citizen reports",
    icon: "📋",
    color: "text-slate-900",
  },
  {
    label: "Critical",
    value: "2",
    description: "Immediate attention",
    icon: "🚨",
    color: "text-red-600",
  },
  {
    label: "In Progress",
    value: "3",
    description: "Currently handled",
    icon: "⚙️",
    color: "text-blue-600",
  },
  {
    label: "Resolution Rate",
    value: "13%",
    description: "1 problem resolved",
    icon: "✓",
    color: "text-emerald-600",
  },
  {
    label: "Pending",
    value: "2",
    description: "Awaiting government action",
    icon: "⏳",
    color: "text-amber-600",
  },
  {
    label: "Active Clusters",
    value: "6",
    description: "2 critical clusters",
    icon: "🧩",
    color: "text-teal-600",
  },
  {
    label: "Active Solutions",
    value: "7",
    description: "Currently being processed",
    icon: "🔧",
    color: "text-indigo-600",
  },
];

const operations = [
  {
    title: "Citizen Problems",
    description: "Review, filter and inspect reported problems.",
    icon: "📋",
    href: "/government/problems",
    button: "View Problems",
  },
  {
    title: "Problem Clusters",
    description: "Identify repeated problems by location and category.",
    icon: "🧩",
    href: "/government/clusters",
    button: "View Clusters",
  },
  {
    title: "Problem Map",
    description: "View geographical hotspots and problem concentration.",
    icon: "📍",
    href: "/government/map",
    button: "Open Map",
  },
  {
    title: "Solution Pipeline",
    description: "Track problems from report to final resolution.",
    icon: "🚀",
    href: "/government/projects",
    button: "View Pipeline",
  },
];

const recentProblems = [
  {
    id: "P-1024",
    title: "Major Road Damage",
    location: "Central Delhi",
    category: "Roads",
    status: "Critical",
    statusClass: "bg-red-50 text-red-700 border-red-200",
  },
  {
    id: "P-1023",
    title: "Drinking Water Shortage",
    location: "Lucknow",
    category: "Water",
    status: "In Progress",
    statusClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "P-1022",
    title: "Street Light Failure",
    location: "Jaipur",
    category: "Electricity",
    status: "Pending",
    statusClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "P-1021",
    title: "Garbage Collection Issue",
    location: "Bhopal",
    category: "Sanitation",
    status: "Resolved",
    statusClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

const categories = [
  { name: "Roads", count: 2, width: "100%" },
  { name: "Water", count: 2, width: "86%" },
  { name: "Electricity", count: 2, width: "72%" },
  { name: "Sanitation", count: 2, width: "58%" },
];

export default function GovernmentDashboard() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-teal-900 via-teal-700 to-emerald-600 px-7 py-9 text-white shadow-xl md:px-10 md:py-11">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-28 right-40 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="relative z-10 max-w-4xl">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-wider text-white">
              GOVERNMENT ADMINISTRATION
            </span>

            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
              Government Dashboard
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-teal-50 md:text-lg">
              Central command view for citizen problems, infrastructure
              clusters, geographical hotspots and government solution progress.
            </p>

            {/* FIXED BUTTONS */}
            <div className="mt-7 flex flex-wrap gap-3">

              {/* VIEW PROBLEMS - FIXED */}
              <Link
                href="/government/problems"
                className="inline-flex items-center justify-center gap-2 rounded-xl !bg-white px-6 py-3.5 text-sm font-extrabold !text-teal-800 shadow-lg transition-all duration-200 hover:!bg-teal-50 hover:-translate-y-0.5"
              >
                <span className="text-base">📋</span>
                <span>View Problems</span>
              </Link>

              {/* VIEW CLUSTERS */}
              <Link
                href="/government/clusters"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 !bg-white/10 px-6 py-3.5 text-sm font-extrabold !text-white backdrop-blur-sm transition-all duration-200 hover:!bg-white/20 hover:-translate-y-0.5"
              >
                <span className="text-base">🧩</span>
                <span>View Clusters</span>
              </Link>

            </div>
          </div>

          {/* HERO SUMMARY */}
          <div className="relative z-10 mt-9 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold text-teal-100">
                CITIZEN REPORTS
              </p>
              <p className="mt-2 text-2xl font-black">8</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold text-teal-100">
                CRITICAL
              </p>
              <p className="mt-2 text-2xl font-black">2</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold text-teal-100">
                CLUSTERS
              </p>
              <p className="mt-2 text-2xl font-black">6</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold text-teal-100">
                RESOLVED
              </p>
              <p className="mt-2 text-2xl font-black">1</p>
            </div>
          </div>
        </section>

        {/* STAT CARDS */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.slice(0, 4).map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </p>

                  <p className={`mt-2 text-3xl font-black ${stat.color}`}>
                    {stat.value}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {stat.description}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-xl">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* SECONDARY STATS */}
        <section className="mt-4 grid gap-4 md:grid-cols-3">
          {stats.slice(4).map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </p>

                  <p className={`mt-2 text-3xl font-black ${stat.color}`}>
                    {stat.value}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {stat.description}
                  </p>
                </div>

                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </section>

        {/* GOVERNMENT OPERATIONS */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-black text-slate-900">
              Government Operations
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Navigate directly to the M2 government management modules.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {operations.map((operation) => (
              <Link
                key={operation.title}
                href={operation.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-2xl">
                    {operation.icon}
                  </div>

                  <span className="text-lg text-slate-300 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {operation.title}
                </h3>

                <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                  {operation.description}
                </p>

                <div className="mt-5 inline-flex items-center rounded-lg !bg-teal-700 px-4 py-2 text-sm font-bold !text-white transition group-hover:!bg-teal-800">
                  {operation.button}
                  <span className="ml-2">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">

          {/* RECENT PROBLEMS */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Recent Citizen Problems
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Latest reports connected to government workflows.
                </p>
              </div>

              <Link
                href="/government/problems"
                className="rounded-lg !bg-teal-50 px-4 py-2 text-sm font-bold !text-teal-700 hover:!bg-teal-100"
              >
                View All
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentProblems.map((problem) => (
                <Link
                  href="/government/problems"
                  key={problem.id}
                  className="block px-6 py-5 transition hover:bg-slate-50"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-teal-700">
                          {problem.id}
                        </span>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-bold ${problem.statusClass}`}
                        >
                          {problem.status}
                        </span>
                      </div>

                      <h3 className="mt-2 font-bold text-slate-900">
                        {problem.title}
                      </h3>

                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                        <span>📍 {problem.location}</span>
                        <span>•</span>
                        <span>{problem.category}</span>
                      </div>
                    </div>

                    <span className="text-sm font-bold text-teal-600">
                      Inspect →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CATEGORIES */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-900">
              Problem Categories
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current distribution of citizen reports.
            </p>

            <div className="mt-7 space-y-6">
              {categories.map((category) => (
                <div key={category.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      {category.name}
                    </span>

                    <span className="text-sm font-bold text-slate-500">
                      {category.count}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-teal-600"
                      style={{ width: category.width }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/government/problems"
              className="mt-7 block rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-center text-sm font-bold text-teal-700 transition hover:bg-teal-100"
            >
              Analyze All Problems →
            </Link>
          </div>
        </section>

        {/* CLUSTERS + PIPELINE */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">

          {/* CLUSTERS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Infrastructure Clusters
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Problems automatically connected to reports.
                </p>
              </div>

              <Link
                href="/government/clusters"
                className="rounded-lg bg-teal-50 px-3 py-2 text-xs font-bold text-teal-700"
              >
                View Clusters
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {[
                ["C-001", "Central Delhi Infrastructure", "43%"],
                ["C-002", "Lucknow Water Supply", "64%"],
                ["C-003", "Jaipur Electricity", "56%"],
              ].map(([id, name, progress]) => (
                <div
                  key={id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-teal-700">{id}</p>
                      <p className="mt-1 font-bold text-slate-800">{name}</p>
                    </div>

                    <span className="text-xs font-bold text-slate-500">
                      {progress}
                    </span>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-teal-600"
                      style={{ width: progress }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SOLUTION PIPELINE */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Solution Pipeline
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Track problems from report to resolution.
                </p>
              </div>

              <Link
                href="/government/projects"
                className="rounded-lg bg-teal-50 px-3 py-2 text-xs font-bold text-teal-700"
              >
                Open Pipeline
              </Link>
            </div>

            <div className="mt-7 grid grid-cols-5 gap-2">
              {[
                ["1", "Reported"],
                ["2", "Verified"],
                ["1", "Assigned"],
                ["3", "Execution"],
                ["1", "Resolved"],
              ].map(([number, label], index) => (
                <div key={label} className="text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-teal-600 text-sm font-black text-white">
                    {number}
                  </div>

                  <p className="mt-3 text-xs font-bold text-slate-700">
                    {label}
                  </p>

                  {index < 4 && (
                    <div className="hidden lg:block" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[72%] rounded-full bg-teal-600" />
            </div>

            <p className="mt-3 text-center text-xs font-semibold text-slate-500">
              72% of active solutions are progressing through the pipeline
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-8 text-center text-xs text-slate-400">
          SamadhanX • Government Administration • M2 Government Management
        </footer>
      </div>
    </main>
  );
}