"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Handshake,
  Lightbulb,
  MapPin,
  Search,
  ShieldCheck,
  Target,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";

type CollaborationType =
  | "Funding"
  | "Mentorship"
  | "Testing"
  | "Prototyping"
  | "Field Pilot"
  | "Technical Support";

type CollaborationStatus =
  | "Active"
  | "Pending"
  | "Completed"
  | "Declined";

interface Collaboration {
  id: string;
  company: string;
  project: string;
  problem: string;
  university: string;
  district: string;
  type: CollaborationType;
  status: CollaborationStatus;
  amount: number;
  progress: number;
  startDate: string;
  description: string;
}

const collaborations: Collaboration[] = [
  {
    id: "COL-001",
    company: "Tata Technologies",
    project: "Smart Road Monitoring Pilot",
    problem: "Poor road conditions and delayed maintenance",
    university: "Birla Institute of Technology, Mesra",
    district: "Ranchi",
    type: "Technical Support",
    status: "Active",
    amount: 850000,
    progress: 72,
    startDate: "12 Aug 2026",
    description:
      "Industry team is supporting IoT-based road condition monitoring and technical deployment.",
  },
  {
    id: "COL-002",
    company: "Jharkhand Innovation Labs",
    project: "Community Water Monitoring",
    problem: "Unsafe and irregular drinking water supply",
    university: "National Institute of Technology, Jamshedpur",
    district: "Jamshedpur",
    type: "Field Pilot",
    status: "Active",
    amount: 620000,
    progress: 58,
    startDate: "04 Aug 2026",
    description:
      "Industry partner is supporting field testing of low-cost water quality monitoring devices.",
  },
  {
    id: "COL-003",
    company: "TechServe Foundation",
    project: "Rural Sanitation Deployment",
    problem: "Limited sanitation infrastructure in rural areas",
    university: "Central University of Jharkhand",
    district: "Dhanbad",
    type: "Funding",
    status: "Active",
    amount: 1200000,
    progress: 81,
    startDate: "20 Jul 2026",
    description:
      "CSR funding is supporting prototype deployment and community-level implementation.",
  },
  {
    id: "COL-004",
    company: "GreenGrid Solutions",
    project: "Solar Street Infrastructure",
    problem: "Poor lighting in semi-urban areas",
    university: "Birla Institute of Technology, Mesra",
    district: "Bokaro",
    type: "Prototyping",
    status: "Pending",
    amount: 450000,
    progress: 34,
    startDate: "28 Aug 2026",
    description:
      "Industry partner has proposed prototyping support for an energy-efficient street lighting solution.",
  },
  {
    id: "COL-005",
    company: "CivicTech Systems",
    project: "Citizen Complaint Analytics",
    problem: "Delayed identification of recurring civic issues",
    university: "National Institute of Technology, Jamshedpur",
    district: "Hazaribagh",
    type: "Mentorship",
    status: "Completed",
    amount: 300000,
    progress: 100,
    startDate: "15 Jun 2026",
    description:
      "Industry mentors supported the university team in building the analytics workflow.",
  },
  {
    id: "COL-006",
    company: "BuildSmart Industries",
    project: "Low-Cost Road Repair Material",
    problem: "High cost and slow road repair cycles",
    university: "Birla Institute of Technology, Mesra",
    district: "Deoghar",
    type: "Testing",
    status: "Pending",
    amount: 275000,
    progress: 21,
    startDate: "01 Sep 2026",
    description:
      "Testing support is proposed for validating the durability of a low-cost road repair material.",
  },
];

const collaborationTypes: CollaborationType[] = [
  "Funding",
  "Mentorship",
  "Testing",
  "Prototyping",
  "Field Pilot",
  "Technical Support",
];

export default function GovernmentCollaborationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | CollaborationStatus>(
    "All"
  );
  const [typeFilter, setTypeFilter] = useState<"All" | CollaborationType>(
    "All"
  );

  const filteredCollaborations = useMemo(() => {
    const query = search.toLowerCase().trim();

    return collaborations.filter((item) => {
      const matchesSearch =
        !query ||
        item.company.toLowerCase().includes(query) ||
        item.project.toLowerCase().includes(query) ||
        item.problem.toLowerCase().includes(query) ||
        item.university.toLowerCase().includes(query) ||
        item.district.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesType =
        typeFilter === "All" || item.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, statusFilter, typeFilter]);

  const totalFunding = collaborations.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const activeCount = collaborations.filter(
    (item) => item.status === "Active"
  ).length;

  const pendingCount = collaborations.filter(
    (item) => item.status === "Pending"
  ).length;

  const completedCount = collaborations.filter(
    (item) => item.status === "Completed"
  ).length;

  const activeFunding = collaborations
    .filter((item) => item.status === "Active")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 text-white shadow-sm">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative px-6 py-7 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                  <Handshake size={24} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={13} className="text-teal-100" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-100">
                      Industry Intelligence
                    </p>
                  </div>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                    Industry Collaboration
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-teal-50">
                    Monitor industry participation, funding, mentorship,
                    testing and pilot activities supporting university-led
                    innovation projects.
                  </p>
                </div>
              </div>

              <div className="grid shrink-0 grid-cols-2 gap-3">
                <div className="min-w-[135px] rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-teal-100">
                    Active
                  </p>
                  <p className="mt-1 text-2xl font-bold">{activeCount}</p>
                  <p className="mt-1 text-[10px] text-teal-100">
                    Collaborations
                  </p>
                </div>

                <div className="min-w-[135px] rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-teal-100">
                    Funding
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    ₹{(totalFunding / 100000).toFixed(1)}L
                  </p>
                  <p className="mt-1 text-[10px] text-teal-100">
                    Total committed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SUMMARY */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={Handshake}
            label="Total Collaborations"
            value={collaborations.length}
            description="Industry partnerships"
          />

          <SummaryCard
            icon={Activity}
            label="Active"
            value={activeCount}
            description="Currently supporting projects"
          />

          <SummaryCard
            icon={Clock3}
            label="Pending"
            value={pendingCount}
            description="Awaiting collaboration"
          />

          <SummaryCard
            icon={CheckCircle2}
            label="Completed"
            value={completedCount}
            description="Successfully completed"
          />
        </div>
      </div>

      {/* FUNDING + SUPPORT */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Wallet size={19} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-600">
                  Industry Support
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Collaboration Overview
                </h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <MiniMetric
                label="Total Funding"
                value={`₹${(totalFunding / 100000).toFixed(1)}L`}
              />
              <MiniMetric
                label="Active Funding"
                value={`₹${(activeFunding / 100000).toFixed(1)}L`}
              />
              <MiniMetric
                label="Avg. Progress"
                value={`${Math.round(
                  collaborations.reduce(
                    (sum, item) => sum + item.progress,
                    0
                  ) / collaborations.length
                )}%`}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-600">
              Support Types
            </p>

            <div className="mt-4 space-y-3">
              {collaborationTypes.map((type) => {
                const count = collaborations.filter(
                  (item) => item.type === type
                ).length;

                return (
                  <div
                    key={type}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                  >
                    <span className="text-xs font-medium text-slate-700">
                      {type}
                    </span>
                    <span className="text-xs font-bold text-teal-700">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-600">
                Collaboration Registry
              </p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Industry Partnerships
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search company, project..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100 sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "All" | CollaborationStatus
                  )
                }
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-teal-400"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Declined">Declined</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(
                    e.target.value as "All" | CollaborationType
                  )
                }
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-teal-400"
              >
                <option value="All">All Support Types</option>
                {collaborationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Industry Partner
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Project
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    University / District
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Support
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Funding
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Progress
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCollaborations.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {item.company}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-400">
                            {item.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="max-w-[220px] text-xs font-semibold text-slate-800">
                        {item.project}
                      </p>
                      <p className="mt-1 max-w-[220px] text-[10px] leading-4 text-slate-400">
                        {item.problem}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-xs font-medium text-slate-700">
                        {item.university}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                        <MapPin size={11} />
                        {item.district}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-lg bg-teal-50 px-2.5 py-1.5 text-[10px] font-bold text-teal-700">
                        {item.type}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-xs font-bold text-slate-800">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <div className="w-28">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-medium text-slate-500">
                            Progress
                          </span>
                          <span className="font-bold text-teal-700">
                            {item.progress}%
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-teal-600"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCollaborations.length === 0 && (
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <Search size={28} className="text-slate-300" />
                <p className="mt-3 text-sm font-bold text-slate-700">
                  No collaborations found
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </div>

          <p className="mt-3 text-[10px] text-slate-400">
            Showing {filteredCollaborations.length} of{" "}
            {collaborations.length} collaborations
          </p>
        </section>
      </div>

      {/* MONITORING ROLE */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Target size={19} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-600">
                Government Monitoring
              </p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Monitor Industry Participation
              </h2>
              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
                Government departments can track how industry partners are
                supporting university-led projects, monitor funding and
                technical assistance, and identify collaborations requiring
                attention.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <MonitoringCard
              icon={Wallet}
              title="Funding Tracking"
              description="Monitor committed funding and financial support across projects."
            />

            <MonitoringCard
              icon={Users}
              title="Technical Support"
              description="Track mentorship, engineering support, testing and prototyping."
            />

            <MonitoringCard
              icon={Lightbulb}
              title="Pilot & Impact"
              description="Monitor field pilots and industry-supported deployment progress."
            />
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="mt-2 border-t border-slate-200 py-4 text-center text-[11px] text-slate-400">
        © 2026 SamadhanX • Ideas → Action → Impact
      </footer>
    </main>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <Icon size={18} />
        </div>

        <ArrowRight size={15} className="text-slate-300" />
      </div>

      <p className="mt-4 text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>

      <p className="mt-1 text-[10px] text-slate-400">{description}</p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: CollaborationStatus;
}) {
  const config = {
    Active: {
      icon: Activity,
      className: "bg-emerald-50 text-emerald-700",
    },
    Pending: {
      icon: Clock3,
      className: "bg-amber-50 text-amber-700",
    },
    Completed: {
      icon: CheckCircle2,
      className: "bg-teal-50 text-teal-700",
    },
    Declined: {
      icon: XCircle,
      className: "bg-red-50 text-red-700",
    },
  };

  const current = config[status];
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold ${current.className}`}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}

function MonitoringCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm">
        <Icon size={17} />
      </div>

      <h3 className="mt-3 text-sm font-bold text-slate-900">{title}</h3>

      <p className="mt-1 text-[11px] leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}