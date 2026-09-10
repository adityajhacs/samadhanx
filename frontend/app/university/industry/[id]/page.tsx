
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Handshake,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";

type IndustryPartner = {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  expertise: string[];
  supports: string[];
  previousCollaborations: {
    project: string;
    university: string;
    support: string;
    status: string;
  }[];
  partnershipInfo: string;
};

const partners: IndustryPartner[] = [
  {
    id: "abc-technologies",
    name: "ABC Technologies",
    type: "Technology & Engineering",
    location: "Ranchi, Jharkhand",
    description:
      "Technology company supporting university innovation projects through hardware, technical expertise, testing, mentorship and field deployment.",
    expertise: [
      "IoT",
      "AI",
      "Smart Infrastructure",
      "Embedded Systems",
    ],
    supports: [
      "Funding",
      "Hardware",
      "Testing",
      "Mentorship",
      "Prototyping",
      "Field Pilot",
      "Technical Support",
    ],
    previousCollaborations: [
      {
        project: "Smart Road Monitoring",
        university: "BIT Mesra",
        support: "Technical Support",
        status: "Completed",
      },
      {
        project: "Community Water Monitoring",
        university: "NIT Jamshedpur",
        support: "Hardware + Testing",
        status: "In Progress",
      },
    ],
    partnershipInfo:
      "ABC Technologies works with universities on prototype development, technical validation and real-world deployment of civic technology solutions.",
  },
  {
    id: "tata-technologies",
    name: "Tata Technologies",
    type: "Engineering & Manufacturing",
    location: "Jamshedpur, Jharkhand",
    description:
      "Engineering and manufacturing partner supporting product development, prototyping, hardware integration and technology deployment.",
    expertise: [
      "Manufacturing",
      "IoT",
      "Automation",
      "Product Engineering",
    ],
    supports: [
      "Funding",
      "Hardware",
      "Prototyping",
      "Testing",
      "Technical Support",
    ],
    previousCollaborations: [
      {
        project: "Industrial Water Monitoring",
        university: "NIT Jamshedpur",
        support: "Hardware + Testing",
        status: "Completed",
      },
      {
        project: "Smart Energy Prototype",
        university: "BIT Mesra",
        support: "Prototyping",
        status: "In Progress",
      },
    ],
    partnershipInfo:
      "Tata Technologies supports engineering-focused university projects with product development expertise, prototyping facilities and technical validation.",
  },
  {
    id: "tech-mahindra",
    name: "Tech Mahindra",
    type: "IT & Digital Solutions",
    location: "Ranchi, Jharkhand",
    description:
      "Digital technology partner providing software expertise, mentorship, testing and technical support for innovation projects.",
    expertise: [
      "AI",
      "Cloud",
      "Data Analytics",
      "Digital Platforms",
    ],
    supports: [
      "Funding",
      "Mentorship",
      "Testing",
      "Technical Support",
    ],
    previousCollaborations: [
      {
        project: "Citizen Complaint Analytics",
        university: "BIT Mesra",
        support: "Mentorship",
        status: "Completed",
      },
      {
        project: "Digital Public Services",
        university: "CUJ",
        support: "Technical Support",
        status: "Completed",
      },
    ],
    partnershipInfo:
      "Tech Mahindra collaborates with academic teams on digital solutions, AI applications and technology-led public service innovation.",
  },
  {
    id: "ranchi-innovation-labs",
    name: "Ranchi Innovation Labs",
    type: "Research & Innovation",
    location: "Ranchi, Jharkhand",
    description:
      "Innovation-focused organization supporting student prototypes, testing, mentoring and early-stage field pilots.",
    expertise: [
      "IoT",
      "CleanTech",
      "Smart Infrastructure",
      "Research",
    ],
    supports: [
      "Mentorship",
      "Testing",
      "Prototyping",
      "Field Pilot",
    ],
    previousCollaborations: [
      {
        project: "Solar Street Lighting",
        university: "BIT Mesra",
        support: "Testing + Field Pilot",
        status: "Completed",
      },
      {
        project: "Waste Collection Optimization",
        university: "NIT Jamshedpur",
        support: "Mentorship",
        status: "In Progress",
      },
    ],
    partnershipInfo:
      "Ranchi Innovation Labs helps university teams validate early-stage ideas and prepare promising prototypes for field deployment.",
  },
  {
    id: "green-tech-solutions",
    name: "GreenTech Solutions",
    type: "Clean Technology",
    location: "Bokaro, Jharkhand",
    description:
      "Clean technology organization supporting environmental, water and energy solutions through hardware and field deployment.",
    expertise: [
      "CleanTech",
      "Renewable Energy",
      "Water Management",
      "Sensors",
    ],
    supports: [
      "Funding",
      "Hardware",
      "Field Pilot",
      "Testing",
    ],
    previousCollaborations: [
      {
        project: "Solar Water Pump",
        university: "BIT Mesra",
        support: "Hardware + Field Pilot",
        status: "Completed",
      },
      {
        project: "Community Water Monitoring",
        university: "CUJ",
        support: "Funding",
        status: "In Progress",
      },
    ],
    partnershipInfo:
      "GreenTech Solutions focuses on sustainable technology projects with practical applications in water, energy and environmental management.",
  },
  {
    id: "digital-impact-foundation",
    name: "Digital Impact Foundation",
    type: "Social Innovation",
    location: "Hazaribagh, Jharkhand",
    description:
      "Social innovation partner focused on technology solutions that improve public services and community outcomes.",
    expertise: [
      "Digital Platforms",
      "AI",
      "Public Services",
      "Community Technology",
    ],
    supports: [
      "Funding",
      "Mentorship",
      "Field Pilot",
      "Technical Support",
    ],
    previousCollaborations: [
      {
        project: "Digital Farmer Support",
        university: "NIT Jamshedpur",
        support: "Mentorship + Field Pilot",
        status: "Completed",
      },
      {
        project: "Rural Health Platform",
        university: "CUJ",
        support: "Funding",
        status: "In Progress",
      },
    ],
    partnershipInfo:
      "Digital Impact Foundation partners with universities to move socially useful technology from research and prototypes into community use.",
  },
];

export default function IndustryPartnerDetails() {
  const params = useParams();

  const partnerId = String(params?.id ?? "");

  const partner =
    partners.find((item) => item.id === partnerId) ?? partners[0];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            href="/university/dashboard"
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

          <div className="hidden items-center gap-7 md:flex">

            <Link
              href="/university/dashboard"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Dashboard
            </Link>

            <Link
              href="/university/problems"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Problems
            </Link>

            <Link
              href="/university/projects"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Projects
            </Link>

            <Link
              href="/university/solutions"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Solutions
            </Link>

            <Link
              href="/university/teams"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Teams
            </Link>

            <Link
              href="/university/profile"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Profile
            </Link>

          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* BACK */}
        <Link
          href="/university/industry"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Industry Partners
        </Link>

        {/* ================= PARTNER HEADER ================= */}
        <section className="mt-6 rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-700 to-teal-800 p-7 text-white shadow-sm">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <Building2 className="h-8 w-8" />
              </div>

              <div>

                <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                  Verified Industry Partner
                </span>

                <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  {partner.name}
                </h1>

                <p className="mt-2 text-sm font-semibold text-teal-100">
                  {partner.type}
                </p>

                <div className="mt-3 flex items-center gap-2 text-sm text-teal-50">
                  <MapPin className="h-4 w-4" />
                  {partner.location}
                </div>

              </div>

            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur">

              <p className="text-xs text-teal-100">
                Previous Collaborations
              </p>

              <p className="mt-1 text-3xl font-black">
                {partner.previousCollaborations.length}
              </p>

              <p className="text-xs text-teal-100">
                Recent partnerships
              </p>

            </div>

          </div>

        </section>

        {/* ================= CONTENT ================= */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">

          {/* ================= LEFT ================= */}
          <div className="space-y-6">

            {/* ABOUT */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                  <Building2 className="h-5 w-5 text-teal-700" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    About the Partner
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Company profile and collaboration focus.
                  </p>
                </div>

              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                {partner.description}
              </p>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">

                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Partnership Information
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {partner.partnershipInfo}
                </p>

              </div>

            </section>

            {/* EXPERTISE */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-bold text-slate-900">
                Technology & Expertise
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Areas where this partner can support university innovation.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">

                {partner.expertise.map((item) => (
                  <span
                    key={item}
                    className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700"
                  >
                    {item}
                  </span>
                ))}

              </div>

            </section>

            {/* SUPPORT */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <Handshake className="h-5 w-5 text-emerald-700" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Available Support
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Support types available for university projects.
                  </p>
                </div>

              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">

                {partner.supports.map((support) => (
                  <div
                    key={support}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                    <span className="text-sm font-bold text-slate-700">
                      {support}
                    </span>
                  </div>
                ))}

              </div>

            </section>

            {/* PREVIOUS COLLABORATIONS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Users className="h-5 w-5 text-slate-700" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Previous Collaborations
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Examples of previous university-industry partnerships.
                  </p>
                </div>

              </div>

              <div className="mt-5 space-y-4">

                {partner.previousCollaborations.map((collaboration) => (

                  <div
                    key={`${collaboration.project}-${collaboration.university}`}
                    className="rounded-xl border border-slate-200 p-5"
                  >

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                      <div>

                        <h3 className="text-sm font-bold text-slate-900">
                          {collaboration.project}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {collaboration.university}
                        </p>

                      </div>

                      <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                        {collaboration.status}
                      </span>

                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                      <Handshake className="h-4 w-4 text-teal-700" />
                      {collaboration.support}
                    </div>

                  </div>

                ))}

              </div>

            </section>

          </div>

          {/* ================= RIGHT ================= */}
          <div className="space-y-6">

            {/* REQUEST COLLABORATION */}
            <section className="rounded-2xl border border-teal-200 bg-white p-6 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
                <Handshake className="h-6 w-6 text-teal-700" />
              </div>

              <h2 className="mt-4 text-xl font-black text-slate-900">
                Partner With {partner.name}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Request funding, technical support, testing, mentorship,
                prototyping or field deployment support for your project.
              </p>

              {/* IMPORTANT:
                  Partner ID is passed to Project Workspace
                  so the correct company is pre-selected.
              */}
              <Link
                href={`/university/projects/1?partner=${partner.id}`}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-teal-800"
              >
                <Handshake className="h-4 w-4" />
                Request Collaboration
              </Link>

            </section>

            {/* PARTNERSHIP INFORMATION */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <ShieldCheck className="h-5 w-5 text-emerald-600" />

                <h2 className="text-base font-bold text-slate-900">
                  Partnership Information
                </h2>

              </div>

              <div className="mt-5 space-y-4">

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Collaboration Model
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    University ↔ Industry
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Engagement
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    Project-based support
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Request Process
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-600">
                    Request → Review → Acceptance → Project Support
                  </p>
                </div>

              </div>

            </section>

            {/* CONTACT */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <MessageSquare className="h-5 w-5 text-slate-700" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Partnership Contact
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Communication can be managed through the collaboration
                    workspace.
                  </p>
                </div>

              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4">

                <p className="text-sm font-bold text-slate-800">
                  Industry Partnership Team
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Partnership requests are reviewed before collaboration
                  begins.
                </p>

              </div>

            </section>

          </div>

        </div>

      </div>

      {/* ================= FOOTER ================= */}
      <footer className="mt-10 border-t border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

          <p className="text-xs font-medium text-slate-400">
            © 2026 SamadhanX • Ideas → Action → Impact
          </p>

          <p className="text-xs text-slate-400">
            University Innovation Portal
          </p>

        </div>

      </footer>

    </main>
  );
}

