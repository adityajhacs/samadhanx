"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  DollarSign,
  Lightbulb,
  Plus,
  Users,
  X,
  ArrowRight,
} from "lucide-react";

type Solution = {
  id: number;
  title: string;
  status: string;
  statusType: "ready" | "development" | "idea";
  problem: string;
  progress: number;
  cost: string;
  team: string;
  impact: string;
  description: string;
};

const initialSolutions: Solution[] = [
  {
    id: 1,
    title: "Smart Water Monitoring System",
    status: "Prototype Ready",
    statusType: "ready",
    problem: "Unreliable Water Supply in Local Community",
    progress: 70,
    cost: "₹1.8 Lakhs",
    team: "6 Members",
    impact: "400+ people",
    description:
      "An IoT-based monitoring system designed to track water availability, usage and supply patterns in real time.",
  },
  {
    id: 2,
    title: "AI-Based Waste Collection",
    status: "Under Development",
    statusType: "development",
    problem: "Poor Sanitation and Waste Management",
    progress: 45,
    cost: "₹2.2 Lakhs",
    team: "5 Members",
    impact: "300+ people",
    description:
      "An intelligent waste collection solution that uses data and AI to improve collection planning and reduce unmanaged waste.",
  },
  {
    id: 3,
    title: "Digital Farmer Support Platform",
    status: "Idea Submitted",
    statusType: "idea",
    problem: "Challenges Faced by Local Farmers",
    progress: 20,
    cost: "₹1.2 Lakhs",
    team: "4 Members",
    impact: "250+ farmers",
    description:
      "A digital platform connecting local farmers with useful information, resources, experts and support services.",
  },
];

const problems = [
  "Unreliable Water Supply in Local Community",
  "Poor Sanitation and Waste Management",
  "Challenges Faced by Local Farmers",
];

export default function UniversitySolutionsPage() {
  const [solutions, setSolutions] = useState< Solution[]>(initialSolutions);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [selectedSolution, setSelectedSolution] =
    useState<Solution | null>(null);

  const [solutionName, setSolutionName] = useState("");
  const [selectedProblem, setSelectedProblem] = useState(problems[0]);
  const [description, setDescription] = useState("");

  const [formError, setFormError] = useState("");

  const handleOpenCreate = () => {
    setShowCreateModal(true);
    setFormError("");
  };

  const handleCloseCreate = () => {
    setShowCreateModal(false);
    setFormError("");
  };

  const handleCreateSolution = () => {
    if (
      solutionName.trim() === "" ||
      selectedProblem.trim() === "" ||
      description.trim() === ""
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setShowCreateModal(false);
    setShowConfirmation(true);
  };

  const handleConfirmCreate = () => {
    const newSolution: Solution = {
      id: Date.now(),
      title: solutionName.trim(),
      status: "Idea Submitted",
      statusType: "idea",
      problem: selectedProblem,
      progress: 0,
      cost: "To be estimated",
      team: "1 Member",
      impact: "To be estimated",
      description: description.trim(),
    };

    setSolutions((current) => [...current, newSolution]);

    setSolutionName("");
    setSelectedProblem(problems[0]);
    setDescription("");
    setFormError("");
    setShowConfirmation(false);

    setTimeout(() => {
      document
        .getElementById("solutions-list")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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
        className="text-sm text-slate-600 transition hover:text-teal-600"
      >
        Projects
      </a>

      <a
        href="/university/solutions"
        className="text-sm font-semibold text-teal-600"
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
      <section className="mx-auto max-w-7xl px-6 py-9">
{/* ================= HEADING + STATS ================= */}
<div className="mb-8 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
  {/* LEFT - MAIN HEADING */}
  <div className="-mt-15 flex-5">
    <div className="flex items-center gap-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100">
        <Lightbulb className="h-7 w-7 text-teal-600" />
      </div>

      <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-[44px]">
        Solutions
      </h2>
    </div>

    <p className="mt-3 max-w-xl text-base leading-6 text-slate-500">
      Develop innovative solutions and turn ideas into real-world impact.
    </p>
  </div>

  {/* RIGHT - 2 x 2 STATS */}
  <div className="grid w-full max-w-xl grid-cols-2 gap-4 lg:w-[520px]">
    {/* Total Solutions */}
    <button
      type="button"
      onClick={() =>
        document
          .getElementById("solutions-list")
          ?.scrollIntoView({ behavior: "smooth" })
      }
      className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-50 hover:shadow-md"
    >
      <p className="text-sm font-medium text-slate-500 group-hover:text-teal-700">
        Total Solutions
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900 group-hover:text-teal-700">
        {solutions.length + 9}
      </p>
    </button>

    {/* Prototype Ready */}
    <button
      type="button"
      onClick={() =>
        document
          .getElementById("solutions-list")
          ?.scrollIntoView({ behavior: "smooth" })
      }
      className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-50 hover:shadow-md"
    >
      <p className="text-sm font-medium text-slate-500 group-hover:text-teal-700">
        Prototype Ready
      </p>

      <p className="mt-1 text-3xl font-bold text-teal-600">
        4
      </p>
    </button>

    {/* In Development */}
    <button
      type="button"
      onClick={() =>
        document
          .getElementById("solutions-list")
          ?.scrollIntoView({ behavior: "smooth" })
      }
      className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-50 hover:shadow-md"
    >
      <p className="text-sm font-medium text-slate-500 group-hover:text-teal-700">
        In Development
      </p>

      <p className="mt-1 text-3xl font-bold text-amber-600">
        5
      </p>
    </button>

    {/* Implemented */}
    <button
      type="button"
      onClick={() =>
        document
          .getElementById("solutions-list")
          ?.scrollIntoView({ behavior: "smooth" })
      }
      className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-50 hover:shadow-md"
    >
      <p className="text-sm font-medium text-slate-500 group-hover:text-teal-700">
        Implemented
      </p>

      <p className="mt-1 text-3xl font-bold text-emerald-600">
        3
      </p>
    </button>
  </div>
</div>

        {/* ================= SOLUTIONS ================= */}
        <div id="solutions-list" className="space-y-5">
          {solutions.map((solution) => (
            <div
              key={solution.id}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-6 lg:flex-row">
                {/* LEFT */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-900 transition group-hover:text-teal-700">
                      {solution.title}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        solution.statusType === "ready"
                          ? "bg-emerald-50 text-emerald-600"
                          : solution.statusType === "development"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {solution.status}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-500">
                    Solving:{" "}
                    <span className="font-medium text-slate-600">
                      {solution.problem}
                    </span>
                  </p>

                  {/* Progress */}
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-600">
                        Prototype Progress
                      </p>

                      <p className="text-sm font-bold text-teal-600">
                        {solution.progress}%
                      </p>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-teal-600"
                        style={{
                          width: `${solution.progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* INFORMATION BOXES */}
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-4 transition hover:bg-teal-50">
                      <div className="flex items-center gap-2 text-slate-500">
                        <DollarSign className="h-4 w-4 text-teal-600" />
                        <span className="text-xs">Cost</span>
                      </div>

                      <p className="mt-2 font-bold text-slate-900">
                        {solution.cost}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4 transition hover:bg-teal-50">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Users className="h-4 w-4 text-teal-600" />
                        <span className="text-xs">Team</span>
                      </div>

                      <p className="mt-2 font-bold text-slate-900">
                        {solution.team}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4 transition hover:bg-teal-50">
                      <div className="flex items-center gap-2 text-slate-500">
                        <CheckCircle2 className="h-4 w-4 text-teal-600" />
                        <span className="text-xs">Expected Impact</span>
                      </div>

                      <p className="mt-2 font-bold text-slate-900">
                        {solution.impact}
                      </p>
                    </div>
                  </div>
                </div>

                {/* RIGHT STATUS */}
                <div className="flex w-full flex-col justify-between border-t border-slate-100 pt-5 lg:w-60 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                  <div>
                    <div className="flex items-center gap-2">
                      {solution.statusType === "ready" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Clock3 className="h-5 w-5 text-amber-500" />
                      )}

                      <p className="font-bold">
                        Prototype Status
                      </p>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {solution.statusType === "ready"
                        ? "Ready for testing and evaluation."
                        : "Development is currently in progress."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedSolution(solution)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-teal-400 px-4 py-3 text-sm font-bold text-teal-600 transition hover:bg-teal-600 hover:text-white"
                  >
                    View Solution
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= CTA ================= */}
        <div className="mt-8 rounded-3xl border border-teal-200 bg-teal-100 px-7 py-8 shadow-sm md:px-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <Lightbulb className="h-6 w-6 text-teal-600" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Have an innovative solution?
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Submit your solution, build a prototype, and collaborate
                  with other members to create meaningful impact.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 hover:shadow-md"
            >
              Create New Solution
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= CREATE SOLUTION MODAL ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">
                  <Lightbulb className="h-6 w-6 text-teal-600" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Create Solution
                  </h3>

                  <p className="text-sm text-slate-500">
                    Start building a solution for a community problem.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseCreate}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* FORM */}
            <div className="mt-6 space-y-5">
              {/* Solution Name */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Solution Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={solutionName}
                  onChange={(e) => {
                    setSolutionName(e.target.value);
                    setFormError("");
                  }}
                  placeholder="Enter solution name"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                />
              </div>

              {/* Problem */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Problem <span className="text-red-500">*</span>
                </label>

                <select
                  value={selectedProblem}
                  onChange={(e) => {
                    setSelectedProblem(e.target.value);
                    setFormError("");
                  }}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:bg-white"
                >
                  {problems.map((problem) => (
                    <option key={problem} value={problem}>
                      {problem}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Short Description <span className="text-red-500">*</span>
                </label>

                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setFormError("");
                  }}
                  placeholder="Describe your solution..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>

            {/* Error */}
            {formError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {formError}
              </div>
            )}

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleCloseCreate}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-red-400 hover:bg-red-50 hover:text-red-600"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreateSolution}
                className="flex-1 rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 hover:shadow-md"
              >
                Create Solution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CREATE CONFIRMATION ================= */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 px-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50">
              <CheckCircle2 className="h-8 w-8 text-teal-600" />
            </div>

            <h3 className="mt-5 text-2xl font-bold text-slate-900">
              Create this solution?
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Are you sure you want to create{" "}
              <span className="font-bold text-slate-800">
                {solutionName}
              </span>{" "}
              for this community problem?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmation(false);
                  setShowCreateModal(true);
                }}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-red-400 hover:bg-red-50 hover:text-red-600"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmCreate}
                className="flex-1 rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
              >
                Yes, Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW SOLUTION MODAL ================= */}
      {selectedSolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    selectedSolution.statusType === "ready"
                      ? "bg-emerald-50 text-emerald-600"
                      : selectedSolution.statusType === "development"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {selectedSolution.status}
                </span>

                <h3 className="mt-3 text-2xl font-bold text-slate-900">
                  {selectedSolution.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSolution(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-teal-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-teal-600">
                Solving
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {selectedSolution.problem}
              </p>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-600">
              {selectedSolution.description}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">
                  Progress
                </p>

                <p className="mt-1 font-bold text-teal-600">
                  {selectedSolution.progress}%
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">
                  Team
                </p>

                <p className="mt-1 font-bold">
                  {selectedSolution.team}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">
                  Impact
                </p>

                <p className="mt-1 font-bold">
                  {selectedSolution.impact}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedSolution(null)}
              className="mt-6 w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="mt-12 bg-slate-950 px-6 py-8 text-white">
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