import Link from "next/link";
import ProblemActions from "./ProblemActions";
import AIAnalysis from "./AIAnalysis";
import {
  MapPin,
  CalendarDays,
  Users,
  Camera,
  Video,
} from "lucide-react";

const problems = {
  "1": {
    category: "Civic Issues",
    title: "Poor Road Conditions in Residential Area",
    description:
      "Residents are facing difficulties due to damaged roads and potholes in the area. The poor road condition is affecting daily transportation and creating safety concerns for citizens.",
    location: "Ranchi, Jharkhand",
    priority: "High Priority",
    status: "Under Review",
    supporters: 124,
    aiCategory: "Road Infrastructure",
    aiSeverity: "High",
    affectedSector: "Public Infrastructure",
    estimatedImpact: "500+ People",
  },

  "2": {
    category: "Education",
    title: "Lack of Digital Learning Facilities",
    description:
      "Students are facing difficulties because of limited access to digital learning facilities and educational resources.",
    location: "Ranchi, Jharkhand",
    priority: "Medium Priority",
    status: "Under Review",
    supporters: 86,
    aiCategory: "Digital Education",
    aiSeverity: "Medium",
    affectedSector: "Education",
    estimatedImpact: "300+ Students",
  },

  "3": {
    category: "Healthcare",
    title: "Limited Healthcare Facilities",
    description:
      "Residents have reported difficulties accessing basic healthcare facilities and medical services in their locality.",
    location: "Ranchi, Jharkhand",
    priority: "High Priority",
    status: "Under Review",
    supporters: 102,
    aiCategory: "Healthcare Access",
    aiSeverity: "High",
    affectedSector: "Public Health",
    estimatedImpact: "400+ People",
  },

  "4": {
    category: "Environment",
    title: "Waste Management Issue",
    description:
      "Improper waste disposal and irregular collection are creating cleanliness and environmental concerns in the area.",
    location: "Ranchi, Jharkhand",
    priority: "Medium Priority",
    status: "Under Review",
    supporters: 74,
    aiCategory: "Waste Management",
    aiSeverity: "Medium",
    affectedSector: "Environment",
    estimatedImpact: "600+ People",
  },
    "5": {
    category: "Public Safety",
    title: "Street Safety and Public Security Concerns",
    description:
      "Residents have reported safety concerns in public areas, especially during evening hours. Better lighting, monitoring and safety measures are needed.",
    location: "Ranchi, Jharkhand",
    priority: "High Priority",
    status: "Under Review",
    supporters: 91,
    aiCategory: "Public Safety",
    aiSeverity: "High",
    affectedSector: "Public Safety",
    estimatedImpact: "350+ People",
  },

  "6": {
    category: "Transport",
    title: "Public Transport Connectivity Issue",
    description:
      "Citizens are facing difficulties due to limited public transport connectivity and irregular availability of transport services in the area.",
    location: "Ranchi, Jharkhand",
    priority: "Medium Priority",
    status: "Under Review",
    supporters: 68,
    aiCategory: "Public Transport",
    aiSeverity: "Medium",
    affectedSector: "Transport",
    estimatedImpact: "450+ People",
  },

  "7": {
  category: "Sanitation",
  title: "Poor Sanitation and Waste Management",
  description:
    "Residents are facing sanitation challenges due to irregular waste collection, poor cleanliness and inadequate sanitation facilities in the area.",
  location: "Ranchi, Jharkhand",
  priority: "High Priority",
  status: "Under Review",
  supporters: 57,
  aiCategory: "Sanitation",
  aiSeverity: "High",
  affectedSector: "Public Health",
  estimatedImpact: "300+ People",
},

"8": {
  category: "Water Management",
  title: "Unreliable Water Supply in Local Community",
  description:
    "Residents are experiencing difficulties due to irregular water supply and limited access to reliable water resources in the area.",
  location: "Ranchi, Jharkhand",
  priority: "High Priority",
  status: "Under Review",
  supporters: 83,
  aiCategory: "Water Management",
  aiSeverity: "High",
  affectedSector: "Water Resources",
  estimatedImpact: "400+ People",
},

"9": {
  category: "Agriculture",
  title: "Challenges Faced by Local Farmers",
  description:
    "Local farmers are facing difficulties related to irrigation, agricultural resources and support, affecting productivity and rural livelihoods.",
  location: "Ranchi, Jharkhand",
  priority: "Medium Priority",
  status: "Under Review",
  supporters: 49,
  aiCategory: "Agriculture",
  aiSeverity: "Medium",
  affectedSector: "Rural Livelihoods",
  estimatedImpact: "250+ People",
  },
};

export default async function ProblemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const problem = problems[id as keyof typeof problems];
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-xl text-white">
              S
            </div>

            <div>
              <div className="text-xl font-bold tracking-tight">
                SamadhanX
              </div>
              <div className="text-xs text-slate-500">
                Ideas → Action → Impact
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-teal-600"
            >
              Home
            </Link>

            <Link
              href="/problems"
              className="text-sm font-medium text-teal-600"
            >
              Problems
            </Link>

            <button className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <section className="mx-auto max-w-7xl px-6 py-6">

        {/* Back */}
        <Link
          href="/problems"
          className="text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          ← Back to Problems
        </Link>

        {/* Problem Header */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-600">
              {problem.category}
            </span>

            <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600">
              {problem.priority}
            </span>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
              {problem.status}
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
            {problem.title}
          </h1>

          <p className="mt-4 max-w-4xl leading-7 text-slate-600">
            {problem.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-8 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <MapPin size={17} />
            <span>{problem.location}</span>
          </span>

          <span className="flex items-center gap-2">
            <CalendarDays size={17} />
            <span>Reported recently</span>
          </span>

          <span className="flex items-center gap-2">
            <Users size={17} />
            <span>{problem.supporters} supporters</span>
          </span>
        </div>
      </div>
{/* Main Grid */}
<div className="mt-6 grid gap-6 lg:grid-cols-3">

  {/* Left Content */}
  <div className="space-y-6 lg:col-span-2">

    {/* Problem Description */}
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold">
        Problem Description
      </h2>

      <p className="mt-4 leading-7 text-slate-600">
        The road has several large potholes and damaged sections.
        During rainfall, water collects on the road, making it
        difficult and unsafe for pedestrians, cyclists and vehicles.
      </p>

      <p className="mt-4 leading-7 text-slate-600">
        Local residents have reported that the issue has continued
        for several months and requires proper inspection and repair.
      </p>
    </div>

    {/* AI Analysis */}
    <AIAnalysis
      category={problem.aiCategory}
      severity={problem.aiSeverity}
      affectedSector={problem.affectedSector}
      estimatedImpact={problem.estimatedImpact}
    />

    {/* Status Tracking */}
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold">
        Status Tracking
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Track the progress of this reported problem.
      </p>

      <div className="mt-8 space-y-7">

        {/* Problem Reported */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="h-4 w-4 rounded-full bg-teal-600" />
            <div className="mt-2 h-12 w-px bg-teal-200" />
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              Problem Reported
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Citizen submitted the problem.
            </p>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="h-4 w-4 rounded-full bg-teal-600" />
            <div className="mt-2 h-12 w-px bg-teal-200" />
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              AI Analysis Completed
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Problem category, severity and impact were analysed.
            </p>
          </div>
        </div>

        {/* Current Status */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="h-4 w-4 rounded-full bg-amber-500" />
            <div className="mt-2 h-12 w-px bg-slate-200" />
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              {problem.status}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              The concerned department is currently reviewing the problem.
            </p>
          </div>
        </div>

        {/* Resolution */}
        <div className="flex gap-4 opacity-50">
          <div className="h-4 w-4 rounded-full bg-slate-300" />

          <div>
            <p className="font-semibold text-slate-900">
              Resolution
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Waiting for the problem to be resolved.
            </p>
          </div>
        </div>

      </div>
    </div>

  </div>

  {/* Right Sidebar */}
  <div className="space-y-6">

    {/* Location */}
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-bold">
        Location
      </h2>

      <div className="mt-4 flex h-40 items-center justify-center rounded-2xl bg-slate-100 text-center text-sm text-slate-500">
      <div className="flex flex-col items-center">
        <MapPin size={24} />
        <p className="mt-2">
          {problem.location}
        </p>
      </div>
    </div>

<p className="mt-4 text-sm text-slate-600">
  Residential Area, Ranchi District
</p>
</div>
    {/* Support + Feedback */}
    <ProblemActions supporters={problem.supporters} />

    {/* Evidence */}
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">
        Evidence
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Photos and videos submitted by citizens to help understand
        the problem.
      </p>

      <div className="mt-5 space-y-4">

        {/* Photo */}
        <div className="flex h-40 items-center justify-center rounded-2xl bg-slate-100 text-center">
        <div className="flex flex-col items-center">
          <Camera size={24} />
          
          <p className="mt-2 font-semibold text-slate-700">
            Problem Photo
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Citizen submitted image
          </p>
        </div>
      </div>

        {/* Video */}
        <div className="flex h-40 items-center justify-center rounded-2xl bg-slate-100 text-center">
          <div className="flex flex-col items-center">
            <Video size={24} />

            <p className="mt-2 font-semibold text-slate-700">
              Problem Video
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Citizen submitted video
            </p>
          </div>
        </div>

      </div>
    </div>

  </div>

</div>
      </section>


      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-8 text-white">
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold">
                S
              </div>

              <div>
                <p className="font-semibold">SamadhanX</p>
                <p className="text-sm text-slate-400">
                  Ideas → Action → Impact
                </p>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-slate-400 md:absolute md:left-1/2 md:-translate-x-1/2">
            <p>© 2026 SamadhanX. Building solutions together.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-5 text-sm text-slate-300">
            <span className="cursor-pointer hover:text-white">
              About
            </span>

            <span className="cursor-pointer hover:text-white">
              Contact
            </span>

            <span className="cursor-pointer hover:text-white">
              Privacy
            </span>
          </div>

        </div>
</footer>

    </main>
  );
}