"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Building2,
  CalendarDays,
  CheckCircle2,
  Code2,
  FileText,
  Handshake,
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

const industryPartners = [
  {
    id: "abc-technologies",
    name: "ABC Technologies",
  },
  {
    id: "tata-technologies",
    name: "Tata Technologies",
  },
  {
    id: "tech-mahindra",
    name: "Tech Mahindra",
  },
  {
    id: "ranchi-innovation-labs",
    name: "Ranchi Innovation Labs",
  },
  {
    id: "green-tech-solutions",
    name: "GreenTech Solutions",
  },
  {
    id: "digital-impact-foundation",
    name: "Digital Impact Foundation",
  },
];

const supportOptions = [
  "Funding",
  "Mentorship",
  "Hardware",
  "Testing",
  "Prototyping",
  "Field Pilot",
  "Technical Support",
];

export default function ProjectDetails() {
  const params = useParams();
  const searchParams = useSearchParams();

  const projectId = String(params?.id ?? "1");

  const selectedPartnerId = searchParams.get("partner");

  const selectedPartner =
    industryPartners.find(
      (partner) => partner.id === selectedPartnerId
    ) ?? null;

  const [completedTasks, setCompletedTasks] = useState<number[]>([
    0,
    1,
    2,
  ]);

  const [showCollaborationModal, setShowCollaborationModal] =
    useState(false);

  const [collaborationRequested, setCollaborationRequested] =
    useState(false);

  const [prototypeFile, setPrototypeFile] = useState<File | null>(
    null
  );

  const [prototypeUrl, setPrototypeUrl] = useState<string | null>(
    null
  );

  const [selectedCompany, setSelectedCompany] = useState("");

  const [selectedSupports, setSelectedSupports] = useState<string[]>(
    []
  );

  const [fundingAmount, setFundingAmount] = useState("");

  const [collaborationMessage, setCollaborationMessage] =
    useState("");

  useEffect(() => {
    if (selectedPartner) {
      setSelectedCompany(selectedPartner.id);
      setShowCollaborationModal(true);
    }
  }, [selectedPartner]);

  const toggleTask = (index: number) => {
    setCompletedTasks((prev) =>
      prev.includes(index)
        ? prev.filter((task) => task !== index)
        : [...prev, index]
    );
  };

  const toggleSupport = (support: string) => {
    setSelectedSupports((prev) =>
      prev.includes(support)
        ? prev.filter((item) => item !== support)
        : [...prev, support]
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

  const handleRequestCollaboration = () => {
    if (!selectedCompany) {
      alert("Please select an industry partner.");
      return;
    }

    if (selectedSupports.length === 0) {
      alert("Please select at least one support type.");
      return;
    }

    setCollaborationRequested(true);
    setShowCollaborationModal(false);

    alert("Collaboration request submitted successfully.");
  };

  const openCollaborationModal = () => {
    setShowCollaborationModal(true);
  };

  const completedCount = completedTasks.length;

  const selectedCompanyName =
    industryPartners.find(
      (partner) => partner.id === selectedCompany
    )?.name ?? "No industry partner yet";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/university/dashboard"
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

          <div className="hidden items-center gap-7 md:flex">
            <Link
              href="/university/dashboard"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Dashboard
            </Link>

            <Link
              href="/university/problems"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Problems
            </Link>

            <Link
              href="/university/projects"
              className="text-sm font-semibold text-teal-700"
            >
              Projects
            </Link>

            <Link
              href="/university/solutions"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Solutions
            </Link>

            <Link
              href="/university/teams"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Teams
            </Link>

            <Link
              href="/university/profile"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* BACK */}
        <Link
          href="/university/projects"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        {/* ================= PROJECT HEADER ================= */}
        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  In Progress
                </span>

                <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
                  68% Complete
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Smart Water Management System
              </h1>

              <p className="mt-3 text-base leading-7 text-slate-500">
                A technology-driven solution for solving unreliable water
                supply in local communities through real-time monitoring,
                sensor data and intelligent alerts.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 lg:min-w-[190px]">
              <div className="flex items-center gap-2 text-slate-500">
                <CalendarDays className="h-4 w-4" />

                <span className="text-xs font-semibold">
                  Project Deadline
                </span>
              </div>

              <p className="mt-2 text-lg font-bold text-slate-900">
                30 Oct 2026
              </p>
            </div>
          </div>
        </section>

        {/* ================= CONTENT GRID ================= */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          {/* ================= LEFT COLUMN ================= */}
          <div className="space-y-6">
            {/* PROJECT OVERVIEW */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                  <FileText className="h-5 w-5 text-teal-700" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Project Overview
                  </h2>

                  <p className="text-sm text-slate-500">
                    Understanding the project and its objectives.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-5">
                <p className="text-sm leading-7 text-slate-600">
                  This project focuses on developing a smart water monitoring
                  system that helps communities and local authorities track
                  water availability, usage patterns and supply disruptions.
                  The system combines IoT sensors with a web dashboard to
                  provide real-time information and early alerts.
                </p>
              </div>
            </section>

            {/* AI PROJECT ANALYSIS */}
            <section className="rounded-2xl border border-teal-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                  <Bot className="h-5 w-5 text-teal-700" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    AI Project Analysis
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    AI-generated insights for project development.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Recommended Domain
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    IoT & Smart Infrastructure
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Expected Impact
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    400+ people
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Prototype Readiness
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    70%
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl bg-teal-50 p-4">
                <Lightbulb className="h-5 w-5 shrink-0 text-teal-700" />

                <p className="text-sm leading-6 text-teal-900">
                  The project has strong potential for community deployment
                  because it combines low-cost monitoring with real-time
                  visibility for local authorities.
                </p>
              </div>
            </section>

            {/* PROJECT TASKS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Project Tasks
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Track the team's development progress.
                  </p>
                </div>

                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                  {completedCount}/{tasks.length} Done
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {tasks.map((task, index) => {
                  const completed = completedTasks.includes(index);

                  return (
                    <button
                      key={task}
                      type="button"
                      onClick={() => toggleTask(index)}
                      className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-teal-200 hover:bg-teal-50/40"
                    >
                      <div
                        className={
                          completed
                            ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100"
                            : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-slate-300"
                        }
                      >
                        {completed && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        )}
                      </div>

                      <span
                        className={
                          completed
                            ? "text-sm font-semibold text-slate-500 line-through"
                            : "text-sm font-semibold text-slate-800"
                        }
                      >
                        {task}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* PROTOTYPE */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <Code2 className="h-5 w-5 text-emerald-700" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Prototype
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Current prototype submitted by the team.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-bold text-slate-900">
                      Smart Water Monitoring Dashboard
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                        IoT
                      </span>

                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                        React
                      </span>

                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                        Sensors
                      </span>
                    </div>
                  </div>

                  {prototypeUrl && (
                    <a
                      href={prototypeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800"
                    >
                      View Prototype
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  )}
                </div>

                {prototypeFile && (
                  <p className="mt-4 text-xs font-medium text-slate-500">
                    Uploaded file: {prototypeFile.name}
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="space-y-6">
            {/* PROJECT PROGRESS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  Project Progress
                </h2>

                <span className="text-xl font-black text-teal-700">
                  68%
                </span>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-teal-600"
                  style={{ width: "68%" }}
                />
              </div>

              <p className="mt-3 text-sm text-slate-500">
                The project is currently in the prototype development stage.
              </p>
            </section>

            {/* PROJECT TEAM */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Project Team
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Students and faculty working on the project.
                  </p>
                </div>

                <Users className="h-5 w-5 text-teal-700" />
              </div>

              <div className="mt-5 space-y-4">
                {team.map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
                      {member.initial}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {member.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/university/teams"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
              >
                Manage Team
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            {/* PROJECT BUDGET */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <Wallet className="h-5 w-5 text-emerald-700" />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Project Budget
                  </p>

                  <p className="mt-1 text-2xl font-black text-slate-900">
                    ₹1.8 Lakhs
                  </p>
                </div>
              </div>
            </section>

            {/* EXPECTED IMPACT */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                  <Users className="h-5 w-5 text-teal-700" />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Expected Impact
                  </p>

                  <p className="mt-1 text-2xl font-black text-slate-900">
                    400+
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    People expected to benefit
                  </p>
                </div>
              </div>
            </section>

            {/* ================= INDUSTRY COLLABORATION ================= */}
            <section
              className={
                collaborationRequested
                  ? "rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm"
                  : "rounded-2xl border border-teal-200 bg-white p-6 shadow-sm"
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                    <Handshake className="h-5 w-5 text-teal-700" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Industry Collaboration
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Get industry support to take this solution from
                      prototype to field deployment.
                    </p>
                  </div>
                </div>

                <span
                  className={
                    collaborationRequested
                      ? "shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700"
                      : "shrink-0 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600"
                  }
                >
                  {collaborationRequested
                    ? "Requested"
                    : "Not Requested"}
                </span>
              </div>

              {/* Collaboration Details */}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Current Partner
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {collaborationRequested
                      ? selectedCompanyName
                      : "No industry partner yet"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Support Received
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {collaborationRequested
                      ? "Request under review"
                      : "No support received"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Funding
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {collaborationRequested
                      ? fundingAmount
                        ? `₹${Number(fundingAmount).toLocaleString("en-IN")}`
                        : "Pending approval"
                      : "₹0"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Collaboration Status
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {collaborationRequested
                      ? "Requested"
                      : "Not Requested"}
                  </p>
                </div>
              </div>

              {/* Requested Support */}
              {collaborationRequested &&
                selectedSupports.length > 0 && (
                  <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                      Support Requested
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedSupports.map((support) => (
                        <span
                          key={support}
                          className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-emerald-700"
                        >
                          {support}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Actions */}
              {/* Actions */}
<div className="mt-5 grid gap-3 sm:grid-cols-2">
  <Link
    href="/university/industry"
    className="flex items-center justify-center gap-2 rounded-xl border border-teal-300 px-4 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-50"
  >
    <Building2 className="h-4 w-4" />
    Find Industry Partners
  </Link>

  {collaborationRequested ? (
    <Link
      href={`/university/projects/${projectId}/collaboration/COL-001`}
      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
    >
      View Collaboration
      <ArrowRight className="h-4 w-4" />
    </Link>
  ) : (
    <button
      type="button"
      onClick={openCollaborationModal}
      className="flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
    >
      <Handshake className="h-4 w-4" />
      Request Support
    </button>
  )}
</div>
            </section>

            {/* UPLOAD PROTOTYPE */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                  <Upload className="h-5 w-5 text-teal-700" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Upload Prototype
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Upload the latest prototype or project build.
                  </p>
                </div>
              </div>

              <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-teal-400 hover:bg-teal-50/40">
                <Upload className="h-7 w-7 text-slate-400" />

                <p className="mt-3 text-sm font-bold text-slate-700">
                  Click to upload prototype
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  ZIP, APK, PDF or project files
                </p>

                <input
                  type="file"
                  className="hidden"
                  onChange={handlePrototypeUpload}
                />
              </label>
            </section>
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="mt-10 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <p className="text-xs font-medium text-slate-400">
            © 2026 SamadhanX • Ideas → Action → Impact
          </p>

          <p className="text-xs text-slate-400">
            University Innovation Portal
          </p>
        </div>
      </footer>

      {/* ================= COLLABORATION REQUEST MODAL ================= */}
      {showCollaborationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">
                  <Handshake className="h-5 w-5 text-teal-700" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Request Industry Collaboration
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Request support from an industry partner for this project.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCollaborationModal(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 p-6">
              {/* Project */}
              <div>
                <label className="text-sm font-bold text-slate-800">
                  Project
                </label>

                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-bold text-slate-900">
                    Smart Water Management System
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    University Innovation Project
                  </p>
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="text-sm font-bold text-slate-800">
                  Industry Company
                </label>

                <select
                  value={selectedCompany}
                  onChange={(event) =>
                    setSelectedCompany(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                >
                  <option value="">
                    Select an industry partner
                  </option>

                  {industryPartners.map((partner) => (
                    <option
                      key={partner.id}
                      value={partner.id}
                    >
                      {partner.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Support Types */}
              <div>
                <label className="text-sm font-bold text-slate-800">
                  Support Required
                </label>

                <p className="mt-1 text-xs text-slate-500">
                  Select one or more types of support your project needs.
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {supportOptions.map((support) => {
                    const checked =
                      selectedSupports.includes(support);

                    return (
                      <label
                        key={support}
                        className={
                          checked
                            ? "flex cursor-pointer items-center gap-3 rounded-xl border border-teal-300 bg-teal-50 p-3 transition"
                            : "flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-teal-300 hover:bg-teal-50/40"
                        }
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleSupport(support)
                          }
                          className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-500"
                        />

                        <span className="text-sm font-semibold text-slate-700">
                          {support}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Funding */}
              <div>
                <label className="text-sm font-bold text-slate-800">
                  Estimated Funding Required
                </label>

                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    value={fundingAmount}
                    onChange={(event) =>
                      setFundingAmount(event.target.value)
                    }
                    placeholder="Enter estimated amount"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-bold text-slate-800">
                  Message
                </label>

                <textarea
                  rows={5}
                  value={collaborationMessage}
                  onChange={(event) =>
                    setCollaborationMessage(event.target.value)
                  }
                  placeholder="Explain what support your team needs and how the industry partner can contribute..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 p-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowCollaborationModal(false)}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRequestCollaboration}
                className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
              >
                Send Collaboration Request
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}