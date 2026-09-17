"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Lightbulb,
  MapPin,
  Sparkles,
  Users,
  X,
  Image as ImageIcon,
  Video,
} from "lucide-react";

import { getCurrentUser } from "@/lib/api/auth";

import {
  acceptUniversityProblem,
  getMyUniversityId,
  getUniversityProblem,
  rejectUniversityProblem,
  type UniversityProblem,
} from "@/lib/api/universities";
import Image from "next/image";

export default function UniversityProblemDetails() {
  const params = useParams();
  const problemId = params.id as string;

  const [problem, setProblem] = useState<UniversityProblem | null>(null);
  const [universityId, setUniversityId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);

  // =========================
  // LOAD PROBLEM
  // =========================
  const loadProblem = async () => {
    try {
      setLoading(true);
      setError("");

      const [user, currentUniversityId] = await Promise.all([
        getCurrentUser(),
        getMyUniversityId(),
      ]);

      const normalizedRole = (user.role || "").trim().toLowerCase();

      setUserRole(normalizedRole);
      setUniversityId(currentUniversityId);

      const data = await getUniversityProblem(
        currentUniversityId,
        problemId
      );

      setProblem(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load problem."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (problemId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadProblem();
    }
  }, [problemId]);

  // University + Faculty can manage the problem.
  // Student can only view.
  const canManageProblem =
    userRole === "university" || userRole === "faculty";

  // =========================
  // ACCEPT
  // =========================
  const handleAccept = async () => {
    if (!canManageProblem || !universityId || !problem) return;

    try {
      setActionLoading(true);
      setError("");

      await acceptUniversityProblem(
        universityId,
        problem.id
      );

      setShowConfirm(false);

      await loadProblem();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to accept problem."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // REJECT
  // =========================
  const handleReject = async () => {
    if (!canManageProblem || !universityId || !problem) return;

    try {
      setActionLoading(true);
      setError("");

      await rejectUniversityProblem(
        universityId,
        problem.id
      );

      await loadProblem();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reject problem."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-teal-200 border-t-teal-700" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading problem...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // ERROR / NOT FOUND
  // =========================
  if (error || !problem) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold">
            Unable to load problem
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            {error || "Problem not found."}
          </p>

          <Link
            href="/university/problems"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Problems
          </Link>
        </div>
      </main>
    );
  }

  // =========================
  // DERIVED DATA
  // =========================

  const severityScore = problem.severity_score ?? 0;

  const severity =
    severityScore >= 70
      ? "High"
      : severityScore >= 40
        ? "Medium"
        : "Low";

  const severityClass =
    severity === "High"
      ? "bg-red-50 text-red-600"
      : severity === "Medium"
        ? "bg-amber-50 text-amber-600"
        : "bg-emerald-50 text-emerald-700";

  const currentStatus =
    problem.status?.toUpperCase() || "PENDING";

  const accepted = currentStatus === "ACCEPTED";
  const rejected = currentStatus === "REJECTED";

  const location = problem.district
    ? `${problem.district}, Jharkhand`
    : "Jharkhand";

  const matchPercentage =
    problem.match_score != null
      ? Math.round(problem.match_score * 100)
      : 0;

  const matchReasons =
    problem.match_reasons?.length
      ? problem.match_reasons
      : [];

  const aiAnalysis = problem.ai_analysis;

  const aiSummary =
    aiAnalysis?.ai_summary ||
    problem.ai_summary ||
    "AI-generated summary is not available for this problem yet.";

  const affectedSector =
    aiAnalysis?.affected_sector ||
    problem.category ||
    "Community";

  const estimatedImpact =
    aiAnalysis?.estimated_affected_people != null
      ? `${aiAnalysis.estimated_affected_people}+ people`
      : "Community impact";

  const rootCause =
    aiAnalysis?.root_cause ||
    "AI analysis indicates that this challenge requires further field verification and domain-specific assessment.";

  const universityExpertise =
    problem.university_expertise?.length
      ? problem.university_expertise
      : [];

  const similarProblems =
    problem.similar_problems || [];

  // =========================
  // CITIZEN EVIDENCE
  // =========================
  const evidenceImage = (problem as UniversityProblem & {
    image_url?: string | null;
  }).image_url;

  const evidenceVideo = (problem as UniversityProblem & {
    video_url?: string | null;
  }).video_url;

  const hasEvidence =
    Boolean(evidenceImage) || Boolean(evidenceVideo);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= NAVBAR ================= */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <a
            href="/university/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">
              S
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                SamadhanX
              </h1>

              <p className="text-xs text-slate-500">
                Ideas → Action → Impact
              </p>
            </div>
          </a>

          {/* Right Navbar */}
          <div className="hidden items-center gap-7 md:flex">

            <a
              href="/university/dashboard"
              className="text-[15px] font-medium text-slate-600 transition hover:text-teal-600"
            >
              Dashboard
            </a>

            <Link
              href="/university/problems"
              className="text-[15px] font-semibold text-teal-600"
            >
              Problems
            </Link>

            <Link
              href="/university/projects"
              className="text-[15px] font-medium text-slate-600 transition hover:text-teal-600"
            >
              Projects
            </Link>

            <Link
              href="/university/solutions"
              className="text-[15px] font-medium text-slate-600 transition hover:text-teal-600"
            >
              Solutions
            </Link>

            <Link
              href="/university/teams"
              className="text-[15px] font-medium text-slate-600 transition hover:text-teal-600"
            >
              Teams
            </Link>

            <Link
              href="/university/profile"
              className="text-[15px] font-medium text-slate-600 transition hover:text-teal-600"
            >
              Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <section className="mx-auto max-w-7xl px-6 py-6">

        {/* Back */}
        <Link
          href="/university/problems"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Problems
        </Link>

        {/* ================= PROBLEM HEADER ================= */}
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-8">

          <div className="flex flex-wrap items-center gap-2">

            <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
              {problem.category || "Community Challenge"}
            </span>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${severityClass}`}
            >
              {severity} Severity
            </span>

            {accepted && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Accepted
              </span>
            )}

            {rejected && (
              <span className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                <X className="h-3.5 w-3.5" />
                Rejected
              </span>
            )}
          </div>

          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            {problem.title}
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-slate-500">

            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-teal-600" />
              {location}
            </span>

            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-teal-600" />
              {estimatedImpact}
            </span>

          </div>

          <p className="mt-6 max-w-5xl text-base leading-7 text-slate-600">
            {problem.description ||
              problem.ai_summary ||
              "This community challenge has been identified as relevant for university collaboration and solution development."}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* ================= TWO COLUMN ================= */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_330px]">

          {/* ================= LEFT ================= */}
          <div className="space-y-6">

          {hasEvidence && (
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="rounded-xl bg-teal-50 p-2 text-teal-700">
        <ImageIcon size={20} />
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
      {evidenceImage && (
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
            href={evidenceImage}
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
      {evidenceVideo && (
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
            href={evidenceVideo}
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

            {/* ================= AI ANALYSIS ================= */}
            <div className="rounded-2xl border border-teal-300 bg-teal-200 p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Bot className="h-6 w-6 text-teal-700" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    AI Analysis
                  </p>

                  <h3 className="text-xl font-bold text-slate-900">
                    Understanding the Challenge
                  </h3>
                </div>

              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                    AI Category
                  </p>

                  <p className="mt-2 font-semibold text-slate-900">
                    {aiAnalysis?.subcategory ||
                      problem.category ||
                      "Community Challenge"}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                    Severity
                  </p>

                  <p className="mt-2 font-semibold text-red-600">
                    {aiAnalysis?.severity_level ||
                      severity.toUpperCase()}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                    Affected Sector
                  </p>

                  <p className="mt-2 font-semibold text-slate-900">
                    {affectedSector}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                    Estimated Impact
                  </p>

                  <p className="mt-2 font-semibold text-slate-900">
                    {estimatedImpact}
                  </p>
                </div>

              </div>

              <div className="mt-4 rounded-xl bg-white p-5 shadow-sm">

                <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                  Root Cause
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {rootCause}
                </p>

              </div>

              <div className="mt-4 rounded-xl border border-teal-300 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-2">

                  <Sparkles className="h-5 w-5 text-teal-700" />

                  <p className="font-bold text-slate-900">
                    AI Summary
                  </p>

                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {aiSummary}
                </p>

              </div>

            </div>

            {/* ================= WHY AI RECOMMENDS ================= */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100">
                  <Lightbulb className="h-5 w-5 text-teal-700" />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                    AI Recommendation
                  </p>

                  <h3 className="text-xl font-bold">
                    Why AI Recommends This Problem
                  </h3>

                </div>

              </div>

              <div className="mt-5 rounded-xl border border-teal-200 bg-teal-100 p-5">

                <p className="text-sm leading-7 text-slate-700">
                  This problem received a{" "}
                  <span className="font-bold text-teal-800">
                    {matchPercentage}% university match
                  </span>{" "}
                  because the AI matching system found a relationship between
                  the problem requirements, the university&apos;s expertise,
                  and the semantic meaning of the problem.
                </p>

                {universityExpertise.length > 0 && (
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    The university&apos;s relevant expertise includes{" "}
                    <span className="font-semibold text-teal-800">
                      {universityExpertise.join(", ")}
                    </span>
                    .
                  </p>
                )}

                {aiAnalysis?.affected_sector && (
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    The problem affects the{" "}
                    <span className="font-semibold text-teal-800">
                      {aiAnalysis.affected_sector}
                    </span>{" "}
                    sector, which helps the matching system identify its
                    domain relevance.
                  </p>
                )}
              </div>

            </div>

            {/* ================= UNIVERSITY MATCH ================= */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                    University Match
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    Recommended Expertise
                  </h3>

                </div>

                <div className="rounded-xl bg-teal-100 px-4 py-3 text-center">

                  <p className="text-2xl font-bold text-teal-700">
                    {matchPercentage}%
                  </p>

                  <p className="text-[11px] font-semibold text-slate-500">
                    Match
                  </p>

                </div>

              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">

                {universityExpertise.length > 0 ? (
                  universityExpertise.slice(0, 3).map(
                    (expertise, index) => (
                      <div
                        key={`${expertise}-${index}`}
                        className="rounded-xl border border-teal-200 bg-teal-100 p-4"
                      >
                        <p className="text-xs font-semibold text-teal-800">
                          {expertise}
                        </p>
                      </div>
                    )
                  )
                ) : (
                  matchReasons.slice(0, 3).map(
                    (reason, index) => (
                      <div
                        key={`${reason}-${index}`}
                        className="rounded-xl border border-teal-200 bg-teal-100 p-4"
                      >
                        <p className="text-xs font-semibold text-teal-800">
                          {reason}
                        </p>
                      </div>
                    )
                  )
                )}

              </div>

              <div className="mt-4 rounded-xl border border-teal-200 bg-teal-100 p-5">

                <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                  Why this match?
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  The AI matching system calculated a{" "}
                  <span className="font-bold text-teal-800">
                    {matchPercentage}% similarity
                  </span>{" "}
                  between this problem and the university profile.

                  {universityExpertise.length > 0 && (
                    <>
                      {" "}The university has expertise in{" "}
                      <span className="font-semibold text-teal-800">
                        {universityExpertise.join(", ")}
                      </span>
                      , which is relevant to developing a solution for this
                      challenge.
                    </>
                  )}

                  {problem.category && (
                    <>
                      {" "}The problem is classified under{" "}
                      <span className="font-semibold text-teal-800">
                        {problem.category}
                      </span>
                      , and the AI analysis identifies the affected sector as{" "}
                      <span className="font-semibold text-teal-800">
                        {affectedSector}
                      </span>
                      .
                    </>
                  )}
                </p>

                {matchReasons.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {matchReasons.map((reason, index) => (
                      <span
                        key={`${reason}-${index}`}
                        className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-teal-700"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                )}

              </div>

            </div>

            {/* ================= SIMILAR PROBLEMS ================= */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-2">

                <Sparkles className="h-5 w-5 text-teal-700" />

                <h3 className="text-xl font-bold">
                  Similar Problems
                </h3>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                Related community challenges that may offer useful insights.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">

                {similarProblems.length > 0 ? (
                  similarProblems.map((similarProblem) => (
                    <a
                      key={similarProblem.id}
                      href={`/university/problems/${similarProblem.id}`}
                      className="group rounded-xl border border-teal-200 bg-teal-100 p-5 transition hover:border-teal-400 hover:bg-teal-200"
                    >

                      <p className="text-xs font-bold text-teal-700">
                        {similarProblem.category ||
                          "Related Challenge"}
                      </p>

                      <h4 className="mt-2 font-bold text-slate-900 group-hover:text-teal-800">
                        {similarProblem.title}
                      </h4>

                      <p className="mt-1 text-xs text-slate-500">
                        {similarProblem.district
                          ? `${similarProblem.district}, Jharkhand`
                          : "Jharkhand"}
                      </p>

                      <span className="mt-3 flex items-center gap-1 text-sm font-semibold text-teal-700">
                        View problem
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </span>

                    </a>
                  ))
                ) : (
                  <div className="rounded-xl border border-teal-200 bg-teal-100 p-5 md:col-span-2">
                    <p className="text-sm text-slate-600">
                      No similar problems are available yet.
                    </p>
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* ================= RIGHT SIDEBAR ================= */}
          <aside className="space-y-6">

            {/* Problem Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h3 className="text-lg font-bold">
                Problem Status
              </h3>

              <div className="mt-4 rounded-xl bg-slate-100 p-4">

                <p className="text-xs font-medium text-slate-500">
                  Current Status
                </p>

                <p
                  className={`mt-1 font-bold ${
                    accepted
                      ? "text-emerald-600"
                      : rejected
                        ? "text-red-600"
                        : "text-amber-600"
                  }`}
                >
                  {accepted
                    ? "Accepted"
                    : rejected
                      ? "Rejected"
                      : "Under Review"}
                </p>

              </div>

              {/* ================= ACCEPT / REJECT ================= */}
              {canManageProblem && (
                <>
                  {!accepted ? (
                    <button
                      type="button"
                      onClick={() => setShowConfirm(true)}
                      disabled={actionLoading}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <CheckCircle2 className="h-4 w-4" />

                      {actionLoading
                        ? "Processing..."
                        : "Accept Problem"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleReject}
                      disabled={actionLoading}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-100 px-4 py-3 text-sm font-semibold text-teal-800 transition hover:bg-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <X className="h-4 w-4" />

                      {actionLoading
                        ? "Processing..."
                        : "Reject Problem"}
                    </button>
                  )}
                </>
              )}

              <Link
                href="/university/solutions"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-100 hover:text-teal-800"
              >
                Propose a Solution
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>

            {/* Existing Solutions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-2">

                <Lightbulb className="h-5 w-5 text-teal-700" />

                <h3 className="text-lg font-bold">
                  Existing Solutions
                </h3>

              </div>

              <div className="mt-4 rounded-xl border border-teal-200 bg-teal-100 p-5 transition hover:border-teal-400 hover:bg-teal-200">

                <h4 className="font-bold text-slate-900">
                  Explore Available Solutions
                </h4>

                <p className="mt-1 text-sm text-slate-600">
                  Review solutions proposed for community challenges.
                </p>

                <Link
                  href="/university/solutions"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-teal-700"
                >
                  View solutions
                  <ArrowRight className="h-4 w-4" />
                </Link>

              </div>

            </div>

          </aside>

        </div>

        {/* ================= BOTTOM CTA ================= */}
        <div className="mt-8 rounded-3xl bg-gradient-to-r from-teal-700 to-teal-600 p-7 text-white shadow-sm md:p-8">

          <p className="text-xs font-bold uppercase tracking-wider text-teal-100 md:text-sm">
            From Challenge to Solution
          </p>

          <div className="mt-2 flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>

              <h3 className="text-xl font-bold md:text-2xl">
                Have an idea to solve this problem?
              </h3>

              <p className="mt-2 text-sm text-teal-50">
                Bring together students, researchers and experts to build
                something that creates real community impact.
              </p>

            </div>

            <Link
              href="/university/solutions"
              className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
            >
              Propose a Solution
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>

      </section>

      {/* ================= CONFIRMATION MODAL ================= */}
      {showConfirm && canManageProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-6 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
              <CheckCircle2 className="h-7 w-7 text-teal-700" />
            </div>

            <h3 className="mt-5 text-center text-xl font-bold">
              Are you sure?
            </h3>

            <p className="mt-3 text-center text-sm leading-6 text-slate-500">

              Do you want to accept{" "}

              <span className="font-semibold text-slate-800">
                {problem.title}
              </span>{" "}

              and work towards developing a solution for this challenge?

            </p>

            <div className="mt-6 flex gap-3">

              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={actionLoading}
                className="flex-1 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAccept}
                disabled={actionLoading}
                className="flex-1 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
              >
                {actionLoading
                  ? "Accepting..."
                  : "Yes, Accept"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="mt-12 bg-slate-950 px-6 py-8 text-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">

          {/* Logo */}
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

          {/* Copyright */}
          <p className="text-sm text-slate-400">
            © 2026 SamadhanX. Building solutions that matter.
          </p>

          {/* Links */}
          <div className="flex gap-5 text-sm text-slate-400">

            <Link
              href="/university/problems"
              className="transition hover:text-white"
            >
              Problems
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

    </main>
  );
}