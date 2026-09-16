
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock3,
  Handshake,
  IndianRupee,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";

import { apiRequest, getAuthToken } from "@/lib/api/client";

type Collaboration = {
  id: string;
  project_id: string | null;
  industry_partner_id: string | null;
  collaboration_type: string | null;
  amount: string | number | null;
  status: string | null;
  description: string | null;
  created_at: string | null;
};

type Project = {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  created_by: string | null;
  deadline: string | null;
  progress: number | null;
  budget: string | number | null;
  expected_impact: string | null;
  prototype_name: string | null;
  prototype_url: string | null;
};

type IndustryPartner = {
  id: string;
  name: string;
  industry_type: string | null;
  description: string | null;
  location: string | null;
  contact_email: string | null;
  created_at: string | null;
};

const formatLabel = (value: string | null | undefined) => {
  if (!value) return "Unknown";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatAmount = (amount: string | number | null) => {
  if (amount === null || amount === undefined || amount === "") {
    return "Not specified";
  }

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return String(amount);
  }

  return `₹${numericAmount.toLocaleString("en-IN")}`;
};

const formatDate = (date: string | null) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusMessage = (status: string | null) => {
  switch (status) {
    case "REQUESTED":
      return "The collaboration request has been submitted and is waiting for review.";

    case "UNDER_REVIEW":
      return "The collaboration request is currently under industry partner review.";

    case "ACCEPTED":
      return "The collaboration request has been accepted by the industry partner.";

    case "REJECTED":
      return "The collaboration request has been rejected.";

    case "COMPLETED":
      return "This collaboration has been marked as completed.";

    default:
      return "The current collaboration status is available from the backend.";
  }
};

const getStatusClasses = (status: string | null) => {
  switch (status) {
    case "ACCEPTED":
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700";

    case "REJECTED":
      return "bg-red-50 text-red-700";

    case "UNDER_REVIEW":
      return "bg-blue-50 text-blue-700";

    case "REQUESTED":
    default:
      return "bg-amber-50 text-amber-700";
  }
};

export default function CollaborationDetailPage() {
  const params = useParams();

  const projectId = String(params?.id ?? "");
  const collaborationId = String(params?.collaborationId ?? "");

  const [collaboration, setCollaboration] =
    useState<Collaboration | null>(null);

  const [project, setProject] = useState<Project | null>(null);

  const [partner, setPartner] =
    useState<IndustryPartner | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId || !collaborationId) {
      setError("Project ID or collaboration ID is missing.");
      setLoading(false);
      return;
    }

    const loadCollaborationDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getAuthToken();

        if (!token) {
          throw new Error("Please login first.");
        }

        const collaborationData =
          await apiRequest<Collaboration>(
            `/api/collaborations/${collaborationId}`,
            {
              method: "GET",
              token,
            }
          );

        setCollaboration(collaborationData);

        if (
          collaborationData.project_id &&
          collaborationData.project_id !== projectId
        ) {
          throw new Error(
            "This collaboration does not belong to the selected project."
          );
        }

        const requests: [
          Promise<Project | null>,
          Promise<IndustryPartner | null>
        ] = [
          collaborationData.project_id
            ? apiRequest<Project>(
                `/api/projects/${collaborationData.project_id}`,
                {
                  method: "GET",
                  token,
                }
              )
            : Promise.resolve(null),

          collaborationData.industry_partner_id
            ? apiRequest<IndustryPartner>(
                `/api/industry/${collaborationData.industry_partner_id}`,
                {
                  method: "GET",
                  token,
                }
              )
            : Promise.resolve(null),
        ];

        const [projectData, partnerData] =
          await Promise.all(requests);

        setProject(projectData);
        setPartner(partnerData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load collaboration details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCollaborationDetails();
  }, [projectId, collaborationId]);

  const collaborationType = useMemo(
    () => formatLabel(collaboration?.collaboration_type),
    [collaboration]
  );

  const collaborationStatus = useMemo(
    () => formatLabel(collaboration?.status),
    [collaboration]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
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
          </div>
        </nav>

        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
              <Handshake className="h-6 w-6 animate-pulse text-teal-700" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Loading collaboration...
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Fetching collaboration, project and industry partner
              information.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !collaboration) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
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
          </div>
        </nav>

        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link
            href={`/university/projects/${projectId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Project Workspace
          </Link>

          <div className="mt-6 rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Unable to load collaboration
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error || "Collaboration not found."}
            </p>

            <Link
              href={`/university/projects/${projectId}`}
              className="mt-5 inline-flex rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
            >
              Back to Project
            </Link>
          </div>
        </div>
      </main>
    );
  }

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
          href={`/university/projects/${projectId}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Project Workspace
        </Link>

        {/* ================= HEADER ================= */}

        <section className="mt-6 rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-700 to-teal-800 p-7 text-white shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                  Collaboration
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClasses(
                    collaboration.status
                  )}`}
                >
                  {collaborationStatus}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Industry Collaboration
              </h1>

              <p className="mt-2 text-teal-100">
                University ↔ Industry Partnership Workspace
              </p>

              <p className="mt-3 text-xs text-teal-200">
                Collaboration ID: {collaboration.id}
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4">
              <p className="text-xs text-teal-100">
                Requested Amount
              </p>

              <p className="mt-1 text-2xl font-black">
                {formatAmount(collaboration.amount)}
              </p>

              <p className="mt-1 text-xs text-teal-100">
                {collaborationType}
              </p>
            </div>
          </div>
        </section>

        {/* ================= CONTENT ================= */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          {/* ================= LEFT ================= */}

          <div className="space-y-6">
            {/* PARTNER */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                  <Building2 className="h-6 w-6 text-teal-700" />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Industry Partner
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-900">
                    {partner?.name || "Industry Partner"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {partner?.industry_type || "Industry"}
                  </p>

                  {partner?.location && (
                    <p className="mt-2 text-sm text-slate-500">
                      {partner.location}
                    </p>
                  )}

                  {partner && (
                    <Link
                      href={`/university/industry/${partner.id}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-800"
                    >
                      View Partner
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Link>
                  )}
                </div>
              </div>
            </section>

            {/* PROJECT */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Handshake className="h-5 w-5 text-slate-700" />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Linked Project
                  </h2>

                  <p className="text-sm text-slate-500">
                    Project receiving industry support.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Project
                </p>

                <h3 className="mt-1 text-lg font-black text-slate-900">
                  {project?.title || `Project ${projectId}`}
                </h3>

                {project?.description && (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {project.description}
                  </p>
                )}

                {project?.status && (
                  <span className="mt-4 inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
                    {formatLabel(project.status)}
                  </span>
                )}

                <div>
                  <Link
                    href={`/university/projects/${projectId}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-800"
                  >
                    Open Project Workspace
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Link>
                </div>
              </div>
            </section>

            {/* SUPPORT REQUESTED */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Support Requested
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Collaboration support requested from the industry partner.
              </p>

              <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-700" />

                  <div>
                    <p className="text-xs font-medium text-teal-700">
                      Collaboration Type
                    </p>

                    <p className="mt-1 text-sm font-black text-teal-900">
                      {collaborationType}
                    </p>
                  </div>
                </div>
              </div>

              {collaboration.amount !== null &&
                collaboration.amount !== undefined && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <IndianRupee className="h-5 w-5 text-slate-600" />

                      <div>
                        <p className="text-xs text-slate-500">
                          Requested Amount
                        </p>

                        <p className="text-lg font-black text-slate-900">
                          {formatAmount(collaboration.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {collaboration.description && (
                <div className="mt-4 rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Request Description
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {collaboration.description}
                  </p>
                </div>
              )}
            </section>

            {/* COLLABORATION INFORMATION */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <Clock3 className="h-5 w-5 text-emerald-700" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Collaboration Timeline
                  </h2>

                  <p className="text-sm text-slate-500">
                    Timeline based on information currently available in
                    the backend.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Collaboration Request Created
                    </h3>

                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {formatDate(collaboration.created_at)}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      The collaboration request was created in
                      SamadhanX.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      collaboration.status === "ACCEPTED" ||
                      collaboration.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {collaboration.status === "ACCEPTED" ||
                    collaboration.status === "COMPLETED" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Clock3 className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Current Collaboration Status
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {collaborationStatus}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {getStatusMessage(collaboration.status)}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ================= RIGHT ================= */}

          <div className="space-y-6">
            {/* STATUS */}

            <section className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-amber-600" />

                <h2 className="text-base font-bold text-slate-900">
                  Collaboration Status
                </h2>
              </div>

              <div
                className={`mt-5 rounded-xl p-4 ${getStatusClasses(
                  collaboration.status
                )}`}
              >
                <p className="text-xs font-bold uppercase tracking-wide">
                  Current Status
                </p>

                <p className="mt-1 text-xl font-black">
                  {collaborationStatus}
                </p>

                <p className="mt-2 text-sm leading-5">
                  {getStatusMessage(collaboration.status)}
                </p>
              </div>
            </section>

            {/* PROJECT TEAM */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-teal-700" />

                <h2 className="text-base font-bold text-slate-900">
                  Project Team
                </h2>
              </div>

              <p className="mt-3 text-sm text-slate-500">
                View the team and project workspace associated with this
                collaboration.
              </p>

              <Link
                href={`/university/projects/${projectId}`}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                View Project Workspace
              </Link>
            </section>

            {/* COMMUNICATION */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <MessageSquare className="h-5 w-5 text-slate-700" />
              </div>

              <h2 className="mt-4 text-base font-bold text-slate-900">
                Communication
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Use the industry partner&apos;s contact information when
                available.
              </p>

              {partner?.contact_email ? (
                <a
                  href={`mailto:${partner.contact_email}`}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
                >
                  <MessageSquare className="h-4 w-4" />
                  Contact Partner
                </a>
              ) : (
                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-500">
                  No contact email has been provided by this industry
                  partner.
                </div>
              )}
            </section>

            {/* PARTNERSHIP REVIEW */}

            <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

                <div>
                  <h2 className="text-sm font-bold text-emerald-900">
                    Partnership Review
                  </h2>

                  <p className="mt-2 text-xs leading-5 text-emerald-800">
                    The collaboration status shown here is taken directly
                    from the backend collaboration record.
                  </p>
                </div>
              </div>
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
    </main>
  );
}

