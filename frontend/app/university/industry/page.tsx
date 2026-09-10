
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

type IndustryPartner = {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  supports: string[];
  fundingAvailable: boolean;
  technology: string[];
  collaborations: number;
};

const industryPartners: IndustryPartner[] = [
  {
    id: "abc-technologies",
    name: "ABC Technologies",
    type: "Technology & Engineering",
    location: "Ranchi, Jharkhand",
    description:
      "Technology company supporting innovation projects through hardware, technical expertise, testing and field deployment.",
    supports: [
      "Funding",
      "Hardware",
      "Testing",
      "Mentorship",
      "Technical Support",
    ],
    fundingAvailable: true,
    technology: ["IoT", "AI", "Smart Infrastructure"],
    collaborations: 8,
  },
  {
    id: "tata-technologies",
    name: "Tata Technologies",
    type: "Engineering & Manufacturing",
    location: "Jamshedpur, Jharkhand",
    description:
      "Engineering and manufacturing partner interested in prototyping, product development and technology deployment.",
    supports: [
      "Funding",
      "Hardware",
      "Prototyping",
      "Testing",
      "Technical Support",
    ],
    fundingAvailable: true,
    technology: ["IoT", "Manufacturing", "Automation"],
    collaborations: 12,
  },
  {
    id: "tech-mahindra",
    name: "Tech Mahindra",
    type: "IT & Digital Solutions",
    location: "Ranchi, Jharkhand",
    description:
      "Digital technology partner providing software expertise, mentorship, testing and technical support for innovation projects.",
    supports: [
      "Funding",
      "Mentorship",
      "Testing",
      "Technical Support",
    ],
    fundingAvailable: true,
    technology: ["AI", "Cloud", "Data Analytics"],
    collaborations: 10,
  },
  {
    id: "ranchi-innovation-labs",
    name: "Ranchi Innovation Labs",
    type: "Research & Innovation",
    location: "Ranchi, Jharkhand",
    description:
      "Innovation-focused organization supporting student prototypes, testing, mentoring and early-stage field pilots.",
    supports: [
      "Mentorship",
      "Testing",
      "Prototyping",
      "Field Pilot",
    ],
    fundingAvailable: false,
    technology: ["IoT", "CleanTech", "Smart Infrastructure"],
    collaborations: 6,
  },
  {
    id: "green-tech-solutions",
    name: "GreenTech Solutions",
    type: "Clean Technology",
    location: "Bokaro, Jharkhand",
    description:
      "Clean technology organization supporting environmental, water and energy solutions through hardware and field deployment.",
    supports: [
      "Funding",
      "Hardware",
      "Field Pilot",
      "Testing",
    ],
    fundingAvailable: true,
    technology: ["CleanTech", "Renewable Energy", "Water Management"],
    collaborations: 5,
  },
  {
    id: "digital-impact-foundation",
    name: "Digital Impact Foundation",
    type: "Social Innovation",
    location: "Hazaribagh, Jharkhand",
    description:
      "Social innovation partner focused on technology solutions that improve public services and community outcomes.",
    supports: [
      "Funding",
      "Mentorship",
      "Field Pilot",
      "Technical Support",
    ],
    fundingAvailable: true,
    technology: ["Digital Platforms", "AI", "Public Services"],
    collaborations: 7,
  },
];

export default function IndustryPartnersPage() {
  const [search, setSearch] = useState("");
  const [industryType, setIndustryType] = useState("All");
  const [location, setLocation] = useState("All");
  const [supportType, setSupportType] = useState("All");
  const [fundingOnly, setFundingOnly] = useState(false);

  const filteredPartners = useMemo(() => {
    return industryPartners.filter((partner) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        partner.name.toLowerCase().includes(searchText) ||
        partner.type.toLowerCase().includes(searchText) ||
        partner.location.toLowerCase().includes(searchText) ||
        partner.technology.some((item) =>
          item.toLowerCase().includes(searchText)
        );

      const matchesIndustry =
        industryType === "All" || partner.type === industryType;

      const matchesLocation =
        location === "All" || partner.location === location;

      const matchesSupport =
        supportType === "All" ||
        partner.supports.includes(supportType);

      const matchesFunding =
        !fundingOnly || partner.fundingAvailable;

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesLocation &&
        matchesSupport &&
        matchesFunding
      );
    });
  }, [
    search,
    industryType,
    location,
    supportType,
    fundingOnly,
  ]);

  const clearFilters = () => {
    setSearch("");
    setIndustryType("All");
    setLocation("All");
    setSupportType("All");
    setFundingOnly(false);
  };

  const filtersApplied =
    search ||
    industryType !== "All" ||
    location !== "All" ||
    supportType !== "All" ||
    fundingOnly;

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
          href="/university/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        {/* HERO */}
        <section className="mt-6 rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-700 to-teal-800 p-7 text-white shadow-sm">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-3xl">

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <Building2 className="h-6 w-6" />
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Find Industry Partners
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-teal-50 sm:text-base">
                Connect your university project with companies that can
                provide funding, technical expertise, hardware, testing,
                mentorship and field deployment support.
              </p>

            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur">

              <p className="text-xs font-medium text-teal-100">
                Available Partners
              </p>

              <p className="mt-1 text-3xl font-black">
                {industryPartners.length}
              </p>

            </div>

          </div>

        </section>

        {/* SEARCH + FILTERS */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-2">

            <SlidersHorizontal className="h-5 w-5 text-teal-700" />

            <h2 className="text-base font-bold text-slate-900">
              Search & Filters
            </h2>

          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">

            {/* Search */}
            <div className="relative">

              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search company, technology or domain..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />

            </div>

            {/* Industry Type */}
            <select
              value={industryType}
              onChange={(event) => setIndustryType(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="All">All Industry Types</option>
              <option value="Technology & Engineering">
                Technology & Engineering
              </option>
              <option value="Engineering & Manufacturing">
                Engineering & Manufacturing
              </option>
              <option value="IT & Digital Solutions">
                IT & Digital Solutions
              </option>
              <option value="Research & Innovation">
                Research & Innovation
              </option>
              <option value="Clean Technology">
                Clean Technology
              </option>
              <option value="Social Innovation">
                Social Innovation
              </option>
            </select>

            {/* Location */}
            <select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="All">All Locations</option>
              <option value="Ranchi, Jharkhand">
                Ranchi
              </option>
              <option value="Jamshedpur, Jharkhand">
                Jamshedpur
              </option>
              <option value="Bokaro, Jharkhand">
                Bokaro
              </option>
              <option value="Hazaribagh, Jharkhand">
                Hazaribagh
              </option>
            </select>

            {/* Support */}
            <select
              value={supportType}
              onChange={(event) => setSupportType(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="All">All Support Types</option>
              <option value="Funding">Funding</option>
              <option value="Hardware">Hardware</option>
              <option value="Testing">Testing</option>
              <option value="Mentorship">Mentorship</option>
              <option value="Prototyping">Prototyping</option>
              <option value="Field Pilot">Field Pilot</option>
              <option value="Technical Support">
                Technical Support
              </option>
            </select>

            {/* Funding */}
            <button
              type="button"
              onClick={() => setFundingOnly((prev) => !prev)}
              className={
                fundingOnly
                  ? "rounded-xl border border-teal-600 bg-teal-700 px-4 py-3 text-sm font-bold text-white transition"
                  : "rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50"
              }
            >
              Funding Available
            </button>

          </div>

          {filtersApplied && (
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">

              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-800">
                  {filteredPartners.length}
                </span>{" "}
                matching partners
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>

            </div>
          )}

        </section>

        {/* PARTNERS */}
        <section className="mt-6">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-black text-slate-900">
                Industry Partners
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose a partner based on your project's support needs.
              </p>

            </div>

            <span className="text-sm font-semibold text-slate-500">
              {filteredPartners.length} Partners
            </span>

          </div>

          {filteredPartners.length > 0 ? (

            <div className="grid gap-5 lg:grid-cols-2">

              {filteredPartners.map((partner) => (

                <article
                  key={partner.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
                >

                  {/* Company Header */}
                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-start gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                        <Building2 className="h-6 w-6 text-teal-700" />
                      </div>

                      <div>

                        <h3 className="text-lg font-black text-slate-900">
                          {partner.name}
                        </h3>

                        <p className="mt-1 text-sm font-semibold text-teal-700">
                          {partner.type}
                        </p>

                      </div>

                    </div>

                    {partner.fundingAvailable && (
                      <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                        Funding Available
                      </span>
                    )}

                  </div>

                  {/* Location */}
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">

                    <MapPin className="h-4 w-4 text-slate-400" />

                    {partner.location}

                  </div>

                  {/* Description */}
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {partner.description}
                  </p>

                  {/* Support */}
                  <div className="mt-5">

                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Supports
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">

                      {partner.supports.map((support) => (

                        <span
                          key={support}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                        >
                          {support}
                        </span>

                      ))}

                    </div>

                  </div>

                  {/* Technology */}
                  <div className="mt-5">

                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Technology & Domains
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">

                      {partner.technology.map((technology) => (

                        <span
                          key={technology}
                          className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700"
                        >
                          {technology}
                        </span>

                      ))}

                    </div>

                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">

                    <div className="flex items-center gap-2 text-xs text-slate-500">

                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                      {partner.collaborations} previous collaborations

                    </div>

                    <Link
                      href={`/university/industry/${partner.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800"
                    >
                      View Partner
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Building2 className="h-6 w-6 text-slate-400" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No matching industry partners
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try changing your search or filters to find more industry
                partners.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
              >
                Clear Filters
              </button>

            </div>

          )}

        </section>

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

