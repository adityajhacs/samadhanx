"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Filter,
  Handshake,
  Lightbulb,
  MapPin,
  Search,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

type InvestmentStatus =
  | "Open"
  | "Under Review"
  | "Partially Funded"
  | "Fully Funded";

type InvestmentOpportunity = {
  id: string;
  projectId: string;
  title: string;
  problem: string;
  category: string;
  university: string;
  location: string;
  stage: string;
  progress: number;
  fundingRequired: number;
  fundingReceived: number;
  minimumCommitment: number;
  expectedImpact: string;
  supportAreas: string[];
  status: InvestmentStatus;
};

const opportunities: InvestmentOpportunity[] = [
  {
    id: "INV-001",
    projectId: "PRJ-001",
    title: "Smart Road Monitoring Pilot",
    problem: "Road damage and delayed maintenance reporting",
    category: "Infrastructure",
    university: "Birla Institute of Technology, Mesra",
    location: "Ranchi, Jharkhand",
    stage: "Pilot / Validation",
    progress: 72,
    fundingRequired: 850000,
    fundingReceived: 500000,
    minimumCommitment: 100000,
    expectedImpact:
      "Faster road damage detection and improved maintenance response.",
    supportAreas: ["Funding", "Technical Support", "Field Pilot"],
    status: "Partially Funded",
  },
  {
    id: "INV-002",
    projectId: "PRJ-002",
    title: "Community Water Monitoring",
    problem: "Irregular water supply and quality monitoring",
    category: "Water",
    university: "National Institute of Technology, Jamshedpur",
    location: "Jamshedpur, Jharkhand",
    stage: "Project In Progress",
    progress: 58,
    fundingRequired: 620000,
    fundingReceived: 220000,
    minimumCommitment: 75000,
    expectedImpact:
      "Continuous water monitoring and faster identification of supply issues.",
    supportAreas: ["Funding", "Sensors", "Field Pilot"],
    status: "Open",
  },
  {
    id: "INV-003",
    projectId: "PRJ-003",
    title: "Rural Sanitation Deployment",
    problem: "Limited sanitation infrastructure in rural areas",
    category: "Sanitation",
    university: "Central University of Jharkhand",
    location: "Dhanbad, Jharkhand",
    stage: "Solution Proposed",
    progress: 81,
    fundingRequired: 1200000,
    fundingReceived: 750000,
    minimumCommitment: 150000,
    expectedImpact:
      "Affordable sanitation infrastructure for underserved rural communities.",
    supportAreas: ["Funding", "Manufacturing", "Field Deployment"],
    status: "Partially Funded",
  },
  {
    id: "INV-004",
    projectId: "PRJ-004",
    title: "Solar Street Infrastructure",
    problem: "Poor street lighting and unreliable grid connectivity",
    category: "Energy",
    university: "Birla Institute of Technology, Mesra",
    location: "Bokaro, Jharkhand",
    stage: "Project In Progress",
    progress: 34,
    fundingRequired: 450000,
    fundingReceived: 100000,
    minimumCommitment: 50000,
    expectedImpact:
      "Reliable solar-powered street lighting with remote monitoring.",
    supportAreas: ["Funding", "Prototyping", "Manufacturing"],
    status: "Open",
  },
  {
    id: "INV-005",
    projectId: "PRJ-006",
    title: "Low-Cost Road Repair Material",
    problem: "High cost of conventional road repair materials",
    category: "Infrastructure",
    university: "Birla Institute of Technology, Mesra",
    location: "Deoghar, Jharkhand",
    stage: "Solution Proposed",
    progress: 21,
    fundingRequired: 275000,
    fundingReceived: 75000,
    minimumCommitment: 25000,
    expectedImpact:
      "Lower road repair costs through locally available and recycled materials.",
    supportAreas: ["Funding", "Testing", "Manufacturing"],
    status: "Open",
  },
  {
    id: "INV-006",
    projectId: "PRJ-008",
    title: "Rural Solar Water Pumps",
    problem: "Limited reliable irrigation power in rural areas",
    category: "Agriculture",
    university: "National Institute of Technology, Jamshedpur",
    location: "Dumka, Jharkhand",
    stage: "Solution Proposed",
    progress: 27,
    fundingRequired: 750000,
    fundingReceived: 180000,
    minimumCommitment: 100000,
    expectedImpact:
      "Reliable solar-powered irrigation and improved water efficiency.",
    supportAreas: ["Funding", "Hardware", "Field Pilot"],
    status: "Open",
  },
  {
    id: "INV-007",
    projectId: "PRJ-009",
    title: "Digital Health Access Platform",
    problem: "Limited access to basic healthcare services",
    category: "Healthcare",
    university: "Central University of Jharkhand",
    location: "Hazaribagh, Jharkhand",
    stage: "Pilot / Validation",
    progress: 67,
    fundingRequired: 600000,
    fundingReceived: 600000,
    minimumCommitment: 100000,
    expectedImpact:
      "Improved access to local healthcare services and referrals.",
    supportAreas: ["Funding", "Technology", "Pilot"],
    status: "Fully Funded",
  },
  {
    id: "INV-008",
    projectId: "PRJ-010",
    title: "Flood Risk Monitoring System",
    problem: "Delayed flood alerts and limited local monitoring",
    category: "Environment",
    university: "Birla Institute of Technology, Mesra",
    location: "Giridih, Jharkhand",
    stage: "Project In Progress",
    progress: 52,
    fundingRequired: 580000,
    fundingReceived: 200000,
    minimumCommitment: 75000,
    expectedImpact:
      "Earlier flood warnings and better district-level preparedness.",
    supportAreas: ["Funding", "Sensors", "Testing"],
    status: "Open",
  },
];

const formatCurrency = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  return `₹${Math.round(amount / 1000)}K`;
};

const statusConfig: Record<
  InvestmentStatus,
  {
    bg: string;
    text: string;
    border: string;
  }
> = {
  Open: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  "Under Review": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  "Partially Funded": {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
  },
  "Fully Funded": {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
  },
};

export default function IndustryInvestmentsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState<InvestmentStatus | "All">("All");

  const categories = [
    "All",
    ...Array.from(new Set(opportunities.map((item) => item.category))),
  ];

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opportunity) => {
      const matchesSearch =
        opportunity.title.toLowerCase().includes(search.toLowerCase()) ||
        opportunity.problem.toLowerCase().includes(search.toLowerCase()) ||
        opportunity.university.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || opportunity.category === category;

      const matchesStatus =
        status === "All" || opportunity.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, category, status]);

  const totalRequired = opportunities.reduce(
    (sum, item) => sum + item.fundingRequired,
    0
  );

  const totalReceived = opportunities.reduce(
    (sum, item) => sum + item.fundingReceived,
    0
  );

  const openOpportunities = opportunities.filter(
    (item) => item.status === "Open"
  ).length;

  const fundingGap = totalRequired - totalReceived;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
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
         className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
      >
        Collaborations
      </Link>

      <Link
        href="/industry/investments"
        className="text-sm font-semibold text-teal-700"
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
      <section className="relative overflow-hidden border-b border-teal-900 bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950">
        <div className="mx-auto max-w-7xl px-6 py-11">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-700 bg-teal-900/70 px-3 py-1.5 text-xs font-semibold text-teal-100">
              <CircleDollarSign size={14} />
              Industry Investment Hub
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Invest in Innovation.
              <span className="block text-teal-100">
                Support Solutions That Matter.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-teal-100/80 sm:text-base">
              Discover university-led projects solving real community
              challenges and submit structured investment or funding proposals
              to support their journey from prototype to field impact.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <HeroStat
              icon={Lightbulb}
              value={String(opportunities.length)}
              label="Investment Opportunities"
            />

            <HeroStat
              icon={Target}
              value={String(openOpportunities)}
              label="Open for Investment"
            />

            <HeroStat
              icon={CircleDollarSign}
              value={formatCurrency(fundingGap)}
              label="Current Funding Gap"
            />

            <HeroStat
              icon={TrendingUp}
              value={formatCurrency(totalReceived)}
              label="Funding Committed"
            />
          </div>
        </div>
      </section>

      {/* Investment Process */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                How It Works
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                A structured investment process
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <ProcessStep number="01" title="Explore" />
              <ProcessStep number="02" title="Due Diligence" />
              <ProcessStep number="03" title="Proposal" />
              <ProcessStep number="04" title="Approval" />
              <ProcessStep number="05" title="Milestone Funding" />
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Heading */}
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Opportunities
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Projects Seeking Industry Support
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Evaluate funding requirements, project readiness and expected
              impact before submitting a proposal.
            </p>
          </div>

          <Link
            href="/industry/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-800"
          >
            Browse All Projects
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Filters */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_190px_190px_auto]">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search projects, problems or universities..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <FilterSelect
              value={category}
              onChange={setCategory}
              options={categories}
            />

            <FilterSelect
              value={status}
              onChange={(value) =>
                setStatus(value as InvestmentStatus | "All")
              }
              options={[
                "All",
                "Open",
                "Partially Funded",
                "Under Review",
                "Fully Funded",
              ]}
            />

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
                setStatus("All");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
            >
              <Filter size={16} />
              Reset
            </button>
          </div>
        </section>

        {/* Cards */}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {filteredOpportunities.map((opportunity) => {
            const remaining =
              opportunity.fundingRequired -
              opportunity.fundingReceived;

            const fundingPercent = Math.min(
              100,
              Math.round(
                (opportunity.fundingReceived /
                  opportunity.fundingRequired) *
                  100
              )
            );

            const statusStyle = statusConfig[opportunity.status];

            return (
              <article
                key={opportunity.id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg"
              >
                <div className="h-1.5 bg-gradient-to-r from-teal-600 to-emerald-500" />

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">
                          {opportunity.id}
                        </span>

                        <span className="text-xs text-slate-300">•</span>

                        <span className="text-xs font-semibold text-teal-700">
                          {opportunity.category}
                        </span>
                      </div>

                      <h3 className="mt-2 text-xl font-bold text-slate-900">
                        {opportunity.title}
                      </h3>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                    >
                      {opportunity.status}
                    </span>
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Community Challenge
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-5 text-slate-800">
                      {opportunity.problem}
                    </p>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <InfoItem
                      icon={Building2}
                      label="University"
                      value={opportunity.university}
                    />

                    <InfoItem
                      icon={MapPin}
                      label="Location"
                      value={opportunity.location}
                    />

                    <InfoItem
                      icon={BriefcaseBusiness}
                      label="Project Stage"
                      value={opportunity.stage}
                    />

                    <InfoItem
                      icon={Clock3}
                      label="Project Progress"
                      value={`${opportunity.progress}%`}
                    />
                  </div>

                  {/* Funding */}
                  <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/60 p-4">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                          Funding
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">
                          {formatCurrency(opportunity.fundingReceived)}
                          <span className="text-sm font-medium text-slate-400">
                            {" "}
                            / {formatCurrency(opportunity.fundingRequired)}
                          </span>
                        </p>
                      </div>

                      <span className="text-sm font-bold text-teal-700">
                        {fundingPercent}%
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-teal-600 transition-all"
                        style={{ width: `${fundingPercent}%` }}
                      />
                    </div>

                    <div className="mt-3 flex flex-col justify-between gap-1 text-xs text-slate-500 sm:flex-row">
                      <span>
                        Remaining requirement:{" "}
                        <strong className="text-slate-700">
                          {formatCurrency(remaining)}
                        </strong>
                      </span>

                      <span>
                        Minimum commitment:{" "}
                        <strong className="text-slate-700">
                          {formatCurrency(
                            opportunity.minimumCommitment
                          )}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Impact */}
                  <div className="mt-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Expected Impact
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {opportunity.expectedImpact}
                    </p>
                  </div>

                  {/* Support */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {opportunity.supportAreas.map((area) => (
                      <span
                        key={area}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
                      >
                        {area}
                      </span>
                    ))}
                  </div>

                  {/* Action */}
                  <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                    <Link
                      href={`/industry/investments/${opportunity.id}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                    >
                      View Opportunity
                      <ArrowRight size={16} />
                    </Link>

                    {opportunity.status !== "Fully Funded" && (
                      <Link
                        href={`/industry/investments/${opportunity.id}`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
                      >
                        Start Investment Proposal
                        <CircleDollarSign size={16} />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredOpportunities.length === 0 && (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Search size={21} className="text-slate-400" />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-900">
              No investment opportunities found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {/* Due Diligence */}
        <section className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100">
                <ShieldCheck size={21} className="text-teal-700" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                Review Before You Invest
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Every investment opportunity should be evaluated through a
                structured due-diligence process before financial commitment.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ReviewItem text="Project proposal and objectives" />
                <ReviewItem text="Technical feasibility" />
                <ReviewItem text="Funding requirement and budget" />
                <ReviewItem text="Prototype readiness" />
                <ReviewItem text="Expected social impact" />
                <ReviewItem text="Milestone and deployment plan" />
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 p-7 sm:p-8 lg:border-l lg:border-t-0">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Investment Principle
              </p>

              <p className="mt-4 text-2xl font-bold leading-9 text-slate-900">
                Funding follows{" "}
                <span className="text-teal-700">
                  verified progress.
                </span>
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                The production workflow can use milestone-based funding, where
                financial support is released after agreed project milestones
                and review checkpoints.
              </p>

              <div className="mt-6 rounded-2xl border border-teal-100 bg-white p-4">
                <div className="flex gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <p className="text-xs leading-5 text-slate-600">
                    Investment proposals do not trigger direct payment.
                    Approval, agreement and funding steps happen separately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-8 rounded-3xl bg-gradient-to-r from-teal-800 to-emerald-800 p-7 text-white shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-200">
                Industry Participation
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Turn capital into measurable community impact.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-teal-100/80">
                Support university innovation through funding, mentorship,
                testing, prototyping and field deployment.
              </p>
            </div>

            <Link
              href="/industry/projects"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-teal-800 transition hover:bg-teal-50"
            >
              Explore Projects
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-8 border-t border-slate-200 bg-white py-5 text-center">
        <p className="text-xs text-slate-400">
          © 2026 SamadhanX • Ideas → Action → Impact
        </p>
      </footer>
    </main>
  );
}

function HeroStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof CircleDollarSign;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
          <Icon size={17} className="text-teal-100" />
        </div>

        <div>
          <p className="text-xl font-bold text-white">{value}</p>
          <p className="text-xs text-teal-100/70">{label}</p>
        </div>
      </div>
    </div>
  );
}

function ProcessStep({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
      <span className="text-xs font-bold text-teal-700">{number}</span>
      <span className="text-xs font-semibold text-slate-700">
        {title}
      </span>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option === "All" ? "All Options" : option}
        </option>
      ))}
    </select>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon size={16} className="text-slate-500" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm font-semibold leading-5 text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

function ReviewItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
      <CheckCircle2
        size={15}
        className="shrink-0 text-emerald-600"
      />
      <span className="text-xs font-medium text-slate-600">
        {text}
      </span>
    </div>
  );
}