// src/mockData/systemsData.js
// Raw synthetic data from multi-source Indian Railways maintenance and operational systems

export const systemsInfo = {
  tms: {
    code: "TMS",
    name: "Track Management System",
    description: "Civil & Permanent Way Engineering records: track geometry flaws, rail fractures, ultrasonic testing (USFD) logs, and sleeper renewals.",
    lastSync: "2026-09-01 22:30 IST",
    sourceBadge: "Engineering (Track)",
    recordCount: 84
  },
  smms: {
    code: "SMMS",
    name: "Signalling & Telecom Maintenance Management",
    description: "S&T asset condition logs: point machine health, relay room diagnostics, digital axle counters, electronic interlocking, and Kavach ATP trackside units.",
    lastSync: "2026-09-01 22:45 IST",
    sourceBadge: "S&T (Signalling)",
    recordCount: 62
  },
  tdms: {
    code: "TDMS",
    name: "Traction Distribution Management System",
    description: "Electrical OHE (Overhead Equipment) logs: 25kV catenary wear, cantilever stagger, bracket insulators, neutral sections, and traction substations.",
    lastSync: "2026-09-01 22:40 IST",
    sourceBadge: "Traction (Electrical)",
    recordCount: 48
  },
  bdms: {
    code: "BDMS",
    name: "Block Demand Management System",
    description: "Departmental block requisition queue: uncoordinated requests independently submitted by sectional Senior Section Engineers (SSEs).",
    lastSync: "2026-09-01 22:50 IST",
    sourceBadge: "Operating / Control",
    recordCount: 29
  },
  coa: {
    code: "COA",
    name: "Control Office Application",
    description: "Live section controller line status, line occupancy, existing emergency caution orders, and speed restrictions.",
    lastSync: "2026-09-01 22:54 IST (Live Feed)",
    sourceBadge: "Real-time Operations",
    recordCount: 16
  },
  timetable: {
    code: "TIMETABLE",
    name: "Passenger & Express Master Timetable",
    description: "Working Time Table (WTT) schedules for Vande Bharat, Rajdhani, Shatabdi, Superfast Express, and Mail trains across corridors.",
    lastSync: "Active WTT 2026-27",
    sourceBadge: "Fixed Timetable",
    recordCount: 120
  },
  goods: {
    code: "GOODS",
    name: "Freight & Goods Operations Information System (FOIS)",
    description: "Forecasted freight paths, container rakes, BTPN petroleum tankers, and coal rake slots with dynamic transit windows.",
    lastSync: "FOIS Dynamic Slot Prediction",
    sourceBadge: "Freight Forecasting",
    recordCount: 42
  }
};

export const rawTmsData = [
  { id: "TMS-101", assetId: "TRK-CNB-104-UP", corridor: "NDLS-CNB", chainage: "KM 438/12 - 438/26", defect: "Rail Fracture / USFD Defect Flag", severity: "Critical", overdueDays: 14, trackType: "60 kg UIC", ballastCondition: "Clean", reportedDate: "2026-08-18" },
  { id: "TMS-102", assetId: "TRK-HWH-512-DN", corridor: "HWH-MGS", chainage: "KM 122/04 - 123/18", defect: "Ballast Fouling >45% (Deep Screening Req)", severity: "High", overdueDays: 18, trackType: "60 kg UIC", ballastCondition: "Fouled", reportedDate: "2026-08-14" },
  { id: "TMS-103", assetId: "TRK-BRC-TO-19", corridor: "BCT-BRC", chainage: "KM 392/01 - 392/10", defect: "Turnout 1:12 Sleeper Deterioration", severity: "High", overdueDays: 9, trackType: "52 kg UIC", ballastCondition: "Moderate", reportedDate: "2026-08-23" },
  { id: "TMS-104", assetId: "TRK-MAS-WELD-88", corridor: "MAS-RU", chainage: "KM 88/15 - 88/20", defect: "Fishplated Joint Cupping & Squat Defect", severity: "High", overdueDays: 11, trackType: "60 kg UIC", ballastCondition: "Clean", reportedDate: "2026-08-21" },
  { id: "TMS-105", assetId: "TRK-SBC-CURVE-14", corridor: "SBC-JTJ", chainage: "KM 45/00 - 46/50", defect: "Thermal De-stressing Due (Curve 3.2 deg)", severity: "Low", overdueDays: 0, trackType: "60 kg UIC", ballastCondition: "Clean", reportedDate: "2026-08-29" },
  { id: "TMS-106", assetId: "TRK-CNB-208-DN", corridor: "NDLS-CNB", chainage: "KM 312/10 - 313/00", defect: "Corrugation on Gauge Face", severity: "Medium", overdueDays: 5, trackType: "60 kg UIC", ballastCondition: "Clean", reportedDate: "2026-08-27" },
  { id: "TMS-107", assetId: "TRK-HWH-340-UP", corridor: "HWH-MGS", chainage: "KM 204/10 - 205/15", defect: "Worn Tongue Rail in Scissor Crossover", severity: "High", overdueDays: 7, trackType: "60 kg UIC", ballastCondition: "Moderate", reportedDate: "2026-08-25" }
];

export const rawSmmsData = [
  { id: "SMMS-201", assetId: "SIG-SW-42A", corridor: "NDLS-CNB", location: "Aligarh Junction West Yard", assetType: "Point Machine (Siemens 220V)", parameter: "Motor Operating Current 4.8A (Norm: 3.2A)", status: "High Degradation", overdueDays: 8 },
  { id: "SMMS-202", assetId: "SIG-AXC-108", corridor: "HWH-MGS", location: "Sasaram Auto Section", assetType: "Digital Axle Counter (Single Section)", parameter: "Intermittent Count Error on Loop Line", status: "Medium Degradation", overdueDays: 4 },
  { id: "SMMS-203", assetId: "ATP-TCAS-BRC-04", corridor: "BCT-BRC", location: "Surat North Approach", assetType: "Kavach Trackside Unit (TCAS)", parameter: "Balise Ping Response Latency >80ms", status: "Critical Safety Flag", overdueDays: 5 },
  { id: "SMMS-204", assetId: "SIG-EI-RU-02", corridor: "MAS-RU", location: "Tirupati Outer Cabin", assetType: "Electronic Interlocking (Kyosan)", parameter: "CPU Module B Redundancy Alert", status: "Critical Redundancy Loss", overdueDays: 7 },
  { id: "SMMS-205", assetId: "SIG-LAMP-SBC-12", corridor: "SBC-JTJ", location: "Bangarapet Home Signal", assetType: "Integrated LED Signal Aspect", parameter: "Green Aspect Lumens 88 Lux (Min 90 Lux)", status: "Low Degradation", overdueDays: 0 },
  { id: "SMMS-206", assetId: "SIG-RELAY-CNB-09", corridor: "NDLS-CNB", location: "Kanpur Outer Relay Room", assetType: "Q-Series Vital Signaling Relay", parameter: "Contact Resistance 0.22 Ohm (Limit 0.18)", status: "Medium Degradation", overdueDays: 6 }
];

export const rawTdmsData = [
  { id: "TDMS-301", assetId: "OHE-MAST-819", corridor: "NDLS-CNB", kmSpan: "KM 438/10 - 439/00", component: "Porcelain Bracket Insulator", metric: "Flashover Tracking Marks & Dropper Wear", riskLevel: "High", overdueDays: 10 },
  { id: "TDMS-302", assetId: "TSS-MGS-CB02", corridor: "HWH-MGS", kmSpan: "Mughalsarai Traction Substation", component: "25kV SF6 Circuit Breaker", metric: "Gas Pressure 4.9 Bar (Trip Limit 4.6)", riskLevel: "High", overdueDays: 6 },
  { id: "TDMS-303", assetId: "OHE-CANT-331", corridor: "BCT-BRC", kmSpan: "KM 391/20 - 392/30", component: "Cantilever Swiveling Assembly", metric: "Contact Wire Stagger Deviation +45mm", riskLevel: "Medium", overdueDays: 3 },
  { id: "TDMS-304", assetId: "OHE-SI-114", corridor: "MAS-RU", kmSpan: "KM 88/00 - 88/50", component: "Section Insulator Assembly", metric: "Runner Wear 18% (Permissible 20%)", riskLevel: "Medium", overdueDays: 2 },
  { id: "TDMS-305", assetId: "OHE-AT-CNB-05", corridor: "NDLS-CNB", kmSpan: "KM 312/00 - 313/00", component: "Auxiliary Transformer 25kVA", metric: "Oil Level at Minimum Indicator Mark", riskLevel: "Low", overdueDays: 1 }
];

export const rawBdmsData = [
  { id: "REQ-01", department: "Engineering", corridor: "NDLS-CNB", date: "2026-09-05", requestedSlot: "07:00 - 09:00", reason: "Emergency USFD & Rail Fracture Welding", status: "Uncoordinated (Siloed)" },
  { id: "REQ-02", department: "S&T", corridor: "NDLS-CNB", date: "2026-09-05", requestedSlot: "07:30 - 09:00", reason: "Point Machine 42A Motor Overhaul", status: "Uncoordinated (Siloed)" },
  { id: "REQ-03", department: "Traction", corridor: "NDLS-CNB", date: "2026-09-05", requestedSlot: "08:00 - 10:00", reason: "25kV OHE Dropper Replacement & Mast 819 Inspection", status: "Uncoordinated (Siloed)" },
  { id: "REQ-04", department: "Engineering", corridor: "HWH-MGS", date: "2026-09-06", requestedSlot: "01:30 - 04:30", reason: "BCM Ballast Screening KM 122", status: "Uncoordinated (Siloed)" },
  { id: "REQ-05", department: "S&T", corridor: "HWH-MGS", date: "2026-09-06", requestedSlot: "02:00 - 03:30", reason: "Axle Counter 108 Card Tuning", status: "Uncoordinated (Siloed)" },
  { id: "REQ-06", department: "Traction", corridor: "HWH-MGS", date: "2026-09-06", requestedSlot: "02:00 - 04:00", reason: "TSS Circuit Breaker Diagnostic", status: "Uncoordinated (Siloed)" }
];

export const rawCoaData = [
  { corridor: "NDLS-CNB", section: "Aligarh - Kanpur Main Line", doubleLineStatus: "UP & DN Electrified", maxSectionSpeed: "130 km/h (Kavach 160 km/h under commissioning)", activeCautionOrders: 2, currentCongestion: "88% Density" },
  { corridor: "HWH-MGS", section: "Dhanbad - Pt. Deen Dayal Upadhyaya", doubleLineStatus: "Grand Chord Quadruple Line", maxSectionSpeed: "130 km/h", activeCautionOrders: 1, currentCongestion: "92% Density (Heavy Freight)" },
  { corridor: "BCT-BRC", section: "Mumbai Central - Vadodara", doubleLineStatus: "Western Trunk Electrified", maxSectionSpeed: "130 km/h", activeCautionOrders: 3, currentCongestion: "84% Density" },
  { corridor: "MAS-RU", section: "Chennai - Renigunta Section", doubleLineStatus: "Double Electrified Line", maxSectionSpeed: "110 km/h", activeCautionOrders: 1, currentCongestion: "72% Density" },
  { corridor: "SBC-JTJ", section: "Bengaluru - Jolarpettai Double Line", doubleLineStatus: "Double Line Electrified", maxSectionSpeed: "110 km/h", activeCautionOrders: 0, currentCongestion: "68% Density" }
];

export const rawTimetableData = [
  { trainNo: "22436", name: "Vande Bharat Express (NDLS-BSB)", corridor: "NDLS-CNB", scheduledWindow: "06:00 - 07:15", priority: "Highest (P1)", speedKmh: 130 },
  { trainNo: "12301", name: "Howrah Rajdhani Express", corridor: "NDLS-CNB", scheduledWindow: "16:55 - 18:20", priority: "Highest (P1)", speedKmh: 130 },
  { trainNo: "12002", name: "Bhopal Shatabdi Express", corridor: "NDLS-CNB", scheduledWindow: "06:00 - 07:25", priority: "Highest (P1)", speedKmh: 130 },
  { trainNo: "12309", name: "Patna Rajdhani Express", corridor: "NDLS-CNB", scheduledWindow: "17:15 - 18:45", priority: "Highest (P1)", speedKmh: 130 },
  { trainNo: "12876", name: "Neelachal Express", corridor: "NDLS-CNB", scheduledWindow: "07:35 - 09:10", priority: "Express (P2)", speedKmh: 110 },
  { trainNo: "12381", name: "Poorva Express", corridor: "HWH-MGS", scheduledWindow: "08:15 - 09:50", priority: "Express (P2)", speedKmh: 110 },
  { trainNo: "12951", name: "Mumbai Tejas Rajdhani", corridor: "BCT-BRC", scheduledWindow: "17:00 - 18:30", priority: "Highest (P1)", speedKmh: 130 },
  { trainNo: "20608", name: "Vande Bharat Express (MYS-MAS)", corridor: "SBC-JTJ", scheduledWindow: "14:50 - 16:15", priority: "Highest (P1)", speedKmh: 130 }
];

export const rawGoodsData = [
  { slotId: "GOODS-CNB-01", corridor: "NDLS-CNB", pathWindow: "01:00 - 02:00", rakeType: "Container (CONCOR 45 Wagons)", pathFlexibility: "Low (Scheduled Slot)" },
  { slotId: "GOODS-CNB-02", corridor: "NDLS-CNB", pathWindow: "04:45 - 05:45", rakeType: "Coal Rake (BOXNHL 58 Wagons)", pathFlexibility: "Medium (Buffer Adjustable)" },
  { slotId: "GOODS-HWH-01", corridor: "HWH-MGS", pathWindow: "04:15 - 05:30", rakeType: "Steel Rake (BOST)", pathFlexibility: "High (Can Hold at Yard)" },
  { slotId: "GOODS-BRC-01", corridor: "BCT-BRC", pathWindow: "02:40 - 03:45", rakeType: "Petroleum BTPN Tanker", pathFlexibility: "Low" }
];
