"use client";

import { useMemo, useState } from "react";
import {
  problems,
  type Problem,
  type ProblemCategory,
  type ProblemStatus,
} from "@/lib/mockData";

export default function GovernmentProblemsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | ProblemCategory>("All");
  const [status, setStatus] = useState<"All" | ProblemStatus>("All");
  const [selectedProblem, setSelectedProblem] =
    useState<Problem | null>(null);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const text =
        `${problem.id} ${problem.title} ${problem.location} ${problem.district} ${problem.category}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || problem.category === category;

      const matchesStatus =
        status === "All" || problem.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, category, status]);

  const critical = problems.filter(
    (problem) => problem.status === "Critical"
  ).length;

  const inProgress = problems.filter(
    (problem) => problem.status === "In Progress"
  ).length;

  const pending = problems.filter(
    (problem) => problem.status === "Pending"
  ).length;

  const resolved = problems.filter(
    (problem) => problem.status === "Resolved"
  ).length;

  return (
    <main className="min-h-screen bg-[#f6f9f9] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#115e59] via-[#0f766e] to-[#0d9488] p-6 text-white shadow-xl sm:p-8">

          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />

          <div className="relative">
            <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              Citizen Issue Management
            </span>

            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
              Government Problems
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-teal-50">
              Review, filter and manage citizen-reported problems across
              locations and government service categories.
            </p>
          </div>
        </section>

        {/* STATS */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Critical"
            value={critical}
            subtitle="Immediate attention"
            color="red"
          />

          <StatCard
            title="In Progress"
            value={inProgress}
            subtitle="Currently handled"
            color="teal"
          />

          <StatCard
            title="Pending"
            value={pending}
            subtitle="Awaiting action"
            color="amber"
          />

          <StatCard
            title="Resolved"
            value={resolved}
            subtitle="Successfully completed"
            color="emerald"
          />

        </section>

        {/* FILTER */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="grid gap-4 lg:grid-cols-[1fr_200px_200px_auto]">

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">
                Search Problems
              </label>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID, problem or location..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as "All" | ProblemCategory
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-400"
              >
                <option>All</option>
                <option>Roads</option>
                <option>Water</option>
                <option>Electricity</option>
                <option>Sanitation</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as "All" | ProblemStatus
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-400"
              >
                <option>All</option>
                <option>Critical</option>
                <option>In Progress</option>
                <option>Pending</option>
                <option>Resolved</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setStatus("All");
              }}
              className="h-11 self-end rounded-xl border border-slate-200 px-5 text-xs font-bold text-slate-600 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
            >
              Reset Filters
            </button>

          </div>

          <div className="mt-4 flex justify-between gap-2">

            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-800">
                {filteredProblems.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-800">
                {problems.length}
              </span>{" "}
              problems
            </p>

            <span className="rounded-full bg-teal-50 px-3 py-1 text-[10px] font-bold text-teal-700">
              SHARED MOCK DATA
            </span>

          </div>
        </section>

        {/* TABLE */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-900">
              Citizen Reports
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Every report is connected to a cluster and solution pipeline.
            </p>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-500">
                    Problem
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-500">
                    Location
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>

                {filteredProblems.map((problem) => (
                  <tr
                    key={problem.id}
                    className="border-t border-slate-100 hover:bg-teal-50/30"
                  >

                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-teal-600">
                        {problem.id}
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {problem.title}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {problem.reportedAt}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      📍 {problem.location}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                        {problem.category}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={problem.status} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedProblem(problem)}
                        className="rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-teal-700"
                      >
                        View Details
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          {filteredProblems.length === 0 && (
            <div className="px-6 py-16 text-center">
              <h3 className="font-bold text-slate-900">
                No problems found
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          )}

        </section>

        <div className="mt-8 border-t border-slate-200 py-5 text-[10px] text-slate-400">
          SamadhanX • Government Problem Management • M2 Shared Mock Data
        </div>
      </div>

      {/* MODAL */}

      {selectedProblem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProblem(null)}
        >

          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="bg-gradient-to-r from-[#115e59] to-[#0d9488] p-6 text-white">

              <p className="text-[10px] font-bold uppercase text-teal-100">
                Problem Details
              </p>

              <p className="mt-1 text-xs font-bold text-teal-100">
                {selectedProblem.id}
              </p>

              <h2 className="mt-2 text-xl font-bold">
                {selectedProblem.title}
              </h2>

            </div>

            <div className="space-y-4 p-6">

              <div className="flex justify-between">
                <StatusBadge status={selectedProblem.status} />

                <span className="text-xs text-slate-400">
                  {selectedProblem.reportedAt}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <InfoBox
                  title="Location"
                  value={`📍 ${selectedProblem.location}`}
                />

                <InfoBox
                  title="Category"
                  value={selectedProblem.category}
                />

                <InfoBox
                  title="Department"
                  value={selectedProblem.department}
                />

                <InfoBox
                  title="Cluster"
                  value={selectedProblem.clusterId}
                />

              </div>

              <div className="rounded-xl border border-teal-100 bg-teal-50 p-4">
                <p className="text-[10px] font-bold uppercase text-teal-600">
                  Problem Statement
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {selectedProblem.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <InfoBox
                  title="Citizen Reports"
                  value={String(selectedProblem.citizenReports)}
                />

                <InfoBox
                  title="Solution"
                  value={selectedProblem.solutionId}
                />

              </div>

              <button
                onClick={() => setSelectedProblem(null)}
                className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white hover:bg-teal-700"
              >
                Close Details
              </button>

            </div>
          </div>
        </div>
      )}
    </main>
  );
}


function StatusBadge({
  status,
}: {
  status: ProblemStatus;
}) {
  const styles = {
    Critical: "bg-red-50 text-red-700 border-red-200",
    "In Progress": "bg-teal-50 text-teal-700 border-teal-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}


function StatCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: number;
  subtitle: string;
  color: "red" | "teal" | "amber" | "emerald";
}) {
  const styles = {
    red: "border-red-100 text-red-500",
    teal: "border-teal-100 text-teal-500",
    amber: "border-amber-100 text-amber-500",
    emerald: "border-emerald-100 text-emerald-500",
  };

  return (
    <div className={`rounded-2xl border bg-white p-5 shadow-sm ${styles[color]}`}>
      <p className="text-xs font-bold uppercase">{title}</p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}


function InfoBox({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-[10px] font-bold uppercase text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}