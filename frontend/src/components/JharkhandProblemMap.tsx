"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import type {
  Layer,
  Path,
  PathOptions,
} from "leaflet";
import type {
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonProperties,
} from "geojson";
import "leaflet/dist/leaflet.css";

type MapMode = "Problems" | "Severity" | "Projects";

export interface MapProblem {
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
}

interface MapProject {
  id: string;
  title?: string | null;
  status?: string | null;
  problem_id?: string | null;
  progress?: number | null;
}

interface JharkhandProblemMapProps {
  problems: MapProblem[];
  projects: MapProject[];
}

type DistrictFeature = Feature<
  Geometry,
  GeoJsonProperties
>;

type DistrictGeoJSON = FeatureCollection<
  Geometry,
  GeoJsonProperties
>;

const districtCenters: Record<
  string,
  [number, number]
> = {
  Ranchi: [23.3441, 85.3096],
  Jamshedpur: [22.8046, 86.2029],
  Dhanbad: [23.7957, 86.4304],
  Bokaro: [23.6693, 86.1511],
  Hazaribagh: [23.9966, 85.3691],
  Deoghar: [24.4855, 86.6947],
  Dumka: [24.2676, 87.2497],
  Giridih: [24.1862, 86.3006],
  Ramgarh: [23.6303, 85.5149],
  Gumla: [23.0449, 84.5426],
  Khunti: [23.0766, 85.2782],
  Lohardaga: [23.4347, 84.6845],
  Simdega: [22.6158, 84.5021],
  Palamu: [24.0305, 84.0734],
  Garhwa: [24.1552, 83.7996],
  Chatra: [24.2065, 84.8702],
  Koderma: [24.4674, 85.5931],
  Jamtara: [23.9607, 86.8029],
  Pakur: [24.6397, 87.8425],
  Sahibganj: [25.2447, 87.6389],
  Godda: [24.8277, 87.2125],
  Latehar: [23.746, 84.503],
  Seraikela: [22.7086, 85.9319],
  "West Singhbhum": [22.5703, 85.3629],
};

function MapCenterController({
  selectedDistrict,
}: {
  selectedDistrict: string;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedDistrict === "All") {
      map.setView([23.6, 85.3], 7);
      return;
    }

    const center =
      districtCenters[selectedDistrict];

    if (center) {
      map.flyTo(center, 9, {
        duration: 0.8,
      });
    }
  }, [selectedDistrict, map]);

  return null;
}

function problemColor(problem: MapProblem) {
  const status = (
    problem.status ?? ""
  ).toLowerCase();

  if (status === "resolved") {
    return "#16a34a";
  }

  if (
    status === "critical" ||
    status === "high"
  ) {
    return "#dc2626";
  }

  return "#2563eb";
}

function projectColor(status: string | null | undefined) {
  const normalizedStatus = (
    status ?? ""
  ).toLowerCase();

  if (
    normalizedStatus === "deployed" ||
    normalizedStatus === "completed" ||
    normalizedStatus === "complete"
  ) {
    return "#2563eb";
  }

  if (
    normalizedStatus === "pilot" ||
    normalizedStatus === "testing"
  ) {
    return "#f59e0b";
  }

  return "#7c3aed";
}

function districtStyle(
  selected: boolean
): PathOptions {
  return {
    fillColor: selected
      ? "#0f766e"
      : "#99f6e4",
    fillOpacity: selected
      ? 0.38
      : 0.22,
    color: selected
      ? "#0f766e"
      : "#64748b",
    weight: selected
      ? 2.5
      : 1,
  };
}

function districtNameFromFeature(
  feature: DistrictFeature | undefined
): string {
  if (!feature) {
    return "";
  }

  const properties =
    feature.properties;

  if (
    !properties ||
    typeof properties !== "object"
  ) {
    return "";
  }

  const props =
    properties as Record<
      string,
      unknown
    >;

  return (
    (typeof props.district === "string"
      ? props.district
      : "") ||
    (typeof props.DISTRICT === "string"
      ? props.DISTRICT
      : "") ||
    (typeof props.NAME_2 === "string"
      ? props.NAME_2
      : "") ||
    (typeof props.NAME === "string"
      ? props.NAME
      : "") ||
    (typeof props.name === "string"
      ? props.name
      : "") ||
    ""
  );
}

function getProjectDisplayStatus(
  status: string | null | undefined
): string {
  if (!status) {
    return "In Progress";
  }

  const normalizedStatus =
    status.toLowerCase();

  if (
    normalizedStatus === "deployed" ||
    normalizedStatus === "completed" ||
    normalizedStatus === "complete"
  ) {
    return "Deployed";
  }

  if (
    normalizedStatus === "pilot" ||
    normalizedStatus === "testing"
  ) {
    return "Pilot";
  }

  return "In Progress";
}

export default function JharkhandProblemMap({
  problems,
  projects,
}: JharkhandProblemMapProps) {
  const [geoData, setGeoData] =
    useState<DistrictGeoJSON | null>(
      null
    );

  const [selectedDistrict, setSelectedDistrict] =
    useState("All");

  const [category, setCategory] =
    useState<string>("All");

  const [mode, setMode] =
    useState<MapMode>("Problems");

  useEffect(() => {
    fetch(
      "/maps/jharkhand-districts.geojson"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to load Jharkhand GeoJSON"
          );
        }

        return response.json() as Promise<DistrictGeoJSON>;
      })
      .then((data) => {
        setGeoData(data);
      })
      .catch((error) => {
        console.error(
          "Failed to load Jharkhand GeoJSON:",
          error
        );
      });
  }, []);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const categoryMatch =
        category === "All" ||
        problem.category === category;

      const districtMatch =
        selectedDistrict === "All" ||
        problem.district ===
          selectedDistrict;

      return (
        categoryMatch &&
        districtMatch
      );
    });
  }, [
    problems,
    category,
    selectedDistrict,
  ]);

  /*
   * Projects do not have their own latitude,
   * longitude or district in the database.
   *
   * Their location comes from the related problem
   * through projects.problem_id -> problems.id.
   */
  const projectMarkers = useMemo(() => {
    return projects
      .map((project) => {
        if (!project.problem_id) {
          return null;
        }

        const relatedProblem =
          problems.find(
            (problem) =>
              problem.id ===
              project.problem_id
          );

        if (!relatedProblem) {
          return null;
        }

        const lat = Number(
          relatedProblem.latitude
        );

        const lng = Number(
          relatedProblem.longitude
        );

        if (
          !Number.isFinite(lat) ||
          !Number.isFinite(lng)
        ) {
          return null;
        }

        return {
          id: project.id,
          title:
            project.title ??
            "Untitled Project",
          district:
            relatedProblem.district ??
            "Unknown District",
          status:
            project.status,
          displayStatus:
            getProjectDisplayStatus(
              project.status
            ),
          lat,
          lng,
        };
      })
      .filter(
        (
          project
        ): project is NonNullable<
          typeof project
        > => project !== null
      );
  }, [projects, problems]);

  const filteredProjectMarkers =
    useMemo(() => {
      return projectMarkers.filter(
        (project) =>
          selectedDistrict === "All" ||
          project.district ===
            selectedDistrict
      );
    }, [
      projectMarkers,
      selectedDistrict,
    ]);

  const criticalCount =
    filteredProblems.filter(
      (problem) => {
        const status = (
          problem.status ?? ""
        ).toLowerCase();

        return (
          status === "critical" ||
          status === "high"
        );
      }
    ).length;

  const districtCount = new Set(
    filteredProblems
      .map(
        (problem) =>
          problem.district
      )
      .filter(
        (
          district
        ): district is string =>
          Boolean(district)
      )
  ).size;

  const handleDistrictClick = (
    districtName: string
  ) => {
    setSelectedDistrict(
      districtName
    );
  };

  const onEachDistrict = (
    feature: DistrictFeature,
    layer: Layer
  ) => {
    const districtName =
      districtNameFromFeature(
        feature
      );

    const isSelected =
      selectedDistrict ===
      districtName;

    const geoJsonLayer =
      layer as Path;

    geoJsonLayer.setStyle(
      districtStyle(isSelected)
    );

    layer.bindTooltip(
      districtName ||
        "Jharkhand District",
      {
        sticky: true,
        direction: "top",
      }
    );

    layer.on({
      click: () => {
        if (districtName) {
          handleDistrictClick(
            districtName
          );
        }
      },

      mouseover: () => {
        geoJsonLayer.setStyle({
          ...districtStyle(true),
          fillOpacity: 0.45,
        });
      },

      mouseout: () => {
        geoJsonLayer.setStyle(
          districtStyle(
            selectedDistrict ===
              districtName
          )
        );
      },
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* MAP TOOLBAR */}

      <div className="border-b border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-600">
              Geographic Intelligence
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Jharkhand District Monitoring
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Select a district to inspect
              problems, severity and active
              projects.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                "Problems",
                "Severity",
                "Projects",
              ] as MapMode[]
            ).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  setMode(item)
                }
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  mode === item
                    ? "bg-teal-700 text-white"
                    : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* FILTERS */}

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
              District
            </label>

            <select
              value={selectedDistrict}
              onChange={(e) =>
                setSelectedDistrict(
                  e.target.value
                )
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 outline-none focus:border-teal-400"
            >
              <option value="All">
                All Districts
              </option>

              {Object.keys(
                districtCenters
              )
                .sort()
                .map((district) => (
                  <option
                    key={district}
                    value={district}
                  >
                    {district}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 outline-none focus:border-teal-400"
            >
              <option value="All">
                All Categories
              </option>

              <option value="Roads">
                Roads
              </option>

              <option value="Water">
                Water
              </option>

              <option value="Electricity">
                Electricity
              </option>

              <option value="Sanitation">
                Sanitation
              </option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setSelectedDistrict(
                  "All"
                );
                setCategory("All");
                setMode("Problems");
              }}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* MAP */}

      <div className="relative h-[560px]">
        <MapContainer
          center={[23.6, 85.3]}
          zoom={7}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapCenterController
            selectedDistrict={
              selectedDistrict
            }
          />

          {geoData && (
            <GeoJSON
              key={selectedDistrict}
              data={geoData}
              onEachFeature={
                onEachDistrict
              }
              style={(feature) => {
                const districtName =
                  districtNameFromFeature(
                    feature
                  );

                return districtStyle(
                  selectedDistrict ===
                    districtName
                );
              }}
            />
          )}

          {/* PROBLEM MARKERS */}

          {mode !== "Projects" &&
            filteredProblems.map(
              (problem) => {
                const lat = Number(
                  problem.latitude
                );

                const lng = Number(
                  problem.longitude
                );

                /*
                 * Backend problem ke coordinates
                 * available nahi hain to marker
                 * render nahi hoga.
                 */
                if (
                  !Number.isFinite(lat) ||
                  !Number.isFinite(lng)
                ) {
                  return null;
                }

                const status = (
                  problem.status ?? ""
                ).toLowerCase();

                const isCritical =
                  status === "critical" ||
                  status === "high";

                return (
                  <CircleMarker
                    key={`problem-${problem.id}`}
                    center={[lat, lng]}
                    radius={
                      mode === "Severity"
                        ? isCritical
                          ? 13
                          : 9
                        : 8
                    }
                    pathOptions={{
                      color: "#ffffff",
                      weight: 2,
                      fillColor:
                        problemColor(
                          problem
                        ),
                      fillOpacity: 0.95,
                    }}
                  >
                    <Popup>
                      <div className="min-w-[210px]">
                        <p className="text-[10px] font-bold uppercase text-teal-600">
                          {problem.id}
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {problem.title}
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                          📍{" "}
                          {problem.district ??
                            "Unknown District"}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-slate-500">
                            {problem.category ??
                              "Other"}
                          </span>

                          <span
                            className={`text-[10px] font-bold ${
                              isCritical
                                ? "text-red-600"
                                : status ===
                                  "resolved"
                                ? "text-emerald-600"
                                : "text-blue-600"
                            }`}
                          >
                            {problem.status ??
                              "Active"}
                          </span>
                        </div>

                        <p className="mt-2 text-[10px] text-slate-400">
                          Coordinates:{" "}
                          {lat.toFixed(5)},{" "}
                          {lng.toFixed(5)}
                        </p>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              }
            )}

          {/* PROJECT / DEPLOYMENT MARKERS */}

          {mode === "Projects" &&
            filteredProjectMarkers.map(
              (project) => (
                <CircleMarker
                  key={project.id}
                  center={[
                    project.lat,
                    project.lng,
                  ]}
                  radius={11}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 2,
                    fillColor:
                      projectColor(
                        project.status
                      ),
                    fillOpacity: 0.95,
                  }}
                >
                  <Popup>
                    <div className="min-w-[210px]">
                      <p className="text-[10px] font-bold uppercase text-blue-600">
                        {project.id}
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {project.title}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        📍{" "}
                        {project.district}
                      </p>

                      <p className="mt-2 text-xs font-semibold text-slate-700">
                        Status:{" "}
                        {project.displayStatus}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            )}
        </MapContainer>

        {/* MAP SUMMARY */}

        <div className="pointer-events-none absolute left-4 top-4 z-[500]">
          <div className="rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Current View
            </p>

            <p className="mt-1 text-sm font-bold text-slate-900">
              {selectedDistrict ===
              "All"
                ? "Jharkhand"
                : selectedDistrict}
            </p>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[9px] uppercase text-slate-400">
                  Problems
                </p>

                <p className="text-lg font-bold text-slate-900">
                  {
                    filteredProblems.length
                  }
                </p>
              </div>

              <div>
                <p className="text-[9px] uppercase text-slate-400">
                  Critical
                </p>

                <p className="text-lg font-bold text-red-600">
                  {criticalCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* LEGEND */}

        <div className="absolute bottom-4 left-4 z-[500] rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Map Legend
          </p>

          <div className="mt-3 space-y-2">
            <Legend
              color="bg-red-600"
              label="Critical / High Problem"
            />

            <Legend
              color="bg-blue-600"
              label="Active Problem"
            />

            <Legend
              color="bg-green-600"
              label="Resolved"
            />

            <Legend
              color="bg-blue-600"
              label="Deployed Project"
            />

            <Legend
              color="bg-amber-500"
              label="Pilot Project"
            />

            <Legend
              color="bg-violet-600"
              label="Project In Progress"
            />
          </div>
        </div>
      </div>

      {/* DISTRICT SUMMARY */}

      <div className="border-t border-slate-200 bg-slate-50 p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryCard
            label="Districts with Problems"
            value={districtCount}
          />

          <SummaryCard
            label="Critical Hotspots"
            value={criticalCount}
            danger
          />

          <SummaryCard
            label="Projects / Deployments"
            value={
              filteredProjectMarkers.length
            }
          />
        </div>
      </div>
    </div>
  );
}

function Legend({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-3 w-3 rounded-full ${color}`}
      />

      <span className="text-[10px] font-semibold text-slate-600">
        {label}
      </span>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-2xl font-bold ${
          danger
            ? "text-red-600"
            : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}