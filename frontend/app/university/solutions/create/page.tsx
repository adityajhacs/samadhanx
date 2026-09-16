
"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  Loader2,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  createSolution,
  type Solution,
} from "@/lib/api/solutions";

import {
  getMyUniversityId,
  getMyUniversityProblems,
  type UniversityProblem,
} from "@/lib/api/universities";

import { getAuthToken } from "@/lib/api/client";

type PrototypeStatus =
  | "IDEA"
  | "DESIGN"
  | "PROTOTYPE"
  | "FIELD_TEST"
  | "DEPLOYED";

const DETAILED_STATUSES: PrototypeStatus[] = [
  "DESIGN",
  "PROTOTYPE",
  "FIELD_TEST",
  "DEPLOYED",
];

const STATUS_LABELS: Record<PrototypeStatus, string> = {
  IDEA: "Idea",
  DESIGN: "Design",
  PROTOTYPE: "Prototype",
  FIELD_TEST: "Field Test",
  DEPLOYED: "Deployed",
};

export default function CreateUniversitySolution() {
  const router = useRouter();

  // =========================
  // DATA
  // =========================

  const [problems, setProblems] = useState<UniversityProblem[]>([]);
  const [universityId, setUniversityId] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // FORM
  // =========================

  const [solutionTitle, setSolutionTitle] = useState("");
  const [problemId, setProblemId] = useState("");
  const [description, setDescription] = useState("");

  const [prototypeStatus, setPrototypeStatus] =
    useState<PrototypeStatus>("IDEA");

  const [estimatedCost, setEstimatedCost] = useState("");

  // Detailed fields
  const [prototypeDescription, setPrototypeDescription] =
    useState("");

  const [howItWorks, setHowItWorks] = useState("");

  const [keyFeatures, setKeyFeatures] = useState("");

  const [problemSolution, setProblemSolution] = useState("");

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const token = getAuthToken();

        if (!token) {
          setError("Please login first.");
          return;
        }

        const [problemData, universityData] =
          await Promise.all([
            getMyUniversityProblems(),
            getMyUniversityId(),
          ]);

        setProblems(problemData);
        setUniversityId(universityData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load solution form data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // =========================
  // SELECTED PROBLEM
  // =========================

  const selectedProblem = problems.find(
    (problem) => problem.id === problemId
  );

  // =========================
  // STATUS HELPERS
  // =========================

  const requiresDetailedFields =
    DETAILED_STATUSES.includes(prototypeStatus);

  function handleStatusChange(
    status: PrototypeStatus
  ) {
    setPrototypeStatus(status);
    setError("");

    /*
     * If user goes back to IDEA,
     * detailed information is not required.
     *
     * We intentionally do NOT delete the entered values.
     * So if user changes IDEA -> PROTOTYPE again,
     * their previous information is still there.
     */
  }

  // =========================
  // VALIDATION
  // =========================

  function validateForm(): string | null {
    if (!solutionTitle.trim()) {
      return "Solution title is required.";
    }

    if (!problemId) {
      return "Please select a community problem.";
    }

    if (!description.trim()) {
      return "Solution description is required.";
    }

    if (!estimatedCost.trim()) {
      return "Estimated cost is required.";
    }

    const cost = Number(estimatedCost);

    if (Number.isNaN(cost)) {
      return "Estimated cost must be a valid number.";
    }

    if (cost < 0) {
      return "Estimated cost cannot be negative.";
    }

    if (requiresDetailedFields) {
      if (!prototypeDescription.trim()) {
        return "What the Prototype Does is required for this status.";
      }

      if (!howItWorks.trim()) {
        return "How It Works is required for this status.";
      }

      if (!keyFeatures.trim()) {
        return "Key Features are required for this status.";
      }

      if (!problemSolution.trim()) {
        return "How This Solution Solves the Problem is required for this status.";
      }
    }

    return null;
  }

  // =========================
  // CREATE SOLUTION
  // =========================

  async function handleCreateSolution(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!universityId) {
      setError(
        "University information is not available. Please login again."
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

      const payload = {
        problem_id: problemId,
        university_id: universityId,
        project_id: null,

        solution_title: solutionTitle.trim(),

        description: description.trim(),

        prototype_status: prototypeStatus,

        estimated_cost: Number(estimatedCost),

        /*
         * Detailed fields are sent only when they are
         * applicable to the selected prototype status.
         */
        prototype_description:
          requiresDetailedFields
            ? prototypeDescription.trim()
            : null,

        how_it_works:
          requiresDetailedFields
            ? howItWorks.trim()
            : null,

        key_features:
          requiresDetailedFields
            ? keyFeatures.trim()
            : null,

        problem_solution:
          requiresDetailedFields
            ? problemSolution.trim()
            : null,

        funding_received: 0,
      };

      const createdSolution =
        await createSolution(payload);

      setSuccess(
        "Solution created successfully."
      );

      /*
       * Give the user a short success indication,
       * then open the real backend-created solution.
       */
      setTimeout(() => {
        router.push(
          `/university/solutions/${createdSolution.id}`
        );
      }, 700);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create solution."
      );
    } finally {
      setCreating(false);
    }
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <nav className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
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

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
            Loading solution form...
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* =========================
          NAVBAR
      ========================== */}

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

          <div className="hidden items-center gap-6 text-sm md:flex">
            <a
              href="/university/dashboard"
              className="font-medium text-slate-600 transition hover:text-teal-700"
            >
              Dashboard
            </a>

            <a
              href="/university/problems"
              className="font-medium text-slate-600 transition hover:text-teal-700"
            >
              Problems
            </a>

            <a
              href="/university/projects"
              className="font-medium text-slate-600 transition hover:text-teal-700"
            >
              Projects
            </a>

            <a
              href="/university/solutions"
              className="font-semibold text-teal-700"
            >
              Solutions
            </a>

            <a
              href="/university/teams"
              className="font-medium text-slate-600 transition hover:text-teal-700"
            >
              Teams
            </a>

            <a
              href="/university/profile"
              className="font-medium text-slate-600 transition hover:text-teal-700"
            >
              Profile
            </a>
          </div>
        </div>
      </nav>

      {/* =========================
          MAIN
      ========================== */}

      <section className="mx-auto max-w-4xl px-6 py-8">
        {/* Back */}

        <a
          href="/university/solutions"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Solutions
        </a>

        {/* Header */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100">
              <Lightbulb className="h-6 w-6 text-teal-700" />
            </div>

            <div>
              <p className="text-sm font-semibold text-teal-700">
                University Innovation
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                Create a Solution
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Propose a solution for a community problem.
                Detailed prototype information becomes required
                as the solution moves beyond the idea stage.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Success */}

        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            {success}
          </div>
        )}

        {/* Form */}

        <form
          onSubmit={handleCreateSolution}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="space-y-8 p-6 md:p-8">
            {/* =========================
                BASIC INFORMATION
            ========================== */}

            <div>
              <div className="mb-5">
                <h3 className="text-lg font-bold text-slate-900">
                  Basic Information
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Start with the problem and your proposed solution.
                </p>
              </div>

              <div className="space-y-5">
                {/* Solution Title */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Solution Title{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    value={solutionTitle}
                    onChange={(e) =>
                      setSolutionTitle(e.target.value)
                    }
                    placeholder="e.g. Smart Water Monitoring System"
                    disabled={creating}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                  />
                </div>

                {/* Problem */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Related Community Problem{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  {problems.length === 0 ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                      No community problems are currently
                      available for your university.
                    </div>
                  ) : (
                    <select
                      value={problemId}
                      onChange={(e) =>
                        setProblemId(e.target.value)
                      }
                      disabled={creating}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                    >
                      <option value="">
                        Select a community problem
                      </option>

                      {problems.map((problem) => (
                        <option
                          key={problem.id}
                          value={problem.id}
                        >
                          {problem.title}
                        </option>
                      ))}
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

                    {selectedProblem.district && (
                      <p className="mt-1 text-xs text-slate-500">
                        District: {selectedProblem.district}
                      </p>
                    )}

                    {selectedProblem.category && (
                      <p className="mt-1 text-xs text-slate-500">
                        Category: {selectedProblem.category}
                      </p>
                    )}
                  </div>
                )}

                {/* Description */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Solution Description{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Describe your proposed solution and what makes it suitable for the selected problem."
                    rows={5}
                    disabled={creating}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                  />
                </div>

                {/* Cost */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Estimated Cost (₹){" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={estimatedCost}
                    onChange={(e) =>
                      setEstimatedCost(e.target.value)
                    }
                    placeholder="e.g. 50000"
                    disabled={creating}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}

            <div className="border-t border-slate-200" />

            {/* =========================
                PROTOTYPE STATUS
            ========================== */}

            <div>
              <div className="mb-5">
                <h3 className="text-lg font-bold text-slate-900">
                  Prototype Status
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Choose the current stage of your proposed solution.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {(
                  Object.keys(
                    STATUS_LABELS
                  ) as PrototypeStatus[]
                ).map((status) => {
                  const active =
                    prototypeStatus === status;

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        handleStatusChange(status)
                      }
                      disabled={creating}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        active
                          ? "border-teal-600 bg-teal-50 text-teal-700 ring-2 ring-teal-100"
                          : "border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-700"
                      }`}
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Current Stage
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {STATUS_LABELS[prototypeStatus]}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {prototypeStatus === "IDEA"
                    ? "At the idea stage, only the basic solution information is required."
                    : "Detailed prototype information is required for this stage."}
                </p>
              </div>
            </div>

            {/* =========================
                DETAILED PROTOTYPE INFO
            ========================== */}

            {requiresDetailedFields && (
              <>
                <div className="border-t border-slate-200" />

                <div>
                  <div className="mb-5">
                    <h3 className="text-lg font-bold text-slate-900">
                      Prototype & Implementation Details
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      These details are required because the
                      solution is beyond the idea stage.
                    </p>
                  </div>

                  <div className="space-y-5">
                    {/* What Prototype Does */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        What the Prototype Does{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <textarea
                        value={prototypeDescription}
                        onChange={(e) =>
                          setPrototypeDescription(
                            e.target.value
                          )
                        }
                        placeholder="Explain what the prototype actually does."
                        rows={4}
                        disabled={creating}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                      />
                    </div>

                    {/* How It Works */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        How It Works{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <textarea
                        value={howItWorks}
                        onChange={(e) =>
                          setHowItWorks(e.target.value)
                        }
                        placeholder="Explain the working process of the solution step by step."
                        rows={5}
                        disabled={creating}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                      />
                    </div>

                    {/* Key Features */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Key Features{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <textarea
                        value={keyFeatures}
                        onChange={(e) =>
                          setKeyFeatures(e.target.value)
                        }
                        placeholder={
                          "Enter the major features.\nExample:\nReal-time monitoring\nAutomatic alerts\nMobile dashboard"
                        }
                        rows={5}
                        disabled={creating}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                      />

                      <p className="mt-2 text-xs text-slate-400">
                        You can enter multiple features on
                        separate lines.
                      </p>
                    </div>

                    {/* Problem Solution */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        How This Solution Solves the Problem{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <textarea
                        value={problemSolution}
                        onChange={(e) =>
                          setProblemSolution(
                            e.target.value
                          )
                        }
                        placeholder="Explain clearly how this solution addresses the selected community problem."
                        rows={5}
                        disabled={creating}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* =========================
                INFORMATION
            ========================== */}

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-800">
                Solution vs Project
              </p>

              <p className="mt-1 text-sm leading-6 text-blue-700">
                A Solution describes the proposed approach to
                solve a community problem. Team members, tasks,
                progress, deadlines and implementation are
                handled later through a Project.
              </p>
            </div>
          </div>

          {/* =========================
              ACTIONS
          ========================== */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end md:px-8">
            <button
              type="button"
              onClick={() =>
                router.push("/university/solutions")
              }
              disabled={creating}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={creating || problems.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create Solution
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* =========================
          FOOTER
      ========================== */}

      <footer className="mt-12 bg-slate-950 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-center">
          <p className="text-sm font-semibold text-white">
            SamadhanX
          </p>

          <p className="text-xs text-slate-400">
            Ideas → Action → Impact
          </p>
        </div>
      </footer>
    </main>
  );
}

