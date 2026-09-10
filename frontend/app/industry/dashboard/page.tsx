
"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CircleDollarSign,
  Clock3,
  FlaskConical,
  GraduationCap,
  Handshake,
  Lightbulb,
  MapPin,
  Target,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";

const stats = [
  {
    value: "18",
    label: "Available Projects",
    icon: Lightbulb,
    bg: "bg-teal-100",
    iconColor: "text-teal-700",
    valueColor: "text-teal-800",
  },
  {
    value: "7",
    label: "Active Collaborations",
    icon: Handshake,
    bg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    valueColor: "text-emerald-800",
  },
  {
    value: "₹34.8L",
    label: "Funding Supported",
    icon: CircleDollarSign,
    bg: "bg-amber-100",
    iconColor: "text-amber-700",
    valueColor: "text-amber-800",
  },
  {
    value: "5",
    label: "Projects Needing Support",
    icon: Target,
    bg: "bg-sky-100",
    iconColor: "text-sky-700",
    valueColor: "text-sky-800",
  },
];

const projects = [
  {
    id: "PRJ-001",
    title: "Smart Road Monitoring Pilot",
    problem: "Road damage and delayed maintenance reporting",
    university: "Birla Institute of Technology, Mesra",
    location: "Ranchi, Jharkhand",
    stage: "Pilot / Validation",
    progress: 72,
    support: "Technical Support",
    icon: Wrench,
    accent: "bg-teal-600",
  },
  {
    id: "PRJ-002",
    title: "Community Water Monitoring",
    problem: "Irregular water supply and quality monitoring",
    university: "NIT Jamshedpur",
    location: "Jamshedpur, Jharkhand",
    stage: "Project In Progress",
    progress: 58,
    support: "Field Pilot",
    icon: FlaskConical,
    accent: "bg-sky-600",
  },
  {
    id: "PRJ-003",
    title: "Rural Sanitation Deployment",
    problem: "Limited sanitation infrastructure in rural areas",
    university: "Central University of Jharkhand",
    location: "Dhanbad, Jharkhand",
    stage: "Solution Proposed",
    progress: 81,
    support: "Funding",
    icon: CircleDollarSign,
    accent: "bg-amber-500",
  },
];

const activities = [
  {
    title: "Funding request received",
    project: "Rural Sanitation Deployment",
    time: "2 hours ago",
    icon: CircleDollarSign,
  },
  {
    title: "Testing support requested",
    project: "Smart Road Monitoring Pilot",
    time: "Yesterday",
    icon: FlaskConical,
  },
  {
    title: "Mentorship collaboration accepted",
    project: "Citizen Complaint Analytics",
    time: "2 days ago",
    icon: Users,
  },
];

const supportTypes = [
  {
    name: "Funding",
    description: "Financial support",
    count: "12",
    icon: CircleDollarSign,
    bg: "bg-amber-100",
    color: "text-amber-700",
  },
  {
    name: "Mentorship",
    description: "Industry expertise",
    count: "8",
    icon: Users,
    bg: "bg-teal-100",
    color: "text-teal-700",
  },
  {
    name: "Testing",
    description: "Product validation",
    count: "6",
    icon: FlaskConical,
    bg: "bg-sky-100",
    color: "text-sky-700",
  },
  {
    name: "Prototyping",
    description: "Build & engineering",
    count: "5",
    icon: Wrench,
    bg: "bg-emerald-100",
    color: "text-emerald-700",
  },
];

export default function IndustryDashboard() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* ================= NAVBAR ================= */}
    
<nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    
    {/* Logo */}
    <Link
      href="/industry/dashboard"
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

    {/* Navigation */}
    <div className="hidden items-center gap-7 md:flex">

      <Link
        href="/industry/dashboard"
        className="text-sm font-semibold text-teal-700"
      >
        Dashboard
      </Link>

      <Link
        href="/industry/projects"
        className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
      >
        Projects
      </Link>

      <Link
        href="/industry/collaborations"
        className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
      >
        Collaborations
      </Link>

      <Link
        href="/industry/investments"
        className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
      >
        Investments
      </Link>

      <Link
        href="/industry/profile"
        className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
      >
        Profile
      </Link>

      <Link
        href="/industry/projects"
        className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
      >
        Explore Projects
      </Link>

    </div>
  </div>
</nav>



      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-teal-200 bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-teal-200/50 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-14">
          {/* Hero Content */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm">
              <Building2 size={16} />
              Industry Innovation Workspace
            </div>

            <h2 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Turn Innovation Into
              <br />
              <span className="text-teal-600">Real-World Impact.</span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Discover university-led solutions, support promising projects,
              and bring innovation closer to real-world deployment through
              meaningful industry collaboration.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/industry/projects"
                className="rounded-xl bg-teal-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700"
              >
                Explore Projects →
              </Link>

              <Link
                href="/industry/collaborations"
                className="rounded-xl border border-teal-200 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50"
              >
                View Collaborations
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-teal-100">
                  <Building2 size={16} className="text-teal-700" />
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-emerald-100">
                  <GraduationCap
                    size={16}
                    className="text-emerald-700"
                  />
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-amber-100">
                  <Lightbulb size={16} className="text-amber-700" />
                </div>
              </div>

              <span>
                Industry, universities and innovators building together
              </span>
            </div>
          </div>

          {/* Hero Impact Card */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-teal-200 bg-white/90 p-6 shadow-xl">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-teal-100 blur-2xl" />

              <div className="relative">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Industry Overview
                    </p>

                    <h3 className="mt-1 text-2xl font-bold">
                      Innovation Impact
                    </h3>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                    ● Active
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Projects supported
                      </p>

                      <p className="mt-2 text-4xl font-bold">12</p>
                    </div>

                    <div className="rounded-xl bg-teal-500/15 p-3">
                      <TrendingUp
                        size={23}
                        className="text-teal-300"
                      />
                    </div>
                  </div>

                  <div className="mt-7 h-3 overflow-hidden rounded-full bg-slate-700">
                    <div className="h-full w-[74%] rounded-full bg-teal-500" />
                  </div>

                  <div className="mt-3 flex justify-between text-xs text-slate-400">
                    <span>Collaboration progress</span>
                    <span>74% active</span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-teal-50 p-5">
                    <p className="text-sm text-slate-500">
                      Active Support
                    </p>

                    <p className="mt-1 text-2xl font-bold text-teal-700">
                      ₹18.6L
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-5">
                    <p className="text-sm text-slate-500">
                      Projects Impacted
                    </p>

                    <p className="mt-1 text-2xl font-bold text-emerald-700">
                      9
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.iconColor}`}
                  >
                    <Icon size={21} />
                  </div>

                  <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
                    <TrendingUp size={12} />
                    Active
                  </div>
                </div>

                <p
                  className={`mt-5 text-3xl font-bold ${stat.valueColor}`}
                >
                  {stat.value}
                </p>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= PROJECTS ================= */}
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-semibold text-teal-600">
              OPPORTUNITIES FOR INDUSTRY
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Projects That Need Support
            </h2>

            <p className="mt-3 max-w-3xl text-slate-600">
              Explore promising solutions where your organisation can
              contribute funding, expertise, technology or field support.
            </p>
          </div>

          <Link
            href="/industry/projects"
            className="text-sm font-semibold text-teal-600 hover:text-teal-700"
          >
            View all projects →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {projects.map((project) => {
            const Icon = project.icon;

            return (
              <div
                key={project.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl"
              >
                <div className={`h-1.5 ${project.accent}`} />

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                      <Icon size={21} />
                    </div>

                    <span className="rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-bold text-teal-700">
                      {project.stage}
                    </span>
                  </div>

                  <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {project.id}
                  </p>

                  <h3 className="mt-1 text-lg font-bold">
                    {project.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {project.problem}
                  </p>

                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <GraduationCap
                        size={16}
                        className="mt-0.5 shrink-0 text-teal-600"
                      />

                      <span>{project.university}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin
                        size={15}
                        className="shrink-0 text-teal-600"
                      />

                      <span>{project.location}</span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-500">
                        Project progress
                      </span>

                      <span className="font-bold text-teal-700">
                        {project.progress}%
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-teal-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Support Needed
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {project.support}
                      </p>
                    </div>

                    <Link
                      href={`/industry/projects/${project.id}`}
                      className="flex items-center gap-1 text-sm font-semibold text-teal-600 transition group-hover:text-teal-700"
                    >
                      View
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= COLLABORATION TYPES ================= */}
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6 shadow-sm md:p-8">
          <div>
            <p className="font-semibold text-teal-600">
              COLLABORATION TYPES
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              How Industry Can Contribute
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Choose the kind of support that matches your organisation's
              capabilities.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {supportTypes.map((type) => {
              const Icon = type.icon;

              return (
                <Link
                  key={type.name}
                  href="/industry/projects"
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${type.bg} ${type.color}`}
                    >
                      <Icon size={19} />
                    </div>

                    <ArrowRight
                      size={17}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-600"
                    />
                  </div>

                  <h3 className="mt-4 font-bold">{type.name}</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {type.description}
                  </p>

                  <p className="mt-3 text-xs font-semibold text-teal-600">
                    {type.count} opportunities
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= ACTIVITY ================= */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Activity */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-teal-600">
                  RECENT ACTIVITY
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Collaboration Updates
                </h2>
              </div>

              <Link
                href="/industry/collaborations"
                className="text-sm font-semibold text-teal-600 hover:text-teal-700"
              >
                View all →
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {activities.map((activity) => {
                const Icon = activity.icon;

                return (
                  <div
                    key={`${activity.title}-${activity.project}`}
                    className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-teal-100 hover:bg-teal-50/40"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm">
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        {activity.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {activity.project}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock3 size={13} />
                      {activity.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-lg">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-500/20 blur-2xl" />

            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-wider text-teal-300">
                Industry Workspace
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Ready to make an impact?
              </h2>

              <div className="mt-6 space-y-3">
                <Link
                  href="/industry/projects"
                  className="flex items-center gap-3 rounded-xl bg-white/10 p-4 transition hover:bg-teal-600/20"
                >
                  <Lightbulb size={19} className="text-teal-300" />

                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      Discover Projects
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Find solutions needing support
                    </p>
                  </div>

                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/industry/collaborations"
                  className="flex items-center gap-3 rounded-xl bg-white/10 p-4 transition hover:bg-teal-600/20"
                >
                  <Handshake size={19} className="text-teal-300" />

                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      My Collaborations
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Track your partnerships
                    </p>
                  </div>

                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/industry/profile"
                  className="flex items-center gap-3 rounded-xl bg-white/10 p-4 transition hover:bg-teal-600/20"
                >
                  <Building2 size={19} className="text-teal-300" />

                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      Organisation Profile
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Manage capabilities
                    </p>
                  </div>

                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-teal-600 px-8 py-14 text-white shadow-xl md:px-14">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-teal-200">
                BUILD WITH PURPOSE
              </p>

              <h2 className="mt-2 max-w-2xl text-3xl font-bold">
                Your expertise can move a solution from prototype to impact.
              </h2>

              <p className="mt-3 max-w-xl text-teal-100">
                Support promising projects through funding, mentorship,
                testing, prototyping or field deployment.
              </p>
            </div>

            <Link
              href="/industry/projects"
              className="rounded-xl bg-white px-6 py-4 font-semibold text-teal-600 shadow-sm transition hover:bg-slate-50"
            >
              Explore Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold">
                S
              </div>

              <div>
                <p className="font-semibold">SamadhanX</p>

                <p className="text-sm text-slate-400">
                  Ideas → Action → Impact
                </p>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-slate-400">
            © 2026 SamadhanX. All rights reserved.
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-slate-300">
            <Link
              href="/industry/profile"
              className="hover:text-white"
            >
              Profile
            </Link>

            <Link
              href="/industry/collaborations"
              className="hover:text-white"
            >
              Collaborations
            </Link>

            <Link href="/help" className="hover:text-white">
              Help
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
