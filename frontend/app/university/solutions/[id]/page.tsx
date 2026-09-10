
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  DollarSign,
  FlaskConical,
  Handshake,
  Lightbulb,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

type SolutionDetail = {
  id: number;
  title: string;
  status: string;
  statusType: "ready" | "development" | "idea";
  problem: string;
  progress: number;
  cost: string;
  team: string;
  impact: string;
  description: string;
  prototype: string;
  howItWorks: string[];
  features: string[];
  solution: string;
};

const solutions: SolutionDetail[] = [
  {
    id: 1,
    title: "Smart Water Monitoring System",
    status: "Prototype Ready",
    statusType: "ready",
    problem: "Unreliable Water Supply in Local Community",
    progress: 70,
    cost: "₹1.8 Lakhs",
    team: "6 Members",
    impact: "400+ people",
    description:
      "An IoT-based monitoring system designed to track water availability, usage and supply patterns in real time and help local authorities identify supply issues faster.",
    prototype:
      "The prototype combines water-level and quality sensors with a monitoring dashboard. It collects readings from local water points and presents the information in an easy-to-understand format.",
    howItWorks: [
      "Sensors collect water availability and quality readings.",
      "The system sends readings to the monitoring platform.",
      "The dashboard identifies abnormal readings or supply interruptions.",
      "Authorities and community members can use the information to respond to local water issues.",
    ],
    features: [
      "Real-time water monitoring",
      "Water quality and level tracking",
      "Supply interruption alerts",
      "Monitoring dashboard",
      "Historical reading analysis",
    ],
    solution:
      "The system provides timely information about local water conditions so that supply problems can be identified earlier and maintenance decisions can be made using actual field data.",
  },
  {
    id: 2,
    title: "AI-Based Waste Collection",
    status: "Under Development",
    statusType: "development",
    problem: "Poor Sanitation and Waste Management",
    progress: 45,
    cost: "₹2.2 Lakhs",
    team: "5 Members",
    impact: "300+ people",
    description:
      "An intelligent waste collection solution that uses data and AI to improve collection planning, identify recurring waste hotspots and reduce unmanaged waste.",
    prototype:
      "The prototype uses collection records and location-based waste information to identify areas that need more frequent collection and helps create better collection schedules.",
    howItWorks: [
      "Waste collection data is collected from different locations.",
      "The system identifies recurring waste accumulation patterns.",
      "AI-assisted analysis highlights priority collection areas.",
      "Collection teams can use the generated priorities to plan routes and schedules.",
    ],
    features: [
      "Waste hotspot identification",
      "Collection priority scoring",
      "Data-based route planning",
      "Recurring issue detection",
      "Collection monitoring dashboard",
    ],
    solution:
      "Instead of following a fixed collection schedule everywhere, the solution helps prioritize locations based on actual waste patterns and recurring sanitation problems.",
  },
  {
    id: 3,
    title: "Digital Farmer Support Platform",
    status: "Idea Submitted",
    statusType: "idea",
    problem: "Challenges Faced by Local Farmers",
    progress: 20,
    cost: "₹1.2 Lakhs",
    team: "4 Members",
    impact: "250+ farmers",
    description:
      "A digital platform connecting local farmers with useful information, resources, experts and support services.",
    prototype:
      "The initial prototype is a lightweight farmer support interface where users can discover relevant agricultural information, available resources and expert guidance.",
    howItWorks: [
      "Farmers select their requirement or agricultural concern.",
      "The platform identifies relevant information and available support.",
      "Farmers can discover experts, resources and useful guidance.",
      "The platform can track follow-up support for recurring requirements.",
    ],
    features: [
      "Farmer support dashboard",
      "Expert discovery",
      "Agricultural information",
      "Resource directory",
      "Support request tracking",
    ],
    solution:
      "The platform brings fragmented agricultural information and support services into one accessible interface so farmers can find relevant guidance more easily.",
  },
];

export default function UniversitySolutionDetailPage() {
  const params = useParams();

  const [realityCheckRunning, setRealityCheckRunning] = useState(false);
  const [realityCheckStarted, setRealityCheckStarted] = useState(false);
  const [showImprovements, setShowImprovements] = useState(false);

  const solutionId = Number(params.id);

  const solution =
    solutions.find((item) => item.id === solutionId) ?? solutions[0];

  const handleRealityCheck = () => {
    setRealityCheckRunning(true);

    setTimeout(() => {
      setRealityCheckRunning(false);
      setRealityCheckStarted(true);
      setShowImprovements(false);
    }, 1400);
  };

  const handleImproveSolution = () => {
    setShowImprovements(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* ================= NAVBAR ================= */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/university/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">
              S
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                SamadhanX
              </h1>

              <p className="text-xs text-slate-500">
                Ideas → Action → Impact
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/university/dashboard"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Dashboard
            </Link>

            <Link
              href="/university/problems"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Problems
            </Link>

            <Link
              href="/university/projects"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Projects
            </Link>

            <Link
              href="/university/solutions"
              className="text-sm font-semibold text-teal-600"
            >
              Solutions
            </Link>

            <Link
              href="/university/teams"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Teams
            </Link>

            <Link
              href="/university/profile"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <Link
          href="/university/solutions"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Solutions
        </Link>

        {/* ================= HEADER ================= */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 px-7 py-8 text-white md:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      solution.statusType === "ready"
                        ? "bg-emerald-100 text-emerald-800"
                        : solution.statusType === "development"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-white/15 text-teal-50"
                    }`}
                  >
                    {solution.status}
                  </span>

                  <span className="text-xs font-medium text-teal-100">
                    Solution #{solution.id}
                  </span>
                </div>

                <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                  {solution.title}
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-teal-50 md:text-base">
                  {solution.description}
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm lg:w-64">
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-100">
                  Prototype Progress
                </p>

                <p className="mt-2 text-4xl font-bold">
                  {solution.progress}%
                </p>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${solution.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid border-t border-slate-200 sm:grid-cols-3">
            <div className="border-b border-slate-200 p-5 sm:border-b-0 sm:border-r">
              <div className="flex items-center gap-2 text-slate-500">
                <DollarSign className="h-4 w-4 text-teal-600" />
                <span className="text-xs font-medium">Estimated Cost</span>
              </div>

              <p className="mt-2 font-bold text-slate-900">
                {solution.cost}
              </p>
            </div>

            <div className="border-b border-slate-200 p-5 sm:border-b-0 sm:border-r">
              <div className="flex items-center gap-2 text-slate-500">
                <Users className="h-4 w-4 text-teal-600" />
                <span className="text-xs font-medium">Team</span>
              </div>

              <p className="mt-2 font-bold text-slate-900">
                {solution.team}
              </p>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 text-slate-500">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-medium">
                  Expected Impact
                </span>
              </div>

              <p className="mt-2 font-bold text-slate-900">
                {solution.impact}
              </p>
            </div>
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <div className="mt-7 grid gap-7 lg:grid-cols-[1fr_360px]">
          {/* ================= LEFT ================= */}
          <div className="space-y-7">
            {/* Problem */}
            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                  <MapPin className="h-5 w-5 text-amber-600" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Community Problem
                  </h3>

                  <p className="text-sm text-slate-500">
                    The challenge this solution is designed to address.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-5">
                <p className="text-sm font-bold text-slate-900">
                  {solution.problem}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The solution is being developed around this community
                  challenge and aims to provide a practical, measurable
                  intervention.
                </p>
              </div>
            </section>

            {/* Prototype */}
            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                  <FlaskConical className="h-5 w-5 text-teal-600" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    What the Prototype Does
                  </h3>

                  <p className="text-sm text-slate-500">
                    How the proposed solution works in practice.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-6">
                <p className="text-sm leading-7 text-slate-600">
                  {solution.prototype}
                </p>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-bold text-slate-900">
                  How It Works
                </h4>

                <div className="mt-4 space-y-3">
                  {solution.howItWorks.map((step, index) => (
                    <div
                      key={step}
                      className="flex gap-4 rounded-xl border border-slate-100 bg-white p-4"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
                        {index + 1}
                      </div>

                      <p className="pt-1 text-sm leading-6 text-slate-600">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <Zap className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Key Features
                  </h3>

                  <p className="text-sm text-slate-500">
                    Core capabilities planned for the solution.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {solution.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600" />

                    <span className="text-sm font-medium text-slate-700">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Solution */}
            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
                  <Lightbulb className="h-5 w-5 text-sky-600" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    How This Solution Solves the Problem
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                {solution.solution}
              </p>
            </section>
          </div>

          {/* ================= RIGHT SIDEBAR ================= */}
          <aside className="space-y-6">
            {/* ================= REALITYCHECK ================= */}
            <section className="overflow-hidden rounded-2xl border border-teal-200 bg-white shadow-sm">
              <div className="bg-gradient-to-br from-teal-700 to-emerald-700 p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                    <Sparkles className="h-6 w-6" />
                  </div>

                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold">
                    AI Powered
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-bold">
                  AI RealityCheck
                </h3>

                <p className="mt-2 text-sm leading-6 text-teal-50">
                  Test whether this solution can work in the real world.
                </p>
              </div>

              <div className="p-6">
                {!realityCheckStarted ? (
                  <>
                    <div className="rounded-xl border border-teal-100 bg-teal-50 p-4">
                      <div className="flex gap-3">
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />

                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            Before building further
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-600">
                            AI will examine feasibility, possible failure
                            points, implementation risks and practical
                            constraints.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRealityCheck}
                      disabled={realityCheckRunning}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {realityCheckRunning ? (
                        <>
                          <Clock3 className="h-4 w-4 animate-pulse" />
                          Running RealityCheck...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Run RealityCheck
                        </>
                      )}
                    </button>

                    <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">
                      AI-generated indicative assessment — not a scientific
                      certification or guarantee.
                    </p>
                  </>
                ) : (
                  <>
                    {/* SCORE */}
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                            Feasibility Score
                          </p>

                          <div className="mt-2 flex items-end gap-2">
                            <span className="text-4xl font-bold text-slate-900">
                              84
                            </span>

                            <span className="pb-1 text-sm font-semibold text-slate-500">
                              /100
                            </span>
                          </div>
                        </div>

                        <ShieldCheck className="h-7 w-7 text-emerald-600" />
                      </div>

                      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-emerald-100">
                        <div className="h-full w-[84%] rounded-full bg-emerald-500" />
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm font-bold text-emerald-700">
                          Good Feasibility
                        </p>

                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                          MEDIUM RISK
                        </span>
                      </div>
                    </div>

                    {/* AI ASSESSMENT */}
                    <div className="mt-5">
                      <p className="text-sm font-bold text-slate-900">
                        AI Assessment
                      </p>

                      <div className="mt-3 rounded-xl bg-slate-50 p-4">
                        <p className="text-sm leading-6 text-slate-600">
                          The solution is technically feasible, but
                          deployment may face challenges related to power
                          availability, sensor maintenance and connectivity.
                        </p>
                      </div>
                    </div>

                    {/* RISKS */}
                    <div className="mt-6">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-amber-600" />

                        <p className="text-sm font-bold text-slate-900">
                          Key Risks
                        </p>
                      </div>

                      <div className="mt-3 space-y-3">
                        {/* Risk 1 */}
                        <div className="rounded-xl border border-slate-200 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-bold text-slate-900">
                              Power Dependency
                            </p>

                            <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
                              MEDIUM
                            </span>
                          </div>

                          <p className="mt-2 text-xs text-slate-500">
                            Impact:{" "}
                            <span className="font-semibold text-slate-700">
                              High
                            </span>
                          </p>

                          <div className="mt-3 rounded-lg bg-teal-50 p-3">
                            <p className="text-[11px] font-bold text-teal-700">
                              Mitigation
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-600">
                              Use solar backup and low-power operation.
                            </p>
                          </div>
                        </div>

                        {/* Risk 2 */}
                        <div className="rounded-xl border border-slate-200 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-bold text-slate-900">
                              Sensor Maintenance
                            </p>

                            <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
                              MEDIUM
                            </span>
                          </div>

                          <p className="mt-2 text-xs text-slate-500">
                            Impact:{" "}
                            <span className="font-semibold text-slate-700">
                              Medium
                            </span>
                          </p>

                          <div className="mt-3 rounded-lg bg-teal-50 p-3">
                            <p className="text-[11px] font-bold text-teal-700">
                              Mitigation
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-600">
                              Introduce periodic calibration and local
                              maintenance support.
                            </p>
                          </div>
                        </div>

                        {/* Risk 3 */}
                        <div className="rounded-xl border border-slate-200 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-bold text-slate-900">
                              Connectivity
                            </p>

                            <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600">
                              HIGH
                            </span>
                          </div>

                          <p className="mt-2 text-xs text-slate-500">
                            Impact:{" "}
                            <span className="font-semibold text-slate-700">
                              Medium
                            </span>
                          </p>

                          <div className="mt-3 rounded-lg bg-teal-50 p-3">
                            <p className="text-[11px] font-bold text-teal-700">
                              Mitigation
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-600">
                              Add offline data storage with periodic
                              synchronization.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* IMPROVE SOLUTION */}
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={handleImproveSolution}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-teal-300 bg-white px-5 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-50"
                      >
                        <Lightbulb className="h-4 w-4" />
                        Improve Solution
                      </button>

                      {showImprovements && (
                        <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 p-4">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-teal-700" />

                            <p className="text-sm font-bold text-slate-900">
                              AI suggests 3 improvements
                            </p>
                          </div>

                          <div className="mt-4 space-y-3">
                            <div className="flex gap-3">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />

                              <p className="text-xs leading-5 text-slate-600">
                                Add solar backup for reliable operation.
                              </p>
                            </div>

                            <div className="flex gap-3">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />

                              <p className="text-xs leading-5 text-slate-600">
                                Add offline data synchronization for weak
                                connectivity areas.
                              </p>
                            </div>

                            <div className="flex gap-3">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />

                              <p className="text-xs leading-5 text-slate-600">
                                Introduce a local sensor maintenance
                                protocol.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* RUN AGAIN */}
                    <button
                      type="button"
                      onClick={handleRealityCheck}
                      disabled={realityCheckRunning}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800 disabled:opacity-70"
                    >
                      <Sparkles className="h-4 w-4" />
                      {realityCheckRunning
                        ? "Running RealityCheck..."
                        : "Run RealityCheck Again"}
                    </button>

                    <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">
                      AI-generated indicative assessment — not a scientific
                      certification or guarantee.
                    </p>
                  </>
                )}
              </div>
            </section>

            {/* STATUS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900">
                Solution Status
              </h3>

              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3">
                  {solution.statusType === "ready" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Clock3 className="h-5 w-5 text-amber-500" />
                  )}

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {solution.status}
                    </p>

                    <p className="text-xs text-slate-500">
                      Current development stage
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Progress
                    </span>

                    <span className="text-xs font-bold text-teal-700">
                      {solution.progress}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-teal-600"
                      style={{ width: `${solution.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>
{/* ================= INDUSTRY SUPPORT ================= */}
<section className="rounded-2xl border border-teal-200 bg-white p-6 shadow-sm">
  <div className="flex items-start gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
      <Handshake className="h-5 w-5 text-teal-700" />
    </div>

    <div>
      <h3 className="text-lg font-bold text-slate-900">
        Industry Support
      </h3>

      <p className="mt-1 text-sm leading-5 text-slate-500">
        Industry partners can help take this solution from prototype
        development to real-world testing and deployment.
      </p>
    </div>
  </div>

  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs font-medium text-slate-500">
          Current Partner
        </p>

        <p className="mt-1 text-sm font-bold text-slate-900">
          ABC Technologies
        </p>
      </div>

      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
        Requested
      </span>
    </div>

    <div className="mt-4">
      <p className="text-xs font-medium text-slate-500">
        Support Requested
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
          Hardware
        </span>

        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
          Testing
        </span>

        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
          Funding
        </span>
      </div>
    </div>

    <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
      <div>
        <p className="text-xs font-medium text-slate-500">
          Requested Funding
        </p>

        <p className="mt-1 text-sm font-bold text-slate-900">
          ₹2.4 Lakhs
        </p>
      </div>

      <Link
        href="/university/projects/1/collaboration/COL-001"
        className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-teal-800"
      >
        View Collaboration
        <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
      </Link>
    </div>
  </div>

  <Link
    href="/university/industry"
    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-teal-300 px-4 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-50"
  >
    <Handshake className="h-4 w-4" />
    Find More Industry Partners
  </Link>
</section>
            {/* PROJECT CONNECTION */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900">
                Project Connection
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This solution can be developed further through the
                university project workspace and multidisciplinary team.
              </p>

              <Link
                href="/university/projects"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-teal-300 px-4 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-50"
              >
                View Projects
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </section>
          </aside>
        </div>

        {/* ================= DISCLAIMER ================= */}
        <div className="mt-7 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center shadow-sm">
          <p className="text-xs leading-5 text-slate-400">
            RealityCheck provides an AI-generated indicative assessment
            based on the available solution information. It is intended
            for decision support and does not represent scientific,
            engineering or field-validation certification.
          </p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="mt-12 bg-slate-950 px-6 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">
          <Link
            href="/university/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">
              S
            </div>

            <div>
              <p className="text-lg font-bold">
                SamadhanX
              </p>

              <p className="text-sm text-slate-400">
                Ideas → Action → Impact
              </p>
            </div>
          </Link>

          <p className="text-sm text-slate-400">
            © 2026 SamadhanX. Building solutions that matter.
          </p>

          <div className="flex gap-5 text-sm text-slate-400">
            <Link
              href="/university/problems"
              className="transition hover:text-white"
            >
              Problems
            </Link>

            <Link
              href="/help"
              className="transition hover:text-white"
            >
              Help
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

