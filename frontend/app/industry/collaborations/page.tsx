"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  FlaskConical,
  Handshake,
  MapPin,
  Search,
  Target,
  Users,
  Wrench,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

type CollaborationStatus =
  | "Pending Review"
  | "Under Discussion"
  | "Active"
  | "Completed"
  | "Declined";

type SupportType =
  | "Funding"
  | "Mentorship"
  | "Testing"
  | "Prototyping"
  | "Field Pilot"
  | "Technical Support";

type Collaboration = {
  id: string;
  projectId: string;
  project: string;
  problem: string;
  university: string;
  location: string;
  supportType: SupportType;
  status: CollaborationStatus;
  amount: string;
  progress: number;
  submitted: string;
  description: string;
};

const collaborations: Collaboration[] = [
  {
    id: "COL-001",
    projectId: "PRJ-001",
    project: "Smart Road Monitoring Pilot",
    problem: "Road damage and delayed maintenance reporting",
    university: "Birla Institute of Technology, Mesra",
    location: "Ranchi, Jharkhand",
    supportType: "Technical Support",
    status: "Active",
    amount: "₹8.5L",
    progress: 72,
    submitted: "18 Aug 2026",
    description:
      "Technical support for computer vision, road-damage detection and field validation of the monitoring platform.",
  },
  {
    id: "COL-002",
    projectId: "PRJ-002",
    project: "Community Water Monitoring",
    problem: "Irregular water supply and quality monitoring",
    university: "NIT Jamshedpur",
    location: "Jamshedpur, Jharkhand",
    supportType: "Field Pilot",
    status: "Active",
    amount: "₹6.2L",
    progress: 58,
    submitted: "14 Aug 2026",
    description:
      "Pilot support for testing community water monitoring sensors and validating the reporting workflow.",
  },
  {
    id: "COL-003",
    projectId: "PRJ-003",
    project: "Rural Sanitation Deployment",
    problem: "Limited sanitation infrastructure in rural areas",
    university: "Central University of Jharkhand",
    location: "Dhanbad, Jharkhand",
    supportType: "Funding",
    status: "Under Discussion",
    amount: "₹12L",
    progress: 81,
    submitted: "25 Aug 2026",
    description:
      "Funding proposal for scaling a low-cost sanitation solution and preparing it for community deployment.",
  },
  {
    id: "COL-004",
    projectId: "PRJ-004",
    project: "Solar Street Infrastructure",
    problem: "Poor street lighting in selected communities",
    university: "Birla Institute of Technology, Mesra",
    location: "Bokaro, Jharkhand",
    supportType: "Prototyping",
    status: "Pending Review",
    amount: "₹4.5L",
    progress: 34,
    submitted: "29 Aug 2026",
    description:
      "Prototype engineering support for solar streetlight hardware, battery systems and remote monitoring.",
  },
  {
    id: "COL-005",
    projectId: "PRJ-005",
    project: "Citizen Complaint Analytics",
    problem: "Recurring civic complaints across districts",
    university: "NIT Jamshedpur",
    location: "Hazaribagh, Jharkhand",
    supportType: "Mentorship",
    status: "Completed",
    amount: "₹3L",
    progress: 100,
    submitted: "05 Jul 2026",
    description:
      "Industry mentorship focused on analytics architecture and translating complaint trends into actionable insights.",
  },
  {
    id: "COL-006",
    projectId: "PRJ-006",
    project: "Low-Cost Road Repair Material",
    problem: "High cost of conventional road repair materials",
    university: "Birla Institute of Technology, Mesra",
    location: "Deoghar, Jharkhand",
    supportType: "Testing",
    status: "Pending Review",
    amount: "₹2.75L",
    progress: 21,
    submitted: "01 Sep 2026",
    description:
      "Testing support to evaluate strength, durability and cost effectiveness of the proposed repair material.",
  },
];

const supportConfig: Record<
  SupportType,
  {
    icon: typeof Wrench;
    iconBg: string;
    iconColor: string;
    label: string;
  }
> = {
  Funding: {
    icon: CircleDollarSign,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
    label: "Financial Support",
  },
  Mentorship: {
    icon: Users,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-700",
    label: "Industry Mentorship",
  },
  Testing: {
    icon: FlaskConical,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-700",
    label: "Testing & Validation",
  },
  Prototyping: {
    icon: Wrench,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
    label: "Prototype Support",
  },
  "Field Pilot": {
    icon: Target,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-700",
    label: "Field Pilot",
  },
  "Technical Support": {
    icon: Wrench,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700",
    label: "Technical Support",
  },
};

const statusConfig: Record<
  CollaborationStatus,
  {
    icon: typeof Clock3;
    bg: string;
    text: string;
    border: string;
    description: string;
  }
> = {
  "Pending Review": {
    icon: Clock3,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    description: "Awaiting review",
  },
  "Under Discussion": {
    icon: Users,
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    description: "Terms being discussed",
  },
  Active: {
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    description: "Collaboration active",
  },
  Completed: {
    icon: CheckCircle2,
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    description: "Successfully completed",
  },
  Declined: {
    icon: XCircle,
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    description: "Proposal declined",
  },
};

export default function IndustryCollaborationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | CollaborationStatus
  >("All");

  const [supportFilter, setSupportFilter] = useState<
    "All" | SupportType
  >("All");

  const [showFilters, setShowFilters] = useState(false);

  const filteredCollaborations = useMemo(() => {
    return collaborations.filter((item) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        item.project.toLowerCase().includes(query) ||
        item.university.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.supportType.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesSupport =
        supportFilter === "All" ||
        item.supportType === supportFilter;

      return matchesSearch && matchesStatus && matchesSupport;
    });
  }, [search, statusFilter, supportFilter]);

  const activeCount = collaborations.filter(
    (item) => item.status === "Active"
  ).length;

  const pendingCount = collaborations.filter(
    (item) =>
      item.status === "Pending Review" ||
      item.status === "Under Discussion"
  ).length;

  const completedCount = collaborations.filter(
    (item) => item.status === "Completed"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
    
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
        className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
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
        className="text-sm font-semibold text-teal-700"
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



      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950">
        <div className="absolute right-[-80px] top-[-100px] h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[35%] h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-14">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-teal-100">
              <Handshake className="h-3.5 w-3.5" />
              Partnership Workspace
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Collaborate With
              <span className="block text-teal-200">
                Innovation That Matters.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-teal-100/80 sm:text-base">
              Manage your partnerships with university teams, track support
              commitments and follow every project from proposal to measurable
              impact.
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="mx-auto max-w-7xl px-6 pt-7">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard
            label="Total Partnerships"
            value={collaborations.length.toString()}
            description="Across innovation projects"
            icon={Handshake}
            iconBg="bg-teal-50"
            iconColor="text-teal-700"
          />

          <OverviewCard
            label="Active"
            value={activeCount.toString()}
            description="Currently in execution"
            icon={CheckCircle2}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-700"
          />

          <OverviewCard
            label="Awaiting Action"
            value={pendingCount.toString()}
            description="Reviews or discussions"
            icon={Clock3}
            iconBg="bg-amber-50"
            iconColor="text-amber-700"
          />

          <OverviewCard
            label="Completed"
            value={completedCount.toString()}
            description="Successfully delivered"
            icon={Target}
            iconBg="bg-sky-50"
            iconColor="text-sky-700"
          />
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        {/* Section heading */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
              Partnership Portfolio
            </p>

            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">
              Your Collaborations
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track proposals, active partnerships and completed engagements.
            </p>
          </div>

          <Link
            href="/industry/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-800"
          >
            Find more opportunities
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Search + filters */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search collaborations, projects or universities..."
                className="h-11 w-full rounded-xl border border-transparent bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <button
              onClick={() => setShowFilters((value) => !value)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700"
            >
              Filters
              <ChevronDown
                className={`h-4 w-4 transition ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {showFilters && (
            <div className="mt-3 grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-2">
              <FilterSelect
                label="Collaboration Status"
                value={statusFilter}
                onChange={(value) =>
                  setStatusFilter(value as "All" | CollaborationStatus)
                }
                options={[
                  "All",
                  "Pending Review",
                  "Under Discussion",
                  "Active",
                  "Completed",
                  "Declined",
                ]}
              />

              <FilterSelect
                label="Support Type"
                value={supportFilter}
                onChange={(value) =>
                  setSupportFilter(value as "All" | SupportType)
                }
                options={[
                  "All",
                  "Funding",
                  "Mentorship",
                  "Testing",
                  "Prototyping",
                  "Field Pilot",
                  "Technical Support",
                ]}
              />
            </div>
          )}
        </div>

        {/* Result count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-800">
              {filteredCollaborations.length}
            </span>{" "}
            of {collaborations.length} partnerships
          </p>
        </div>

        {/* Collaboration cards */}
        {filteredCollaborations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Search className="h-6 w-6 text-slate-400" />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-900">
              No partnerships found
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              Try changing your search or filters to find a collaboration.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredCollaborations.map((item) => {
              const support = supportConfig[item.supportType];
              const SupportIcon = support.icon;

              const status = statusConfig[item.status];
              const StatusIcon = status.icon;

              return (
                <Link
                  key={item.id}
                  href={`/industry/collaborations/${item.id}`}
                  className="group"
                >
                  <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg">
                    {/* Top accent */}
                    <div className="h-1 bg-gradient-to-r from-teal-600 to-emerald-500" />

                    <div className="p-6">
                      {/* Header */}
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${support.iconBg}`}
                          >
                            <SupportIcon
                              className={`h-5 w-5 ${support.iconColor}`}
                            />
                          </div>

                          <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold tracking-wide text-slate-500">
                                {item.id}
                              </span>

                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${status.bg} ${status.text} ${status.border}`}
                              >
                                <StatusIcon className="h-3 w-3" />
                                {item.status}
                              </span>
                            </div>

                            <h3 className="text-lg font-bold tracking-tight text-slate-900 transition group-hover:text-teal-700">
                              {item.project}
                            </h3>

                            <p className="mt-1 max-w-2xl text-sm text-slate-500">
                              {item.problem}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                          <span className="text-xs text-slate-400">
                            Support
                          </span>

                          <span className="text-sm font-bold text-slate-800">
                            {item.amount}
                          </span>

                          <ArrowRight className="ml-1 h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-teal-600" />
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="mt-6 grid gap-4 border-y border-slate-100 py-5 sm:grid-cols-2 lg:grid-cols-4">
                        <MetaBlock
                          label="University Partner"
                          value={item.university}
                        />

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Location
                          </p>

                          <div className="mt-1.5 flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-teal-600" />

                            <p className="text-sm font-semibold text-slate-700">
                              {item.location}
                            </p>
                          </div>
                        </div>

                        <MetaBlock
                          label="Support Area"
                          value={support.label}
                        />

                        <MetaBlock
                          label="Proposal Date"
                          value={item.submitted}
                        />
                      </div>

                      {/* Bottom */}
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Partnership Scope
                          </p>

                          <p className="mt-1.5 text-sm leading-6 text-slate-600">
                            {item.description}
                          </p>
                        </div>

                        <div className="w-full lg:w-72">
                          <div className="mb-2 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-semibold text-slate-500">
                                Project Progress
                              </p>
                            </div>

                            <span className="text-sm font-bold text-teal-700">
                              {item.progress}%
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 transition-all"
                              style={{
                                width: `${item.progress}%`,
                              }}
                            />
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400">
                              {status.description}
                            </span>

                            <span className="text-xs font-semibold text-teal-700">
                              View workspace →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Collaboration model */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
              Collaboration Model
            </p>

            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">
              More than just funding
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Industry partners can contribute resources, expertise and
              real-world validation at different stages of innovation.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SupportCard
              icon={CircleDollarSign}
              title="Funding"
              description="Provide financial support for prototype development, testing or deployment."
              iconBg="bg-amber-50"
              iconColor="text-amber-700"
            />

            <SupportCard
              icon={Users}
              title="Mentorship"
              description="Share industry expertise, product guidance and domain knowledge."
              iconBg="bg-teal-50"
              iconColor="text-teal-700"
            />

            <SupportCard
              icon={FlaskConical}
              title="Testing & Pilot"
              description="Help validate solutions through controlled testing and real-world pilots."
              iconBg="bg-sky-50"
              iconColor="text-sky-700"
            />

            <SupportCard
              icon={Wrench}
              title="Technology"
              description="Support prototyping, engineering, infrastructure and technical development."
              iconBg="bg-emerald-50"
              iconColor="text-emerald-700"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-400">
                Grow Your Innovation Portfolio
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
                Find your next high-impact collaboration.
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Discover university-led projects and contribute funding,
                expertise, technology or field support where it can create
                measurable community impact.
              </p>
            </div>

            <Link
              href="/industry/projects"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-500"
            >
              Explore Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>© 2026 SamadhanX • Ideas → Action → Impact</p>

          <p>Industry Innovation Network</p>
        </div>
      </footer>
    </main>
  );
}

function OverviewCard({
  label,
  value,
  description,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string;
  description: string;
  icon: typeof Handshake;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

function MetaBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold leading-5 text-slate-700">
        {value}
      </p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-400 focus:bg-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "All" ? `All ${label.replace("Collaboration ", "").replace("Support ", "")}` : option}
          </option>
        ))}
      </select>
    </div>
  );
}

function SupportCard({
  icon: Icon,
  title,
  description,
  iconBg,
  iconColor,
}: {
  icon: typeof Wrench;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}
      >
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-1.5 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}