"use client";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FolderKanban,
  GraduationCap,
  Handshake,
  Lightbulb,
  Users,
} from "lucide-react";

const communityProblems = [
  {
    id: 8,
    title: "Unreliable Water Supply in Local Community",
    category: "Water Management",
    description:
      "Explore a community-reported water supply challenge and opportunities for innovative solutions.",
    impact: "400+ people affected",
  },
  {
    id: 7,
    title: "Poor Sanitation and Waste Management",
    category: "Sanitation",
    description:
      "Find opportunities to improve sanitation, waste collection and public health in communities.",
    impact: "300+ people affected",
  },
  {
    id: 9,
    title: "Challenges Faced by Local Farmers",
    category: "Agriculture",
    description:
      "Discover challenges faced by local farmers and develop practical technology-driven solutions.",
    impact: "250+ people affected",
  },
];

export default function UniversityDashboard() {
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
          <div className="hidden items-center gap-6 md:flex">
  <a
    href="/university/dashboard"
    className="text-sm font-semibold text-teal-600"
  >
    Dashboard
  </a>

  <a
    href="/university/problems"
    className="text-sm text-slate-600 transition hover:text-teal-600"
  >
    Problems
  </a>

  <a
    href="/university/projects"
    className="text-sm text-slate-600 transition hover:text-teal-600"
  >
    Projects
  </a>

  <a
    href="/university/solutions"
    className="text-sm text-slate-600 transition hover:text-teal-600"
  >
    Solutions
  </a>

  <a
    href="/university/teams"
    className="text-sm text-slate-600 transition hover:text-teal-600"
  >
    Teams
  </a>

  <a
    href="/university/profile"
    className="text-sm text-slate-600 transition hover:text-teal-600"
  >
    Profile
  </a>
</div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        {/* ================= TOP BANNER ================= */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-teal-500 p-7 text-white shadow-sm md:p-8">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            {/* Banner Text */}
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                  <GraduationCap className="h-6 w-6" />
                </div>

                <p className="text-sm font-semibold uppercase tracking-wider text-teal-50">
                  University Portal
                </p>
              </div>

              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Discover. Collaborate. Innovate.
                </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-teal-50 md:text-base">
                Explore real-world community problems, collaborate with
                universities and turn innovative ideas into meaningful
                solutions.
              </p>
            </div>

            {/* Overview Cards */}
            <div className="grid w-full max-w-xl grid-cols-2 gap-3 lg:w-[520px]">
              {/* Universities */}
              <a
                href="/university/profile"
                className="group rounded-2xl bg-white p-4 text-slate-900 shadow-sm transition duration-200 hover:-translate-y-1 hover:bg-teal-50 hover:ring-2 hover:ring-white/70"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-100">
                    <GraduationCap className="h-5 w-5" />
                  </div>

                  <span className="text-2xl font-bold">24</span>
                </div>

                <p className="mt-3 text-sm font-semibold">
                  Universities
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Active on SamadhanX
                </p>
              </a>

              {/* Community Problems */}
              <a
                href="/university/problems"
                className="group rounded-2xl bg-white p-4 text-slate-900 shadow-sm transition duration-200 hover:-translate-y-1 hover:bg-teal-50 hover:ring-2 hover:ring-white/70"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-100">
                    <BookOpen className="h-5 w-5" />
                  </div>

                  <span className="text-2xl font-bold">128</span>
                </div>

                <p className="mt-3 text-sm font-semibold">
                  Community Problems
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Reported challenges
                </p>
              </a>

              {/* Active Projects */}
              <a
                href="/university/projects"
                className="group rounded-2xl bg-white p-4 text-slate-900 shadow-sm transition duration-200 hover:-translate-y-1 hover:bg-teal-50 hover:ring-2 hover:ring-white/70"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-100">
                    <FolderKanban className="h-5 w-5" />
                  </div>

                  <span className="text-2xl font-bold">5</span>
                </div>

                <p className="mt-3 text-sm font-semibold">
                  Active Projects
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Solutions in progress
                </p>
              </a>

              {/* Solutions */}
              <a
                href="/university/solutions"
                className="group rounded-2xl bg-white p-4 text-slate-900 shadow-sm transition duration-200 hover:-translate-y-1 hover:bg-teal-50 hover:ring-2 hover:ring-white/70"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-100">
                    <Lightbulb className="h-5 w-5" />
                  </div>

                  <span className="text-2xl font-bold">12</span>
                </div>

                <p className="mt-3 text-sm font-semibold">
                  Solutions
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Ideas being developed
                </p>
              </a>
            </div>
          </div>
        </div>

        {/* ================= SECTION HEADING ================= */}
        <div className="mb-5">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-teal-600" />

            <h3 className="text-2xl font-bold tracking-tight">
              Community Problems
            </h3>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Explore problems reported by citizens and discover opportunities
            for university-led solutions.
          </p>
        </div>

        {/* ================= PROBLEM CARDS ================= */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {communityProblems.map((problem) => (
            <a
              key={problem.id}
              href={`/university/problems/${problem.id}`}
              className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-50 hover:shadow-md"
            >
              {/* Icon */}
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 group-hover:bg-white">
                {problem.category === "Water Management" ? (
                  <span className="text-teal-600">
                    <DropletsIcon />
                  </span>
                ) : problem.category === "Sanitation" ? (
                  <CheckCircle2 className="h-6 w-6 text-teal-600" />
                ) : (
                  <Users className="h-6 w-6 text-teal-600" />
                )}
              </div>

              {/* Category */}
              <span className="mb-2 w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 group-hover:bg-white">
                {problem.category}
              </span>

              {/* Title */}
              <h4 className="text-xl font-bold leading-snug group-hover:text-teal-700">
                {problem.title}
              </h4>

              {/* Description */}
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
                {problem.description}
              </p>

              {/* Bottom */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-medium text-slate-500">
                  {problem.impact}
                </span>

                <span className="flex items-center gap-1 text-sm font-semibold text-teal-600">
                  Explore
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* ================= PROJECTS + SOLUTIONS ================= */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Projects */}
          <a
            href="/university/projects"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-50 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 group-hover:bg-white">
                <FolderKanban className="h-6 w-6 text-teal-600" />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold group-hover:text-teal-700">
                  University Projects
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Explore projects where universities are working together to
                  address real-world community challenges.
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-teal-600">
                  Explore Projects
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </a>

          {/* Solutions */}
          <a
            href="/university/solutions"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-50 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 group-hover:bg-white">
                <Lightbulb className="h-6 w-6 text-teal-600" />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold group-hover:text-teal-700">
                  University Solutions
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Discover innovative solutions developed by students,
                  researchers and universities.
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-teal-600">
                  Explore Solutions
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </a>
        </div>
{/* ================= INDUSTRY SUPPORT ================= */}
<section className="mt-10 rounded-2xl border border-teal-200 bg-white p-6 shadow-sm">
  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50">
        <Handshake className="h-6 w-6 text-teal-700" />
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-bold text-slate-900">
            Industry Support
          </h3>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            Active
          </span>
        </div>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Connect your university projects with industry partners for
          funding, mentorship, hardware, testing and field deployment.
        </p>
      </div>
    </div>

    <a
      href="/university/industry"
      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
    >
      Find Industry Partners
      <ArrowRight className="h-4 w-4" />
    </a>
  </div>

  <div className="mt-6 grid gap-4 sm:grid-cols-3">
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-500">
        Active Collaborations
      </p>

      <p className="mt-1 text-2xl font-black text-slate-900">
        2
      </p>
    </div>

    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-500">
        Support Received
      </p>

      <p className="mt-1 text-2xl font-black text-slate-900">
        ₹2.4L
      </p>
    </div>

    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-500">
        Requests Pending
      </p>

      <p className="mt-1 text-2xl font-black text-slate-900">
        3
      </p>
    </div>
  </div>
</section>
        {/* ================= BOTTOM CTA ================= */}
        <div className="mt-10 overflow-hidden rounded-3xl bg-teal-600 p-7 text-white shadow-sm md:p-9">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-teal-100">
                From Problems to Possibilities
              </p>

              <h3 className="text-xl font-bold leading-snug md:text-2xl">
                Together, we can turn community challenges into meaningful
                solutions.
              </h3>

              <p className="mt-3 text-sm leading-6 text-teal-50 md:text-base">
                Connect knowledge, ideas and collaboration to create an impact
                that reaches beyond the campus.
              </p>
            </div>

            <a
              href="/university/problems"
              className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-teal-700 transition hover:bg-teal-50"
            >
              Explore Problems
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="mt-12 bg-slate-950 px-6 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">
          {/* Footer Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">
              S
            </div>

            <div>
              <p className="text-lg font-bold">SamadhanX</p>

              <p className="text-sm text-slate-400">
                Ideas → Action → Impact
              </p>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-sm text-slate-400">
            © 2026 SamadhanX. Building solutions that matter.
          </p>

          {/* Footer Links */}
          <div className="flex gap-5 text-sm text-slate-400">
            <a
              href="/help"
              className="transition hover:text-white"
            >
              Help
            </a>

            <a
              href="/problems"
              className="transition hover:text-white"
            >
              Problems
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* Simple water icon */
function DropletsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.7C12 2.7 6 9.2 6 13.5a6 6 0 0 0 12 0C18 9.2 12 2.7 12 2.7Z" />
      <path d="M9.5 15.5a3 3 0 0 0 3 2.5" />
    </svg>
  );
}