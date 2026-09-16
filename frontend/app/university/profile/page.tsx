
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FolderKanban,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Sparkles,
  X,
} from "lucide-react";

import { getCurrentUser } from "@/lib/api/auth";
import {
  getMyUniversityId,
  getMyUniversityProblems,
  getUniversities,
  University,
  UniversityProblem,
} from "@/lib/api/universities";
import { getProjects, Project } from "@/lib/api/projects";

export default function UniversityProfilePage() {
  const [university, setUniversity] = useState<University | null>(null);
  const [problems, setProblems] = useState<UniversityProblem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expertiseOpen, setExpertiseOpen] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const [
          currentUser,
          universityId,
          universities,
          universityProblems,
          universityProjects,
        ] = await Promise.all([
          getCurrentUser(),
          getMyUniversityId(),
          getUniversities(),
          getMyUniversityProblems(),
          getProjects(),
        ]);

        setCurrentUserEmail(currentUser?.email ?? "");

        const currentUniversity = universities.find(
          (item) => item.id === universityId
        );

        if (!currentUniversity) {
          throw new Error("University profile not found.");
        }

        setUniversity(currentUniversity);
        setProblems(universityProblems);

        /*
         * /api/projects is used with the authenticated university account.
         * The university-scoped projects returned by the API are displayed here.
         */
        setProjects(universityProjects);
      } catch (err) {
        console.error("Failed to load university profile:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load university profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const expertise = useMemo(() => {
    if (!university?.expertise_area) {
      return [];
    }

    if (Array.isArray(university.expertise_area)) {
      return university.expertise_area;
    }

    return [university.expertise_area];
  }, [university]);

  const acceptedProblems = useMemo(() => {
    return problems.filter((problem) => {
      const status = String(problem.status ?? "").toLowerCase();

      return status === "accepted" || status === "approved";
    });
  }, [problems]);

  if (loading) {
    return <LoadingState />;
  }

  if (!university || error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <UniversityNavbar
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 py-12">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Building2 className="h-7 w-7" />
            </div>

            <h1 className="mt-5 text-xl font-bold text-slate-900">
              Profile could not be loaded
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error || "University profile was not found."}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <UniversityNavbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-36 bg-gradient-to-r from-teal-800 via-teal-700 to-teal-600">
            <div className="flex h-full items-end px-6 pb-5 lg:px-8">
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                SamadhanX University Portal
              </div>
            </div>
          </div>

          <div className="px-6 py-7 lg:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-teal-700 text-3xl font-bold text-white shadow-md">
                  {university.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-slate-900">
                      {university.name}
                    </h1>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      University
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                    {university.district && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {university.district}
                      </span>
                    )}

                    {university.department && (
                      <span className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4" />
                        {university.department}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Link
                href="/university/dashboard"
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
              >
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={<MessageSquare className="h-5 w-5" />}
            label="Problems"
            value={problems.length}
          />

          <StatCard
            icon={<FolderKanban className="h-5 w-5" />}
            label="Projects"
            value={projects.length}
          />

          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Accepted"
            value={acceptedProblems.length}
          />

          <StatCard
            icon={<GraduationCap className="h-5 w-5" />}
            label="Expertise"
            value={expertise.length}
          />
        </section>

        {/* Content */}
        <section className="mt-6 grid items-start gap-6 lg:grid-cols-12">
          {/* Left */}
          <div className="space-y-6 lg:col-span-4">
            {/* University Information */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Building2 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    University Information
                  </h2>

                  <p className="text-xs text-slate-500">
                    Account information
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <InfoItem
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={currentUserEmail || "Not available"}
                />

                <InfoItem
                  icon={<MapPin className="h-4 w-4" />}
                  label="District"
                  value={university.district || "Not available"}
                />

                <InfoItem
                  icon={<Building2 className="h-4 w-4" />}
                  label="Department"
                  value={university.department || "Not available"}
                />
              </div>
            </div>

            {/* Expertise */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setExpertiseOpen((value) => !value)}
                className="flex w-full items-center justify-between p-6"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Sparkles className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Expertise Areas
                    </h2>

                    <p className="text-xs text-slate-500">
                      University expertise
                    </p>
                  </div>
                </div>

                {expertiseOpen ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>

              {expertiseOpen && (
                <div className="border-t border-slate-100 px-6 py-5">
                  {expertise.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {expertise.map((item, index) => (
                        <span
                          key={`${item}-${index}`}
                          className="rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      No expertise areas available.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6 lg:col-span-8">
            {/* University Projects */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                icon={<FolderKanban className="h-5 w-5" />}
                title="University Projects"
                href="/university/projects"
              />

              <div className="mt-6">
                {projects.length === 0 ? (
                  <EmptyState
                    icon={<FolderKanban className="h-6 w-6" />}
                    title="No university projects yet"
                    description="Projects created and managed by your university will appear here."
                  />
                ) : (
                  <div className="space-y-3">
                    {projects.slice(0, 5).map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Problems */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader
                icon={<MessageSquare className="h-5 w-5" />}
                title="University Problems"
                href="/university/problems"
              />

              <div className="mt-6">
                {problems.length === 0 ? (
                  <EmptyState
                    icon={<MessageSquare className="h-6 w-6" />}
                    title="No problems yet"
                    description="University problem data will appear here."
                  />
                ) : (
                  <div className="space-y-3">
                    {problems.slice(0, 5).map((problem) => (
                      <ProblemCard
                        key={problem.id}
                        problem={problem}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ========================================================================== */
/* NAVBAR                                                                     */
/* ========================================================================== */

function UniversityNavbar({
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
}) {
  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          href="/university/dashboard"
          className="flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-sm font-bold text-white">
            S
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight text-slate-900">
              SamadhanX
            </p>

            <p className="hidden text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:block">
              Ideas → Action → Impact
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <NavbarLink href="/university/dashboard">
            Dashboard
          </NavbarLink>

          <NavbarLink href="/university/problems">
            Problems
          </NavbarLink>

          <NavbarLink href="/university/solutions">
            Solutions
          </NavbarLink>

          <NavbarLink href="/university/projects">
            Projects
          </NavbarLink>

          <NavbarLink href="/university/teams">
            Teams
          </NavbarLink>

          <NavbarLink href="/university/profile" active>
            Profile
          </NavbarLink>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            <MobileLink href="/university/dashboard">
              Dashboard
            </MobileLink>

            <MobileLink href="/university/problems">
              Problems
            </MobileLink>

            <MobileLink href="/university/solutions">
              Solutions
            </MobileLink>

            <MobileLink href="/university/projects">
              Projects
            </MobileLink>

            <MobileLink href="/university/teams">
              Teams
            </MobileLink>

            <MobileLink href="/university/profile">
              Profile
            </MobileLink>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavbarLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "text-sm font-semibold text-teal-700"
          : "text-sm font-medium text-slate-600 transition hover:text-teal-700"
      }
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-teal-50 hover:text-teal-700"
    >
      {children}
    </Link>
  );
}

/* ========================================================================== */
/* STAT CARD                                                                  */
/* ========================================================================== */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          {icon}
        </div>

        <span className="text-2xl font-bold text-slate-900">{value}</span>
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-800">{label}</p>
    </div>
  );
}

/* ========================================================================== */
/* INFO ITEM                                                                  */
/* ========================================================================== */

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* SECTION HEADER                                                             */
/* ========================================================================== */

function SectionHeader({
  icon,
  title,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          {icon}
        </div>

        <h2 className="font-bold text-slate-900">{title}</h2>
      </div>

      <Link
        href={href}
        className="hidden items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-800 sm:flex"
      >
        View all
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

/* ========================================================================== */
/* PROJECT CARD                                                               */
/* ========================================================================== */

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/university/projects/${project.id}`}
      className="group block rounded-xl border border-slate-200 p-4 transition hover:border-teal-200 hover:bg-teal-50/30"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700">
          <FolderKanban className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-900 group-hover:text-teal-700">
                {project.title}
              </h3>

              {project.description && (
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                  {project.description}
                </p>
              )}
            </div>

            <span className="w-fit shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              {project.status || "Not specified"}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {project.member_count !== undefined
                ? `${project.member_count} members`
                : "Project"}
            </span>

            <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-600" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ========================================================================== */
/* PROBLEM CARD                                                               */
/* ========================================================================== */

function ProblemCard({ problem }: { problem: UniversityProblem }) {
  const status = String(problem.status ?? "Pending");
  const normalizedStatus = status.toLowerCase();

  const accepted =
    normalizedStatus === "accepted" || normalizedStatus === "approved";

  return (
    <div className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            accepted
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {accepted ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <MessageSquare className="h-5 w-5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900">
                {problem.title}
              </h3>

              {problem.description && (
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                  {problem.description}
                </p>
              )}
            </div>

            <span
              className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                accepted
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* EMPTY STATE                                                                */
/* ========================================================================== */

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-800">{title}</h3>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* ========================================================================== */
/* LOADING                                                                    */
/* ========================================================================== */

function LoadingState() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="hidden gap-7 md:flex">
            <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="animate-pulse">
          <div className="h-36 rounded-2xl bg-slate-200" />

          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="h-28 rounded-2xl bg-slate-200" />
            <div className="h-28 rounded-2xl bg-slate-200" />
            <div className="h-28 rounded-2xl bg-slate-200" />
            <div className="h-28 rounded-2xl bg-slate-200" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-4">
              <div className="h-64 rounded-2xl bg-slate-200" />
              <div className="h-48 rounded-2xl bg-slate-200" />
            </div>

            <div className="space-y-6 lg:col-span-8">
              <div className="h-72 rounded-2xl bg-slate-200" />
              <div className="h-64 rounded-2xl bg-slate-200" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

