
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock3,
  Handshake,
  IndianRupee,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";

const collaborationData = {
  id: "COL-001",
  projectId: "1",
  projectName: "Smart Water Management System",
  partner: "ABC Technologies",
  partnerId: "abc-technologies",
  support: ["Hardware", "Testing", "Funding"],
  amount: "₹2.4 Lakhs",
  status: "Requested",
  description:
    "ABC Technologies has been requested to support the Smart Water Management System through hardware resources, technical testing and prototype funding.",
};

const timeline = [
  {
    title: "Collaboration Request Submitted",
    description:
      "University submitted a support request to ABC Technologies.",
    date: "10 Sep 2026",
    completed: true,
  },
  {
    title: "Industry Review",
    description:
      "Industry partner will review the project, support requirements and proposed funding.",
    date: "Pending",
    completed: false,
  },
  {
    title: "Collaboration Acceptance",
    description:
      "The partnership becomes active after industry approval.",
    date: "Pending",
    completed: false,
  },
  {
    title: "Prototype & Field Support",
    description:
      "Industry support will be used for testing, prototyping and field deployment.",
    date: "Pending",
    completed: false,
  },
];

export default function CollaborationDetailPage() {
  const params = useParams();

  const projectId = String(params?.id ?? collaborationData.projectId);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            href="/university/dashboard"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-sm font-bold text-white shadow-sm">
              S
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">
                SamadhanX
              </p>

              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Ideas → Action → Impact
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <Link
              href="/university/dashboard"
              className="text-sm font-medium text-slate-600 hover:text-teal-700"
            >
              Dashboard
            </Link>

            <Link
              href="/university/problems"
              className="text-sm font-medium text-slate-600 hover:text-teal-700"
            >
              Problems
            </Link>

            <Link
              href="/university/projects"
              className="text-sm font-semibold text-teal-700"
            >
              Projects
            </Link>

            <Link
              href="/university/solutions"
              className="text-sm font-medium text-slate-600 hover:text-teal-700"
            >
              Solutions
            </Link>

            <Link
              href="/university/teams"
              className="text-sm font-medium text-slate-600 hover:text-teal-700"
            >
              Teams
            </Link>

            <Link
              href="/university/profile"
              className="text-sm font-medium text-slate-600 hover:text-teal-700"
            >
              Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* BACK */}
        <Link
          href={`/university/projects/${projectId}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Project Workspace
        </Link>

        {/* ================= HEADER ================= */}
        <section className="mt-6 rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-700 to-teal-800 p-7 text-white shadow-sm">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div>
              <div className="flex flex-wrap items-center gap-2">

                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                  {collaborationData.id}
                </span>

                <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-100">
                  {collaborationData.status}
                </span>

              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Industry Collaboration
              </h1>

              <p className="mt-2 text-teal-100">
                University ↔ Industry Partnership Workspace
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4">
              <p className="text-xs text-teal-100">
                Requested Support
              </p>

              <p className="mt-1 text-2xl font-black">
                {collaborationData.amount}
              </p>
            </div>

          </div>
        </section>

        {/* ================= OVERVIEW ================= */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">

          {/* LEFT */}
          <div className="space-y-6">

            {/* PARTNER */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                  <Building2 className="h-6 w-6 text-teal-700" />
                </div>

                <div className="flex-1">

                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Industry Partner
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-900">
                    {collaborationData.partner}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Technology & Engineering
                  </p>

                  <Link
                    href={`/university/industry/${collaborationData.partnerId}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800"
                  >
                    View Partner
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Link>

                </div>

              </div>

            </section>

            {/* PROJECT */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Handshake className="h-5 w-5 text-slate-700" />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Linked Project
                  </h2>

                  <p className="text-sm text-slate-500">
                    Project receiving industry support.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">

                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Project
                </p>

                <h3 className="mt-1 text-lg font-black">
                  {collaborationData.projectName}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {collaborationData.description}
                </p>

                <Link
                  href={`/university/projects/${projectId}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800"
                >
                  Open Project Workspace
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>

              </div>

            </section>

            {/* SUPPORT */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-bold">
                Support Requested
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Resources requested from the industry partner.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">

                {collaborationData.support.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-teal-100 bg-teal-50 p-4"
                  >
                    <CheckCircle2 className="h-5 w-5 text-teal-700" />

                    <span className="text-sm font-bold text-teal-800">
                      {item}
                    </span>
                  </div>
                ))}

              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">

                <div className="flex items-center gap-3">
                  <IndianRupee className="h-5 w-5 text-slate-600" />

                  <div>
                    <p className="text-xs text-slate-500">
                      Estimated Funding
                    </p>

                    <p className="text-lg font-black text-slate-900">
                      {collaborationData.amount}
                    </p>
                  </div>
                </div>

              </div>

            </section>

            {/* ACTIVITY TIMELINE */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <Clock3 className="h-5 w-5 text-emerald-700" />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Collaboration Timeline
                  </h2>

                  <p className="text-sm text-slate-500">
                    Track the partnership lifecycle.
                  </p>
                </div>

              </div>

              <div className="mt-6 space-y-6">

                {timeline.map((item, index) => (

                  <div
                    key={item.title}
                    className="relative flex gap-4"
                  >

                    {index < timeline.length - 1 && (
                      <div className="absolute left-[15px] top-8 h-full w-px bg-slate-200" />
                    )}

                    <div
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        item.completed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Clock3 className="h-4 w-4" />
                      )}
                    </div>

                    <div className="pb-2">

                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">

                        <h3 className="text-sm font-bold text-slate-900">
                          {item.title}
                        </h3>

                        <span className="text-xs font-medium text-slate-400">
                          {item.date}
                        </span>

                      </div>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </section>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* STATUS */}
            <section className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <Clock3 className="h-5 w-5 text-amber-600" />

                <h2 className="text-base font-bold">
                  Collaboration Status
                </h2>

              </div>

              <div className="mt-5 rounded-xl bg-amber-50 p-4">

                <p className="text-xs font-bold uppercase tracking-wide text-amber-600">
                  Current Status
                </p>

                <p className="mt-1 text-xl font-black text-amber-800">
                  {collaborationData.status}
                </p>

                <p className="mt-2 text-sm leading-5 text-amber-700">
                  The request has been submitted and is waiting for
                  industry partner review.
                </p>

              </div>

            </section>

            {/* TEAM */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <Users className="h-5 w-5 text-teal-700" />

                <h2 className="text-base font-bold">
                  Project Team
                </h2>

              </div>

              <p className="mt-3 text-sm text-slate-500">
                University team responsible for the collaboration.
              </p>

              <Link
                href={`/university/projects/${projectId}`}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                View Project Team
              </Link>

            </section>

            {/* COMMUNICATION */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <MessageSquare className="h-5 w-5 text-slate-700" />
              </div>

              <h2 className="mt-4 text-base font-bold">
                Communication
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Communication with the industry partner can be managed
                through the collaboration workspace.
              </p>

              <button
                type="button"
                onClick={() =>
                  alert("Partner communication workspace will be available after acceptance.")
                }
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white hover:bg-teal-800"
              >
                <MessageSquare className="h-4 w-4" />
                Contact Partner
              </button>

            </section>

            {/* SECURITY */}
            <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">

              <div className="flex items-start gap-3">

                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

                <div>
                  <h2 className="text-sm font-bold text-emerald-900">
                    Partnership Review
                  </h2>

                  <p className="mt-2 text-xs leading-5 text-emerald-800">
                    Industry support becomes active only after the
                    partner reviews and accepts the collaboration request.
                  </p>
                </div>

              </div>

            </section>

          </div>

        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="mt-10 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

          <p className="text-xs font-medium text-slate-400">
            © 2026 SamadhanX • Ideas → Action → Impact
          </p>

          <p className="text-xs text-slate-400">
            University Innovation Portal
          </p>

        </div>
      </footer>

    </main>
  );
}

