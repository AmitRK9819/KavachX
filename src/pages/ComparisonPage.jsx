// src/pages/ComparisonPage.jsx
import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Info,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Clock,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import { apiClient } from '../api/client';
import { DisclaimerPill } from '../components/common/DisclaimerPill';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export const ComparisonPage = () => {
  const [selectedScenario, setSelectedScenario] = useState('normal'); // 'normal' | 'peak' | 'monsoon'
  const [scenarioData, setScenarioData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScenario = async () => {
      const data = await apiClient.getComparisonData(selectedScenario);
      setScenarioData(data);
      setLoading(false);
    };
    fetchScenario();
  }, [selectedScenario]);

  return (
    <div className="space-y-6">
      {/* Prominent Mandatory Synthetic Disclaimer Banner */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-full bg-amber-200 text-amber-900 shrink-0">
            <Info className="w-4 h-4" />
          </span>
          <p className="font-semibold">
            <span className="uppercase tracking-wider text-amber-900 font-bold">Mandatory SIH Demonstration Notice:</span>{' '}
            Synthetic prototype simulation results on controlled test workloads — <span className="underline">not official Indian Railways operational statistics</span>.
          </p>
        </div>
        <span className="px-2.5 py-1 bg-amber-200/80 rounded font-mono font-bold text-amber-900 text-[11px]">
          SIH PS 26027 Evaluation Benchmark
        </span>
      </div>

      {/* Header Banner with Scenario Switcher */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gov-navy tracking-tight">
              Before vs KavachX Comparative Impact Benchmark
            </h1>
            <DisclaimerPill text="Side-by-Side Evaluation" variant="synthetic" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quantifying efficiency gains: Uncoordinated manual planning vs AI-assisted unified bundling & CP-SAT optimization
          </p>
        </div>

        {/* Scenario Selector Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setSelectedScenario('normal')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              selectedScenario === 'normal'
                ? 'bg-white text-gov-navy shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Normal Baseline
          </button>
          <button
            onClick={() => setSelectedScenario('peak')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              selectedScenario === 'peak'
                ? 'bg-white text-gov-navy shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Festival Rush (Peak)
          </button>
          <button
            onClick={() => setSelectedScenario('monsoon')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              selectedScenario === 'monsoon'
                ? 'bg-white text-gov-navy shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monsoon Surge
          </button>
        </div>
      </div>

      {/* Scenario Description */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 text-xs text-slate-700 flex items-center justify-between">
        <div>
          <strong className="text-gov-navy font-bold">{scenarioData?.name}:</strong> {scenarioData?.description}
        </div>
      </div>

      {/* Comparative Paired Bar Chart */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Metric Comparison Visualizer (Identical Test Workload)
            </h3>
            <p className="text-xs text-slate-500">
              Comparing Manual Siloed Scheduling (Before) vs KavachX Unified Scheduling
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-400 inline-block" />
              <span className="text-slate-600 font-medium">Before (Manual Siloed)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-gov-navy inline-block" />
              <span className="text-slate-600 font-medium">KavachX (AI-Assisted)</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scenarioData?.chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ fontSize: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}
                formatter={(value, name) => [value, name === 'before' ? 'Before (Manual)' : 'KavachX']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="before" name="Before (Manual Siloed)" fill="#FB7185" radius={[4, 4, 0, 0]} />
              <Bar dataKey="kavachX" name="KavachX (Unified AI)" fill="#0B3D91" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Side-by-Side Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarioData?.metrics?.map((m) => (
          <div
            key={m.metric}
            className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">{m.metric}</span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                  m.isBetterLower
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {m.improvementPct}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center py-2 bg-slate-50 rounded-lg border border-slate-200 font-mono">
              <div className="border-r border-slate-200 pr-2">
                <span className="text-[10px] uppercase font-sans text-slate-500 font-semibold block">Before</span>
                <div className="text-lg font-bold text-rose-700 mt-0.5">{m.before}</div>
                <span className="text-[10px] text-slate-400 font-sans">{m.unit}</span>
              </div>
              <div className="pl-2">
                <span className="text-[10px] uppercase font-sans text-gov-navy font-bold block">KavachX</span>
                <div className="text-lg font-bold text-emerald-700 mt-0.5">{m.kavachX}</div>
                <span className="text-[10px] text-slate-400 font-sans">{m.unit}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {m.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
