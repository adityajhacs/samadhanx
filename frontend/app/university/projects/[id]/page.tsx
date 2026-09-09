"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Code2,
  FileText,
  Lightbulb,
  Upload,
  Users,
  Wallet,
} from "lucide-react";

const tasks = [
  "Problem research and data collection",
  "System architecture design",
  "IoT prototype development",
  "Mobile dashboard development",
  "Field testing",
];

const team = [
  {
    name: "Aarav Sharma",
    role: "Team Lead",
    initial: "A",
  },
  {
    name: "Priya Singh",
    role: "Researcher",
    initial: "P",
  },
  {
    name: "Rahul Verma",
    role: "Faculty Mentor",
    initial: "R",
  },
];

export default function ProjectDetails() {
  const [completedTasks, setCompletedTasks] = useState<number[]>([0, 1, 2]);

  const [prototypeFile, setPrototypeFile] = useState<File | null>(null);
  const [prototypeUrl, setPrototypeUrl] = useState<string | null>(null);

  const toggleTask = (index: number) => {
    setCompletedTasks((prev) =>
      prev.includes(index)
        ? prev.filter((task) => task !== index)
        : [...prev, index]
    );
  };

  const handlePrototypeUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (prototypeUrl) {
      URL.revokeObjectURL(prototypeUrl);
    }

    setPrototypeFile(file);

    const url = URL.createObjectURL(file);
    setPrototypeUrl(url);
  };

  const completedCount = completedTasks.length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= HEADER ================= */}
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
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                SamadhanX
              </h1>

              <p className="text-xs text-slate-500">
                Ideas → Action → Impact
              </p>
            </div>
          </a>

          {/* Navbar */}
          <div className="hidden items-center gap-7 md:flex">

            <a
              href="/university/dashboard"
              className="text-[15px] font-medium text-slate-600 transition hover:text-teal-600"
            >
              Dashboard
            </a>

            <a
              href="/university/problems"
              className="text-[15px] font-medium text-slate-600 transition hover:text-teal-600"
            >
              Problems
            </a>

            <a
              href="/university/projects"
              className="text-[15px] font-semibold text-teal-600"
            >
              Projects
            </a>

            <a
              href="/university/solutions"
              className="text-[15px] font-medium text-slate-600 transition hover:text-teal-600"
            >
              Solutions
            </a>

            <a
              href="/university/teams"
              className="text-[15px] font-medium text-slate-600 transition hover:text-teal-600"
            >
              Teams
            </a>

          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-3">

        {/* Back Button */}
        <a
          href="/university/projects"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </a>

        {/* ================= PROJECT HEADER ================= */}
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm md:px-7">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                  In Progress
                </span>

                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                  68% Complete
                </span>

              </div>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Smart Water Management System
              </h2>

              <p className="mt-2 text-base text-slate-500">
                Solving: Unreliable Water Supply in Local Community
              </p>

            </div>

            {/* Deadline */}
            <div className="flex w-fit items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">

              <CalendarDays className="h-5 w-5 text-slate-500" />

              <div>
                <p className="text-xs text-slate-500">
                  Deadline
                </p>

                <p className="mt-1 text-base font-bold text-slate-900">
                  30 Oct 2026
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* ================= CONTENT GRID ================= */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">

          {/* ================= LEFT COLUMN ================= */}
          <div className="space-y-6">

            {/* ================= PROJECT OVERVIEW ================= */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <FileText className="h-6 w-6 text-teal-600" />

                <h3 className="text-xl font-bold text-slate-900">
                  Project Overview
                </h3>

              </div>

              <p className="mt-5 text-base leading-7 text-slate-600">
                This project aims to develop an IoT-based water monitoring
                system that helps communities track water availability,
                identify supply issues, and improve distribution efficiency.
              </p>

            </section>

            {/* ================= AI PROJECT ANALYSIS ================= */}
            <section className="rounded-2xl border border-teal-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                  <Bot className="h-7 w-7 text-teal-700" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    AI Project Analysis
                  </h3>

                  <p className="text-sm text-slate-600">
                    AI-generated project insights
                  </p>
                </div>

              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">

                <div className="rounded-xl border border-teal-200 bg-teal-100/70 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Recommended Domain
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    IoT & Smart Infrastructure
                  </p>
                </div>

                <div className="rounded-xl border border-teal-200 bg-teal-100/70 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Expected Impact
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    400+ people
                  </p>
                </div>

                <div className="rounded-xl border border-teal-200 bg-teal-100/70 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Estimated Cost
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    ₹1.8 Lakhs
                  </p>
                </div>

                <div className="rounded-xl border border-teal-200 bg-teal-100/70 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Prototype Readiness
                  </p>

                  <p className="mt-1 font-bold text-teal-700">
                    70%
                  </p>
                </div>

              </div>

            </section>

            {/* ================= PROJECT TASKS ================= */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <h3 className="text-xl font-bold text-slate-900">
                  Project Tasks
                </h3>

                <span className="text-sm text-slate-500">
                  {completedCount} of {tasks.length} completed
                </span>

              </div>

              <div className="mt-5 space-y-3">

                {tasks.map((task, index) => {
                  const isCompleted = completedTasks.includes(index);

                  return (
                    <button
                      key={task}
                      type="button"
                      onClick={() => toggleTask(index)}
                      className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-4 text-left transition hover:border-teal-300 hover:bg-teal-50/40"
                    >

                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                      ) : (
                        <span className="h-5 w-5 shrink-0 rounded-full border-2 border-slate-300" />
                      )}

                      <span
                        className={`text-sm ${
                          isCompleted
                            ? "text-slate-500 line-through"
                            : "text-slate-700"
                        }`}
                      >
                        {task}
                      </span>

                    </button>
                  );
                })}

              </div>

            </section>

            {/* ================= PROTOTYPE ================= */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <Code2 className="h-6 w-6 text-teal-600" />

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Prototype
                  </h3>

                  <p className="text-sm text-slate-500">
                    View the latest project prototype.
                  </p>
                </div>

              </div>

              {/* Prototype Information */}
              <div className="mt-5 rounded-xl border border-teal-200 bg-teal-50/70 p-5">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                    <Code2 className="h-5 w-5 text-teal-600" />
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900">
                      Smart Water Monitoring Dashboard
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      IoT sensors + web dashboard for real-time water
                      monitoring.
                    </p>
                  </div>

                </div>

                <div className="mt-5 flex flex-wrap gap-2">

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    IoT
                  </span>

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    React
                  </span>

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    Sensors
                  </span>

                </div>

                {prototypeFile && prototypeUrl && (
                  <a
                    href={prototypeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                  >
                    View Prototype
                    <ArrowRight className="h-4 w-4" />
                  </a>
                )}

              </div>

            </section>

          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="space-y-6">

            {/* Project Progress */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h3 className="text-lg font-bold text-slate-900">
                Project Progress
              </h3>

              <div className="mt-5">

                <div className="flex items-center justify-between text-sm">

                  <span className="text-slate-500">
                    Overall
                  </span>

                  <span className="font-bold text-teal-600">
                    68%
                  </span>

                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">

                  <div
                    className="h-full rounded-full bg-teal-600"
                    style={{ width: "68%" }}
                  />

                </div>

              </div>

            </section>

            {/* Project Team */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <Users className="h-5 w-5 text-teal-600" />

                <h3 className="text-lg font-bold text-slate-900">
                  Project Team
                </h3>

              </div>

              <div className="mt-5 space-y-4">

                {team.map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center gap-3"
                  >

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 font-semibold text-teal-700">
                      {member.initial}
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-slate-900">
                        {member.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {member.role}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

              <a
                href="/university/teams"
                className="mt-5 flex w-full items-center justify-center rounded-xl border border-teal-300 px-4 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-600 hover:text-white"
              >
                Manage Team
              </a>

            </section>

            {/* Project Budget */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <Wallet className="h-5 w-5 text-teal-600" />

                <h3 className="text-lg font-bold text-slate-900">
                  Project Budget
                </h3>

              </div>

              <p className="mt-5 text-2xl font-bold text-slate-900">
                ₹1.8 Lakhs
              </p>

              <p className="mt-1 text-sm text-teal-600">
                Estimated project cost
              </p>

            </section>

            {/* Expected Impact */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <Lightbulb className="h-5 w-5 text-teal-600" />

                <h3 className="text-lg font-bold text-slate-900">
                  Expected Impact
                </h3>

              </div>

              <p className="mt-5 text-2xl font-bold text-slate-900">
                400+
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Community members expected to benefit
              </p>

            </section>

            {/* ================= UPLOAD PROTOTYPE ================= */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                  <Upload className="h-5 w-5 text-teal-700" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Upload Prototype
                  </h3>

                  <p className="text-sm text-slate-500">
                    Add the latest prototype file.
                  </p>
                </div>

              </div>

              <div className="mt-5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:border-teal-400 hover:bg-teal-50/40">

                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100">
                  <Upload className="h-5 w-5 text-teal-700" />
                </div>

                <h4 className="mt-3 text-sm font-bold text-slate-900">
                  Upload Prototype File
                </h4>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Upload an image, PDF or prototype file.
                </p>

                <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700">

                  <Upload className="h-4 w-4" />

                  {prototypeFile ? "Replace File" : "Choose File"}

                  <input
                    type="file"
                    accept="image/*,.pdf,.fig,.figma"
                    className="hidden"
                    onChange={handlePrototypeUpload}
                  />

                </label>

                {/* Uploaded File */}
                {prototypeFile && (
                  <div className="mt-4">

                    <div className="flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2">

                      <FileText className="h-4 w-4 shrink-0 text-teal-600" />

                      <p className="max-w-[180px] truncate text-xs font-medium text-slate-700">
                        {prototypeFile.name}
                      </p>

                    </div>

                    {prototypeUrl && (
                      <a
                        href={prototypeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-800"
                      >
                        View Prototype
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    )}

                  </div>
                )}

              </div>

            </section>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 px-6 py-8 text-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">

          {/* Footer Logo */}
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