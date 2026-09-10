"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Edit3,
  Globe2,
  Handshake,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";

export default function IndustryProfilePage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [company, setCompany] = useState({
    name: "Tata Technologies",
    type: "Technology & Engineering",
    email: "industry@example.com",
    phone: "+91 98765 43210",
    website: "www.example.com",
    location: "Ranchi, Jharkhand",
    about:
      "Technology and engineering organization supporting innovation projects through technical expertise, prototyping, testing and field deployment.",
  });

  const handleSave = () => {
    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
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
        className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
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
        className="text-sm font-semibold text-teal-700"
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
        <div className="mx-auto max-w-7xl px-6 py-9">
          <Link
            href="/industry/dashboard"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-teal-100 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-teal-200">
                Industry Account
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Company Profile
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-teal-100/80 sm:text-base">
                Manage your organization details, collaboration interests and
                participation information on SamadhanX.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-100">
              <CheckCircle2 size={15} />
              Verified Industry Partner
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Main */}
          <div className="space-y-6">
            {/* Company Details */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100">
                    <Building2
                      size={27}
                      className="text-teal-700"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                      Organization
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      {company.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {company.type}
                    </p>
                  </div>
                </div>

                {!editing ? (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:text-teal-700"
                  >
                    <Edit3 size={15} />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800"
                  >
                    <Save size={15} />
                    Save Changes
                  </button>
                )}
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <ProfileField
                  label="Company Name"
                  value={company.name}
                  editing={editing}
                  onChange={(value) =>
                    setCompany({ ...company, name: value })
                  }
                />

                <ProfileField
                  label="Organization Type"
                  value={company.type}
                  editing={editing}
                  onChange={(value) =>
                    setCompany({ ...company, type: value })
                  }
                />

                <ProfileField
                  label="Email"
                  value={company.email}
                  editing={editing}
                  onChange={(value) =>
                    setCompany({ ...company, email: value })
                  }
                />

                <ProfileField
                  label="Phone"
                  value={company.phone}
                  editing={editing}
                  onChange={(value) =>
                    setCompany({ ...company, phone: value })
                  }
                />

                <ProfileField
                  label="Website"
                  value={company.website}
                  editing={editing}
                  onChange={(value) =>
                    setCompany({ ...company, website: value })
                  }
                />

                <ProfileField
                  label="Location"
                  value={company.location}
                  editing={editing}
                  onChange={(value) =>
                    setCompany({ ...company, location: value })
                  }
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  About Organization
                </label>

                {editing ? (
                  <textarea
                    value={company.about}
                    onChange={(event) =>
                      setCompany({
                        ...company,
                        about: event.target.value,
                      })
                    }
                    rows={5}
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                ) : (
                  <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    {company.about}
                  </p>
                )}
              </div>

              {saved && (
                <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 size={17} />
                  Profile changes saved successfully.
                </div>
              )}
            </section>

            {/* Collaboration Interests */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <SectionHeading
                icon={Handshake}
                eyebrow="Participation"
                title="Collaboration Interests"
              />

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Areas where your organization can contribute to university-led
                innovation projects.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <InterestCard
                  title="Funding & Investment"
                  description="Support promising projects financially."
                  active
                />

                <InterestCard
                  title="Technical Support"
                  description="Provide engineering and technical expertise."
                  active
                />

                <InterestCard
                  title="Testing & Validation"
                  description="Help validate prototypes in real conditions."
                  active
                />

                <InterestCard
                  title="Prototyping & Manufacturing"
                  description="Support product development and production."
                  active
                />

                <InterestCard
                  title="Field Pilot"
                  description="Support real-world deployment and testing."
                  active
                />

                <InterestCard
                  title="Mentorship"
                  description="Guide university teams with industry expertise."
                  active
                />
              </div>
            </section>

            {/* Organization Goals */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <SectionHeading
                icon={Target}
                eyebrow="Strategic Focus"
                title="Innovation Goals"
              />

              <div className="mt-5 space-y-3">
                <GoalRow text="Support solutions addressing real community challenges" />
                <GoalRow text="Enable university-industry collaboration" />
                <GoalRow text="Validate promising prototypes in field environments" />
                <GoalRow text="Support scalable technology and deployment" />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Account Status */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Account Status
              </p>

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <ShieldCheck
                    size={20}
                    className="text-emerald-700"
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-emerald-800">
                    Verified
                  </p>

                  <p className="mt-0.5 text-xs text-emerald-700/70">
                    Industry partner account
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <StatusRow
                  label="Profile Completion"
                  value="92%"
                />

                <StatusRow
                  label="Partnerships"
                  value="7 Active"
                />

                <StatusRow
                  label="Projects Supported"
                  value="12"
                />
              </div>
            </section>

            {/* Contact Information */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Contact Information
              </p>

              <div className="mt-5 space-y-4">
                <ContactRow
                  icon={Mail}
                  label="Email"
                  value={company.email}
                />

                <ContactRow
                  icon={Phone}
                  label="Phone"
                  value={company.phone}
                />

                <ContactRow
                  icon={Globe2}
                  label="Website"
                  value={company.website}
                />

                <ContactRow
                  icon={MapPin}
                  label="Location"
                  value={company.location}
                />
              </div>
            </section>

            {/* Partnership Summary */}
            <section className="rounded-3xl border border-teal-200 bg-teal-50/70 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100">
                <Users size={19} className="text-teal-700" />
              </div>

              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-teal-700">
                Partnership Role
              </p>

              <h3 className="mt-1 text-base font-bold text-slate-900">
                Industry Innovation Partner
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Your organization can support projects through funding,
                expertise, testing, prototyping and field deployment.
              </p>

              <Link
                href="/industry/projects"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-800"
              >
                Explore Projects
                <span>→</span>
              </Link>
            </section>
          </aside>
        </div>
      </div>

      <footer className="mt-8 border-t border-slate-200 bg-white py-5 text-center">
        <p className="text-xs text-slate-400">
          © 2026 SamadhanX • Ideas → Action → Impact
        </p>
      </footer>
    </main>
  );
}

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: typeof Handshake;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100">
        <Icon size={19} className="text-teal-700" />
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900">
          {title}
        </h2>
      </div>
    </div>
  );
}

function ProfileField({
  label,
  value,
  editing,
  onChange,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>

      {editing ? (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {value}
        </div>
      )}
    </div>
  );
}

function InterestCard({
  title,
  description,
  active,
}: {
  title: string;
  description: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        active
          ? "border-teal-200 bg-teal-50/60"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            active ? "bg-teal-100" : "bg-slate-200"
          }`}
        >
          <CheckCircle2
            size={16}
            className={active ? "text-teal-700" : "text-slate-400"}
          />
        </div>

        <div>
          <p className="text-sm font-bold text-slate-800">{title}</p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function GoalRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <CheckCircle2
        size={17}
        className="mt-0.5 shrink-0 text-teal-700"
      />

      <p className="text-sm leading-5 text-slate-600">{text}</p>
    </div>
  );
}

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-slate-500">{label}</span>

      <span className="text-sm font-bold text-slate-800">{value}</span>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon size={16} className="text-slate-500" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>

        <p className="mt-0.5 break-words text-sm font-semibold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}