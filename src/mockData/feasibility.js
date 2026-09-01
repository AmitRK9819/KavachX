// src/mockData/feasibility.js
// Feasibility evaluation, hard safety constraints, and corridor Gantt timeline data

export const hardConstraintsList = [
  {
    id: "HC-01",
    name: "Zero Passenger Train Overlap",
    description: "No maintenance possession can overlap with scheduled passenger or express train paths. Hard clearance requirement.",
    status: "Strict Enforced",
    category: "Traffic Safety"
  },
  {
    id: "HC-02",
    name: "Mandatory 15-Minute Safety Buffer",
    description: "At least 15 minutes of separation before the first arriving train and after the last departing train in the section.",
    status: "Strict Enforced",
    category: "Safety Buffer"
  },
  {
    id: "HC-03",
    name: "Traction Power Shutoff & Earthing Sync",
    description: "Traction (OHE) work and track machine work requiring overhead de-energization must align power block permit windows exactly.",
    status: "Strict Enforced",
    category: "Electrical Safety"
  },
  {
    id: "HC-04",
    name: "Max Continuous Possession Duration (240 Mins)",
    description: "Single block possession cannot exceed 4 hours without operational relief slot to avoid network congestion spillover.",
    status: "Strict Enforced",
    category: "Operations"
  },
  {
    id: "HC-05",
    name: "Resource Crew & Heavy Plant Non-Overlap",
    description: "Heavy track machines (BCM, CSM, Tamping) and specialized crane teams cannot be double-booked across adjacent sections.",
    status: "Strict Enforced",
    category: "Resource Allocation"
  }
];

export const corridorTimelines = {
  "NDLS-CNB": {
    corridorId: "NDLS-CNB",
    corridorName: "New Delhi - Kanpur Central",
    date: "2026-09-05",
    trains: [
      { id: "T1", name: "22436 Vande Bharat", type: "passenger", start: 360, end: 435, label: "06:00 - 07:15", color: "bg-blue-600" },
      { id: "T2", name: "12876 Neelachal Exp", type: "passenger", start: 455, end: 550, label: "07:35 - 09:10", color: "bg-blue-500" },
      { id: "T3", name: "12002 Shatabdi Exp", type: "passenger", start: 360, end: 445, label: "06:00 - 07:25", color: "bg-blue-600" },
      { id: "T4", name: "CONCOR Freight G1", type: "goods", start: 60, end: 120, label: "01:00 - 02:00", color: "bg-amber-600" },
      { id: "T5", name: "Coal Rake BOXNHL", type: "goods", start: 285, end: 345, label: "04:45 - 05:45", color: "bg-amber-600" },
      { id: "T6", name: "12301 Rajdhani Exp", type: "passenger", start: 1015, end: 1100, label: "16:55 - 18:20", color: "bg-blue-700" }
    ],
    candidateWindows: [
      {
        id: "CW-01",
        taskId: "ENG-2031",
        department: "Engineering",
        requestedSlot: "07:00 - 08:30 (Morning)",
        startMin: 420,
        endMin: 510,
        feasible: false,
        conflictType: "TRAIN_OVERLAP",
        conflictDetails: "Overlaps 12876 Neelachal Express (07:35–09:10) & violates 15-min safety buffer with Vande Bharat.",
        recommendedAlternative: "Shift to Night Slot 02:10 - 04:40"
      },
      {
        id: "CW-02",
        taskId: "SNT-1187",
        department: "S&T",
        requestedSlot: "07:30 - 08:45 (Morning)",
        startMin: 450,
        endMin: 525,
        feasible: false,
        conflictType: "TRAIN_OVERLAP",
        conflictDetails: "Direct collision with Neelachal Express at Aligarh yard approach.",
        recommendedAlternative: "Bundle with ENG-2031 in 02:10 - 04:40 window"
      },
      {
        id: "CW-03",
        taskId: "TRC-0552",
        department: "Traction",
        requestedSlot: "08:00 - 09:30 (Morning)",
        startMin: 480,
        endMin: 570,
        feasible: false,
        conflictType: "TRAIN_OVERLAP",
        conflictDetails: "25kV power cut would stall incoming Rajdhani & Shatabdi feeder lines.",
        recommendedAlternative: "Bundle with ENG-2031 in 02:10 - 04:40 window"
      },
      {
        id: "CW-04",
        taskId: "BUNDLE-014",
        department: "Multi-Department (Bundled)",
        requestedSlot: "02:10 - 04:40 (Night Slot)",
        startMin: 130,
        endMin: 280,
        feasible: true,
        conflictType: "NONE",
        conflictDetails: "Zero passenger conflicts. Fits neatly between CONCOR Freight (ends 02:00) and Coal Rake (starts 04:45) with 10-min buffers.",
        recommendedAlternative: "Recommended for CP-SAT Optimizer Schedule"
      }
    ]
  },
  "HWH-MGS": {
    corridorId: "HWH-MGS",
    corridorName: "Howrah - Pt. Deen Dayal Upadhyaya",
    date: "2026-09-06",
    trains: [
      { id: "HT1", name: "12381 Poorva Exp", type: "passenger", start: 495, end: 590, label: "08:15 - 09:50", color: "bg-blue-600" },
      { id: "HT2", name: "Steel Rake BOST", type: "goods", start: 255, end: 330, label: "04:15 - 05:30", color: "bg-amber-600" }
    ],
    candidateWindows: [
      {
        id: "CW-05",
        taskId: "BUNDLE-015",
        department: "Multi-Department (Bundled)",
        requestedSlot: "01:30 - 04:00 (Night Slot)",
        startMin: 90,
        endMin: 240,
        feasible: true,
        conflictType: "NONE",
        conflictDetails: "Clear 15-minute buffer ahead of 04:15 Steel Rake. Full 2.5 hr possession verified.",
        recommendedAlternative: "Recommended for CP-SAT Optimizer Schedule"
      }
    ]
  }
};
