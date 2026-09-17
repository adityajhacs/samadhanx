
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Users,
  Building2,
  Sparkles,
  University,
  Route,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
   Lightbulb, 
  ChevronDown, 
  ChevronUp,
  ImageIcon,
  Video,
} from "lucide-react";

import { apiRequest, getAuthToken } from "@/lib/api/client";

/* =========================================================
   BACKEND TYPES
========================================================= */

type BackendProblem = {
  id: string;
  title: string;
  description?: string | null;
  district?: string | null;
  category?: string | null;
  severity_score?: number | null;
  status?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  image_url?: string | null;
  video_url?: string | null;
  created_at?: string | null;
};

type BackendAnalysis = {
  subcategory?: string | null;
  severity_level?: string | null;
  affected_sector?: string | null;
  estimated_affected_people?: number | null;
  root_cause?: string | null;
  ai_summary?: string | null;
  keywords?: string[] | null;
  created_at?: string | null;
};

type BackendUniversityMatch = {
  university_id?: string | null;
  university_name?: string | null;

  match_score?: number | null;
  similarity?: number | null;
  score?: number | null;

  reason?: string | null;
  match_reason?: string | null;
  explanation?: string | null;
  match_explanation?: string | null;

  location?: string | null;
  district?: string | null;

  expertise?: string | null;
  expertise_areas?: string[] | null;

  department?: string | null;
};

type BackendSolution = {
  id: string;

  problem_id: string | null;
  university_id: string | null;
  project_id: string | null;

  solution_title: string;
  description: string | null;

  prototype_status: string | null;
  estimated_cost: number | string | null;

  prototype_description: string | null;
  how_it_works: string | null;
  key_features: string | null;
  problem_solution: string | null;

  funding_received: number | string | null;

  created_at: string | null;
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

  prototype_name?: string | null;
  prototype_url?: string | null;

  member_count?: number | null;

  created_at?: string | null;
  updated_at?: string | null;
};

type BackendCollaboration = {
  id: string;

  project_id: string | null;
  industry_partner_id: string | null;

  collaboration_type: string | null;

  amount: number | string | null;

  status: string | null;

  description: string | null;

  created_at: string | null;
};

type BackendIndustryPartner = {
  id: string;

  name: string;

  industry_type?: string | null;
  description?: string | null;
  location?: string | null;
  contact_email?: string | null;
  created_at?: string | null;
};

type BackendProgressStage = {
  key?: string | null;
  name?: string | null;
  label?: string | null;
  completed?: boolean;
};

type BackendProgress = {
  stages?: BackendProgressStage[];
};

/* =========================================================
   FRONTEND TYPES
========================================================= */

type ProblemView = { 
  id: string; 
  title: string; 
  description: string; 
  location: string; 
  district: string; 
  category: string; 
  status: string; 
  priority: "High" | "Medium" | "Low"; 
  department: string; 
  citizenReports: number;
  image_url?: string | null;
  video_url?: string | null;
};

type UniversityView = {
  id: string;
  name: string;
  location: string;
  matchScore: number;
  expertise: string;
  reason: string;
};

type CollaborationView = {
  id: string;
  projectId: string;
  industryPartnerId: string;
  industryPartnerName: string;
  collaborationType: string;
  amount: number | null;
  status: string | null;
  description: string | null;
};

/* =========================================================
   HELPERS
========================================================= */

function getPriority(
  severityScore?: number | null
): "High" | "Medium" | "Low" {
  if (typeof severityScore !== "number") {
    return "Medium";
  }

  if (severityScore >= 0.7) {
    return "High";
  }

  if (severityScore >= 0.4) {
    return "Medium";
  }

  return "Low";
}

function normalizeStatus(
  status?: string | null
): string {
  if (!status) {
    return "Pending";
  }

  const normalized =
    status.trim().toLowerCase();

  if (normalized === "resolved") {
    return "Resolved";
  }

  if (
    normalized === "in progress" ||
    normalized === "in_progress" ||
    normalized === "processing"
  ) {
    return "In Progress";
  }

  if (normalized === "critical") {
    return "Critical";
  }

  return "Pending";
}

function formatStatus(
  status?: string | null
): string {
  if (!status) {
    return "Not specified";
  }

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatMoney(
  value?: number | string | null
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not specified";
  }

  const numericValue =
    Number(value);

  if (!Number.isFinite(numericValue)) {
    return "Not specified";
  }

  return `₹${numericValue.toLocaleString(
    "en-IN"
  )}`;
}

function mapProblem(
  problem: BackendProblem
): ProblemView {
  return {
    id: problem.id,

    title: problem.title,

    description:
      problem.description ||
      "No problem description available.",

    location:
      problem.district ||
      "Location not specified",

    district:
      problem.district ||
      "District not specified",

    category:
      problem.category ||
      "Other",

    status:
      normalizeStatus(problem.status),

    priority:
      getPriority(problem.severity_score),

        department: 
      "Not specified", 

    citizenReports: 1,

    image_url: problem.image_url,

    video_url: problem.video_url,
  };
}

/* =========================================================
   REAL UNIVERSITY MATCH MAPPING
========================================================= */

function mapUniversity(
  university: BackendUniversityMatch
): UniversityView {
  /*
   * M4 calculates the actual matching score.
   *
   * Frontend only converts:
   *
   * 0.91 -> 91%
   * 91   -> 91%
   */

  const rawScore =
    university.match_score ??
    university.similarity ??
    university.score ??
    0;

  const numericScore =
    Number(rawScore);

  let matchScore = 0;

  if (Number.isFinite(numericScore)) {
    matchScore =
      numericScore <= 1
        ? Math.round(
            numericScore * 100
          )
        : Math.round(
            numericScore
          );
  }

  matchScore = Math.max(
    0,
    Math.min(
      100,
      matchScore
    )
  );

  /*
   * Use M4's actual explanation.
   */
  const reason =
    university.reason ||
    university.match_reason ||
    university.explanation ||
    university.match_explanation ||
    "";

  const expertise =
    university.expertise ||
    university.expertise_areas?.join(
      ", "
    ) ||
    university.department ||
    "Relevant institutional expertise";

  return {
    id:
      university.university_id ||
      crypto.randomUUID(),

    name:
      university.university_name ||
      "University",

    location:
      university.location ||
      university.district ||
      "Location not specified",

    matchScore,

    expertise,

    reason:
      reason ||
      `This university was matched based on its relevant expertise in ${expertise}.`,
  };
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function GovernmentProblemDetailPage() {
  const params = useParams();
  const router = useRouter();

  const problemId =
    params.id as string;

  const [problem, setProblem] =
    useState<ProblemView | null>(
      null
    );

  const [analysis, setAnalysis] =
    useState<BackendAnalysis | null>(
      null
    );

  const [universities, setUniversities] =
    useState<UniversityView[]>(
      []
    );

  const [solutions, setSolutions] =
    useState<BackendSolution[]>(
      []
    );

  const [projects, setProjects] =
    useState<BackendProject[]>(
      []
    );

  const [
    collaborations,
    setCollaborations,
  ] = useState<
    CollaborationView[]
  >([]);

  const [progress, setProgress] =
    useState<BackendProgress | null>(
      null
    );

  const [
    showAllUniversities,
    setShowAllUniversities,
  ] = useState(false);

  const [routeSent, setRouteSent] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     LOAD DATA
  ======================================================= */

  useEffect(() => {
    async function loadProblemDetails() {
      const token =
        getAuthToken();

      if (!token) {
        setError(
          "Please login first."
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        /* =================================================
           1. PROBLEM
        ================================================= */

        const backendProblem =
          await apiRequest<BackendProblem>(
            `/api/problems/${problemId}`,
            {
              method: "GET",
              token,
            }
          );

        setProblem(
          mapProblem(
            backendProblem
          )
        );

        /* =================================================
           2. AI ANALYSIS
        ================================================= */

        try {
          const backendAnalysis =
            await apiRequest<BackendAnalysis>(
              `/api/problems/${problemId}/analysis`,
              {
                method: "GET",
                token,
              }
            );

          setAnalysis(
            backendAnalysis
          );
        } catch {
          setAnalysis(null);
        }

        /* =================================================
           3. UNIVERSITY MATCHING
        ================================================= */

        try {
          const matched =
            await apiRequest<
              BackendUniversityMatch[]
            >(
              `/api/problems/${problemId}/universities`,
              {
                method: "GET",
                token,
              }
            );

          const mappedUniversities =
            Array.isArray(matched)
              ? matched.map(
                  mapUniversity
                )
              : [];

          setUniversities(
            mappedUniversities
          );
        } catch {
          setUniversities([]);
        }

        /* =================================================
           4. SOLUTIONS
        ================================================= */

        try {
          const solutionResponse =
            await apiRequest<
              BackendSolution[]
            >(
              `/api/problems/${problemId}/solutions`,
              {
                method: "GET",
                token,
              }
            );

          setSolutions(
            Array.isArray(
              solutionResponse
            )
              ? solutionResponse
              : []
          );
        } catch {
          setSolutions([]);
        }

        /* =================================================
           5. PROJECTS
        ================================================= */

        let actualProjects: BackendProject[] =
          [];

        try {
          const projectResponse =
            await apiRequest<
              BackendProject[]
            >(
              `/api/projects?problem_id=${encodeURIComponent(
                problemId
              )}`,
              {
                method: "GET",
                token,
              }
            );

          actualProjects =
            Array.isArray(
              projectResponse
            )
              ? projectResponse
              : [];

          setProjects(
            actualProjects
          );
        } catch {
          setProjects([]);
        }

        /* =================================================
           6. COLLABORATIONS
           
           Project -> Collaboration
           
           GET
           /api/projects/{project_id}/collaborations
        ================================================= */

        if (
          actualProjects.length >
          0
        ) {
          try {
            const collaborationResults =
              await Promise.all(
                actualProjects.map(
                  async (
                    project
                  ) => {
                    try {
                      const response =
                        await apiRequest<
                          BackendCollaboration[]
                        >(
                          `/api/projects/${project.id}/collaborations`,
                          {
                            method: "GET",
                            token,
                          }
                        );

                      return Array.isArray(
                        response
                      )
                        ? response.map(
                            (
                              collaboration
                            ) => ({
                              collaboration,
                              projectId:
                                project.id,
                            })
                          )
                        : [];
                    } catch {
                      return [];
                    }
                  }
                )
              );

            const allCollaborations =
              collaborationResults.flat();

            /* =============================================
               7. INDUSTRY PARTNER DETAILS
               
               Collaboration only gives:
               industry_partner_id
               
               So fetch the actual industry partner
               name from:
               GET /api/industry/{industry_id}
            ============================================= */

            const collaborationViews =
              await Promise.all(
                allCollaborations.map(
                  async ({
                    collaboration,
                    projectId,
                  }) => {
                    let partnerName =
                      "Industry Partner";

                    if (
                      collaboration.industry_partner_id
                    ) {
                      try {
                        const partner =
                          await apiRequest<BackendIndustryPartner>(
                            `/api/industry/${collaboration.industry_partner_id}`,
                            {
                              method:
                                "GET",
                              token,
                            }
                          );

                        partnerName =
                          partner.name ||
                          "Industry Partner";
                      } catch {
                        /*
                         * Partner API failed.
                         * Still show the actual
                         * collaboration instead
                         * of hiding it.
                         */
                        partnerName =
                          "Industry Partner";
                      }
                    }

                    return {
                      id:
                        collaboration.id,

                      projectId,

                      industryPartnerId:
                        collaboration.industry_partner_id ||
                        "",

                      industryPartnerName:
                        partnerName,

                      collaborationType:
                        collaboration.collaboration_type ||
                        "Collaboration",

                      amount:
                        collaboration.amount !==
                          null &&
                        collaboration.amount !==
                          undefined
                          ? Number(
                              collaboration.amount
                            )
                          : null,

                      status:
                        collaboration.status ||
                        null,

                      description:
                        collaboration.description,
                    };
                  }
                )
              );

            setCollaborations(
              collaborationViews
            );
          } catch {
            setCollaborations([]);
          }
        } else {
          setCollaborations([]);
        }

        /* =================================================
           8. PROBLEM PROGRESS
        ================================================= */

        try {
          const progressResponse =
            await apiRequest<BackendProgress>(
              `/api/problems/${problemId}/progress`,
              {
                method: "GET",
                token,
              }
            );

          setProgress(
            progressResponse
          );
        } catch {
          setProgress(null);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load problem details."
        );
      } finally {
        setLoading(false);
      }
    }

    if (problemId) {
      loadProblemDetails();
    }
  }, [problemId]);

  /* =======================================================
     DISPLAY DATA
  ======================================================= */

  const visibleUniversities =
    useMemo(
      () =>
        showAllUniversities
          ? universities
          : universities.slice(
              0,
              2
            ),
      [
        showAllUniversities,
        universities,
      ]
    );

  const latestSolution =
    solutions[0];

  const latestProject =
    projects.find(
      (project) =>
        project.problem_id ===
        problemId
    ) || projects[0];

  const workflowStages =
    progress?.stages ?? [];

  const completedStages =
    workflowStages.filter(
      (stage) =>
        stage.completed
    ).length;

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">

        <div className="mx-auto max-w-7xl">

          <div className="mb-5 h-5 w-36 animate-pulse rounded bg-slate-200" />

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />

            <div className="mt-4 h-9 w-3/4 animate-pulse rounded bg-slate-200" />

            <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-slate-100" />

          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">

            <div className="space-y-6 lg:col-span-2">

              <div className="h-80 animate-pulse rounded-2xl bg-white" />

              <div className="h-72 animate-pulse rounded-2xl bg-white" />

            </div>

            <div className="space-y-6">

              <div className="h-56 animate-pulse rounded-2xl bg-white" />

              <div className="h-64 animate-pulse rounded-2xl bg-white" />

            </div>

          </div>

        </div>

      </main>
    );
  }

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!problem) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">

        <div className="mx-auto max-w-5xl">

          <button
            onClick={() =>
              router.back()
            }
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
          >
            <ArrowLeft size={18} />

            Back to Problems
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <h1 className="text-xl font-bold text-slate-900">
              Problem Not Found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error ||
                "The requested problem could not be found."}
            </p>

          </div>

        </div>

      </main>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">

      <div className="mx-auto max-w-7xl">

        {/* BACK */}

        <button
          onClick={() =>
            router.back()
          }
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
        >
          <ArrowLeft size={18} />

          Back to Problems
        </button>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">

            <div className="min-w-0">

              <div className="mb-3 flex flex-wrap items-center gap-2">

                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                  {problem.id}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {problem.category}
                </span>

                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                  {problem.priority} Priority
                </span>

              </div>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {problem.title}
              </h1>

              {/* DATE INTENTIONALLY REMOVED */}

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">

                <span className="inline-flex items-center gap-2">

                  <MapPin size={16} />

                  {problem.location},{" "}
                  {problem.district}

                </span>

              </div>

            </div>

            <div className="w-fit rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
              {problem.status}
            </div>

          </div>

        </section>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-6 lg:col-span-2">

            {/* =================================================
                PROBLEM DESCRIPTION
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                  <FileSearch size={20} />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Problem Description
                  </h2>

                  <p className="text-sm text-slate-500">
                    Details submitted and validated for government review.
                  </p>

                </div>

              </div>

              <p className="mt-5 leading-7 text-slate-600">
                {problem.description}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">

                    <MapPin size={16} />

                    Location

                  </div>

                  <p className="mt-2 font-semibold text-slate-800">
                    {problem.location},{" "}
                    {problem.district}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">

                    <Building2 size={16} />

                    Department

                  </div>

                  <p className="mt-2 font-semibold text-slate-800">
                    {problem.department}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">

                    <Users size={16} />

                    Citizen Reports

                  </div>

                  <p className="mt-2 font-semibold text-slate-800">
                    {problem.citizenReports}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">

                    <AlertTriangle size={16} />

                    Priority

                  </div>

                  <p className="mt-2 font-semibold text-slate-800">
                    {problem.priority}
                  </p>

                </div>

              </div>

            </section>
         
{/* =================================================
    CITIZEN EVIDENCE
================================================= */}

{(problem.image_url || problem.video_url) && (
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="rounded-xl bg-teal-50 p-2 text-teal-700">
        <FileSearch size={20} />
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Citizen Evidence
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Photo and video evidence submitted with this problem.
        </p>
      </div>
    </div>

    <div className="mt-5 space-y-3">
      {/* PHOTO */}
      {problem.image_url && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-teal-50 p-2">
              <ImageIcon className="h-5 w-5 text-teal-700" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Photo Evidence
              </p>

              <p className="text-xs text-slate-500">
                Citizen uploaded photo
              </p>
            </div>
          </div>

          <a
            href={problem.image_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            <ImageIcon className="h-4 w-4" />
            View Photo
          </a>
        </div>
      )}

      {/* VIDEO */}
      {problem.video_url && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-teal-50 p-2">
              <Video className="h-5 w-5 text-teal-700" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Video Evidence
              </p>

              <p className="text-xs text-slate-500">
                Citizen uploaded video
              </p>
            </div>
          </div>

          <a
            href={problem.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            <Video className="h-4 w-4" />
            View Video
          </a>
        </div>
      )}
    </div>
  </section>
)}
            {/* =================================================
                AI INTELLIGENCE
            ================================================= */}

            <section className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">

              <div className="flex items-start gap-3">

                <div className="rounded-xl bg-teal-50 p-2 text-teal-700">
                  <Sparkles size={20} />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    AI Intelligence
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    AI-generated insights to support government evaluation
                    and institutional routing.
                  </p>

                </div>

              </div>

              <div className="mt-6 rounded-xl bg-slate-50 p-5">

                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  AI Summary
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">

                  {analysis?.ai_summary ||
                    "AI analysis has not been generated for this problem yet."}

                </p>

              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-slate-200 p-4">

                  <p className="text-xs font-semibold text-slate-500">
                    Root Cause
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">

                    {analysis?.root_cause ||
                      "AI root cause analysis not available."}

                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 p-4">

                  <p className="text-xs font-semibold text-slate-500">
                    Affected People
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-800">

                    {analysis?.estimated_affected_people !=
                    null
                      ? analysis.estimated_affected_people
                      : "Not estimated"}

                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 p-4">

                  <p className="text-xs font-semibold text-slate-500">
                    Recommended Domain
                  </p>

                  <p className="mt-2 text-sm font-semibold text-teal-700">

                    {analysis?.affected_sector ||
                      analysis?.subcategory ||
                      problem.category}

                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 p-4">

                  <p className="text-xs font-semibold text-slate-500">
                    AI Priority
                  </p>

                  <p className="mt-2 text-sm font-semibold text-red-600">

                    {analysis?.severity_level ||
                      problem.priority}

                  </p>

                </div>

              </div>

              <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50/50 p-5">

                <div className="flex items-center gap-2">

                  <AlertTriangle
                    size={17}
                    className="text-amber-700"
                  />

                  <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                    Similar / Duplicate Problems
                  </p>

                </div>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  AI similarity and duplicate analysis are handled by the
                  backend intelligence layer.
                </p>

              </div>

            </section>

            {/* =================================================
                UNIVERSITIES
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-3">

                  <div className="rounded-xl bg-teal-50 p-2 text-teal-700">
                    <University size={20} />
                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-slate-900">
                      AI Recommended Universities
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Institutions recommended based on expertise,
                      disciplines and capabilities.
                    </p>

                  </div>

                </div>

                <span className="hidden rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 sm:block">
                  {universities.length} Matches
                </span>

              </div>

              <div className="mt-5 space-y-4">

                {universities.length ===
                  0 && (

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                    <p className="text-sm font-semibold text-slate-700">
                      No university matches available.
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      The backend matching service has not returned any
                      university recommendations for this problem yet.
                    </p>

                  </div>

                )}

                {visibleUniversities.map(
                  (university) => (

                    <div
                      key={university.id}
                      className="rounded-xl border border-slate-200 p-5 transition hover:border-teal-200 hover:shadow-sm"
                    >

                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                        <div>

                          <h3 className="font-bold text-slate-900">
                            {university.name}
                          </h3>

                          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">

                            <MapPin size={15} />

                            {university.location}

                          </div>

                        </div>

                        <div className="w-fit rounded-full bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700">

                          {university.matchScore}% Match

                        </div>

                      </div>

                      <div className="mt-4">

                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Relevant Expertise
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {university.expertise}
                        </p>

                      </div>

                      <div className="mt-4 rounded-lg bg-slate-50 p-3">

                        <p className="text-xs font-bold text-slate-500">
                          Why this university?
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {university.reason}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

              {universities.length >
                2 && (

                <button
                  onClick={() =>
                    setShowAllUniversities(
                      (current) =>
                        !current
                    )
                  }
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-800"
                >

                  {showAllUniversities ? (
                    <>
                      Show Less
                      <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      View All Matches
                      <ChevronDown size={16} />
                    </>
                  )}

                </button>

              )}

            </section>

            {/* =================================================
                SOLUTION
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start gap-3">

                <div className="rounded-xl bg-teal-50 p-2 text-teal-700">
                  <Lightbulb size={20} />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Solution
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Solution proposals associated with this problem.
                  </p>

                </div>

              </div>

              {solutions.length > 0 ? (

                <div className="mt-5 space-y-4">

                  {solutions.map(
                    (solution) => (

                      <div
                        key={solution.id}
                        className="rounded-xl border border-slate-200 p-5"
                      >

                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">

                          <div>

                            <h3 className="font-bold text-slate-900">
                              {solution.solution_title}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {solution.description ||
                                "No solution description available."}
                            </p>

                          </div>

                          <span className="w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">

                            {formatStatus(
                              solution.prototype_status
                            )}

                          </span>

                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">

                          <div className="rounded-xl bg-slate-50 p-4">

                            <p className="text-xs font-semibold text-slate-500">
                              Estimated Cost
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">
                              {formatMoney(
                                solution.estimated_cost
                              )}
                            </p>

                          </div>

                          <div className="rounded-xl bg-slate-50 p-4">

                            <p className="text-xs font-semibold text-slate-500">
                              Funding Received
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">
                              {formatMoney(
                                solution.funding_received
                              )}
                            </p>

                          </div>

                        </div>

                        {solution.problem_solution && (

                          <div className="mt-4">

                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                              Problem Solution
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              {solution.problem_solution}
                            </p>

                          </div>

                        )}

                        {solution.how_it_works && (

                          <div className="mt-4">

                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                              How It Works
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              {solution.how_it_works}
                            </p>

                          </div>

                        )}

                        {solution.key_features && (

                          <div className="mt-4">

                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                              Key Features
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              {solution.key_features}
                            </p>

                          </div>

                        )}

                        {solution.prototype_description && (

                          <div className="mt-4">

                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                              Prototype
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              {solution.prototype_description}
                            </p>

                          </div>

                        )}

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="mt-5 rounded-xl bg-slate-50 p-5">

                  <p className="text-sm font-semibold text-slate-700">
                    No solution has been created yet.
                  </p>

                </div>

              )}

            </section>

            {/* =================================================
                PROJECT
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start gap-3">

                <div className="rounded-xl bg-teal-50 p-2 text-teal-700">
                  <Route size={20} />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Project
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Implementation project connected to this problem.
                  </p>

                </div>

              </div>

              {projects.length > 0 ? (

                <div className="mt-5 space-y-4">

                  {projects.map(
                    (project) => (

                      <div
                        key={project.id}
                        className="rounded-xl border border-slate-200 p-5"
                      >

                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">

                          <div>

                            <h3 className="font-bold text-slate-900">
                              {project.title ||
                                "Implementation Project"}
                            </h3>

                            {project.description && (

                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {project.description}
                              </p>

                            )}

                          </div>

                          <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">

                            {formatStatus(
                              project.status
                            )}

                          </span>

                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">

                          <div className="rounded-xl bg-slate-50 p-4">

                            <p className="text-xs font-semibold text-slate-500">
                              Team Members
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">
                              {project.member_count ??
                                0}
                            </p>

                          </div>

                          <div className="rounded-xl bg-slate-50 p-4">

                            <p className="text-xs font-semibold text-slate-500">
                              Budget
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">
                              {formatMoney(
                                project.budget
                              )}
                            </p>

                          </div>

                        </div>

                        {project.expected_impact && (

                          <div className="mt-4">

                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                              Expected Impact
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              {project.expected_impact}
                            </p>

                          </div>

                        )}

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="mt-5 rounded-xl bg-slate-50 p-5">

                  <p className="text-sm font-semibold text-slate-700">
                    No project has been created yet.
                  </p>

                </div>

              )}

            </section>

            {/* =================================================
                INDUSTRY COLLABORATION
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start gap-3">

                <div className="rounded-xl bg-teal-50 p-2 text-teal-700">
                  <Building2 size={20} />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Industry Collaboration
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Industry support connected with the implementation
                    project.
                  </p>

                </div>

              </div>

              {collaborations.length >
              0 ? (

                <div className="mt-5 space-y-4">

                  {collaborations.map(
                    (
                      collaboration
                    ) => (

                      <div
                        key={
                          collaboration.id
                        }
                        className="rounded-xl border border-slate-200 p-5"
                      >

                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">

                          <div>

                            <h3 className="font-bold text-slate-900">

                              {
                                collaboration.industryPartnerName
                              }

                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              Industry Partner
                            </p>

                          </div>

                          <span className="w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">

                            {formatStatus(
                              collaboration.collaborationType
                            )}

                          </span>

                        </div>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">

                          <div className="rounded-xl bg-slate-50 p-4">

                            <p className="text-xs font-semibold text-slate-500">
                              Collaboration Status
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">
                              {formatStatus(
                                collaboration.status
                              )}
                            </p>

                          </div>

                          <div className="rounded-xl bg-slate-50 p-4">

                            <p className="text-xs font-semibold text-slate-500">
                              Amount
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">
                              {formatMoney(
                                collaboration.amount
                              )}
                            </p>

                          </div>

                        </div>

                        {collaboration.description && (

                          <div className="mt-4">

                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                              Description
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              {collaboration.description}
                            </p>

                          </div>

                        )}

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="mt-5 rounded-xl bg-slate-50 p-5">

                  <p className="text-sm font-semibold text-slate-700">
                    No industry collaboration yet.
                  </p>

                </div>

              )}

            </section>

          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="space-y-6">

            {/* =================================================
                GOVERNMENT ACTION
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-teal-50 p-2 text-teal-700">
                  <Route size={20} />
                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  Government Action
                </h2>

              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Review the AI recommendations and route this validated
                challenge to suitable institutions.
              </p>

              {!routeSent ? (

                <button
                  onClick={() =>
                    setRouteSent(
                      true
                    )
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
                >

                  <Route size={18} />

                  Route to Universities

                </button>

              ) : (

                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                  <div className="flex items-center gap-2">

                    <CheckCircle2
                      size={19}
                      className="text-emerald-600"
                    />

                    <p className="text-sm font-bold text-emerald-700">
                      Problem Routed
                    </p>

                  </div>

                  <p className="mt-2 text-xs leading-5 text-emerald-700">
                    The challenge has been routed to the recommended
                    university network for institutional review.
                  </p>

                </div>

              )}

            </section>

            {/* =================================================
                WORKFLOW
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between gap-3">

                <h2 className="text-lg font-bold text-slate-900">
                  Innovation Workflow
                </h2>

                {workflowStages.length >
                  0 && (

                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">

                    {completedStages}/
                    {workflowStages.length}

                  </span>

                )}

              </div>

              <div className="mt-5 space-y-4">

                {workflowStages.length >
                0 ? (

                  workflowStages.map(
                    (
                      stage,
                      index
                    ) => (

                      <div
                        key={`${stage.key || stage.name || "stage"}-${index}`}
                        className="flex items-start gap-3"
                      >

                        <div
                          className={`mt-0.5 rounded-full p-1.5 ${
                            stage.completed
                              ? "bg-teal-50 text-teal-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >

                          {stage.completed ? (
                            <CheckCircle2
                              size={15}
                            />
                          ) : (
                            <Lightbulb
                              size={15}
                            />
                          )}

                        </div>

                        <div>

                          <p className="text-sm font-semibold text-slate-800">

                            {stage.label ||
                              stage.name ||
                              stage.key ||
                              `Stage ${
                                index +
                                1
                              }`}

                          </p>

                          <p className="text-xs text-slate-500">

                            {stage.completed
                              ? "Completed"
                              : "Pending"}

                          </p>

                        </div>

                      </div>

                    )
                  )

                ) : (

                  <>

                    <div className="flex items-start gap-3">

                      <div className="mt-0.5 rounded-full bg-teal-50 p-1.5 text-teal-700">
                        <CheckCircle2 size={15} />
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          Problem Submitted
                        </p>

                        <p className="text-xs text-slate-500">
                          Citizen challenge received
                        </p>

                      </div>

                    </div>

                    <div className="flex items-start gap-3">

                      <div className="mt-0.5 rounded-full bg-teal-50 p-1.5 text-teal-700">
                        <Sparkles size={15} />
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          AI Analysis
                        </p>

                        <p className="text-xs text-slate-500">
                          Category, priority and insights generated
                        </p>

                      </div>

                    </div>

                    <div className="flex items-start gap-3">

                      <div className="mt-0.5 rounded-full bg-teal-50 p-1.5 text-teal-700">
                        <University size={15} />
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          University Routing
                        </p>

                        <p className="text-xs text-slate-500">
                          Suitable institutions identified
                        </p>

                      </div>

                    </div>

                    <div className="flex items-start gap-3">

                      <div className="mt-0.5 rounded-full bg-slate-100 p-1.5 text-slate-500">
                        <Lightbulb size={15} />
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-slate-800">
                          Solution Proposal
                        </p>

                        <p className="text-xs text-slate-500">
                          University develops the solution
                        </p>

                      </div>

                    </div>

                  </>

                )}

              </div>

            </section>

            {/* =================================================
                CURRENT STATUS
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-bold text-slate-900">
                Current Status
              </h2>

              <div className="mt-4 rounded-xl bg-slate-50 p-4">

                <p className="text-xs font-semibold text-slate-500">
                  Problem Status
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {problem.status}
                </p>

              </div>

              <div className="mt-3 rounded-xl bg-slate-50 p-4">

                <p className="text-xs font-semibold text-slate-500">
                  Department
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {problem.department}
                </p>

              </div>

            </section>

          </aside>

        </div>

      </div>

    </main>
  );
}
