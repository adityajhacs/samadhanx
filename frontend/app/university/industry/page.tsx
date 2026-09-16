"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

import { apiRequest, getAuthToken } from "@/lib/api/client";

type IndustryPartnerResponse = {
  id: string;
  name: string;
  industry_type?: string | null;
  description?: string | null;
  location?: string | null;
  contact_email?: string | null;
  created_at?: string | null;
};

type CollaborationResponse = {
  id: string;
  project_id?: string | null;
  industry_partner_id?: string | null;
  collaboration_type?: string | null;
  amount?: string | number | null;
  status?: string | null;
  description?: string | null;
  created_at?: string | null;
};

type IndustryPartner = {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  supports: string[];
  fundingAvailable: boolean;
  collaborations: number;
};

const SUPPORT_LABELS: Record<string, string> = {
  FUNDING: "Funding",
  MENTORSHIP: "Mentorship",
  HARDWARE: "Hardware",
  TESTING: "Testing",
  PROTOTYPING: "Prototyping",
};

const SUPPORT_TYPES = [
  "Funding",
  "Hardware",
  "Testing",
  "Mentorship",
  "Prototyping",
];

export default function IndustryPartnersPage() {
  const [partners, setPartners] = useState<IndustryPartnerResponse[]>(
    []
  );

  const [collaborations, setCollaborations] = useState<
    CollaborationResponse[]
  >([]);

  const [search, setSearch] = useState("");
  const [industryType, setIndustryType] = useState("All");
  const [location, setLocation] = useState("All");
  const [supportType, setSupportType] = useState("All");
  const [fundingOnly, setFundingOnly] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // LOAD INDUSTRY PARTNERS + COLLABORATIONS
  // ============================================================

  useEffect(() => {
    async function loadData() {
      const token = getAuthToken();

      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [industryData, collaborationData] =
          await Promise.all([
            apiRequest<IndustryPartnerResponse[]>(
              "/api/industry",
              {
                method: "GET",
                token,
              }
            ),
            apiRequest<CollaborationResponse[]>(
              "/api/collaborations",
              {
                method: "GET",
                token,
              }
            ),
          ]);

        setPartners(industryData);
        setCollaborations(collaborationData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load industry partners."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ============================================================
  // COMBINE INDUSTRY + COLLABORATION DATA
  // ============================================================

  const industryPartners = useMemo<IndustryPartner[]>(() => {
    return partners.map((partner) => {
      const partnerCollaborations = collaborations.filter(
        (collaboration) =>
          collaboration.industry_partner_id === partner.id
      );

      const supports = Array.from(
        new Set(
          partnerCollaborations
            .map(
              (collaboration) =>
                collaboration.collaboration_type
            )
            .filter(
              (type): type is string =>
                Boolean(type && SUPPORT_LABELS[type])
            )
            .map((type) => SUPPORT_LABELS[type])
        )
      );

      const hasFunding = partnerCollaborations.some(
        (collaboration) =>
          collaboration.collaboration_type === "FUNDING" &&
          collaboration.status !== "REJECTED"
      );

      return {
        id: partner.id,
        name: partner.name,
        type: partner.industry_type ?? "Industry Partner",
        location: partner.location ?? "Location not specified",
        description:
          partner.description ??
          "No description has been provided for this industry partner.",
        supports,
        fundingAvailable: hasFunding,
        collaborations: partnerCollaborations.length,
      };
    });
  }, [partners, collaborations]);

  // ============================================================
  // FILTER OPTIONS FROM REAL BACKEND DATA
  // ============================================================

  const industryTypes = useMemo(() => {
    const values = industryPartners
      .map((partner) => partner.type)
      .filter(Boolean);

    return Array.from(new Set(values)).sort();
  }, [industryPartners]);

  const locations = useMemo(() => {
    const values = industryPartners
      .map((partner) => partner.location)
      .filter(Boolean);

    return Array.from(new Set(values)).sort();
  }, [industryPartners]);

  // ============================================================
  // SEARCH + FILTER
  // ============================================================

  const filteredPartners = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return industryPartners.filter((partner) => {
      const matchesSearch =
        !searchText ||
        partner.name.toLowerCase().includes(searchText) ||
        partner.type.toLowerCase().includes(searchText) ||
        partner.location.toLowerCase().includes(searchText) ||
        partner.description.toLowerCase().includes(searchText) ||
        partner.supports.some((support) =>
          support.toLowerCase().includes(searchText)
        );

      const matchesIndustry =
        industryType === "All" ||
        partner.type === industryType;

      const matchesLocation =
        location === "All" ||
        partner.location === location;

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
    industryPartners,
    search,
    industryType,
    location,
    supportType,
    fundingOnly,
  ]);

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const clearFilters = () => {
    setSearch("");
    setIndustryType("All");
    setLocation("All");
    setSupportType("All");
    setFundingOnly(false);
  };

  const filtersApplied =
    Boolean(search) ||
    industryType !== "All" ||
    location !== "All" ||
    supportType !== "All" ||
    fundingOnly;

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
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
          </div>
        </nav>

        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-700" />

            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading industry partners...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // MAIN PAGE
  // ============================================================

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
                Connect your university project with companies
                that can provide funding, technical expertise,
                hardware, testing and mentorship support.
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

        {/* ERROR */}

        {error && (
          <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>
          </section>
        )}

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
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search company, support or domain..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            {/* Industry Type */}

            <select
              value={industryType}
              onChange={(event) =>
                setIndustryType(event.target.value)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="All">
                All Industry Types
              </option>

              {industryTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Location */}

            <select
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="All">
                All Locations
              </option>

              {locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Support */}

            <select
              value={supportType}
              onChange={(event) =>
                setSupportType(event.target.value)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="All">
                All Support Types
              </option>

              {SUPPORT_TYPES.map((support) => (
                <option key={support} value={support}>
                  {support}
                </option>
              ))}
            </select>

            {/* Funding */}

            <button
              type="button"
              onClick={() =>
                setFundingOnly((prev) => !prev)
              }
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
                Choose a partner based on your project's support
                needs.
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

                    {partner.supports.length > 0 ? (
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
                    ) : (
                      <p className="mt-2 text-sm text-slate-400">
                        No collaboration support recorded yet.
                      </p>
                    )}
                  </div>

                  {/* Footer */}

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                      {partner.collaborations} previous{" "}
                      {partner.collaborations === 1
                        ? "collaboration"
                        : "collaborations"}
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
                Try changing your search or filters to find more
                industry partners.
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

