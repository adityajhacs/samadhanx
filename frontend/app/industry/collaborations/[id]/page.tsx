"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  FlaskConical,
  Handshake,
  MapPin,
  MessageSquare,
  Target,
  Users,
  Wrench,
} from "lucide-react";

type CollaborationStatus =
  | "Pending Review"
  | "Under Discussion"
  | "Active"
  | "Completed";

type CollaborationDetail = {
  id: string;
  projectId: string;
  project: string;
  problem: string;
  university: string;
  location: string;
  supportType: string;
  status: CollaborationStatus;
  commitment: string;
  progress: number;
  submitted: string;
  overview: string;
  supportScope: string;
  universityRole: string;
  industryRole: string;
  governmentRole: string;
  nextAction: string;
  milestones: {
    title: string;
    description: string;
    status: "Completed" | "Current" | "Upcoming";
    date: string;
  }[];
  activity: {
    title: string;
    description: string;
    date: string;
    completed: boolean;
  }[];
};

const collaborations: CollaborationDetail[] = [
  {
    id: "COL-001",
    projectId: "PRJ-001",
    project: "Smart Road Monitoring Pilot",
    problem: "Road damage and delayed maintenance reporting",
    university: "Birla Institute of Technology, Mesra",
    location: "Ranchi, Jharkhand",
    supportType: "Technical Support",
    status: "Active",
    commitment: "₹8.5L",
    progress: 72,
    submitted: "18 Aug 2026",
    overview:
      "A university-led smart road monitoring solution that uses image-based damage detection, geo-tagged reporting and a maintenance dashboard to help identify and prioritize road defects.",
    supportScope:
      "Industry support is focused on computer vision guidance, engineering expertise, testing infrastructure and field validation for the road monitoring prototype.",
    universityRole:
      "Develop the prototype, train and validate the detection workflow, manage research activities and coordinate field implementation.",
    industryRole:
      "Provide technical mentorship, testing infrastructure, engineering feedback and support for field validation.",
    governmentRole:
      "Validate the civic requirement, provide deployment context and monitor the project's progress and impact.",
    nextAction:
      "Complete the field validation cycle and submit performance results for the next milestone review.",
    milestones: [
      {
        title: "Problem & Requirements",
        description: "Challenge requirements and field conditions documented.",
        status: "Completed",
        date: "20 Aug 2026",
      },
      {
        title: "Prototype Development",
        description: "Initial damage detection and reporting workflow completed.",
        status: "Completed",
        date: "30 Aug 2026",
      },
      {
        title: "Field Validation",
        description: "Testing prototype on selected road segments.",
        status: "Current",
        date: "Sep 2026",
      },
      {
        title: "Pilot Evaluation",
        description: "Measure accuracy, reporting speed and operational usefulness.",
        status: "Upcoming",
        date: "Oct 2026",
      },
    ],
    activity: [
      {
        title: "Technical support confirmed",
        description: "Industry partner accepted the technical support scope.",
        date: "02 Sep 2026",
        completed: true,
      },
      {
        title: "Prototype review completed",
        description: "Initial prototype reviewed with the university team.",
        date: "04 Sep 2026",
        completed: true,
      },
      {
        title: "Field validation started",
        description: "Selected road segments moved into testing.",
        date: "07 Sep 2026",
        completed: true,
      },
      {
        title: "Next milestone review",
        description: "Performance results will be reviewed after field testing.",
        date: "15 Sep 2026",
        completed: false,
      },
    ],
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
    commitment: "₹6.2L",
    progress: 58,
    submitted: "14 Aug 2026",
    overview:
      "A community water monitoring prototype combining low-cost sensors with citizen reporting to create a clearer picture of local water availability and basic quality indicators.",
    supportScope:
      "Industry support covers pilot infrastructure, field testing, sensor deployment guidance and operational feedback.",
    universityRole:
      "Develop the monitoring system, analyse readings and coordinate technical validation.",
    industryRole:
      "Provide field infrastructure, testing support and operational expertise.",
    governmentRole:
      "Coordinate community-level deployment requirements and monitor service improvement.",
    nextAction:
      "Complete pilot installation and collect the first validation dataset.",
    milestones: [
      {
        title: "System Design",
        description: "Monitoring architecture and reporting requirements defined.",
        status: "Completed",
        date: "22 Aug 2026",
      },
      {
        title: "Prototype Assembly",
        description: "Initial sensor and reporting setup prepared.",
        status: "Completed",
        date: "31 Aug 2026",
      },
      {
        title: "Community Pilot",
        description: "Deploy monitoring setup at selected locations.",
        status: "Current",
        date: "Sep 2026",
      },
      {
        title: "Pilot Evaluation",
        description: "Review reliability and usefulness of collected data.",
        status: "Upcoming",
        date: "Oct 2026",
      },
    ],
    activity: [
      {
        title: "Pilot partnership confirmed",
        description: "Field pilot support approved.",
        date: "28 Aug 2026",
        completed: true,
      },
      {
        title: "Deployment locations shortlisted",
        description: "Initial community locations identified.",
        date: "02 Sep 2026",
        completed: true,
      },
      {
        title: "Pilot installation underway",
        description: "Sensor deployment and reporting setup in progress.",
        date: "08 Sep 2026",
        completed: false,
      },
    ],
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
    commitment: "₹12L",
    progress: 81,
    submitted: "25 Aug 2026",
    overview:
      "A low-cost modular sanitation solution designed for communities where conventional sanitation infrastructure is difficult or expensive to deploy.",
    supportScope:
      "The proposed partnership focuses on funding deployment preparation, manufacturing support and community-level validation.",
    universityRole:
      "Lead solution design, research validation and community assessment.",
    industryRole:
      "Evaluate funding proposal and support scaling, manufacturing and deployment planning.",
    governmentRole:
      "Validate community requirements and monitor deployment outcomes.",
    nextAction:
      "Finalize the support proposal and agree on deployment milestones.",
    milestones: [
      {
        title: "Community Assessment",
        description: "Sanitation requirements and deployment constraints documented.",
        status: "Completed",
        date: "18 Aug 2026",
      },
      {
        title: "Solution Prototype",
        description: "Modular sanitation design prepared.",
        status: "Completed",
        date: "26 Aug 2026",
      },
      {
        title: "Industry Review",
        description: "Funding and deployment proposal under discussion.",
        status: "Current",
        date: "Sep 2026",
      },
      {
        title: "Deployment Preparation",
        description: "Prepare manufacturing and community rollout plan.",
        status: "Upcoming",
        date: "Oct 2026",
      },
    ],
    activity: [
      {
        title: "Funding proposal submitted",
        description: "Industry support proposal submitted for review.",
        date: "25 Aug 2026",
        completed: true,
      },
      {
        title: "Project review completed",
        description: "Initial project and impact requirements reviewed.",
        date: "03 Sep 2026",
        completed: true,
      },
      {
        title: "Funding terms discussion",
        description: "Support scope and deployment requirements are being discussed.",
        date: "09 Sep 2026",
        completed: false,
      },
    ],
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
    commitment: "₹4.5L",
    progress: 34,
    submitted: "29 Aug 2026",
    overview:
      "A solar-powered street lighting prototype with battery storage and remote health monitoring for locations where reliable grid connectivity is limited.",
    supportScope:
      "Industry collaboration focuses on hardware engineering, prototyping, battery optimisation and remote monitoring.",
    universityRole:
      "Design and test the system architecture and energy management workflow.",
    industryRole:
      "Provide hardware expertise, components and engineering validation.",
    governmentRole:
      "Identify suitable locations and evaluate deployment feasibility.",
    nextAction:
      "Complete technical review of the proposed prototype and confirm the prototyping scope.",
    milestones: [
      {
        title: "Energy Requirements",
        description: "Lighting and energy requirements documented.",
        status: "Completed",
        date: "01 Sep 2026",
      },
      {
        title: "Hardware Design",
        description: "Initial solar and battery architecture prepared.",
        status: "Current",
        date: "Sep 2026",
      },
      {
        title: "Prototype Assembly",
        description: "Build the first working hardware unit.",
        status: "Upcoming",
        date: "Oct 2026",
      },
      {
        title: "Field Testing",
        description: "Validate performance under outdoor conditions.",
        status: "Upcoming",
        date: "Nov 2026",
      },
    ],
    activity: [
      {
        title: "Prototype proposal submitted",
        description: "Hardware collaboration proposal submitted.",
        date: "29 Aug 2026",
        completed: true,
      },
      {
        title: "Awaiting industry review",
        description: "Technical scope is waiting for partner review.",
        date: "09 Sep 2026",
        completed: false,
      },
    ],
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
    commitment: "₹3L",
    progress: 100,
    submitted: "05 Jul 2026",
    overview:
      "An analytics platform that groups recurring civic complaints, identifies district-level trends and helps stakeholders prioritise frequently reported community issues.",
    supportScope:
      "Industry mentorship covered analytics architecture, product design and translating data insights into decision-support workflows.",
    universityRole:
      "Develop the analytics workflow and validate the research approach.",
    industryRole:
      "Provide product and analytics mentorship.",
    governmentRole:
      "Validate use cases and assess how insights can support civic decision-making.",
    nextAction:
      "Completed. Project outcomes can be reviewed for future scaling opportunities.",
    milestones: [
      {
        title: "Requirements",
        description: "Analytics requirements documented.",
        status: "Completed",
        date: "12 Jul 2026",
      },
      {
        title: "Analytics Prototype",
        description: "Complaint categorisation and trend analysis implemented.",
        status: "Completed",
        date: "28 Jul 2026",
      },
      {
        title: "Dashboard Validation",
        description: "Decision-support views reviewed.",
        status: "Completed",
        date: "18 Aug 2026",
      },
      {
        title: "Project Completion",
        description: "Initial collaboration successfully completed.",
        status: "Completed",
        date: "30 Aug 2026",
      },
    ],
    activity: [
      {
        title: "Mentorship accepted",
        description: "Industry mentorship partnership started.",
        date: "10 Jul 2026",
        completed: true,
      },
      {
        title: "Analytics review",
        description: "Industry team reviewed the analytics workflow.",
        date: "18 Aug 2026",
        completed: true,
      },
      {
        title: "Collaboration completed",
        description: "Initial mentorship engagement completed.",
        date: "30 Aug 2026",
        completed: true,
      },
    ],
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
    commitment: "₹2.75L",
    progress: 21,
    submitted: "01 Sep 2026",
    overview:
      "A research prototype exploring locally available and recycled material combinations for a potentially lower-cost road repair solution.",
    supportScope:
      "Industry collaboration focuses on laboratory testing, material performance evaluation and cost comparison.",
    universityRole:
      "Develop material mixes and conduct research experiments.",
    industryRole:
      "Provide testing infrastructure and engineering expertise.",
    governmentRole:
      "Define road maintenance requirements and evaluate practical deployment conditions.",
    nextAction:
      "Review the proposed testing plan and approve the initial validation scope.",
    milestones: [
      {
        title: "Material Research",
        description: "Candidate material combinations identified.",
        status: "Completed",
        date: "04 Sep 2026",
      },
      {
        title: "Testing Plan",
        description: "Strength and durability testing methodology prepared.",
        status: "Current",
        date: "Sep 2026",
      },
      {
        title: "Laboratory Testing",
        description: "Prepare and test material samples.",
        status: "Upcoming",
        date: "Oct 2026",
      },
      {
        title: "Cost Comparison",
        description: "Compare performance and estimated material costs.",
        status: "Upcoming",
        date: "Nov 2026",
      },
    ],
    activity: [
      {
        title: "Testing request submitted",
        description: "Industry testing support requested.",
        date: "01 Sep 2026",
        completed: true,
      },
      {
        title: "Testing methodology shared",
        description: "University team shared the proposed testing workflow.",
        date: "06 Sep 2026",
        completed: false,
      },
    ],
  },
];

const statusOrder: CollaborationStatus[] = [
  "Pending Review",
  "Under Discussion",
  "Active",
  "Completed",
];

export default function CollaborationDetailPage() {
  const params = useParams<{ id: string }>();

  const collaboration =
    collaborations.find((item) => item.id === params.id) ??
    collaborations[0];

  const currentIndex = statusOrder.indexOf(collaboration.status);

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



      {/* Header */}
      <section className="border-b border-teal-900 bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Link
            href="/industry/collaborations"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-teal-200 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Collaborations
          </Link>

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-teal-100">
                  {collaboration.id}
                </span>

                <span className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-teal-100">
                  {collaboration.projectId}
                </span>

                <StatusBadge status={collaboration.status} />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {collaboration.project}
              </h1>

              <p className="mt-3 text-sm leading-6 text-teal-100/80 sm:text-base">
                {collaboration.problem}
              </p>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-teal-100/80">
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-teal-300" />
                  {collaboration.university}
                </span>

                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-teal-300" />
                  {collaboration.location}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-200">
                Support Commitment
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {collaboration.commitment}
              </p>

              <p className="mt-1 text-xs text-teal-100/70">
                {collaboration.supportType}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lifecycle */}
      <section className="mx-auto max-w-7xl px-6 pt-7">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Collaboration Lifecycle
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Partnership Progress
              </h2>
            </div>

            <span className="text-sm font-bold text-teal-700">
              {collaboration.progress}% project progress
            </span>
          </div>

          <div className="relative">
            <div className="absolute left-0 right-0 top-5 hidden h-0.5 bg-slate-200 md:block" />

            <div
              className="absolute left-0 top-5 hidden h-0.5 bg-teal-600 transition-all md:block"
              style={{
                width:
                  currentIndex <= 0
                    ? "0%"
                    : `${(currentIndex / (statusOrder.length - 1)) * 100}%`,
              }}
            />

            <div className="relative grid gap-5 md:grid-cols-4">
              {statusOrder.map((status, index) => {
                const completed = index <= currentIndex;
                const current = index === currentIndex;

                return (
                  <div key={status} className="flex gap-3 md:block">
                    <div
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white ${
                        completed
                          ? "bg-teal-600 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {completed ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-current" />
                      )}
                    </div>

                    <div className="pt-1 md:mt-3 md:pt-0">
                      <p
                        className={`text-xs font-bold ${
                          current
                            ? "text-teal-700"
                            : completed
                              ? "text-slate-700"
                              : "text-slate-400"
                        }`}
                      >
                        {status}
                      </p>

                      <p className="mt-1 text-[11px] leading-4 text-slate-400">
                        {getLifecycleDescription(status)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-7 lg:grid-cols-[1fr_340px]">
        {/* Left */}
        <div className="space-y-6">
          {/* Overview */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              icon={Handshake}
              label="Collaboration Overview"
            />

            <p className="mt-5 text-sm leading-7 text-slate-600">
              {collaboration.overview}
            </p>

            <div className="mt-6 rounded-xl border border-teal-100 bg-teal-50/60 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Collaboration Scope
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {collaboration.supportScope}
              </p>
            </div>
          </section>

          {/* Roles */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              icon={Users}
              label="Partnership Responsibilities"
            />

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <RoleCard
                title="University"
                subtitle="Solution Development"
                description={collaboration.universityRole}
                icon={Building2}
                iconBg="bg-teal-50"
                iconColor="text-teal-700"
              />

              <RoleCard
                title="Industry"
                subtitle="Support & Expertise"
                description={collaboration.industryRole}
                icon={Wrench}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-700"
              />

              <RoleCard
                title="Government"
                subtitle="Validation & Oversight"
                description={collaboration.governmentRole}
                icon={Target}
                iconBg="bg-sky-50"
                iconColor="text-sky-700"
              />
            </div>
          </section>

          {/* Milestones */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <SectionHeading
                icon={Target}
                label="Project Milestones"
              />

              <span className="text-xs font-semibold text-slate-400">
                {collaboration.progress}% complete
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {collaboration.milestones.map((milestone, index) => (
                <div
                  key={milestone.title}
                  className={`relative rounded-xl border p-4 ${
                    milestone.status === "Current"
                      ? "border-teal-200 bg-teal-50/50"
                      : "border-slate-100 bg-slate-50/50"
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        milestone.status === "Completed"
                          ? "bg-teal-600 text-white"
                          : milestone.status === "Current"
                            ? "bg-teal-100 text-teal-700"
                            : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {milestone.status === "Completed" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-bold">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            {milestone.title}
                          </h3>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {milestone.description}
                          </p>
                        </div>

                        <div className="shrink-0">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              milestone.status === "Completed"
                                ? "bg-teal-100 text-teal-700"
                                : milestone.status === "Current"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {milestone.status}
                          </span>

                          <p className="mt-2 text-right text-[10px] text-slate-400">
                            {milestone.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Activity */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading
              icon={Clock3}
              label="Activity Timeline"
            />

            <div className="mt-6">
              {collaboration.activity.map((item, index) => (
                <div key={`${item.title}-${index}`} className="relative flex gap-4 pb-6 last:pb-0">
                  {index !== collaboration.activity.length - 1 && (
                    <div className="absolute left-[15px] top-8 h-full w-px bg-slate-200" />
                  )}

                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      item.completed
                        ? "bg-teal-100 text-teal-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Clock3 className="h-4 w-4" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-sm font-bold text-slate-800">
                        {item.title}
                      </h3>

                      <span className="text-[10px] font-medium text-slate-400">
                        {item.date}
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right */}
        <aside className="space-y-5">
          {/* Current status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Current Status
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              </div>

              <div>
                <p className="text-base font-bold text-slate-900">
                  {collaboration.status}
                </p>

                <p className="text-xs text-slate-500">
                  Partnership lifecycle stage
                </p>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  Project progress
                </span>

                <span className="text-sm font-bold text-teal-700">
                  {collaboration.progress}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500"
                  style={{
                    width: `${collaboration.progress}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Next action */}
          <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
              <Target className="h-5 w-5" />
            </div>

            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-teal-700">
              Next Action
            </p>

            <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
              {collaboration.nextAction}
            </p>
          </div>

          {/* Support details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Support Details
            </p>

            <div className="mt-4 space-y-4">
              <DetailRow
                icon={Handshake}
                label="Support Type"
                value={collaboration.supportType}
              />

              <DetailRow
                icon={CircleDollarSign}
                label="Commitment"
                value={collaboration.commitment}
              />

              <DetailRow
                icon={Clock3}
                label="Submitted"
                value={collaboration.submitted}
              />

              <DetailRow
                icon={Building2}
                label="University"
                value={collaboration.university}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Workspace Actions
            </p>

            <div className="mt-4 space-y-2.5">
              <Link
  href={`/industry/collaborations/${collaboration.id}/contact`}
  className="flex w-full items-center justify-between rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
>
  <span className="flex items-center gap-2">
    <MessageSquare className="h-4 w-4" />
    Contact Project Team
  </span>

  <ArrowRight className="h-4 w-4" />
</Link>
             <Link
  href={`/industry/collaborations/${collaboration.id}/documents`}
  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700"
>
  <span className="flex items-center gap-2">
    <FileCheck2 className="h-4 w-4" />
    View Documents
  </span>

  <ArrowRight className="h-4 w-4" />
</Link>
            </div>
          </div>

          {/* Project link */}
          <Link
            href={`/industry/projects/${collaboration.projectId}`}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white transition hover:bg-slate-800"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                Linked Project
              </p>

              <p className="mt-1 text-sm font-bold">
                View Project Details
              </p>
            </div>

            <ArrowRight className="h-5 w-5 text-teal-300" />
          </Link>
        </aside>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-center text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>© 2026 SamadhanX • Ideas → Action → Impact</p>
          <p>Industry Innovation Network</p>
        </div>
      </footer>
    </main>
  );
}

function StatusBadge({
  status,
}: {
  status: CollaborationStatus;
}) {
  const styles: Record<CollaborationStatus, string> = {
    "Pending Review":
      "bg-amber-400/15 text-amber-100 border-amber-300/20",
    "Under Discussion":
      "bg-sky-400/15 text-sky-100 border-sky-300/20",
    Active:
      "bg-emerald-400/15 text-emerald-100 border-emerald-300/20",
    Completed:
      "bg-teal-400/15 text-teal-100 border-teal-300/20",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function SectionHeading({
  icon: Icon,
  label,
}: {
  icon: typeof Handshake;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
        <Icon className="h-4 w-4" />
      </div>

      <h2 className="text-base font-bold text-slate-900">
        {label}
      </h2>
    </div>
  );
}

function RoleCard({
  title,
  subtitle,
  description,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Building2;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}
      >
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>

      <p className="mt-4 text-sm font-bold text-slate-900">
        {title}
      </p>

      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-700">
        {subtitle}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Handshake;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold leading-5 text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

function getLifecycleDescription(status: CollaborationStatus) {
  const descriptions: Record<CollaborationStatus, string> = {
    "Pending Review": "Proposal submitted",
    "Under Discussion": "Terms and scope",
    Active: "Execution underway",
    Completed: "Impact delivered",
  };

  return descriptions[status];
}