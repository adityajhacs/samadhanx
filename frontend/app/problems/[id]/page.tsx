
"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { getProblem, Problem } from "@/lib/api/problems";
import ProblemActions from "./ProblemActions";
import AIAnalysis from "./AIAnalysis";

import {
  MapPin,
  CalendarDays,
  Users,
  Camera,
  Video,
} from "lucide-react";

export default function ProblemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProblem = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProblem(id);

        setProblem(data);
      } catch (error) {
        console.error("Failed to load problem:", error);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to load problem.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProblem();
  }, [id]);



  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <nav className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-xl text-white">
                S
              </div>

              <div>
                <div className="text-xl font-bold tracking-tight">
                  SamadhanX
                </div>

                <div className="text-xs text-slate-500">
                  Ideas → Action → Impact
                </div>
              </div>
            </Link>

            <Link
              href="/problems"
              className="text-sm font-medium text-teal-600"
            >
              Problems
            </Link>
          </div>
        </nav>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-slate-500">
              Loading problem details...
            </p>
          </div>
        </section>
      </main>
    );
  }

  // Error / problem not found
  if (error || !problem) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <nav className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-xl text-white">
                S
              </div>

              <div>
                <div className="text-xl font-bold tracking-tight">
                  SamadhanX
                </div>

                <div className="text-xs text-slate-500">
                  Ideas → Action → Impact
                </div>
              </div>
            </Link>

            <Link
              href="/problems"
              className="text-sm font-medium text-slate-600 hover:text-teal-600"
            >
              Problems
            </Link>
          </div>
        </nav>

        <section className="mx-auto max-w-4xl px-6 py-20">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
            <h1 className="text-2xl font-bold text-red-700">
              Problem could not be loaded
            </h1>

            <p className="mt-3 text-sm text-red-600">
              {error || "The requested problem was not found."}
            </p>

            <Link
              href="/problems"
              className="mt-6 inline-flex rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-700"
            >
              ← Back to Problems
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const location = problem.district
    ? `${problem.district}, Jharkhand`
    : "Location not specified";

  const status = problem.status || "Pending";

  const severity =
    problem.severity_score !== null &&
    problem.severity_score !== undefined
      ? problem.severity_score >= 70
        ? "High"
        : problem.severity_score >= 40
          ? "Medium"
          : "Low"
      : "Not analyzed";

  const priority =
    problem.severity_score !== null &&
    problem.severity_score !== undefined
      ? problem.severity_score >= 70
        ? "High Priority"
        : problem.severity_score >= 40
          ? "Medium Priority"
          : "Low Priority"
      : "Priority not available";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-xl text-white">
              S
            </div>

            <div>
              <div className="text-xl font-bold tracking-tight">
                SamadhanX
              </div>

              <div className="text-xs text-slate-500">
                Ideas → Action → Impact
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-teal-600"
            >
              Home
            </Link>

            <Link
              href="/problems"
              className="text-sm font-medium text-teal-600"
            >
              Problems
            </Link>

            <button className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <section className="mx-auto max-w-7xl px-6 py-6">
        {/* Back */}
        <Link
          href="/problems"
          className="text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          ← Back to Problems
        </Link>

        {/* Problem Header */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            {problem.category && (
              <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-600">
                {problem.category}
              </span>
            )}

            <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600">
              {priority}
            </span>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
              {status}
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
            {problem.title}
          </h1>

          <p className="mt-4 max-w-4xl leading-7 text-slate-600">
            {problem.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-8 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <MapPin size={17} />

              <span>{location}</span>
            </span>

            <span className="flex items-center gap-2">
              <CalendarDays size={17} />

              <span>
                {problem.created_at
                  ? new Date(
                      problem.created_at
                    ).toLocaleDateString()
                  : "Reported recently"}
              </span>
            </span>

            <span className="flex items-center gap-2">
              <Users size={17} />

              <span>Community reported</span>
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Problem Description */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold">
                Problem Description
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                {problem.description}
              </p>
            </div>

            {/* AI Analysis */}
            <AIAnalysis problemId={id} />

            {/* Status Tracking */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold">
                Status Tracking
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Track the progress of this reported problem.
              </p>

              <div className="mt-8 space-y-7">
                {/* Problem Reported */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-4 w-4 rounded-full bg-teal-600" />

                    <div className="mt-2 h-12 w-px bg-teal-200" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      Problem Reported
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Citizen submitted the problem.
                    </p>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-4 w-4 rounded-full ${
                        problem.severity_score !== null &&
                        problem.severity_score !== undefined
                          ? "bg-teal-600"
                          : "bg-slate-300"
                      }`}
                    />

                    <div className="mt-2 h-12 w-px bg-teal-200" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      AI Analysis
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {problem.severity_score !== null &&
                      problem.severity_score !== undefined
                        ? "Severity information is available for this problem."
                        : "AI analysis has not been completed yet."}
                    </p>
                  </div>
                </div>

                {/* Current Status */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-4 w-4 rounded-full bg-amber-500" />

                    <div className="mt-2 h-12 w-px bg-slate-200" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      {status}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Current status of this reported problem.
                    </p>
                  </div>
                </div>

                {/* Resolution */}
                <div className="flex gap-4 opacity-50">
                  <div className="h-4 w-4 rounded-full bg-slate-300" />

                  <div>
                    <p className="font-semibold text-slate-900">
                      Resolution
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Waiting for the problem to be resolved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Location */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold">
                Location
              </h2>

              <div className="mt-4 flex h-40 items-center justify-center rounded-2xl bg-slate-100 text-center text-sm text-slate-500">
                <div className="flex flex-col items-center">
                  <MapPin size={24} />

                  <p className="mt-2">
                    {location}
                  </p>
                </div>
              </div>

              {problem.latitude !== null &&
                problem.latitude !== undefined &&
                problem.longitude !== null &&
                problem.longitude !== undefined && (
                  <p className="mt-4 text-xs text-slate-500">
                    Coordinates: {problem.latitude},{" "}
                    {problem.longitude}
                  </p>
                )}
            </div>

            {/* Support + Feedback */}
            <ProblemActions
  problemId={id}
  supporters={0}
/>

            
{/* Evidence */}
<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
  <h2 className="text-xl font-bold">
    Evidence
  </h2>

  <p className="mt-2 text-sm leading-6 text-slate-500">
    Photos and videos submitted by citizens to help
    understand the problem.
  </p>

  <div className="mt-5 space-y-3">
    {/* Photo */}
    {problem.image_url ? (
      <a
        href={problem.image_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
      >
        <Camera size={18} />
        View Photo
      </a>
    ) : (
      <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
        <Camera size={18} />
        No photo submitted
      </div>
    )}

    {/* Video */}
    {problem.video_url ? (
      <a
        href={problem.video_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
      >
        <Video size={18} />
        View Video
      </a>
    ) : (
      <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
        <Video size={18} />
        No video submitted
      </div>
    )}
  </div>
</div>




          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-8 text-white">
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold">
                S
              </div>

              <div>
                <p className="font-semibold">
                  SamadhanX
                </p>

                <p className="text-sm text-slate-400">
                  Ideas → Action → Impact
                </p>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-slate-400 md:absolute md:left-1/2 md:-translate-x-1/2">
            <p>
              © 2026 SamadhanX. Building solutions together.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-5 text-sm text-slate-300">
            <span className="cursor-pointer hover:text-white">
              About
            </span>

            <span className="cursor-pointer hover:text-white">
              Contact
            </span>

            <span className="cursor-pointer hover:text-white">
              Privacy
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}

