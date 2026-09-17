
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Handshake,
  Lightbulb,
  MapPin,
  Search,
  ShieldCheck,
  Target,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";

/* =============================================================
   TYPES
============================================================= */

type CollaborationType =
  | "FUNDING"
  | "MENTORSHIP"
  | "HARDWARE"
  | "TESTING"
  | "PROTOTYPING";

type CollaborationStatus =
  | "REQUESTED"
  | "UNDER_REVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "COMPLETED";

type BackendCollaboration = {
  id: string;
  project_id: string | null;
  industry_partner_id: string | null;
  collaboration_type: CollaborationType | string | null;
  amount: number | string | null;
  status: CollaborationStatus | string | null;
  description: string | null;
  created_at: string | null;
};

type BackendIndustry = {
  id: string;
  name: string;
  industry_type?: string | null;
  description?: string | null;
  location?: string | null;
  contact_email?: string | null;
};

type BackendProject = {
  id: string;
  problem_id?: string | null;
  solution_id?: string | null;
  title?: string | null;
  description?: string | null;
  status?: string | null;
  created_by?: string | null;
  deadline?: string | null;
  progress?: number | null;
  budget?: number | null;
  expected_impact?: string | null;
};

type BackendSolution = {
  id: string;
  problem_id?: string | null;
  university_id?: string | null;
  solution_title?: string | null;
};

type BackendUniversity = {
  id: string;
  name: string;
  district?: string | null;
  department?: string | null;
};

type Collaboration = {
  id: string;
  company: string;
  project: string;
  problem: string;
  university: string;
  district: string;
  type: CollaborationType | string;
  status: CollaborationStatus | string;
  amount: number;
  startDate: string;
  description: string;
};

/* =============================================================
   HELPERS
============================================================= */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getAuthToken() {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
}

async function apiFetch<T>(endpoint: string): Promise<T> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized. Please login again.");
    }

    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

function formatType(type: string | null) {
  if (!type) return "Not specified";

  const labels: Record<string, string> = {
    FUNDING: "Funding",
    MENTORSHIP: "Mentorship",
    HARDWARE: "Hardware",
    TESTING: "Testing",
    PROTOTYPING: "Prototyping",
  };

  return labels[type] || type;
}

function formatStatus(status: string | null) {
  if (!status) return "Unknown";

  const labels: Record<string, string> = {
    REQUESTED: "Requested",
    UNDER_REVIEW: "Under Review",
    ACCEPTED: "Accepted",
    REJECTED: "Rejected",
    COMPLETED: "Completed",
  };

  return labels[status] || status;
}

function normalizeStatus(status: string | null): CollaborationStatus | string {
  return status || "UNKNOWN";
}

/* =============================================================
   PAGE
============================================================= */

export default function GovernmentCollaborationsPage() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "All" | CollaborationStatus
  >("All");

  const [typeFilter, setTypeFilter] = useState<
    "All" | CollaborationType
  >("All");

  /* ===========================================================
     FETCH COLLABORATIONS
  =========================================================== */

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        setLoading(true);
        setError("");

        const backendCollaborations =
          await apiFetch<BackendCollaboration[]>(
            "/api/collaborations"
          );

        /*
         * Fetch industries once.
         */
        let industries: BackendIndustry[] = [];

        try {
          industries = await apiFetch<BackendIndustry[]>(
            "/api/industry"
          );
        } catch (industryError) {
          console.error(
            "Industry fetch failed:",
            industryError
          );
        }

        const industryMap = new Map(
          industries.map((industry) => [
            String(industry.id),
            industry,
          ])
        );

        /*
         * Fetch project information for every collaboration.
         *
         * We use Promise.allSettled so that one missing project
         * does not break the entire collaborations page.
         */
        const projectResults = await Promise.allSettled(
          backendCollaborations
            .filter((item) => item.project_id)
            .map((item) =>
              apiFetch<BackendProject>(
                `/api/projects/${item.project_id}`
              )
            )
        );

        const projectMap = new Map<string, BackendProject>();

        projectResults.forEach((result) => {
          if (result.status === "fulfilled") {
            projectMap.set(
              String(result.value.id),
              result.value
            );
          }
        });

        /*
         * Fetch solutions so we can resolve:
         *
         * Project
         *    ↓
         * Solution
         *    ↓
         * University
         */
        const solutionIds = Array.from(
          new Set(
            Array.from(projectMap.values())
              .map((project) => project.solution_id)
              .filter(Boolean)
          )
        );

        const solutionResults = await Promise.allSettled(
          solutionIds.map((solutionId) =>
            apiFetch<BackendSolution>(
              `/api/solutions/${solutionId}`
            )
          )
        );

        const solutionMap = new Map<string, BackendSolution>();

        solutionResults.forEach((result) => {
          if (result.status === "fulfilled") {
            solutionMap.set(
              String(result.value.id),
              result.value
            );
          }
        });

        /*
         * Fetch universities once.
         */
        let universities: BackendUniversity[] = [];

        try {
          universities = await apiFetch<BackendUniversity[]>(
            "/api/universities"
          );
        } catch (universityError) {
          console.error(
            "University fetch failed:",
            universityError
          );
        }

        const universityMap = new Map(
          universities.map((university) => [
            String(university.id),
            university,
          ])
        );

        /*
         * Build frontend display objects from real backend data.
         */
        const mappedCollaborations: Collaboration[] =
          backendCollaborations.map((item) => {
            const project = item.project_id
              ? projectMap.get(String(item.project_id))
              : undefined;

            const industry = item.industry_partner_id
              ? industryMap.get(
                  String(item.industry_partner_id)
                )
              : undefined;

            const solution = project?.solution_id
              ? solutionMap.get(
                  String(project.solution_id)
                )
              : undefined;

            const university = solution?.university_id
              ? universityMap.get(
                  String(solution.university_id)
                )
              : undefined;

            return {
              id: String(item.id),

              company:
                industry?.name ||
                "Industry Partner",

              project:
                project?.title ||
                "Project information unavailable",

              problem:
                project?.description ||
                "Problem information unavailable",

              university:
                university?.name ||
                "University information unavailable",

              district:
                university?.district ||
                "District unavailable",

              type:
                item.collaboration_type ||
                "Not specified",

              status:
                normalizeStatus(item.status),

              amount:
                item.amount !== null &&
                item.amount !== undefined
                  ? Number(item.amount)
                  : 0,

              startDate: item.created_at
                ? new Date(
                    item.created_at
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Not available",

              description:
                item.description ||
                "No collaboration description available.",
            };
          });

        setCollaborations(mappedCollaborations);
      } catch (err) {
        console.error(
          "Collaborations fetch error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load collaborations."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborations();
  }, []);

  /* ===========================================================
     FILTERED DATA
  =========================================================== */

  const filteredCollaborations = useMemo(() => {
    const query = search.toLowerCase().trim();

    return collaborations.filter((item) => {
      const matchesSearch =
        !query ||
        item.company.toLowerCase().includes(query) ||
        item.project.toLowerCase().includes(query) ||
        item.problem.toLowerCase().includes(query) ||
        item.university.toLowerCase().includes(query) ||
        item.district.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      const matchesType =
        typeFilter === "All" ||
        item.type === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [
    collaborations,
    search,
    statusFilter,
    typeFilter,
  ]);

  /* ===========================================================
     SUMMARY
  =========================================================== */

  const totalFunding = collaborations.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const activeCount = collaborations.filter(
    (item) =>
      item.status === "ACCEPTED"
  ).length;

  const pendingCount = collaborations.filter(
    (item) =>
      item.status === "REQUESTED" ||
      item.status === "UNDER_REVIEW"
  ).length;

  const completedCount = collaborations.filter(
    (item) =>
      item.status === "COMPLETED"
  ).length;

  const activeFunding = collaborations
    .filter(
      (item) =>
        item.status === "ACCEPTED"
    )
    .reduce(
      (sum, item) => sum + item.amount,
      0
    );

  const collaborationTypes: CollaborationType[] = [
    "FUNDING",
    "MENTORSHIP",
    "HARDWARE",
    "TESTING",
    "PROTOTYPING",
  ];

  const averageFunding =
    collaborations.length > 0
      ? Math.round(
          totalFunding / collaborations.length
        )
      : 0;

  /* ===========================================================
     LOADING
  =========================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">

        <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8">

          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" />

            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading industry collaborations...
            </p>

          </div>

        </div>

      </main>
    );
  }

  /* ===========================================================
     ERROR
  =========================================================== */

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50">

        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">

          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <XCircle size={24} />
            </div>

            <h1 className="mt-4 text-xl font-bold text-slate-900">
              Unable to Load Collaborations
            </h1>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              {error}
            </p>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8">

        <section className="relative overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 text-white shadow-sm">

          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative px-6 py-7 sm:px-8 sm:py-8">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                  <Handshake size={24} />
                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <ShieldCheck
                      size={13}
                      className="text-teal-100"
                    />

                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-100">
                      Industry Intelligence
                    </p>

                  </div>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                    Industry Collaboration
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-teal-50">
                    Monitor industry participation, funding,
                    mentorship, testing and prototyping activities
                    supporting university-led innovation projects.
                  </p>

                </div>

              </div>

              <div className="grid shrink-0 grid-cols-2 gap-3">

                <div className="min-w-[135px] rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">

                  <p className="text-[10px] font-bold uppercase tracking-wide text-teal-100">
                    Accepted
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {activeCount}
                  </p>

                  <p className="mt-1 text-[10px] text-teal-100">
                    Collaborations
                  </p>

                </div>

                <div className="min-w-[135px] rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">

                  <p className="text-[10px] font-bold uppercase tracking-wide text-teal-100">
                    Funding
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    ₹{(
                      totalFunding / 100000
                    ).toFixed(1)}
                    L
                  </p>

                  <p className="mt-1 text-[10px] text-teal-100">
                    Total recorded
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <SummaryCard
            icon={Handshake}
            label="Total Collaborations"
            value={collaborations.length}
            description="Industry partnerships"
          />

          <SummaryCard
            icon={Activity}
            label="Accepted"
            value={activeCount}
            description="Currently accepted"
          />

          <SummaryCard
            icon={Clock3}
            label="Pending"
            value={pendingCount}
            description="Awaiting review"
          />

          <SummaryCard
            icon={CheckCircle2}
            label="Completed"
            value={completedCount}
            description="Successfully completed"
          />

        </div>

      </div>

      {/* =====================================================
          FUNDING + SUPPORT
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">

        <div className="grid gap-4 lg:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Wallet size={19} />
              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-600">
                  Industry Support
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Collaboration Overview
                </h2>

              </div>

            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">

              <MiniMetric
                label="Total Funding"
                value={`₹${(
                  totalFunding / 100000
                ).toFixed(1)}L`}
              />

              <MiniMetric
                label="Accepted Funding"
                value={`₹${(
                  activeFunding / 100000
                ).toFixed(1)}L`}
              />

              <MiniMetric
                label="Avg. Funding"
                value={`₹${(
                  averageFunding / 1000
                ).toFixed(0)}K`}
              />

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-600">
              Support Types
            </p>

            <div className="mt-4 space-y-3">

              {collaborationTypes.map((type) => {

                const count =
                  collaborations.filter(
                    (item) =>
                      item.type === type
                  ).length;

                return (
                  <div
                    key={type}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                  >

                    <span className="text-xs font-medium text-slate-700">
                      {formatType(type)}
                    </span>

                    <span className="text-xs font-bold text-teal-700">
                      {count}
                    </span>

                  </div>
                );
              })}

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          FILTERS + TABLE
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-600">
                Collaboration Registry
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Industry Partnerships
              </h2>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="relative">

                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search company, project..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100 sm:w-64"
                />

              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as
                      | "All"
                      | CollaborationStatus
                  )
                }
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-teal-400"
              >

                <option value="All">
                  All Status
                </option>

                <option value="REQUESTED">
                  Requested
                </option>

                <option value="UNDER_REVIEW">
                  Under Review
                </option>

                <option value="ACCEPTED">
                  Accepted
                </option>

                <option value="REJECTED">
                  Rejected
                </option>

                <option value="COMPLETED">
                  Completed
                </option>

              </select>

              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(
                    e.target.value as
                      | "All"
                      | CollaborationType
                  )
                }
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-teal-400"
              >

                <option value="All">
                  All Support Types
                </option>

                {collaborationTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {formatType(type)}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          {/* TABLE */}

          <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">

            <table className="w-full min-w-[1100px]">

              <thead className="bg-slate-50">

                <tr className="border-b border-slate-200">

                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Industry Partner
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Project
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    University / District
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Support
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Funding
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Date
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredCollaborations.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="transition hover:bg-slate-50/70"
                    >

                      <td className="px-4 py-4">

                        <div className="flex items-start gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                            <Building2 size={16} />
                          </div>

                          <div>

                            <p className="text-xs font-bold text-slate-900">
                              {item.company}
                            </p>

                            <p className="mt-1 text-[10px] text-slate-400">
                              {item.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-4 py-4">

                        <p className="max-w-[220px] text-xs font-semibold text-slate-800">
                          {item.project}
                        </p>

                        <p className="mt-1 max-w-[220px] text-[10px] leading-4 text-slate-400">
                          {item.problem}
                        </p>

                      </td>

                      <td className="px-4 py-4">

                        <p className="text-xs font-medium text-slate-700">
                          {item.university}
                        </p>

                        <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">

                          <MapPin size={11} />

                          {item.district}

                        </div>

                      </td>

                      <td className="px-4 py-4">

                        <span className="inline-flex rounded-lg bg-teal-50 px-2.5 py-1.5 text-[10px] font-bold text-teal-700">
                          {formatType(item.type)}
                        </span>

                      </td>

                      <td className="px-4 py-4">

                        <p className="text-xs font-bold text-slate-800">
                          ₹{item.amount.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </td>

                      <td className="px-4 py-4">

                        <p className="text-xs font-medium text-slate-700">
                          {item.startDate}
                        </p>

                      </td>

                      <td className="px-4 py-4">

                        <StatusBadge
                          status={item.status}
                        />

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

            {filteredCollaborations.length === 0 && (

              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">

                <Search
                  size={28}
                  className="text-slate-300"
                />

                <p className="mt-3 text-sm font-bold text-slate-700">
                  No collaborations found
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Try changing your search or filters.
                </p>

              </div>

            )}

          </div>

          <p className="mt-3 text-[10px] text-slate-400">
            Showing {filteredCollaborations.length} of{" "}
            {collaborations.length} collaborations
          </p>

        </section>

      </div>

      {/* =====================================================
          MONITORING ROLE
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Target size={19} />
            </div>

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-600">
                Government Monitoring
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Monitor Industry Participation
              </h2>

              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
                Government departments can track how industry
                partners are supporting university-led projects,
                monitor funding and technical assistance, and
                identify collaborations requiring attention.
              </p>

            </div>

          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">

            <MonitoringCard
              icon={Wallet}
              title="Funding Tracking"
              description="Monitor recorded funding amounts across industry collaborations."
            />

            <MonitoringCard
              icon={Users}
              title="Technical Support"
              description="Track mentorship, hardware, testing and prototyping support."
            />

            <MonitoringCard
              icon={Lightbulb}
              title="Pilot & Impact"
              description="Use collaboration and project information to monitor industry-supported implementation."
            />

          </div>

        </section>

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="mt-2 border-t border-slate-200 py-4 text-center text-[11px] text-slate-400">
        © 2026 SamadhanX • Ideas → Action → Impact
      </footer>

    </main>
  );
}

/* =============================================================
   SUMMARY CARD
============================================================= */

function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <Icon size={18} />
        </div>

        <ArrowRight
          size={15}
          className="text-slate-300"
        />

      </div>

      <p className="mt-4 text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-slate-400">
        {description}
      </p>

    </div>
  );
}

/* =============================================================
   MINI METRIC
============================================================= */

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

/* =============================================================
   STATUS BADGE
============================================================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const config: Record<
    string,
    {
      icon: React.ElementType;
      className: string;
    }
  > = {
    REQUESTED: {
      icon: Clock3,
      className:
        "bg-amber-50 text-amber-700",
    },

    UNDER_REVIEW: {
      icon: Clock3,
      className:
        "bg-amber-50 text-amber-700",
    },

    ACCEPTED: {
      icon: Activity,
      className:
        "bg-emerald-50 text-emerald-700",
    },

    COMPLETED: {
      icon: CheckCircle2,
      className:
        "bg-teal-50 text-teal-700",
    },

    REJECTED: {
      icon: XCircle,
      className:
        "bg-red-50 text-red-700",
    },

    UNKNOWN: {
      icon: Clock3,
      className:
        "bg-slate-100 text-slate-600",
    },
  };

  const current =
    config[status] || config.UNKNOWN;

  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold ${current.className}`}
    >
      <Icon size={12} />

      {formatStatus(status)}
    </span>
  );
}

/* =============================================================
   MONITORING CARD
============================================================= */

function MonitoringCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm">
        <Icon size={17} />
      </div>

      <h3 className="mt-3 text-sm font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-[11px] leading-5 text-slate-500">
        {description}
      </p>

    </div>
  );
}
