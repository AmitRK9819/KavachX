// src/pages/MonthlyPlanPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Layers,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  CalendarRange,
  Sparkles
} from 'lucide-react';
import { apiClient } from '../api/client';
import { DisclaimerPill } from '../components/common/DisclaimerPill';
import { KpiCard } from '../components/common/KpiCard';

export const MonthlyPlanPage = () => {
  const navigate = useNavigate();
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await apiClient.getMonthlyData();
      setMonthlyData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const corridorDensityMatrix = [
    { corridor: 'NDLS-CNB', name: 'Delhi - Kanpur', w1: '4 Blocks (10.5h)', w2: '4 Blocks (10.5h)', w3: '5 Blocks (13.0h)', w4: '4 Blocks (10.5h)', intensity: 'Heavy (Green)' },
    { corridor: 'HWH-MGS', name: 'Howrah - Mughalsarai', w1: '4 Blocks (10.0h)', w2: '4 Blocks (10.0h)', w3: '4 Blocks (10.0h)', w4: '5 Blocks (12.5h)', intensity: 'Heavy (Green)' },
    { corridor: 'BCT-BRC', name: 'Mumbai - Vadodara', w1: '4 Blocks (8.0h)', w2: '3 Blocks (6.5h)', w3: '4 Blocks (8.5h)', w4: '4 Blocks (8.0h)', intensity: 'Moderate (Green)' },
    { corridor: 'MAS-RU', name: 'Chennai - Renigunta', w1: '3 Blocks (6.0h)', w2: '3 Blocks (6.0h)', w3: '3 Blocks (6.0h)', w4: '3 Blocks (6.0h)', intensity: 'Moderate (Green)' },
    { corridor: 'SBC-JTJ', name: 'Bengaluru - Jolarpettai', w1: '3 Blocks (6.0h)', w2: '2 Blocks (4.5h)', w3: '3 Blocks (6.0h)', w4: '3 Blocks (6.0h)', intensity: 'Optimal (Green)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gov-navy tracking-tight">
              Monthly Strategic Block Plan (30-Day Rollup)
            </h1>
            <DisclaimerPill text="30-Day Horizon" variant="ai" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Month: <strong>September 2026</strong> | High-level corridor possession density and cyclical maintenance quota
          </p>
        </div>

        <button
          onClick={() => navigate('/plan/weekly')}
          className="flex items-center gap-2 px-4 py-2 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
        >
          <span>Drill Down to Current Week</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Monthly Blocks"
          value={monthlyData?.totalBlocks || 72}
          subtitle="All 5 trunk corridors"
          trend="100% Scheduled"
          trendType="positive"
          icon={Calendar}
        />
        <KpiCard
          title="Total Coordinated Hours"
          value={monthlyData?.totalHours || 184.0}
          unit="hours"
          subtitle="Planned section possession"
          trend="Saved ~350 hrs"
          trendType="positive"
          icon={Clock}
        />
        <KpiCard
          title="Cross-Dept Coordination"
          value={`${monthlyData?.avgCoordinationRate || 64.5}%`}
          subtitle="Joint possession rate"
          trend="+52% vs manual"
          trendType="positive"
          icon={Layers}
        />
        <KpiCard
          title="Corridors Under Coverage"
          value="5 / 5"
          subtitle="Trunk high-density lines"
          trend="Nominal Density"
          trendType="positive"
          icon={CheckCircle2}
        />
      </div>

      {/* Week-by-Week Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          4-Week Progression & Planned Density
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {monthlyData?.weeks?.map((w, idx) => (
            <div
              key={w.week}
              onClick={() => navigate('/plan/weekly')}
              className={`p-5 rounded-lg border bg-white shadow-sm cursor-pointer hover:shadow transition-all space-y-3 ${
                idx === 0 ? 'border-blue-300 ring-2 ring-blue-400/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{w.week}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    idx === 0
                      ? 'bg-blue-100 text-gov-navy font-bold'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {w.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono py-2 border-y border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-sans">Blocks</span>
                  <div className="font-bold text-slate-900">{w.totalBlocks} blocks</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-sans">Downtime</span>
                  <div className="font-bold text-gov-navy">{w.totalHours} hrs</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500">
                Key Corridor: <strong className="text-slate-800">{w.highDensityCorridor}</strong>
              </div>

              <div className="pt-2 text-xs text-gov-navy font-semibold flex items-center justify-between">
                <span>View Week Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Corridor-by-Week Density Heatmap Matrix */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Corridor Density Heatmap (Possessions / Week)
            </h3>
            <p className="text-xs text-slate-500">
              Corridor workload balancing prevents overlapping traffic chokepoints on adjacent sections
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider font-sans">
              <tr>
                <th className="px-4 py-3">Corridor Section</th>
                <th className="px-4 py-3">Week 1 (Sep 1-7)</th>
                <th className="px-4 py-3">Week 2 (Sep 8-14)</th>
                <th className="px-4 py-3">Week 3 (Sep 15-21)</th>
                <th className="px-4 py-3">Week 4 (Sep 22-28)</th>
                <th className="px-4 py-3 text-right">Density Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {corridorDensityMatrix.map((r) => (
                <tr key={r.corridor} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <div className="font-bold text-gov-navy">{r.corridor}</div>
                    <div className="text-[11px] font-sans text-slate-500">{r.name}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-emerald-800 bg-emerald-50/30">{r.w1}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-800 bg-emerald-50/30">{r.w2}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-800 bg-emerald-50/30">{r.w3}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-800 bg-emerald-50/30">{r.w4}</td>
                  <td className="px-4 py-3 text-right font-sans">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {r.intensity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
