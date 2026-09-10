"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  Handshake,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

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
  description: string;
  solution: string;
  useOfFunds: string[];
  milestones: {
    title: string;
    percentage: number;
    description: string;
  }[];
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
    description:
      "A technology-enabled road monitoring system that combines citizen reports, geo-tagged images and automated damage classification to help authorities identify and prioritize road maintenance.",
    solution:
      "Citizens or field teams submit road images with location information. The system identifies damage such as potholes and cracks, estimates severity and places the issue on a monitoring dashboard for maintenance planning.",
    useOfFunds: [
      "Prototype hardware and field devices",
      "Computer vision model improvement",
      "Pilot deployment and field testing",
      "Dashboard and monitoring infrastructure",
    ],
    milestones: [
      {
        title: "Prototype Validation",
        percentage: 25,
        description: "Validate detection accuracy with sample road images.",
      },
      {
        title: "Field Pilot",
        percentage: 35,
        description: "Deploy the system across selected road segments.",
      },
      {
        title: "Performance Evaluation",
        percentage: 20,
        description: "Evaluate detection accuracy and response improvement.",
      },
      {
        title: "Deployment",
        percentage: 20,
        description: "Prepare the solution for wider government deployment.",
      },
    ],
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
    description:
      "A low-cost community water monitoring network designed to combine sensor readings and citizen observations for better visibility into local water conditions.",
    solution:
      "Sensors collect selected water and supply indicators and transmit readings to a monitoring dashboard. Threshold-based alerts help identify unusual readings and supply interruptions.",
    useOfFunds: [
      "Water monitoring sensors",
      "Prototype deployment",
      "Data collection infrastructure",
      "Community field pilot",
    ],
    milestones: [
      {
        title: "Sensor Prototype",
        percentage: 25,
        description: "Finalize and validate the monitoring sensor unit.",
      },
      {
        title: "Community Deployment",
        percentage: 35,
        description: "Deploy monitoring units at selected locations.",
      },
      {
        title: "Data Validation",
        percentage: 20,
        description: "Validate readings against field observations.",
      },
      {
        title: "Pilot Expansion",
        percentage: 20,
        description: "Expand the validated system to additional locations.",
      },
    ],
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
    description:
      "A modular and low-cost sanitation deployment model designed for communities where conventional infrastructure is difficult or expensive to establish.",
    solution:
      "The project combines site assessment, modular sanitation units, hygiene planning and maintenance tracking to create a practical deployment model for rural communities.",
    useOfFunds: [
      "Modular sanitation units",
      "Manufacturing and assembly",
      "Village-level deployment",
      "Maintenance and monitoring",
    ],
    milestones: [
      {
        title: "Design Finalization",
        percentage: 20,
        description: "Finalize the modular unit design.",
      },
      {
        title: "Prototype Deployment",
        percentage: 30,
        description: "Deploy prototype units in selected communities.",
      },
      {
        title: "Field Validation",
        percentage: 25,
        description: "Evaluate usage, maintenance and community feedback.",
      },
      {
        title: "Scale Deployment",
        percentage: 25,
        description: "Prepare the model for larger deployment.",
      },
    ],
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
    description:
      "A solar street lighting solution designed for locations where reliable grid connectivity is limited.",
    solution:
      "Solar panels charge a battery during the day, while the stored energy powers LED lighting at night. Remote status monitoring can help identify battery or lighting faults.",
    useOfFunds: [
      "Solar lighting prototype",
      "Battery and controller hardware",
      "Remote monitoring system",
      "Field installation and testing",
    ],
    milestones: [
      {
        title: "Hardware Prototype",
        percentage: 25,
        description: "Build and validate the first prototype.",
      },
      {
        title: "Installation Pilot",
        percentage: 30,
        description: "Install units at selected locations.",
      },
      {
        title: "Energy Validation",
        percentage: 20,
        description: "Evaluate energy performance and battery health.",
      },
      {
        title: "Deployment Readiness",
        percentage: 25,
        description: "Prepare the solution for wider deployment.",
      },
    ],
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
    description:
      "A research and prototype initiative focused on developing lower-cost road repair material using locally available and recycled components.",
    solution:
      "Candidate material mixes are prepared and tested for strength, durability and cost. The best-performing mix can then move toward controlled field validation.",
    useOfFunds: [
      "Material research",
      "Laboratory testing",
      "Prototype preparation",
      "Field validation",
    ],
    milestones: [
      {
        title: "Material Research",
        percentage: 25,
        description: "Identify suitable locally available materials.",
      },
      {
        title: "Laboratory Testing",
        percentage: 30,
        description: "Test strength and durability of candidate mixes.",
      },
      {
        title: "Prototype Validation",
        percentage: 20,
        description: "Validate the selected formulation.",
      },
      {
        title: "Field Trial",
        percentage: 25,
        description: "Conduct controlled field testing.",
      },
    ],
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
    description:
      "A solar-powered irrigation solution combining pump control, water-level monitoring and scheduling for rural agricultural use.",
    solution:
      "Solar energy powers the irrigation pump while water-level information helps control pumping and scheduling, reducing unnecessary water and energy use.",
    useOfFunds: [
      "Solar pump hardware",
      "Water-level sensors",
      "Controller development",
      "Field pilot deployment",
    ],
    milestones: [
      {
        title: "Pump Prototype",
        percentage: 25,
        description: "Build and validate the solar pump setup.",
      },
      {
        title: "Sensor Integration",
        percentage: 25,
        description: "Integrate water-level monitoring.",
      },
      {
        title: "Farm Pilot",
        percentage: 25,
        description: "Deploy the system at selected farms.",
      },
      {
        title: "Impact Validation",
        percentage: 25,
        description: "Measure water and energy efficiency.",
      },
    ],
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
    description:
      "A lightweight digital platform helping citizens discover nearby healthcare services and access appointment or referral information.",
    solution:
      "Citizens select their healthcare requirement and the platform surfaces suitable local services, providers and referral options.",
    useOfFunds: [
      "Platform development",
      "Healthcare resource integration",
      "Pilot deployment",
      "User testing",
    ],
    milestones: [
      {
        title: "Platform Development",
        percentage: 25,
        description: "Build the core service discovery platform.",
      },
      {
        title: "Provider Integration",
        percentage: 25,
        description: "Connect local healthcare resources.",
      },
      {
        title: "Pilot Testing",
        percentage: 25,
        description: "Validate the platform with target users.",
      },
      {
        title: "Deployment",
        percentage: 25,
        description: "Prepare for wider community deployment.",
      },
    ],
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
    description:
      "A local flood monitoring system combining rainfall and water-level information with threshold-based risk alerts.",
    solution:
      "Monitoring inputs are collected and evaluated against defined thresholds. When risk conditions increase, the system can surface warnings through the monitoring dashboard.",
    useOfFunds: [
      "Rainfall monitoring hardware",
      "Water-level sensors",
      "Risk dashboard",
      "Field validation",
    ],
    milestones: [
      {
        title: "Monitoring Setup",
        percentage: 25,
        description: "Install and validate monitoring equipment.",
      },
      {
        title: "Risk Model",
        percentage: 25,
        description: "Configure threshold-based risk indicators.",
      },
      {
        title: "Field Validation",
        percentage: 25,
        description: "Validate alerts against field conditions.",
      },
      {
        title: "Pilot Deployment",
        percentage: 25,
        description: "Deploy the validated system in the pilot area.",
      },
    ],
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

export default function InvestmentDetailPage() {
  const params = useParams();
  const router = useRouter();

  const investmentId = String(params.id);

  const opportunity =
    opportunities.find((item) => item.id === investmentId) ??
    opportunities[0];

  const remaining =
    opportunity.fundingRequired - opportunity.fundingReceived;

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const fundingPercent = Math.min(
    100,
    Math.round(
      (opportunity.fundingReceived / opportunity.fundingRequired) * 100
    )
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setStep(4);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-100 text-slate-900">
       
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

        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 size={34} className="text-emerald-600" />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-emerald-600">
              Proposal Submitted
            </p>

            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Investment proposal submitted successfully
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500">
              Your proposal has been recorded for review. The university and
              relevant stakeholders can now evaluate the proposal before any
              agreement or funding commitment is finalized.
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">
              <DetailRow
                label="Project"
                value={opportunity.title}
              />
              <DetailRow
                label="Proposal Amount"
                value={formatCurrency(Number(amount))}
              />
              <DetailRow
                label="Status"
                value="Under Review"
              />
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/industry/investments"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Back to Investments
              </Link>

              <button
                type="button"
                onClick={() =>
                  router.push(`/industry/investments/${opportunity.id}`)
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
              >
                View Proposal
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/industry/dashboard"
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
              <Handshake size={19} />
            </div>

            <div>
              <p className="text-base font-bold tracking-tight text-slate-900">
                SamadhanX
              </p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
                Industry Portal
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <Link
              href="/industry/dashboard"
              className="transition hover:text-teal-700"
            >
              Dashboard
            </Link>

            <Link
              href="/industry/projects"
              className="transition hover:text-teal-700"
            >
              Projects
            </Link>

            <Link
              href="/industry/collaborations"
              className="transition hover:text-teal-700"
            >
              Collaborations
            </Link>

            <Link
              href="/industry/investments"
              className="text-teal-700"
            >
              Investments
            </Link>

            <Link
              href="/industry/profile"
              className="transition hover:text-teal-700"
            >
              Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="border-b border-teal-900 bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950">
        <div className="mx-auto max-w-7xl px-6 py-9">
          <Link
            href="/industry/investments"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-teal-100 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Investment Opportunities
          </Link>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-teal-700 bg-teal-900/70 px-3 py-1 text-xs font-bold text-teal-100">
                  {opportunity.id}
                </span>

                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                  {opportunity.projectId}
                </span>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                  Investment Opportunity
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {opportunity.title}
              </h1>

              <p className="mt-3 text-sm leading-6 text-teal-100/80 sm:text-base">
                Evaluate the project, review its funding requirement and submit
                a structured investment proposal.
              </p>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-teal-100/80">
                <span className="flex items-center gap-2">
                  <Building2 size={15} />
                  {opportunity.university}
                </span>

                <span className="flex items-center gap-2">
                  <MapPin size={15} />
                  {opportunity.location}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur lg:min-w-[260px]">
              <p className="text-xs text-teal-100/70">
                Funding Requirement
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {formatCurrency(opportunity.fundingRequired)}
              </p>

              <p className="mt-1 text-xs text-teal-100/60">
                {formatCurrency(remaining)} remaining
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="grid gap-3 sm:grid-cols-4">
            <WorkflowStep
              number="01"
              title="Evaluate"
              active={step >= 1}
              icon={Lightbulb}
            />
            <WorkflowStep
              number="02"
              title="Proposal"
              active={step >= 2}
              icon={FileCheck2}
            />
            <WorkflowStep
              number="03"
              title="Review"
              active={step >= 3}
              icon={ShieldCheck}
            />
            <WorkflowStep
              number="04"
              title="Agreement"
              active={step >= 4}
              icon={Handshake}
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_370px]">
          {/* Left */}
          <div className="space-y-6">
            {/* Overview */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <SectionHeading
                icon={Lightbulb}
                eyebrow="Project Overview"
                title="What is being built?"
              />

              <p className="mt-5 text-sm leading-7 text-slate-600">
                {opportunity.description}
              </p>

              <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/70 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Proposed Solution
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {opportunity.solution}
                </p>
              </div>
            </section>

            {/* Problem */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <SectionHeading
                icon={Target}
                eyebrow="Community Challenge"
                title="Problem being addressed"
              />

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-base font-bold leading-6 text-slate-900">
                  {opportunity.problem}
                </p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <MiniStat
                  icon={TrendingUp}
                  label="Project Progress"
                  value={`${opportunity.progress}%`}
                />

                <MiniStat
                  icon={CircleDollarSign}
                  label="Funding Received"
                  value={formatCurrency(opportunity.fundingReceived)}
                />

                <MiniStat
                  icon={Clock3}
                  label="Current Stage"
                  value={opportunity.stage}
                />
              </div>
            </section>

            {/* Use of Funds */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <SectionHeading
                icon={CircleDollarSign}
                eyebrow="Funding Plan"
                title="How investment will be used"
              />

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {opportunity.useOfFunds.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />

                    <span className="text-sm leading-5 text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Milestones */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <SectionHeading
                icon={TrendingUp}
                eyebrow="Milestone Funding"
                title="Investment release plan"
              />

              <p className="mt-2 text-sm leading-6 text-slate-500">
                In a production workflow, funding can be released against
                agreed milestones instead of as a single upfront payment.
              </p>

              <div className="mt-6 space-y-4">
                {opportunity.milestones.map((milestone, index) => (
                  <div
                    key={milestone.title}
                    className="relative flex gap-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                      {index + 1}
                    </div>

                    <div className="flex-1 rounded-2xl border border-slate-200 p-4">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <h3 className="text-sm font-bold text-slate-900">
                          {milestone.title}
                        </h3>

                        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700">
                          {milestone.percentage}% funding
                        </span>
                      </div>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Proposal Form */}
            <section className="rounded-3xl border border-teal-200 bg-white p-6 shadow-sm sm:p-7">
              <SectionHeading
                icon={FileCheck2}
                eyebrow="Investment Proposal"
                title="Submit your support proposal"
              />

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This form records your interest and proposed commitment. It
                does not initiate a payment.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Proposed Investment Amount
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      ₹
                    </span>

                    <input
                      type="number"
                      min={opportunity.minimumCommitment}
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      placeholder={`Minimum ${formatCurrency(
                        opportunity.minimumCommitment
                      )}`}
                      required
                      className="w-full rounded-xl border border-slate-300 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>

                  <p className="mt-1.5 text-xs text-slate-400">
                    Minimum proposed commitment:{" "}
                    {formatCurrency(opportunity.minimumCommitment)}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Area of Interest
                  </label>

                  <select
                    value={interest}
                    onChange={(event) => setInterest(event.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="">Select support area</option>
                    <option value="Funding">Funding</option>
                    <option value="Technical Support">
                      Technical Support
                    </option>
                    <option value="Testing">Testing & Validation</option>
                    <option value="Prototyping">
                      Prototyping / Manufacturing
                    </option>
                    <option value="Field Pilot">Field Pilot</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Proposal Note
                  </label>

                  <textarea
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value)
                    }
                    placeholder="Describe your intended support, expectations or any questions for the project team..."
                    rows={6}
                    required
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex gap-3">
                    <ShieldCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-amber-700"
                    />

                    <p className="text-xs leading-5 text-amber-900/80">
                      Submitting this proposal does not transfer money.
                      Financial commitment will only happen after review,
                      approval and a formal agreement.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-teal-800"
                >
                  Submit Investment Proposal
                  <ArrowRight size={17} />
                </button>
              </form>
            </section>
          </div>

          {/* Right */}
          <aside className="space-y-5">
            {/* Funding Summary */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Funding Summary
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {formatCurrency(opportunity.fundingRequired)}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Total funding requirement
              </p>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-teal-600"
                  style={{ width: `${fundingPercent}%` }}
                />
              </div>

              <div className="mt-3 flex justify-between text-xs">
                <span className="text-slate-500">
                  {formatCurrency(opportunity.fundingReceived)} received
                </span>

                <span className="font-bold text-teal-700">
                  {fundingPercent}%
                </span>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">
                  Funding still required
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {formatCurrency(remaining)}
                </p>
              </div>
            </section>

            {/* Project Information */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Project Information
              </p>

              <div className="mt-5 space-y-4">
                <InfoRow
                  icon={Building2}
                  label="University"
                  value={opportunity.university}
                />

                <InfoRow
                  icon={MapPin}
                  label="Location"
                  value={opportunity.location}
                />

                <InfoRow
                  icon={BriefcaseIcon}
                  label="Category"
                  value={opportunity.category}
                />

                <InfoRow
                  icon={Clock3}
                  label="Stage"
                  value={opportunity.stage}
                />

                <InfoRow
                  icon={TrendingUp}
                  label="Progress"
                  value={`${opportunity.progress}%`}
                />
              </div>
            </section>

            {/* Expected Impact */}
            <section className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <Target size={19} className="text-emerald-700" />
              </div>

              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-emerald-700">
                Expected Impact
              </p>

              <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
                {opportunity.expectedImpact}
              </p>
            </section>

            {/* Stakeholders */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Stakeholders
              </p>

              <div className="mt-5 space-y-3">
                <Stakeholder
                  icon={Building2}
                  title="University"
                  text="Research & solution development"
                />

                <Stakeholder
                  icon={Users}
                  title="Industry"
                  text="Funding & technical support"
                />

                <Stakeholder
                  icon={ShieldCheck}
                  title="Government"
                  text="Validation & deployment oversight"
                />
              </div>
            </section>

            {/* Documents */}
            <Link
              href={`/industry/collaborations/${opportunity.id.replace(
                "INV",
                "COL"
              )}/documents`}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:bg-teal-50"
            >
              <span className="flex items-center gap-3">
                <FileCheck2 size={18} className="text-teal-700" />

                <span>
                  <span className="block text-sm font-bold text-slate-800">
                    Project Documents
                  </span>

                  <span className="block text-xs text-slate-400">
                    Proposal, technical and funding records
                  </span>
                </span>
              </span>

              <ArrowRight size={16} className="text-slate-400" />
            </Link>
          </aside>
        </div>
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

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: typeof Lightbulb;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100">
        <Icon size={19} className="text-teal-700" />
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900">
          {title}
        </h2>
      </div>
    </div>
  );
}

function WorkflowStep({
  number,
  title,
  active,
  icon: Icon,
}: {
  number: string;
  title: string;
  active: boolean;
  icon: typeof Lightbulb;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
        active
          ? "border-teal-200 bg-teal-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          active ? "bg-teal-700 text-white" : "bg-white text-slate-400"
        }`}
      >
        <Icon size={16} />
      </div>

      <div>
        <p
          className={`text-[10px] font-bold ${
            active ? "text-teal-700" : "text-slate-400"
          }`}
        >
          {number}
        </p>

        <p
          className={`text-sm font-semibold ${
            active ? "text-slate-900" : "text-slate-500"
          }`}
        >
          {title}
        </p>
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <Icon size={17} className="text-teal-700" />

      <p className="mt-3 text-xs text-slate-400">{label}</p>

      <p className="mt-1 text-sm font-bold leading-5 text-slate-800">
        {value}
      </p>
    </div>
  );
}

function InfoRow({
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

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-200 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-right text-sm font-bold text-slate-800">
        {value}
      </span>
    </div>
  );
}

function Stakeholder({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Building2;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50">
        <Icon size={16} className="text-teal-700" />
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="mt-0.5 text-xs text-slate-500">{text}</p>
      </div>
    </div>
  );
}

function BriefcaseIcon({
  size,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return <BriefcaseBusiness size={size} className={className} />;
}