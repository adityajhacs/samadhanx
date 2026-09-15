"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getProject, type Project as ApiProject } from "@/lib/api/collaborations";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FlaskConical,
  GraduationCap,
  Handshake,
  Lightbulb,
  MapPin,
  Target,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

type ProjectStage =
  | "Solution Proposed"
  | "Project In Progress"
  | "Pilot / Validation"
  | "Impact / Deployment";

type ProjectDetail = {
  id: string;
  title: string;
  problem: string;
  category: string;
  university: string;
  location: string;
  stage: ProjectStage;
  progress: number;
  support: string[];
  description: string;
  solution: string;
  prototype: string;
  prototypeComponents: string[];
  howItWorks: string[];
  impact: string[];
  timeline: string;
  funding: string;
};

const milestones = [
  "Problem Validation",
  "Research & Design",
  "Prototype Development",
  "Testing / Field Pilot",
  "Impact Evaluation",
];

function mapStatus(status: string | null): { stage: ProjectStage; progress: number } {
  switch (status) {
    case "VALIDATION":
      return { stage: "Solution Proposed", progress: 20 };
    case "TEAM_FORMATION":
      return { stage: "Project In Progress", progress: 30 };
    case "SOLUTION_DESIGN":
      return { stage: "Project In Progress", progress: 40 };
    case "PROTOTYPE":
      return { stage: "Project In Progress", progress: 60 };
    case "FIELD_PILOT":
      return { stage: "Pilot / Validation", progress: 75 };
    case "DEPLOYED":
      return { stage: "Impact / Deployment", progress: 90 };
    case "IMPACT_MEASUREMENT":
      return { stage: "Impact / Deployment", progress: 100 };
    case "IDEA":
    default:
      return { stage: "Solution Proposed", progress: 10 };
  }
}

function mapApiProject(project: ApiProject): ProjectDetail {
  const mapped = mapStatus(project.status);
  const linkedProblem = project.problem_id
    ? `Linked problem: ${project.problem_id}`
    : "Problem details are not available from the current project API.";

  return {
    id: project.id,
    title: project.title,
    problem: linkedProblem,
    category: "Not available from current API",
    university: "University details not available from current API",
    location: "Location not available from current API",
    stage: mapped.stage,
    progress: mapped.progress,
    support: ["Industry collaboration details not available from current API"],
    description:
      project.description ??
      "No project description is available from the current project API.",
    solution: project.solution_id
      ? `Linked solution: ${project.solution_id}`
      : "Solution details are not available from the current project API.",
    prototype:
      project.description ??
      "Prototype details are not available from the current project API.",
    prototypeComponents: [
      "Project information from backend",
      "Detailed prototype data pending backend support",
    ],
    howItWorks: [
      "Project data is loaded from the SamadhanX backend.",
      "The current project API provides the project title, description and lifecycle status.",
      "Additional solution and prototype details can be connected when those backend fields are exposed.",
    ],
    impact: [
      "Impact details are not available from the current project API.",
      "Impact metrics can be connected when the backend exposes them.",
    ],
    timeline: "Not specified by current API",
    funding: "Not specified by current API",
  };
}

function getMilestoneStatus(project: ProjectDetail, index: number) {
  const progress = project.progress;

  if (index === 0) return "Completed";
  if (progress >= 80 && index === 1) return "Completed";
  if (progress >= 45 && index === 1) return "Completed";
  if (progress >= 60 && index === 2) return "Completed";
  if (progress >= 30 && index === 2) return "In Progress";
  if (progress >= 45 && index === 3) return "In Progress";

  return "Upcoming";
}

export default function IndustryProjectDetailPage() {
  const params = useParams();
const projectId = Array.isArray(params.id)
  ? params.id[0]
  : params.id;

const validProjectId =
  typeof projectId === "string" ? projectId : "";

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) {
      setError("Project not found.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadProject() {
      try {
        setLoading(true);
        setError("");

        const data = await getProject(projectId!);

        if (!cancelled) {
          setProject(mapApiProject(data));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load project details."
          );
          setProject(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  if (loading) {

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm font-medium text-slate-600">
            Loading project details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100 px-6">
        <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-rose-700">
            {error || "Project not found."}
          </p>
          <Link
            href="/industry/projects"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
        </div>
      </main>
    );
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
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-10">
          <Link
            href="/industry/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-teal-100 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

          <div className="mt-7 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-teal-300/40 bg-teal-800/70 px-3 py-1.5 text-xs font-bold text-teal-100">
                {project.id}
              </span>

              <span className="rounded-full border border-emerald-300/40 bg-emerald-800/60 px-3 py-1.5 text-xs font-bold text-emerald-100">
                {project.stage}
              </span>

              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white">
                {project.category}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              {project.title}
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-teal-50">
              {project.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-teal-100">
              <span className="inline-flex items-center gap-2">
                <GraduationCap size={16} />
                {project.university}
              </span>

              <span className="inline-flex items-center gap-2">
                <MapPin size={16} />
                {project.location}
              </span>

              <span className="inline-flex items-center gap-2">
                <Clock3 size={16} />
                {project.timeline}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
          <div className="space-y-6">
            {/* Problem */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-rose-100 p-3">
                  <Target className="h-5 w-5 text-rose-700" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
                    Community Problem
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    What problem is this project solving?
                  </h2>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-rose-100 bg-rose-50 p-5">
                <p className="text-base font-semibold leading-7 text-slate-800">
                  {project.problem}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  This project focuses on a real community challenge
                  identified through the SamadhanX problem-solving
                  workflow. The university team is developing a
                  practical solution that can be validated in real-world
                  conditions.
                </p>
              </div>
            </section>

            {/* Solution */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-teal-100 p-3">
                  <Lightbulb className="h-5 w-5 text-teal-700" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    Proposed Solution
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    How is the problem being addressed?
                  </h2>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                {project.solution}
              </p>
            </section>

            {/* Prototype */}
            <section className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-teal-600 p-3">
                  <Wrench className="h-5 w-5 text-white" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    Prototype
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    What are they actually building?
                  </h2>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-700">
                {project.prototype}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {project.prototypeComponents.map((component) => (
                  <div
                    key={component}
                    className="flex items-start gap-3 rounded-xl border border-teal-100 bg-white p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />

                    <span className="text-sm font-medium text-slate-700">
                      {component}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Workflow */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-sky-100 p-3">
                  <Zap className="h-5 w-5 text-sky-700" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-sky-700">
                    Prototype Workflow
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    How will the prototype solve the problem?
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {project.howItWorks.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                      {index + 1}
                    </div>

                    <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm leading-6 text-slate-700">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 overflow-x-auto">
                <div className="flex min-w-[650px] items-center justify-center gap-2">
                  {[
                    "Community Input",
                    "Prototype",
                    "Testing",
                    "Validation",
                    "Real-World Impact",
                  ].map((item, index, array) => (
                    <div
                      key={item}
                      className="flex items-center gap-2"
                    >
                      <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-center">
                        <p className="text-xs font-bold text-teal-800">
                          {item}
                        </p>
                      </div>

                      {index < array.length - 1 && (
                        <ArrowRight
                          size={15}
                          className="shrink-0 text-slate-400"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Progress */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Project Progress
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Innovation to Impact
                  </h2>
                </div>

                <span className="text-2xl font-bold text-teal-700">
                  {project.progress}%
                </span>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-teal-600"
                  style={{ width: `${project.progress}%` }}
                />
              </div>

              <div className="mt-6 space-y-5">
                {milestones.map((milestone, index) => {
                  const status = getMilestoneStatus(
                    project,
                    index
                  );

                  return (
                    <div
                      key={milestone}
                      className="flex gap-4"
                    >
                      <div className="relative">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            status === "Completed"
                              ? "bg-emerald-100"
                              : status === "In Progress"
                              ? "bg-teal-100"
                              : "bg-slate-100"
                          }`}
                        >
                          {status === "Completed" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                status === "In Progress"
                                  ? "bg-teal-600"
                                  : "bg-slate-400"
                              }`}
                            />
                          )}
                        </div>

                        {index < milestones.length - 1 && (
                          <div className="absolute left-1/2 top-8 h-8 w-px -translate-x-1/2 bg-slate-200" />
                        )}
                      </div>

                      <div className="flex-1 pb-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-slate-800">
                            {milestone}
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              status === "Completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : status === "In Progress"
                                ? "bg-teal-100 text-teal-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {status}
                          </span>
                        </div>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Project milestone within the current
                          innovation stage.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Impact */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-emerald-100 p-3">
                  <Target className="h-5 w-5 text-emerald-700" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Expected Impact
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    What changes if the solution works?
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {project.impact.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                    <p className="text-sm leading-6 text-slate-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Collaboration */}
            <div className="rounded-2xl border border-teal-200 bg-white p-5 shadow-sm">
              <div className="w-fit rounded-xl bg-teal-100 p-3">
                <Handshake className="h-5 w-5 text-teal-700" />
              </div>

              <h2 className="mt-4 text-lg font-bold">
                Collaboration Opportunity
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This project is looking for industry partners who
                can help move the solution toward real-world
                validation and impact.
              </p>

              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Support Required
                </p>

                <div className="mt-2 space-y-2">
                  {project.support.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5"
                    >
                      <CheckCircle2 className="h-4 w-4 text-teal-600" />

                      <span className="text-sm font-medium text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/industry/collaborations"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Offer Collaboration
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* University */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-3">
                  <GraduationCap className="h-5 w-5 text-slate-700" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    University Partner
                  </p>

                  <h3 className="mt-1 text-sm font-bold">
                    {project.university}
                  </h3>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-xs leading-5 text-slate-500">
                  The university team is responsible for research,
                  solution development, prototype work, and
                  technical validation.
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-600">
                  <MapPin
                    size={14}
                    className="text-teal-600"
                  />
                  {project.location}
                </div>
              </div>
            </div>

            {/* Government */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Government Stakeholder
              </p>

              <h3 className="mt-2 text-sm font-bold">
                Government of Jharkhand
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Supports problem validation, field coordination,
                monitoring, and evaluation of real-world outcomes.
              </p>
            </div>

            {/* Overview */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Project Overview
              </p>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Category
                  </span>
                  <span className="text-sm font-bold">
                    {project.category}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Duration
                  </span>
                  <span className="text-sm font-bold">
                    {project.timeline}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Support Value
                  </span>
                  <span className="text-sm font-bold">
                    {project.funding}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Progress
                  </span>
                  <span className="text-sm font-bold text-teal-700">
                    {project.progress}%
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="overflow-hidden rounded-2xl bg-slate-950">
          <div className="flex flex-col gap-6 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Ready to contribute?
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Help take this project toward real-world impact.
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Contribute funding, technical expertise, testing,
                prototyping, mentorship, or field deployment support.
              </p>
            </div>

            <Link
              href="/industry/collaborations"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-500"
            >
              Start Collaboration
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-5 text-center text-xs text-slate-500">
        © 2026 SamadhanX • Ideas → Action → Impact
      </footer>
    </main>
  );
}
}

