"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Lightbulb,
  MapPin,
  Sparkles,
  Users,
  X,
} from "lucide-react";

export default function UniversityProblemDetails() {
  const [accepted, setAccepted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    setShowConfirm(false);
  };

  const handleUnaccept = () => {
    setAccepted(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= NAVBAR ================= */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <a
            href="/university/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">
              S
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                SamadhanX
              </h1>

              <p className="text-xs text-slate-500">
                Ideas → Action → Impact
              </p>
            </div>
          </a>

          {/* Right Navbar */}
          <div className="hidden items-center gap-7 md:flex">
            <a
              href="/university/dashboard"
              className="text-[15px] font-medium text-slate-600 transition hover:text-teal-600"
            >
              Dashboard
            </a>

            <a
              href="/university/problems"
              className="text-[15px] font-semibold text-teal-600"
            >
              Problems
            </a>

            <a
              href="/university/projects"
              className="text-[15px] font-medium text-slate-600 transition hover:text-teal-600"
            >
              Projects
            </a>

            <a
              href="/university/solutions"
              className="text-[15px] font-medium text-slate-600 transition hover:text-teal-600"
            >
              Solutions
            </a>

            <a
              href="/university/teams"
              className="text-[15px] font-medium text-slate-600 transition hover:text-teal-600"
            >
              Teams
            </a>

            <a
              href="/university/profile"
              className="text-[15px] font-medium text-slate-600 transition hover:text-teal-600"
            >
              Profile
            </a>
          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <section className="mx-auto max-w-7xl px-6 py-6">

        {/* Back */}
        <a
          href="/university/problems"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Problems
        </a>

        {/* ================= PROBLEM HEADER ================= */}
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-8">

          <div className="flex flex-wrap items-center gap-2">

            <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
              Water Management
            </span>

            <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
              High Severity
            </span>

            {accepted && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Accepted
              </span>
            )}
          </div>

          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            Unreliable Water Supply in Local Community
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-slate-500">

            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-teal-600" />
              Ranchi, Jharkhand
            </span>

            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-teal-600" />
              400+ people affected
            </span>

          </div>

          <p className="mt-6 max-w-5xl text-base leading-7 text-slate-600">
            Residents are experiencing difficulties due to irregular water
            supply and limited access to reliable water resources in the area.
            The challenge creates a direct impact on households, sanitation and
            daily community activities.
          </p>
        </div>

        {/* ================= TWO COLUMN ================= */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_330px]">

          {/* ================= LEFT ================= */}
          <div className="space-y-6">

            {/* ================= AI ANALYSIS ================= */}
            <div className="rounded-2xl border border-teal-300 bg-teal-200 p-6 shadow-sm">

              {/* Header */}
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Bot className="h-6 w-6 text-teal-700" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    AI Analysis
                  </p>

                  <h3 className="text-xl font-bold text-slate-900">
                    Understanding the Challenge
                  </h3>
                </div>

              </div>

              {/* AI Information */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                {/* AI Category */}
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                    AI Category
                  </p>

                  <p className="mt-2 font-semibold text-slate-900">
                    Water Management
                  </p>
                </div>

                {/* Severity */}
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                    Severity
                  </p>

                  <p className="mt-2 font-semibold text-red-600">
                    High
                  </p>
                </div>

                {/* Affected Sector */}
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                    Affected Sector
                  </p>

                  <p className="mt-2 font-semibold text-slate-900">
                    Water Resources
                  </p>
                </div>

                {/* Estimated Impact */}
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                    Estimated Impact
                  </p>

                  <p className="mt-2 font-semibold text-slate-900">
                    400+ people
                  </p>
                </div>

              </div>

              {/* Root Cause */}
              <div className="mt-4 rounded-xl bg-white p-5 shadow-sm">

                <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                  Root Cause
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Inconsistent water distribution, limited monitoring and
                  inadequate access to reliable local water infrastructure.
                </p>

              </div>

              {/* AI Summary */}
              <div className="mt-4 rounded-xl border border-teal-300 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-2">

                  <Sparkles className="h-5 w-5 text-teal-700" />

                  <p className="font-bold text-slate-900">
                    AI Summary
                  </p>

                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The problem could benefit from technology-based monitoring,
                  improved resource planning and community-level water
                  management solutions.
                </p>

              </div>

            </div>

            {/* ================= WHY AI RECOMMENDS ================= */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100">
                  <Lightbulb className="h-5 w-5 text-teal-700" />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                    AI Recommendation
                  </p>

                  <h3 className="text-xl font-bold">
                    Why AI Recommends This Problem
                  </h3>

                </div>

              </div>

              <div className="mt-5 rounded-xl border border-teal-200 bg-teal-100 p-5">

                <p className="text-sm leading-7 text-slate-700">
                  AI identifies this challenge as a strong opportunity for
                  university involvement because it combines a significant
                  community impact with areas such as environmental engineering,
                  water management, data monitoring and sustainable technology.
                </p>

              </div>

            </div>

            {/* ================= UNIVERSITY MATCH ================= */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                    University Match
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    Recommended Expertise
                  </h3>

                </div>

                <div className="rounded-xl bg-teal-100 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-teal-700">
                    94%
                  </p>

                  <p className="text-[11px] font-semibold text-slate-500">
                    Match
                  </p>
                </div>

              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">

                <div className="rounded-xl border border-teal-200 bg-teal-100 p-4">
                  <p className="text-xs font-semibold text-teal-800">
                    Water Resources
                  </p>
                </div>

                <div className="rounded-xl border border-teal-200 bg-teal-100 p-4">
                  <p className="text-xs font-semibold text-teal-800">
                    Environmental Engineering
                  </p>
                </div>

                <div className="rounded-xl border border-teal-200 bg-teal-100 p-4">
                  <p className="text-xs font-semibold text-teal-800">
                    Sustainable Technology
                  </p>
                </div>

              </div>

              <div className="mt-4 rounded-xl border border-teal-200 bg-teal-100 p-5">

                <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                  Why this match?
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  The university's academic and research capabilities align
                  closely with the technical requirements of this water
                  management challenge.
                </p>

              </div>

            </div>

            {/* ================= SIMILAR PROBLEMS ================= */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-2">

                <Sparkles className="h-5 w-5 text-teal-700" />

                <h3 className="text-xl font-bold">
                  Similar Problems
                </h3>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                Related community challenges that may offer useful insights.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">

                <a
                  href="/university/problems/7"
                  className="group rounded-xl border border-teal-200 bg-teal-100 p-5 transition hover:border-teal-400 hover:bg-teal-200"
                >

                  <p className="text-xs font-bold text-teal-700">
                    Sanitation
                  </p>

                  <h4 className="mt-2 font-bold text-slate-900 group-hover:text-teal-800">
                    Poor Sanitation and Waste Management
                  </h4>

                  <span className="mt-3 flex items-center gap-1 text-sm font-semibold text-teal-700">
                    View problem
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>

                </a>

                <a
                  href="/university/problems/9"
                  className="group rounded-xl border border-teal-200 bg-teal-100 p-5 transition hover:border-teal-400 hover:bg-teal-200"
                >

                  <p className="text-xs font-bold text-teal-700">
                    Agriculture
                  </p>

                  <h4 className="mt-2 font-bold text-slate-900 group-hover:text-teal-800">
                    Challenges Faced by Local Farmers
                  </h4>

                  <span className="mt-3 flex items-center gap-1 text-sm font-semibold text-teal-700">
                    View problem
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>

                </a>

              </div>

            </div>

          </div>

          {/* ================= RIGHT SIDEBAR ================= */}
          <aside className="space-y-6">

            {/* Problem Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h3 className="text-lg font-bold">
                Problem Status
              </h3>

              <div className="mt-4 rounded-xl bg-slate-100 p-4">

                <p className="text-xs font-medium text-slate-500">
                  Current Status
                </p>

                <p className="mt-1 font-bold text-amber-600">
                  Under Review
                </p>

              </div>

              {!accepted ? (
                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Accept Problem
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleUnaccept}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-100 px-4 py-3 text-sm font-semibold text-teal-800 transition hover:bg-red-100 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                  Unaccept Problem
                </button>
              )}

              <a
  href="/university/solutions"
  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-100 hover:text-teal-800"
>
  Propose a Solution
  <ArrowRight className="h-4 w-4" />
</a>

            </div>

            {/* Existing Solutions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-2">

                <Lightbulb className="h-5 w-5 text-teal-700" />

                <h3 className="text-lg font-bold">
                  Existing Solutions
                </h3>

              </div>

              <div className="mt-4 rounded-xl border border-teal-200 bg-teal-100 p-5 transition hover:border-teal-400 hover:bg-teal-200">

                <h4 className="font-bold text-slate-900">
                  Smart Water Monitoring
                </h4>

                <p className="mt-1 text-sm text-slate-600">
                  IoT-based water monitoring solution
                </p>

                <p className="mt-3 text-xs font-bold text-teal-700">
                  Prototype Ready
                </p>

              </div>

            </div>

          </aside>

        </div>

        {/* ================= BOTTOM CTA ================= */}
        <div className="mt-8 rounded-3xl bg-gradient-to-r from-teal-700 to-teal-600 p-7 text-white shadow-sm md:p-8">

          <p className="text-xs font-bold uppercase tracking-wider text-teal-100 md:text-sm">
            From Challenge to Solution
          </p>

          <div className="mt-2 flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>

              <h3 className="text-xl font-bold md:text-2xl">
                Have an idea to solve this problem?
              </h3>

              <p className="mt-2 text-sm text-teal-50">
                Bring together students, researchers and experts to build
                something that creates real community impact.
              </p>

            </div>

            <a
  href="/university/solutions"
  className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
>
  Propose a Solution
  <ArrowRight className="h-4 w-4" />
</a>

          </div>

        </div>

      </section>

      {/* ================= CONFIRMATION MODAL ================= */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-6 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
              <CheckCircle2 className="h-7 w-7 text-teal-700" />
            </div>

            <h3 className="mt-5 text-center text-xl font-bold">
              Are you sure?
            </h3>

            <p className="mt-3 text-center text-sm leading-6 text-slate-500">
              Do you want to accept{" "}
              <span className="font-semibold text-slate-800">
                Unreliable Water Supply in Local Community
              </span>{" "}
              and work towards developing a solution for this challenge?
            </p>

            <div className="mt-6 flex gap-3">

              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAccept}
                className="flex-1 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Yes, Accept
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="mt-12 bg-slate-950 px-6 py-8 text-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">

          {/* Logo */}
          <a
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

          </a>

          {/* Copyright */}
          <p className="text-sm text-slate-400">
            © 2026 SamadhanX. Building solutions that matter.
          </p>

          {/* Links */}
          <div className="flex gap-5 text-sm text-slate-400">

            <a
              href="/university/problems"
              className="transition hover:text-white"
            >
              Problems
            </a>

            <a
              href="/help"
              className="transition hover:text-white"
            >
              Help
            </a>

          </div>

        </div>

      </footer>

    </main>
  );
}