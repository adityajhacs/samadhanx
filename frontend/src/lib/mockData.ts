// ============================================================
// SAMADHANX - SHARED MOCK DATA
// Government M2 Prototype
// ============================================================

export type ProblemStatus =
  | "Critical"
  | "In Progress"
  | "Pending"
  | "Resolved";

export type ProblemCategory =
  | "Roads"
  | "Water"
  | "Electricity"
  | "Sanitation";

export type ClusterStatus = "Critical" | "Active";

export type SolutionStage =
  | "Reported"
  | "Verified"
  | "Assigned"
  | "In Execution"
  | "Resolved";


// ============================================================
// PROBLEM
// ============================================================

export interface Problem {
  id: string;
  title: string;
  location: string;
  district: string;
  state: string;
  category: ProblemCategory;
  status: ProblemStatus;
  reportedAt: string;
  description: string;
  citizenReports: number;
  priority: "High" | "Medium" | "Low";
  department: string;
  clusterId: string;
  solutionId: string;

  // Used by the mock map
  mapX: number;
  mapY: number;
}


// ============================================================
// PROBLEMS
// ============================================================

export const problems: Problem[] = [
  {
    id: "P-1024",
    title: "Major Road Damage",
    location: "Central Delhi",
    district: "New Delhi",
    state: "Delhi",
    category: "Roads",
    status: "Critical",
    reportedAt: "Today, 09:15 AM",
    description:
      "Large potholes and damaged road surface reported by citizens. Immediate inspection and repair is recommended.",
    citizenReports: 38,
    priority: "High",
    department: "Public Works Department",
    clusterId: "C-001",
    solutionId: "S-001",
    mapX: 31,
    mapY: 23,
  },

  {
    id: "P-1023",
    title: "Drinking Water Shortage",
    location: "Aliganj",
    district: "Lucknow",
    state: "Uttar Pradesh",
    category: "Water",
    status: "In Progress",
    reportedAt: "Today, 08:40 AM",
    description:
      "Residents reported insufficient drinking-water supply in the affected residential area.",
    citizenReports: 27,
    priority: "High",
    department: "Jal Nigam",
    clusterId: "C-002",
    solutionId: "S-002",
    mapX: 55,
    mapY: 30,
  },

  {
    id: "P-1022",
    title: "Street Light Failure",
    location: "Malviya Nagar",
    district: "Jaipur",
    state: "Rajasthan",
    category: "Electricity",
    status: "Pending",
    reportedAt: "Yesterday, 06:20 PM",
    description:
      "Multiple street lights are not functioning and require field verification.",
    citizenReports: 16,
    priority: "Medium",
    department: "Jaipur Municipal Corporation",
    clusterId: "C-003",
    solutionId: "S-003",
    mapX: 40,
    mapY: 43,
  },

  {
    id: "P-1021",
    title: "Garbage Collection Issue",
    location: "Arera Colony",
    district: "Bhopal",
    state: "Madhya Pradesh",
    category: "Sanitation",
    status: "Resolved",
    reportedAt: "Yesterday, 02:10 PM",
    description:
      "Delayed garbage collection was reported. The issue has been resolved by the municipal team.",
    citizenReports: 12,
    priority: "Medium",
    department: "Municipal Corporation",
    clusterId: "C-004",
    solutionId: "S-004",
    mapX: 67,
    mapY: 47,
  },

  {
    id: "P-1020",
    title: "Water Pipeline Leakage",
    location: "Civil Lines",
    district: "Kanpur",
    state: "Uttar Pradesh",
    category: "Water",
    status: "In Progress",
    reportedAt: "Yesterday, 02:30 PM",
    description:
      "A leaking water pipeline is affecting the nearby residential area.",
    citizenReports: 21,
    priority: "High",
    department: "Water Supply Department",
    clusterId: "C-005",
    solutionId: "S-005",
    mapX: 61,
    mapY: 37,
  },

  {
    id: "P-1019",
    title: "Broken Footpath",
    location: "Vijay Nagar",
    district: "Indore",
    state: "Madhya Pradesh",
    category: "Roads",
    status: "Pending",
    reportedAt: "01 Sep 2026",
    description:
      "Citizens reported a damaged pedestrian footpath requiring maintenance.",
    citizenReports: 9,
    priority: "Medium",
    department: "Public Works Department",
    clusterId: "C-006",
    solutionId: "S-006",
    mapX: 73,
    mapY: 61,
  },

  {
    id: "P-1018",
    title: "Transformer Fault",
    location: "Kankarbagh",
    district: "Patna",
    state: "Bihar",
    category: "Electricity",
    status: "Critical",
    reportedAt: "01 Sep 2026",
    description:
      "Local transformer fault has affected electricity supply in the area.",
    citizenReports: 31,
    priority: "High",
    department: "Electricity Board",
    clusterId: "C-007",
    solutionId: "S-007",
    mapX: 78,
    mapY: 38,
  },

  {
    id: "P-1017",
    title: "Drainage Blockage",
    location: "Kothrud",
    district: "Pune",
    state: "Maharashtra",
    category: "Sanitation",
    status: "In Progress",
    reportedAt: "31 Aug 2026",
    description:
      "Blocked drainage is causing water accumulation in the locality.",
    citizenReports: 18,
    priority: "High",
    department: "Pune Municipal Corporation",
    clusterId: "C-008",
    solutionId: "S-008",
    mapX: 36,
    mapY: 73,
  },
];


// ============================================================
// CLUSTERS
// ============================================================

export interface Cluster {
  id: string;
  name: string;
  location: string;
  category: ProblemCategory;
  problems: number;
  critical: number;
  resolved: number;
  progress: number;
  status: ClusterStatus;
  problemIds: string[];
  description: string;
}

export const clusters: Cluster[] = [
  {
    id: "C-001",
    name: "Central Delhi Infrastructure Cluster",
    location: "New Delhi",
    category: "Roads",
    problems: 42,
    critical: 7,
    resolved: 18,
    progress: 43,
    status: "Critical",
    problemIds: ["P-1024"],
    description:
      "High concentration of road infrastructure complaints requiring immediate maintenance.",
  },

  {
    id: "C-002",
    name: "Lucknow Water Supply Cluster",
    location: "Lucknow",
    category: "Water",
    problems: 28,
    critical: 4,
    resolved: 15,
    progress: 64,
    status: "Active",
    problemIds: ["P-1023"],
    description:
      "Citizen reports indicate recurring drinking-water supply problems.",
  },

  {
    id: "C-003",
    name: "Jaipur Electricity Cluster",
    location: "Jaipur",
    category: "Electricity",
    problems: 24,
    critical: 5,
    resolved: 13,
    progress: 54,
    status: "Active",
    problemIds: ["P-1022"],
    description:
      "Street-light and electricity infrastructure issues grouped for monitoring.",
  },

  {
    id: "C-004",
    name: "Bhopal Sanitation Cluster",
    location: "Bhopal",
    category: "Sanitation",
    problems: 21,
    critical: 2,
    resolved: 14,
    progress: 67,
    status: "Active",
    problemIds: ["P-1021"],
    description:
      "Municipal sanitation complaints including garbage collection issues.",
  },

  {
    id: "C-005",
    name: "Kanpur Water Infrastructure Cluster",
    location: "Kanpur",
    category: "Water",
    problems: 18,
    critical: 3,
    resolved: 9,
    progress: 50,
    status: "Active",
    problemIds: ["P-1020"],
    description:
      "Water pipeline and supply infrastructure complaints.",
  },

  {
    id: "C-006",
    name: "Indore Road Maintenance Cluster",
    location: "Indore",
    category: "Roads",
    problems: 15,
    critical: 1,
    resolved: 8,
    progress: 53,
    status: "Active",
    problemIds: ["P-1019"],
    description:
      "Road and pedestrian infrastructure maintenance complaints.",
  },

  {
    id: "C-007",
    name: "Patna Power Infrastructure Cluster",
    location: "Patna",
    category: "Electricity",
    problems: 19,
    critical: 6,
    resolved: 7,
    progress: 37,
    status: "Critical",
    problemIds: ["P-1018"],
    description:
      "Critical electricity infrastructure problems affecting citizens.",
  },

  {
    id: "C-008",
    name: "Pune Drainage Cluster",
    location: "Pune",
    category: "Sanitation",
    problems: 17,
    critical: 3,
    resolved: 10,
    progress: 59,
    status: "Active",
    problemIds: ["P-1017"],
    description:
      "Drainage and water accumulation problems requiring municipal action.",
  },
];


// ============================================================
// CATEGORY STATS
// ============================================================

export const categoryStats = [
  {
    category: "Roads",
    count: 2,
    activity: 84,
  },
  {
    category: "Water",
    count: 2,
    activity: 70,
  },
  {
    category: "Electricity",
    count: 2,
    activity: 56,
  },
  {
    category: "Sanitation",
    count: 2,
    activity: 42,
  },
];


// ============================================================
// SOLUTION PIPELINE
// ============================================================

export interface Solution {
  id: string;
  problemId: string;
  problemTitle: string;
  category: ProblemCategory;
  location: string;
  department: string;
  currentStage: SolutionStage;
  progress: number;
  assignedTeam: string;
  estimatedCompletion: string;
  action: string;
  impact: string;
}

export const solutions: Solution[] = [
  {
    id: "S-001",
    problemId: "P-1024",
    problemTitle: "Major Road Damage",
    category: "Roads",
    location: "Central Delhi",
    department: "Public Works Department",
    currentStage: "Verified",
    progress: 35,
    assignedTeam: "PWD Road Maintenance Team",
    estimatedCompletion: "08 Sep 2026",
    action: "Road inspection and pothole repair",
    impact: "Improves road safety and reduces accident risk.",
  },

  {
    id: "S-002",
    problemId: "P-1023",
    problemTitle: "Drinking Water Shortage",
    category: "Water",
    location: "Lucknow",
    department: "Jal Nigam",
    currentStage: "In Execution",
    progress: 70,
    assignedTeam: "Lucknow Water Response Team",
    estimatedCompletion: "06 Sep 2026",
    action: "Restore supply and inspect water distribution network",
    impact: "Restores reliable drinking-water access.",
  },

  {
    id: "S-003",
    problemId: "P-1022",
    problemTitle: "Street Light Failure",
    category: "Electricity",
    location: "Jaipur",
    department: "Jaipur Municipal Corporation",
    currentStage: "Reported",
    progress: 15,
    assignedTeam: "Electrical Field Team",
    estimatedCompletion: "10 Sep 2026",
    action: "Field verification and electrical inspection",
    impact: "Improves public-area visibility and safety.",
  },

  {
    id: "S-004",
    problemId: "P-1021",
    problemTitle: "Garbage Collection Issue",
    category: "Sanitation",
    location: "Bhopal",
    department: "Municipal Corporation",
    currentStage: "Resolved",
    progress: 100,
    assignedTeam: "Bhopal Sanitation Team",
    estimatedCompletion: "Completed",
    action: "Additional collection vehicle deployed",
    impact: "Restored regular waste collection.",
  },

  {
    id: "S-005",
    problemId: "P-1020",
    problemTitle: "Water Pipeline Leakage",
    category: "Water",
    location: "Kanpur",
    department: "Water Supply Department",
    currentStage: "In Execution",
    progress: 65,
    assignedTeam: "Pipeline Repair Team",
    estimatedCompletion: "07 Sep 2026",
    action: "Replace damaged pipeline section",
    impact: "Reduces water loss and supply disruption.",
  },

  {
    id: "S-006",
    problemId: "P-1019",
    problemTitle: "Broken Footpath",
    category: "Roads",
    location: "Indore",
    department: "Public Works Department",
    currentStage: "Assigned",
    progress: 40,
    assignedTeam: "Indore Civil Works Team",
    estimatedCompletion: "12 Sep 2026",
    action: "Repair damaged pedestrian pathway",
    impact: "Improves pedestrian accessibility and safety.",
  },

  {
    id: "S-007",
    problemId: "P-1018",
    problemTitle: "Transformer Fault",
    category: "Electricity",
    location: "Patna",
    department: "Electricity Board",
    currentStage: "Verified",
    progress: 30,
    assignedTeam: "Patna Power Response Team",
    estimatedCompletion: "07 Sep 2026",
    action: "Transformer inspection and replacement",
    impact: "Restores stable electricity supply.",
  },

  {
    id: "S-008",
    problemId: "P-1017",
    problemTitle: "Drainage Blockage",
    category: "Sanitation",
    location: "Pune",
    department: "Pune Municipal Corporation",
    currentStage: "In Execution",
    progress: 75,
    assignedTeam: "Drainage Maintenance Team",
    estimatedCompletion: "06 Sep 2026",
    action: "Clear blocked drainage and repair damaged section",
    impact: "Reduces water accumulation and flooding risk.",
  },
];


// ============================================================
// PIPELINE STAGES
// ============================================================

export const solutionStages: {
  id: SolutionStage;
  label: string;
  description: string;
}[] = [
  {
    id: "Reported",
    label: "Reported",
    description: "Citizen submits a problem",
  },
  {
    id: "Verified",
    label: "Verified",
    description: "Government verifies the issue",
  },
  {
    id: "Assigned",
    label: "Assigned",
    description: "Responsible department assigned",
  },
  {
    id: "In Execution",
    label: "In Execution",
    description: "Solution work is underway",
  },
  {
    id: "Resolved",
    label: "Resolved",
    description: "Problem successfully completed",
  },
];