
"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  Clock3,
  FilePlus2,
  HelpCircle,
  LogOut,
  MapPin,
  Plus,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getCurrentUser, logout, type AuthUser } from "@/lib/api/auth";
import { getMyProblems, type Problem } from "@/lib/api/problems";

export default function CitizenDashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [currentUser, myProblems] = await Promise.all([
        getCurrentUser(),
        getMyProblems(),
      ]);

      setUser(currentUser);
      setProblems(myProblems);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load your dashboard.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const normalizedStatuses = problems.map((problem) =>
      (problem.status || "Pending").toLowerCase()
    );

    const underReview = normalizedStatuses.filter(
      (status) =>
        status.includes("pending") ||
        status.includes("review") ||
        status.includes("submitted")
    ).length;

    const inProgress = normalizedStatuses.filter(
      (status) =>
        status.includes("progress") ||
        status.includes("matched")
    ).length;

    const resolved = normalizedStatuses.filter((status) =>
      status.includes("resolved")
    ).length;

    return {
      reported: problems.length,
      underReview,
      inProgress,
      resolved,
    };
  }, [problems]);

  const recentProblems = useMemo(() => {
    return problems.slice(0, 5);
  }, [problems]);

  const displayName =
    user?.name ||
    user?.email?.split("@")[0] ||
    "Citizen";

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link
            href="/citizen/dashboard"
            className="flex w-fit items-center gap-2.5"
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

          {/* Right Navigation */}
          <div className="flex items-center gap-7">

            <nav className="hidden items-center gap-7 lg:flex">
              <Link
                href="/citizen/dashboard"
                className="text-sm font-semibold text-teal-700"
              >
                Dashboard
              </Link>

              <Link
                href="/problems"
                className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
              >
                All Problems
              </Link>

              <Link
                href="/citizen/problems"
                className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
              >
                My Problems
              </Link>

              <Link
                href="/help"
                className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
              >
                Help
              </Link>
            </nav>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">
                Logout
              </span>
            </button>

          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Welcome */}
        <section className="mb-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>
              <p className="mb-2 text-sm font-semibold text-teal-700">
                Citizen Portal
              </p>

              <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                <span>Welcome, {displayName}</span>

                <UserRound
                  size={26}
                  strokeWidth={2}
                  className="text-teal-700"
                />
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Report civic problems, follow their progress, and help make
                your community better.
              </p>
            </div>

           <Link href="/citizen/report"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
            >
              <Plus size={18} />
              Report a Problem
            </Link>

          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-semibold text-red-800">
                  Unable to load dashboard
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>

              <button
                onClick={loadDashboard}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
              >
                <RefreshCw size={15} />
                Retry
              </button>

            </div>
          </div>
        )}

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Problems Reported"
            value={stats.reported}
            description="Problems reported by you"
            icon={<ClipboardList size={20} />}
            loading={loading}
          />

          <StatCard
            title="Under Review"
            value={stats.underReview}
            description="Awaiting further action"
            icon={<Clock3 size={20} />}
            loading={loading}
          />

          <StatCard
            title="In Progress"
            value={stats.inProgress}
            description="Solutions being developed"
            icon={<CircleDot size={20} />}
            loading={loading}
          />

          <StatCard
            title="Resolved"
            value={stats.resolved}
            description="Successfully resolved"
            icon={<CheckCircle2 size={20} />}
            loading={loading}
          />

        </section>

        {/* Main Content */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">

          {/* Recent Problems */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  My Recent Problems
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Problems you have reported recently
                </p>
              </div>

              <Link
                href="/citizen/problems"
                className="hidden items-center gap-1.5 text-sm font-semibold text-teal-700 transition hover:text-teal-800 sm:flex"
              >
                View all
                <ArrowRight size={15} />
              </Link>

            </div>

            <div className="divide-y divide-slate-100">

              {loading ? (
                <>
                  <ProblemSkeleton />
                  <ProblemSkeleton />
                  <ProblemSkeleton />
                </>
              ) : recentProblems.length > 0 ? (
                recentProblems.map((problem) => (
                  <ProblemRow
                    key={problem.id}
                    problem={problem}
                  />
                ))
              ) : (
                <EmptyProblems />
              )}

            </div>

            <div className="border-t border-slate-200 px-5 py-4 sm:hidden">
              <Link
                href="/citizen/problems"
                className="flex items-center justify-center gap-1.5 text-sm font-semibold text-teal-700"
              >
                View all my problems
                <ArrowRight size={15} />
              </Link>
            </div>

          </div>

          {/* Right Side */}
          <aside className="space-y-6">

            {/* Quick Actions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h2 className="text-lg font-bold text-slate-900">
                Quick Actions
              </h2>

              <div className="mt-4 space-y-3">

                <QuickAction
                  href="/citizen/report"
                  icon={<FilePlus2 size={19} />}
                  title="Report a Problem"
                  description="Tell us about a civic issue"
                  primary
                />

                <QuickAction
                  href="/citizen/problems"
                  icon={<ClipboardList size={19} />}
                  title="My Problems"
                  description="Track your reported problems"
                />

                <QuickAction
                  href="/problems"
                  icon={<CircleDot size={19} />}
                  title="Explore Problems"
                  description="Support community problems"
                />

              </div>
            </div>

            {/* How it Works */}
            <div className="rounded-2xl border border-teal-100 bg-teal-50/70 p-5">

              <div className="flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                  <CircleDot size={18} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    SamadhanX
                  </p>

                  <h2 className="text-base font-bold text-slate-900">
                    From Problem to Impact
                  </h2>
                </div>

              </div>

              <div className="mt-5 space-y-4">

                <ProgressStep
                  number="1"
                  title="Report"
                  description="Share a real community problem."
                />

                <ProgressStep
                  number="2"
                  title="AI Analysis"
                  description="AI helps understand the issue."
                />

                <ProgressStep
                  number="3"
                  title="Connect"
                  description="The right people work on the solution."
                />

                <ProgressStep
                  number="4"
                  title="Impact"
                  description="Track progress towards resolution."
                />

              </div>
            </div>

            {/* Help */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <HelpCircle size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Need help?
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Learn how to report problems and track their progress.
                  </p>

                  <Link
                    href="/help"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800"
                  >
                    Visit Help Center
                    <ArrowRight size={13} />
                  </Link>
                </div>

              </div>
            </div>

          </aside>
        </section>
      </main>

  
{/* Footer */}
<footer className="border-t border-slate-800 bg-slate-950 px-6 py-8 text-white">
  <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">

    {/* Logo */}
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

    {/* Copyright */}
    <div className="text-center text-sm text-slate-400 md:absolute md:left-1/2 md:-translate-x-1/2">
      <p>
        © 2026 SamadhanX. Building solutions that matter.
      </p>
    </div>

    {/* Footer Links */}
    <div className="flex flex-wrap justify-center gap-5 text-sm text-slate-300">
      <Link
        href="/"
        className="transition hover:text-white"
      >
        Home
      </Link>

      <Link
        href="/problems"
        className="transition hover:text-white"
      >
        Problems
      </Link>
    </div>

  </div>
</footer>


    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  loading,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md">

      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-100">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {title}
      </p>

      {loading ? (
        <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-slate-100" />
      ) : (
        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </p>
      )}

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>

    </div>
  );
}

function ProblemRow({
  problem,
}: {
  problem: Problem;
}) {
  const status = problem.status || "Pending";

  return (
    <Link
      href={`/problems/${problem.id}`}
      className="group block px-5 py-4 transition hover:bg-slate-50 sm:px-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex min-w-0 flex-1 items-start gap-3">

          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-teal-50 group-hover:text-teal-700">
            <MapPin size={17} />
          </div>

          <div className="min-w-0">

            <h3 className="truncate text-sm font-semibold text-slate-900 group-hover:text-teal-700">
              {problem.title}
            </h3>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">

              <span>
                {problem.district || "District not specified"}
              </span>

              {problem.category && (
                <>
                  <span className="text-slate-300">
                    •
                  </span>

                  <span>
                    {problem.category}
                  </span>
                </>
              )}

            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">

          <StatusBadge status={status} />

          <ArrowRight
            size={16}
            className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-teal-700"
          />

        </div>
      </div>
    </Link>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized = status.toLowerCase();

  let className =
    "border-slate-200 bg-slate-50 text-slate-600";

  if (normalized.includes("resolved")) {
    className =
      "border-emerald-200 bg-emerald-50 text-emerald-700";
  } else if (
    normalized.includes("progress") ||
    normalized.includes("matched")
  ) {
    className =
      "border-teal-200 bg-teal-50 text-teal-700";
  } else if (
    normalized.includes("review") ||
    normalized.includes("pending") ||
    normalized.includes("submitted")
  ) {
    className =
      "border-amber-200 bg-amber-50 text-amber-700";
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {status}
    </span>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
  primary = false,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-xl border p-4 transition ${
        primary
          ? "border-teal-100 bg-teal-50/50 hover:border-teal-200 hover:bg-teal-50"
          : "border-slate-200 hover:border-teal-200 hover:bg-slate-50"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          primary
            ? "bg-teal-700 text-white"
            : "bg-slate-100 text-slate-700 group-hover:bg-teal-50 group-hover:text-teal-700"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-sm font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>

      </div>

      <ArrowRight
        size={16}
        className="ml-auto shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-teal-700"
      />
    </Link>
  );
}

function ProblemSkeleton() {
  return (
    <div className="px-5 py-4 sm:px-6">

      <div className="flex items-center gap-3">

        <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />

        <div className="flex-1">

          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />

          <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-slate-100" />

        </div>

        <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />

      </div>
    </div>
  );
}

function EmptyProblems() {
  return (
    <div className="px-6 py-14 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <ClipboardList size={24} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        No problems reported yet
      </h3>

      <p className="mx-auto mt-1 max-w-sm text-sm leading-5 text-slate-500">
        Report your first community problem and start making
        an impact.
      </p>

      <Link
        href="/problems"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
      >
        <Plus size={16} />
        Report a Problem
      </Link>

    </div>
  );
}

function ProgressStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">

      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
        {number}
      </div>

      <div>

        <p className="text-sm font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-0.5 text-xs leading-5 text-slate-500">
          {description}
        </p>

      </div>
    </div>
  );
}

