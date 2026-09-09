"use client";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Edit3,
  GraduationCap,
  Handshake,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Users,
  X,
  BriefcaseBusiness,
  Lightbulb,
  Factory,
} from "lucide-react";
import { useState } from "react";

const initialExpertise = [
  "Computer Science",
  "Civil Engineering",
  "Environmental Science",
  "Agriculture",
  "IoT",
  "Artificial Intelligence",
];

const availableExpertise = [
  "Data Science",
  "Robotics",
  "Renewable Energy",
  "Healthcare Technology",
  "Smart Infrastructure",
  "Cybersecurity",
];

const collaborationOptions = [
  {
    title: "Industry Mentorship",
    description:
      "Connect students and researchers with industry experts for guidance and domain knowledge.",
    icon: Users,
  },
  {
    title: "Funding & Grants",
    description:
      "Explore industry funding opportunities for promising university solutions and prototypes.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Prototype Development",
    description:
      "Collaborate with companies for technical support, testing and prototype development.",
    icon: Lightbulb,
  },
  {
    title: "Field Pilot",
    description:
      "Partner with industry to test university solutions in real-world environments.",
    icon: Factory,
  },
];

export default function UniversityProfilePage() {
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(
    "National Institute of Technology"
  );
  const [email, setEmail] = useState("university@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [location, setLocation] = useState("Ranchi, Jharkhand");

  const [expertise, setExpertise] = useState(initialExpertise);
  const [showExpertiseModal, setShowExpertiseModal] =
    useState(false);

  const [newExpertise, setNewExpertise] = useState("");

  const [selectedCollaboration, setSelectedCollaboration] =
    useState<string | null>(null);

  const addExpertise = () => {
    const value = newExpertise.trim();

    if (!value) return;

    if (!expertise.includes(value)) {
      setExpertise((current) => [...current, value]);
    }

    setNewExpertise("");
    setShowExpertiseModal(false);
  };

  const removeExpertise = (item: string) => {
    setExpertise((current) =>
      current.filter((expertiseItem) => expertiseItem !== item)
    );
  };

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
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Teams
            </a>

            <a
            href="/university/profile"
            className="text-sm font-semibold text-teal-600"
          >
            Profile
          </a>

          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              University Profile
            </h2>

            <p className="mt-1 text-slate-500">
              Manage your university information and account details.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white transition hover:bg-teal-700"
          >
            {editing ? (
              <>
                <Save className="h-5 w-5" />
                Save Changes
              </>
            ) : (
              <>
                <Edit3 className="h-5 w-5" />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {/* ================= PROFILE + DETAILS ================= */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-100">
                <GraduationCap className="h-12 w-12 text-teal-600" />
              </div>

              <h3 className="mt-4 text-xl font-bold">
                {name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                University Partner
              </p>

              <div className="mt-4 flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Verified Institution
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <div className="mb-4 flex items-center gap-3">
                <Building2 className="h-5 w-5 text-teal-600" />

                <div>
                  <p className="text-xs text-slate-500">
                    Institution Type
                  </p>

                  <p className="font-medium">University</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-teal-600" />

                <div>
                  <p className="text-xs text-slate-500">
                    Active Members
                  </p>

                  <p className="font-medium">128 Members</p>
                </div>
              </div>
            </div>
          </div>

          {/* Institution Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h3 className="mb-6 text-xl font-semibold">
              Institution Information
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  University Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!editing}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!editing}
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!editing}
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Location
                </label>

                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={!editing}
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Expertise */}
            <div className="mt-7 border-t border-slate-200 pt-6">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-semibold">
                  Areas of Expertise
                </h4>

                <button
                  type="button"
                  onClick={() => setShowExpertiseModal(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-700 transition hover:bg-teal-100"
                >
                  <Plus className="h-4 w-4" />
                  Add Expertise
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {expertise.map((item) => (
                  <span
                    key={item}
                    className="group flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-sm text-teal-700"
                  >
                    {item}

                    <button
                      type="button"
                      onClick={() => removeExpertise(item)}
                      className="hidden rounded-full text-teal-500 transition hover:text-red-500 group-hover:block"
                      aria-label={`Remove ${item}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= ACCOUNT STATS ================= */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <a
            href="/university/problems"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-50 hover:shadow-md"
          >
            <p className="text-sm text-slate-500 group-hover:text-teal-700">
              Matched Problems
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900 group-hover:text-teal-700">
              24
            </p>
          </a>

          <a
            href="/university/problems"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-50 hover:shadow-md"
          >
            <p className="text-sm text-slate-500 group-hover:text-teal-700">
              Accepted Problems
            </p>

            <p className="mt-2 text-2xl font-bold text-teal-600 group-hover:text-teal-700">
              8
            </p>
          </a>

          <a
            href="/university/projects"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-50 hover:shadow-md"
          >
            <p className="text-sm text-slate-500 group-hover:text-teal-700">
              Active Projects
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900 group-hover:text-teal-700">
              5
            </p>
          </a>

          <a
            href="/university/solutions"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-50 hover:shadow-md"
          >
            <p className="text-sm text-slate-500 group-hover:text-teal-700">
              Solutions
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900 group-hover:text-teal-700">
              12
            </p>
          </a>
        </div>

        {/* ================= INDUSTRY COLLABORATION ================= */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-teal-200 bg-teal-50">
          <div className="p-6 md:p-7">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100">
                    <Handshake className="h-6 w-6 text-teal-700" />
                  </div>

                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-teal-700">
                      Industry Collaboration
                    </p>

                    <h3 className="text-2xl font-bold text-slate-900">
                      Turn university ideas into real-world impact.
                    </h3>
                  </div>
                </div>

                <p className="text-sm leading-6 text-slate-600">
                  Connect your university with industry partners for
                  mentorship, funding, prototype development and
                  real-world pilot opportunities.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedCollaboration("Industry Collaboration")
                }
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-700"
              >
                Explore Collaboration
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Collaboration Options */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {collaborationOptions.map((option) => {
                const Icon = option.icon;

                return (
                  <button
                    key={option.title}
                    type="button"
                    onClick={() =>
                      setSelectedCollaboration(option.title)
                    }
                    className="group rounded-xl border border-teal-100 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:border-teal-400 hover:shadow-md"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                      <Icon className="h-5 w-5 text-teal-600" />
                    </div>

                    <h4 className="font-semibold text-slate-900 group-hover:text-teal-700">
                      {option.title}
                    </h4>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================= ADD EXPERTISE MODAL ================= */}
      {showExpertiseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Add Expertise
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Add another area your university specializes in.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowExpertiseModal(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Expertise
            </label>

            <input
              value={newExpertise}
              onChange={(e) => setNewExpertise(e.target.value)}
              placeholder="e.g. Robotics"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {availableExpertise.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setNewExpertise(item)}
                  className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 transition hover:bg-teal-100"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowExpertiseModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:border-red-400 hover:bg-red-50 hover:text-red-600"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={addExpertise}
                className="rounded-xl bg-teal-600 px-4 py-3 font-semibold text-white transition hover:bg-teal-700"
              >
                Add Expertise
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= INDUSTRY MODAL ================= */}
      {selectedCollaboration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100">
                  <Handshake className="h-6 w-6 text-teal-600" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedCollaboration}
                  </h3>

                  <p className="text-sm text-slate-500">
                    Industry partnership opportunity
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCollaboration(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {[
                {
                  name: "Tata Consultancy Services",
                  focus: "Technology • AI • Digital Solutions",
                },
                {
                  name: "Infosys",
                  focus: "AI • Software • Smart Solutions",
                },
                {
                  name: "Tata Motors",
                  focus: "Automotive • Mobility • Engineering",
                },
                {
                  name: "Larsen & Toubro",
                  focus: "Infrastructure • Engineering • Construction",
                },
              ].map((industry) => (
                <div
                  key={industry.name}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-50"
                >
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {industry.name}
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      {industry.focus}
                    </p>
                  </div>

                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                    Potential Partner
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedCollaboration(null)}
                className="rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:border-red-400 hover:bg-red-50 hover:text-red-600"
              >
                Close
              </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCollaboration("Industry Opportunities");
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 font-semibold text-white transition hover:bg-teal-700"
            >
              View Opportunities
              <ArrowRight className="h-4 w-4" />
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