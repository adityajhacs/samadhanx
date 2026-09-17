"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Plus,
  Users,
  X,
  UserPlus,
  Trash2,
} from "lucide-react";

import {
  getProjects,
  getProject,
  updateProject,
  type Project as ApiProject,
} from "@/lib/api/projects";

import {
  getMyUniversityProblems,
  getMyUniversityId,
  getUniversities,
  type UniversityProblem,
} from "@/lib/api/universities";

import { getCurrentUser } from "@/lib/api/auth";

import { getUniversityMembers } from "@/lib/api/users";

import {
  getProjectTasks,
  type ProjectTask,
} from "@/lib/api/projectTasks";

import {
  apiRequest,
  getAuthToken,
} from "@/lib/api/client";
import Link from "next/link";

type ProjectMember = {
  id: string;
  user_id: string;
  name?: string | null;
  full_name?: string | null;
  role?: string | null;
};

type University = {
  id: string;
  name: string;
};

type SolutionDetails = {
  id?: string | null;
  solution_title?: string | null;
  university_id?: string | null;
};

type ProjectDetails = ApiProject & {
  university?: {
    id?: string | null;
    name?: string | null;
  } | null;

  problem?: {
    id?: string | null;
    title?: string | null;
  } | null;

  solution?: {
    id?: string | null;
    solution_title?: string | null;
    university_id?: string | null;
  } | null;

  members?: ProjectMember[];
};

type Project = {
  id: string;

  title: string;

  problem: string;

  solution: string;

  description: string;

  status: "In Progress" | "Planning";

  members: number;

  deadline: string;

  progress: number;

  created_by?: string | null;

  university_id?: string | null;

  university_name?: string;

  budget?: number | null;

  raw_status?: string | null;

  raw_deadline?: string | null;

  problem_id?: string | null;

  solution_id?: string | null;
};

function mapProject(
  project: ApiProject,
  problemTitles: Record<string, string>,
  details?: ProjectDetails,
  solutionDetails?: SolutionDetails,
  universityMap?: Record<string, string>
): Project {
  const isInProgress =
    project.status === "VALIDATION" ||
    project.status === "TEAM_FORMATION" ||
    project.status === "SOLUTION_DESIGN" ||
    project.status === "PROTOTYPE" ||
    project.status === "FIELD_PILOT" ||
    project.status === "DEPLOYED" ||
    project.status === "IMPACT_MEASUREMENT";

  const detailProblemTitle =
    details?.problem?.title || "";

  const universityId =
    details?.university?.id ||
    details?.solution?.university_id ||
    solutionDetails?.university_id ||
    null;

  const universityName =
    details?.university?.name ||
    (universityId
      ? universityMap?.[universityId]
      : undefined) ||
    "University information unavailable";

  return {
    id: project.id,

    title: project.title,

    problem:
      detailProblemTitle ||
      (
        project.problem_id
          ? problemTitles[project.problem_id] ||
            "Community problem not found"
          : "Community problem not linked"
      ),

    solution:
      details?.solution?.solution_title ||
      solutionDetails?.solution_title ||
      "No solution available.",

    description:
      project.description || "",

    status: isInProgress
      ? "In Progress"
      : "Planning",

    members:
      details?.members?.length ??
      project.member_count ??
      0,

    deadline: project.deadline
      ? new Date(
          project.deadline
        ).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
      : "To be decided",

    /*
     * IMPORTANT:
     * This value is replaced by task-based
     * progress inside loadProjects().
     */
    progress: project.progress ?? 0,

    created_by:
      project.created_by ??
      details?.created_by ??
      null,

    university_id: universityId,

    university_name: universityName,

    budget:
      project.budget ??
      null,

    raw_status:
      project.status ??
      null,

    raw_deadline:
      project.deadline ??
      null,

    problem_id:
      project.problem_id ??
      null,

    solution_id:
      project.solution_id ??
      null,
  };
}

export default function UniversityProjects() {
  const [projects, setProjects] =
    useState<Project[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ================= CURRENT USER =================

  const [currentUserId, setCurrentUserId] =
    useState("");

  const [userRole, setUserRole] =
    useState("");

  const [myUniversityId, setMyUniversityId] =
    useState("");

  // ================= EDIT MODAL =================

  const [editingProject, setEditingProject] =
    useState<Project | null>(null);

  const [editTitle, setEditTitle] =
    useState("");

  const [editDescription, setEditDescription] =
    useState("");

  const [editStatus, setEditStatus] =
    useState("IDEA");

  const [editDeadline, setEditDeadline] =
    useState("");

  /*
   * Progress is displayed only.
   * It is calculated from project tasks.
   */
  const [editProgress, setEditProgress] =
    useState(0);

  const [editBudget, setEditBudget] =
    useState("");

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [updateError, setUpdateError] =
    useState("");

  // ================= TEAM MEMBERS =================

  const [projectMembers, setProjectMembers] =
    useState<ProjectMember[]>([]);

  const [universityMembers, setUniversityMembers] =
    useState<
      {
        id: string;
        name?: string | null;
        full_name?: string | null;
        role?: string | null;
      }[]
    >([]);

  const [selectedMemberId, setSelectedMemberId] =
    useState("");

  const [selectedMemberRole, setSelectedMemberRole] =
    useState("STUDENT");

  const [loadingTeam, setLoadingTeam] =
    useState(false);

  const [teamError, setTeamError] =
    useState("");

  const [teamActionLoading, setTeamActionLoading] =
    useState(false);

  // ================= LOAD CURRENT USER =================

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const user =
          await getCurrentUser();

        setCurrentUserId(user.id);

        setUserRole(
          (user.role || "")
            .trim()
            .toLowerCase()
        );
      } catch {
        setCurrentUserId("");
        setUserRole("");
      }
    }

    loadCurrentUser();
  }, []);

  // ================= LOAD UNIVERSITY =================

  useEffect(() => {
    async function loadUniversity() {
      try {
        const universityId =
          await getMyUniversityId();

        setMyUniversityId(
          universityId
        );
      } catch {
        setMyUniversityId("");
      }
    }

    loadUniversity();
  }, []);

  // ================= CALCULATE TASK PROGRESS =================

  async function getTaskBasedProgress(
    projectId: string
  ): Promise<number> {
    try {
      const tasks =
        await getProjectTasks(
          projectId
        );

      if (!tasks || tasks.length === 0) {
        return 0;
      }

      const completedTasks =
        tasks.filter(
          (task: ProjectTask) =>
            task.status === "COMPLETED"
        ).length;

      return Math.round(
        (completedTasks /
          tasks.length) *
          100
      );
    } catch {
      return 0;
    }
  }

  // ================= LOAD PROJECTS =================

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const [
        projectData,
        problems,
        universities,
      ] = await Promise.all([
        getProjects(),
        getMyUniversityProblems(),
        getUniversities(),
      ]);

      // ================= PROBLEM MAP =================

      const problemTitles: Record<
        string,
        string
      > = {};

      problems.forEach(
        (problem: UniversityProblem) => {
          problemTitles[
            problem.id
          ] = problem.title;
        }
      );

      // ================= UNIVERSITY MAP =================

      const universityMap: Record<
        string,
        string
      > = {};

      (
        universities as University[]
      ).forEach((university) => {
        if (
          university.id &&
          university.name
        ) {
          universityMap[
            university.id
          ] = university.name;
        }
      });

      // ================= PROJECT DETAILS =================

      const projectDetails =
        await Promise.all(
          projectData.map(
            async (project) => {
              try {
                return (
                  await getProject(
                    project.id
                  )
                ) as ProjectDetails;
              } catch {
                return project as ProjectDetails;
              }
            }
          )
        );

      // ================= SOLUTION DETAILS =================

      const solutionDetails =
        await Promise.all(
          projectData.map(
            async (project) => {
              if (!project.solution_id) {
                return null;
              }

              try {
                const token =
                  getAuthToken();

                if (!token) {
                  return null;
                }

                return await apiRequest<SolutionDetails>(
                  `/api/solutions/${project.solution_id}`,
                  {
                    method: "GET",
                    token,
                  }
                );
              } catch {
                return null;
              }
            }
          )
        );

      // ================= TASK-BASED PROGRESS =================

      const taskProgressMap: Record<
        string,
        number
      > = {};

      await Promise.all(
        projectData.map(
          async (project) => {
            taskProgressMap[
              project.id
            ] =
              await getTaskBasedProgress(
                project.id
              );
          }
        )
      );

      // ================= FINAL PROJECT MAP =================

      const mappedProjects =
        projectData.map(
          (project, index) => {
            const mapped =
              mapProject(
                project,
                problemTitles,
                projectDetails[index],
                solutionDetails[index] ||
                  undefined,
                universityMap
              );

            return {
              ...mapped,

              /*
               * IMPORTANT:
               * Project progress shown in UI
               * always comes from tasks.
               */
              progress:
                taskProgressMap[
                  project.id
                ] ?? 0,
            };
          }
        );

      setProjects(
        mappedProjects
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProjects();
  }, []);

  // ================= UPDATE PERMISSION =================

  const canUpdateProject = (
    project: Project
  ) => {
    /*
     * Student can never update a project.
     */
    if (
      userRole === "student"
    ) {
      return false;
    }

    /*
     * Faculty creator is the project owner.
     */
    if (
      currentUserId &&
      project.created_by &&
      project.created_by.toLowerCase() ===
        currentUserId.toLowerCase()
    ) {
      return true;
    }

    /*
     * University can update projects
     * belonging to its own university.
     */
    if (
      userRole === "university"
    ) {
      return (
        !!myUniversityId &&
        !!project.university_id &&
        project.university_id.toLowerCase() ===
          myUniversityId.toLowerCase()
      );
    }

    return false;
  };

  // ================= OPEN UPDATE MODAL =================

  const openEditModal = async (
    project: Project
  ) => {
    setEditingProject(project);

    setEditTitle(
      project.title
    );

    setEditDescription(
      project.description || ""
    );

    setEditStatus(
      project.raw_status ||
        "IDEA"
    );

    setEditDeadline(
      project.raw_deadline
        ? project.raw_deadline.split(
            "T"
          )[0]
        : ""
    );

    /*
     * Always calculate fresh task progress
     * when modal opens.
     */
    const taskProgress =
      await getTaskBasedProgress(
        project.id
      );

    setEditProgress(
      taskProgress
    );

    setEditBudget(
      project.budget !== null &&
      project.budget !== undefined
        ? String(project.budget)
        : ""
    );

    setUpdateError("");
    setTeamError("");
    setSelectedMemberId("");

    await loadProjectTeam(
      project.id
    );
  };

  // ================= CLOSE UPDATE MODAL =================

  const closeEditModal = () => {
    if (isUpdating) {
      return;
    }

    setEditingProject(null);

    setUpdateError("");
    setTeamError("");

    setProjectMembers([]);

    setSelectedMemberId("");
  };

  // ================= LOAD PROJECT TEAM =================

  const loadProjectTeam = async (
    projectId: string
  ) => {
    try {
      setLoadingTeam(true);
      setTeamError("");

      const token =
        getAuthToken();

      if (!token) {
        throw new Error(
          "Please login first."
        );
      }

      const members =
        await apiRequest<ProjectMember[]>(
          `/api/project-members/project/${projectId}`,
          {
            method: "GET",
            token,
          }
        );

      setProjectMembers(
        Array.isArray(members)
          ? members
          : []
      );
    } catch (err) {
      setTeamError(
        err instanceof Error
          ? err.message
          : "Failed to load project team."
      );
    } finally {
      setLoadingTeam(false);
    }
  };

  // ================= LOAD UNIVERSITY MEMBERS =================

  const loadUniversityMembers =
    async () => {
      try {
        const members =
          await getUniversityMembers();

        setUniversityMembers(
          members.map(
            (member) => ({
              id: member.id,
              name: member.full_name ?? undefined,
              full_name:
                member.full_name,
              role: member.role,
            })
          )
        );
      } catch (err) {
        setTeamError(
          err instanceof Error
            ? err.message
            : "Failed to load university members."
        );
      }
    };

  useEffect(() => {
    if (
      editingProject &&
      (
        userRole === "university" ||
        (
          userRole === "faculty" &&
          !!currentUserId &&
          !!editingProject.created_by &&
          editingProject.created_by.toLowerCase() ===
            currentUserId.toLowerCase()
        )
      )
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadUniversityMembers();
    }
  }, [
    editingProject,
    userRole,
    currentUserId,
  ]);

  // ================= ADD TEAM MEMBER =================

  const handleAddMember = async () => {
    if (!editingProject) {
      return;
    }

    if (!selectedMemberId) {
      setTeamError(
        "Please select a team member."
      );
      return;
    }

    const alreadyMember =
      projectMembers.some(
        (member) =>
          member.user_id ===
          selectedMemberId
      );

    if (alreadyMember) {
      setTeamError(
        "This user is already a project member."
      );
      return;
    }

    try {
      setTeamActionLoading(
        true
      );

      setTeamError("");

      const token =
        getAuthToken();

      if (!token) {
        throw new Error(
          "Please login first."
        );
      }

      await apiRequest(
        "/api/project-members",
        {
          method: "POST",
          token,
          body: JSON.stringify({
            project_id:
              editingProject.id,

            user_id:
              selectedMemberId,

            role:
              selectedMemberRole,
          }),
        }
      );

      setSelectedMemberId("");

      await loadProjectTeam(
        editingProject.id
      );

      await loadProjects();
    } catch (err) {
      setTeamError(
        err instanceof Error
          ? err.message
          : "Failed to add team member."
      );
    } finally {
      setTeamActionLoading(
        false
      );
    }
  };

  // ================= REMOVE TEAM MEMBER =================

  const handleRemoveMember = async (
    member: ProjectMember
  ) => {
    if (!editingProject) {
      return;
    }

    try {
      setTeamActionLoading(
        true
      );

      setTeamError("");

      const token =
        getAuthToken();

      if (!token) {
        throw new Error(
          "Please login first."
        );
      }

      await apiRequest(
        `/api/project-members/${member.id}`,
        {
          method: "DELETE",
          token,
        }
      );

      await loadProjectTeam(
        editingProject.id
      );

      await loadProjects();
    } catch (err) {
      setTeamError(
        err instanceof Error
          ? err.message
          : "Failed to remove team member."
      );
    } finally {
      setTeamActionLoading(
        false
      );
    }
  };

  // ================= UPDATE PROJECT =================

  const handleUpdateProject =
    async () => {
      if (!editingProject) {
        return;
      }

      if (
        !canUpdateProject(
          editingProject
        )
      ) {
        setUpdateError(
          "You are not authorized to update this project."
        );
        return;
      }

      if (!editTitle.trim()) {
        setUpdateError(
          "Project title is required."
        );
        return;
      }

      if (
        editBudget.trim() !== "" &&
        (
          Number.isNaN(
            Number(editBudget)
          ) ||
          Number(editBudget) < 0
        )
      ) {
        setUpdateError(
          "Budget cannot be negative."
        );
        return;
      }

      try {
        setIsUpdating(true);

        setUpdateError("");

        /*
         * IMPORTANT:
         * Progress is intentionally NOT sent.
         *
         * It is calculated from completed tasks.
         */
        await updateProject(
          editingProject.id,
          {
            title:
              editTitle.trim(),

            description:
              editDescription.trim(),

            status:
              editStatus,

            deadline:
              editDeadline
                ? new Date(
                    `${editDeadline}T23:59:59`
                  ).toISOString()
                : null,

            budget:
              editBudget.trim() === ""
                ? null
                : Number(editBudget),
          }
        );

        setEditingProject(null);

        setProjectMembers([]);

        await loadProjects();
      } catch (err) {
        setUpdateError(
          err instanceof Error
            ? err.message
            : "Failed to update project."
        );
      } finally {
        setIsUpdating(false);
      }
    };

  // ================= STATS =================

  const inProgressCount =
    projects.filter(
      (project) =>
        project.status ===
        "In Progress"
    ).length;

  const planningCount =
    projects.filter(
      (project) =>
        project.status ===
        "Planning"
    ).length;

  const teamMembers =
    projects.reduce(
      (total, project) =>
        total + project.members,
      0
    );

  const onTrackCount =
    projects.filter(
      (project) =>
        project.status ===
          "In Progress" &&
        project.progress >= 40
    ).length;

  const needsAttentionCount =
    projects.filter(
      (project) =>
        project.status ===
          "Planning" ||
        project.progress < 30
    ).length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= NAVBAR ================= */}

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

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

          <div className="hidden items-center gap-6 md:flex">

            <a
              href="/university/dashboard"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Dashboard
            </a>

            <Link
              href="/university/problems"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Problems
            </Link>

            <Link
              href="/university/projects"
              className="text-sm font-semibold text-teal-600"
            >
              Projects
            </Link>

            <Link
              href="/university/solutions"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Solutions
            </Link>

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

          <Link
            href="/university/projects/create"
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </Link>

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* ================= PROJECT INSIGHTS ================= */}

        <div className="mt-7">

          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900">
              Project Insights
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              A quick view of the current project activity.
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
                {loading ? "..." : onTrackCount}
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
                {loading ? "..." : needsAttentionCount}
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
                {loading ? "..." : projects.length}
              </p>

              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-teal-600">

                <span className="h-1 w-1 shrink-0 rounded-full bg-teal-600" />

                <span>
                  {loading ? "..." : inProgressCount} in progress
                </span>

                <span className="mx-0.5">
                  ·
                </span>

                <span>
                  {loading ? "..." : planningCount} planning
                </span>

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
                {loading ? "..." : teamMembers}
              </p>

              <p className="mt-1 text-xs font-medium text-teal-600">
                Students and researchers involved
              </p>

            </div>

          </div>
        </div>

        {/* ================= PROJECT LIST ================= */}

        <div className="mt-8">

          <div className="mb-4">

            <h3 className="text-xl font-bold">
              All Projects
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              View projects created to solve community problems and track their progress.
            </p>

          </div>

          {/* Loading */}

          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Loading projects...
              </p>
            </div>
          )}

          {/* Empty */}

          {!loading &&
            projects.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

                <FolderKanban className="mx-auto h-10 w-10 text-slate-300" />

                <h4 className="mt-3 text-lg font-bold text-slate-900">
                  No projects yet
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Create your first university project to get started.
                </p>

              </div>
            )}

          {/* Projects */}

          <div className="space-y-5">

            {!loading &&
              projects.map((project) => (
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

                      {/* University */}

                      <p className="mt-2 text-sm text-slate-500">

                        <span className="font-semibold text-slate-700">
                          University:
                        </span>{" "}

                        {project.university_name}

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
                            style={{
                              width: `${Math.min(
                                Math.max(
                                  project.progress,
                                  0
                                ),
                                100
                              )}%`,
                            }}
                          />

                        </div>

                        <p className="mt-1 text-xs text-slate-400">
                          Based on completed project tasks
                        </p>

                      </div>

                    </div>

                    {/* Right */}

                    <div className="border-t border-slate-200 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">

                      <div className="space-y-5">

                        {/* Team */}

                        <div className="flex items-center gap-3">

                          <Users className="h-5 w-5 text-slate-400" />

                          <div>

                            <p className="text-xs text-slate-500">
                              Team Size
                            </p>

                            <p className="font-bold">
                              {project.members}{" "}
                              {project.members === 1
                                ? "Member"
                                : "Members"}
                            </p>

                          </div>

                        </div>

                        {/* Deadline */}

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

                        {/* Status */}

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

                      {/* Update */}

                      {canUpdateProject(project) && (
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(
                              project
                            )
                          }
                          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                        >
                          Update Project
                        </button>
                      )}

                      <a
                        href={`/university/projects/${project.id}`}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-teal-300 px-4 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-600 hover:text-white"
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

            <Link
              href="/university/projects/create"
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
            >
              Create Project
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>

      </section>

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

            <Link
              href="/university/problems"
              className="transition hover:text-white"
            >
              Problems
            </Link>

            <Link
              href="/university/solutions"
              className="transition hover:text-white"
            >
              Solutions
            </Link>

            <a
              href="/help"
              className="transition hover:text-white"
            >
              Help
            </a>

          </div>

        </div>

      </footer>

      {/* ================= UPDATE MODAL ================= */}

      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">

          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Update Project
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update project information, budget and team members.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  closeEditModal
                }
                disabled={
                  isUpdating
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Modal Body */}

            <div className="max-h-[75vh] overflow-y-auto px-6 py-5">

              <div className="space-y-5">

                {/* Project Name */}

                <div>

                  <label className="text-sm font-semibold text-slate-700">
                    Project Name
                  </label>

                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) =>
                      setEditTitle(
                        e.target.value
                      )
                    }
                    disabled={
                      isUpdating
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                  />

                </div>

                {/* Community Problem */}

                <div>

                  <label className="text-sm font-semibold text-slate-700">
                    Community Problem
                  </label>

                  <input
                    type="text"
                    value={
                      editingProject.problem
                    }
                    readOnly
                    disabled
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none"
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    Community problem is linked to this project.
                  </p>

                </div>

                {/* Proposed Solution */}

                <div>

                  <label className="text-sm font-semibold text-slate-700">
                    Proposed Solution
                  </label>

                  <input
                    type="text"
                    value={
                      editingProject.solution
                    }
                    readOnly
                    disabled
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none"
                  />

                </div>

                {/* Project Description */}

                <div>

                  <label className="text-sm font-semibold text-slate-700">
                    Project Description
                  </label>

                  <textarea
                    value={
                      editDescription
                    }
                    onChange={(e) =>
                      setEditDescription(
                        e.target.value
                      )
                    }
                    rows={4}
                    disabled={
                      isUpdating
                    }
                    placeholder="Describe how this project will solve the community problem."
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                  />

                </div>

                {/* Status */}

                <div>

                  <label className="text-sm font-semibold text-slate-700">
                    Status
                  </label>

                  <select
                    value={
                      editStatus
                    }
                    onChange={(e) =>
                      setEditStatus(
                        e.target.value
                      )
                    }
                    disabled={
                      isUpdating
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                  >

                    <option value="IDEA">
                      Idea
                    </option>

                    <option value="VALIDATION">
                      Validation
                    </option>

                    <option value="TEAM_FORMATION">
                      Team Formation
                    </option>

                    <option value="SOLUTION_DESIGN">
                      Solution Design
                    </option>

                    <option value="PROTOTYPE">
                      Prototype
                    </option>

                    <option value="FIELD_PILOT">
                      Field Pilot
                    </option>

                    <option value="DEPLOYED">
                      Deployed
                    </option>

                    <option value="IMPACT_MEASUREMENT">
                      Impact Measurement
                    </option>

                  </select>

                </div>

                {/* Deadline + Progress */}

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Deadline */}

                  <div>

                    <label className="text-sm font-semibold text-slate-700">
                      Project Deadline
                    </label>

                    <input
                      type="date"
                      value={
                        editDeadline
                      }
                      onChange={(e) =>
                        setEditDeadline(
                          e.target.value
                        )
                      }
                      disabled={
                        isUpdating
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                    />

                  </div>

                  {/* Progress */}

                  <div>

                    <label className="text-sm font-semibold text-slate-700">
                      Progress (%)
                    </label>

                    <input
                      type="number"
                      value={
                        editProgress
                      }
                      readOnly
                      disabled
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none"
                    />

                    <p className="mt-1 text-xs text-slate-400">
                      Automatically calculated from completed project tasks.
                    </p>

                  </div>

                </div>

                {/* Budget */}

                <div>

                  <label className="text-sm font-semibold text-slate-700">
                    Project Budget
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={
                      editBudget
                    }
                    onChange={(e) =>
                      setEditBudget(
                        e.target.value
                      )
                    }
                    disabled={
                      isUpdating
                    }
                    placeholder="Enter project budget"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                  />

                </div>

                {/* Team Members */}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                  <div className="flex items-center justify-between gap-3">

                    <div>

                      <p className="text-sm font-bold text-slate-900">
                        Team Members
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Manage the members working on this project.
                      </p>

                    </div>

                    <Users className="h-5 w-5 text-slate-400" />

                  </div>

                  {/* Existing Members */}

                  <div className="mt-4 space-y-2">

                    {loadingTeam && (
                      <p className="text-sm text-slate-500">
                        Loading team...
                      </p>
                    )}

                    {!loadingTeam &&
                      projectMembers.length ===
                        0 && (
                        <p className="text-sm text-slate-500">
                          No team members added yet.
                        </p>
                      )}

                    {!loadingTeam &&
                      projectMembers.map(
                        (member) => (
                          <div
                            key={
                              member.id
                            }
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                          >

                            <div className="min-w-0">

                              <p className="truncate text-sm font-semibold text-slate-800">
                                {member.name ||
                                  member.full_name ||
                                  "Project Member"}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500">
                                {member.role ||
                                  "Member"}
                              </p>

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveMember(
                                  member
                                )
                              }
                              disabled={
                                teamActionLoading ||
                                isUpdating
                              }
                              className="ml-3 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                              title="Remove member"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                          </div>
                        )
                      )}

                  </div>

                  {/* Add Member */}

                  <div className="mt-4 border-t border-slate-200 pt-4">

                    <div className="grid gap-3 sm:grid-cols-[1fr_150px_auto]">

                      <select
                        value={
                          selectedMemberId
                        }
                        onChange={(e) =>
                          setSelectedMemberId(
                            e.target.value
                          )
                        }
                        disabled={
                          teamActionLoading ||
                          isUpdating
                        }
                        className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                      >

                        <option value="">
                          Select member
                        </option>

                        {universityMembers
                          .filter(
                            (member) =>
                              !projectMembers.some(
                                (
                                  projectMember
                                ) =>
                                  projectMember.user_id ===
                                  member.id
                              )
                          )
                          .map(
                            (member) => (
                              <option
                                key={
                                  member.id
                                }
                                value={
                                  member.id
                                }
                              >
                                {member.name ||
                                  member.full_name ||
                                  "Member"}
                              </option>
                            )
                          )}

                      </select>

                      <select
                        value={
                          selectedMemberRole
                        }
                        onChange={(e) =>
                          setSelectedMemberRole(
                            e.target.value
                          )
                        }
                        disabled={
                          teamActionLoading ||
                          isUpdating
                        }
                        className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                      >

                        <option value="STUDENT">
                          Student
                        </option>

                        <option value="FACULTY">
                          Faculty
                        </option>

                        <option value="RESEARCHER">
                          Researcher
                        </option>

                        <option value="ENGINEER">
                          Engineer
                        </option>

                      </select>

                      <button
                        type="button"
                        onClick={
                          handleAddMember
                        }
                        disabled={
                          teamActionLoading ||
                          isUpdating ||
                          !selectedMemberId
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        <UserPlus className="h-4 w-4" />

                        Add

                      </button>

                    </div>

                  </div>

                  {teamError && (
                    <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                      {teamError}
                    </p>
                  )}

                </div>

                {/* Update Error */}

                {updateError && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {updateError}
                  </p>
                )}

              </div>

            </div>

            {/* Modal Footer */}

            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

              <button
                type="button"
                onClick={
                  closeEditModal
                }
                disabled={
                  isUpdating
                }
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleUpdateProject
                }
                disabled={
                  isUpdating
                }
                className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpdating
                  ? "Updating..."
                  : "Update Project"}
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}