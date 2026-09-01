// src/api/client.js
// Unified API client for KavachX.
// Currently serves structured mock data with simulated asynchronous latency,
// easily swappable with live FastAPI endpoints via VITE_API_URL.

import { mockTasks } from '../mockData/tasks';
import {
  systemsInfo,
  rawTmsData,
  rawSmmsData,
  rawTdmsData,
  rawBdmsData,
  rawCoaData,
  rawTimetableData,
  rawGoodsData
} from '../mockData/systemsData';
import { hardConstraintsList, corridorTimelines } from '../mockData/feasibility';
import { mockBundles } from '../mockData/bundles';
import { optimizerMetadata, objectiveBreakdown, candidateSchedules } from '../mockData/optimizerResults';
import { initialWeeklyBlocks, monthlyDensityData } from '../mockData/blocks';
import { controlRoomKpis, fourWeekTrends, departmentBreakdown } from '../mockData/kpis';
import { comparisonScenarios } from '../mockData/comparison';
import { demoSteps } from '../mockData/demoScenario';

const SIMULATED_LATENCY_MS = 80;

const delay = (ms = SIMULATED_LATENCY_MS) => new Promise(resolve => setTimeout(resolve, ms));

export const apiClient = {
  // KPI & Dashboard Data
  getDashboardKpis: async () => {
    await delay();
    return {
      kpis: controlRoomKpis,
      trends: fourWeekTrends,
      departments: departmentBreakdown
    };
  },

  // Multi-Source Raw Data
  getSystemsData: async () => {
    await delay();
    return {
      systemsInfo,
      rawTms: rawTmsData,
      rawSmms: rawSmmsData,
      rawTdms: rawTdmsData,
      rawBdms: rawBdmsData,
      rawCoa: rawCoaData,
      rawTimetable: rawTimetableData,
      rawGoods: rawGoodsData
    };
  },

  // AI Priority Engine
  getTasks: async () => {
    await delay();
    return mockTasks;
  },

  getTaskById: async (taskId) => {
    await delay(30);
    return mockTasks.find(t => t.id === taskId) || null;
  },

  // Feasibility & Conflicts
  getFeasibilityData: async (corridorId = "NDLS-CNB") => {
    await delay();
    return {
      hardConstraints: hardConstraintsList,
      timeline: corridorTimelines[corridorId] || corridorTimelines["NDLS-CNB"],
      availableCorridors: Object.keys(corridorTimelines)
    };
  },

  // Corridor Bundling
  getBundles: async () => {
    await delay();
    return mockBundles;
  },

  // CP-SAT Optimizer Schedule
  getOptimizerResults: async () => {
    await delay();
    return {
      metadata: optimizerMetadata,
      breakdown: objectiveBreakdown,
      candidates: candidateSchedules
    };
  },

  // Weekly & Monthly Block Plans
  getWeeklyBlocks: async () => {
    await delay();
    return initialWeeklyBlocks;
  },

  getMonthlyData: async () => {
    await delay();
    return {
      weeks: monthlyDensityData,
      totalBlocks: 72,
      totalHours: 184.0,
      avgCoordinationRate: 64.5
    };
  },

  // Comparison Benchmarks
  getComparisonData: async (scenarioKey = "normal") => {
    await delay();
    return comparisonScenarios[scenarioKey] || comparisonScenarios.normal;
  },

  // Demo Scenario
  getDemoSteps: async () => {
    await delay();
    return demoSteps;
  }
};
