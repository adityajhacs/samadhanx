"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Handshake,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  User,
} from "lucide-react";

type CollaborationStatus =
  | "Pending Review"
  | "Under Discussion"
  | "Active"
  | "Completed";

type Collaboration = {
  id: string;
  projectId: string;
  project: string;
  university: string;
  location: string;
  status: CollaborationStatus;
  supportType: string;
  commitment: string;
  contactPerson: string;
  contactRole: string;
};

const collaborations: Collaboration[] = [
  {
    id: "COL-001",
    projectId: "PRJ-001",
    project: "Smart Road Monitoring Pilot",
    university: "Birla Institute of Technology, Mesra",
    location: "Ranchi, Jharkhand",
    status: "Active",
    supportType: "Technical Support",
    commitment: "₹8.5L",
    contactPerson: "Dr. Ankit Kumar",
    contactRole: "Project Coordinator",
  },
  {
    id: "COL-002",
    projectId: "PRJ-002",
    project: "Community Water Monitoring",
    university: "National Institute of Technology, Jamshedpur",
    location: "Jamshedpur, Jharkhand",
    status: "Active",
    supportType: "Field Pilot",
    commitment: "₹6.2L",
    contactPerson: "Dr. Priya Singh",
    contactRole: "Research Lead",
  },
  {
    id: "COL-003",
    projectId: "PRJ-003",
    project: "Rural Sanitation Deployment",
    university: "Central University of Jharkhand",
    location: "Dhanbad, Jharkhand",
    status: "Under Discussion",
    supportType: "Funding",
    commitment: "₹12L",
    contactPerson: "Dr. Rakesh Verma",
    contactRole: "Project Lead",
  },
  {
    id: "COL-004",
    projectId: "PRJ-004",
    project: "Solar Street Infrastructure",
    university: "Birla Institute of Technology, Mesra",
    location: "Bokaro, Jharkhand",
    status: "Pending Review",
    supportType: "Prototyping",
    commitment: "₹4.5L",
    contactPerson: "Prof. Neha Sharma",
    contactRole: "Technical Lead",
  },
  {
    id: "COL-005",
    projectId: "PRJ-005",
    project: "Citizen Complaint Analytics",
    university: "National Institute of Technology, Jamshedpur",
    location: "Hazaribagh, Jharkhand",
    status: "Completed",
    supportType: "Mentorship",
    commitment: "₹3L",
    contactPerson: "Dr. Amit Raj",
    contactRole: "Faculty Coordinator",
  },
  {
    id: "COL-006",
    projectId: "PRJ-006",
    project: "Low-Cost Road Repair Material",
    university: "Birla Institute of Technology, Mesra",
    location: "Deoghar, Jharkhand",
    status: "Pending Review",
    supportType: "Testing",
    commitment: "₹2.75L",
    contactPerson: "Dr. Saurabh Mehta",
    contactRole: "Research Coordinator",
  },
];

const purposes = [
  "Funding Discussion",
  "Technical Support",
  "Testing",
  "Mentorship",
  "Pilot Discussion",
];

export default function ContactProjectTeamPage() {
  const params = useParams();
  const router = useRouter();

  const collaborationId = String(params.id);

  const collaboration =
    collaborations.find((item) => item.id === collaborationId) ??
    collaborations[0];

  const [purpose, setPurpose] = useState(purposes[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    setSent(true);
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* Navbar */}
     <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    
    {/* Logo */}
    <Link
      href="/industry/dashboard"
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

    {/* Navigation */}
    <div className="hidden items-center gap-7 md:flex">

      <Link
        href="/industry/dashboard"
         className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
      >
        Dashboard
      </Link>

      <Link
        href="/industry/projects"
        className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
      >
        Projects
      </Link>

      <Link
        href="/industry/collaborations"
       className="text-sm font-semibold text-teal-700"
      >
        Collaborations
      </Link>

      <Link
        href="/industry/investments"
        className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
      >
        Investments
      </Link>

      <Link
        href="/industry/profile"
        className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
      >
        Profile
      </Link>

      <Link
        href="/industry/projects"
        className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
      >
        Explore Projects
      </Link>

    </div>
  </div>
</nav>
      {/* Header */}
      <section className="border-b border-teal-900 bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link
            href={`/industry/collaborations/${collaboration.id}`}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-teal-100 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Collaboration
          </Link>

          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-teal-700 bg-teal-900/60 px-3 py-1 text-xs font-semibold text-teal-100">
                {collaboration.id}
              </span>

              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                {collaboration.projectId}
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Contact Project Team
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-teal-100/80 sm:text-base">
              Connect with the university project team to discuss
              collaboration requirements, technical support, pilot
              opportunities, or funding.
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {sent ? (
          /* Success State */
          <div className="mx-auto max-w-3xl">
            <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm sm:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2
                  size={34}
                  className="text-emerald-600"
                />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                Message Sent Successfully
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
                Your message has been shared with the project team. They can
                review your request and continue the discussion through the
                collaboration workspace.
              </p>

              <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Request Details
                </p>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Project</span>
                    <span className="text-right font-semibold text-slate-800">
                      {collaboration.project}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Purpose</span>
                    <span className="font-semibold text-teal-700">
                      {purpose}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href={`/industry/collaborations/${collaboration.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
                >
                  Back to Collaboration
                  <ArrowLeft size={16} />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setMessage("");
                  }}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Form */}
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100">
                    <MessageSquare
                      size={21}
                      className="text-teal-700"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Start a Conversation
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Share your requirements or questions with the project
                      team.
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6 sm:p-7"
              >
                {/* Purpose */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Purpose of Contact
                  </label>

                  <div className="relative">
                    <select
                      value={purpose}
                      onChange={(event) =>
                        setPurpose(event.target.value)
                      }
                      className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    >
                      {purposes.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-slate-800"
                    >
                      Message
                    </label>

                    <span className="text-xs text-slate-400">
                      {message.length}/1000
                    </span>
                  </div>

                  <textarea
                    id="message"
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value.slice(0, 1000))
                    }
                    placeholder="Describe what you would like to discuss with the project team..."
                    rows={8}
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400 transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                {/* Info */}
                <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
                  <div className="flex gap-3">
                    <Mail
                      size={18}
                      className="mt-0.5 shrink-0 text-teal-700"
                    />

                    <div>
                      <p className="text-sm font-semibold text-teal-900">
                        Collaboration communication
                      </p>

                      <p className="mt-1 text-xs leading-5 text-teal-800/70">
                        Your request will be associated with this
                        collaboration and shared with the project team for
                        review.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/industry/collaborations/${collaboration.id}`
                      )
                    }
                    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    <Send size={16} />
                    Send Message
                  </button>
                </div>
              </form>
            </section>

            {/* Project Information */}
            <aside className="space-y-5">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Project Team
                </p>

                <h2 className="mt-3 text-lg font-bold text-slate-900">
                  {collaboration.project}
                </h2>

                <div className="mt-5 space-y-4">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                      <User size={17} className="text-teal-700" />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Contact Person
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800">
                        {collaboration.contactPerson}
                      </p>
                      <p className="text-xs text-slate-500">
                        {collaboration.contactRole}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50">
                      <Handshake size={17} className="text-sky-700" />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        University
                      </p>
                      <p className="mt-0.5 text-sm font-semibold leading-5 text-slate-800">
                        {collaboration.university}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                      <MapPin size={17} className="text-emerald-700" />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Location
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800">
                        {collaboration.location}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Collaboration Details
                </p>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Support Type
                    </span>
                    <span className="text-right text-sm font-semibold text-slate-800">
                      {collaboration.supportType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Commitment
                    </span>
                    <span className="text-sm font-bold text-teal-700">
                      {collaboration.commitment}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Status
                    </span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {collaboration.status}
                    </span>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-6 border-t border-slate-200 bg-white py-5 text-center">
        <p className="text-xs text-slate-400">
          © 2026 SamadhanX • Ideas → Action → Impact
        </p>
      </footer>
    </main>
  );
}