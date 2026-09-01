// src/mockData/kpis.js
// Top-level Control Room KPIs and historical 4-week trend data

export const controlRoomKpis = {
  totalTasks: 214,
  plannedBlocksWeek: 18,
  conflictsDetected: 9,
  conflictsResolved: 9,
  downtimeHours: 46.5,
  simulatedAvailabilityPct: 94.2,
  coordinationRatePct: 61.0,
  pendingApprovalCount: 4,
  activeCorridorsCount: 5,
  safetyHardConstraintsSatisfied: "100%"
};

export const fourWeekTrends = [
  { week: "Week -3", downtimeHours: 112.0, availabilityPct: 83.5, coordinationRatePct: 18.0, isolatedBlocks: 46, unifiedBlocks: 6 },
  { week: "Week -2", downtimeHours: 98.5, availabilityPct: 86.2, coordinationRatePct: 29.0, isolatedBlocks: 38, unifiedBlocks: 10 },
  { week: "Week -1", downtimeHours: 72.0, availabilityPct: 89.8, coordinationRatePct: 44.0, isolatedBlocks: 26, unifiedBlocks: 14 },
  { week: "Current (KavachX)", downtimeHours: 46.5, availabilityPct: 94.2, coordinationRatePct: 61.0, isolatedBlocks: 0, unifiedBlocks: 18 }
];

export const departmentBreakdown = [
  {
    department: "Engineering (Track)",
    deptCode: "Engineering",
    color: "#0B3D91",
    totalTasks: 94,
    criticalTasks: 6,
    avgPriority: 74.2,
    pendingPossessions: 8,
    icon: "Hammer"
  },
  {
    department: "S&T (Signal & Telecom)",
    deptCode: "S&T",
    color: "#E9762B",
    totalTasks: 68,
    criticalTasks: 4,
    avgPriority: 68.6,
    pendingPossessions: 6,
    icon: "Radio"
  },
  {
    department: "Traction (Electrical / OHE)",
    deptCode: "Traction",
    color: "#059669",
    totalTasks: 52,
    criticalTasks: 4,
    avgPriority: 71.0,
    pendingPossessions: 4,
    icon: "Zap"
  }
];
