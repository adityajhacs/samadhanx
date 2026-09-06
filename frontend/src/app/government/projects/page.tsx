"use client";

import { useMemo, useState } from "react";
import {
  solutions,
  solutionStages,
  problems,
  type SolutionStage,
} from "@/lib/mockData";

export default function GovernmentSolutionPipelinePage() {
  const [selectedStage, setSelectedStage] = useState<
    "All" | SolutionStage
  >("All");

  const filteredSolutions = useMemo(() => {
    if (selectedStage === "All") return solutions;

    return solutions.filter(
      (solution) => solution.currentStage === selectedStage
    );
  }, [selectedStage]);

  return (
    <main className="min-h-screen bg-[#f6f9f9] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#115e59] via-[#0f766e] to-[#0d9488] p-6 text-white shadow-xl sm:p-8">

          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />

          <div className="relative">

            <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              Government Action Workflow
            </span>

            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
              Solution Pipeline
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-teal-50">
              Track every citizen problem from initial report through
              verification, departmental assignment, execution and final
              resolution.
            </p>

          </div>
        </section>

        {/* PIPELINE FLOW */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            Problem Resolution Workflow
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            SamadhanX connects citizen reports directly to government action.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-5">

            {solutionStages.map((stage, index) => {

              const count = solutions.filter(
                (solution) =>
                  solution.currentStage === stage.id
              ).length;

              return (
                <button
                  key={stage.id}
                  onClick={() =>
                    setSelectedStage(stage.id)
                  }
                  className={`relative rounded-xl border p-4 text-left transition ${
                    selectedStage === stage.id
                      ? "border-teal-400 bg-teal-50"
                      : "border-slate-200 bg-slate-50 hover:border-teal-200"
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                      {index + 1}
                    </span>

                    <span className="text-xl font-bold text-teal-700">
                      {count}
                    </span>

                  </div>

                  <h3 className="mt-3 text-sm font-bold text-slate-800">
                    {stage.label}
                  </h3>

                  <p className="mt-1 text-[10px] leading-4 text-slate-500">
                    {stage.description}
                  </p>

                </button>
              );
            })}

          </div>

        </section>

        {/* FILTER */}

        <section className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Active Solutions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Each solution is connected to a problem ID.
            </p>
          </div>

          <button
            onClick={() => setSelectedStage("All")}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            Show All
          </button>

        </section>

        {/* SOLUTION CARDS */}

        <section className="mt-6 grid gap-5 lg:grid-cols-2">

          {filteredSolutions.map((solution) => {

            const problem = problems.find(
              (item) => item.id === solution.problemId
            );

            return (
              <div
                key={solution.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >

                {/* TOP */}

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <div className="flex items-center gap-2">

                      <span className="text-xs font-bold text-teal-600">
                        {solution.id}
                      </span>

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                        {solution.category}
                      </span>

                    </div>

                    <h2 className="mt-2 text-lg font-bold text-slate-900">
                      {solution.problemTitle}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      📍 {solution.location}
                    </p>

                  </div>

                  <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-bold text-teal-700">
                    {solution.currentStage}
                  </span>

                </div>

                {/* PROGRESS */}

                <div className="mt-5">

                  <div className="flex justify-between">

                    <span className="text-xs font-semibold text-slate-500">
                      Solution Progress
                    </span>

                    <span className="text-xs font-bold text-teal-600">
                      {solution.progress}%
                    </span>

                  </div>

                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-teal-500 transition-all"
                      style={{
                        width: `${solution.progress}%`,
                      }}
                    />

                  </div>

                </div>

                {/* DETAILS */}

                <div className="mt-5 grid gap-3 sm:grid-cols-2">

                  <Info
                    title="Department"
                    value={solution.department}
                  />

                  <Info
                    title="Assigned Team"
                    value={solution.assignedTeam}
                  />

                  <Info
                    title="Expected Completion"
                    value={solution.estimatedCompletion}
                  />

                  <Info
                    title="Problem ID"
                    value={solution.problemId}
                  />

                </div>

                {/* ACTION */}

                <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50 p-4">

                  <p className="text-[10px] font-bold uppercase text-teal-600">
                    Proposed Government Action
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {solution.action}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    Expected Impact: {solution.impact}
                  </p>

                </div>

                {/* SOURCE */}

                {problem && (
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

                    <span className="text-[10px] text-slate-400">
                      Linked citizen report: {problem.id}
                    </span>

                    <a
                      href="/government/problems"
                      className="text-xs font-bold text-teal-600 hover:text-teal-700"
                    >
                      View Problem →
                    </a>

                  </div>
                )}

              </div>
            );
          })}

        </section>

        {filteredSolutions.length === 0 && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <h3 className="font-bold text-slate-900">
              No solutions in this stage
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Select another pipeline stage.
            </p>
          </div>
        )}

        {/* PIPELINE EXPLANATION */}

        <section className="mt-6 rounded-2xl border border-teal-100 bg-teal-50 p-6">

          <h2 className="text-lg font-bold text-teal-900">
            How SamadhanX Resolution Works
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-5">

            {solutionStages.map((stage, index) => (

              <div key={stage.id}>

                <div className="flex items-center gap-2">

                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                    {index + 1}
                  </span>

                  <span className="text-xs font-bold text-teal-900">
                    {stage.label}
                  </span>

                </div>

                <p className="mt-2 text-[10px] leading-4 text-teal-800">
                  {stage.description}
                </p>

              </div>

            ))}

          </div>

        </section>

        <footer className="mt-8 border-t border-slate-200 py-5 text-[10px] text-slate-400">
          SamadhanX • Solution Pipeline • M2 Prototype
        </footer>

      </div>
    </main>
  );
}


function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[9px] font-bold uppercase text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-xs font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}