
"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
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

import {
  createProjectTask,
  getProjectTasks,
  updateProjectTask,
  type ProjectTask,
} from "@/lib/api/projectTasks";

import {
  getProjectMemberDetails,
  type ProjectMemberDetail,
} from "@/lib/api/projectMembers";

import {
  getProject,
  type Project,
} from "@/lib/api/projects";

import {
  getUniversityProblem,
  getMyUniversityId,
  type UniversityProblem,
} from "@/lib/api/universities";

import {
  createCollaboration,
  getCollaborations,
  type Collaboration,
  type CollaborationType,
} from "@/lib/api/collaborations";

import {
  uploadProjectPrototype,
} from "@/lib/api/projectPrototype";

import { getCurrentUser } from "@/lib/api/auth";

import {
  apiRequest,
  getAuthToken,
} from "@/lib/api/client";

/* ============================================================
   INDUSTRY PARTNER TYPE
   ============================================================ */

type IndustryPartner = {
  id: string;
  name: string;
  industry_type: string | null;
  description: string | null;
  location: string | null;
  contact_email: string | null;
  created_at: string | null;
};

/* ============================================================
   SUPPORT OPTIONS
   These values MUST match backend CollaborationCreate enum.
   ============================================================ */

const supportOptions = [
  "FUNDING",
  "MENTORSHIP",
  "HARDWARE",
  "TESTING",
  "PROTOTYPING",
];

/* ============================================================
   LABEL HELPERS
   ============================================================ */

const formatLabel = (value: string) =>
  value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );

export default function ProjectDetails() {
  const params = useParams();
  const searchParams = useSearchParams();

  const projectId = String(params?.id ?? "");

  const selectedPartnerId =
    searchParams.get("partner");

  /* ============================================================
     CURRENT USER / RBAC
  ============================================================ */

  const [currentUserId, setCurrentUserId] =
    useState("");

  const [userRole, setUserRole] =
    useState("");

  /* ============================================================
     PROJECT
  ============================================================ */

  const [project, setProject] =
    useState<Project | null>(null);

  const [loadingProject, setLoadingProject] =
    useState(true);

  const [projectError, setProjectError] =
    useState("");

  /* ============================================================
     AI ANALYSIS
  ============================================================ */

  const [aiAnalysis, setAiAnalysis] =
    useState<
      UniversityProblem["ai_analysis"] | null
    >(null);

  const [linkedProblem, setLinkedProblem] =
    useState<UniversityProblem | null>(null);

  const [loadingAI, setLoadingAI] =
    useState(false);

  /* ============================================================
     PROJECT TASKS
  ============================================================ */

  const [tasks, setTasks] =
    useState<ProjectTask[]>([]);

  const [loadingTasks, setLoadingTasks] =
    useState(true);

  const [showTaskModal, setShowTaskModal] =
    useState(false);

  const [taskTitle, setTaskTitle] =
    useState("");

  const [taskDescription, setTaskDescription] =
    useState("");

  const [taskAssignee, setTaskAssignee] =
    useState("");

  const [taskStatus, setTaskStatus] =
    useState<
      "PENDING" | "IN_PROGRESS" | "COMPLETED"
    >("PENDING");

  const [creatingTask, setCreatingTask] =
    useState(false);

  const [taskError, setTaskError] =
    useState("");

  /* ============================================================
     PROJECT TEAM
  ============================================================ */

  const [teamMembers, setTeamMembers] =
    useState<ProjectMemberDetail[]>([]);

  const [loadingTeam, setLoadingTeam] =
    useState(true);

  /* ============================================================
     INDUSTRY PARTNERS
  ============================================================ */

  const [industryPartners, setIndustryPartners] =
    useState<IndustryPartner[]>([]);

  const [loadingIndustryPartners, setLoadingIndustryPartners] =
    useState(false);

  /* ============================================================
     COLLABORATION
  ============================================================ */

  const [collaborations, setCollaborations] =
    useState<Collaboration[]>([]);

  const [showCollaborationModal, setShowCollaborationModal] =
    useState(false);

  const [selectedCompany, setSelectedCompany] =
    useState("");

  const [selectedSupports, setSelectedSupports] =
    useState<string[]>([]);

  const [fundingAmount, setFundingAmount] =
    useState("");

  const [collaborationMessage, setCollaborationMessage] =
    useState("");

  const [creatingCollaboration, setCreatingCollaboration] =
    useState(false);

  const [collaborationError, setCollaborationError] =
    useState("");

  /* ============================================================
     PROTOTYPE
  ============================================================ */

  const [prototypeFile, setPrototypeFile] =
    useState<File | null>(null);

  const [prototypeUrl, setPrototypeUrl] =
    useState<string | null>(null);

  const [uploadingPrototype, setUploadingPrototype] =
    useState(false);

  const [prototypeError, setPrototypeError] =
    useState("");

  /* ============================================================
     LOAD CURRENT USER
  ============================================================ */

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const user = await getCurrentUser();

        setCurrentUserId(user.id);
        setUserRole(
          (user.role || "").trim().toLowerCase()
        );
      } catch {
        setCurrentUserId("");
        setUserRole("");
      }
    }

    loadCurrentUser();
  }, []);

  /* ============================================================
     LOAD INDUSTRY PARTNERS
  ============================================================ */

  useEffect(() => {
    async function loadIndustryPartners() {
      try {
        setLoadingIndustryPartners(true);

        const token = getAuthToken();

        if (!token) {
          throw new Error(
            "Please login first."
          );
        }

        const data =
          await apiRequest<IndustryPartner[]>(
            "/api/industry",
            {
              method: "GET",
              token,
            }
          );

        setIndustryPartners(data);
      } catch (err) {
        setIndustryPartners([]);

        setCollaborationError(
          err instanceof Error
            ? err.message
            : "Failed to load industry partners."
        );
      } finally {
        setLoadingIndustryPartners(false);
      }
    }

    loadIndustryPartners();
  }, []);

  /* ============================================================
     LOAD PROJECT + TASKS + TEAM + COLLABORATIONS
  ============================================================ */

  useEffect(() => {
    if (!projectId) return;

    async function loadProjectData() {
      try {
        setLoadingProject(true);
        setLoadingTasks(true);
        setLoadingTeam(true);

        setProjectError("");
        setTaskError("");
        setCollaborationError("");

        const [
          projectData,
          taskData,
          memberData,
          collaborationData,
        ] = await Promise.all([
          getProject(projectId),
          getProjectTasks(projectId),
          getProjectMemberDetails(projectId),
          getCollaborations(),
        ]);

        setProject(projectData);
        setTasks(taskData);
        setTeamMembers(memberData);

        const projectCollaborations =
          collaborationData.filter(
            (collaboration) =>
              collaboration.project_id === projectId
          );

        setCollaborations(
          projectCollaborations
        );

        if (
          projectCollaborations.length > 0
        ) {
          const latest =
            projectCollaborations[
              projectCollaborations.length - 1
            ];

          setSelectedCompany(
            latest.industry_partner_id ?? ""
          );

          /*
           * Restore all support types belonging to
           * the latest industry partner for this project.
           */
          const latestPartnerCollaborations =
            projectCollaborations.filter(
              (collaboration) =>
                collaboration.industry_partner_id ===
                latest.industry_partner_id
            );

          const supportTypes =
            latestPartnerCollaborations
              .map(
                (collaboration) =>
                  collaboration.collaboration_type
              )
              .filter(
                (type): type is CollaborationType  =>
                  !!type
              );

          setSelectedSupports(
            Array.from(
              new Set(supportTypes)
            )
          );

          const totalFunding =
            latestPartnerCollaborations.reduce(
              (total, collaboration) =>
                total +
                Number(
                  collaboration.amount ?? 0
                ),
              0
            );

          setFundingAmount(
            totalFunding > 0
              ? String(totalFunding)
              : ""
          );
        } else {
          setSelectedCompany("");
          setSelectedSupports([]);
          setFundingAmount("");
        }

        if (projectData.prototype_url) {
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL ||
            "http://127.0.0.1:8000";

          setPrototypeUrl(
            `${apiUrl}${projectData.prototype_url}`
          );
        }
      } catch (err) {
        setProjectError(
          err instanceof Error
            ? err.message
            : "Failed to load project data."
        );
      } finally {
        setLoadingProject(false);
        setLoadingTasks(false);
        setLoadingTeam(false);
      }
    }

    loadProjectData();
  }, [projectId]);

  /* ============================================================
     LOAD LINKED PROBLEM + AI ANALYSIS
  ============================================================ */

  useEffect(() => {
    if (!project?.problem_id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAiAnalysis(null);
      setLinkedProblem(null);
      return;
    }

    async function loadAIAnalysis() {
      try {
        setLoadingAI(true);

        const universityId =
          await getMyUniversityId();

        const problem =
          await getUniversityProblem(
            universityId,
            project!.problem_id!
          );

        setLinkedProblem(problem);

        setAiAnalysis(
          problem.ai_analysis ?? null
        );
      } catch {
        setAiAnalysis(null);
        setLinkedProblem(null);
      } finally {
        setLoadingAI(false);
      }
    }

    loadAIAnalysis();
  }, [project]);

  /* ============================================================
     OPEN COLLABORATION FROM INDUSTRY PAGE
  ============================================================ */

  useEffect(() => {
    if (
      !selectedPartnerId ||
      !project ||
      !industryPartners.length
    ) {
      return;
    }

    if (
      userRole === "university" ||
      (
        userRole === "faculty" &&
        project.created_by === currentUserId
      )
    ) {
      const partnerExists =
        industryPartners.some(
          (partner) =>
            partner.id === selectedPartnerId
        );

      if (partnerExists) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedCompany(
          selectedPartnerId
        );

        setCollaborationError("");
        setShowCollaborationModal(true);
      }
    }
  }, [
    selectedPartnerId,
    industryPartners,
    userRole,
    project,
    currentUserId,
  ]);

  /* ============================================================
     RBAC HELPERS
  ============================================================ */

  const isProjectCreator =
    !!currentUserId &&
    !!project?.created_by &&
    project.created_by === currentUserId;

  const isProjectMember =
    !!currentUserId &&
    teamMembers.some(
      (member) =>
        member.user_id === currentUserId
    );

  const isUniversity =
    userRole === "university";

  const isFaculty =
    userRole === "faculty";

  const isStudent =
    userRole === "student";

  const canCreateTask =
    isUniversity ||
    (isFaculty && isProjectCreator);

  const canUpdateTask = (
    task: ProjectTask
  ) => {
    if (isUniversity) {
      return true;
    }

    if (
      isFaculty &&
      isProjectCreator
    ) {
      return true;
    }

    if (
      (isFaculty || isStudent) &&
      isProjectMember
    ) {
      return task.assigned_to === currentUserId;
    }

    return false;
  };

  const canManageTeam =
    isUniversity ||
    (isFaculty && isProjectCreator);

  const canRequestCollaboration =
    isUniversity ||
    (isFaculty && isProjectCreator);

  const canUploadPrototype =
    isUniversity ||
    (isFaculty && isProjectCreator) ||
    (
      (isFaculty || isStudent) &&
      isProjectMember
    );

  /* ============================================================
     TASK FUNCTIONS
  ============================================================ */

  const handleCreateTask = async () => {
    if (!canCreateTask) {
      setTaskError(
        "You do not have permission to create tasks for this project."
      );
      return;
    }

    if (!taskTitle.trim()) {
      setTaskError(
        "Please enter a task title."
      );
      return;
    }

    try {
      setCreatingTask(true);
      setTaskError("");

      const newTask =
        await createProjectTask(
          projectId,
          {
            title: taskTitle.trim(),
            description:
              taskDescription.trim() ||
              undefined,
            assigned_to:
              taskAssignee || null,
            status: taskStatus,
          }
        );

      setTasks((prev) => [
        ...prev,
        newTask,
      ]);

      setTaskTitle("");
      setTaskDescription("");
      setTaskAssignee("");
      setTaskStatus("PENDING");

      setShowTaskModal(false);
    } catch (err) {
      setTaskError(
        err instanceof Error
          ? err.message
          : "Failed to create task."
      );
    } finally {
      setCreatingTask(false);
    }
  };

  const handleToggleTask = async (
    task: ProjectTask
  ) => {
    if (!canUpdateTask(task)) {
      setTaskError(
        "You can only update tasks assigned to you."
      );
      return;
    }

    const nextStatus =
      task.status === "COMPLETED"
        ? "PENDING"
        : "COMPLETED";

    try {
      setTaskError("");

      const updatedTask =
        await updateProjectTask(
          task.id,
          {
            status: nextStatus,
          }
        );

      setTasks((prev) =>
        prev.map((item) =>
          item.id === updatedTask.id
            ? updatedTask
            : item
        )
      );
    } catch (err) {
      setTaskError(
        err instanceof Error
          ? err.message
          : "Failed to update task."
      );
    }
  };

  /* ============================================================
     TASK PROGRESS
  ============================================================ */

  const completedCount =
    tasks.filter(
      (task) =>
        task.status === "COMPLETED"
    ).length;

  const taskProgress =
    tasks.length > 0
      ? Math.round(
          (completedCount /
            tasks.length) *
            100
        )
      : project?.progress ?? 0;

  /* ============================================================
     COLLABORATION FUNCTIONS
  ============================================================ */

  const toggleSupport = (
    support: string
  ) => {
    setSelectedSupports((prev) =>
      prev.includes(support)
        ? prev.filter(
            (item) =>
              item !== support
          )
        : [
            ...prev,
            support,
          ]
    );
  };

  const handleRequestCollaboration =
    async () => {
      if (!canRequestCollaboration) {
        setCollaborationError(
          "You do not have permission to request collaboration for this project."
        );
        return;
      }

      if (!selectedCompany) {
        setCollaborationError(
          "Please select an industry partner."
        );
        return;
      }

      if (
        selectedSupports.length === 0
      ) {
        setCollaborationError(
          "Please select at least one support type."
        );
        return;
      }

      const selectedPartner =
        industryPartners.find(
          (partner) =>
            partner.id === selectedCompany
        );

      if (!selectedPartner) {
        setCollaborationError(
          "Selected industry partner was not found."
        );
        return;
      }

      try {
        setCreatingCollaboration(true);
        setCollaborationError("");

        /*
         * Backend accepts ONE collaboration_type per record.
         *
         * Therefore:
         * Funding + Testing + Hardware
         *
         * becomes three collaboration records.
         */
        const createdCollaborations =
          await Promise.all(
            selectedSupports.map(
              async (support) => {
                const collaboration =
                  await createCollaboration({
                    project_id: projectId,
                    industry_partner_id:
                      selectedCompany,
                    collaboration_type:
                      support as
                        | "FUNDING"
                        | "MENTORSHIP"
                        | "HARDWARE"
                        | "TESTING"
                        | "PROTOTYPING",
                    amount:
                      support === "FUNDING"
                        ? Number(
                            fundingAmount
                          ) || 0
                        : 0,
                    description:
                      collaborationMessage.trim() ||
                      undefined,
                  });

                return collaboration;
              }
            )
          );

        setCollaborations((prev) => [
          ...prev,
          ...createdCollaborations,
        ]);

        setSelectedSupports(
          createdCollaborations
            .map(
              (item) =>
                item.collaboration_type
            )
            .filter(
              (value): value is CollaborationType  =>
                !!value
            )
        );

        setSelectedCompany(
          selectedPartner.id
        );

        setFundingAmount(
          fundingAmount
        );

        setShowCollaborationModal(
          false
        );

        setCollaborationMessage("");

        alert(
          "Collaboration request submitted successfully."
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to submit collaboration request.";

        setCollaborationError(message);
        alert(message);
      } finally {
        setCreatingCollaboration(false);
      }
    };

  const openCollaborationModal = () => {
    if (!canRequestCollaboration) {
      setCollaborationError(
        "You do not have permission to request collaboration for this project."
      );
      return;
    }

    setCollaborationError("");
    setShowCollaborationModal(true);
  };

  /* ============================================================
     COLLABORATION DERIVED DATA
  ============================================================ */

  const latestCollaboration =
    collaborations.length > 0
      ? collaborations[
          collaborations.length - 1
        ]
      : null;

  const selectedPartner =
    industryPartners.find(
      (partner) =>
        partner.id === selectedCompany
    ) ?? null;

  const projectCollaborationRequested =
    collaborations.length > 0;

  const selectedPartnerCollaborations =
    selectedCompany
      ? collaborations.filter(
          (collaboration) =>
            collaboration.industry_partner_id ===
            selectedCompany
        )
      : [];

  const actualSupportTypes =
    Array.from(
      new Set(
        selectedPartnerCollaborations
          .map(
            (collaboration) =>
              collaboration.collaboration_type
          )
          .filter(
            (type): type is CollaborationType  =>
              !!type
          )
      )
    );

  const displayedSupports =
    actualSupportTypes.length > 0
      ? actualSupportTypes
      : selectedSupports;

  const totalFunding =
    selectedPartnerCollaborations.reduce(
      (total, collaboration) =>
        total +
        Number(
          collaboration.amount ?? 0
        ),
      0
    );

  const currentCollaborationStatus =
    selectedPartnerCollaborations.length > 0
      ? selectedPartnerCollaborations.some(
          (item) =>
            item.status === "COMPLETED"
        )
        ? "COMPLETED"
        : selectedPartnerCollaborations.some(
            (item) =>
              item.status === "ACCEPTED"
          )
        ? "ACCEPTED"
        : selectedPartnerCollaborations.some(
            (item) =>
              item.status === "UNDER_REVIEW"
          )
        ? "UNDER_REVIEW"
        : selectedPartnerCollaborations.every(
            (item) =>
              item.status === "REJECTED"
          )
        ? "REJECTED"
        : "REQUESTED"
      : "NOT REQUESTED";

  const supportReceived =
    selectedPartnerCollaborations.some(
      (item) =>
        item.status === "ACCEPTED" ||
        item.status === "COMPLETED"
    );

  /* ============================================================
     PROTOTYPE UPLOAD
  ============================================================ */

  const handlePrototypeUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (!canUploadPrototype) {
      setPrototypeError(
        "You do not have permission to upload a prototype for this project."
      );
      return;
    }

    const file =
      event.target.files?.[0];

    if (!file) return;

    try {
      setUploadingPrototype(true);
      setPrototypeError("");

      const result =
        await uploadProjectPrototype(
          projectId,
          file
        );

      setPrototypeFile(file);

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://127.0.0.1:8000";

      const fullPrototypeUrl =
        `${apiUrl}${result.prototype_url}`;

      setPrototypeUrl(
        fullPrototypeUrl
      );

      setProject((prev) =>
        prev
          ? {
              ...prev,
              prototype_name:
                result.prototype_name,
              prototype_url:
                result.prototype_url,
            }
          : prev
      );
    } catch (err) {
      setPrototypeError(
        err instanceof Error
          ? err.message
          : "Failed to upload prototype."
      );
    } finally {
      setUploadingPrototype(false);
    }
  };

  /* ============================================================
     HELPERS
  ============================================================ */

  const formattedStatus =
    project?.status
      ? project.status.replaceAll(
          "_",
          " "
        )
      : "Loading...";

  const formattedDeadline =
    project?.deadline
      ? new Date(
          project.deadline
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
      : "No deadline set";

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

        {/* PROJECT ERROR */}

        {projectError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {projectError}
          </div>
        )}

        {/* ================= PROJECT HEADER ================= */}

        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div className="max-w-3xl">

              <div className="mb-4 flex flex-wrap items-center gap-3">

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  {formattedStatus}
                </span>

                <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
                  {taskProgress}% Complete
                </span>

              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {loadingProject
                  ? "Loading project..."
                  : project?.title ??
                    "Project"}
              </h1>

              <p className="mt-3 text-base leading-7 text-slate-500">
                {project?.description ||
                  "No project description available."}
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
                {formattedDeadline}
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
                  {project?.description ||
                    "No project overview has been provided yet."}
                </p>

                {linkedProblem && (
                  <div className="mt-4 border-t border-slate-200 pt-4">

                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Linked Community Problem
                    </p>

                    <Link
                      href={`/university/problems/${linkedProblem.id}`}
                      className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-teal-700 hover:text-teal-800"
                    >
                      {linkedProblem.title}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                  </div>
                )}

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
                    {loadingAI
                      ? "Loading..."
                      : aiAnalysis?.affected_sector ||
                        aiAnalysis?.subcategory ||
                        linkedProblem?.category ||
                        "Not available"}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <p className="text-xs font-medium text-slate-500">
                    Expected Impact
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {aiAnalysis?.estimated_affected_people != null
                      ? `${aiAnalysis.estimated_affected_people}+ people`
                      : project?.expected_impact != null
                      ? `${project.expected_impact}+ people`
                      : "Not available"}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <p className="text-xs font-medium text-slate-500">
                    Prototype Readiness
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {taskProgress}%
                  </p>

                </div>

              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl bg-teal-50 p-4">

                <Lightbulb className="h-5 w-5 shrink-0 text-teal-700" />

                <p className="text-sm leading-6 text-teal-900">
                  {aiAnalysis?.ai_summary ||
                    aiAnalysis?.root_cause ||
                    "AI analysis is not available for this project yet."}
                </p>

              </div>

            </section>

            {/* ================= PROJECT TASKS ================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Project Tasks
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Track the team&apos;s development progress.
                  </p>

                </div>

                <div className="flex items-center gap-3">

                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                    {completedCount}/{tasks.length} Done
                  </span>

                  {canCreateTask && (
                    <button
                      type="button"
                      onClick={() => {
                        setTaskError("");
                        setShowTaskModal(true);
                      }}
                      className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800"
                    >
                      + Add Task
                    </button>
                  )}

                </div>

              </div>

              {taskError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {taskError}
                </div>
              )}

              {loadingTasks ? (

                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                  Loading project tasks...
                </div>

              ) : tasks.length === 0 ? (

                <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

                  <p className="text-sm font-semibold text-slate-700">
                    No tasks created yet.
                  </p>

                  {canCreateTask && (
                    <p className="mt-1 text-xs text-slate-500">
                      Add tasks and assign them to your project team.
                    </p>
                  )}

                </div>

              ) : (

                <div className="mt-5 space-y-3">

                  {tasks.map((task) => {

                    const completed =
                      task.status === "COMPLETED";

                    const assignedMember =
                      teamMembers.find(
                        (member) =>
                          member.user_id ===
                          task.assigned_to
                      );

                    const canEditThisTask =
                      canUpdateTask(task);

                    return (
                      <div
                        key={task.id}
                        className="rounded-xl border border-slate-200 p-4"
                      >

                        <div className="flex items-start gap-3">

                          {canEditThisTask ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleTask(task)
                              }
                              className="mt-0.5 shrink-0"
                              aria-label={
                                completed
                                  ? "Mark task as pending"
                                  : "Mark task as completed"
                              }
                            >

                              <div
                                className={
                                  completed
                                    ? "flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100"
                                    : "flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-300"
                                }
                              >

                                {completed && (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                )}

                              </div>

                            </button>
                          ) : (
                            <div
                              className={
                                completed
                                  ? "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100"
                                  : "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-slate-200"
                              }
                            >
                              {completed && (
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                              )}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">

                            <p
                              className={
                                completed
                                  ? "text-sm font-semibold text-slate-500 line-through"
                                  : "text-sm font-semibold text-slate-900"
                              }
                            >
                              {task.title}
                            </p>

                            {task.description && (
                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                {task.description}
                              </p>
                            )}

                            <div className="mt-3 flex flex-wrap items-center gap-2">

                              <span
                                className={
                                  task.status ===
                                  "COMPLETED"
                                    ? "rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700"
                                    : task.status ===
                                      "IN_PROGRESS"
                                    ? "rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700"
                                    : "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600"
                                }
                              >
                                {task.status ===
                                "IN_PROGRESS"
                                  ? "In Progress"
                                  : task.status ===
                                    "COMPLETED"
                                  ? "Completed"
                                  : "Pending"}
                              </span>

                              {assignedMember && (
                                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700">
                                  Assigned to{" "}
                                  {assignedMember.name}
                                </span>
                              )}

                              {!canEditThisTask &&
                                (
                                  (isStudent || isFaculty) &&
                                  task.assigned_to !== currentUserId
                                ) && (
                                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                                    View only
                                  </span>
                                )}

                            </div>

                          </div>

                        </div>

                      </div>
                    );
                  })}

                </div>

              )}

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
                      {project?.prototype_name ||
                        "No prototype uploaded yet"}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">

                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                        Prototype
                      </span>

                      {prototypeFile && (
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                          Uploaded
                        </span>
                      )}

                    </div>

                  </div>

                  {(prototypeUrl ||
                    project?.prototype_url) && (

                    <a
                      href={
                        prototypeUrl ||
                        `${process.env.NEXT_PUBLIC_API_URL}${project?.prototype_url}`
                      }
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
                    Uploaded file:{" "}
                    {prototypeFile.name}
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
                  {taskProgress}%
                </span>

              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-teal-600 transition-all duration-500"
                  style={{
                    width: `${taskProgress}%`,
                  }}
                />

              </div>

              <p className="mt-3 text-sm text-slate-500">
                Progress is calculated from completed project tasks.
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

                {loadingTeam ? (

                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                    Loading team members...
                  </div>

                ) : teamMembers.length === 0 ? (

                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                    No team members added yet.
                  </div>

                ) : (

                  teamMembers.map((member) => (

                    <div
                      key={member.user_id}
                      className="flex items-center gap-3"
                    >

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
                        {member.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <p className="text-sm font-bold text-slate-900">
                          {member.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {member.role}

                          {member.project_role
                            ? ` • ${member.project_role}`
                            : ""}
                        </p>

                      </div>

                    </div>

                  ))

                )}

              </div>

              {canManageTeam && (
                <Link
                  href="/university/teams"
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                >
                  Manage Team
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}

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
                    {project?.budget != null
                      ? `₹${Number(
                          project.budget
                        ).toLocaleString(
                          "en-IN"
                        )}`
                      : "Not specified"}
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
                    {project?.expected_impact != null
                      ? `${project.expected_impact}+`
                      : aiAnalysis?.estimated_affected_people != null
                      ? `${aiAnalysis.estimated_affected_people}+`
                      : "Not specified"}
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
                projectCollaborationRequested
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
                    projectCollaborationRequested
                      ? "shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700"
                      : "shrink-0 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600"
                  }
                >
                  {projectCollaborationRequested
                    ? currentCollaborationStatus
                    : "Not Requested"}
                </span>

              </div>

              {collaborationError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {collaborationError}
                </div>
              )}

              {/* Collaboration Details */}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <p className="text-xs font-medium text-slate-500">
                    Current Partner
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {selectedPartner?.name ||
                      "No industry partner yet"}
                  </p>

                  {selectedPartner?.industry_type && (
                    <p className="mt-1 text-xs text-slate-500">
                      {formatLabel(
                        selectedPartner.industry_type
                      )}
                    </p>
                  )}

                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <p className="text-xs font-medium text-slate-500">
                    Support Received
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {supportReceived
                      ? "Support received"
                      : projectCollaborationRequested
                      ? "Request under review"
                      : "No support received"}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <p className="text-xs font-medium text-slate-500">
                    Funding
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">

                    {totalFunding > 0
                      ? `₹${totalFunding.toLocaleString(
                          "en-IN"
                        )}`
                      : projectCollaborationRequested
                      ? "No funding requested"
                      : "₹0"}

                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <p className="text-xs font-medium text-slate-500">
                    Collaboration Status
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {projectCollaborationRequested
                      ? currentCollaborationStatus
                      : "Not Requested"}
                  </p>

                </div>

              </div>

              {/* Requested Support */}

              {projectCollaborationRequested &&
                displayedSupports.length > 0 && (
                  <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                      Support Requested
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      {displayedSupports.map(
                        (support) => (
                          <span
                            key={support}
                            className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-emerald-700"
                          >
                            {formatLabel(
                              support
                            )}
                          </span>
                        )
                      )}

                    </div>

                  </div>
                )}

              {/* Actions */}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">

                <Link
                  href="/university/industry"
                  className="flex items-center justify-center gap-2 rounded-xl border border-teal-300 px-4 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-50"
                >
                  <Building2 className="h-4 w-4" />
                  Find Industry Partners
                </Link>

                {projectCollaborationRequested &&
                latestCollaboration ? (

                  <Link
                    href={`/university/projects/${projectId}/collaboration/${latestCollaboration.id}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    View Collaboration
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                ) : (

                  canRequestCollaboration && (
                    <button
                      type="button"
                      onClick={
                        openCollaborationModal
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
                    >
                      <Handshake className="h-4 w-4" />
                      Request Support
                    </button>
                  )

                )}

              </div>

            </section>

            {/* UPLOAD PROTOTYPE */}

            {canUploadPrototype && (
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

                {prototypeError && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {prototypeError}
                  </div>
                )}

                <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-teal-400 hover:bg-teal-50/40">

                  <Upload className="h-7 w-7 text-slate-400" />

                  <p className="mt-3 text-sm font-bold text-slate-700">
                    {uploadingPrototype
                      ? "Uploading prototype..."
                      : "Click to upload prototype"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    ZIP, APK, PDF or project files
                  </p>

                  <input
                    type="file"
                    className="hidden"
                    disabled={
                      uploadingPrototype
                    }
                    onChange={
                      handlePrototypeUpload
                    }
                  />

                </label>

              </section>
            )}

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

      {/* ================= ADD TASK MODAL ================= */}

      {showTaskModal && canCreateTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">

          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">

            <div className="border-b border-slate-200 p-6">

              <h2 className="text-xl font-black text-slate-900">
                Add Project Task
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Create a task and assign it to a project team member.
              </p>

            </div>

            <div className="space-y-5 p-6">

              {taskError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {taskError}
                </div>
              )}

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-800">
                  Task Title
                </label>

                <input
                  type="text"
                  value={taskTitle}
                  onChange={(event) =>
                    setTaskTitle(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Develop sensor monitoring module"
                  disabled={creatingTask}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-800">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={taskDescription}
                  onChange={(event) =>
                    setTaskDescription(
                      event.target.value
                    )
                  }
                  placeholder="Describe what needs to be completed..."
                  disabled={creatingTask}
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-800">
                  Assign To
                </label>

                {loadingTeam ? (

                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    Loading team members...
                  </div>

                ) : teamMembers.length === 0 ? (

                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                    No project team members available.
                  </div>

                ) : (

                  <select
                    value={taskAssignee}
                    onChange={(event) =>
                      setTaskAssignee(
                        event.target.value
                      )
                    }
                    disabled={creatingTask}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >

                    <option value="">
                      Select team member
                    </option>

                    {teamMembers.map(
                      (member) => (
                        <option
                          key={
                            member.user_id
                          }
                          value={
                            member.user_id
                          }
                        >
                          {member.name} —{" "}
                          {member.role}
                        </option>
                      )
                    )}

                  </select>

                )}

              </div>

              <div>

                <label className="mb-2 block text-sm font-bold text-slate-800">
                  Initial Status
                </label>

                <select
                  value={taskStatus}
                  onChange={(event) =>
                    setTaskStatus(
                      event.target.value as
                        | "PENDING"
                        | "IN_PROGRESS"
                        | "COMPLETED"
                    )
                  }
                  disabled={creatingTask}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                >

                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>

                </select>

              </div>

            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 p-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => {
                  setShowTaskModal(false);
                  setTaskError("");
                }}
                disabled={creatingTask}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleCreateTask
                }
                disabled={
                  creatingTask ||
                  !taskTitle.trim()
                }
                className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creatingTask
                  ? "Creating..."
                  : "Create Task"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================= COLLABORATION REQUEST MODAL ================= */}

      {showCollaborationModal &&
        canRequestCollaboration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">

            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

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
                  onClick={() =>
                    setShowCollaborationModal(
                      false
                    )
                  }
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close"
                >
                  ✕
                </button>

              </div>

              <div className="space-y-6 p-6">

                <div>

                  <label className="text-sm font-bold text-slate-800">
                    Project
                  </label>

                  <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                    <p className="text-sm font-bold text-slate-900">
                      {project?.title ??
                        "Current Project"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      University Innovation Project
                    </p>

                  </div>

                </div>

                <div>

                  <label className="text-sm font-bold text-slate-800">
                    Industry Company
                  </label>

                  {loadingIndustryPartners ? (

                    <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                      Loading industry partners...
                    </div>

                  ) : industryPartners.length === 0 ? (

                    <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                      No industry partners available.
                    </div>

                  ) : (

                    <select
                      value={selectedCompany}
                      onChange={(event) =>
                        setSelectedCompany(
                          event.target.value
                        )
                      }
                      disabled={
                        creatingCollaboration
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    >

                      <option value="">
                        Select an industry partner
                      </option>

                      {industryPartners.map(
                        (partner) => (
                          <option
                            key={partner.id}
                            value={partner.id}
                          >
                            {partner.name}
                          </option>
                        )
                      )}

                    </select>

                  )}

                </div>

                <div>

                  <label className="text-sm font-bold text-slate-800">
                    Support Required
                  </label>

                  <p className="mt-1 text-xs text-slate-500">
                    Select one or more types of support your project needs.
                  </p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">

                    {supportOptions.map(
                      (support) => {

                        const checked =
                          selectedSupports.includes(
                            support
                          );

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
                                toggleSupport(
                                  support
                                )
                              }
                              disabled={
                                creatingCollaboration
                              }
                              className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-500"
                            />

                            <span className="text-sm font-semibold text-slate-700">
                              {formatLabel(
                                support
                              )}
                            </span>

                          </label>
                        );
                      }
                    )}

                  </div>

                </div>

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
                        setFundingAmount(
                          event.target.value
                        )
                      }
                      placeholder="Enter estimated amount"
                      disabled={
                        creatingCollaboration
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />

                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    This amount is recorded only for the Funding collaboration.
                  </p>

                </div>

                <div>

                  <label className="text-sm font-bold text-slate-800">
                    Message
                  </label>

                  <textarea
                    rows={5}
                    value={collaborationMessage}
                    onChange={(event) =>
                      setCollaborationMessage(
                        event.target.value
                      )
                    }
                    placeholder="Explain what support your team needs and how the industry partner can contribute..."
                    disabled={
                      creatingCollaboration
                    }
                    className="mt-2 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />

                </div>

              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 p-6 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setShowCollaborationModal(
                      false
                    )
                  }
                  disabled={
                    creatingCollaboration
                  }
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleRequestCollaboration
                  }
                  disabled={
                    creatingCollaboration ||
                    loadingIndustryPartners
                  }
                  className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingCollaboration
                    ? "Sending..."
                    : "Send Collaboration Request"}
                </button>

              </div>

            </div>

          </div>
        )}

    </main>
  );
}

