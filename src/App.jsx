// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { UnifiedDataPage } from './pages/UnifiedDataPage';
import { PriorityEnginePage } from './pages/PriorityEnginePage';
import { FeasibilityPage } from './pages/FeasibilityPage';
import { BundlingPage } from './pages/BundlingPage';
import { OptimizePage } from './pages/OptimizePage';
import { WeeklyPlanPage } from './pages/WeeklyPlanPage';
import { MonthlyPlanPage } from './pages/MonthlyPlanPage';
import { DemoScenarioPage } from './pages/DemoScenarioPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { ApprovalPage } from './pages/ApprovalPage';

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/data" element={<UnifiedDataPage />} />
        <Route path="/priority" element={<PriorityEnginePage />} />
        <Route path="/feasibility" element={<FeasibilityPage />} />
        <Route path="/bundling" element={<BundlingPage />} />
        <Route path="/optimize" element={<OptimizePage />} />
        <Route path="/plan/weekly" element={<WeeklyPlanPage />} />
        <Route path="/plan/monthly" element={<MonthlyPlanPage />} />
        <Route path="/demo" element={<DemoScenarioPage />} />
        <Route path="/comparison" element={<ComparisonPage />} />
        <Route path="/approval" element={<ApprovalPage />} />
        {/* Fallback to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
