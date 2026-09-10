"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Users,
  Building2,
  Sparkles,
  University,
  Route,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  problems,
  matchedUniversities,
  type Problem,
} from "@/lib/mockData";

export default function GovernmentProblemDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [showAllUniversities, setShowAllUniversities] = useState(false);
  const [routeSent, setRouteSent] = useState(false);

  const problemId = params.id as string;

  const problem = useMemo<Problem | undefined>(() => {
    return problems.find((item) => item.id === problemId);
  }, [problemId]);

  if (!problem) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
          >
            <ArrowLeft size={18} />
            Back to Problems
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-xl font-bold text-slate-900">
              Problem Not Found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              The requested problem could not be found.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const visibleUniversities = showAllUniversities
    ? matchedUniversities
    : matchedUniversities.slice(0, 2);

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">

        {/* BACK */}
        <button
          onClick={() => router.back()}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
        >
          <ArrowLeft size={18} />
          Back to Problems
        </button>

        {/* HEADER */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">

            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">

                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                  {problem.id}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {problem.category}
                </span>

                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                  {problem.priority} Priority
                </span>

              </div>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {problem.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">

                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} />
                  {problem.location}, {problem.district}
                </span>

                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={16} />
                  Reported {problem.reportedAt}
                </span>

              </div>
            </div>

            <div className="w-fit rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
              {problem.status}
            </div>

          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* LEFT / MAIN */}
          <div className="space-y-6 lg:col-span-2">

            {/* PROBLEM DETAILS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                  <FileSearch size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Problem Description
                  </h2>

                  <p className="text-sm text-slate-500">
                    Details submitted and validated for government review.
                  </p>
                </div>
              </div>

              <p className="mt-5 leading-7 text-slate-600">
                {problem.description}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <MapPin size={16} />
                    Location
                  </div>

                  <p className="mt-2 font-semibold text-slate-800">
                    {problem.location}, {problem.district}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <Building2 size={16} />
                    Department
                  </div>

                  <p className="mt-2 font-semibold text-slate-800">
                    {problem.department}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <Users size={16} />
                    Citizen Reports
                  </div>

                  <p className="mt-2 font-semibold text-slate-800">
                    {problem.citizenReports}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <AlertTriangle size={16} />
                    Priority
                  </div>

                  <p className="mt-2 font-semibold text-slate-800">
                    {problem.priority}
                  </p>
                </div>

              </div>
            </section>

            {/* AI ANALYSIS */}
            <section className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">

              <div className="flex items-start gap-3">

                <div className="rounded-xl bg-teal-50 p-2 text-teal-700">
                  <Sparkles size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    AI Intelligence
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    AI-generated insights to support government evaluation
                    and institutional routing.
                  </p>
                </div>

              </div>

              {/* SUMMARY */}
              <div className="mt-6 rounded-xl bg-slate-50 p-5">

                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  AI Summary
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  This problem has been identified as a significant local
                  issue requiring coordinated intervention and relevant
                  institutional expertise.
                </p>

              </div>

              {/* INSIGHTS */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold text-slate-500">
                    Root Cause
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    Infrastructure and service delivery gap
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold text-slate-500">
                    Affected People
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    Local residents and surrounding communities
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold text-slate-500">
                    Recommended Domain
                  </p>

                  <p className="mt-2 text-sm font-semibold text-teal-700">
                    {problem.category}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold text-slate-500">
                    AI Priority
                  </p>

                  <p className="mt-2 text-sm font-semibold text-red-600">
                    {problem.priority}
                  </p>
                </div>

              </div>

              {/* SIMILAR PROBLEMS */}
              <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50/50 p-5">

                <div className="flex items-center gap-2">
                  <AlertTriangle
                    size={17}
                    className="text-amber-700"
                  />

                  <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                    Similar / Duplicate Problems
                  </p>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  AI can identify similar problems reported in nearby
                  districts and help government avoid duplicate intervention.
                </p>

              </div>

            </section>

            {/* UNIVERSITY MATCHING */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-3">

                  <div className="rounded-xl bg-teal-50 p-2 text-teal-700">
                    <University size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      AI Recommended Universities
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Institutions recommended based on expertise,
                      disciplines and capabilities.
                    </p>
                  </div>

                </div>

                <span className="hidden rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 sm:block">
                  {matchedUniversities.length} Matches
                </span>

              </div>

              <div className="mt-5 space-y-4">

                {visibleUniversities.map((university) => (
                  <div
                    key={university.id}
                    className="rounded-xl border border-slate-200 p-5 transition hover:border-teal-200 hover:shadow-sm"
                  >

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                      <div>
                        <h3 className="font-bold text-slate-900">
                          {university.name}
                        </h3>

                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                          <MapPin size={15} />
                          {university.location}
                        </div>
                      </div>

                      <div className="w-fit rounded-full bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700">
                        {university.matchScore}% Match
                      </div>

                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Relevant Expertise
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {university.expertise}
                      </p>
                    </div>

                    <div className="mt-4 rounded-lg bg-slate-50 p-3">

                      <p className="text-xs font-bold text-slate-500">
                        Why this university?
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {university.reason}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

              {matchedUniversities.length > 2 && (
                <button
                  onClick={() =>
                    setShowAllUniversities((current) => !current)
                  }
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-800"
                >
                  {showAllUniversities ? (
                    <>
                      Show Less
                      <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      View All Matches
                      <ChevronDown size={16} />
                    </>
                  )}
                </button>
              )}

            </section>

          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-6">

            {/* GOVERNMENT ACTIONS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-teal-50 p-2 text-teal-700">
                  <Route size={20} />
                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  Government Action
                </h2>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Review the AI recommendations and route this validated
                challenge to suitable institutions.
              </p>

              {!routeSent ? (
                <button
                  onClick={() => setRouteSent(true)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
                >
                  <Route size={18} />
                  Route to Universities
                </button>
              ) : (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={19}
                      className="text-emerald-600"
                    />

                    <p className="text-sm font-bold text-emerald-700">
                      Problem Routed
                    </p>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-emerald-700">
                    The challenge has been routed to the recommended
                    university network for institutional review.
                  </p>

                </div>
              )}

            </section>

            {/* WORKFLOW */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-bold text-slate-900">
                Innovation Workflow
              </h2>

              <div className="mt-5 space-y-4">

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-teal-50 p-1.5 text-teal-700">
                    <CheckCircle2 size={15} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Problem Submitted
                    </p>

                    <p className="text-xs text-slate-500">
                      Citizen challenge received
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-teal-50 p-1.5 text-teal-700">
                    <Sparkles size={15} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      AI Analysis
                    </p>

                    <p className="text-xs text-slate-500">
                      Category, priority and insights generated
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-teal-50 p-1.5 text-teal-700">
                    <University size={15} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      University Routing
                    </p>

                    <p className="text-xs text-slate-500">
                      Suitable institutions identified
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-slate-100 p-1.5 text-slate-500">
                    <Lightbulb size={15} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Solution Proposal
                    </p>

                    <p className="text-xs text-slate-500">
                      University develops the solution
                    </p>
                  </div>
                </div>

              </div>

            </section>

            {/* STATUS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-bold text-slate-900">
                Current Status
              </h2>

              <div className="mt-4 rounded-xl bg-slate-50 p-4">

                <p className="text-xs font-semibold text-slate-500">
                  Problem Status
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {problem.status}
                </p>

              </div>

              <div className="mt-3 rounded-xl bg-slate-50 p-4">

                <p className="text-xs font-semibold text-slate-500">
                  Department
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {problem.department}
                </p>

              </div>

            </section>

          </aside>

        </div>
      </div>
    </main>
  );
}