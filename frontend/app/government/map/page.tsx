"use client";

import { useMemo, useState } from "react";
import { MapPinned, Sparkles, AlertCircle } from "lucide-react";

import {
  problems,
  type ProblemCategory,
} from "@/lib/mockData";

import JharkhandProblemMap from "@/components/JharkhandProblemMap";

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
    <main className="min-h-screen bg-[#f6f9f9]">

      {/* PAGE HEADER */}

      <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8">

        <section className="relative overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 text-white shadow-sm">

          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative px-6 py-7 sm:px-8 sm:py-8">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                  <MapPinned size={24} />
                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <Sparkles
                      size={13}
                      className="text-teal-100"
                    />

                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-100">
                      Geographic Intelligence
                    </p>

                  </div>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                    Jharkhand Problem Map
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-teal-50">
                    Monitor citizen problems, critical hotspots,
                    district-level patterns and solution deployments
                    across Jharkhand.
                  </p>

                </div>

              </div>

              <div className="grid shrink-0 grid-cols-2 gap-3">

                <div className="min-w-[135px] rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">

                  <p className="text-[10px] font-bold uppercase tracking-wide text-teal-100">
                    Problems
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {filteredProblems.length}
                  </p>

                  <p className="mt-1 text-[10px] text-teal-100">
                    Current view
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

                  <p className="mt-1 text-2xl font-bold">
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

      {/* MAP */}

      <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">

        <JharkhandProblemMap />

        {/* LOCATION SUMMARY */}

        {/* DISTRICT-WISE SUMMARY */}

<section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

  <div className="border-b border-slate-200 p-5">

    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-600">
        District Intelligence
      </p>

      <h2 className="mt-1 text-lg font-bold text-slate-900">
        District-wise Problem Summary
      </h2>

      <p className="mt-1 text-xs text-slate-500">
        Compare reported problems, critical cases and solution activity
        across districts.
      </p>
    </div>

  </div>

  <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">

    {[
      "Ranchi",
      "Jamshedpur",
      "Dhanbad",
      "Bokaro",
      "Hazaribagh",
      "Deoghar",
      "Dumka",
      "Giridih",
    ].map((district) => {

      const districtProblems = problems.filter(
        (problem) => problem.district === district
      );

      const districtCritical = districtProblems.filter(
        (problem) => problem.status === "Critical"
      ).length;

      const districtProjects = [
        "Ranchi",
        "Jamshedpur",
        "Dhanbad",
      ].includes(district)
        ? 1
        : 0;

      return (
        <div
          key={district}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-teal-200 hover:bg-white hover:shadow-sm"
        >

          <div className="flex items-start justify-between gap-3">

            <div>
              <p className="text-sm font-bold text-slate-900">
                {district}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Jharkhand
              </p>
            </div>

            <span className="rounded-lg bg-teal-50 px-2 py-1 text-[10px] font-bold text-teal-700">
              {districtProblems.length} Problems
            </span>

          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">

            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                Critical
              </p>

              <p className="mt-1 text-lg font-bold text-red-600">
                {districtCritical}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                Projects
              </p>

              <p className="mt-1 text-lg font-bold text-blue-600">
                {districtProjects}
              </p>
            </div>

          </div>

        </div>
      );
    })}

  </div>

</section>
        <footer className="mt-8 border-t border-slate-200 py-5 text-[10px] text-slate-400">
          SamadhanX • Geographic Problem Monitoring • Government Intelligence
        </footer>

      </div>

    </main>
  );
}

function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <p className="text-sm font-bold text-slate-800">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {text}
      </p>

    </div>
  );
}