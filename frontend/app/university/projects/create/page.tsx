"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  FolderKanban,
  Plus,
  Users,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  apiRequest,
  getAuthToken,
} from "@/lib/api/client";

import {
  getMyUniversityProblems,
  getMyUniversityId,
  type UniversityProblem,
} from "@/lib/api/universities";

import {
  getSolutions,
  type Solution,
} from "@/lib/api/solutions";

import {
  getUniversityMembers,
  type UniversityMember,
} from "@/lib/api/users";

import { getCurrentUser } from "@/lib/api/auth";

import type { Project as ApiProject } from "@/lib/api/projects";

export default function CreateUniversityProject() {
  const router = useRouter();

  const [problems, setProblems] = useState<UniversityProblem[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [members, setMembers] = useState<UniversityMember[]>([]);

  const [loadingProblems, setLoadingProblems] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);

  // ================= RBAC =================

  const [checkingAccess, setCheckingAccess] = useState(true);

  // ================= FORM =================

  const [projectTitle, setProjectTitle] = useState("");
  const [projectProblem, setProjectProblem] = useState("");
  const [projectSolution, setProjectSolution] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // ================= CHECK ROLE + LOAD DATA =================

  useEffect(() => {
    async function loadData() {
      try {
        setCheckingAccess(true);
        setLoadingProblems(true);
        setLoadingMembers(true);
        setError("");

        // ================= CURRENT USER =================

        const currentUser = await getCurrentUser();

        // Only University and Faculty can create projects.
        if (
          currentUser.role !== "university" &&
          currentUser.role !== "faculty"
        ) {
          router.replace("/university/projects");
          return;
        }

        // ================= LOAD PROJECT DATA =================

        const [
          problemData,
          universityId,
          solutionData,
          memberData,
        ] = await Promise.all([
          getMyUniversityProblems(),
          getMyUniversityId(),
          getSolutions(),
          getUniversityMembers(),
        ]);

        setProblems(problemData);

        const universitySolutions =
          solutionData.filter(
            (solution) =>
              solution.university_id === universityId
          );

        setSolutions(universitySolutions);

        setMembers(memberData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load project data."
        );
      } finally {
        setCheckingAccess(false);
        setLoadingProblems(false);
        setLoadingMembers(false);
      }
    }

    loadData();
  }, [router]);

  // ================= FILTER SOLUTIONS =================

  const availableSolutions = solutions.filter(
    (solution) =>
      solution.problem_id === projectProblem
  );

  // ================= SELECTED PROBLEM =================

  const selectedProblem = problems.find(
    (problem) =>
      problem.id === projectProblem
  );

  // ================= SELECTED SOLUTION =================

  const selectedSolution = availableSolutions.find(
    (solution) =>
      solution.id === projectSolution
  );

  // ================= PROBLEM CHANGE =================

  function handleProblemChange(problemId: string) {
    setProjectProblem(problemId);

    // Solution belongs to the selected problem,
    // so reset it when problem changes.
    setProjectSolution("");

    setError("");
  }

  // ================= MEMBER SELECT =================

  function toggleMember(memberId: string) {
    setSelectedMembers((current) => {
      if (current.includes(memberId)) {
        return current.filter(
          (id) => id !== memberId
        );
      }

      return [...current, memberId];
    });

    setError("");
  }

  // ================= CREATE PROJECT =================

  async function handleCreateProject() {
    // Frontend RBAC protection
    const currentUser = await getCurrentUser();

    if (
      currentUser.role !== "university" &&
      currentUser.role !== "faculty"
    ) {
      setError(
        "You do not have permission to create a project."
      );
      return;
    }

    if (
      !projectTitle.trim() ||
      !projectProblem ||
      !projectSolution ||
      !projectDescription.trim()
    ) {
      setError(
        "Please fill all required fields."
      );
      return;
    }

    if (selectedMembers.length === 0) {
      setError(
        "Please select at least one team member."
      );
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setError("Please login first.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      // ================= CREATE PROJECT =================

      const project =
        await apiRequest<ApiProject>(
          "/api/projects",
          {
            method: "POST",
            token,
            body: JSON.stringify({
              title: projectTitle.trim(),

              problem_id: projectProblem,

              solution_id: projectSolution,

              description:
                projectDescription.trim(),

              // New projects always start in IDEA.
              status: "IDEA",

              deadline: deadline
                ? new Date(
                    `${deadline}T23:59:59`
                  ).toISOString()
                : null,

              // Progress is initially 0.
              // Later project progress is based
              // on completed project tasks.
              progress: 0,

              budget: budget
                ? Number(budget)
                : null,
            }),
          }
        );

      // ================= ADD TEAM MEMBERS =================

      for (const memberId of selectedMembers) {
        await apiRequest(
          "/api/project-members",
          {
            method: "POST",
            token,
            body: JSON.stringify({
              project_id: project.id,

              user_id: memberId,

              role:
                members.find(
                  (member) =>
                    member.id === memberId
                )?.role || "STUDENT",
            }),
          }
        );
      }

      // ================= SUCCESS =================

      router.push("/university/projects");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create project."
      );
    } finally {
      setCreating(false);
    }
  }

  // ================= ACCESS CHECK LOADING =================

  if (checkingAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm font-medium text-slate-600 shadow-sm">
          Checking access...
        </div>
      </main>
    );
  }

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

        </div>
      </nav>

      {/* ================= MAIN ================= */}

      <section className="mx-auto max-w-3xl px-6 py-8">

        {/* Back */}

        <a
          href="/university/projects"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </a>

        {/* Header */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100">
              <FolderKanban className="h-6 w-6 text-teal-700" />
            </div>

            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                Create Project
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Create a university project around a real community problem.
              </p>
            </div>

          </div>

          {/* Error */}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* ================= FORM ================= */}

          <div className="mt-7 space-y-6">

            {/* Project Name */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Project Name{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={projectTitle}
                onChange={(e) =>
                  setProjectTitle(
                    e.target.value
                  )
                }
                placeholder="Enter project name"
                disabled={creating}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
              />

            </div>

            {/* Community Problem */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Community Problem{" "}
                <span className="text-red-500">*</span>
              </label>

              {loadingProblems ? (

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  Loading community problems...
                </div>

              ) : problems.length === 0 ? (

                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  No community problems are available for your university.
                </div>

              ) : (

                <select
                  value={projectProblem}
                  onChange={(e) =>
                    handleProblemChange(
                      e.target.value
                    )
                  }
                  disabled={creating}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                >
                  <option value="">
                    Select a community problem
                  </option>

                  {problems.map(
                    (problem) => (
                      <option
                        key={problem.id}
                        value={problem.id}
                      >
                        {problem.title}
                      </option>
                    )
                  )}
                </select>

              )}

            </div>

            {/* Selected Problem */}

            {selectedProblem && (
              <div className="rounded-xl border border-teal-100 bg-teal-50 p-4">

                <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                  Selected Problem
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {selectedProblem.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {selectedProblem.district}
                </p>

              </div>
            )}

            {/* Proposed Solution */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Proposed Solution{" "}
                <span className="text-red-500">*</span>
              </label>

              {!projectProblem ? (

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  Select a community problem first.
                </div>

              ) : availableSolutions.length === 0 ? (

                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  No solution is available for this problem from your university. Please create a solution first.
                </div>

              ) : (

                <select
                  value={projectSolution}
                  onChange={(e) =>
                    setProjectSolution(
                      e.target.value
                    )
                  }
                  disabled={creating}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                >

                  <option value="">
                    Select a proposed solution
                  </option>

                  {availableSolutions.map(
                    (solution) => (
                      <option
                        key={solution.id}
                        value={solution.id}
                      >
                        {solution.solution_title}
                      </option>
                    )
                  )}

                </select>

              )}

            </div>

            {/* Selected Solution */}

            {selectedSolution && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                  Selected Solution
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {selectedSolution.solution_title}
                </p>

                {selectedSolution.prototype_status && (
                  <p className="mt-1 text-xs text-slate-500">
                    Prototype Status:{" "}
                    {selectedSolution.prototype_status}
                  </p>
                )}

                {selectedSolution.estimated_cost && (
                  <p className="mt-1 text-xs text-slate-500">
                    Estimated Cost: ₹
                    {Number(
                      selectedSolution.estimated_cost
                    ).toLocaleString("en-IN")}
                  </p>
                )}

              </div>
            )}

            {/* Project Description */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Project Description{" "}
                <span className="text-red-500">*</span>
              </label>

              <textarea
                value={projectDescription}
                onChange={(e) =>
                  setProjectDescription(
                    e.target.value
                  )
                }
                placeholder="Describe how this project will implement the selected solution"
                rows={5}
                disabled={creating}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
              />

            </div>

            {/* Deadline */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Project Deadline
              </label>

              <div className="relative">

                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="date"
                  value={deadline}
                  onChange={(e) =>
                    setDeadline(
                      e.target.value
                    )
                  }
                  disabled={creating}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                />

              </div>

              <p className="mt-1 text-xs text-slate-400">
                You can leave this empty if the deadline is not decided yet.
              </p>

            </div>

            {/* ================= PROJECT BUDGET ================= */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Project Budget
              </label>

              <div className="relative">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={budget}
                  onChange={(e) =>
                    setBudget(e.target.value)
                  }
                  placeholder="Enter estimated project budget"
                  disabled={creating}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                />

              </div>

              <p className="mt-1 text-xs text-slate-400">
                Enter the estimated amount required for this project.
              </p>

            </div>

            {/* ================= TEAM MEMBERS ================= */}

            <div>

              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

                <Users className="h-4 w-4 text-teal-700" />

                Team Members{" "}
                <span className="text-red-500">*</span>

              </label>

              {loadingMembers ? (

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  Loading team members...
                </div>

              ) : members.length === 0 ? (

                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  No Student or Faculty members are available in your university.
                </div>

              ) : (

                <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">

                  {members.map(
                    (member) => {
                      const selected =
                        selectedMembers.includes(
                          member.id
                        );

                      return (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() =>
                            toggleMember(
                              member.id
                            )
                          }
                          disabled={creating}
                          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                            selected
                              ? "border-teal-300 bg-teal-50"
                              : "border-slate-200 bg-white hover:border-teal-200 hover:bg-white"
                          } disabled:cursor-not-allowed disabled:opacity-60`}
                        >

                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-slate-800">
                              {member.full_name}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                              {member.email}
                            </p>

                            <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                              {member.role}
                            </span>

                          </div>

                          <div
                            className={`ml-4 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                              selected
                                ? "border-teal-600 bg-teal-600 text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >

                            {selected && (
                              <Check className="h-3.5 w-3.5" />
                            )}

                          </div>

                        </button>
                      );
                    }
                  )}

                </div>

              )}

              {selectedMembers.length > 0 && (
                <p className="mt-2 text-xs font-medium text-teal-700">
                  {selectedMembers.length} team member
                  {selectedMembers.length !== 1
                    ? "s"
                    : ""}{" "}
                  selected
                </p>
              )}

            </div>

          </div>

          {/* ================= BUTTONS ================= */}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">

            <a
              href="/university/projects"
              className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </a>

            <button
              type="button"
              onClick={handleCreateProject}
              disabled={
                creating ||
                loadingProblems ||
                loadingMembers ||
                !projectTitle.trim() ||
                !projectProblem ||
                !projectSolution ||
                !projectDescription.trim() ||
                availableSolutions.length === 0 ||
                selectedMembers.length === 0
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <Plus className="h-4 w-4" />

              {creating
                ? "Creating..."
                : "Create Project"}

            </button>

          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            New projects start with 0% progress and can be updated as work progresses.
          </p>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="bg-slate-950 px-6 py-8 text-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold">
              S
            </div>

            <div>

              <p className="font-bold">
                SamadhanX
              </p>

              <p className="text-xs text-slate-400">
                Ideas → Action → Impact
              </p>

            </div>

          </div>

          <p className="text-sm text-slate-400">
            © 2026 SamadhanX. Building solutions that matter.
          </p>

        </div>

      </footer>

    </main>
  );
}