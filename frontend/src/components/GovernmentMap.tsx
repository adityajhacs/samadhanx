"use client";

type MapProblem = {
  id: string;
  title: string;
  location: string;
  status: "Critical" | "In Progress" | "Pending" | "Resolved";
  x: number;
  y: number;
};

const problems: MapProblem[] = [
  {
    id: "P-1024",
    title: "Major Road Damage",
    location: "New Delhi",
    status: "Critical",
    x: 48,
    y: 38,
  },
  {
    id: "P-1023",
    title: "Drinking Water Shortage",
    location: "Lucknow",
    status: "In Progress",
    x: 62,
    y: 48,
  },
  {
    id: "P-1022",
    title: "Street Light Failure",
    location: "Jaipur",
    status: "Pending",
    x: 38,
    y: 58,
  },
  {
    id: "P-1021",
    title: "Garbage Collection Issue",
    location: "Bhopal",
    status: "Resolved",
    x: 54,
    y: 68,
  },
  {
    id: "P-1020",
    title: "Water Pipeline Leakage",
    location: "Kanpur",
    status: "In Progress",
    x: 70,
    y: 62,
  },
  {
    id: "P-1019",
    title: "Damaged Footpath",
    location: "Indore",
    status: "Pending",
    x: 30,
    y: 72,
  },
];

const statusColors: Record<MapProblem["status"], string> = {
  Critical: "#ef4444",
  "In Progress": "#0f9d8a",
  Pending: "#f59e0b",
  Resolved: "#22c55e",
};

export default function GovMap() {
  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
      {/* Map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-200" />

      {/* Grid / roads */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute left-[15%] top-0 h-full w-[2px] rotate-[12deg] bg-slate-300" />
        <div className="absolute left-[40%] top-0 h-full w-[2px] -rotate-[8deg] bg-slate-300" />
        <div className="absolute left-[68%] top-0 h-full w-[2px] rotate-[15deg] bg-slate-300" />

        <div className="absolute left-0 top-[25%] h-[2px] w-full rotate-[4deg] bg-slate-300" />
        <div className="absolute left-0 top-[50%] h-[2px] w-full -rotate-[5deg] bg-slate-300" />
        <div className="absolute left-0 top-[75%] h-[2px] w-full rotate-[3deg] bg-slate-300" />
      </div>

      {/* Map title */}
      <div className="absolute left-5 top-5 z-10 rounded-xl bg-white/95 px-4 py-3 shadow-sm">
        <p className="text-sm font-semibold text-slate-800">
          Citizen Problem Map
        </p>
        <p className="text-xs text-slate-500">
          Click a marker to inspect problem details
        </p>
      </div>

      {/* Markers */}
      {problems.map((problem) => (
        <button
          key={problem.id}
          type="button"
          title={`${problem.title} — ${problem.location}`}
          className="group absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${problem.x}%`,
            top: `${problem.y}%`,
          }}
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full border-4 border-white text-xs font-bold text-white shadow-lg transition-transform group-hover:scale-125"
            style={{
              backgroundColor: statusColors[problem.status],
            }}
          >
            !
          </span>

          <span className="pointer-events-none absolute left-1/2 top-11 hidden w-48 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-left text-xs text-white shadow-xl group-hover:block">
            <strong className="block">{problem.title}</strong>
            <span className="text-slate-300">{problem.location}</span>
          </span>
        </button>
      ))}

      {/* Legend */}
      <div className="absolute bottom-5 left-5 z-10 rounded-xl bg-white/95 p-3 shadow-sm">
        <div className="flex flex-wrap gap-4 text-xs">
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-slate-600">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}