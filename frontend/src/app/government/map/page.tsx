"use client";

import { useMemo, useState } from "react";
import {
  problems,
  type ProblemCategory,
} from "@/lib/mockData";

export default function GovernmentProblemMapPage() {
  const [category, setCategory] = useState<
    "All" | ProblemCategory
  >("All");

  const filteredProblems = useMemo(() => {
    if (category === "All") return problems;

    return problems.filter(
      (problem) => problem.category === category
    );
  }, [category]);

  const critical = problems.filter(
    (problem) => problem.status === "Critical"
  ).length;

  return (
    <main className="min-h-screen bg-[#f6f9f9] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#115e59] via-[#0f766e] to-[#0d9488] p-6 text-white shadow-xl sm:p-8">

          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />

          <div className="relative">

            <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              Geographic Monitoring
            </span>

            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
              Problem Map
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-teal-50">
              Visualize citizen-reported problems and identify critical
              geographic hotspots.
            </p>

          </div>
        </section>

        {/* CONTROLS */}

        <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Government Problem Map
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredProblems.length} problems displayed
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
            <option>All</option>
            <option>Roads</option>
            <option>Water</option>
            <option>Electricity</option>
            <option>Sanitation</option>
          </select>

        </section>

        {/* MAP */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="relative h-[520px] overflow-hidden bg-[#e8f1ef]">

            {/* GRID */}

            <div className="absolute inset-0 opacity-30">
              <div className="h-full w-full bg-[linear-gradient(to_right,#94a3b8_1px,transparent_1px),linear-gradient(to_bottom,#94a3b8_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            {/* LAND SHAPE */}

            <div className="absolute left-[12%] top-[8%] h-[78%] w-[72%] rounded-[45%] border-4 border-teal-200 bg-teal-50/50 rotate-[-8deg]" />

            <div className="absolute left-[28%] top-[20%] h-[50%] w-[38%] rounded-[40%] border-2 border-emerald-200 bg-emerald-50/40 rotate-[15deg]" />

            {/* ROADS */}

            <div className="absolute left-[10%] top-[48%] h-1 w-[80%] rotate-[-8deg] bg-white shadow" />

            <div className="absolute left-[40%] top-[5%] h-[90%] w-1 rotate-[12deg] bg-white shadow" />

            {/* MARKERS */}

            {filteredProblems.map((problem) => (

              <div
                key={problem.id}
                className="group absolute"
                style={{
                  left: `${problem.mapX}%`,
                  top: `${problem.mapY}%`,
                }}
              >

                <div
                  className={`flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white text-sm shadow-lg ${
                    problem.status === "Critical"
                      ? "bg-red-500"
                      : problem.status === "Resolved"
                      ? "bg-emerald-500"
                      : "bg-teal-500"
                  }`}
                >
                  📍
                </div>

                {/* TOOLTIP */}

                <div className="pointer-events-none absolute left-1/2 top-7 z-20 hidden w-56 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-xl group-hover:block">

                  <p className="text-[10px] font-bold text-teal-600">
                    {problem.id}
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {problem.title}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    📍 {problem.location}
                  </p>

                  <div className="mt-2 flex justify-between">

                    <span className="text-[10px] font-semibold text-slate-500">
                      {problem.category}
                    </span>

                    <span
                      className={`text-[10px] font-bold ${
                        problem.status === "Critical"
                          ? "text-red-600"
                          : problem.status === "Resolved"
                          ? "text-emerald-600"
                          : "text-teal-600"
                      }`}
                    >
                      {problem.status}
                    </span>

                  </div>

                </div>

              </div>

            ))}

            {/* MAP LABEL */}

            <div className="absolute bottom-5 left-5 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">

              <p className="text-[10px] font-bold uppercase text-slate-400">
                Map Legend
              </p>

              <div className="mt-3 space-y-2">

                <Legend color="bg-red-500" label="Critical" />

                <Legend color="bg-teal-500" label="Active" />

                <Legend color="bg-emerald-500" label="Resolved" />

              </div>

            </div>

            {/* CRITICAL COUNT */}

            <div className="absolute right-5 top-5 rounded-xl border border-red-100 bg-white/95 p-4 shadow-lg backdrop-blur">

              <p className="text-[10px] font-bold uppercase text-red-500">
                Critical Hotspots
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {critical}
              </p>

            </div>

          </div>

        </section>

        {/* LOCATION LIST */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-900">
              Reported Locations
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Problems represented on the prototype map.
            </p>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">

            {filteredProblems.map((problem) => (

              <div
                key={problem.id}
                className="rounded-xl border border-slate-200 p-4"
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

                <p className="mt-1 text-[10px] text-slate-400">
                  {problem.district}, {problem.state}
                </p>

              </div>

            ))}

          </div>

        </section>

        <footer className="mt-8 border-t border-slate-200 py-5 text-[10px] text-slate-400">
          SamadhanX • Geographic Problem Monitoring • M2 Prototype
        </footer>

      </div>
    </main>
  );
}


function Legend({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span className="text-[10px] font-semibold text-slate-600">
        {label}
      </span>
    </div>
  );
}