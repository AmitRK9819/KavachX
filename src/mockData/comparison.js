// src/mockData/comparison.js
// Before vs KavachX Benchmark comparison using identical synthetic workloads

export const comparisonScenarios = {
  normal: {
    name: "Normal Weekly Schedule (Baseline)",
    description: "Standard weekday traffic density across 5 trunk corridors with regular scheduled passenger, freight, and cyclical maintenance.",
    metrics: [
      {
        metric: "Total Block Possessions",
        unit: "Possessions / week",
        before: 54,
        kavachX: 18,
        improvementPct: "-66.7%",
        isBetterLower: true,
        explanation: "Before: Each department shuts down the corridor separately (3 shutdowns per location). KavachX unifies them into 1 synchronized block."
      },
      {
        metric: "Passenger Train Conflicts",
        unit: "Schedule clashes",
        before: 28,
        kavachX: 0,
        improvementPct: "-100%",
        isBetterLower: true,
        explanation: "Before: Manual uncoordinated requests clash with high-speed express timetables. KavachX enforces hard zero-overlap constraints."
      },
      {
        metric: "Total Corridor Downtime",
        unit: "Hours / week",
        before: 135.0,
        kavachX: 46.5,
        improvementPct: "-65.6%",
        isBetterLower: true,
        explanation: "Downtime reduced from 135 hrs to 46.5 hrs by sharing 25kV power cut and track machine setup windows."
      },
      {
        metric: "Simulated Asset Availability",
        unit: "% Uptime",
        before: 82.4,
        kavachX: 94.2,
        improvementPct: "+11.8%",
        isBetterLower: false,
        explanation: "Corridor availability for revenue-earning train paths increases by 11.8 percentage points."
      },
      {
        metric: "Cross-Department Coordination Rate",
        unit: "% Coordinated",
        before: 12.0,
        kavachX: 61.0,
        improvementPct: "+408%",
        isBetterLower: false,
        explanation: "Multi-department joint possessions increase five-fold compared to manual telephonic coordination."
      }
    ],
    chartData: [
      { metric: "Possessions", before: 54, kavachX: 18 },
      { metric: "Conflicts", before: 28, kavachX: 0 },
      { metric: "Downtime (Hrs)", before: 135, kavachX: 46.5 },
      { metric: "Availability (%)", before: 82.4, kavachX: 94.2 },
      { metric: "Coordination (%)", before: 12, kavachX: 61 }
    ]
  },
  peak: {
    name: "Peak Festival Rush (Diwali / Chhath Special Trains)",
    description: "High traffic load with 30+ additional special express trains running on Northern & Eastern corridors, narrowing maintenance gaps.",
    metrics: [
      {
        metric: "Total Block Possessions",
        unit: "Possessions / week",
        before: 68,
        kavachX: 22,
        improvementPct: "-67.6%",
        isBetterLower: true,
        explanation: "KavachX bundles maintenance strictly during narrow 90–120 min night slack slots without disrupting holiday specials."
      },
      {
        metric: "Passenger Train Conflicts",
        unit: "Schedule clashes",
        before: 44,
        kavachX: 0,
        improvementPct: "-100%",
        isBetterLower: true,
        explanation: "Avoids 44 potential clashes with festival special trains through CP-SAT integer optimization."
      },
      {
        metric: "Total Corridor Downtime",
        unit: "Hours / week",
        before: 172.0,
        kavachX: 55.0,
        improvementPct: "-68.0%",
        isBetterLower: true,
        explanation: "Saves 117 hours of corridor closure during highest passenger demand period."
      },
      {
        metric: "Simulated Asset Availability",
        unit: "% Uptime",
        before: 78.6,
        kavachX: 92.8,
        improvementPct: "+14.2%",
        isBetterLower: false,
        explanation: "Maximizes line capacity for peak passenger clearance."
      },
      {
        metric: "Cross-Department Coordination Rate",
        unit: "% Coordinated",
        before: 8.5,
        kavachX: 68.0,
        improvementPct: "+700%",
        isBetterLower: false,
        explanation: "High urgency forces joint planning."
      }
    ],
    chartData: [
      { metric: "Possessions", before: 68, kavachX: 22 },
      { metric: "Conflicts", before: 44, kavachX: 0 },
      { metric: "Downtime (Hrs)", before: 172, kavachX: 55 },
      { metric: "Availability (%)", before: 78.6, kavachX: 92.8 },
      { metric: "Coordination (%)", before: 8.5, kavachX: 68 }
    ]
  },
  monsoon: {
    name: "Monsoon Surge & Pre-Winter Track Precautions",
    description: "Elevated urgent track inspection, OHE insulator cleaning, and point drainage overhaul requirements.",
    metrics: [
      {
        metric: "Total Block Possessions",
        unit: "Possessions / week",
        before: 76,
        kavachX: 26,
        improvementPct: "-65.8%",
        isBetterLower: true,
        explanation: "Bundles urgent weather-induced defect fixes across Track, S&T, and Traction into synchronized possession windows."
      },
      {
        metric: "Passenger Train Conflicts",
        unit: "Schedule clashes",
        before: 36,
        kavachX: 0,
        improvementPct: "-100%",
        isBetterLower: true,
        explanation: "Zero traffic disruption despite 40% increase in emergency maintenance requests."
      },
      {
        metric: "Total Corridor Downtime",
        unit: "Hours / week",
        before: 195.0,
        kavachX: 68.5,
        improvementPct: "-64.9%",
        isBetterLower: true,
        explanation: "Preserves critical section capacity while completing 100% of seasonal safety precautions."
      },
      {
        metric: "Simulated Asset Availability",
        unit: "% Uptime",
        before: 75.2,
        kavachX: 90.4,
        improvementPct: "+15.2%",
        isBetterLower: false,
        explanation: "Substantial uptime improvement under harsh weather maintenance pressure."
      },
      {
        metric: "Cross-Department Coordination Rate",
        unit: "% Coordinated",
        before: 14.0,
        kavachX: 65.0,
        improvementPct: "+364%",
        isBetterLower: false,
        explanation: "Ensures no department is left waiting for separate line possession."
      }
    ],
    chartData: [
      { metric: "Possessions", before: 76, kavachX: 26 },
      { metric: "Conflicts", before: 36, kavachX: 0 },
      { metric: "Downtime (Hrs)", before: 195, kavachX: 68.5 },
      { metric: "Availability (%)", before: 75.2, kavachX: 90.4 },
      { metric: "Coordination (%)", before: 14, kavachX: 65 }
    ]
  }
};
