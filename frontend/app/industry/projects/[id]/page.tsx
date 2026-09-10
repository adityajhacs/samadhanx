
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FlaskConical,
  GraduationCap,
  Handshake,
  Lightbulb,
  MapPin,
  Target,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

type ProjectStage =
  | "Solution Proposed"
  | "Project In Progress"
  | "Pilot / Validation"
  | "Impact / Deployment";

type ProjectDetail = {
  id: string;
  title: string;
  problem: string;
  category: string;
  university: string;
  location: string;
  stage: ProjectStage;
  progress: number;
  support: string[];
  description: string;
  solution: string;
  prototype: string;
  prototypeComponents: string[];
  howItWorks: string[];
  impact: string[];
  timeline: string;
  funding: string;
};

const projects: ProjectDetail[] = [
  {
    id: "PRJ-001",
    title: "Smart Road Monitoring Pilot",
    problem: "Road damage and delayed maintenance reporting",
    category: "Infrastructure",
    university: "Birla Institute of Technology, Mesra",
    location: "Ranchi, Jharkhand",
    stage: "Pilot / Validation",
    progress: 72,
    support: ["Technical Support", "Testing", "Field Pilot"],
    description:
      "A technology-assisted system for detecting road damage and improving maintenance response.",
    solution:
      "The project combines field road-condition data, digital reporting, and technology-assisted damage identification so authorities can identify and prioritise road maintenance requirements faster.",
    prototype:
      "The team is developing a working road-monitoring prototype that captures road condition information, identifies common damage patterns, records the affected location, and generates structured information for maintenance planning.",
    prototypeComponents: [
      "Digital road condition reporting",
      "Road damage identification",
      "Location-based issue records",
      "Damage severity and priority information",
      "Government monitoring interface",
    ],
    howItWorks: [
      "Road condition data is captured from field observations or digital inputs.",
      "The system analyses the reported condition and identifies potential road damage.",
      "The damaged location and issue details are recorded digitally.",
      "The issue is classified based on severity and maintenance priority.",
      "Government teams use the information to plan inspection and maintenance.",
    ],
    impact: [
      "Faster identification of damaged roads",
      "Reduced delay in maintenance reporting",
      "Better prioritisation of road repair requirements",
      "Improved visibility of road conditions",
      "Better coordination between field teams and authorities",
    ],
    timeline: "6 months",
    funding: "₹8.5 Lakh",
  },

  {
    id: "PRJ-002",
    title: "Community Water Monitoring",
    problem: "Irregular water supply and quality monitoring",
    category: "Water",
    university: "National Institute of Technology, Jamshedpur",
    location: "Jamshedpur, Jharkhand",
    stage: "Project In Progress",
    progress: 58,
    support: ["Field Pilot", "Testing"],
    description:
      "A community-focused monitoring solution for tracking water availability and quality.",
    solution:
      "The project creates a structured water-monitoring system that combines community observations and sensor-based information to identify supply and quality issues.",
    prototype:
      "The prototype consists of a community water monitoring setup capable of recording water availability, basic quality indicators, location, and reporting history.",
    prototypeComponents: [
      "Water availability monitoring",
      "Basic water quality sensing",
      "Community reporting interface",
      "Location-based water records",
      "Water issue dashboard",
    ],
    howItWorks: [
      "Water availability and quality information is collected from selected locations.",
      "Sensor or community inputs are recorded by the monitoring system.",
      "The system identifies locations with recurring water problems.",
      "Issues are organised by location and type.",
      "Authorities can use the information to plan inspection and intervention.",
    ],
    impact: [
      "Better visibility of local water problems",
      "Faster identification of supply interruptions",
      "Improved water-quality monitoring",
      "Community participation in reporting",
      "Better planning of water interventions",
    ],
    timeline: "8 months",
    funding: "₹6.2 Lakh",
  },

  {
    id: "PRJ-003",
    title: "Rural Sanitation Deployment",
    problem: "Limited sanitation infrastructure in rural areas",
    category: "Sanitation",
    university: "Central University of Jharkhand",
    location: "Dhanbad, Jharkhand",
    stage: "Solution Proposed",
    progress: 81,
    support: ["Funding", "Field Pilot"],
    description:
      "A scalable sanitation solution designed for deployment in underserved rural communities.",
    solution:
      "The project proposes affordable and locally suitable sanitation infrastructure combined with community-level monitoring and maintenance practices.",
    prototype:
      "The prototype demonstrates a low-cost sanitation setup designed around rural requirements, easy maintenance, water efficiency, and community usability.",
    prototypeComponents: [
      "Low-cost sanitation unit",
      "Water-efficient design",
      "Waste management mechanism",
      "Maintenance workflow",
      "Community monitoring model",
    ],
    howItWorks: [
      "A suitable sanitation design is selected based on local requirements.",
      "The prototype is installed in a representative rural location.",
      "Usage and maintenance requirements are monitored.",
      "Community feedback is collected.",
      "The design is refined before wider deployment.",
    ],
    impact: [
      "Improved rural sanitation access",
      "Better hygiene conditions",
      "Lower infrastructure cost",
      "Improved community participation",
      "Scalable deployment model",
    ],
    timeline: "7 months",
    funding: "₹12 Lakh",
  },

  {
    id: "PRJ-004",
    title: "Solar Street Infrastructure",
    problem: "Poor lighting in underserved community areas",
    category: "Energy",
    university: "Birla Institute of Technology, Mesra",
    location: "Bokaro, Jharkhand",
    stage: "Project In Progress",
    progress: 34,
    support: ["Prototyping", "Testing"],
    description:
      "Solar-powered street infrastructure aimed at improving safety and reducing energy dependence.",
    solution:
      "The project uses solar-powered street lighting with efficient energy storage and monitoring to provide reliable lighting in underserved areas.",
    prototype:
      "The prototype consists of a solar street-light unit with a solar panel, battery storage, LED lighting, control electronics, and basic performance monitoring.",
    prototypeComponents: [
      "Solar panel system",
      "Battery storage",
      "Energy-efficient LED lighting",
      "Automatic lighting control",
      "Performance monitoring",
    ],
    howItWorks: [
      "Solar panels collect energy during daylight.",
      "Energy is stored in a battery system.",
      "The lighting unit automatically operates during low-light conditions.",
      "System performance and battery condition are monitored.",
      "Field data is used to improve reliability and deployment design.",
    ],
    impact: [
      "Improved community-area lighting",
      "Lower dependence on grid electricity",
      "Improved night-time safety",
      "Reduced operating costs",
      "Potential for rural scalability",
    ],
    timeline: "6 months",
    funding: "₹4.5 Lakh",
  },

  {
    id: "PRJ-005",
    title: "Citizen Complaint Analytics",
    problem: "Difficulty identifying recurring civic issues",
    category: "Governance",
    university: "National Institute of Technology, Jamshedpur",
    location: "Hazaribagh, Jharkhand",
    stage: "Impact / Deployment",
    progress: 100,
    support: ["Mentorship", "Technical Support"],
    description:
      "An analytics platform that identifies recurring citizen complaints and supports data-driven decisions.",
    solution:
      "The platform groups citizen complaints by issue, location, category, and recurrence so government teams can identify patterns and prioritise interventions.",
    prototype:
      "The prototype provides an analytics dashboard that converts large numbers of citizen complaints into visual trends, recurring issue groups, and location-based insights.",
    prototypeComponents: [
      "Complaint categorisation",
      "Recurring issue detection",
      "District-wise analytics",
      "Trend visualisation",
      "Government decision dashboard",
    ],
    howItWorks: [
      "Citizen complaints enter the central reporting system.",
      "Complaints are categorised and grouped.",
      "Recurring issues and geographic patterns are identified.",
      "Analytics are displayed through dashboards.",
      "Government teams use the insights for targeted action.",
    ],
    impact: [
      "Faster identification of recurring problems",
      "Data-driven government decisions",
      "Better resource prioritisation",
      "Improved complaint monitoring",
      "Greater visibility into community needs",
    ],
    timeline: "5 months",
    funding: "₹3 Lakh",
  },

  {
    id: "PRJ-006",
    title: "Low-Cost Road Repair Material",
    problem: "High cost of road repair materials",
    category: "Infrastructure",
    university: "Birla Institute of Technology, Mesra",
    location: "Deoghar, Jharkhand",
    stage: "Solution Proposed",
    progress: 21,
    support: ["Testing", "Prototyping"],
    description:
      "Research into affordable road repair materials suitable for local conditions.",
    solution:
      "The project explores alternative locally available materials and material combinations that can reduce road repair costs while maintaining suitable performance.",
    prototype:
      "The prototype consists of experimental road-repair material samples prepared with different compositions and tested for strength, durability, and suitability.",
    prototypeComponents: [
      "Alternative material mixtures",
      "Laboratory test samples",
      "Strength testing",
      "Durability testing",
      "Cost comparison model",
    ],
    howItWorks: [
      "Locally suitable materials are identified.",
      "Different material combinations are prepared.",
      "Samples are tested under controlled conditions.",
      "Performance is compared with conventional materials.",
      "The most suitable composition is prepared for field testing.",
    ],
    impact: [
      "Lower road repair costs",
      "Better use of local materials",
      "Potential reduction in maintenance expenditure",
      "Improved repair accessibility",
      "Scalable solution for rural roads",
    ],
    timeline: "9 months",
    funding: "₹2.75 Lakh",
  },

  {
    id: "PRJ-007",
    title: "Smart Waste Collection Network",
    problem: "Irregular waste collection in residential areas",
    category: "Sanitation",
    university: "Central University of Jharkhand",
    location: "Ranchi, Jharkhand",
    stage: "Project In Progress",
    progress: 46,
    support: ["Technical Support", "Field Pilot"],
    description:
      "A smart collection system designed to optimise waste pickup routes and schedules.",
    solution:
      "The system uses collection data and location information to help optimise waste pickup routes and identify areas where collection is delayed.",
    prototype:
      "The prototype combines smart waste-bin information, collection records, route planning, and a monitoring dashboard for municipal teams.",
    prototypeComponents: [
      "Smart bin monitoring",
      "Collection status tracking",
      "Route optimisation",
      "Collection dashboard",
      "Area-wise waste analytics",
    ],
    howItWorks: [
      "Waste collection points are registered digitally.",
      "Collection status is updated from field locations.",
      "The system identifies pending or high-priority collection points.",
      "Optimised routes are generated for collection teams.",
      "Municipal teams monitor collection performance.",
    ],
    impact: [
      "More regular waste collection",
      "Reduced unnecessary collection trips",
      "Cleaner residential areas",
      "Better route utilisation",
      "Improved municipal monitoring",
    ],
    timeline: "7 months",
    funding: "₹5.4 Lakh",
  },

  {
    id: "PRJ-008",
    title: "Rural Solar Water Pumps",
    problem: "Limited access to reliable irrigation power",
    category: "Energy",
    university: "National Institute of Technology, Jamshedpur",
    location: "Dumka, Jharkhand",
    stage: "Solution Proposed",
    progress: 27,
    support: ["Funding", "Technical Support"],
    description:
      "Solar-powered irrigation infrastructure designed for small and marginal farmers.",
    solution:
      "The project proposes solar-powered water pumping systems that can provide reliable irrigation without depending completely on conventional electricity supply.",
    prototype:
      "The prototype includes a solar-powered pump, energy controller, water delivery system, and basic monitoring mechanism designed for small agricultural plots.",
    prototypeComponents: [
      "Solar pumping unit",
      "Solar power controller",
      "Water delivery system",
      "Energy monitoring",
      "Irrigation control",
    ],
    howItWorks: [
      "Solar panels generate electricity during daylight.",
      "Generated power operates the irrigation pump.",
      "Water is delivered to the agricultural field.",
      "Power and pumping performance are monitored.",
      "The system is evaluated under local farming conditions.",
    ],
    impact: [
      "More reliable irrigation access",
      "Lower electricity dependence",
      "Reduced irrigation operating cost",
      "Better support for small farmers",
      "Cleaner agricultural energy use",
    ],
    timeline: "8 months",
    funding: "₹7.2 Lakh",
  },

  {
    id: "PRJ-009",
    title: "Digital Health Access Platform",
    problem: "Limited access to basic healthcare services",
    category: "Healthcare",
    university: "Central University of Jharkhand",
    location: "Hazaribagh, Jharkhand",
    stage: "Pilot / Validation",
    progress: 67,
    support: ["Field Pilot", "Technical Support"],
    description:
      "A digital platform connecting underserved communities with essential healthcare resources.",
    solution:
      "The platform brings basic healthcare information, service discovery, and digital access tools together to make healthcare resources easier to reach.",
    prototype:
      "The prototype provides a digital interface where community members can discover nearby healthcare resources, access basic information, and connect with relevant services.",
    prototypeComponents: [
      "Healthcare resource directory",
      "Location-based service discovery",
      "Digital health information",
      "Community access interface",
      "Service monitoring dashboard",
    ],
    howItWorks: [
      "Healthcare resources are registered on the platform.",
      "Community members search for relevant services.",
      "The system provides location-based information.",
      "Users can identify suitable healthcare resources.",
      "Usage data helps improve service planning.",
    ],
    impact: [
      "Improved healthcare accessibility",
      "Better awareness of available services",
      "Reduced information gaps",
      "Better visibility of underserved areas",
      "Improved healthcare planning",
    ],
    timeline: "6 months",
    funding: "₹6.8 Lakh",
  },

  {
    id: "PRJ-010",
    title: "Flood Risk Monitoring System",
    problem: "Delayed flood alerts in vulnerable communities",
    category: "Environment",
    university: "Birla Institute of Technology, Mesra",
    location: "Giridih, Jharkhand",
    stage: "Project In Progress",
    progress: 52,
    support: ["Testing", "Technical Support"],
    description:
      "A monitoring system designed to improve early warning and flood preparedness.",
    solution:
      "The system monitors environmental and water-level indicators to help identify increasing flood risk and provide earlier information to authorities.",
    prototype:
      "The prototype uses monitoring sensors and a central dashboard to track selected environmental indicators and generate risk information.",
    prototypeComponents: [
      "Water-level monitoring",
      "Environmental sensors",
      "Risk-level calculation",
      "Alert mechanism",
      "Monitoring dashboard",
    ],
    howItWorks: [
      "Sensors collect environmental and water-level information.",
      "The system continuously processes incoming measurements.",
      "Risk levels are calculated from predefined conditions.",
      "Potentially dangerous changes trigger alerts.",
      "Authorities can use the information for preparedness actions.",
    ],
    impact: [
      "Earlier flood-risk awareness",
      "Improved emergency preparedness",
      "Better monitoring of vulnerable locations",
      "Faster information sharing",
      "Potential reduction in response delays",
    ],
    timeline: "8 months",
    funding: "₹5.9 Lakh",
  },

  {
    id: "PRJ-011",
    title: "Public Transport Tracking",
    problem: "Limited visibility of local transport availability",
    category: "Transport",
    university: "National Institute of Technology, Jamshedpur",
    location: "Jamshedpur, Jharkhand",
    stage: "Impact / Deployment",
    progress: 94,
    support: ["Technical Support", "Field Pilot"],
    description:
      "A real-time transport monitoring solution for improving accessibility and reliability.",
    solution:
      "The platform provides real-time visibility into local transport availability and movement so commuters and authorities can better understand transport operations.",
    prototype:
      "The prototype combines vehicle location information, route data, estimated availability, and a user-facing transport tracking interface.",
    prototypeComponents: [
      "Vehicle location tracking",
      "Route information",
      "Transport availability",
      "Estimated arrival information",
      "Transport monitoring dashboard",
    ],
    howItWorks: [
      "Transport vehicles provide location information.",
      "The platform processes vehicle movement data.",
      "Routes and estimated availability are displayed.",
      "Users can view relevant transport information.",
      "Authorities can monitor service coverage and reliability.",
    ],
    impact: [
      "Better transport visibility",
      "Reduced commuter uncertainty",
      "Improved route monitoring",
      "Better planning of transport services",
      "Improved public mobility experience",
    ],
    timeline: "6 months",
    funding: "₹4.8 Lakh",
  },

  {
    id: "PRJ-012",
    title: "Community Air Quality Network",
    problem: "Limited local air quality monitoring",
    category: "Environment",
    university: "Central University of Jharkhand",
    location: "Bokaro, Jharkhand",
    stage: "Pilot / Validation",
    progress: 63,
    support: ["Prototyping", "Testing"],
    description:
      "A distributed sensor network for monitoring local air quality and pollution patterns.",
    solution:
      "The project creates a network of affordable monitoring devices that can collect local air-quality information across multiple community locations.",
    prototype:
      "The prototype consists of compact air-quality monitoring nodes that measure selected pollution indicators and send readings to a central monitoring platform.",
    prototypeComponents: [
      "Low-cost air-quality sensors",
      "Distributed monitoring nodes",
      "Environmental data collection",
      "Pollution trend dashboard",
      "Location-based air-quality records",
    ],
    howItWorks: [
      "Monitoring nodes collect air-quality readings.",
      "Readings are associated with their geographic locations.",
      "The platform receives and organises the sensor data.",
      "Pollution trends are visualised over time.",
      "Authorities and communities can identify locations requiring attention.",
    ],
    impact: [
      "Better local air-quality visibility",
      "Identification of pollution hotspots",
      "Improved environmental monitoring",
      "More informed community awareness",
      "Better evidence for local interventions",
    ],
    timeline: "7 months",
    funding: "₹5.1 Lakh",
  },
];

const milestones = [
  "Problem Validation",
  "Research & Design",
  "Prototype Development",
  "Testing / Field Pilot",
  "Impact Evaluation",
];

function getProject(id: string) {
  return projects.find((project) => project.id === id) ?? projects[0];
}

function getMilestoneStatus(
  project: ProjectDetail,
  index: number
) {
  const progress = project.progress;

  if (index === 0) return "Completed";
  if (progress >= 80 && index === 1) return "Completed";
  if (progress >= 45 && index === 1) return "Completed";
  if (progress >= 60 && index === 2) return "Completed";
  if (progress >= 30 && index === 2) return "In Progress";
  if (progress >= 45 && index === 3) return "In Progress";

  return "Upcoming";
}

export default function IndustryProjectDetailPage() {
  const params = useParams();
  const projectId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const project = getProject(projectId);

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
       className="text-sm font-semibold text-teal-700"
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


      {/* Hero */}
      <section className="relative overflow-hidden border-b border-teal-900 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-10">
          <Link
            href="/industry/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-teal-100 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

          <div className="mt-7 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-teal-300/40 bg-teal-800/70 px-3 py-1.5 text-xs font-bold text-teal-100">
                {project.id}
              </span>

              <span className="rounded-full border border-emerald-300/40 bg-emerald-800/60 px-3 py-1.5 text-xs font-bold text-emerald-100">
                {project.stage}
              </span>

              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white">
                {project.category}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              {project.title}
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-teal-50">
              {project.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-teal-100">
              <span className="inline-flex items-center gap-2">
                <GraduationCap size={16} />
                {project.university}
              </span>

              <span className="inline-flex items-center gap-2">
                <MapPin size={16} />
                {project.location}
              </span>

              <span className="inline-flex items-center gap-2">
                <Clock3 size={16} />
                {project.timeline}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
          <div className="space-y-6">
            {/* Problem */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-rose-100 p-3">
                  <Target className="h-5 w-5 text-rose-700" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
                    Community Problem
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    What problem is this project solving?
                  </h2>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-rose-100 bg-rose-50 p-5">
                <p className="text-base font-semibold leading-7 text-slate-800">
                  {project.problem}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  This project focuses on a real community challenge
                  identified through the SamadhanX problem-solving
                  workflow. The university team is developing a
                  practical solution that can be validated in real-world
                  conditions.
                </p>
              </div>
            </section>

            {/* Solution */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-teal-100 p-3">
                  <Lightbulb className="h-5 w-5 text-teal-700" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    Proposed Solution
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    How is the problem being addressed?
                  </h2>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                {project.solution}
              </p>
            </section>

            {/* Prototype */}
            <section className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-teal-600 p-3">
                  <Wrench className="h-5 w-5 text-white" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    Prototype
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    What are they actually building?
                  </h2>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-700">
                {project.prototype}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {project.prototypeComponents.map((component) => (
                  <div
                    key={component}
                    className="flex items-start gap-3 rounded-xl border border-teal-100 bg-white p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />

                    <span className="text-sm font-medium text-slate-700">
                      {component}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Workflow */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-sky-100 p-3">
                  <Zap className="h-5 w-5 text-sky-700" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-sky-700">
                    Prototype Workflow
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    How will the prototype solve the problem?
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {project.howItWorks.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                      {index + 1}
                    </div>

                    <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm leading-6 text-slate-700">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 overflow-x-auto">
                <div className="flex min-w-[650px] items-center justify-center gap-2">
                  {[
                    "Community Input",
                    "Prototype",
                    "Testing",
                    "Validation",
                    "Real-World Impact",
                  ].map((item, index, array) => (
                    <div
                      key={item}
                      className="flex items-center gap-2"
                    >
                      <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-center">
                        <p className="text-xs font-bold text-teal-800">
                          {item}
                        </p>
                      </div>

                      {index < array.length - 1 && (
                        <ArrowRight
                          size={15}
                          className="shrink-0 text-slate-400"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Progress */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Project Progress
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Innovation to Impact
                  </h2>
                </div>

                <span className="text-2xl font-bold text-teal-700">
                  {project.progress}%
                </span>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-teal-600"
                  style={{ width: `${project.progress}%` }}
                />
              </div>

              <div className="mt-6 space-y-5">
                {milestones.map((milestone, index) => {
                  const status = getMilestoneStatus(
                    project,
                    index
                  );

                  return (
                    <div
                      key={milestone}
                      className="flex gap-4"
                    >
                      <div className="relative">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            status === "Completed"
                              ? "bg-emerald-100"
                              : status === "In Progress"
                              ? "bg-teal-100"
                              : "bg-slate-100"
                          }`}
                        >
                          {status === "Completed" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                status === "In Progress"
                                  ? "bg-teal-600"
                                  : "bg-slate-400"
                              }`}
                            />
                          )}
                        </div>

                        {index < milestones.length - 1 && (
                          <div className="absolute left-1/2 top-8 h-8 w-px -translate-x-1/2 bg-slate-200" />
                        )}
                      </div>

                      <div className="flex-1 pb-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-slate-800">
                            {milestone}
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              status === "Completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : status === "In Progress"
                                ? "bg-teal-100 text-teal-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {status}
                          </span>
                        </div>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Project milestone within the current
                          innovation stage.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Impact */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-emerald-100 p-3">
                  <Target className="h-5 w-5 text-emerald-700" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Expected Impact
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    What changes if the solution works?
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {project.impact.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                    <p className="text-sm leading-6 text-slate-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Collaboration */}
            <div className="rounded-2xl border border-teal-200 bg-white p-5 shadow-sm">
              <div className="w-fit rounded-xl bg-teal-100 p-3">
                <Handshake className="h-5 w-5 text-teal-700" />
              </div>

              <h2 className="mt-4 text-lg font-bold">
                Collaboration Opportunity
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This project is looking for industry partners who
                can help move the solution toward real-world
                validation and impact.
              </p>

              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Support Required
                </p>

                <div className="mt-2 space-y-2">
                  {project.support.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5"
                    >
                      <CheckCircle2 className="h-4 w-4 text-teal-600" />

                      <span className="text-sm font-medium text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/industry/collaborations"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Offer Collaboration
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* University */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-3">
                  <GraduationCap className="h-5 w-5 text-slate-700" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    University Partner
                  </p>

                  <h3 className="mt-1 text-sm font-bold">
                    {project.university}
                  </h3>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-xs leading-5 text-slate-500">
                  The university team is responsible for research,
                  solution development, prototype work, and
                  technical validation.
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-600">
                  <MapPin
                    size={14}
                    className="text-teal-600"
                  />
                  {project.location}
                </div>
              </div>
            </div>

            {/* Government */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Government Stakeholder
              </p>

              <h3 className="mt-2 text-sm font-bold">
                Government of Jharkhand
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Supports problem validation, field coordination,
                monitoring, and evaluation of real-world outcomes.
              </p>
            </div>

            {/* Overview */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Project Overview
              </p>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Category
                  </span>
                  <span className="text-sm font-bold">
                    {project.category}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Duration
                  </span>
                  <span className="text-sm font-bold">
                    {project.timeline}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Support Value
                  </span>
                  <span className="text-sm font-bold">
                    {project.funding}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Progress
                  </span>
                  <span className="text-sm font-bold text-teal-700">
                    {project.progress}%
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="overflow-hidden rounded-2xl bg-slate-950">
          <div className="flex flex-col gap-6 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Ready to contribute?
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Help take this project toward real-world impact.
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Contribute funding, technical expertise, testing,
                prototyping, mentorship, or field deployment support.
              </p>
            </div>

            <Link
              href="/industry/collaborations"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-500"
            >
              Start Collaboration
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-5 text-center text-xs text-slate-500">
        © 2026 SamadhanX • Ideas → Action → Impact
      </footer>
    </main>
  );
}

