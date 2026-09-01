// src/mockData/optimizerResults.js
// Solved schedule output using Google OR-Tools CP-SAT (Constraint Satisfaction / Integer Programming)

export const optimizerMetadata = {
  solver: "Google OR-Tools CP-SAT",
  version: "9.8.3296",
  status: "OPTIMAL",
  solveTimeSeconds: 0.284,
  variablesCount: 42,
  constraintsCount: 168,
  objectiveValue: 4892.4,
  conflictsAvoided: 9,
  criticalTasksCovered: "100% (14 / 14)",
  multiDeptSynergyScore: 92.4,
  timestamp: "2026-09-01 22:55:12 IST"
};

export const objectiveBreakdown = [
  { name: "Total Network Downtime Minimized", weight: 35, achievedScore: 96, unit: "46.5 hrs total" },
  { name: "Zero Passenger Train Overlap", weight: 30, achievedScore: 100, unit: "0 conflicts" },
  { name: "Critical & High Task Coverage", weight: 20, achievedScore: 100, unit: "100% covered" },
  { name: "Multi-Department Synergy Maximized", weight: 10, achievedScore: 92, unit: "61% bundled" },
  { name: "Machine & Crew Leveling", weight: 5, achievedScore: 88, unit: "Balanced load" }
];

export const candidateSchedules = [
  {
    id: "SCHED-OPT",
    name: "CP-SAT Solved Schedule (Optimal)",
    status: "SELECTED",
    isRecommended: true,
    totalBlocks: 18,
    totalDowntimeHours: 46.5,
    passengerDelayMinutes: 0,
    criticalTasksCovered: 14,
    synergyScore: 92.4,
    rationale: "Selected by CP-SAT: Mathematically optimal solution achieving 0 passenger delay, 100% critical task resolution, and 65% reduction in possession hours through 3-way departmental bundling."
  },
  {
    id: "SCHED-ALT-1",
    name: "Candidate Schedule B (Isolated Department Requests)",
    status: "REJECTED",
    isRecommended: false,
    totalBlocks: 54,
    totalDowntimeHours: 135.0,
    passengerDelayMinutes: 185,
    criticalTasksCovered: 11,
    synergyScore: 12.0,
    rationale: "Rejected: Suffer 185 mins of passenger train delay due to daytime morning possessions; 3x higher track possession hours; 3 critical tasks deferred due to machine clash."
  },
  {
    id: "SCHED-ALT-2",
    name: "Candidate Schedule C (Partial 2-Dept Bundling)",
    status: "REJECTED",
    isRecommended: false,
    totalBlocks: 32,
    totalDowntimeHours: 78.0,
    passengerDelayMinutes: 25,
    criticalTasksCovered: 13,
    synergyScore: 54.0,
    rationale: "Rejected: Does not bundle Traction power shutoffs with Civil engineering; leaves 25kV power cut window uncoordinated causing 25 mins buffer spillover."
  }
];
