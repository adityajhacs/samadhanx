"use client";

import { useMemo, useState } from "react";
import {
  MapPin,
  Search,
  RotateCcw,
  Eye,
  X,
  AlertCircle,
  Clock3,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";

import {
  problems,
  type Problem,
  type ProblemCategory,
  type ProblemStatus,
} from "@/lib/mockData";

export default function GovernmentProblemsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<"All" | ProblemCategory>("All");
  const [status, setStatus] =
    useState<"All" | ProblemStatus>("All");
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
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

     {/* HEADER */}

<section className="relative overflow-hidden rounded-3xl border border-teal-800 bg-gradient-to-r from-teal-800 via-teal-700 to-teal-600 px-6 py-7 text-white shadow-md sm:px-8">

  {/* Decorative circles */}
  <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-teal-500/20" />
  <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-teal-400/10" />

  <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">

    {/* LEFT */}

    <div className="max-w-xl">

      <div className="flex items-center gap-4">

        {/* Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
          <ClipboardList size={22} strokeWidth={2} />
        </div>

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.17em] text-teal-100">
            GOVERNMENT WORKSPACE
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Issue Management
          </h1>

        </div>

      </div>

      <p className="mt-4 max-w-lg text-sm leading-6 text-teal-50">
        Review, prioritise and track citizen-reported issues
        across locations and public service categories.
      </p>

    </div>


    {/* RIGHT — STATUS BUTTONS */}

    <div className="relative grid w-full grid-cols-2 gap-3 sm:w-auto sm:min-w-[360px]">

      {/* CRITICAL */}
      <button
        onClick={() => setStatus("Critical")}
        className={`
          group rounded-2xl border p-4 text-left
          transition-all duration-200
          hover:-translate-y-0.5 hover:shadow-lg
          ${
            status === "Critical"
              ? "border-red-300 bg-red-50 shadow-md"
              : "border-white/20 bg-white/95 hover:bg-white"
          }
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
            <AlertCircle size={15} strokeWidth={2} />
          </div>

          <span className="text-lg font-bold text-slate-900">
            {critical}
          </span>
        </div>

        <p className="mt-2 text-xs font-semibold text-slate-700">
          Critical
        </p>

        <p className="mt-0.5 text-[10px] text-slate-400">
          Immediate attention
        </p>
      </button>


      {/* IN PROGRESS */}
      <button
        onClick={() => setStatus("In Progress")}
        className={`
          group rounded-2xl border p-4 text-left
          transition-all duration-200
          hover:-translate-y-0.5 hover:shadow-lg
          ${
            status === "In Progress"
              ? "border-teal-300 bg-teal-50 shadow-md"
              : "border-white/20 bg-white/95 hover:bg-white"
          }
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
            <Clock3 size={15} strokeWidth={2} />
          </div>

          <span className="text-lg font-bold text-slate-900">
            {inProgress}
          </span>
        </div>

        <p className="mt-2 text-xs font-semibold text-slate-700">
          In Progress
        </p>

        <p className="mt-0.5 text-[10px] text-slate-400">
          Currently handled
        </p>
      </button>


      {/* PENDING */}
      <button
        onClick={() => setStatus("Pending")}
        className={`
          group rounded-2xl border p-4 text-left
          transition-all duration-200
          hover:-translate-y-0.5 hover:shadow-lg
          ${
            status === "Pending"
              ? "border-amber-300 bg-amber-50 shadow-md"
              : "border-white/20 bg-white/95 hover:bg-white"
          }
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            <Clock3 size={15} strokeWidth={2} />
          </div>

          <span className="text-lg font-bold text-slate-900">
            {pending}
          </span>
        </div>

        <p className="mt-2 text-xs font-semibold text-slate-700">
          Pending
        </p>

        <p className="mt-0.5 text-[10px] text-slate-400">
          Awaiting action
        </p>
      </button>


      {/* RESOLVED */}
      <button
        onClick={() => setStatus("Resolved")}
        className={`
          group rounded-2xl border p-4 text-left
          transition-all duration-200
          hover:-translate-y-0.5 hover:shadow-lg
          ${
            status === "Resolved"
              ? "border-emerald-300 bg-emerald-50 shadow-md"
              : "border-white/20 bg-white/95 hover:bg-white"
          }
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={15} strokeWidth={2} />
          </div>

          <span className="text-lg font-bold text-slate-900">
            {resolved}
          </span>
        </div>

        <p className="mt-2 text-xs font-semibold text-slate-700">
          Resolved
        </p>

        <p className="mt-0.5 text-[10px] text-slate-400">
          Successfully completed
        </p>
      </button>

    </div>

  </div>

</section>
        {/* =====================================================
            FILTERS
           ===================================================== */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="grid gap-4 lg:grid-cols-[1fr_200px_200px_auto]">

            {/* SEARCH */}

            <div>

              <label className="mb-2 block text-xs font-bold text-slate-600">
                Search Problems
              </label>

              <div className="relative">

                <Search
                  size={16}
                  strokeWidth={2}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search ID, problem or location..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />

              </div>

            </div>


            {/* CATEGORY */}

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
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-teal-400 focus:bg-white"
              >
                <option>All</option>
                <option>Roads</option>
                <option>Water</option>
                <option>Electricity</option>
                <option>Sanitation</option>
              </select>

            </div>


            {/* STATUS */}

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
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-teal-400 focus:bg-white"
              >
                <option>All</option>
                <option>Critical</option>
                <option>In Progress</option>
                <option>Pending</option>
                <option>Resolved</option>
              </select>

            </div>


            {/* RESET */}

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setStatus("All");
              }}
              className="inline-flex h-11 items-center justify-center gap-2 self-end rounded-xl border border-slate-200 px-5 text-xs font-bold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
            >
              <RotateCcw size={14} strokeWidth={2} />
              Reset Filters
            </button>

          </div>


          {/* RESULT COUNT */}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

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
              SHARED DATA
            </span>

          </div>

        </section>


        {/* =====================================================
            CITIZEN REPORTS
           ===================================================== */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:px-6">

            <div>

              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                  <ClipboardList
                    size={15}
                    strokeWidth={2}
                  />
                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  Citizen Reports
                </h2>

              </div>

              <p className="mt-1 text-xs text-slate-500">
                Every report is connected to a cluster and solution pipeline.
              </p>

            </div>

            <span className="text-xs font-semibold text-slate-400">
              {filteredProblems.length} active records
            </span>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-slate-50 text-left">

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Problem
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Location
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredProblems.map((problem) => (

                  <tr
                    key={problem.id}
                    className="border-t border-slate-100 transition hover:bg-teal-50/30"
                  >

                    {/* PROBLEM */}

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


                    {/* LOCATION */}

                    <td className="px-6 py-4 text-sm text-slate-600">

                      <div className="flex items-center gap-2">

                        <MapPin
                          size={15}
                          strokeWidth={2}
                          className="shrink-0 text-teal-500"
                        />

                        {problem.location}

                      </div>

                    </td>


                    {/* CATEGORY */}

                    <td className="px-6 py-4">

                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                        {problem.category}
                      </span>

                    </td>


                    {/* STATUS */}

                    <td className="px-6 py-4">
                      <StatusBadge status={problem.status} />
                    </td>


                    {/* ACTION */}

                    <td className="px-6 py-4 text-right">

                      <button
                        onClick={() => setSelectedProblem(problem)}
                        className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-teal-700"
                      >
                        <Eye
                          size={14}
                          strokeWidth={2}
                        />
                        View Details
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {/* EMPTY STATE */}

          {filteredProblems.length === 0 && (

            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Search size={20} />
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                No problems found
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Try changing your search or filters.
              </p>

            </div>

          )}

        </section>


        {/* =====================================================
            FOOTER MESSAGE
           ===================================================== */}

        <div className="mt-8 border-t border-slate-200 py-5 text-center">

          <p className="text-xs font-medium text-slate-400">
            Connecting citizen voices with meaningful government action.
          </p>

        </div>

      </div>


      {/* =====================================================
          MODAL
         ===================================================== */}

      {selectedProblem && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProblem(null)}
        >

          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <div className="bg-gradient-to-r from-[#115e59] to-[#0d9488] p-6 text-white">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-teal-100">
                    Problem Details
                  </p>

                  <p className="mt-1 text-xs font-bold text-teal-100">
                    {selectedProblem.id}
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    {selectedProblem.title}
                  </h2>

                </div>

                <button
                  onClick={() => setSelectedProblem(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 transition hover:bg-white/20"
                >
                  <X size={17} strokeWidth={2} />
                </button>

              </div>

            </div>


            {/* MODAL CONTENT */}

            <div className="space-y-4 p-6">

              <div className="flex items-center justify-between gap-3">

                <StatusBadge
                  status={selectedProblem.status}
                />

                <span className="text-xs text-slate-400">
                  {selectedProblem.reportedAt}
                </span>

              </div>


              <div className="grid grid-cols-2 gap-4">

                <InfoBox
                  title="Location"
                  value={selectedProblem.location}
                  icon={<MapPin size={15} />}
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

                <p className="text-[10px] font-bold uppercase tracking-wide text-teal-600">
                  Problem Statement
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {selectedProblem.description}
                </p>

              </div>


              <div className="grid grid-cols-2 gap-4">

                <InfoBox
                  title="Citizen Reports"
                  value={String(
                    selectedProblem.citizenReports
                  )}
                />

                <InfoBox
                  title="Solution"
                  value={selectedProblem.solutionId}
                />

              </div>


              <button
                onClick={() => setSelectedProblem(null)}
                className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
              >
                Close Details
              </button>

            </div>

          </div>

        </div>

      )}
      {/* FOOTER */}

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


    {/* CENTER — COPYRIGHT */}

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
   STATUS BADGE
   ============================================================= */

function StatusBadge({
  status,
}: {
  status: ProblemStatus;
}) {
  const styles = {
    Critical:
      "bg-red-50 text-red-700 border-red-200",

    "In Progress":
      "bg-teal-50 text-teal-700 border-teal-200",

    Pending:
      "bg-amber-50 text-amber-700 border-amber-200",

    Resolved:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}


/* =============================================================
   INFO BOX
   ============================================================= */

function InfoBox({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <div className="flex items-center gap-2">

        {icon && (
          <span className="text-teal-500">
            {icon}
          </span>
        )}

        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {title}
        </p>

      </div>

      <p className="mt-1 text-sm font-bold text-slate-800">
        {value}
      </p>

    </div>
  );
}