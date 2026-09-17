
"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Lightbulb,
  MapPin,
  Rocket,
  Sparkles,
  Target,
  University,
  Building2,
  AlertTriangle,
  Users,
  ListChecks,
  CalendarDays,
  Wallet,
  ExternalLink,
  X,
} from "lucide-react";

import { apiRequest, getAuthToken } from "@/lib/api/client";

/* ============================================================
   BACKEND TYPES
   ============================================================ */

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
  id?: string;
  university_id?: string;
  university_name?: string;
  name?: string;

  district?: string | null;
  location?: string | null;

  expertise?: string | null;
  expertise_areas?: string[] | null;

  match_score?: number | null;
  similarity?: number | null;
  score?: number | null;

  reason?: string | null;
  match_reason?: string | null;
  explanation?: string | null;
  match_explanation?: string | null;
};

type BackendUniversity = {
  id: string;
  name: string;
  expertise_area?: string | null;
  expertise_areas?: string[] | null;
  district?: string | null;
  department?: string | null;
};

type BackendSolution = {
  id: string;
  problem_id?: string | null;
  university_id?: string | null;
  project_id?: string | null;

  solution_title: string;
  description?: string | null;

  prototype_status?: string | null;
  estimated_cost?: number | string | null;

  prototype_description?: string | null;
  how_it_works?: string | null;
  key_features?: string | null;
  problem_solution?: string | null;

  funding_received?: number | string | null;
  created_at?: string | null;
};

type BackendProject = {
  id: string;
  problem_id?: string | null;
  solution_id?: string | null;

  title: string;
  description?: string | null;

  status?: string | null;
  created_by?: string | null;

  deadline?: string | null;
  progress?: number | null;
  budget?: number | string | null;
  expected_impact?: string | null;

  prototype_name?: string | null;
  prototype_url?: string | null;

  member_count?: number | null;

  created_at?: string | null;
  updated_at?: string | null;

  university_name?: string | null;
};

type BackendCollaboration = {
  id: string;
  project_id?: string | null;
  industry_partner_id?: string | null;

  collaboration_type?: string | null;
  amount?: number | string | null;
  status?: string | null;
  description?: string | null;

  created_at?: string | null;
};

type BackendIndustry = {
  id: string;
  name: string;
  industry_type?: string | null;
  description?: string | null;
  location?: string | null;
  contact_email?: string | null;
};

/* ============================================================
   PROJECT DETAIL TYPES
   ============================================================ */

type BackendProjectMember = {
  id?: string;
  user_id?: string;
  project_id?: string;

  name?: string | null;
  full_name?: string | null;
  email?: string | null;
  role?: string | null;
  member_role?: string | null;

  created_at?: string | null;
};

type BackendProjectTask = {
  id: string;
  project_id?: string | null;

  title?: string | null;
  task_title?: string | null;

  description?: string | null;

  status?: string | null;

  assigned_to?: string | null;
  assignee_name?: string | null;

  deadline?: string | null;

  created_at?: string | null;
  updated_at?: string | null;
};

type ProjectDetailData = {
  project: BackendProject;
  members: BackendProjectMember[];
  tasks: BackendProjectTask[];
};

/* ============================================================
   PIPELINE TYPES
   ============================================================ */

type StageId =
  | "reported"
  | "ai-analysis"
  | "university-matching"
  | "solution"
  | "project"
  | "industry-support"
  | "prototype"
  | "deployment"
  | "resolved";

type PipelineItem = {
  id: string;
  problem: BackendProblem;

  analysis?: BackendAnalysis | null;

  universities: BackendUniversityMatch[];

  solutions: BackendSolution[];

  projects: BackendProject[];

  collaborations: {
    collaboration: BackendCollaboration;
    industry?: BackendIndustry | null;
    project: BackendProject;
  }[];
};

/* ============================================================
   9 STAGES
   ============================================================ */

const stages: {
  id: StageId;
  label: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    id: "reported",
    label: "Reported",
    description: "Citizen challenges submitted to SamadhanX.",
    icon: <FileSearch size={18} />,
  },
  {
    id: "ai-analysis",
    label: "AI Analysis",
    description: "Problems enriched with AI-generated intelligence.",
    icon: <Sparkles size={18} />,
  },
  {
    id: "university-matching",
    label: "University Matching",
    description: "Problems matched with relevant universities.",
    icon: <University size={18} />,
  },
  {
    id: "solution",
    label: "Solution",
    description: "University-led solutions created for challenges.",
    icon: <Lightbulb size={18} />,
  },
  {
    id: "project",
    label: "Project",
    description: "Solutions moved into active project execution.",
    icon: <Rocket size={18} />,
  },
  {
    id: "industry-support",
    label: "Industry Support",
    description: "Industry collaboration connected to projects.",
    icon: <Building2 size={18} />,
  },
  {
    id: "prototype",
    label: "Prototype",
    description: "Solutions progressing through prototype stages.",
    icon: <Target size={18} />,
  },
  {
    id: "deployment",
    label: "Deployment",
    description: "Projects reaching deployment.",
    icon: <Activity size={18} />,
  },
  {
    id: "resolved",
    label: "Resolved",
    description: "Citizen challenges marked as resolved.",
    icon: <CheckCircle2 size={18} />,
  },
];

/* ============================================================
   HELPERS
   ============================================================ */

function normalizeStatus(value?: string | null) {
  return (value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
}

function getMatchScore(university: BackendUniversityMatch) {
  const raw =
    university.match_score ??
    university.similarity ??
    university.score ??
    0;

  const numeric = Number(raw);

  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return numeric <= 1
    ? Math.round(numeric * 100)
    : Math.round(numeric);
}

function getUniversityReason(university: BackendUniversityMatch) {
  return (
    university.reason ||
    university.match_reason ||
    university.explanation ||
    university.match_explanation ||
    ""
  );
}

function getUniversityName(university: BackendUniversityMatch) {
  return university.university_name || university.name || "University";
}

function getUniversityExpertise(university: BackendUniversityMatch) {
  if (university.expertise) {
    return university.expertise;
  }

  if (
    university.expertise_areas &&
    university.expertise_areas.length > 0
  ) {
    return university.expertise_areas.join(", ");
  }

  return "Institutional expertise not specified";
}

function formatMoney(value?: number | string | null) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return String(value);
  }

  return `₹${numeric.toLocaleString("en-IN")}`;
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Not specified";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizeArray<T>(
  response:
    | T[]
    | {
        data?: T[];
        items?: T[];
        solutions?: T[];
        members?: T[];
        tasks?: T[];
      }
    | null
    | undefined
): T[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  if (Array.isArray(response?.solutions)) {
    return response.solutions;
  }

  if (Array.isArray(response?.members)) {
    return response.members;
  }

  if (Array.isArray(response?.tasks)) {
    return response.tasks;
  }

  return [];
}

function getUniversityNameFromSolution(
  solution: BackendSolution,
  universities: BackendUniversity[],
  matchedUniversities: BackendUniversityMatch[]
) {
  if (!solution.university_id) {
    return "University not linked";
  }

  const fromAllUniversities = universities.find(
    (university) => university.id === solution.university_id
  );

  if (fromAllUniversities?.name) {
    return fromAllUniversities.name;
  }

  const fromMatches = matchedUniversities.find(
    (university) =>
      university.university_id === solution.university_id ||
      university.id === solution.university_id
  );

  if (fromMatches) {
    return getUniversityName(fromMatches);
  }

  return "University not found";
}

function getTaskTitle(task: BackendProjectTask) {
  return task.title || task.task_title || "Untitled task";
}

function getMemberName(member: BackendProjectMember) {
  return (
    member.name ||
    member.full_name ||
    member.email ||
    member.user_id ||
    "Project member"
  );
}

function getMemberRole(member: BackendProjectMember) {
  return member.role || member.member_role || "Member";
}

/* ============================================================
   MAIN PAGE
   ============================================================ */

export default function GovernmentSolutionPipelinePage() {
  const [selectedStage, setSelectedStage] =
    useState<"All" | StageId>("All");

  const [items, setItems] = useState<PipelineItem[]>([]);
  const [allUniversities, setAllUniversities] = useState<
    BackendUniversity[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ==========================================================
     LOAD REAL BACKEND DATA
     ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadPipeline() {
      try {
        setLoading(true);
        setError("");

        const token = getAuthToken();

        if (!token) {
          throw new Error(
            "Government authentication token not found."
          );
        }

        const authHeaders = {
          Authorization: `Bearer ${token}`,
        };

        /* ------------------------------------------------------
           1. ALL REPORTED PROBLEMS
        ------------------------------------------------------ */

        const problemsResponse =
          await apiRequest<BackendProblem[]>(
            "/api/problems/",
            {
              headers: authHeaders,
            }
          );

        const problems = Array.isArray(problemsResponse)
          ? problemsResponse
          : [];

        /* ------------------------------------------------------
           2. ALL UNIVERSITIES

           Used to convert university IDs into real names.
        ------------------------------------------------------ */

        let universities: BackendUniversity[] = [];

        try {
          const response =
            await apiRequest<
              BackendUniversity[] | { data?: BackendUniversity[] }
            >("/api/universities", {
              headers: authHeaders,
            });

          universities = normalizeArray(response);
        } catch {
          universities = [];
        }

        /* ------------------------------------------------------
           3. LOAD ACTUAL DATA FOR EVERY PROBLEM
        ------------------------------------------------------ */

        const pipelineResults = await Promise.all(
          problems.map(async (problem) => {
            let analysis: BackendAnalysis | null = null;
            let universitiesForProblem: BackendUniversityMatch[] =
              [];
            let solutions: BackendSolution[] = [];
            let projects: BackendProject[] = [];
            let collaborations: BackendCollaboration[] = [];

            /* --------------------------------------------------
               AI ANALYSIS
            -------------------------------------------------- */

            try {
              analysis =
                await apiRequest<BackendAnalysis>(
                  `/api/problems/${problem.id}/analysis`,
                  {
                    headers: authHeaders,
                  }
                );
            } catch {
              analysis = null;
            }

            /* --------------------------------------------------
               UNIVERSITY MATCHING
            -------------------------------------------------- */

            try {
              const response =
                await apiRequest<
                  BackendUniversityMatch[]
                >(
                  `/api/problems/${problem.id}/universities`,
                  {
                    headers: authHeaders,
                  }
                );

              universitiesForProblem = Array.isArray(
                response
              )
                ? response
                : [];
            } catch {
              universitiesForProblem = [];
            }

            /* --------------------------------------------------
               SOLUTIONS
            -------------------------------------------------- */

            try {
              const response =
                await apiRequest<
                  | BackendSolution[]
                  | {
                      solutions?: BackendSolution[];
                      data?: BackendSolution[];
                      items?: BackendSolution[];
                    }
                >(
                  `/api/problems/${problem.id}/solutions`,
                  {
                    headers: authHeaders,
                  }
                );

              solutions = normalizeArray(response);
            } catch {
              solutions = [];
            }

            /* --------------------------------------------------
               PROJECTS

               Keep existing API behaviour.
            -------------------------------------------------- */

            try {
              const response =
                await apiRequest<BackendProject[]>(
                  `/api/projects?problem_id=${problem.id}`,
                  {
                    headers: authHeaders,
                  }
                );

              projects = Array.isArray(response)
                ? response
                : [];
            } catch {
              projects = [];
            }

            /* --------------------------------------------------
               COLLABORATIONS
            -------------------------------------------------- */

            if (projects.length > 0) {
              const collaborationResults =
                await Promise.all(
                  projects.map(async (project) => {
                    try {
                      const response =
                        await apiRequest<
                          BackendCollaboration[]
                        >(
                          `/api/projects/${project.id}/collaborations`,
                          {
                            headers: authHeaders,
                          }
                        );

                      return Array.isArray(response)
                        ? response
                        : [];
                    } catch {
                      return [];
                    }
                  })
                );

              collaborations =
                collaborationResults.flat();
            }

            return {
              id: problem.id,
              problem,
              analysis,
              universities: universitiesForProblem,
              solutions,
              projects,
              collaborations: collaborations.map(
                (collaboration) => {
                  const project =
                    projects.find(
                      (item) =>
                        item.id ===
                        collaboration.project_id
                    );

                  return {
                    collaboration,
                    project:
                      project ||
                      projects[0] ||
                      ({
                        id:
                          collaboration.project_id ||
                          "unknown",
                        title: "Project",
                      } as BackendProject),
                  };
                }
              ),
            };
          })
        );

        if (!cancelled) {
          setItems(pipelineResults);
          setAllUniversities(universities);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load solution pipeline."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPipeline();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ==========================================================
     STAGE FILTERING
     ========================================================== */

  const filteredItems = useMemo(() => {
    if (selectedStage === "All") {
      return items;
    }

    return items.filter((item) => {
      switch (selectedStage) {
        case "reported":
          return true;

        case "ai-analysis":
          return Boolean(item.analysis);

        case "university-matching":
          return item.universities.length > 0;

        case "solution":
          return item.solutions.length > 0;

        case "project":
          return item.projects.length > 0;

        case "industry-support":
          return item.collaborations.length > 0;

        case "prototype":
          return item.solutions.some((solution) =>
            [
              "DESIGN",
              "PROTOTYPE",
              "FIELD_TEST",
              "DEPLOYED",
              "TESTING",
              "TEST",
            ].includes(
              normalizeStatus(solution.prototype_status)
            )
          );

        case "deployment":
          return item.projects.some(
            (project) =>
              normalizeStatus(project.status) ===
              "DEPLOYED"
          );

        case "resolved":
          return (
            normalizeStatus(item.problem.status) ===
            "RESOLVED"
          );

        default:
          return false;
      }
    });
  }, [items, selectedStage]);

  /* ==========================================================
     STAGE DATA PRESENCE
     ========================================================== */

  function hasStageData(stageId: StageId) {
    return items.some((item) => {
      switch (stageId) {
        case "reported":
          return true;

        case "ai-analysis":
          return Boolean(item.analysis);

        case "university-matching":
          return item.universities.length > 0;

        case "solution":
          return item.solutions.length > 0;

        case "project":
          return item.projects.length > 0;

        case "industry-support":
          return item.collaborations.length > 0;

        case "prototype":
          return item.solutions.some((solution) =>
            [
              "DESIGN",
              "PROTOTYPE",
              "FIELD_TEST",
              "DEPLOYED",
              "TESTING",
              "TEST",
            ].includes(
              normalizeStatus(solution.prototype_status)
            )
          );

        case "deployment":
          return item.projects.some(
            (project) =>
              normalizeStatus(project.status) ===
              "DEPLOYED"
          );

        case "resolved":
          return (
            normalizeStatus(item.problem.status) ===
            "RESOLVED"
          );

        default:
          return false;
      }
    });
  }

  /* ==========================================================
     TOTAL DATA
     ========================================================== */

  const totalSolutions = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.solutions.length,
        0
      ),
    [items]
  );

  const totalProjects = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.projects.length,
        0
      ),
    [items]
  );

  const totalCollaborations = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.collaborations.length,
        0
      ),
    [items]
  );

  const totalUniversities = useMemo(() => {
    const ids = new Set<string>();

    items.forEach((item) => {
      item.universities.forEach((university) => {
        const id =
          university.university_id ||
          university.id;

        if (id) {
          ids.add(id);
        }
      });

      item.solutions.forEach((solution) => {
        if (solution.university_id) {
          ids.add(solution.university_id);
        }
      });
    });

    return ids.size;
  }, [items]);

  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                <Activity
                  size={22}
                  className="animate-pulse"
                />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                Loading Innovation Pipeline
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Fetching real problems, AI analysis,
                university matching, solutions, projects
                and collaborations.
              </p>
            </section>
          </div>
        </main>
      </div>
    );
  }

  /* ==========================================================
     ERROR
     ========================================================== */

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <section className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-red-50 p-2 text-red-600">
                  <AlertTriangle size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Unable to load solution pipeline
                  </h2>

                  <p className="mt-2 text-sm text-slate-600">
                    {error}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* ==================================================
              HEADER
          ================================================== */}

          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-teal-700 to-teal-600 p-6 text-white shadow-lg sm:p-8">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
            <div className="absolute -bottom-24 right-20 h-40 w-40 rounded-full bg-white/5" />

            <div className="relative max-w-3xl">
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                Government Innovation Workflow
              </span>

              <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
                Projects & Solution Pipeline
              </h1>

              <p className="mt-3 text-sm leading-6 text-teal-50 sm:text-base">
                Monitor how real citizen challenges move
                through AI analysis, university matching,
                solutions, projects, industry collaboration,
                prototypes, deployment and resolution.
              </p>
            </div>
          </section>

          {/* ==================================================
              PIPELINE STAGES
          ================================================== */}

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Innovation Pipeline
                </h2>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                  Select a stage to see the actual problems
                  and records currently present at that point
                  in the innovation journey.
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedStage("All")
                }
                className={`w-fit rounded-xl px-4 py-2 text-xs font-bold transition ${
                  selectedStage === "All"
                    ? "bg-teal-600 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                All Data
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {stages.map((stage, index) => {
                const isSelected =
                  selectedStage === stage.id;

                const hasData =
                  hasStageData(stage.id);

                return (
                  <button
                    key={stage.id}
                    onClick={() =>
                      setSelectedStage(stage.id)
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-teal-400 bg-teal-50 shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:border-teal-200 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          isSelected
                            ? "bg-teal-600 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {stage.icon}
                      </span>

                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          hasData
                            ? "bg-emerald-500"
                            : "bg-slate-300"
                        }`}
                        title={
                          hasData
                            ? "Actual backend data available"
                            : "No backend record currently available"
                        }
                      />
                    </div>

                    <h3 className="mt-3 text-sm font-bold text-slate-800">
                      {index + 1}. {stage.label}
                    </h3>

                    <p className="mt-1 text-[10px] leading-4 text-slate-500">
                      {stage.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ==================================================
              DATA SUMMARY
          ================================================== */}

          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              icon={<FileSearch size={18} />}
              label="Reported Problems"
              value={items.length}
            />

            <StatCard
              icon={<University size={18} />}
              label="Matched Universities"
              value={totalUniversities}
            />

            <StatCard
              icon={<Lightbulb size={18} />}
              label="Actual Solutions"
              value={totalSolutions}
            />

            <StatCard
              icon={<Rocket size={18} />}
              label="Actual Projects"
              value={totalProjects}
            />

            <StatCard
              icon={<Building2 size={18} />}
              label="Industry Collaborations"
              value={totalCollaborations}
            />
          </section>

          {/* ==================================================
              FILTER HEADER
          ================================================== */}

          <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedStage === "All"
                    ? "Complete Innovation Journey"
                    : stages.find(
                        (stage) =>
                          stage.id === selectedStage
                      )?.label}
                </h2>

                {selectedStage !== "All" && (
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-[10px] font-bold text-teal-700">
                    Live Backend Data
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-slate-500">
                {filteredItems.length} problem
                {filteredItems.length !== 1
                  ? "s"
                  : ""}{" "}
                currently shown.
              </p>
            </div>

            {selectedStage !== "All" && (
              <button
                onClick={() =>
                  setSelectedStage("All")
                }
                className="w-fit rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Show All
              </button>
            )}
          </section>

          {/* ==================================================
              ACTUAL DATA
          ================================================== */}

          <section className="mt-6 space-y-5">
            {filteredItems.map((item) => (
              <ProblemJourneyCard
                key={item.id}
                item={item}
                selectedStage={selectedStage}
                allUniversities={allUniversities}
              />
            ))}
          </section>

          {/* ==================================================
              EMPTY
          ================================================== */}

          {filteredItems.length === 0 && (
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Lightbulb size={22} />
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                No data at this stage
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                There are currently no backend records
                matching this stage.
              </p>

              <button
                onClick={() =>
                  setSelectedStage("All")
                }
                className="mt-4 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-teal-700"
              >
                Show All Data
              </button>
            </section>
          )}

          {/* ==================================================
              WORKFLOW EXPLANATION
          ================================================== */}

          <section className="mt-6 rounded-2xl border border-teal-100 bg-teal-50 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-2 text-teal-700 shadow-sm">
                <Sparkles size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-teal-900">
                  How SamadhanX Moves a Challenge Forward
                </h2>

                <p className="mt-1 text-xs leading-5 text-teal-800">
                  Each stage represents an actual backend
                  relationship. A challenge can exist in
                  multiple completed stages at the same time.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stages.map((stage, index) => (
                <div
                  key={stage.id}
                  className="rounded-xl border border-teal-100 bg-white p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                      {index + 1}
                    </span>

                    <p className="text-sm font-bold text-teal-900">
                      {stage.label}
                    </p>
                  </div>

                  <p className="mt-3 text-[11px] leading-5 text-teal-800">
                    {stage.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ==================================================
              GOVERNMENT ROLE
          ================================================== */}

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Government Monitoring Role
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Government monitors the complete innovation
              lifecycle while universities and industry
              stakeholders work on solutions.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <RoleCard
                icon={<FileSearch size={17} />}
                title="Review"
                description="Review citizen challenges and AI-generated intelligence."
              />

              <RoleCard
                icon={<University size={17} />}
                title="Route"
                description="See which universities are actually matched with each challenge."
              />

              <RoleCard
                icon={<Activity size={17} />}
                title="Monitor"
                description="Track real solutions, projects, collaborations and prototypes."
              />

              <RoleCard
                icon={<Target size={17} />}
                title="Measure Impact"
                description="Monitor deployment and resolution of citizen challenges."
              />
            </div>
          </section>
        </div>
      </main>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="mt-10 w-full bg-slate-950 text-slate-300">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
          <div className="grid gap-8 md:grid-cols-3">

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white">
                  <Lightbulb size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white">
                    SamadhanX
                  </h2>

                  <p className="text-[10px] text-slate-400">
                    Ideas → Connect → Impact
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-sm text-xs leading-5 text-slate-400">
                Connecting citizens, government,
                universities and industry to transform
                real-world challenges into meaningful
                solutions.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">
                Platform
              </h3>

              <div className="mt-4 space-y-2.5 text-xs text-slate-400">
                <p className="transition hover:text-teal-400">
                  Citizen Challenges
                </p>

                <p className="transition hover:text-teal-400">
                  University Solutions
                </p>

                <p className="transition hover:text-teal-400">
                  Government Monitoring
                </p>

                <p className="transition hover:text-teal-400">
                  Industry Collaboration
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">
                Innovation Journey
              </h3>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {stages.slice(0, 4).map(
                  (stage, index) => (
                    <div
                      key={stage.id}
                      className="flex items-center gap-2"
                    >
                      <span className="rounded-full bg-slate-800 px-3 py-1.5 text-[10px] font-semibold text-slate-300">
                        {stage.label}
                      </span>

                      {index < 3 && (
                        <ArrowRight
                          size={13}
                          className="text-teal-500"
                        />
                      )}
                    </div>
                  )
                )}
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-400">
                From identifying a challenge to validating
                and deploying a solution in the real world.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-5">
            <div className="flex flex-col gap-2 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} SamadhanX.
                All rights reserved.
              </p>

              <p>
                Ideas → Connect → Impact
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ============================================================
   PROBLEM JOURNEY CARD
   ============================================================ */

function ProblemJourneyCard({
  item,
  selectedStage,
  allUniversities,
}: {
  item: PipelineItem;
  selectedStage: "All" | StageId;
  allUniversities: BackendUniversity[];
}) {
  const problem = item.problem;

  const showAI =
    selectedStage === "All" ||
    selectedStage === "ai-analysis";

  const showUniversities =
    selectedStage === "All" ||
    selectedStage === "university-matching";

  const showSolutions =
    selectedStage === "All" ||
    selectedStage === "solution";

  const showProjects =
    selectedStage === "All" ||
    selectedStage === "project";

  const showIndustry =
    selectedStage === "All" ||
    selectedStage === "industry-support";

  const showPrototype =
    selectedStage === "All" ||
    selectedStage === "prototype";

  const showDeployment =
    selectedStage === "All" ||
    selectedStage === "deployment";

  const showResolved =
    selectedStage === "All" ||
    selectedStage === "resolved";

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* ======================================================
          PROBLEM HEADER
      ====================================================== */}

      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-teal-700">
                {problem.id}
              </span>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                {problem.category || "Other"}
              </span>

              {problem.status && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                  {problem.status}
                </span>
              )}
            </div>

            <h2 className="mt-3 text-xl font-bold leading-7 text-slate-900">
              {problem.title}
            </h2>

            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <MapPin size={14} />

              {problem.district ||
                "Location not specified"}
            </div>
          </div>

          <span className="flex shrink-0 items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-bold text-teal-700">
            <FileSearch size={14} />
            Reported
          </span>
        </div>

        <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-600">
          {problem.description ||
            "No problem description available."}
        </p>

        <Link
          href={`/government/problems/${problem.id}`}
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-teal-700 hover:text-teal-800"
        >
          View Problem
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* ======================================================
          AI ANALYSIS
      ====================================================== */}

      {showAI && item.analysis && (
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <SectionHeading
            icon={<Sparkles size={17} />}
            title="AI Analysis"
            subtitle="Actual AI-generated intelligence for this problem."
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DataBox
              label="AI Summary"
              value={
                item.analysis.ai_summary ||
                "No AI summary available."
              }
            />

            <DataBox
              label="Root Cause"
              value={
                item.analysis.root_cause ||
                "Root cause not available."
              }
            />

            <DataBox
              label="Affected People"
              value={
                item.analysis
                  .estimated_affected_people !==
                  null &&
                item.analysis
                  .estimated_affected_people !==
                  undefined
                  ? String(
                      item.analysis
                        .estimated_affected_people
                    )
                  : "Not available"
              }
            />

            <DataBox
              label="Severity"
              value={
                item.analysis.severity_level ||
                "Not available"
              }
            />
          </div>
        </div>
      )}

      {/* ======================================================
          UNIVERSITY MATCHING
      ====================================================== */}

      {showUniversities &&
        item.universities.length > 0 && (
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <SectionHeading
              icon={<University size={17} />}
              title="University Matching"
              subtitle="Actual universities returned by the matching API."
            />

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {item.universities.map(
                (university, index) => {
                  const score =
                    getMatchScore(university);

                  const reason =
                    getUniversityReason(
                      university
                    );

                  return (
                    <div
                      key={
                        university.university_id ||
                        university.id ||
                        `${item.id}-${index}`
                      }
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            {getUniversityName(
                              university
                            )}
                          </h3>

                          <p className="mt-1 text-[11px] text-slate-500">
                            {university.district ||
                              university.location ||
                              "Location not specified"}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
                          {score}% Match
                        </span>
                      </div>

                      <div className="mt-4">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Relevant Expertise
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          {getUniversityExpertise(
                            university
                          )}
                        </p>
                      </div>

                      <div className="mt-4 rounded-xl border border-teal-100 bg-white p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-teal-700">
                          Why this university?
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-600">
                          {reason ||
                            "No matching explanation was returned by the matching API."}
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

      {/* ======================================================
          SOLUTIONS
      ====================================================== */}

      {showSolutions &&
        item.solutions.length > 0 && (
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <SectionHeading
              icon={<Lightbulb size={17} />}
              title="Actual Solutions"
              subtitle="Solutions directly linked to this citizen problem."
            />

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {item.solutions.map((solution) => (
                <div
                  key={solution.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-teal-700">
                      {solution.id}
                    </span>

                    {solution.prototype_status && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                        {solution.prototype_status}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-base font-bold text-slate-900">
                    {solution.solution_title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    {solution.description ||
                      "No solution description available."}
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">

                    {/* CHANGED:
                        University ID -> University Name
                    */}

                    <DataBox
                      label="University"
                      value={getUniversityNameFromSolution(
                        solution,
                        allUniversities,
                        item.universities
                      )}
                    />

                    <DataBox
                      label="Project ID"
                      value={
                        solution.project_id ||
                        "No project linked yet"
                      }
                    />

                    <DataBox
                      label="Prototype Status"
                      value={
                        solution.prototype_status ||
                        "IDEA"
                      }
                    />

                    <DataBox
                      label="Estimated Cost"
                      value={
                        formatMoney(
                          solution.estimated_cost
                        ) || "Not specified"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* ======================================================
          PROJECTS
      ====================================================== */}

      {showProjects &&
        item.projects.length > 0 && (
          <ProjectStageSection
            projects={item.projects}
            solutions={item.solutions}
            allUniversities={allUniversities}
          />
        )}

      {/* ======================================================
          INDUSTRY SUPPORT
      ====================================================== */}

      {showIndustry &&
        item.collaborations.length > 0 && (
          <IndustrySupportSection
            collaborations={item.collaborations}
          />
        )}

      {/* ======================================================
          PROTOTYPE
      ====================================================== */}

      {showPrototype &&
        item.solutions.some((solution) =>
          [
            "DESIGN",
            "PROTOTYPE",
            "FIELD_TEST",
            "DEPLOYED",
            "TESTING",
            "TEST",
          ].includes(
            normalizeStatus(
              solution.prototype_status
            )
          )
        ) && (
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <SectionHeading
              icon={<Target size={17} />}
              title="Prototype"
              subtitle="Solutions that have progressed beyond the IDEA stage."
            />

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {item.solutions
                .filter((solution) =>
                  [
                    "DESIGN",
                    "PROTOTYPE",
                    "FIELD_TEST",
                    "DEPLOYED",
                    "TESTING",
                    "TEST",
                  ].includes(
                    normalizeStatus(
                      solution.prototype_status
                    )
                  )
                )
                .map((solution) => (
                  <div
                    key={solution.id}
                    className="rounded-xl border border-teal-100 bg-teal-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        {solution.solution_title}
                      </h3>

                      <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-teal-700">
                        {solution.prototype_status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <DataBox
                        label="Prototype Description"
                        value={
                          solution.prototype_description ||
                          "Not provided"
                        }
                      />

                      <DataBox
                        label="How It Works"
                        value={
                          solution.how_it_works ||
                          "Not provided"
                        }
                      />

                      <DataBox
                        label="Key Features"
                        value={
                          solution.key_features ||
                          "Not provided"
                        }
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

      {/* ======================================================
          DEPLOYMENT
      ====================================================== */}

      {showDeployment &&
        item.projects.some(
          (project) =>
            normalizeStatus(project.status) ===
            "DEPLOYED"
        ) && (
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <SectionHeading
              icon={<Activity size={17} />}
              title="Deployment"
              subtitle="Projects whose backend status is DEPLOYED."
            />

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {item.projects
                .filter(
                  (project) =>
                    normalizeStatus(
                      project.status
                    ) === "DEPLOYED"
                )
                .map((project) => (
                  <div
                    key={project.id}
                    className="rounded-xl border border-emerald-100 bg-emerald-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        {project.title}
                      </h3>

                      <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-emerald-700">
                        DEPLOYED
                      </span>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-slate-600">
                      {project.expected_impact ||
                        project.description ||
                        "Deployment details not specified."}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

      {/* ======================================================
          RESOLVED
      ====================================================== */}

      {showResolved &&
        normalizeStatus(problem.status) ===
          "RESOLVED" && (
          <div className="p-5 sm:p-6">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={18}
                  className="text-emerald-600"
                />

                <h3 className="text-sm font-bold text-emerald-800">
                  Problem Resolved
                </h3>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                This citizen challenge is marked as
                Resolved by the backend.
              </p>
            </div>
          </div>
        )}
    </article>
  );
}

/* ============================================================
   PROJECT STAGE SECTION
   ============================================================ */

function ProjectStageSection({
  projects,
  solutions,
  allUniversities,
}: {
  projects: BackendProject[];
  solutions: BackendSolution[];
  allUniversities: BackendUniversity[];
}) {
  const [expandedProjectId, setExpandedProjectId] =
    useState<string | null>(null);

  const [projectDetails, setProjectDetails] =
    useState<Record<string, ProjectDetailData>>({});

  const [loadingProjectId, setLoadingProjectId] =
    useState<string | null>(null);

  const [projectError, setProjectError] =
    useState<Record<string, string>>({});

  async function handleViewProject(projectId: string) {
    /* --------------------------------------------------------
       Close if already open
    -------------------------------------------------------- */

    if (expandedProjectId === projectId) {
      setExpandedProjectId(null);
      return;
    }

    setExpandedProjectId(projectId);

    /* --------------------------------------------------------
       Already loaded -> don't fetch again
    -------------------------------------------------------- */

    if (projectDetails[projectId]) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setProjectError((previous) => ({
        ...previous,
        [projectId]:
          "Authentication token not found.",
      }));

      return;
    }

    try {
      setLoadingProjectId(projectId);

      setProjectError((previous) => {
        const next = { ...previous };
        delete next[projectId];
        return next;
      });

      const authHeaders = {
        Authorization: `Bearer ${token}`,
      };

      /* ------------------------------------------------------
         1. PROJECT DETAIL
      ------------------------------------------------------ */

      const projectResponse =
        await apiRequest<BackendProject>(
          `/api/projects/${projectId}`,
          {
            headers: authHeaders,
          }
        );

      /* ------------------------------------------------------
         2. TEAM MEMBERS
      ------------------------------------------------------ */

      let members: BackendProjectMember[] = [];

      try {
        const response =
          await apiRequest<
            | BackendProjectMember[]
            | {
                members?: BackendProjectMember[];
                data?: BackendProjectMember[];
                items?: BackendProjectMember[];
              }
          >(
            `/api/projects/${projectId}/members/details`,
            {
              headers: authHeaders,
            }
          );

        members = normalizeArray(response);
      } catch {
        members = [];
      }

      /* ------------------------------------------------------
         3. PROJECT TASKS
      ------------------------------------------------------ */

      let tasks: BackendProjectTask[] = [];

      try {
        const response =
          await apiRequest<
            | BackendProjectTask[]
            | {
                tasks?: BackendProjectTask[];
                data?: BackendProjectTask[];
                items?: BackendProjectTask[];
              }
          >(
            `/api/project-tasks/project/${projectId}`,
            {
              headers: authHeaders,
            }
          );

        tasks = normalizeArray(response);
      } catch {
        tasks = [];
      }

      setProjectDetails((previous) => ({
        ...previous,
        [projectId]: {
          project: projectResponse,
          members,
          tasks,
        },
      }));
    } catch (err) {
      setProjectError((previous) => ({
        ...previous,
        [projectId]:
          err instanceof Error
            ? err.message
            : "Unable to load project details.",
      }));
    } finally {
      setLoadingProjectId(null);
    }
  }

  return (
    <div className="border-b border-slate-100 p-5 sm:p-6">
      <SectionHeading
        icon={<Rocket size={17} />}
        title="Actual Projects"
        subtitle="Projects directly connected to this problem."
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {projects.map((project) => {
          const linkedSolution =
            solutions.find(
              (solution) =>
                solution.id ===
                project.solution_id
            );

          const universityName =
            project.university_name ||
            (linkedSolution
              ? getUniversityNameFromSolution(
                  linkedSolution,
                  allUniversities,
                  []
                )
              : "University not specified");

          const isExpanded =
            expandedProjectId === project.id;

          const detail =
            projectDetails[project.id];

          const isLoading =
            loadingProjectId === project.id;

          return (
            <div
              key={project.id}
              className={`overflow-hidden rounded-xl border ${
                isExpanded
                  ? "border-teal-200 bg-white shadow-md"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              {/* ==================================================
                  PROJECT SUMMARY
              ================================================== */}

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900">
                      {project.title}
                    </h3>

                    <p className="mt-1 break-all text-[10px] text-slate-500">
                      Project ID: {project.id}
                    </p>
                  </div>

                  {project.status && (
                    <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-bold text-teal-700">
                      {project.status}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-600">
                  {project.description ||
                    "No project description available."}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <DataBox
                    label="Solution"
                    value={
                      linkedSolution
                        ?.solution_title ||
                      project.solution_id ||
                      "Not linked"
                    }
                  />

                  <DataBox
                    label="University"
                    value={universityName}
                  />

                  <DataBox
                    label="Expected Impact"
                    value={
                      project.expected_impact ||
                      "Not specified"
                    }
                  />

                  <DataBox
                    label="Budget"
                    value={
                      formatMoney(
                        project.budget
                      ) || "Not specified"
                    }
                  />
                </div>

                {/* ==================================================
                    VIEW PROJECT BUTTON

                    IMPORTANT:
                    No Link.
                    No new page.
                    Opens detail below.
                ================================================== */}

                <button
                  type="button"
                  onClick={() =>
                    handleViewProject(project.id)
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-teal-700"
                >
                  {isExpanded
                    ? "Hide Project"
                    : "View Project"}

                  {isExpanded ? (
                    <X size={14} />
                  ) : (
                    <ArrowRight size={14} />
                  )}
                </button>
              </div>

              {/* ==================================================
                  EXPANDED READ-ONLY PROJECT DETAIL
              ================================================== */}

              {isExpanded && (
                <div className="border-t border-teal-100 bg-white p-4 sm:p-5">

                  {/* ------------------------------------------------
                      LOADING
                  ------------------------------------------------ */}

                  {isLoading && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                      <Activity
                        size={20}
                        className="mx-auto animate-pulse text-teal-600"
                      />

                      <p className="mt-2 text-xs font-semibold text-slate-600">
                        Loading project details...
                      </p>
                    </div>
                  )}

                  {/* ------------------------------------------------
                      ERROR
                  ------------------------------------------------ */}

                  {!isLoading &&
                    projectError[project.id] && (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                        <div className="flex items-start gap-2">
                          <AlertTriangle
                            size={17}
                            className="mt-0.5 shrink-0 text-red-600"
                          />

                          <div>
                            <p className="text-xs font-bold text-red-800">
                              Unable to load project details
                            </p>

                            <p className="mt-1 text-xs leading-5 text-red-700">
                              {
                                projectError[
                                  project.id
                                ]
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* ------------------------------------------------
                      DETAILS
                  ------------------------------------------------ */}

                  {!isLoading &&
                    !projectError[project.id] &&
                    detail && (
                      <ReadOnlyProjectDetails
                        detail={detail}
                        fallbackProject={project}
                        universityName={universityName}
                      />
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   READ ONLY PROJECT DETAILS
   ============================================================ */

function ReadOnlyProjectDetails({
  detail,
  fallbackProject,
  universityName,
}: {
  detail: ProjectDetailData;
  fallbackProject: BackendProject;
  universityName: string;
}) {
  const project =
    detail.project || fallbackProject;

  return (
    <div className="space-y-5">

      {/* ==================================================
          DETAIL HEADER
      ================================================== */}

      <div className="rounded-xl border border-teal-100 bg-teal-50 p-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-teal-700">
              Project Details
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-900">
              {project.title}
            </h3>

            <p className="mt-1 break-all text-[10px] text-slate-500">
              {project.id}
            </p>
          </div>

          {project.status && (
            <span className="w-fit rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-teal-700">
              {project.status}
            </span>
          )}
        </div>
      </div>

      {/* ==================================================
          PROJECT INFORMATION
      ================================================== */}

      <div>
        <SectionHeading
          icon={<Rocket size={17} />}
          title="Project Information"
          subtitle="Read-only project information from the backend."
        />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <DataBox
            label="Description"
            value={
              project.description ||
              "No description available."
            }
          />

          <DataBox
            label="University"
            value={universityName}
          />

          <DataBox
            label="Expected Impact"
            value={
              project.expected_impact ||
              "Not specified"
            }
          />

          <DataBox
            label="Budget"
            value={
              formatMoney(project.budget) ||
              "Not specified"
            }
          />

          <DataBox
            label="Deadline"
            value={formatDate(project.deadline)}
          />

          <DataBox
            label="Members"
            value={
              project.member_count !==
                null &&
              project.member_count !==
                undefined
                ? String(project.member_count)
                : String(
                    detail.members.length
                  )
            }
          />

          <DataBox
            label="Created"
            value={formatDate(project.created_at)}
          />

          <DataBox
            label="Last Updated"
            value={formatDate(project.updated_at)}
          />
        </div>
      </div>

      {/* ==================================================
          PROTOTYPE INFORMATION
      ================================================== */}

      {(project.prototype_name ||
        project.prototype_url) && (
        <div>
          <SectionHeading
            icon={<Target size={17} />}
            title="Prototype"
            subtitle="Prototype information associated with this project."
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <DataBox
              label="Prototype Name"
              value={
                project.prototype_name ||
                "Not specified"
              }
            />

            <DataBox
              label="Prototype URL"
              value={
                project.prototype_url ||
                "Not provided"
              }
            />
          </div>

          {project.prototype_url && (
            <a
              href={project.prototype_url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-teal-700 hover:text-teal-800"
            >
              Open Prototype
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      )}

      {/* ==================================================
          TEAM MEMBERS
      ================================================== */}

      <div>
        <SectionHeading
          icon={<Users size={17} />}
          title="Project Team"
          subtitle="Team members currently associated with this project."
        />

        {detail.members.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {detail.members.map(
              (member, index) => (
                <div
                  key={
                    member.id ||
                    member.user_id ||
                    `member-${index}`
                  }
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                      <Users size={17} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900">
                        {getMemberName(member)}
                      </p>

                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-teal-700">
                        {getMemberRole(member)}
                      </p>

                      {member.email && (
                        <p className="mt-2 break-all text-xs text-slate-500">
                          {member.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
            <Users
              size={20}
              className="mx-auto text-slate-400"
            />

            <p className="mt-2 text-xs font-semibold text-slate-500">
              No team members are currently
              available for this project.
            </p>
          </div>
        )}
      </div>

      {/* ==================================================
          PROJECT TASKS
      ================================================== */}

      <div>
        <SectionHeading
          icon={<ListChecks size={17} />}
          title="Project Tasks"
          subtitle="Tasks currently recorded for this project."
        />

        {detail.tasks.length > 0 ? (
          <div className="mt-4 space-y-3">
            {detail.tasks.map(
              (task, index) => (
                <div
                  key={
                    task.id ||
                    `task-${index}`
                  }
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900">
                        {getTaskTitle(task)}
                      </h4>

                      {task.description && (
                        <p className="mt-2 text-xs leading-5 text-slate-600">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {task.status && (
                      <span className="w-fit shrink-0 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-teal-700">
                        {task.status}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {task.assignee_name && (
                      <DataBox
                        label="Assigned To"
                        value={
                          task.assignee_name
                        }
                      />
                    )}

                    {task.assigned_to && (
                      <DataBox
                        label="Assignee ID"
                        value={
                          task.assigned_to
                        }
                      />
                    )}

                    {task.deadline && (
                      <DataBox
                        label="Deadline"
                        value={formatDate(
                          task.deadline
                        )}
                      />
                    )}

                    {task.created_at && (
                      <DataBox
                        label="Created"
                        value={formatDate(
                          task.created_at
                        )}
                      />
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
            <ListChecks
              size={20}
              className="mx-auto text-slate-400"
            />

            <p className="mt-2 text-xs font-semibold text-slate-500">
              No tasks are currently
              recorded for this project.
            </p>
          </div>
        )}
      </div>

      {/* ==================================================
          READ ONLY NOTICE
      ================================================== */}

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-[10px] leading-5 text-slate-500">
          This project information is displayed in
          read-only monitoring mode for Government.
          No project data is modified from this view.
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   INDUSTRY SUPPORT
   ============================================================ */

function IndustrySupportSection({
  collaborations,
}: {
  collaborations: PipelineItem["collaborations"];
}) {
  const [partners, setPartners] = useState<
    Record<string, BackendIndustry>
  >({});

  useEffect(() => {
    let cancelled = false;

    async function loadPartners() {
      const token = getAuthToken();

      if (!token) {
        return;
      }

      const uniquePartnerIds = Array.from(
        new Set(
          collaborations
            .map(
              (entry) =>
                entry.collaboration
                  .industry_partner_id
            )
            .filter(
              (
                id
              ): id is string => Boolean(id)
            )
        )
      );

      const results =
        await Promise.all(
          uniquePartnerIds.map(async (id) => {
            try {
              return await apiRequest<BackendIndustry>(
                `/api/industry/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            } catch {
              return null;
            }
          })
        );

      if (cancelled) {
        return;
      }

      const mapped: Record<
        string,
        BackendIndustry
      > = {};

      results.forEach((partner) => {
        if (partner?.id) {
          mapped[partner.id] = partner;
        }
      });

      setPartners(mapped);
    }

    loadPartners();

    return () => {
      cancelled = true;
    };
  }, [collaborations]);

  return (
    <div className="border-b border-slate-100 p-5 sm:p-6">
      <SectionHeading
        icon={<Building2 size={17} />}
        title="Industry Support"
        subtitle="Actual collaborations connected to project records."
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {collaborations.map((entry) => {
          const collaboration =
            entry.collaboration;

          const industry =
            collaboration.industry_partner_id
              ? partners[
                  collaboration
                    .industry_partner_id
                ]
              : null;

          return (
            <div
              key={collaboration.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Industry Partner
                  </p>

                  <h3 className="mt-1 text-sm font-bold text-slate-900">
                    {industry?.name ||
                      "Industry partner"}
                  </h3>

                  {industry?.industry_type && (
                    <p className="mt-1 text-[10px] text-slate-500">
                      {industry.industry_type}
                    </p>
                  )}
                </div>

                {collaboration.status && (
                  <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-bold text-teal-700">
                    {collaboration.status}
                  </span>
                )}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <DataBox
                  label="Project"
                  value={entry.project.title}
                />

                <DataBox
                  label="Collaboration Type"
                  value={
                    collaboration.collaboration_type ||
                    "Not specified"
                  }
                />

                <DataBox
                  label="Amount"
                  value={
                    formatMoney(
                      collaboration.amount
                    ) || "Not specified"
                  }
                />

                <DataBox
                  label="Partner Location"
                  value={
                    industry?.location ||
                    "Not specified"
                  }
                />
              </div>

              {collaboration.description && (
                <div className="mt-4 rounded-xl border border-white bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Collaboration Description
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {collaboration.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   SECTION HEADING
   ============================================================ */

function SectionHeading({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
        {icon}
      </div>

      <div>
        <h2 className="text-base font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   DATA BOX
   ============================================================ */

function DataBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-xs font-semibold leading-5 text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   STAT CARD
   ============================================================ */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          {icon}
        </div>

        <span className="text-2xl font-bold text-slate-900">
          {value}
        </span>
      </div>

      <p className="mt-4 text-xs font-semibold text-slate-500">
        {label}
      </p>
    </div>
  );
}

/* ============================================================
   ROLE CARD
   ============================================================ */

function RoleCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-teal-700">
        {icon}

        <h3 className="text-sm font-bold text-slate-800">
          {title}
        </h3>
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}
