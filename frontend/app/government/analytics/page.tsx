"use client";

import {
  Activity,
  AlertCircle,
  BarChart3,
  Building2,
  CheckCircle2,
  CircleDot,
  MapPinned,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { problems } from "@/lib/mockData";

const districtData = [
  { name: "Ranchi", problems: 18, critical: 4, resolved: 9 },
  { name: "Jamshedpur", problems: 14, critical: 3, resolved: 7 },
  { name: "Dhanbad", problems: 12, critical: 4, resolved: 5 },
  { name: "Bokaro", problems: 9, critical: 2, resolved: 5 },
  { name: "Hazaribagh", problems: 7, critical: 1, resolved: 4 },
  { name: "Deoghar", problems: 6, critical: 1, resolved: 3 },
];

const categoryData = [
  { name: "Roads", count: 28 },
  { name: "Water", count: 21 },
  { name: "Electricity", count: 17 },
  { name: "Sanitation", count: 12 },
];

const severityData = [
  { name: "Critical", count: 14, icon: AlertCircle },
  { name: "High", count: 22, icon: CircleDot },
  { name: "Medium", count: 31, icon: Activity },
  { name: "Resolved", count: 35, icon: CheckCircle2 },
];

const projectData = [
  {
    label: "Projects",
    value: 12,
    description: "University-led projects",
  },
  {
    label: "In Progress",
    value: 7,
    description: "Solutions under development",
  },
  {
    label: "Pilot",
    value: 3,
    description: "Field validation projects",
  },
  {
    label: "Deployed",
    value: 2,
    description: "Solutions deployed",
  },
];

export default function GovernmentAnalyticsPage() {
  const totalProblems = problems.length;

  const criticalProblems = problems.filter(
    (problem) => problem.status === "Critical"
  ).length;

  const resolvedProblems = problems.filter(
    (problem) => problem.status === "Resolved"
  ).length;

  const resolutionRate =
    totalProblems > 0
      ? Math.round((resolvedProblems / totalProblems) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-[#f6f9f9]">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8">

        <section className="relative overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 text-white shadow-sm">

          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative px-6 py-7 sm:px-8 sm:py-8">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              {/* LEFT */}

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                  <BarChart3 size={24} />
                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <Sparkles
                      size={13}
                      className="text-teal-100"
                    />

                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-100">
                      Government Intelligence
                    </p>

                  </div>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                    Analytics & Impact
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-teal-50">
                    Monitor problem trends, district priorities,
                    solution progress and measurable impact across
                    Jharkhand.
                  </p>

                </div>

              </div>

              {/* RIGHT SUMMARY */}

              <div className="grid shrink-0 grid-cols-2 gap-3">

                <div className="min-w-[135px] rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">

                  <p className="text-[10px] font-bold uppercase tracking-wide text-teal-100">
                    Total Problems
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {totalProblems}
                  </p>

                  <p className="mt-1 text-[10px] text-teal-100">
                    Citizen challenges
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
                    {criticalProblems}
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
          CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">

        {/* =====================================================
            TOP STATS
        ===================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={AlertCircle}
            label="Critical Problems"
            value={criticalProblems}
            description="Need immediate attention"
            iconClass="text-red-600"
            bgClass="bg-red-50"
          />

          <StatCard
            icon={CheckCircle2}
            label="Resolved"
            value={resolvedProblems}
            description="Problems marked resolved"
            iconClass="text-emerald-600"
            bgClass="bg-emerald-50"
          />

          <StatCard
            icon={TrendingUp}
            label="Resolution Rate"
            value={`${resolutionRate}%`}
            description="Overall resolution progress"
            iconClass="text-teal-700"
            bgClass="bg-teal-50"
          />

          <StatCard
            icon={Building2}
            label="Active Projects"
            value={12}
            description="University-led initiatives"
            iconClass="text-blue-600"
            bgClass="bg-blue-50"
          />

        </section>

        {/* =====================================================
            DISTRICT + CATEGORY
        ===================================================== */}

        <section className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* DISTRICT */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <MapPinned size={20} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    District-wise Problems
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Problem concentration across major districts.
                  </p>
                </div>

              </div>

            </div>

            <div className="space-y-4 p-5">

              {districtData.map((district) => {

                const percentage = Math.min(
                  (district.problems / 20) * 100,
                  100
                );

                return (
                  <div key={district.name}>

                    <div className="flex items-center justify-between">

                      <p className="text-xs font-bold text-slate-700">
                        {district.name}
                      </p>

                      <p className="text-[10px] font-semibold text-slate-400">
                        {district.problems} problems
                      </p>

                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="h-full rounded-full bg-teal-600"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                    <div className="mt-2 flex justify-between text-[10px]">

                      <span className="text-red-600">
                        {district.critical} critical
                      </span>

                      <span className="text-emerald-600">
                        {district.resolved} resolved
                      </span>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

          {/* CATEGORY */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                  <Target size={20} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Category-wise Problems
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Identify the most common service categories.
                  </p>
                </div>

              </div>

            </div>

            <div className="space-y-5 p-5">

              {categoryData.map((category) => {

                const maxCount = 30;

                const percentage =
                  (category.count / maxCount) * 100;

                return (
                  <div key={category.name}>

                    <div className="flex items-center justify-between">

                      <p className="text-xs font-bold text-slate-700">
                        {category.name}
                      </p>

                      <p className="text-xs font-bold text-slate-900">
                        {category.count}
                      </p>

                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="h-full rounded-full bg-cyan-600"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </section>

        {/* =====================================================
            SEVERITY
        ===================================================== */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5">

            <h2 className="text-base font-bold text-slate-900">
              Severity & Resolution
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Understand current problem priority and resolution status.
            </p>

          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">

            {severityData.map((item) => {

              const Icon = item.icon;

              const isCritical =
                item.name === "Critical";

              const isResolved =
                item.name === "Resolved";

              return (
                <div
                  key={item.name}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >

                  <div className="flex items-center justify-between">

                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        isCritical
                          ? "bg-red-50 text-red-600"
                          : isResolved
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-teal-50 text-teal-700"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <span className="text-2xl font-bold text-slate-900">
                      {item.count}
                    </span>

                  </div>

                  <p className="mt-4 text-xs font-bold text-slate-700">
                    {item.name}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Reported cases
                  </p>

                </div>
              );
            })}

          </div>

        </section>

        {/* =====================================================
            PROJECT IMPACT
        ===================================================== */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Building2 size={20} />
              </div>

              <div>

                <h2 className="text-base font-bold text-slate-900">
                  Solution & Project Impact
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Track how validated solutions are moving toward deployment.
                </p>

              </div>

            </div>

          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">

            {projectData.map((item) => (

              <div
                key={item.label}
                className="rounded-xl border border-slate-200 p-4"
              >

                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  {item.label}
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {item.value}
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  {item.description}
                </p>

              </div>

            ))}

          </div>

        </section>

        {/* =====================================================
            GOVERNMENT INSIGHT
        ===================================================== */}

        <section className="mt-6 rounded-2xl border border-teal-100 bg-teal-50 p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
              <Sparkles size={20} />
            </div>

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-700">
                Government Decision Support
              </p>

              <h2 className="mt-1 text-base font-bold text-slate-900">
                Prioritize → Route → Monitor → Measure Impact
              </h2>

              <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-600">
                Use district trends and severity patterns to prioritize
                validated challenges, route them to suitable universities,
                monitor solution projects and evaluate measurable outcomes.
              </p>

            </div>

          </div>

        </section>

        {/* FOOTER */}

        <footer className="mt-8 border-t border-slate-200 py-4 text-center text-[11px] text-slate-400">
  © 2026 SamadhanX • Ideas → Action → Impact
</footer>

      </div>

    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  iconClass,
  bgClass,
}: {
  icon: typeof AlertCircle;
  label: string;
  value: string | number;
  description: string;
  iconClass: string;
  bgClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-[10px] text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${bgClass} ${iconClass}`}
        >
          <Icon size={20} />
        </div>

      </div>

    </div>
  );
}