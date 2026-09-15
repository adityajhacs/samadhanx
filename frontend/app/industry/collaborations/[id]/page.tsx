"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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

const statusMap: Record<string, CollaborationStatus> = {
  REQUESTED: "Pending Review",
  UNDER_REVIEW: "Under Discussion",
  ACCEPTED: "Active",
  COMPLETED: "Completed",
  REJECTED: "Pending Review",
};

type ApiCollaboration = {
  id: string;
  project_id: string | null;
  industry_partner_id: string | null;
  collaboration_type: string | null;
  amount: number | null;
  status: string | null;
  description: string | null;
  created_at: string | null;
};

type ApiProject = {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
};

const supportTypeMap: Record<string, string> = {
  FUNDING: "Funding",
  MENTORSHIP: "Mentorship",
  HARDWARE: "Technical Support",
  TESTING: "Testing",
  PROTOTYPING: "Prototyping",
};

const projectProgress: Record<string, number> = {
  IDEA: 10,
  VALIDATION: 20,
  TEAM_FORMATION: 30,
  SOLUTION_DESIGN: 40,
  PROTOTYPE: 60,
  FIELD_PILOT: 75,
  DEPLOYED: 90,
  IMPACT_MEASUREMENT: 100,
};

function formatAmount(amount: number | null) {
  return amount == null ? "—" : `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

async function getApiData<T>(path: string): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("auth_token") ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("auth_token") ||
        sessionStorage.getItem("token")
      : null;

  const response = await fetch(`${baseUrl}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body?.detail) message = body.detail;
    } catch {
      // Keep the fallback message.
    }
    throw new Error(message);
  }

  return response.json();
}

const statusOrder: CollaborationStatus[] = [
  "Pending Review",
  "Under Discussion",
  "Active",
  "Completed",
];

export default function CollaborationDetailPage() {
  const params = useParams<{ id: string }>();
  const collaborationId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [collaboration, setCollaboration] =
    useState<CollaborationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!collaborationId) {
        setError("Collaboration ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const apiCollaboration = await getApiData<ApiCollaboration>(
          `/api/collaborations/${encodeURIComponent(collaborationId)}`
        );

        let project: ApiProject | null = null;

        if (apiCollaboration.project_id) {
          try {
            project = await getApiData<ApiProject>(
              `/api/projects/${encodeURIComponent(apiCollaboration.project_id)}`
            );
          } catch (projectError) {
            console.warn("Project details could not be loaded:", projectError);
          }
        }

        const mappedStatus =
          statusMap[apiCollaboration.status ?? ""] ?? "Pending Review";

        const mapped: CollaborationDetail = {
          id: apiCollaboration.id,
          projectId: apiCollaboration.project_id ?? "",
          project: project?.title ?? "Untitled Project",
          problem:
            project?.description ??
            apiCollaboration.description ??
            "No project description available",
          university: "University information unavailable",
          location: "Location unavailable",
          supportType:
            supportTypeMap[apiCollaboration.collaboration_type ?? ""] ??
            "Technical Support",
          status: mappedStatus,
          commitment: formatAmount(apiCollaboration.amount),
          progress: projectProgress[project?.status ?? ""] ?? 0,
          submitted: formatDate(apiCollaboration.created_at),
          overview:
            project?.description ??
            apiCollaboration.description ??
            "No collaboration overview available.",
          supportScope:
            apiCollaboration.description ??
            "No additional collaboration scope has been provided.",
          universityRole:
            "The university team is responsible for solution development and project execution.",
          industryRole:
            "The industry partner provides the agreed support, expertise and validation.",
          governmentRole:
            "Government stakeholders can provide deployment context and oversight where applicable.",
          nextAction:
            mappedStatus === "Completed"
              ? "Completed. Review outcomes for future scaling opportunities."
              : "Review the collaboration scope and continue with the next project milestone.",
          milestones: [
            {
              title: "Collaboration Submitted",
              description: "The collaboration proposal was submitted.",
              status: "Completed",
              date: formatDate(apiCollaboration.created_at),
            },
            {
              title: "Current Project Stage",
              description:
                project?.status
                  ? `Project is currently at the ${project.status.replaceAll("_", " ").toLowerCase()} stage.`
                  : "Current project stage is not available.",
              status: mappedStatus === "Completed" ? "Completed" : "Current",
              date: "Current",
            },
            {
              title: "Next Milestone",
              description:
                mappedStatus === "Completed"
                  ? "Review completed outcomes and identify future opportunities."
                  : "Continue execution and submit progress for the next review.",
              status: mappedStatus === "Completed" ? "Completed" : "Upcoming",
              date: "Upcoming",
            },
          ],
          activity: [
            {
              title: "Collaboration created",
              description:
                apiCollaboration.description ??
                "Collaboration record created successfully.",
              date: formatDate(apiCollaboration.created_at),
              completed: true,
            },
            {
              title:
                mappedStatus === "Completed"
                  ? "Collaboration completed"
                  : "Current collaboration status",
              description:
                mappedStatus === "Completed"
                  ? "This collaboration has been marked completed."
                  : `Current status: ${mappedStatus}.`,
              date: "Current",
              completed: mappedStatus === "Completed",
            },
          ],
        };

        if (!cancelled) setCollaboration(mapped);
      } catch (err) {
        console.error("Failed to load collaboration:", err);
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load collaboration."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [collaborationId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
          <p className="mt-4 text-sm font-semibold text-slate-700">
            Loading collaboration...
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Fetching partnership workspace
          </p>
        </div>
      </main>
    );
  }

  if (error || !collaboration) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-lg rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <Handshake className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-lg font-bold text-slate-900">
            Unable to load collaboration
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error || "The requested collaboration could not be found."}
          </p>
          <Link
            href="/industry/collaborations"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Collaborations
          </Link>
        </div>
      </main>
    );
  }

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