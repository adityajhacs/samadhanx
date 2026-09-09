"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BellRing,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Construction,
  FolderKanban,
  Map,
  Network,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wrench,
} from "lucide-react";

const stats = [
  {
    value: "8",
    label: "Community Challenges",
    description: "Citizen reports received",
    icon: ClipboardList,
  },
  {
    value: "7",
    label: "Solutions Active",
    description: "Solutions in progress",
    icon: Wrench,
  },
  {
    value: "6",
    label: "Challenge Clusters",
    description: "Recurring issues identified",
    icon: Network,
  },
  {
    value: "13%",
    label: "Resolution Rate",
    description: "Challenges successfully resolved",
    icon: CheckCircle2,
  },
];

const operations = [
  {
    title: "Community Challenges",
    description:
      "Review citizen-reported challenges and identify issues that need government attention.",
    icon: AlertCircle,
    href: "/government/problems",
    action: "Explore Challenges",
  },
  {
    title: "Challenge Clusters",
    description:
      "Discover recurring challenges grouped by location, category and community need.",
    icon: Network,
    href: "/government/clusters",
    action: "Explore Clusters",
  },
  {
    title: "Impact Map",
    description:
      "Visualise challenge hotspots and understand where intervention is needed most.",
    icon: Map,
    href: "/government/map",
    action: "Open Impact Map",
  },
  {
    title: "Innovation Projects",
    description:
      "Track solutions as they move from verified challenges towards measurable impact.",
    icon: FolderKanban,
    href: "/government/projects",
    action: "View Projects",
  },
];

const recentProblems = [
  {
    id: "P-1024",
    title: "Major Road Damage",
    location: "Central Delhi",
    category: "Roads",
    status: "Critical",
    statusClass: "bg-red-50 text-red-700 border-red-100",
  },
  {
    id: "P-1023",
    title: "Drinking Water Shortage",
    location: "Lucknow",
    category: "Water",
    status: "In Progress",
    statusClass: "bg-teal-50 text-teal-700 border-teal-100",
  },
  {
    id: "P-1022",
    title: "Street Light Failure",
    location: "Jaipur",
    category: "Electricity",
    status: "Pending",
    statusClass: "bg-amber-50 text-amber-700 border-amber-100",
  },
  {
    id: "P-1021",
    title: "Garbage Collection Issue",
    location: "Bhopal",
    category: "Sanitation",
    status: "Resolved",
    statusClass: "bg-green-50 text-green-700 border-green-100",
  },
];

const categories = [
  {
    name: "Road Infrastructure",
    count: "2",
    icon: Construction,
  },
  {
    name: "Water Management",
    count: "2",
    icon: BellRing,
  },
  {
    name: "Electricity",
    count: "2",
    icon: Sparkles,
  },
  {
    name: "Sanitation",
    count: "2",
    icon: ShieldCheck,
  },
];

const clusters = [
  {
    id: "C-001",
    name: "Central Delhi Infrastructure",
    progress: "43%",
    status: "Critical",
  },
  {
    id: "C-002",
    name: "Lucknow Water Supply",
    progress: "64%",
    status: "Active",
  },
  {
    id: "C-003",
    name: "Jaipur Electricity",
    progress: "56%",
    status: "Active",
  },
];

const pipeline = [
  {
    number: "1",
    label: "Reported",
  },
  {
    number: "2",
    label: "Verified",
  },
  {
    number: "1",
    label: "Assigned",
  },
  {
    number: "3",
    label: "Execution",
  },
  {
    number: "1",
    label: "Resolved",
  },
];

export default function GovernmentDashboard() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
                {/* =====================================================
            HERO — M1 STYLE
           ===================================================== */}

        <section className="relative overflow-hidden bg-white">
          <div className="grid items-center gap-12 py-6 lg:grid-cols-2 lg:py-10">
            {/* =================================================
                LEFT — HERO CONTENT
               ================================================= */}

            <div>
              <div
                className="
                  mb-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border border-teal-100
                  bg-teal-50
                  px-4 py-2
                  text-sm
                  font-medium
                  text-teal-700
                "
              >
                <Sparkles size={15} strokeWidth={2} />

                <span>
                  Turning community challenges into coordinated action
                </span>
              </div>

              <h1
                className="
                  max-w-3xl
                  text-5xl
                  font-extrabold
                  leading-tight
                  tracking-tight
                  sm:text-6xl
                "
              >
                Your Challenges.
                <br />
                <span className="text-teal-600">
                  Government Action.
                </span>
                <br />
                Real Impact.
              </h1>

              <p
                className="
                  mt-6
                  max-w-xl
                  text-lg
                  leading-8
                  text-slate-600
                "
              >
                SamadhanX gives government teams a unified view of
                community-reported challenges, recurring problem clusters,
                geographical hotspots and the solutions working to resolve
                them.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/government/problems"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-teal-600
                    px-6 py-3
                    font-semibold
                    text-white
                    shadow-lg
                    transition
                    hover:bg-teal-700
                  "
                >
                  Explore Challenges
                  <ArrowRight size={17} strokeWidth={2} />
                </Link>

                <Link
                  href="/government/map"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border border-slate-300
                    bg-white
                    px-6 py-3.5
                    font-semibold
                    text-slate-700
                    transition
                    hover:border-teal-200
                    hover:bg-slate-50
                  "
                >
                  <Map size={17} strokeWidth={2} />
                  Explore Impact Map
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  <div
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-full
                      border-2 border-white
                      bg-teal-100
                      text-teal-700
                    "
                  >
                    <ShieldCheck size={17} strokeWidth={2} />
                  </div>

                  <div
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-full
                      border-2 border-white
                      bg-green-100
                      text-green-700
                    "
                  >
                    <Construction size={17} strokeWidth={2} />
                  </div>

                  <div
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-full
                      border-2 border-white
                      bg-amber-100
                      text-amber-700
                    "
                  >
                    <Wrench size={17} strokeWidth={2} />
                  </div>
                </div>

                <span>
                  Government teams turning reported needs into measurable
                  outcomes
                </span>
              </div>
            </div>

            {/* =================================================
                RIGHT — LIVE IMPACT CARD
               ================================================= */}

            <div className="relative">
              <div
                className="
                  absolute
                  -inset-6
                  rounded-[2rem]
                  bg-teal-100/60
                  blur-3xl
                "
              />

              <div
                className="
                  relative
                  rounded-3xl
                  border border-slate-200
                  bg-white
                  p-6
                  shadow-2xl
                "
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Government Overview
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      Live Impact
                    </h2>
                  </div>

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      bg-green-50
                      px-3 py-1
                      text-xs
                      font-semibold
                      text-green-600
                    "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Active
                  </span>
                </div>

                {/* Main impact metric */}
                <div className="rounded-2xl bg-slate-900 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Challenges being addressed
                      </p>

                      <p className="mt-2 text-4xl font-bold">
                        7
                      </p>
                    </div>

                    <div
                      className="
                        flex h-10 w-10
                        items-center justify-center
                        rounded-xl
                        bg-teal-500/15
                        text-teal-400
                      "
                    >
                      <TrendingUp size={19} strokeWidth={2} />
                    </div>
                  </div>

                  <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-700">
                    <div className="h-full w-[72%] rounded-full bg-teal-500" />
                  </div>

                  <div className="mt-3 flex justify-between text-xs text-slate-400">
                    <span>Active solution pipeline</span>
                    <span>72% progressing</span>
                  </div>
                </div>

                {/* Secondary metrics */}
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-teal-50 p-5">
                    <div className="flex items-center gap-2">
                      <div
                        className="
                          flex h-8 w-8
                          items-center justify-center
                          rounded-lg
                          bg-teal-100
                          text-teal-700
                        "
                      >
                        <Network size={15} strokeWidth={2} />
                      </div>

                      <p className="text-sm text-slate-500">
                        Active Clusters
                      </p>
                    </div>

                    <p className="mt-2 text-2xl font-bold text-teal-700">
                      6
                    </p>
                  </div>

                  <div className="rounded-2xl bg-green-50 p-5">
                    <div className="flex items-center gap-2">
                      <div
                        className="
                          flex h-8 w-8
                          items-center justify-center
                          rounded-lg
                          bg-green-100
                          text-green-700
                        "
                      >
                        <CheckCircle2 size={15} strokeWidth={2} />
                      </div>

                      <p className="text-sm text-slate-500">
                        Resolved
                      </p>
                    </div>

                    <p className="mt-2 text-2xl font-bold text-green-700">
                      1
                    </p>
                  </div>
                </div>

                {/* Quick status */}
                <div
                  className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    rounded-2xl
                    border border-slate-100
                    bg-slate-50
                    px-5 py-4
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex h-9 w-9
                        items-center justify-center
                        rounded-xl
                        bg-amber-50
                        text-amber-600
                      "
                    >
                      <Clock3 size={17} strokeWidth={2} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        Awaiting action
                      </p>

                      <p className="text-sm font-bold text-slate-900">
                        2 pending challenges
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={17}
                    strokeWidth={2}
                    className="text-slate-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
                {/* =====================================================
            GOVERNMENT OPERATIONS
           ===================================================== */}

        <section className="py-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-semibold text-teal-600">
                GOVERNMENT WORKSPACE
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Where should action begin?
              </h2>

              <p className="mt-3 max-w-3xl text-slate-600">
                Move from community-reported challenges to coordinated
                government action. Explore problems, identify patterns,
                understand hotspots and track solutions.
              </p>
            </div>

            <Link
              href="/government/problems"
              className="
                inline-flex
                items-center
                gap-1.5
                text-sm
                font-semibold
                text-teal-600
                hover:text-teal-700
              "
            >
              View all challenges
              <ArrowRight size={15} strokeWidth={2} />
            </Link>
          </div>

          {/* =================================================
              OPERATION CARDS
             ================================================= */}

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {operations.map((operation) => {
              const Icon = operation.icon;

              return (
                <Link
                  key={operation.title}
                  href={operation.href}
                  className="
                    group
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    p-6
                    transition
                    duration-200
                    hover:-translate-y-1
                    hover:border-teal-200
                    hover:shadow-lg
                  "
                >
                  {/* Icon */}
                  <div
                    className="
                      flex h-12 w-12
                      items-center justify-center
                      rounded-xl
                      bg-slate-100
                      text-teal-600
                      transition
                      group-hover:bg-teal-50
                    "
                  >
                    <Icon size={22} strokeWidth={1.9} />
                  </div>

                  {/* Title */}
                  <h3 className="mt-5 font-bold text-slate-900">
                    {operation.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-500">
                    {operation.description}
                  </p>

                  {/* Action */}
                  <span
                    className="
                      mt-5
                      inline-flex
                      items-center
                      gap-1.5
                      text-sm
                      font-semibold
                      text-teal-600
                      transition
                      group-hover:text-teal-700
                    "
                  >
                    {operation.action}
                    <ArrowRight
                      size={15}
                      strokeWidth={2}
                      className="
                        transition-transform
                        group-hover:translate-x-1
                      "
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            GOVERNMENT SNAPSHOT
           ===================================================== */}

        <section className="py-6">
          <div
            className="
              rounded-3xl
              border border-slate-200
              bg-white
              p-6
              shadow-sm
              md:p-8
            "
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-10 w-10
                      items-center justify-center
                      rounded-xl
                      bg-teal-50
                      text-teal-600
                    "
                  >
                    <TrendingUp size={19} strokeWidth={2} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-teal-600">
                      PLATFORM SNAPSHOT
                    </p>

                    <h2 className="mt-1 text-2xl font-bold tracking-tight">
                      Community needs are becoming actionable insights.
                    </h2>
                  </div>
                </div>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
                  SamadhanX helps government teams move beyond individual
                  complaints by connecting related challenges, prioritising
                  critical issues and monitoring the progress of solutions.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-teal-50 px-5 py-4 text-center">
                  <p className="text-2xl font-bold text-teal-700">
                    8
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Challenges
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-5 py-4 text-center">
                  <p className="text-2xl font-bold text-slate-800">
                    6
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Clusters
                  </p>
                </div>

                <div className="rounded-2xl bg-green-50 px-5 py-4 text-center">
                  <p className="text-2xl font-bold text-green-700">
                    7
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Solutions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
                {/* =====================================================
            RECENT COMMUNITY CHALLENGES
           ===================================================== */}

        <section className="py-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-semibold text-teal-600">
                COMMUNITY VOICE
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                What communities are reporting
              </h2>

              <p className="mt-3 max-w-3xl text-slate-600">
                Stay informed about the latest challenges and the action
                currently being taken by government teams.
              </p>
            </div>

            <Link
              href="/government/problems"
              className="
                inline-flex
                items-center
                gap-1.5
                text-sm
                font-semibold
                text-teal-600
                hover:text-teal-700
              "
            >
              View all problems
              <ArrowRight size={15} strokeWidth={2} />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* Recent Problems */}
            <div
              className="
                overflow-hidden
                rounded-2xl
                border border-slate-200
                bg-white
              "
            >
              <div className="border-b border-slate-100 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-10 w-10
                      items-center justify-center
                      rounded-xl
                      bg-teal-50
                      text-teal-600
                    "
                  >
                    <ClipboardList size={19} strokeWidth={2} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Latest Challenges
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Recent reports entering government workflows
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {recentProblems.map((problem) => (
                  <Link
                    key={problem.id}
                    href="/government/problems"
                    className="
                      group
                      block
                      px-6 py-5
                      transition
                      hover:bg-slate-50
                    "
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-teal-600">
                            {problem.id}
                          </span>

                          <span
                            className={`
                              rounded-full
                              border
                              px-2.5 py-1
                              text-xs
                              font-semibold
                              ${problem.statusClass}
                            `}
                          >
                            {problem.status}
                          </span>
                        </div>

                        <h4
                          className="
                            mt-2
                            truncate
                            font-bold
                            text-slate-900
                            transition
                            group-hover:text-teal-700
                          "
                        >
                          {problem.title}
                        </h4>

                        <p className="mt-1 text-xs text-slate-500">
                          {problem.location} · {problem.category}
                        </p>
                      </div>

                      <ArrowRight
                        size={17}
                        strokeWidth={2}
                        className="
                          shrink-0
                          text-slate-300
                          transition
                          group-hover:translate-x-1
                          group-hover:text-teal-600
                        "
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div
              className="
                rounded-2xl
                border border-slate-200
                bg-white
                p-6
              "
            >
              <p className="font-semibold text-teal-600">
                CHALLENGE AREAS
              </p>

              <h3 className="mt-2 text-xl font-bold tracking-tight">
                Where attention is needed
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                A quick view of the areas currently generating community
                challenges.
              </p>

              <div className="mt-7 space-y-4">
                {categories.map((category) => {
                  const Icon = category.icon;

                  return (
                    <Link
                      key={category.name}
                      href="/government/problems"
                      className="
                        group
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border border-slate-100
                        bg-slate-50
                        p-3
                        transition
                        hover:border-teal-100
                        hover:bg-teal-50
                      "
                    >
                      <div
                        className="
                          flex h-10 w-10
                          shrink-0
                          items-center justify-center
                          rounded-lg
                          bg-white
                          text-teal-600
                          shadow-sm
                          transition
                          group-hover:bg-teal-100
                        "
                      >
                        <Icon size={18} strokeWidth={1.9} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {category.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {category.count} reported challenges
                        </p>
                      </div>

                      <ArrowRight
                        size={15}
                        strokeWidth={2}
                        className="
                          text-slate-300
                          transition
                          group-hover:translate-x-1
                          group-hover:text-teal-600
                        "
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CHALLENGE CLUSTERS + SOLUTION PIPELINE
           ===================================================== */}

        <section className="py-10">
          <div className="mb-8">
            <p className="font-semibold text-teal-600">
              FROM PROBLEM TO PROGRESS
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              See how challenges move forward
            </h2>

            <p className="mt-3 max-w-3xl text-slate-600">
              SamadhanX connects related challenges and keeps government
              teams focused on measurable progress.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Challenge Clusters */}
            <div
              className="
                rounded-2xl
                border border-slate-200
                bg-white
                p-6
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className="
                      flex h-10 w-10
                      shrink-0
                      items-center justify-center
                      rounded-xl
                      bg-teal-50
                      text-teal-600
                    "
                  >
                    <Network size={19} strokeWidth={2} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">
                      Challenge Clusters
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Related problems connected into actionable groups.
                    </p>
                  </div>
                </div>

                <Link
                  href="/government/clusters"
                  className="
                    hidden
                    items-center
                    gap-1
                    text-xs
                    font-semibold
                    text-teal-600
                    sm:inline-flex
                  "
                >
                  View all
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {clusters.map((cluster) => (
                  <Link
                    key={cluster.id}
                    href="/government/clusters"
                    className="
                      group
                      block
                      rounded-xl
                      border border-slate-100
                      bg-slate-50
                      p-4
                      transition
                      hover:border-teal-100
                      hover:bg-teal-50/50
                    "
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-teal-600">
                          {cluster.id}
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                          {cluster.name}
                        </p>
                      </div>

                      <span
                        className={`
                          rounded-full
                          px-2.5 py-1
                          text-[10px]
                          font-bold
                          ${
                            cluster.status === "Critical"
                              ? "bg-red-50 text-red-600"
                              : "bg-green-50 text-green-600"
                          }
                        `}
                      >
                        {cluster.status}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-teal-600"
                          style={{ width: cluster.progress }}
                        />
                      </div>

                      <span className="text-xs font-bold text-slate-500">
                        {cluster.progress}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Solution Pipeline */}
            <div
              className="
                rounded-2xl
                border border-slate-200
                bg-white
                p-6
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className="
                      flex h-10 w-10
                      shrink-0
                      items-center justify-center
                      rounded-xl
                      bg-green-50
                      text-green-600
                    "
                  >
                    <Wrench size={19} strokeWidth={2} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">
                      Solution Pipeline
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Track progress from reported challenge to resolution.
                    </p>
                  </div>
                </div>

                <Link
                  href="/government/projects"
                  className="
                    hidden
                    items-center
                    gap-1
                    text-xs
                    font-semibold
                    text-teal-600
                    sm:inline-flex
                  "
                >
                  View projects
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-5 gap-2">
                {pipeline.map((stage, index) => (
                  <div key={stage.label} className="relative text-center">
                    <div
                      className="
                        mx-auto
                        flex h-10 w-10
                        items-center justify-center
                        rounded-full
                        bg-teal-600
                        text-xs
                        font-bold
                        text-white
                      "
                    >
                      {stage.number}
                    </div>

                    <p className="mt-3 text-[10px] font-semibold text-slate-600 sm:text-xs">
                      {stage.label}
                    </p>

                    {index < pipeline.length - 1 && (
                      <div
                        className="
                          absolute
                          left-[calc(50%+22px)]
                          top-5
                          hidden
                          h-px
                          w-[calc(100%-12px)]
                          bg-teal-200
                          lg:block
                        "
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500">
                    Overall solution progress
                  </span>

                  <span className="font-bold text-teal-700">
                    72%
                  </span>
                </div>

                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[72%] rounded-full bg-teal-600" />
                </div>
              </div>

              <div
                className="
                  mt-5
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-green-50
                  px-4 py-3
                  text-xs
                  font-medium
                  text-green-700
                "
              >
                <CheckCircle2 size={15} strokeWidth={2} />

                <span>
                  Active solutions are progressing through government
                  workflows.
                </span>
              </div>
            </div>
          </div>
        </section>
                      {/* =====================================================
            IMPACT AT A GLANCE
           ===================================================== */}

        <section className="py-10">
          <div>
            <p className="font-semibold tracking-wide text-teal-600">
              IMPACT AT A GLANCE
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Turning reports into measurable progress.
            </h2>

            <p className="mt-3 max-w-3xl text-slate-600">
              A simple view of how SamadhanX is helping government teams
              understand, prioritise and act on community needs.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="
                    group
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                    transition
                    hover:-translate-y-1
                    hover:border-teal-200
                    hover:shadow-lg
                  "
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="
                        flex h-11 w-11
                        items-center justify-center
                        rounded-xl
                        bg-teal-50
                        text-teal-600
                        transition
                        group-hover:bg-teal-100
                      "
                    >
                      <Icon size={19} strokeWidth={2} />
                    </div>

                    <TrendingUp
                      size={16}
                      strokeWidth={2}
                      className="text-slate-300"
                    />
                  </div>

                  <p className="mt-5 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {stat.label}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>


        {/* =====================================================
            FINAL CTA
           ===================================================== */}

        <section className="pb-20 pt-6">
          <div
            className="
              overflow-hidden
              rounded-3xl
              bg-teal-600
              px-8 py-12
              text-white
              shadow-lg
              md:px-14
              md:py-14
            "
          >
            <div
              className="
                flex
                flex-col
                items-start
                justify-between
                gap-8
                md:flex-row
                md:items-center
              "
            >
              {/* CTA Content */}
              <div className="max-w-2xl">
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={16}
                    strokeWidth={2}
                    className="text-teal-200"
                  />

                  <p className="text-sm font-semibold uppercase tracking-wider text-teal-100">
                    TURN INSIGHT INTO ACTION
                  </p>
                </div>

                <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
                  Every community challenge can become the beginning of a
                  meaningful solution.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-teal-50 md:text-base">
                  Use SamadhanX to understand what communities need,
                  coordinate the right response and track progress towards
                  real-world impact.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
                <Link
  href="/government/problems"
  className="
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-xl
    bg-white
    px-6 py-3.5
    text-sm
    font-bold
    !text-slate-900
    shadow-md
    transition
    hover:bg-slate-100
    hover:!text-teal-700
  "
>
  <span className="!text-slate-900">
    Explore Challenges
  </span>

  <ArrowRight
    size={17}
    strokeWidth={2}
    className="!text-slate-900"
  />
</Link>

                <Link
                  href="/government/projects"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-white/40
                    bg-teal-700
                    px-6 py-3.5
                    text-sm
                    font-bold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-teal-800
                  "
                >
                  <FolderKanban size={17} strokeWidth={2} />
                  View Solutions
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>


                      {/* =====================================================
            FOOTER — FULL WIDTH & COMPACT M1 STYLE
           ===================================================== */}

        <footer className="w-full border-t border-slate-800 bg-slate-950 text-white">
          <div
            className="
              flex
              w-full
              flex-col
              gap-4
              px-6
              py-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            {/* LEFT */}
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-lg
                  bg-teal-600
                  text-base
                  font-bold
                "
              >
                S
              </div>

              <div>
                <p className="text-sm font-semibold">
                  SamadhanX
                </p>

                <p className="text-xs text-slate-400">
                  Ideas → Action → Impact
                </p>
              </div>
            </div>


            {/* CENTER */}
            <div className="text-center text-xs text-slate-500">
              © 2026 SamadhanX. Government Innovation Workspace.
            </div>


            {/* RIGHT */}
            <div className="flex items-center gap-5 text-xs text-slate-400">

              <Link
                href="/government/problems"
                className="
                  transition-colors
                  duration-200
                  hover:text-teal-400
                "
              >
                Challenges
              </Link>

              <Link
                href="/government/map"
                className="
                  transition-colors
                  duration-200
                  hover:text-teal-400
                "
              >
                Impact Map
              </Link>

              <Link
                href="/government/projects"
                className="
                  transition-colors
                  duration-200
                  hover:text-teal-400
                "
              >
                Solutions
              </Link>

            </div>

          </div>
        </footer>
      
    </main>
  );
}