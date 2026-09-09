"use client";

import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Plus,
  Users,
  X,
} from "lucide-react";

type Project = {
  id: string;
  title: string;
  problem: string;
  solution: string;
  status: "In Progress" | "Planning";
  members: number;
  deadline: string;
  progress: number;
};

const projects: Project[] = [
  {
    id: "water-management",
    title: "Smart Water Management System",
    problem: "Unreliable Water Supply in Local Community",
    solution: "IoT-based water monitoring and distribution system",
    status: "In Progress",
    members: 6,
    deadline: "30 Oct 2026",
    progress: 68,
  },
  {
    id: "smart-waste",
    title: "Smart Waste Collection",
    problem: "Poor Sanitation and Waste Management",
    solution: "Smart bins with optimized waste collection routes",
    status: "In Progress",
    members: 5,
    deadline: "15 Nov 2026",
    progress: 45,
  },
  {
    id: "farmer-support",
    title: "Farmer Support Platform",
    problem: "Challenges Faced by Local Farmers",
    solution: "Digital platform connecting farmers with resources",
    status: "Planning",
    members: 4,
    deadline: "20 Dec 2026",
    progress: 20,
  },
];

export default function UniversityProjects() {
  const [showCreate, setShowCreate] = useState(false);
  const [createdProjects, setCreatedProjects] = useState<Project[]>([]);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectProblem, setProjectProblem] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const allProjects = [...projects, ...createdProjects];

  const inProgressCount = allProjects.filter(
    (project) => project.status === "In Progress"
  ).length;

  const planningCount = allProjects.filter(
    (project) => project.status === "Planning"
  ).length;

  const teamMembers = allProjects.reduce(
    (total, project) => total + project.members,
    0
  );

  const onTrackCount = allProjects.filter(
    (project) =>
      project.status === "In Progress" && project.progress >= 40
  ).length;

  const needsAttentionCount = allProjects.filter(
    (project) =>
      project.status === "Planning" || project.progress < 30
  ).length;

  const handleCreateProject = () => {
    if (
      !projectTitle.trim() ||
      !projectProblem.trim() ||
      !projectDescription.trim()
    ) {
      return;
    }

    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: projectTitle.trim(),
      problem: projectProblem.trim(),
      solution: projectDescription.trim(),
      status: "Planning",
      members: 1,
      deadline: "To be decided",
      progress: 0,
    };

    setCreatedProjects((prev) => [...prev, newProject]);

    setProjectTitle("");
    setProjectProblem("");
    setProjectDescription("");
    setShowCreate(false);
  };

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
        <h1 className="text-2xl font-bold text-slate-900">
          SamadhanX
        </h1>

        <p className="text-xs text-slate-500">
          Ideas → Action → Impact
        </p>
      </div>
    </a>

    {/* Navigation */}
    <div className="hidden items-center gap-6 md:flex">

      <a
        href="/university/dashboard"
        className="text-sm text-slate-600 transition hover:text-teal-600"
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
        className="text-sm font-semibold text-teal-600"
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
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-6">

        {/* Heading */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100">
                <FolderKanban className="h-6 w-6 text-teal-700" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                University Projects
              </h2>

            </div>

            <p className="mt-2 text-base text-slate-500">
              Manage projects created to solve real-world community problems.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </button>

        </div>

        {/* ================= PROJECT INSIGHTS ================= */}
        <div className="mt-7">

        <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900">
            Project Insights
            </h3>

            <p className="mt-1 text-sm text-slate-500">
            A quick view of your university's current project activity.
            </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* On Track */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md">

            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">
                On Track
                </p>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100">
                <CheckCircle2 className="h-5 w-5 text-teal-700" />
                </div>
            </div>

            <p className="mt-3 text-3xl font-bold text-teal-700">
                {onTrackCount}
            </p>

            <p className="mt-1 text-xs font-medium text-teal-600">
                Projects progressing well
            </p>

            </div>

            {/* Needs Attention */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md">

            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">
                Needs Attention
                </p>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                <Clock3 className="h-5 w-5 text-amber-600" />
                </div>
            </div>

            <p className="mt-3 text-3xl font-bold text-amber-600">
                {needsAttentionCount}
            </p>

            <p className="mt-1 text-xs font-medium text-teal-600">
                Projects needing next steps
            </p>

            </div>

            {/* Active Projects */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md">

            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">
                Active Projects
                </p>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100">
                <FolderKanban className="h-5 w-5 text-teal-700" />
                </div>
            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
                {allProjects.length}
            </p>

            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-teal-600">
                <span className="h-1 w-1 shrink-0 rounded-full bg-teal-600" />
                <span>{inProgressCount} in progress</span>

                <span className="mx-0.5">·</span>

                <span>{planningCount} planning</span>
            </p>

            </div>

            {/* Active Teams */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md">

            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">
                Active Teams
                </p>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100">
                <Users className="h-5 w-5 text-teal-700" />
                </div>
            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
                {teamMembers}
            </p>

            <p className="mt-1 text-xs font-medium text-teal-600">
                Students and researchers involved
            </p>

            </div>

        </div>
        </div>

        {/* ================= PROJECT LIST ================= */}
        <div className="mt-8">

          <div className="mb-4 flex items-end justify-between">
            <div>
              <h3 className="text-xl font-bold">
                Your Projects
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Track progress and manage your ongoing university projects.
              </p>
            </div>
          </div>

          <div className="space-y-5">

            {allProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-teal-300 hover:shadow-md md:p-7"
              >

                <div className="grid gap-7 lg:grid-cols-[1fr_260px]">

                  {/* Left */}
                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <h3 className="text-xl font-bold md:text-2xl">
                        {project.title}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          project.status === "In Progress"
                            ? "bg-teal-100 text-teal-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {project.status}
                      </span>

                    </div>

                    <p className="mt-3 text-sm text-slate-500">
                      <span className="font-semibold text-slate-700">
                        Problem:
                      </span>{" "}
                      {project.problem}
                    </p>

                    <div className="mt-5 rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                        Proposed Solution
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {project.solution}
                      </p>
                    </div>

                    {/* Progress */}
                    <div className="mt-5">

                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-600">
                          Project Progress
                        </span>

                        <span className="font-bold text-teal-600">
                          {project.progress}%
                        </span>
                      </div>

                      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-teal-600 transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>

                    </div>

                  </div>

                  {/* Right */}
                  <div className="border-t border-slate-200 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">

                    <div className="space-y-5">

                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-slate-400" />

                        <div>
                          <p className="text-xs text-slate-500">
                            Team Size
                          </p>

                          <p className="font-bold">
                            {project.members} Members
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <CalendarDays className="h-5 w-5 text-slate-400" />

                        <div>
                          <p className="text-xs text-slate-500">
                            Deadline
                          </p>

                          <p className="font-bold">
                            {project.deadline}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />

                        <div>
                          <p className="text-xs text-slate-500">
                            Status
                          </p>

                          <p className="font-bold">
                            {project.status}
                          </p>
                        </div>
                      </div>

                    </div>

                    <a
                      href={`/university/projects/${project.id}`}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-teal-300 px-4 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-600 hover:text-white"
                    >
                      View Project
                      <ArrowRight className="h-4 w-4" />
                    </a>

                  </div>

                </div>

              </div>
            ))}

          </div>
        </div>

        {/* ================= BOTTOM CTA ================= */}
        <div className="mt-8 rounded-3xl bg-gradient-to-r from-teal-700 to-teal-600 p-7 text-white shadow-sm md:p-8">

          <p className="text-xs font-bold uppercase tracking-wider text-teal-100">
            From Ideas to Impact
          </p>

          <div className="mt-2 flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>
              <h3 className="text-xl font-bold md:text-2xl">
                Build a project around a real community challenge.
              </h3>

              <p className="mt-2 max-w-2xl text-sm text-teal-50">
                Bring students, researchers and faculty together to turn
                university expertise into meaningful solutions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
            >
              Create Project
              <ArrowRight className="h-4 w-4" />
            </button>

          </div>
        </div>

      </section>

      {/* ================= CREATE PROJECT MODAL ================= */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-5 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl md:p-7">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">

              <div>
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100">
                    <FolderKanban className="h-5 w-5 text-teal-700" />
                  </div>

                  <h3 className="text-xl font-bold">
                    Create Project
                  </h3>

                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Start a university project around a community problem.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Form */}
            <div className="mt-6 space-y-5">

              {/* Project Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Project Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Enter project name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              {/* Community Problem */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Community Problem <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  required
                  value={projectProblem}
                  onChange={(e) => setProjectProblem(e.target.value)}
                  placeholder="Which problem will this project solve?"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              {/* Proposed Solution */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Proposed Solution <span className="text-red-500">*</span>
                </label>

                <textarea
                  required
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Briefly describe your proposed solution"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-3">

              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreateProject}
                disabled={
                  !projectTitle.trim() ||
                  !projectProblem.trim() ||
                  !projectDescription.trim()
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Create Project
              </button>

            </div>

            <p className="mt-3 text-center text-xs text-slate-400">
              * All fields are required
            </p>

          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 px-6 py-8 text-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">

          <a
            href="/university/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">
              S
            </div>

            <div>
              <p className="text-lg font-bold">
                SamadhanX
              </p>

              <p className="text-sm text-slate-400">
                Ideas → Action → Impact
              </p>
            </div>
          </a>

          <p className="text-sm text-slate-400">
            © 2026 SamadhanX. Building solutions that matter.
          </p>

          <div className="flex gap-5 text-sm text-slate-400">

            <a
              href="/university/problems"
              className="transition hover:text-white"
            >
              Problems
            </a>

            <a
              href="/university/solutions"
              className="transition hover:text-white"
            >
              Solutions
            </a>

            <a
              href="/help"
              className="transition hover:text-white"
            >
              Help
            </a>

          </div>

        </div>

      </footer>

    </main>
  );
}