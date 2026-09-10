"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Lightbulb,
  MapPin,
  Sparkles,
  University,
  Rocket,
  Target,
  Users,
  Activity,
} from "lucide-react";

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
    if (selectedStage === "All") {
      return solutions;
    }

    return solutions.filter(
      (solution) => solution.currentStage === selectedStage
    );
  }, [selectedStage]);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}

          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-teal-700 to-teal-600 p-6 text-white shadow-lg sm:p-8">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
            <div className="absolute -bottom-24 right-20 h-40 w-40 rounded-full bg-white/5" />

            <div className="relative max-w-3xl">
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                Government Innovation Workflow
              </span>

              <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
                Projects & Solution Pipeline
              </h1>

              <p className="mt-3 text-sm leading-6 text-teal-50 sm:text-base">
                Monitor how citizen challenges move from AI analysis and
                university matching to solution development, pilot validation
                and real-world impact.
              </p>
            </div>
          </section>

          {/* PIPELINE */}

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Innovation Pipeline
                </h2>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                  Track the complete journey from a validated citizen
                  challenge to university-led solution development and
                  deployment.
                </p>
              </div>

              <button
                onClick={() => setSelectedStage("All")}
                className={`w-fit rounded-xl px-4 py-2 text-xs font-bold transition ${
                  selectedStage === "All"
                    ? "bg-teal-600 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                All Projects
              </button>
            </div>

            {/* STAGE CARDS */}

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              {solutionStages.map((stage, index) => {
                const count = solutions.filter(
                  (solution) => solution.currentStage === stage.id
                ).length;

                const isSelected = selectedStage === stage.id;

                return (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedStage(stage.id)}
                    className={`rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-teal-400 bg-teal-50 shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:border-teal-200 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          isSelected
                            ? "bg-teal-600 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
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

          {/* SUMMARY STATS */}

          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<Activity size={18} />}
              label="Total Projects"
              value={solutions.length}
            />

            <StatCard
              icon={<University size={18} />}
              label="University-led"
              value={
                new Set(solutions.map((solution) => solution.university))
                  .size
              }
            />

            <StatCard
              icon={<Rocket size={18} />}
              label="In Development"
              value={
                solutions.filter(
                  (solution) =>
                    solution.currentStage === "Project In Progress"
                ).length
              }
            />

            <StatCard
              icon={<Target size={18} />}
              label="Deployment Ready"
              value={
                solutions.filter(
                  (solution) =>
                    solution.currentStage === "Impact / Deployment"
                ).length
              }
            />
          </section>

          {/* CURRENT FILTER */}

          <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Project Tracking
                </h2>

                {selectedStage !== "All" && (
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-[10px] font-bold text-teal-700">
                    {selectedStage}
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-slate-500">
                {filteredSolutions.length} project
                {filteredSolutions.length !== 1 ? "s" : ""} currently shown.
              </p>
            </div>

            {selectedStage !== "All" && (
              <button
                onClick={() => setSelectedStage("All")}
                className="w-fit rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Clear Filter
              </button>
            )}
          </section>

          {/* PROJECT CARDS */}

          <section className="mt-6 grid gap-5 lg:grid-cols-2">
            {filteredSolutions.map((solution) => {
              const problem = problems.find(
                (item) => item.id === solution.problemId
              );

              return (
                <article
                  key={solution.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="p-5 sm:p-6">
                    {/* CARD HEADER */}

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-teal-700">
                            {solution.id}
                          </span>

                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                            {solution.category}
                          </span>
                        </div>

                        <h2 className="mt-3 text-lg font-bold leading-6 text-slate-900">
                          {solution.solutionTitle}
                        </h2>

                        <p className="mt-2 text-sm font-semibold text-slate-700">
                          {solution.problemTitle}
                        </p>

                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                          <MapPin size={14} />
                          {solution.location}
                        </div>
                      </div>

                      <span className="w-fit shrink-0 rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-bold text-teal-700">
                        {solution.currentStage}
                      </span>
                    </div>

                    {/* PROGRESS */}

                    <div className="mt-6 rounded-xl bg-slate-50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">
                          Project Progress
                        </span>

                        <span className="text-sm font-bold text-teal-700">
                          {solution.progress}%
                        </span>
                      </div>

                      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-teal-600 transition-all"
                          style={{
                            width: `${solution.progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* INFORMATION */}

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <InfoCard
                        icon={<University size={15} />}
                        title="University"
                        value={solution.university}
                      />

                      <InfoCard
                        icon={<FileSearch size={15} />}
                        title="Problem ID"
                        value={solution.problemId}
                      />

                      <InfoCard
                        icon={<Users size={15} />}
                        title="Support Required"
                        value={solution.supportRequired}
                      />

                      <InfoCard
                        icon={<Sparkles size={15} />}
                        title="Current Stage"
                        value={solution.currentStage}
                      />
                    </div>

                    {/* DESCRIPTION */}

                    <div className="mt-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Solution / Project Description
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {solution.description}
                      </p>
                    </div>

                    {/* IMPACT */}

                    <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50 p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          size={17}
                          className="text-teal-700"
                        />

                        <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                          Expected Impact
                        </p>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {solution.impact}
                      </p>
                    </div>
                  </div>

                  {/* LINKED PROBLEM */}

                  {problem && (
                    <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Linked Citizen Challenge
                          </p>

                          <p className="mt-1 text-xs font-semibold text-slate-700">
                            {problem.id} • {problem.title}
                          </p>
                        </div>

                        <a
                          href={`/government/problems/${problem.id}`}
                          className="inline-flex w-fit items-center gap-2 text-xs font-bold text-teal-700 transition hover:text-teal-800"
                        >
                          View Problem
                          <ArrowRight size={15} />
                        </a>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </section>

          {/* EMPTY STATE */}

          {filteredSolutions.length === 0 && (
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Lightbulb size={22} />
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                No projects in this stage
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Try selecting another pipeline stage.
              </p>

              <button
                onClick={() => setSelectedStage("All")}
                className="mt-4 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-teal-700"
              >
                Show All Projects
              </button>
            </section>
          )}

          {/* WORKFLOW EXPLANATION */}

          <section className="mt-6 rounded-2xl border border-teal-100 bg-teal-50 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-2 text-teal-700 shadow-sm">
                <Sparkles size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-teal-900">
                  How SamadhanX Moves a Challenge Forward
                </h2>

                <p className="mt-1 text-xs leading-5 text-teal-800">
                  Government monitors the innovation journey while universities
                  and other stakeholders work on the actual solution.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {solutionStages.map((stage, index) => (
                <div
                  key={stage.id}
                  className="rounded-xl border border-teal-100 bg-white p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                      {index + 1}
                    </span>

                    <p className="text-sm font-bold text-teal-900">
                      {stage.label}
                    </p>
                  </div>

                  <p className="mt-3 text-[11px] leading-5 text-teal-800">
                    {stage.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* GOVERNMENT ROLE */}

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Government Monitoring Role
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Government acts as the monitoring and coordination layer across
              the innovation lifecycle.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <RoleCard
                icon={<FileSearch size={17} />}
                title="Review"
                description="Review validated citizen challenges and AI-generated intelligence."
              />

              <RoleCard
                icon={<University size={17} />}
                title="Route"
                description="Route suitable challenges toward recommended universities."
              />

              <RoleCard
                icon={<Activity size={17} />}
                title="Monitor"
                description="Track solution development, projects and field validation."
              />

              <RoleCard
                icon={<Target size={17} />}
                title="Measure Impact"
                description="Monitor deployment outcomes and measurable public impact."
              />
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}

      <footer className="mt-10 w-full bg-slate-950 text-slate-300">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {/* BRAND */}

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white">
                  <Lightbulb size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white">
                    SamadhanX
                  </h2>

                  <p className="text-[10px] text-slate-400">
                    Ideas → Connect → Impact
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-sm text-xs leading-5 text-slate-400">
                Connecting citizens, government, universities and industry to
                transform real-world challenges into meaningful solutions.
              </p>
            </div>

            {/* PLATFORM */}

            <div>
              <h3 className="text-sm font-bold text-white">
                Platform
              </h3>

              <div className="mt-4 space-y-2.5 text-xs text-slate-400">
                <p className="transition hover:text-teal-400">
                  Citizen Challenges
                </p>

                <p className="transition hover:text-teal-400">
                  University Solutions
                </p>

                <p className="transition hover:text-teal-400">
                  Government Monitoring
                </p>

                <p className="transition hover:text-teal-400">
                  Industry Collaboration
                </p>
              </div>
            </div>

            {/* WORKFLOW */}

            <div>
              <h3 className="text-sm font-bold text-white">
                Innovation Journey
              </h3>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-800 px-3 py-1.5 text-[10px] font-semibold text-slate-300">
                  Ideas
                </span>

                <ArrowRight size={13} className="text-teal-500" />

                <span className="rounded-full bg-slate-800 px-3 py-1.5 text-[10px] font-semibold text-slate-300">
                  Connect
                </span>

                <ArrowRight size={13} className="text-teal-500" />

                <span className="rounded-full bg-slate-800 px-3 py-1.5 text-[10px] font-semibold text-slate-300">
                  Solutions
                </span>

                <ArrowRight size={13} className="text-teal-500" />

                <span className="rounded-full bg-slate-800 px-3 py-1.5 text-[10px] font-semibold text-slate-300">
                  Impact
                </span>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-400">
                From identifying a challenge to validating and deploying a
                solution in the real world.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-5">
            <div className="flex flex-col gap-2 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} SamadhanX. All rights reserved.
              </p>

              <p>
                Ideas → Connect → Impact
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* STAT CARD */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          {icon}
        </div>

        <span className="text-2xl font-bold text-slate-900">
          {value}
        </span>
      </div>

      <p className="mt-4 text-xs font-semibold text-slate-500">
        {label}
      </p>
    </div>
  );
}

/* INFO CARD */

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <p className="text-[9px] font-bold uppercase tracking-wide">
          {title}
        </p>
      </div>

      <p className="mt-2 text-xs font-semibold leading-5 text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* ROLE CARD */

function RoleCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-teal-700">
        {icon}

        <h3 className="text-sm font-bold text-slate-800">
          {title}
        </h3>
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

