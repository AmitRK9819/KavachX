// src/mockData/blocks.js
// Scheduled / Optimized railway blocks for weekly and monthly plans

export const initialWeeklyBlocks = [
  {
    blockId: "BLK-0042",
    corridor: "NDLS-CNB",
    corridorName: "New Delhi - Kanpur Central (Line 1)",
    date: "2026-09-05",
    dayOfWeek: "Saturday",
    start: "02:10",
    end: "04:40",
    durationMins: 150,
    departments: ["Engineering", "S&T", "Traction"],
    taskCount: 3,
    taskIds: ["ENG-2031", "SNT-1187", "TRC-0552"],
    activities: [
      "Rail fracture repair & USFD testing (KM 438/12)",
      "Point machine 42A overhaul & relay contact tuning",
      "OHE mast 819 insulator wash & contact dropper replacement"
    ],
    priority: 91,
    priorityBand: "Critical",
    powerShutoffRequired: true,
    speedRestrictionRequired: true,
    reasonSelected: "Minimizes total block time while bundling 3 overdue critical tasks under shared 25kV power cut; zero passenger train conflict.",
    status: "Pending Approval", // 'Pending Approval' | 'Approved' | 'Rejected' | 'Revision Requested'
    reviewedBy: null,
    reviewTimestamp: null
  },
  {
    blockId: "BLK-0043",
    corridor: "HWH-MGS",
    corridorName: "Howrah - Pt. Deen Dayal Upadhyaya (Line 2)",
    date: "2026-09-06",
    dayOfWeek: "Sunday",
    start: "01:30",
    end: "04:00",
    durationMins: 150,
    departments: ["Engineering", "S&T", "Traction"],
    taskCount: 3,
    taskIds: ["ENG-2045", "SNT-1192", "TRC-0561"],
    activities: [
      "Ballast deep screening with BCM plant (KM 122)",
      "Digital axle counter 108 module replacement",
      "Substation 25kV SF6 circuit breaker pressure diagnostic"
    ],
    priority: 84,
    priorityBand: "Critical",
    powerShutoffRequired: true,
    speedRestrictionRequired: true,
    reasonSelected: "Optimal night slack slot prior to morning steel freight rake; coordinates BCM machine with traction substation feeder isolation.",
    status: "Approved",
    reviewedBy: "Chief Controller / Ops (HQ)",
    reviewTimestamp: "2026-09-01 18:20 IST"
  },
  {
    blockId: "BLK-0044",
    corridor: "BCT-BRC",
    corridorName: "Mumbai Central - Vadodara (Western Line)",
    date: "2026-09-07",
    dayOfWeek: "Monday",
    start: "00:45",
    end: "02:45",
    durationMins: 120,
    departments: ["Engineering", "S&T", "Traction"],
    taskCount: 3,
    taskIds: ["ENG-2052", "SNT-1205", "TRC-0578"],
    activities: [
      "Turnout 19 sleeper renewal (Surat approaches)",
      "Kavach ATP trackside unit RFID balise diagnostic",
      "Cantilever assembly realignment & stagger check"
    ],
    priority: 86,
    priorityBand: "Critical",
    powerShutoffRequired: true,
    speedRestrictionRequired: true,
    reasonSelected: "Permits critical Kavach 160 km/h balise validation during simultaneous turnout track renewal; prevents independent caution orders.",
    status: "Pending Approval",
    reviewedBy: null,
    reviewTimestamp: null
  },
  {
    blockId: "BLK-0045",
    corridor: "MAS-RU",
    corridorName: "Chennai Central - Renigunta (South Central)",
    date: "2026-09-08",
    dayOfWeek: "Tuesday",
    start: "11:15",
    end: "13:15",
    durationMins: 120,
    departments: ["Engineering", "S&T", "Traction"],
    taskCount: 3,
    taskIds: ["ENG-2060", "SNT-1218", "TRC-0590"],
    activities: [
      "Mobile flash butt rail welding (KM 88)",
      "Electronic Interlocking CPU Card B replacement",
      "Section insulator runner gap adjustment"
    ],
    priority: 89,
    priorityBand: "Critical",
    powerShutoffRequired: true,
    speedRestrictionRequired: false,
    reasonSelected: "Daytime shadow block between morning and evening express corridor peaks; station area yard isolation verified.",
    status: "Pending Approval",
    reviewedBy: null,
    reviewTimestamp: null
  },
  {
    blockId: "BLK-0046",
    corridor: "SBC-JTJ",
    corridorName: "KSR Bengaluru - Jolarpettai (South Western)",
    date: "2026-09-09",
    dayOfWeek: "Wednesday",
    start: "01:00",
    end: "03:30",
    durationMins: 150,
    departments: ["Engineering", "S&T"],
    taskCount: 2,
    taskIds: ["ENG-2077", "SNT-1229"],
    activities: [
      "Curve 14 track de-stressing & tensor realignment",
      "LED signal unit luminescence and aspect lux calibration"
    ],
    priority: 34,
    priorityBand: "Low",
    powerShutoffRequired: false,
    speedRestrictionRequired: true,
    reasonSelected: "Preventative thermal adjustment before seasonal temperature surge; scheduled without traction power shutoff.",
    status: "Approved",
    reviewedBy: "Divisional Ops Controller (SBC)",
    reviewTimestamp: "2026-09-01 16:45 IST"
  },
  {
    blockId: "BLK-0047",
    corridor: "NDLS-CNB",
    corridorName: "New Delhi - Kanpur Central (Line 1)",
    date: "2026-09-10",
    dayOfWeek: "Thursday",
    start: "02:00",
    end: "04:30",
    durationMins: 150,
    departments: ["Engineering", "Traction"],
    taskCount: 2,
    taskIds: ["ENG-2088", "TRC-0605"],
    activities: [
      "Rail grinding machine operation (KM 310 - 325)",
      "Overhead wire height and stagger check with Tower Wagon"
    ],
    priority: 68,
    priorityBand: "High",
    powerShutoffRequired: true,
    speedRestrictionRequired: false,
    reasonSelected: "Coordinated rail profile grinding with catenary height inspection.",
    status: "Pending Approval",
    reviewedBy: null,
    reviewTimestamp: null
  },
  {
    blockId: "BLK-0048",
    corridor: "HWH-MGS",
    corridorName: "Howrah - Pt. Deen Dayal Upadhyaya (Line 2)",
    date: "2026-09-11",
    dayOfWeek: "Friday",
    start: "01:45",
    end: "03:45",
    durationMins: 120,
    departments: ["Engineering", "S&T", "Traction"],
    taskCount: 3,
    taskIds: ["ENG-2092", "SNT-1240", "TRC-0612"],
    activities: [
      "Track tamping with CSM machine (KM 204)",
      "Point machine testing at Sasaram crossover",
      "OHE section insulator inspection"
    ],
    priority: 72,
    priorityBand: "High",
    powerShutoffRequired: true,
    speedRestrictionRequired: true,
    reasonSelected: "Routine high-speed corridor possession; completes weekly Grand Chord quota.",
    status: "Approved",
    reviewedBy: "Chief Controller / Ops (HQ)",
    reviewTimestamp: "2026-09-01 19:10 IST"
  }
];

export const monthlyDensityData = [
  { week: "Week 1 (Sep 1 - 7)", totalBlocks: 18, totalHours: 46.5, deptsCoordinated: 3, highDensityCorridor: "NDLS-CNB", status: "Active Week", densityLevel: "Optimal (Green)" },
  { week: "Week 2 (Sep 8 - 14)", totalBlocks: 16, totalHours: 42.0, deptsCoordinated: 3, highDensityCorridor: "HWH-MGS", status: "Scheduled", densityLevel: "Optimal (Green)" },
  { week: "Week 3 (Sep 15 - 21)", totalBlocks: 19, totalHours: 49.0, deptsCoordinated: 3, highDensityCorridor: "BCT-BRC", status: "Draft Planned", densityLevel: "Heavy (Amber)" },
  { week: "Week 4 (Sep 22 - 28)", totalBlocks: 19, totalHours: 46.5, deptsCoordinated: 3, highDensityCorridor: "MAS-RU", status: "Draft Planned", densityLevel: "Optimal (Green)" }
];
