// src/pages/OptimizePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Cpu,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  BarChart2,
  Layers,
  Award
} from 'lucide-react';
import { apiClient } from '../api/client';
import { DisclaimerPill } from '../components/common/DisclaimerPill';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';

export const OptimizePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptimizerData = async () => {
      const res = await apiClient.getOptimizerResults();
      setData(res);
      setLoading(false);
    };
    fetchOptimizerData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gov-navy tracking-tight">
              Optimized Block Schedule (Google OR-Tools CP-SAT)
            </h1>
            <DisclaimerPill text="Integer Programming Solver" variant="ai" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global constraint satisfaction solving for multi-corridor maintenance possession allocation
          </p>
        </div>

        {/* Solver Status Pill */}
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-lg">
          <Cpu className="w-4 h-4 text-gov-navy" />
          <div className="text-xs font-mono">
            <span className="font-bold text-gov-navy">Status: {data?.metadata?.status || 'OPTIMAL'}</span>
            <span className="text-slate-500 ml-2">({data?.metadata?.solveTimeSeconds || '0.284'}s)</span>
          </div>
        </div>
      </div>

      {/* Solver Metadata Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Solver Engine</span>
          <div className="text-sm font-bold font-mono text-gov-navy mt-1 truncate">OR-Tools CP-SAT</div>
          <span className="text-[10px] text-slate-400">v{data?.metadata?.version}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Solve Time</span>
          <div className="text-sm font-bold font-mono text-emerald-700 mt-1">
            {data?.metadata?.solveTimeSeconds} sec
          </div>
          <span className="text-[10px] text-slate-400">Real-time response</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Decision Variables</span>
          <div className="text-sm font-bold font-mono text-slate-900 mt-1">{data?.metadata?.variablesCount}</div>
          <span className="text-[10px] text-slate-400">Binary slot variables</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Constraints Satisfied</span>
          <div className="text-sm font-bold font-mono text-gov-navy mt-1">{data?.metadata?.constraintsCount}</div>
          <span className="text-[10px] text-slate-400">100% hard constraints</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Conflicts Avoided</span>
          <div className="text-sm font-bold font-mono text-emerald-700 mt-1">{data?.metadata?.conflictsAvoided}</div>
          <span className="text-[10px] text-slate-400">Zero passenger delay</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Critical Coverage</span>
          <div className="text-sm font-bold font-mono text-gov-saffron mt-1">
            {data?.metadata?.criticalTasksCovered}
          </div>
          <span className="text-[10px] text-slate-400">Zero deferred defects</span>
        </div>
      </div>

      {/* Multi-Objective Optimization Score Breakdown */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Multi-Objective Function Component Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Mathematical trade-off balancing safety, downtime, and operational throughput
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-gov-navy bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            Objective Value: {data?.metadata?.objectiveValue} pts
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          {data?.breakdown?.map((item) => (
            <div
              key={item.name}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Weight: {item.weight}%</span>
                <span className="font-mono font-bold text-emerald-700">{item.achievedScore}%</span>
              </div>
              <div className="font-bold text-slate-900 leading-snug">{item.name}</div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gov-navy h-1.5 rounded-full"
                  style={{ width: `${item.achievedScore}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-slate-500">{item.unit}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Schedules Comparison (Optimal vs Rejected Alternatives) */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Candidate Schedule Evaluation & Optimization Justification
            </h3>
            <p className="text-xs text-slate-500">
              Transparent proof of mathematical optimality compared to alternative candidate plans
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {data?.candidates?.map((cand) => (
            <div
              key={cand.id}
              className={`p-4 rounded-lg border transition-all ${
                cand.isRecommended
                  ? 'border-emerald-300 bg-emerald-50/30 ring-1 ring-emerald-400/30'
                  : 'border-slate-200 bg-slate-50/50 opacity-80'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`p-1 rounded-full ${
                      cand.isRecommended ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {cand.isRecommended ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                  </span>
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-sm">{cand.name}</span>
                    <span className="text-xs text-slate-500 ml-2 font-mono">({cand.id})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-semibold font-mono ${
                      cand.isRecommended
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {cand.status}
                  </span>
                </div>
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs my-3 py-2 border-y border-slate-200/60 font-mono">
                <div>
                  <span className="text-slate-500">Total Possessions:</span>
                  <div className="font-bold text-slate-900">{cand.totalBlocks} blocks</div>
                </div>
                <div>
                  <span className="text-slate-500">Total Downtime:</span>
                  <div className="font-bold text-slate-900">{cand.totalDowntimeHours} hrs</div>
                </div>
                <div>
                  <span className="text-slate-500">Passenger Delay:</span>
                  <div className={`font-bold ${cand.passengerDelayMinutes === 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {cand.passengerDelayMinutes} mins
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Multi-Dept Synergy:</span>
                  <div className="font-bold text-gov-navy">{cand.synergyScore}%</div>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900">Solver Rationale:</strong> {cand.rationale}
              </p>
            </div>
          ))}
        </div>

        {/* Action CTAs */}
        <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Export ready for Weekly & Monthly Block Planning matrix
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/plan/weekly')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md border border-slate-300 transition-colors"
            >
              Inspect Weekly Calendar Matrix
            </button>
            <button
              onClick={() => navigate('/approval')}
              className="px-4 py-2 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Push to Controller Approval Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
