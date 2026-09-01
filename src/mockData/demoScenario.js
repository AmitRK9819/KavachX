// src/mockData/demoScenario.js
// 7-step guided story walkthrough for live judging presentation

export const demoSteps = [
  {
    step: 1,
    title: "1. Independent & Siloed Requests",
    subtitle: "Three departments submit separate, uncoordinated maintenance requests on the same corridor",
    caption: "In conventional railway operations, Engineering, S&T, and Traction departments operate in functional silos. Each Senior Section Engineer (SSE) enters their own requirement into separate systems without visibility into other departments' plans, requesting overlapping morning slots on the high-speed NDLS-CNB trunk line.",
    keyTakeaway: "3 separate requests = 3 potential track closures = 6.5+ hours of disruption if handled manually.",
    data: {
      corridor: "NDLS-CNB (New Delhi - Kanpur Central)",
      date: "2026-09-05",
      requests: [
        {
          id: "ENG-2031",
          dept: "Engineering",
          task: "Rail Fracture Repair & USFD Testing",
          requestedSlot: "07:00 - 08:30 (Morning)",
          system: "TMS",
          status: "Siloed"
        },
        {
          id: "SNT-1187",
          dept: "S&T",
          task: "Point Machine 42A Overhaul",
          requestedSlot: "07:30 - 08:45 (Morning)",
          system: "SMMS",
          status: "Siloed"
        },
        {
          id: "TRC-0552",
          dept: "Traction",
          task: "OHE Insulator Wash & Dropper Renewal",
          requestedSlot: "08:00 - 09:30 (Morning)",
          system: "TDMS",
          status: "Siloed"
        }
      ]
    }
  },
  {
    step: 2,
    title: "2. AI Prioritization Engine",
    subtitle: "KavachX ingests all 3 requests and calculates explainable priority scores (0–100)",
    caption: "Instead of treating all requests as equal first-come-first-served tickets, KavachX's multi-factor explainable AI scores each task using 6 deterministic factors: defect severity, urgency, failure risk, overdue days, asset impact, and track criticality.",
    keyTakeaway: "Every score has a clear, audit-ready natural language justification for the controller.",
    data: {
      scores: [
        {
          id: "ENG-2031",
          dept: "Engineering",
          score: 91,
          band: "Critical",
          factors: { severity: 24, urgency: 20, criticality: 22, failureRisk: 14, overdue: 11 },
          aiReason: "Critical (91/100): High defect severity (88) with imminent rail fracture risk. 14 days overdue on 130 km/h main line."
        },
        {
          id: "SNT-1187",
          dept: "S&T",
          score: 78,
          band: "High",
          factors: { severity: 19, urgency: 16, criticality: 18, failureRisk: 11, overdue: 8 },
          aiReason: "High (78/100): Point machine switch 42A showing motor current surge (4.8A); 8 days overdue."
        },
        {
          id: "TRC-0552",
          dept: "Traction",
          score: 79,
          band: "High",
          factors: { severity: 20, urgency: 15, criticality: 19, failureRisk: 12, overdue: 7 },
          aiReason: "High (79/100): Flashover marks on mast 819 bracket insulators; requires 25kV power block."
        }
      ]
    }
  },
  {
    step: 3,
    title: "3. Conflicting Window Rejected",
    subtitle: "KavachX checks the naive 07:00–09:30 morning windows against Timetable & Hard Safety Constraints",
    caption: "The system runs automated feasibility checking. The requested morning windows are immediately REJECTED because they directly collide with 22436 Vande Bharat Express and 12876 Neelachal Express, violating the mandatory 15-minute safety buffer.",
    keyTakeaway: "Hard safety rules are non-negotiable — the system prevents human oversight before a block can even be proposed.",
    data: {
      rejectedWindows: [
        {
          slot: "07:00 - 08:30 (ENG-2031)",
          status: "REJECTED (RED)",
          reason: "Violates Hard Constraint HC-01: Collides with 22436 Vande Bharat Express (06:00-07:15) buffer & 12876 Neelachal Express (07:35-09:10)."
        },
        {
          slot: "07:30 - 08:45 (SNT-1187)",
          status: "REJECTED (RED)",
          reason: "Violates Hard Constraint HC-01: Direct track possession clash with 12876 Neelachal Express at Aligarh Junction."
        },
        {
          slot: "08:00 - 09:30 (TRC-0552)",
          status: "REJECTED (RED)",
          reason: "Violates Hard Constraint HC-03: 25kV power cutoff would immobilize approaching passenger trains."
        }
      ]
    }
  },
  {
    step: 4,
    title: "4. Feasible Window Identified",
    subtitle: "System scans section timetable and identifies an optimal zero-conflict night slack slot",
    caption: "KavachX scans the COA and timetable data for the corridor and identifies an open 150-minute slot at 02:10–04:40 (between CONCOR Freight and morning coal trains). It satisfies all 5 hard safety constraints and electrical earthing rules.",
    keyTakeaway: "Found a mathematically proven collision-free window with 0 passenger delay.",
    data: {
      foundWindow: {
        slot: "02:10 - 04:40 (Night Slot)",
        duration: "150 mins (2.5 hrs)",
        corridor: "NDLS-CNB (KM 438-440)",
        feasible: true,
        verification: [
          "Zero passenger train clashes (02:10 - 04:40 is free of passenger paths)",
          "10-min safety separation after CONCOR freight (01:00-02:00)",
          "15-min clearance before Coal Rake (04:45-05:45)",
          "25kV power cut window synchronized with grid substation"
        ]
      }
    }
  },
  {
    step: 5,
    title: "5. Multi-Department Tasks Bundled",
    subtitle: "Engineering, S&T, and Traction tasks are merged into a single coordinated block card",
    caption: "Instead of executing three independent line blocks (which would shut down the track 3 separate times for a total of 255 mins), KavachX bundles ENG-2031, SNT-1187, and TRC-0552 into ONE unified possession card under a single 25kV power shutdown.",
    keyTakeaway: "Saves 105 minutes (1.75 hrs) of track closure and prevents 2 separate line shutdowns.",
    data: {
      bundleCard: {
        id: "BUNDLE-014",
        corridor: "NDLS-CNB",
        window: "02:10 - 04:40 (150 mins)",
        combinedPriority: 83,
        tasks: [
          { id: "ENG-2031", dept: "Engineering", title: "Rail Fracture Repair", dur: "90 min" },
          { id: "SNT-1187", dept: "S&T", title: "Point Machine 42A Overhaul", dur: "75 min" },
          { id: "TRC-0552", dept: "Traction", title: "OHE Mast 819 Dropper & Insulator", dur: "90 min" }
        ],
        isolatedDuration: "255 mins (4.25 hrs)",
        bundledDuration: "150 mins (2.50 hrs)",
        savedHours: "1.75 hrs saved"
      }
    }
  },
  {
    step: 6,
    title: "6. CP-SAT Integer Optimization",
    subtitle: "Google OR-Tools CP-SAT selects the bundled block across network-wide multi-objective trade-offs",
    caption: "The Google OR-Tools CP-SAT solver solves the global combinatorial optimization problem in 0.28 seconds. It selects BUNDLE-014 as part of the optimal weekly schedule, mathematically proving that downtime is minimized while achieving 100% critical maintenance coverage.",
    keyTakeaway: "Proves global optimality over 168 constraints and rejects sub-optimal candidate schedules.",
    data: {
      solverMeta: {
        engine: "Google OR-Tools CP-SAT",
        status: "OPTIMAL",
        runtime: "0.284 sec",
        objectiveScore: 4892.4
      },
      selectedBlock: {
        id: "BLK-0042",
        corridor: "NDLS-CNB",
        date: "2026-09-05",
        time: "02:10 - 04:40",
        departments: ["Engineering", "S&T", "Traction"],
        decision: "OPTIMAL SCHEDULE SELECTED"
      }
    }
  },
  {
    step: 7,
    title: "7. Weekly Plan Update & Human Sign-off",
    subtitle: "Block is placed in the Weekly Plan & sent to the Chief Controller for final human approval",
    caption: "The approved block is automatically reflected in the Weekly/Monthly block plans and queued in the Block Approval hub. KavachX adheres strictly to 'AI Recommends, Human Approves' — the duty controller reviews the AI rationale and gives the final green signal.",
    keyTakeaway: "Full circle: From 3 uncoordinated siloed requests to a single optimized, approved block!",
    data: {
      finalBlock: {
        blockId: "BLK-0042",
        corridor: "NDLS-CNB",
        date: "2026-09-05",
        time: "02:10 - 04:40",
        status: "Pending Approval",
        departments: ["Engineering", "S&T", "Traction"],
        actionRequired: "Awaiting Chief Controller Approval"
      },
      beforeAfterSummary: {
        possessions: "3 ➔ 1 (-66.7%)",
        conflicts: "3 ➔ 0 (100% Resolved)",
        downtime: "4.25 hrs ➔ 2.50 hrs (-41.2%)",
        passengerDelays: "185 min delay avoided"
      }
    }
  }
];
