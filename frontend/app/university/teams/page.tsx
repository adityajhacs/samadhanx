
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  Search,
  ShieldCheck,
  Users,
  User,
  Building2,
} from "lucide-react";

import {
  getProjectMemberDetails,
  type ProjectMemberDetail,
} from "@/lib/api/projectMembers";

import {
  getProjects,
  type Project,
} from "@/lib/api/projects";

import { getCurrentUser } from "@/lib/api/auth";

export default function UniversityTeamsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [members, setMembers] = useState<ProjectMemberDetail[]>([]);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");

  // ============================================================
  // LOAD CURRENT USER
  // ============================================================

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const user = await getCurrentUser();

        setCurrentUserId(user.id);

        setCurrentUserRole(
          String(user.role ?? "").toLowerCase()
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load current user."
        );
      }
    }

    loadCurrentUser();
  }, []);

  // ============================================================
  // LOAD PROJECTS
  // ============================================================

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoadingProjects(true);
        setError("");

        const data = await getProjects();

        setProjects(data);

        if (data.length > 0) {
          setSelectedProjectId(data[0].id);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load projects."
        );
      } finally {
        setLoadingProjects(false);
      }
    }

    loadProjects();
  }, []);

  // ============================================================
  // LOAD SELECTED PROJECT TEAM
  // ============================================================

  useEffect(() => {
    if (!selectedProjectId) {
      setMembers([]);
      return;
    }

    async function loadProjectTeam() {
      try {
        setLoadingMembers(true);
        setError("");

        const data = await getProjectMemberDetails(
          selectedProjectId
        );

        setMembers(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load project team."
        );
      } finally {
        setLoadingMembers(false);
      }
    }

    loadProjectTeam();
  }, [selectedProjectId]);

  // ============================================================
  // SELECTED PROJECT
  // ============================================================

  const selectedProject = useMemo(() => {
    return projects.find(
      (project) => project.id === selectedProjectId
    );
  }, [projects, selectedProjectId]);

  // ============================================================
  // PROJECT TEAM ACCESS
  // ============================================================

  const canManageTeam = useMemo(() => {
    if (!selectedProject) {
      return false;
    }

    const role = currentUserRole.toLowerCase();

    // University users can manage projects available to
    // their university through the authenticated projects API.
    if (role === "university") {
      return true;
    }

    // Faculty can manage only projects created by themselves.
    if (
      role === "faculty" &&
      selectedProject.created_by === currentUserId
    ) {
      return true;
    }

    return false;
  }, [
    selectedProject,
    currentUserRole,
    currentUserId,
  ]);

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return members;
    }

    return members.filter((member) => {
      return (
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        String(member.project_role ?? "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [members, search]);

  // ============================================================
  // TEAM COUNTS
  // ============================================================

  const students = members.filter(
    (member) =>
      member.role.toLowerCase() === "student"
  );

  const faculty = members.filter(
    (member) =>
      member.role.toLowerCase() === "faculty"
  );

  // ============================================================
  // PROJECT SELECTOR
  // ============================================================

  const handleProjectChange = (
    projectId: string
  ) => {
    setSelectedProjectId(projectId);
    setSearch("");
    setError("");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ====================================================== */}
      {/* NAVBAR */}
      {/* ====================================================== */}

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

            <a
              href="/university/problems"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Problems
            </a>

            <a
              href="/university/projects"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Projects
            </a>

            <a
              href="/university/solutions"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Solutions
            </a>

            <a
              href="/university/teams"
              className="text-sm font-semibold text-teal-600"
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

      {/* ====================================================== */}
      {/* MAIN */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* PAGE HEADER */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100">
              <Users className="h-7 w-7 text-teal-600" />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Project Teams
              </h2>

              <p className="text-slate-500">
                View the teams working on your university projects.
              </p>
            </div>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* ==================================================== */}
        {/* PROJECT SELECTOR */}
        {/* ==================================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-4 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100">
              <Building2 className="h-5 w-5 text-teal-600" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Select Project
              </h3>

              <p className="text-sm text-slate-500">
                Select a project to view its assigned team.
              </p>
            </div>

          </div>

          {loadingProjects ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
              Loading your university projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
              No projects are available for your university.
            </div>
          ) : (
            <div className="relative">

              <select
                value={selectedProjectId}
                onChange={(event) =>
                  handleProjectChange(event.target.value)
                }
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.title}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            </div>
          )}

        </div>

        {/* ==================================================== */}
        {/* SELECTED PROJECT */}
        {/* ==================================================== */}

        {selectedProject && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

              <div>

                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-teal-600">
                  Current Project
                </p>

                <h3 className="text-2xl font-bold text-slate-900">
                  {selectedProject.title}
                </h3>

                {selectedProject.description && (
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                    {selectedProject.description}
                  </p>
                )}

              </div>

              <div className="flex shrink-0 items-center gap-2 rounded-xl bg-teal-50 px-4 py-3">

                <ShieldCheck className="h-5 w-5 text-teal-600" />

                <div>
                  <p className="text-xs font-semibold text-teal-700">
                    {canManageTeam
                      ? "Project Manager"
                      : "Read Only"}
                  </p>

                  <p className="text-[11px] text-teal-600">
                    {canManageTeam
                      ? "You have management access to this project."
                      : "You can view this project team."}
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* TEAM CONTENT */}
        {/* ==================================================== */}

        {selectedProject && (
          <div className="grid gap-6 lg:grid-cols-3">

            {/* ================================================= */}
            {/* MEMBERS */}
            {/* ================================================= */}

            <div className="lg:col-span-2">

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <h3 className="text-lg font-semibold">
                      Project Team
                    </h3>

                    <p className="text-sm text-slate-500">
                      {members.length} member
                      {members.length !== 1 ? "s" : ""} currently assigned
                    </p>

                  </div>

                  {canManageTeam && (
                    <div className="rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700">
                      Project management access
                    </div>
                  )}

                </div>

                {/* SEARCH */}

                <div className="relative mb-5">

                  <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search team members..."
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />

                </div>

                {/* LOADING */}

                {loadingMembers && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                    Loading project team...
                  </div>
                )}

                {/* EMPTY */}

                {!loadingMembers && members.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">

                    <Users className="mx-auto mb-3 h-8 w-8 text-slate-400" />

                    <p className="font-medium text-slate-700">
                      No team members assigned
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      This project currently has no Student or Faculty members assigned.
                    </p>

                  </div>
                )}

                {/* MEMBER LIST */}

                {!loadingMembers && members.length > 0 && (
                  <div className="space-y-3">

                    {filteredMembers.map((member) => {

                      const memberRole =
                        member.role.toLowerCase();

                      const isStudent =
                        memberRole === "student";

                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:border-teal-200 hover:shadow-sm"
                        >

                          <div className="flex min-w-0 items-center gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-100">

                              {isStudent ? (
                                <GraduationCap className="h-5 w-5 text-teal-600" />
                              ) : (
                                <User className="h-5 w-5 text-teal-600" />
                              )}

                            </div>

                            <div className="min-w-0">

                              <p className="truncate font-semibold text-slate-900">
                                {member.name}
                              </p>

                              <p className="truncate text-sm text-slate-500">
                                {member.email}
                              </p>

                              <div className="mt-2 flex flex-wrap gap-2">

                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                                  {member.role}
                                </span>

                                {member.project_role && (
                                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-teal-700">
                                    {member.project_role}
                                  </span>
                                )}

                              </div>

                            </div>

                          </div>

                          <div className="ml-4 shrink-0">

                            <CheckCircle2 className="h-5 w-5 text-teal-600" />

                          </div>

                        </div>
                      );
                    })}

                    {filteredMembers.length === 0 && (
                      <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
                        No team members found.
                      </div>
                    )}

                  </div>
                )}

              </div>

            </div>

            {/* ================================================= */}
            {/* SIDEBAR */}
            {/* ================================================= */}

            <div className="space-y-6">

              {/* TEAM SUMMARY */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <h3 className="mb-5 font-semibold">
                  Team Summary
                </h3>

                <div className="space-y-4">

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-slate-600">
                      Students
                    </span>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                      {students.length}
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-slate-600">
                      Faculty
                    </span>

                    <span className="rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-600">
                      {faculty.length}
                    </span>

                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">

                    <span className="text-sm font-medium text-slate-700">
                      Total Members
                    </span>

                    <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
                      {members.length}
                    </span>

                  </div>

                </div>

              </div>

              {/* PROJECT RESPONSIBILITY */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-4 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100">
                    <ShieldCheck className="h-5 w-5 text-teal-600" />
                  </div>

                  <h3 className="font-semibold">
                    Project Responsibility
                  </h3>

                </div>

                <p className="text-sm leading-6 text-slate-500">
                  This team is assigned to work on:
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {selectedProject.title}
                </p>

                <div className="mt-4 rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Access
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {canManageTeam
                      ? "You have management access to this project."
                      : "You have read-only access to this project team."}
                  </p>

                </div>

              </div>

              {/* READ ONLY NOTICE */}

              {!canManageTeam && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-start gap-3">

                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

                    <div>

                      <h3 className="font-semibold text-slate-800">
                        Read-only access
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Students and non-owner Faculty can view the
                        project team, but cannot modify team members.
                      </p>

                    </div>

                  </div>

                </div>
              )}

              {/* PROJECT PAGE */}

              <a
                href={`/university/projects/${selectedProject.id}`}
                className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
              >
                View Project
              </a>

            </div>

          </div>
        )}

      </section>

      {/* ====================================================== */}
      {/* FOOTER */}
      {/* ====================================================== */}

      <footer className="mt-12 bg-slate-950 px-6 py-8 text-white">

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
            © 2026 SamadhanX. All rights reserved.
          </p>

          <div className="flex gap-5 text-sm text-slate-400">

            <a
              href="/help"
              className="transition hover:text-teal-400"
            >
              Help
            </a>

            <a
              href="/problems"
              className="transition hover:text-teal-400"
            >
              Problems
            </a>

          </div>

        </div>

      </footer>

    </main>
  );
}

