// src/mockData/bundles.js
// Multi-department Corridor Bundling output & comparison metrics

export const mockBundles = [
  {
    bundleId: "BUNDLE-014",
    corridor: "NDLS-CNB",
    corridorName: "New Delhi - Kanpur Central (Line 1)",
    window: { date: "2026-09-05", start: "02:10", end: "04:40", durationMins: 150 },
    taskIds: ["ENG-2031", "SNT-1187", "TRC-0552"],
    departments: ["Engineering", "S&T", "Traction"],
    tasks: [
      { id: "ENG-2031", dept: "Engineering", title: "Rail Fracture Repair & Ultrasonic Testing", dur: 90, priority: 91, status: "Critical" },
      { id: "SNT-1187", dept: "S&T", title: "Point Machine Overhaul & Relay Testing", dur: 75, priority: 78, status: "High" },
      { id: "TRC-0552", dept: "Traction", title: "OHE Insulator Cleaning & Contact Wire Dropper", dur: 90, priority: 79, status: "High" }
    ],
    combinedPriority: 83,
    powerShutoffRequired: true,
    speedRestrictionRequired: true,
    isolatedPossessionHours: 4.25, // 90m + 75m + 90m = 255 mins
    bundledPossessionHours: 2.50, // 150 mins
    downtimeSavedHours: 1.75, // 105 mins saved
    synergyScore: "94% Optimal",
    whyBundled: "Same corridor segment (KM 438–439). 25kV traction power shutdown is shared between OHE work and track gang safety. S&T point machine calibration executed simultaneously on loop approach without spatial conflict.",
    safetyCompatibility: "Verified Compatible: Earthing discharge rods positioned at KM 437/20 & 440/10 cover both Track Machine and Tower Wagon zones."
  },
  {
    bundleId: "BUNDLE-015",
    corridor: "HWH-MGS",
    corridorName: "Howrah - Pt. Deen Dayal Upadhyaya (Line 2)",
    window: { date: "2026-09-06", start: "01:30", end: "04:00", durationMins: 150 },
    taskIds: ["ENG-2045", "SNT-1192", "TRC-0561"],
    departments: ["Engineering", "S&T", "Traction"],
    tasks: [
      { id: "ENG-2045", dept: "Engineering", title: "Ballast Deep Screening & Tamping", dur: 150, priority: 84, status: "Critical" },
      { id: "SNT-1192", dept: "S&T", title: "Axle Counter Replacement & Cable Jointing", dur: 60, priority: 56, status: "Medium" },
      { id: "TRC-0561", dept: "Traction", title: "Substation Circuit Breaker Maintenance", dur: 120, priority: 74, status: "High" }
    ],
    combinedPriority: 75,
    powerShutoffRequired: true,
    speedRestrictionRequired: true,
    isolatedPossessionHours: 5.50,
    bundledPossessionHours: 2.50,
    downtimeSavedHours: 3.00,
    synergyScore: "91% Optimal",
    whyBundled: "BCM Ballast machine operates with overhead de-energization while Traction substation maintenance is performed on parallel feeder. S&T replaces axle counter during same track vacancy.",
    safetyCompatibility: "Verified Compatible: Feeder isolation notice aligned with BCM plant operator protocol."
  },
  {
    bundleId: "BUNDLE-016",
    corridor: "BCT-BRC",
    corridorName: "Mumbai Central - Vadodara (Western Line)",
    window: { date: "2026-09-07", start: "00:45", end: "02:45", durationMins: 120 },
    taskIds: ["ENG-2052", "SNT-1205", "TRC-0578"],
    departments: ["Engineering", "S&T", "Traction"],
    tasks: [
      { id: "ENG-2052", dept: "Engineering", title: "Turnout Sleeper Renewal", dur: 110, priority: 71, status: "High" },
      { id: "SNT-1205", dept: "S&T", title: "Kavach ATP Trackside Unit Diagnostic", dur: 60, priority: 86, status: "Critical" },
      { id: "TRC-0578", dept: "Traction", title: "Cantilever Assembly Realignment", dur: 75, priority: 52, status: "Medium" }
    ],
    combinedPriority: 72,
    powerShutoffRequired: true,
    speedRestrictionRequired: true,
    isolatedPossessionHours: 4.08,
    bundledPossessionHours: 2.00,
    downtimeSavedHours: 2.08,
    synergyScore: "88% Optimal",
    whyBundled: "Turnout possession allows simultaneous track balise calibration for Kavach ATP and Tower Wagon cantilever adjustment over crossover.",
    safetyCompatibility: "Verified Compatible: Signalling bypass isolation synchronized with mechanical locking."
  },
  {
    bundleId: "BUNDLE-017",
    corridor: "MAS-RU",
    corridorName: "Chennai Central - Renigunta (South Central)",
    window: { date: "2026-09-08", start: "11:15", end: "13:15", durationMins: 120 },
    taskIds: ["ENG-2060", "SNT-1218", "TRC-0590"],
    departments: ["Engineering", "S&T", "Traction"],
    tasks: [
      { id: "ENG-2060", dept: "Engineering", title: "Flash Butt Rail Welding", dur: 120, priority: 73, status: "High" },
      { id: "SNT-1218", dept: "S&T", title: "Electronic Interlocking (EI) Diagnostic & Card Swap", dur: 90, priority: 89, status: "Critical" },
      { id: "TRC-0590", dept: "Traction", title: "Section Insulator Gap Adjustment", dur: 60, priority: 47, status: "Medium" }
    ],
    combinedPriority: 76,
    powerShutoffRequired: true,
    speedRestrictionRequired: true,
    isolatedPossessionHours: 4.50,
    bundledPossessionHours: 2.00,
    downtimeSavedHours: 2.50,
    synergyScore: "89% Optimal",
    whyBundled: "Station area traffic block allows concurrent EI CPU card replacement while flash butt welding plant occupies outer loop and OHE gang sets runner gaps.",
    safetyCompatibility: "Verified Compatible: Non-interlocked caution protocol established for station yard."
  }
];
