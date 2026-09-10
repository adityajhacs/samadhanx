
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  MapPin,
  Search,
  Target,
  Users,
  Wrench,
} from "lucide-react";

type ProjectStage =
  | "Solution Proposed"
  | "Project In Progress"
  | "Pilot / Validation"
  | "Impact / Deployment";

type Project = {
  id: string;
  title: string;
  problem: string;
  category: string;
  university: string;
  location: string;
  stage: ProjectStage;
  progress: number;
  support: string;
  description: string;
};

const projects: Project[] = [
  {
    id: "PRJ-001",
    title: "Smart Road Monitoring Pilot",
    problem: "Road damage and delayed maintenance reporting",
    category: "Infrastructure",
    university: "Birla Institute of Technology, Mesra",
    location: "Ranchi, Jharkhand",
    stage: "Pilot / Validation",
    progress: 72,
    support: "Technical Support",
    description:
      "A technology-assisted system for detecting road damage and improving maintenance response.",
  },
  {
    id: "PRJ-002",
    title: "Community Water Monitoring",
    problem: "Irregular water supply and quality monitoring",
    category: "Water",
    university: "National Institute of Technology, Jamshedpur",
    location: "Jamshedpur, Jharkhand",
    stage: "Project In Progress",
    progress: 58,
    support: "Field Pilot",
    description:
      "A community-focused monitoring solution for tracking water availability and quality.",
  },
  {
    id: "PRJ-003",
    title: "Rural Sanitation Deployment",
    problem: "Limited sanitation infrastructure in rural areas",
    category: "Sanitation",
    university: "Central University of Jharkhand",
    location: "Dhanbad, Jharkhand",
    stage: "Solution Proposed",
    progress: 81,
    support: "Funding",
    description:
      "A scalable sanitation solution designed for deployment in underserved rural communities.",
  },
  {
    id: "PRJ-004",
    title: "Solar Street Infrastructure",
    problem: "Poor lighting in underserved community areas",
    category: "Energy",
    university: "Birla Institute of Technology, Mesra",
    location: "Bokaro, Jharkhand",
    stage: "Project In Progress",
    progress: 34,
    support: "Prototyping",
    description:
      "Solar-powered street infrastructure aimed at improving safety and reducing energy dependence.",
  },
  {
    id: "PRJ-005",
    title: "Citizen Complaint Analytics",
    problem: "Difficulty identifying recurring civic issues",
    category: "Governance",
    university: "National Institute of Technology, Jamshedpur",
    location: "Hazaribagh, Jharkhand",
    stage: "Impact / Deployment",
    progress: 100,
    support: "Mentorship",
    description:
      "An analytics platform that identifies recurring citizen complaints and supports data-driven decisions.",
  },
  {
    id: "PRJ-006",
    title: "Low-Cost Road Repair Material",
    problem: "High cost of road repair materials",
    category: "Infrastructure",
    university: "Birla Institute of Technology, Mesra",
    location: "Deoghar, Jharkhand",
    stage: "Solution Proposed",
    progress: 21,
    support: "Testing",
    description:
      "Research into affordable road repair materials suitable for local conditions.",
  },
  {
    id: "PRJ-007",
    title: "Smart Waste Collection Network",
    problem: "Irregular waste collection in residential areas",
    category: "Sanitation",
    university: "Central University of Jharkhand",
    location: "Ranchi, Jharkhand",
    stage: "Project In Progress",
    progress: 46,
    support: "Technical Support",
    description:
      "A smart collection system designed to optimize waste pickup routes and schedules.",
  },
  {
    id: "PRJ-008",
    title: "Rural Solar Water Pumps",
    problem: "Limited access to reliable irrigation power",
    category: "Energy",
    university: "National Institute of Technology, Jamshedpur",
    location: "Dumka, Jharkhand",
    stage: "Solution Proposed",
    progress: 27,
    support: "Funding",
    description:
      "Solar-powered irrigation infrastructure designed for small and marginal farmers.",
  },
  {
    id: "PRJ-009",
    title: "Digital Health Access Platform",
    problem: "Limited access to basic healthcare services",
    category: "Healthcare",
    university: "Central University of Jharkhand",
    location: "Hazaribagh, Jharkhand",
    stage: "Pilot / Validation",
    progress: 67,
    support: "Field Pilot",
    description:
      "A digital platform connecting underserved communities with essential healthcare resources.",
  },
  {
    id: "PRJ-010",
    title: "Flood Risk Monitoring System",
    problem: "Delayed flood alerts in vulnerable communities",
    category: "Environment",
    university: "Birla Institute of Technology, Mesra",
    location: "Giridih, Jharkhand",
    stage: "Project In Progress",
    progress: 52,
    support: "Testing",
    description:
      "A monitoring system designed to improve early warning and flood preparedness.",
  },
  {
    id: "PRJ-011",
    title: "Public Transport Tracking",
    problem: "Limited visibility of local transport availability",
    category: "Transport",
    university: "National Institute of Technology, Jamshedpur",
    location: "Jamshedpur, Jharkhand",
    stage: "Impact / Deployment",
    progress: 94,
    support: "Technical Support",
    description:
      "A real-time transport monitoring solution for improving accessibility and reliability.",
  },
  {
    id: "PRJ-012",
    title: "Community Air Quality Network",
    problem: "Limited local air quality monitoring",
    category: "Environment",
    university: "Central University of Jharkhand",
    location: "Bokaro, Jharkhand",
    stage: "Pilot / Validation",
    progress: 63,
    support: "Prototyping",
    description:
      "A distributed sensor network for monitoring local air quality and pollution patterns.",
  },
];

const categoryOptions = [
  "All Categories",
  "Infrastructure",
  "Water",
  "Sanitation",
  "Energy",
  "Governance",
  "Healthcare",
  "Environment",
  "Transport",
];

const stageOptions = [
  "All Stages",
  "Solution Proposed",
  "Project In Progress",
  "Pilot / Validation",
  "Impact / Deployment",
];

const supportOptions = [
  "All Support Types",
  "Funding",
  "Mentorship",
  "Testing",
  "Prototyping",
  "Technical Support",
  "Field Pilot",
];

const PROJECTS_PER_PAGE = 6;

function getStageStyle(stage: ProjectStage) {
  switch (stage) {
    case "Solution Proposed":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "Project In Progress":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "Pilot / Validation":
      return "border-teal-200 bg-teal-50 text-teal-700";
    case "Impact / Deployment":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
}

function getSupportIcon(support: string) {
  switch (support) {
    case "Funding":
      return CircleDollarSign;
    case "Mentorship":
      return Users;
    case "Testing":
      return FlaskConical;
    case "Prototyping":
      return Wrench;
    case "Technical Support":
      return Wrench;
    case "Field Pilot":
      return Target;
    default:
      return Lightbulb;
  }
}

export default function IndustryProjectsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [stage, setStage] = useState("All Stages");
  const [support, setSupport] = useState("All Support Types");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProjects = useMemo(() => {
    const query = search.toLowerCase().trim();

    return projects.filter((project) => {
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.problem.toLowerCase().includes(query) ||
        project.university.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query);

      const matchesCategory =
        category === "All Categories" || project.category === category;

      const matchesStage =
        stage === "All Stages" || project.stage === stage;

      const matchesSupport =
        support === "All Support Types" || project.support === support;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStage &&
        matchesSupport
      );
    });
  }, [search, category, stage, support]);

  const totalPages = Math.ceil(
    filteredProjects.length / PROJECTS_PER_PAGE
  );

  const visibleProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );

  function resetPage() {
    setCurrentPage(1);
  }

  function handleSearch(value: string) {
    setSearch(value);
    resetPage();
  }

  function handleCategory(value: string) {
    setCategory(value);
    resetPage();
  }

  function handleStage(value: string) {
    setStage(value);
    resetPage();
  }

  function handleSupport(value: string) {
    setSupport(value);
    resetPage();
  }

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
       className="text-sm font-semibold text-teal-700"
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



      {/* Hero */}
      <section className="relative overflow-hidden border-b border-teal-900 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
        <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-400/40 bg-teal-800/60 px-3 py-1.5 text-xs font-semibold text-teal-100 shadow-sm">
                <Building2 size={14} />
                Industry Innovation Network
              </div>

             <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
  Discover Innovation Projects
  <span className="block text-teal-100">
    Ready for Industry Support.
  </span>
</h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-teal-50 sm:text-base">
                Explore university-led projects solving real community
                challenges across Jharkhand. Find opportunities where your
                organisation can contribute funding, expertise, testing,
                prototyping, or field support.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:w-fit">
              <div className="rounded-2xl border border-teal-100 bg-white px-5 py-4 shadow-sm">
                <p className="text-2xl font-bold text-teal-700">18</p>
                <p className="mt-1 text-xs text-slate-500">
                  Available Projects
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
                <p className="text-2xl font-bold text-emerald-700">7</p>
                <p className="mt-1 text-xs text-slate-500">
                  Active Collaborations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-6 py-7">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Find the Right Project
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Filter projects according to your organisation&apos;s
                collaboration interests.
              </p>
            </div>

            <div className="w-fit rounded-xl bg-teal-50 px-3 py-2 text-xs font-bold text-teal-700">
              {filteredProjects.length} projects found
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative lg:col-span-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search projects..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <select
              value={category}
              onChange={(e) => handleCategory(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
            >
              {categoryOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>

            <select
              value={stage}
              onChange={(e) => handleStage(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
            >
              {stageOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>

            <select
              value={support}
              onChange={(e) => handleSupport(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
            >
              {supportOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Innovation Pipeline
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Projects Open for Collaboration
            </h2>
          </div>

          {filteredProjects.length > 0 && (
            <p className="hidden text-sm text-slate-500 sm:block">
              Showing{" "}
              {(currentPage - 1) * PROJECTS_PER_PAGE + 1}–
              {Math.min(
                currentPage * PROJECTS_PER_PAGE,
                filteredProjects.length
              )}{" "}
              of {filteredProjects.length}
            </p>
          )}
        </div>

        {visibleProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <Search size={24} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No projects found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Try changing your search or filters to discover more innovation
              projects.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {visibleProjects.map((project) => {
              const SupportIcon = getSupportIcon(project.support);

              return (
                <article
                  key={project.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg"
                >
                  {/* Color strip */}
                  <div className="h-1.5 bg-gradient-to-r from-teal-600 via-emerald-500 to-sky-500" />

                  <div className="p-6">
                    {/* Top */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                          <Lightbulb size={21} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {project.id}
                          </p>

                          <h3 className="mt-1 text-lg font-bold leading-snug text-slate-900">
                            {project.title}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStageStyle(
                          project.stage
                        )}`}
                      >
                        {project.stage}
                      </span>
                    </div>

                    {/* Problem */}
                    <div className="mt-5 rounded-xl bg-slate-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Community Challenge
                      </p>

                      <p className="mt-1 text-sm font-semibold leading-5 text-slate-800">
                        {project.problem}
                      </p>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      {project.description}
                    </p>

                    {/* University + Location */}
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2.5">
                        <GraduationCap
                          size={17}
                          className="shrink-0 text-teal-600"
                        />

                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                            University
                          </p>

                          <p className="truncate text-xs font-semibold text-slate-700">
                            {project.university}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2.5">
                        <MapPin
                          size={17}
                          className="shrink-0 text-teal-600"
                        />

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                            Location
                          </p>

                          <p className="text-xs font-semibold text-slate-700">
                            {project.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">
                          Project Progress
                        </span>

                        <span className="text-xs font-bold text-teal-700">
                          {project.progress}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-teal-600 transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                          <SupportIcon size={17} />
                        </div>

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                            Support Required
                          </p>

                          <p className="text-xs font-bold text-slate-700">
                            {project.support}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/industry/projects/${project.id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700"
                      >
                        View Project
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row">
            <button
              onClick={() =>
                setCurrentPage((page) => Math.max(page - 1, 1))
              }
              disabled={currentPage === 1}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={16} />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition ${
                      currentPage === page
                        ? "bg-teal-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(page + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="overflow-hidden rounded-3xl bg-slate-900 p-7 text-white shadow-lg sm:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-teal-300">
                <CheckCircle2 size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Industry × Innovation
                </span>
              </div>

              <h2 className="mt-2 text-2xl font-bold">
                Found a project worth supporting?
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Connect with university teams and contribute the resources,
                expertise, testing environment, or industry access they need.
              </p>
            </div>

            <Link
              href="/industry/collaborations"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-400"
            >
              Explore Collaborations
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-[11px] text-slate-400">
        © 2026 SamadhanX • Ideas → Action → Impact
      </footer>
    </main>
  );
}
