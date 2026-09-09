"use client";

import { useState } from "react";
import {
  CheckCircle2,
  GraduationCap,
  Plus,
  Search,
  Trash2,
  Users,
  UserPlus,
  X,
} from "lucide-react";

type Member = {
  id: number;
  name: string;
  role: string;
  domain: string;
};

const initialMembers: Member[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Student",
    domain: "Computer Science",
  },
  {
    id: 2,
    name: "Priya Singh",
    role: "Researcher",
    domain: "Environmental Science",
  },
  {
    id: 3,
    name: "Rahul Verma",
    role: "Faculty",
    domain: "Civil Engineering",
  },
];

const availableMembers: Member[] = [
  {
    id: 4,
    name: "Ananya Gupta",
    role: "Student",
    domain: "Information Technology",
  },
  {
    id: 5,
    name: "Rohan Mehta",
    role: "Researcher",
    domain: "Water Resources",
  },
  {
    id: 6,
    name: "Sneha Kumari",
    role: "Faculty",
    domain: "Environmental Engineering",
  },
  {
    id: 7,
    name: "Kunal Singh",
    role: "Student",
    domain: "Mechanical Engineering",
  },
];

export default function UniversityTeamsPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [teamName, setTeamName] = useState(
    "Water Management Innovation Team"
  );
  const [search, setSearch] = useState("");

  const [showAddMember, setShowAddMember] = useState(false);
  const [showCreateConfirmation, setShowCreateConfirmation] =
    useState(false);

  const removeMember = (id: number) => {
    setMembers((current) =>
      current.filter((member) => member.id !== id)
    );
  };

  const addMember = (member: Member) => {
    setMembers((current) => {
      if (current.some((existing) => existing.id === member.id)) {
        return current;
      }

      return [...current, member];
    });

    setShowAddMember(false);
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.domain.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase())
  );

  const students = members.filter(
    (member) => member.role === "Student"
  ).length;

  const faculty = members.filter(
    (member) => member.role === "Faculty"
  ).length;

  const researchers = members.filter(
    (member) => member.role === "Researcher"
  ).length;

  const expertise = Array.from(
    new Set(members.map((member) => member.domain))
  );

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
              <h1 className="text-2xl font-bold text-slate-900">
                SamadhanX
              </h1>

              <p className="text-xs text-slate-500">
                Ideas → Action → Impact
              </p>
            </div>
          </a>

          {/* Navigation */}
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

      {/* ================= MAIN ================= */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Page Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100">
              <Users className="h-7 w-7 text-teal-600" />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Team Builder
              </h2>

              <p className="text-slate-500">
                Build a multidisciplinary team to solve real-world
                problems.
              </p>
            </div>
          </div>
        </div>

        {/* ================= TEAM DETAILS ================= */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">
            Team Details
          </h3>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Team Name
          </label>

          <div className="relative">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-11 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />

            {teamName && (
              <button
                type="button"
                onClick={() => setTeamName("")}
                aria-label="Clear team name"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* ================= CONTENT GRID ================= */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ================= MEMBERS ================= */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              {/* Header */}
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    Team Members
                  </h3>

                  <p className="text-sm text-slate-500">
                    {members.length} members added
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddMember(true)}
                  className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Member
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-5">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search members..."
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-11 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear member search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Member List */}
              <div className="space-y-3">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100">
                        <GraduationCap className="h-5 w-5 text-teal-600" />
                      </div>

                      <div>
                        <p className="font-semibold">
                          {member.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {member.role} • {member.domain}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      aria-label={`Remove ${member.name}`}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                {filteredMembers.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center text-slate-500">
                    No team members found.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDEBAR ================= */}
          <div className="space-y-6">
            {/* Team Composition */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold">
                Team Composition
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Students
                  </span>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                    {students}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Faculty
                  </span>

                  <span className="rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-600">
                    {faculty}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Researchers
                  </span>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">
                    {researchers}
                  </span>
                </div>
              </div>
            </div>

            {/* Expertise */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold">
                Expertise Covered
              </h3>

              <div className="flex flex-wrap gap-2">
                {expertise.map((domain) => (
                  <span
                    key={domain}
                    className="rounded-full bg-teal-50 px-3 py-1.5 text-sm text-teal-700"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>

            {/* Create Team */}
            <button
              type="button"
              onClick={() => {
                if (!teamName.trim()) {
                  alert("Please enter a team name.");
                  return;
                }

                setShowCreateConfirmation(true);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white transition hover:bg-teal-700"
            >
              <Plus className="h-5 w-5" />
              Create Team
            </button>
          </div>
        </div>
      </section>

      {/* ================= ADD MEMBER MODAL ================= */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100">
                    <UserPlus className="h-5 w-5 text-teal-600" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">
                      Add Member
                    </h3>

                    <p className="text-sm text-slate-500">
                      Add another member to your university team.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddMember(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {availableMembers
                .filter(
                  (member) =>
                    !members.some(
                      (existing) => existing.id === member.id
                    )
                )
                .map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => addMember(member)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                        <GraduationCap className="h-5 w-5 text-teal-600" />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {member.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {member.role} • {member.domain}
                        </p>
                      </div>
                    </div>

                    <Plus className="h-5 w-5 text-teal-600" />
                  </button>
                ))}
            </div>

            <button
              type="button"
              onClick={() => setShowAddMember(false)}
              className="mt-5 w-full rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:border-red-400 hover:bg-red-50 hover:text-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ================= CREATE TEAM CONFIRMATION ================= */}
      {showCreateConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50">
              <CheckCircle2 className="h-8 w-8 text-teal-600" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              Create Team?
            </h3>

            <p className="mt-3 leading-6 text-slate-500">
              Are you sure you want to create{" "}
              <span className="font-semibold text-slate-700">
                {teamName}
              </span>{" "}
              with {members.length} members?
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowCreateConfirmation(false)}
                className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:border-red-400 hover:bg-red-50 hover:text-red-600"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowCreateConfirmation(false);
                  alert(`Team "${teamName}" created successfully!`);
                }}
                className="rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white transition hover:bg-teal-700"
              >
                Yes, Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="mt-12 bg-slate-950 px-6 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">
          {/* Footer Logo */}
          <a
            href="/university/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">
              S
            </div>

            <div>
              <p className="text-lg font-bold">SamadhanX</p>

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