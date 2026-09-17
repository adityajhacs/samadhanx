"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPinned, Sparkles, AlertCircle, Building2 } from "lucide-react";
import dynamic from "next/dynamic";

const JharkhandProblemMap = dynamic(
  () => import("@/components/JharkhandProblemMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <p className="text-sm text-slate-500">
          Loading map...
        </p>
      </div>
    ),
  }
);

/* =============================================================
   TYPES
============================================================= */

type BackendProblem = {
  id: string;
  title: string;
  description?: string | null;
  district?: string | null;
  category?: string | null;
  severity_score?: number | string | null;
  status?: string | null;
  citizen_id?: string | null;
  latitude?: number | string | null;
longitude?: number | string | null;
};

type BackendProject = {
  id: string;
  problem_id?: string | null;
  solution_id?: string | null;
  title?: string | null;
  description?: string | null;
  status?: string | null;
  created_by?: string | null;
  deadline?: string | null;
  progress?: number | null;
  budget?: number | null;
  expected_impact?: string | null;
  prototype_name?: string | null;
  prototype_url?: string | null;
  member_count?: number | null;
};

/* =============================================================
   HIGH SEVERITY LOGIC
============================================================= */

const isHighSeverity = (problem: BackendProblem) => {
  const score = Number(problem.severity_score ?? 0);
  const status = (problem.status || "").toLowerCase();

  return (
    (score >= 60 && score < 80) ||
    status === "high"
  );
};

/* =============================================================
   PAGE
============================================================= */

export default function GovernmentProblemMapPage() {
  const [category, setCategory] = useState("All");

  const [problems, setProblems] = useState<BackendProblem[]>([]);
  const [projects, setProjects] = useState<BackendProject[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===========================================================
     FETCH BACKEND DATA
  =========================================================== */

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("access_token") ||
              sessionStorage.getItem("access_token") ||
              localStorage.getItem("token") ||
              sessionStorage.getItem("token")
            : null;

        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:8000";

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [problemsResponse, projectsResponse] =
          await Promise.all([
            fetch(`${apiUrl}/api/problems/`, {
              method: "GET",
              headers,
            }),

            fetch(`${apiUrl}/api/projects`, {
              method: "GET",
              headers,
            }),
          ]);

        if (!problemsResponse.ok) {
          if (problemsResponse.status === 401) {
            throw new Error(
              "Unauthorized while loading problems. Please login again."
            );
          }

          throw new Error(
            `Failed to load problems. Status: ${problemsResponse.status}`
          );
        }

        if (!projectsResponse.ok) {
          if (projectsResponse.status === 401) {
            throw new Error(
              "Unauthorized while loading projects. Please login again."
            );
          }

          throw new Error(
            `Failed to load projects. Status: ${projectsResponse.status}`
          );
        }

        const problemsData = await problemsResponse.json();
        const projectsData = await projectsResponse.json();

        const normalizedProblems: BackendProblem[] =
          Array.isArray(problemsData)
            ? problemsData
            : Array.isArray(problemsData?.data)
            ? problemsData.data
            : [];

        const normalizedProjects: BackendProject[] =
          Array.isArray(projectsData)
            ? projectsData
            : Array.isArray(projectsData?.data)
            ? projectsData.data
            : [];

        setProblems(normalizedProblems);
        setProjects(normalizedProjects);
      } catch (err) {
        console.error("Government map data fetch error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load government map data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  /* ===========================================================
     CATEGORY LIST FROM BACKEND
  =========================================================== */

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        problems
          .map((problem) => problem.category?.trim())
          .filter(Boolean) as string[]
      )
    );

    return ["All", ...uniqueCategories];
  }, [problems]);

  /* ===========================================================
     FILTERED PROBLEMS
  =========================================================== */

  const filteredProblems = useMemo(() => {
    if (category === "All") {
      return problems;
    }

    return problems.filter(
      (problem) => problem.category === category
    );
  }, [category, problems]);

  /* ===========================================================
     CRITICAL / HIGH
  =========================================================== */

  const critical = useMemo(() => {
    return problems.filter(isHighSeverity).length;
  }, [problems]);

  /* ===========================================================
     DISTRICT DATA
  =========================================================== */

  const districtData = useMemo(() => {
    const districtMap = new Map<
      string,
      {
        name: string;
        problems: number;
        critical: number;
        projects: number;
      }
    >();

    problems.forEach((problem) => {
      const district =
        problem.district?.trim() || "Unknown";

      if (!districtMap.has(district)) {
        districtMap.set(district, {
          name: district,
          problems: 0,
          critical: 0,
          projects: 0,
        });
      }

      const districtData = districtMap.get(district)!;

      districtData.problems += 1;

      if (isHighSeverity(problem)) {
        districtData.critical += 1;
      }
    });

    projects.forEach((project) => {
      const relatedProblem = problems.find(
        (problem) => problem.id === project.problem_id
      );

      const district =
        relatedProblem?.district?.trim();

      if (!district) {
        return;
      }

      const districtData = districtMap.get(district);

      if (districtData) {
        districtData.projects += 1;
      }
    });

    return Array.from(districtMap.values()).sort(
      (a, b) => b.problems - a.problems
    );
  }, [problems, projects]);

  /* ===========================================================
     CATEGORY DATA
  =========================================================== */

  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, number>();

    problems.forEach((problem) => {
      const category =
        problem.category?.trim() || "Uncategorized";

      categoryMap.set(
        category,
        (categoryMap.get(category) || 0) + 1
      );
    });

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [problems]);

  /* ===========================================================
     PROJECT DATA
  =========================================================== */

  const projectData = useMemo(() => {
    const normalizedStatuses = projects.map((project) =>
      (project.status || "").toLowerCase()
    );

    const inProgress = normalizedStatuses.filter(
      (status) =>
        status === "in_progress" ||
        status === "in progress" ||
        status === "development" ||
        status === "active" ||
        status === "ongoing"
    ).length;

    const pilot = normalizedStatuses.filter(
      (status) =>
        status === "pilot" ||
        status === "field_pilot"
    ).length;

    const deployed = normalizedStatuses.filter(
      (status) =>
        status === "deployed" ||
        status === "deployment"
    ).length;

    return [
      {
        label: "Projects",
        value: projects.length,
        description: "University-led projects",
      },
      {
        label: "In Progress",
        value: inProgress,
        description: "Projects under development",
      },
      {
        label: "Pilot",
        value: pilot,
        description: "Field validation projects",
      },
      {
        label: "Deployed",
        value: deployed,
        description: "Solutions deployed",
      },
    ];
  }, [projects]);

  /* ===========================================================
     LOADING STATE
  =========================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f9f9]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" />

            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading government map...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ===========================================================
     ERROR STATE
  =========================================================== */

  if (error) {
    return (
      <main className="min-h-screen bg-[#f6f9f9]">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
            <AlertCircle
              size={34}
              className="mx-auto text-red-500"
            />

            <h1 className="mt-4 text-xl font-bold text-slate-900">
              Unable to Load Map Data
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ===========================================================
     MAIN PAGE
  =========================================================== */

  return (
    <main className="min-h-screen bg-[#f6f9f9]">

      {/* PAGE HEADER */}

      <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8">

        <section className="relative overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 text-white shadow-sm">

          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative px-6 py-7 sm:px-8 sm:py-8">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                  <MapPinned size={24} />
                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <Sparkles
                      size={13}
                      className="text-teal-100"
                    />

                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-100">
                      Geographic Intelligence
                    </p>

                  </div>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                    Jharkhand Problem Map
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-teal-50">
                    Monitor citizen problems, critical hotspots,
                    district-level patterns and solution deployments
                    across Jharkhand.
                  </p>

                </div>

              </div>

              <div className="grid shrink-0 grid-cols-2 gap-3">

                <div className="min-w-[135px] rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">

                  <p className="text-[10px] font-bold uppercase tracking-wide text-teal-100">
                    Problems
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {filteredProblems.length}
                  </p>

                  <p className="mt-1 text-[10px] text-teal-100">
                    Current view
                  </p>

                </div>

                <div className="min-w-[135px] rounded-xl border border-red-200/20 bg-red-500/15 px-4 py-3 backdrop-blur-sm">

                  <div className="flex items-center gap-2">

                    <AlertCircle
                      size={13}
                      className="text-red-100"
                    />

                    <p className="text-[10px] font-bold uppercase tracking-wide text-red-100">
                      Critical
                    </p>

                  </div>

                  <p className="mt-1 text-2xl font-bold">
                    {critical}
                  </p>

                  <p className="mt-1 text-[10px] text-red-100">
                    Require attention
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

      </div>

      {/* MAP */}

      <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">

        {/* MAP REMAINS UNCHANGED */}

      <JharkhandProblemMap
  problems={problems}
  projects={projects}
/>
        {/* DISTRICT-WISE SUMMARY */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-600">
                District Intelligence
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                District-wise Problem Summary
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Compare reported problems, critical cases and solution activity
                across districts.
              </p>

            </div>

          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">

            {districtData.length > 0 ? (
              districtData.map((district) => (

                <div
                  key={district.name}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-teal-200 hover:bg-white hover:shadow-sm"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <p className="text-sm font-bold text-slate-900">
                        {district.name}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Jharkhand
                      </p>

                    </div>

                    <span className="rounded-lg bg-teal-50 px-2 py-1 text-[10px] font-bold text-teal-700">
                      {district.problems} Problems
                    </span>

                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">

                    <div className="rounded-lg border border-slate-200 bg-white p-3">

                      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                        Critical
                      </p>

                      <p className="mt-1 text-lg font-bold text-red-600">
                        {district.critical}
                      </p>

                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-3">

                      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                        Projects
                      </p>

                      <p className="mt-1 text-lg font-bold text-blue-600">
                        {district.projects}
                      </p>

                    </div>

                  </div>

                </div>

              ))
            ) : (
              <div className="sm:col-span-2 lg:col-span-4">
                <EmptyState message="No district data available." />
              </div>
            )}

          </div>

        </section>

        {/* CATEGORY SUMMARY */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-600">
                Category Intelligence
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Category-wise Problem Summary
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Categories calculated from actual backend problem records.
              </p>

            </div>

          </div>

          <div className="space-y-5 p-5">

            {categoryData.length > 0 ? (
              categoryData.map((categoryItem) => {

                const maxCount =
                  categoryData[0]?.count || 1;

                const percentage = Math.min(
                  (categoryItem.count / maxCount) * 100,
                  100
                );

                return (
                  <div key={categoryItem.name}>

                    <div className="flex items-center justify-between">

                      <p className="text-xs font-bold text-slate-700">
                        {categoryItem.name}
                      </p>

                      <p className="text-xs font-bold text-slate-900">
                        {categoryItem.count}
                      </p>

                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="h-full rounded-full bg-cyan-600"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              })
            ) : (
              <EmptyState message="No category data available." />
            )}

          </div>

        </section>

        {/* PROJECT IMPACT */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Building2 size={20} />
              </div>

              <div>

                <h2 className="text-base font-bold text-slate-900">
                  Solution & Project Impact
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Project information calculated from actual backend
                  project records.
                </p>

              </div>

            </div>

          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">

            {projectData.map((item) => (

              <div
                key={item.label}
                className="rounded-xl border border-slate-200 p-4"
              >

                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  {item.label}
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {item.value}
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  {item.description}
                </p>

              </div>

            ))}

          </div>

        </section>

        {/* GOVERNMENT INSIGHT */}

        <section className="mt-6 rounded-2xl border border-teal-100 bg-teal-50 p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
              <Sparkles size={20} />
            </div>

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-700">
                Government Decision Support
              </p>

              <h2 className="mt-1 text-base font-bold text-slate-900">
                Prioritize → Route → Monitor → Measure Impact
              </h2>

              <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-600">
                Analytics are calculated from current backend
                problem and project records. District and category
                patterns can help identify recurring challenges,
                while project status data shows the current
                implementation pipeline.
              </p>

            </div>

          </div>

        </section>

        {/* DATA SOURCE */}

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Data Source
              </p>

              <p className="mt-1 text-xs font-semibold text-slate-700">
                FastAPI Backend
              </p>

            </div>

            <div className="flex gap-2">

              <span className="rounded-lg bg-teal-50 px-3 py-1.5 text-[10px] font-bold text-teal-700">
                {problems.length} Problems
              </span>

              <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-blue-700">
                {projects.length} Projects
              </span>

            </div>

          </div>

        </section>

        {/* FOOTER */}

        <footer className="mt-8 border-t border-slate-200 py-5 text-[10px] text-slate-400">
          SamadhanX • Geographic Problem Monitoring • Government Intelligence
        </footer>

      </div>

    </main>
  );
}

/* =============================================================
   EMPTY STATE
============================================================= */

function EmptyState({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-8 text-center">

      <MapPinned
        size={28}
        className="mx-auto text-slate-300"
      />

      <p className="mt-3 text-sm font-semibold text-slate-600">
        {message}
      </p>

    </div>
  );
}