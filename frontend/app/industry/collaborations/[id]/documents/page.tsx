"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  Handshake,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

type DocumentItem = {
  id: string;
  name: string;
  description: string;
  type: string;
  size: string;
  status: "Available" | "Pending";
  category: string;
};

type Collaboration = {
  id: string;
  projectId: string;
  project: string;
  university: string;
  location: string;
  documents: DocumentItem[];
};

const collaborations: Collaboration[] = [
  {
    id: "COL-001",
    projectId: "PRJ-001",
    project: "Smart Road Monitoring Pilot",
    university: "Birla Institute of Technology, Mesra",
    location: "Ranchi, Jharkhand",
    documents: [
      {
        id: "DOC-001",
        name: "Project Proposal",
        description: "Overview of the problem, proposed approach and project objectives.",
        type: "PDF",
        size: "2.4 MB",
        status: "Available",
        category: "Project",
      },
      {
        id: "DOC-002",
        name: "Technical Specification",
        description: "Technical architecture, detection workflow and system requirements.",
        type: "PDF",
        size: "3.1 MB",
        status: "Available",
        category: "Technical",
      },
      {
        id: "DOC-003",
        name: "Prototype Report",
        description: "Current prototype capabilities, testing results and implementation progress.",
        type: "PDF",
        size: "1.8 MB",
        status: "Available",
        category: "Prototype",
      },
      {
        id: "DOC-004",
        name: "Budget & Funding Plan",
        description: "Estimated project cost and proposed allocation of industry support.",
        type: "PDF",
        size: "1.2 MB",
        status: "Available",
        category: "Finance",
      },
      {
        id: "DOC-005",
        name: "Testing Report",
        description: "Field testing observations and validation results.",
        type: "PDF",
        size: "2.1 MB",
        status: "Available",
        category: "Testing",
      },
      {
        id: "DOC-006",
        name: "Impact Report",
        description: "Project outcomes, deployment indicators and measurable impact.",
        type: "PDF",
        size: "1.6 MB",
        status: "Pending",
        category: "Impact",
      },
    ],
  },
  {
    id: "COL-002",
    projectId: "PRJ-002",
    project: "Community Water Monitoring",
    university: "National Institute of Technology, Jamshedpur",
    location: "Jamshedpur, Jharkhand",
    documents: [
      {
        id: "DOC-007",
        name: "Project Proposal",
        description: "Community water monitoring project objectives and implementation plan.",
        type: "PDF",
        size: "2.1 MB",
        status: "Available",
        category: "Project",
      },
      {
        id: "DOC-008",
        name: "Sensor Specification",
        description: "Details of the proposed water monitoring sensors and system design.",
        type: "PDF",
        size: "2.8 MB",
        status: "Available",
        category: "Technical",
      },
      {
        id: "DOC-009",
        name: "Pilot Testing Report",
        description: "Initial sensor deployment and field validation observations.",
        type: "PDF",
        size: "1.9 MB",
        status: "Available",
        category: "Testing",
      },
      {
        id: "DOC-010",
        name: "Funding Plan",
        description: "Estimated cost and planned use of industry support.",
        type: "PDF",
        size: "1.1 MB",
        status: "Available",
        category: "Finance",
      },
    ],
  },
  {
    id: "COL-003",
    projectId: "PRJ-003",
    project: "Rural Sanitation Deployment",
    university: "Central University of Jharkhand",
    location: "Dhanbad, Jharkhand",
    documents: [
      {
        id: "DOC-011",
        name: "Project Proposal",
        description: "Deployment strategy for modular sanitation infrastructure.",
        type: "PDF",
        size: "2.7 MB",
        status: "Available",
        category: "Project",
      },
      {
        id: "DOC-012",
        name: "Technical Design",
        description: "Design specifications and site deployment requirements.",
        type: "PDF",
        size: "3.4 MB",
        status: "Available",
        category: "Technical",
      },
      {
        id: "DOC-013",
        name: "Budget & Funding Plan",
        description: "Project budget and proposed funding requirements.",
        type: "PDF",
        size: "1.4 MB",
        status: "Available",
        category: "Finance",
      },
      {
        id: "DOC-014",
        name: "Deployment Report",
        description: "Deployment progress and field observations.",
        type: "PDF",
        size: "1.9 MB",
        status: "Pending",
        category: "Impact",
      },
    ],
  },
  {
    id: "COL-004",
    projectId: "PRJ-004",
    project: "Solar Street Infrastructure",
    university: "Birla Institute of Technology, Mesra",
    location: "Bokaro, Jharkhand",
    documents: [
      {
        id: "DOC-015",
        name: "Project Proposal",
        description: "Solar street infrastructure concept and project objectives.",
        type: "PDF",
        size: "2.2 MB",
        status: "Available",
        category: "Project",
      },
      {
        id: "DOC-016",
        name: "Prototype Specification",
        description: "Solar lighting unit, battery and monitoring specifications.",
        type: "PDF",
        size: "3.0 MB",
        status: "Available",
        category: "Prototype",
      },
      {
        id: "DOC-017",
        name: "Prototyping Plan",
        description: "Manufacturing, assembly and validation requirements.",
        type: "PDF",
        size: "1.7 MB",
        status: "Available",
        category: "Technical",
      },
      {
        id: "DOC-018",
        name: "Budget Plan",
        description: "Estimated prototype and deployment cost.",
        type: "PDF",
        size: "1.0 MB",
        status: "Available",
        category: "Finance",
      },
    ],
  },
  {
    id: "COL-005",
    projectId: "PRJ-005",
    project: "Citizen Complaint Analytics",
    university: "National Institute of Technology, Jamshedpur",
    location: "Hazaribagh, Jharkhand",
    documents: [
      {
        id: "DOC-019",
        name: "Project Proposal",
        description: "Analytics workflow for identifying recurring citizen complaints.",
        type: "PDF",
        size: "2.0 MB",
        status: "Available",
        category: "Project",
      },
      {
        id: "DOC-020",
        name: "Analytics Specification",
        description: "Complaint categorization, clustering and trend analysis approach.",
        type: "PDF",
        size: "2.6 MB",
        status: "Available",
        category: "Technical",
      },
      {
        id: "DOC-021",
        name: "Impact Report",
        description: "Results from the deployed complaint analytics workflow.",
        type: "PDF",
        size: "1.8 MB",
        status: "Available",
        category: "Impact",
      },
    ],
  },
  {
    id: "COL-006",
    projectId: "PRJ-006",
    project: "Low-Cost Road Repair Material",
    university: "Birla Institute of Technology, Mesra",
    location: "Deoghar, Jharkhand",
    documents: [
      {
        id: "DOC-022",
        name: "Research Proposal",
        description: "Research objectives and proposed low-cost material formulation.",
        type: "PDF",
        size: "2.3 MB",
        status: "Available",
        category: "Project",
      },
      {
        id: "DOC-023",
        name: "Material Specification",
        description: "Material composition and laboratory testing requirements.",
        type: "PDF",
        size: "2.9 MB",
        status: "Available",
        category: "Technical",
      },
      {
        id: "DOC-024",
        name: "Testing Plan",
        description: "Strength, durability and cost-performance validation plan.",
        type: "PDF",
        size: "1.5 MB",
        status: "Available",
        category: "Testing",
      },
      {
        id: "DOC-025",
        name: "Budget Plan",
        description: "Estimated laboratory and prototype testing costs.",
        type: "PDF",
        size: "1.0 MB",
        status: "Pending",
        category: "Finance",
      },
    ],
  },
];

const categoryStyles: Record<string, string> = {
  Project: "bg-teal-50 text-teal-700 border-teal-100",
  Technical: "bg-sky-50 text-sky-700 border-sky-100",
  Prototype: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Finance: "bg-amber-50 text-amber-700 border-amber-100",
  Testing: "bg-violet-50 text-violet-700 border-violet-100",
  Impact: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function CollaborationDocumentsPage() {
  const params = useParams();

  const collaborationId = String(params.id);

  const collaboration =
    collaborations.find((item) => item.id === collaborationId) ??
    collaborations[0];

  const availableDocuments = collaboration.documents.filter(
    (document) => document.status === "Available"
  );

  const pendingDocuments = collaboration.documents.filter(
    (document) => document.status === "Pending"
  );

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
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link
            href={`/industry/collaborations/${collaboration.id}`}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-teal-100 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Collaboration
          </Link>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-teal-700 bg-teal-900/60 px-3 py-1 text-xs font-semibold text-teal-100">
                  {collaboration.id}
                </span>

                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                  {collaboration.projectId}
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Project Documents
              </h1>

              <p className="mt-3 text-sm leading-6 text-teal-100/80 sm:text-base">
                Access the project proposal, technical documentation,
                prototype reports, funding information and impact records
                associated with this collaboration.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs font-medium text-teal-100/70">
                Documents Available
              </p>
              <p className="mt-1 text-2xl font-bold text-white">
                {availableDocuments.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Project Summary */}
        <section className="mb-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                Collaboration Project
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-900">
                {collaboration.project}
              </h2>

              <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:gap-5">
                <span className="flex items-center gap-2">
                  <Users size={15} className="text-slate-400" />
                  {collaboration.university}
                </span>

                <span className="flex items-center gap-2">
                  <MapPin size={15} className="text-slate-400" />
                  {collaboration.location}
                </span>
              </div>
            </div>

            <Link
              href={`/industry/projects/${collaboration.projectId}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
            >
              View Project
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Search / Document Header */}
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Available Documents
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review the information required for collaboration evaluation.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search documents"
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>
        </div>

        {/* Documents */}
        <section className="grid gap-4 md:grid-cols-2">
          {availableDocuments.map((document) => (
            <article
              key={document.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                  <FileText size={21} className="text-teal-700" />
                </div>

                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                    categoryStyles[document.category] ??
                    "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  {document.category}
                </span>
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-900">
                {document.name}
              </h3>

              <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                {document.description}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-600">
                    {document.type}
                  </span>{" "}
                  • {document.size}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        `${document.name} preview will be connected to the backend document service later.`
                      )
                    }
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        `${document.name} download will be connected to the backend document service later.`
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-800"
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Pending */}
        {pendingDocuments.length > 0 && (
          <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50/70 p-6">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                <ShieldCheck size={19} className="text-amber-700" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-amber-900">
                  Documents Pending Upload
                </h3>

                <p className="mt-1 text-xs leading-5 text-amber-800/70">
                  Some project records are not available yet and will become
                  accessible once they are submitted by the project team.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pendingDocuments.map((document) => (
                <div
                  key={document.id}
                  className="rounded-xl border border-amber-200 bg-white/70 p-4"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={17} className="text-amber-600" />

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {document.name}
                      </p>

                      <p className="mt-0.5 text-xs text-amber-700">
                        Pending
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Document Policy */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <CheckCircle2
                  size={21}
                  className="text-emerald-600"
                />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Secure Collaboration Records
                </h3>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                  Project documents are associated with the collaboration
                  workspace. In the production system, access will be
                  controlled through authenticated industry, university and
                  government roles.
                </p>
              </div>
            </div>

            <Link
              href={`/industry/collaborations/${collaboration.id}/contact`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
            >
              Contact Project Team
              <ArrowRight size={15} />
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