
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

import { apiRequest, getAuthToken } from "@/lib/api/client";

type IndustryPartner = {
  id: string;
  name: string;
  industry_type: string | null;
  description: string | null;
  location: string | null;
  contact_email: string | null;
  created_at: string | null;
};

type Collaboration = {
  id: string;
  project_id: string | null;
  industry_partner_id: string | null;
  collaboration_type: string | null;
  amount: string | number | null;
  status: string | null;
  description: string | null;
  created_at: string | null;
};

const formatCollaborationType = (value: string | null) => {
  if (!value) return "Collaboration";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatStatus = (value: string | null) => {
  if (!value) return "Unknown";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export default function IndustryPartnerDetails() {
  const params = useParams();

  const partnerId = String(params?.id ?? "");

  const [partner, setPartner] = useState<IndustryPartner | null>(null);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!partnerId) return;

    const loadPartnerDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getAuthToken();

        if (!token) {
          throw new Error("Please login first.");
        }

        const [partnerData, collaborationData] = await Promise.all([
          apiRequest<IndustryPartner>(
            `/api/industry/${partnerId}`,
            {
              method: "GET",
              token,
            }
          ),

          apiRequest<Collaboration[]>(
            "/api/collaborations",
            {
              method: "GET",
              token,
            }
          ),
        ]);

        setPartner(partnerData);

        const partnerCollaborations = collaborationData.filter(
          (collaboration) =>
            collaboration.industry_partner_id === partnerId
        );

        setCollaborations(partnerCollaborations);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load industry partner."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPartnerDetails();
  }, [partnerId]);

  const collaborationTypes = useMemo(() => {
    return Array.from(
      new Set(
        collaborations
          .map(
            (collaboration) =>
              collaboration.collaboration_type
          )
          .filter(Boolean)
      )
    ) as string[];
  }, [collaborations]);

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
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
              <Building2 className="h-6 w-6 animate-pulse text-teal-700" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Loading industry partner...
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Fetching partner information from the backend.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !partner) {
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

        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link
            href="/university/industry"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Industry Partners
          </Link>

          <div className="mt-6 rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Unable to load industry partner
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error || "Industry partner not found."}
            </p>

            <Link
              href="/university/industry"
              className="mt-5 inline-flex rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
            >
              Back to Partners
            </Link>
          </div>
        </div>
      </main>
    );
  }

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
                  Industry Partner
                </span>

                <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  {partner.name}
                </h1>

                <p className="mt-2 text-sm font-semibold text-teal-100">
                  {partner.industry_type || "Industry"}
                </p>

                {partner.location && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-teal-50">
                    <MapPin className="h-4 w-4" />
                    {partner.location}
                  </div>
                )}

              </div>

            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur">

              <p className="text-xs text-teal-100">
                Previous Collaborations
              </p>

              <p className="mt-1 text-3xl font-black">
                {collaborations.length}
              </p>

              <p className="text-xs text-teal-100">
                Recorded partnerships
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
                    Company profile and collaboration information.
                  </p>
                </div>

              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                {partner.description ||
                  "No description has been provided for this industry partner."}
              </p>

            </section>

            {/* AVAILABLE SUPPORT */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <Handshake className="h-5 w-5 text-emerald-700" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Collaboration Support
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Collaboration types recorded for this industry partner.
                  </p>
                </div>

              </div>

              {collaborationTypes.length > 0 ? (

                <div className="mt-5 grid gap-3 sm:grid-cols-2">

                  {collaborationTypes.map((type) => (

                    <div
                      key={type}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                      <span className="text-sm font-bold text-slate-700">
                        {formatCollaborationType(type)}
                      </span>
                    </div>

                  ))}

                </div>

              ) : (

                <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                  No collaboration types have been recorded yet.
                </div>

              )}

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
                    Collaboration records available from the backend.
                  </p>
                </div>

              </div>

              {collaborations.length > 0 ? (

                <div className="mt-5 space-y-4">

                  {collaborations.map((collaboration) => (

                    <div
                      key={collaboration.id}
                      className="rounded-xl border border-slate-200 p-5"
                    >

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                        <div>

                          <h3 className="text-sm font-bold text-slate-900">
                            {formatCollaborationType(
                              collaboration.collaboration_type
                            )}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            Project ID:{" "}
                            {collaboration.project_id || "Not linked"}
                          </p>

                        </div>

                        <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                          {formatStatus(collaboration.status)}
                        </span>

                      </div>

                      {collaboration.description && (
                        <p className="mt-4 text-sm leading-6 text-slate-600">
                          {collaboration.description}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">

                        <div className="flex items-center gap-2">
                          <Handshake className="h-4 w-4 text-teal-700" />

                          {formatCollaborationType(
                            collaboration.collaboration_type
                          )}
                        </div>

                        {collaboration.amount !== null &&
                          collaboration.amount !== undefined && (
                            <div className="font-semibold text-slate-700">
                              Amount: ₹
                              {Number(
                                collaboration.amount
                              ).toLocaleString("en-IN")}
                            </div>
                          )}

                      </div>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

                  <Users className="mx-auto h-7 w-7 text-slate-400" />

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No previous collaborations found
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    This partner does not have any recorded collaboration
                    yet.
                  </p>

                </div>

              )}

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
                prototyping or other collaboration support for your project.
              </p>

              <Link
                href={`/university/projects?partner=${partner.id}`}
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
                    Contact information provided by the industry partner.
                  </p>
                </div>

              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4">

                <p className="text-sm font-bold text-slate-800">
                  Industry Partnership Team
                </p>

                {partner.contact_email ? (
                  <p className="mt-2 break-all text-xs text-slate-600">
                    {partner.contact_email}
                  </p>
                ) : (
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    No contact email has been provided.
                  </p>
                )}

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

