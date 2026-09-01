// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Layers,
  ShieldAlert,
  Clock,
  CheckCircle2,
  TrendingUp,
  Radio,
  Zap,
  Hammer,
  ArrowRight,
  Sparkles,
  PlayCircle
} from 'lucide-react';
import { KpiCard } from '../components/common/KpiCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { DeptTag } from '../components/common/DeptTag';
import { DisclaimerPill } from '../components/common/DisclaimerPill';
import { useAppState } from '../context/AppStateContext';
import { apiClient } from '../api/client';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { kpis, blocks } = useAppState();
  const [trends, setTrends] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await apiClient.getDashboardKpis();
      setTrends(data.trends);
      setDepartments(data.departments);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Official Page Masthead Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-gov-navy tracking-tight">
              Control Room Master Dashboard
            </h1>
            <DisclaimerPill text="Real-time Synthetic Simulation" variant="synthetic" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Indian Railways AI-Assisted Unified Block Planning Decision-Support System • SIH PS 26027
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/demo')}
            className="flex items-center gap-2 px-3.5 py-2 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-semibold rounded-md shadow-sm transition-all"
          >
            <PlayCircle className="w-4 h-4 text-gov-saffron" />
            <span>Launch Demo Story (1–7)</span>
          </button>
          <button
            onClick={() => navigate('/approval')}
            className="flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-md shadow-sm transition-all"
          >
            <span>Review Pending Approvals ({kpis.pendingApprovalCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Maintenance Tasks"
          value={kpis.totalTasks}
          subtitle="Unified multi-dept intake"
          trend="TMS • SMMS • TDMS"
          trendType="neutral"
          icon={Activity}
          onClick={() => navigate('/priority')}
        />
        <KpiCard
          title="Planned Blocks"
          value={kpis.plannedBlocksWeek}
          subtitle="This week's solved slots"
          trend="18 Unified vs 54 Isolated"
          trendType="positive"
          icon={Layers}
          onClick={() => navigate('/plan/weekly')}
        />
        <KpiCard
          title="Conflicts Resolved"
          value={`${kpis.conflictsResolved} / ${kpis.conflictsDetected}`}
          subtitle="Zero train delay achieved"
          trend="100% Cleared"
          trendType="positive"
          icon={ShieldAlert}
          onClick={() => navigate('/feasibility')}
        />
        <KpiCard
          title="Corridor Downtime"
          value={kpis.downtimeHours}
          unit="hrs/wk"
          subtitle="Saved 88.5 hrs vs manual"
          trend="-65.6% Disruption"
          trendType="positive"
          icon={Clock}
          onClick={() => navigate('/comparison')}
        />
        <KpiCard
          title="Asset Availability"
          value={`${kpis.simulatedAvailabilityPct}%`}
          subtitle="Track uptime simulation"
          trend="+11.8% vs Baseline"
          trendType="positive"
          icon={TrendingUp}
          onClick={() => navigate('/comparison')}
        />
        <KpiCard
          title="Coordination Rate"
          value={`${kpis.coordinationRatePct}%`}
          subtitle="Multi-department synergy"
          trend="3-Way Joint Blocks"
          trendType="positive"
          icon={CheckCircle2}
          onClick={() => navigate('/bundling')}
        />
      </div>

      {/* Main Grid: Downtime Trend Chart + Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Downtime Reduction & Availability Trend
                </h3>
                <DisclaimerPill text="4-Week Progression" variant="synthetic" />
              </div>
              <p className="text-xs text-slate-500">
                Comparing manual isolated blocks vs KavachX multi-department unified scheduling
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              65.6% Downtime Reduction
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="downtimeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B3D91" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0B3D91" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="availGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" domain={[70, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'downtimeHours' ? `${value} hrs` : `${value}%`,
                    name === 'downtimeHours' ? 'Downtime (Hours)' : 'Availability (%)'
                  ]}
                  contentStyle={{ fontSize: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="downtimeHours"
                  name="Downtime (Hours/Week)"
                  stroke="#0B3D91"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#downtimeGrad)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="availabilityPct"
                  name="Simulated Asset Availability (%)"
                  stroke="#059669"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#availGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Breakdown Widget (1 col) */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Department Intake Status</h3>
              <DisclaimerPill text="3 Core Branches" variant="ai" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Cross-departmental task volume & average AI priority
            </p>
          </div>

          <div className="space-y-3">
            {departments.map((dept) => {
              const deptIcons = {
                Engineering: Hammer,
                'S&T': Radio,
                Traction: Zap
              };
              const Icon = deptIcons[dept.deptCode] || Hammer;

              return (
                <div
                  key={dept.department}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-blue-100 text-gov-navy flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">{dept.department}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-gov-navy">
                      {dept.totalTasks} Tasks
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                    <span>
                      Avg AI Priority: <strong className="font-mono text-slate-900">{dept.avgPriority}</strong>
                    </span>
                    <span className="text-rose-700 font-semibold font-mono">
                      {dept.criticalTasks} Critical Overdue
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate('/data')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-gov-navy text-xs font-semibold rounded-md border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Explore Raw Systems Data</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Upcoming Scheduled Blocks Queue */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Upcoming Weekly Scheduled Blocks</h3>
              <DisclaimerPill text="OR-Tools Solved" variant="ai" />
            </div>
            <p className="text-xs text-slate-500">
              Synchronized cross-department track possessions ready for execution or pending sign-off
            </p>
          </div>

          <button
            onClick={() => navigate('/plan/weekly')}
            className="text-xs text-gov-navy hover:underline font-semibold flex items-center gap-1"
          >
            <span>View Full 7-Day Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-3.5 py-2.5">Block ID</th>
                <th className="px-3.5 py-2.5">Corridor Section</th>
                <th className="px-3.5 py-2.5">Date & Time Slot</th>
                <th className="px-3.5 py-2.5">Departments</th>
                <th className="px-3.5 py-2.5">Key Maintenance Activities</th>
                <th className="px-3.5 py-2.5">Priority</th>
                <th className="px-3.5 py-2.5">Status</th>
                <th className="px-3.5 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {blocks.slice(0, 6).map((b) => (
                <tr key={b.blockId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-3.5 py-3 font-mono font-bold text-gov-navy">{b.blockId}</td>
                  <td className="px-3.5 py-3">
                    <div className="font-semibold text-slate-900">{b.corridor}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{b.corridorName}</div>
                  </td>
                  <td className="px-3.5 py-3 font-mono">
                    <div className="font-semibold text-slate-900">{b.date}</div>
                    <div className="text-slate-500">{b.start} - {b.end} ({b.durationMins}m)</div>
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {b.departments.map(d => (
                        <DeptTag key={d} dept={d} size="sm" showLabel={false} />
                      ))}
                    </div>
                  </td>
                  <td className="px-3.5 py-3 max-w-xs">
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5 truncate">
                      {b.activities.map((act, idx) => (
                        <li key={idx} className="truncate">{act}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-3.5 py-3">
                    <PriorityBadge score={b.priority} band={b.priorityBand} size="sm" />
                  </td>
                  <td className="px-3.5 py-3">
                    <StatusBadge status={b.status} size="sm" />
                  </td>
                  <td className="px-3.5 py-3 text-right">
                    <button
                      onClick={() => navigate('/approval')}
                      className="px-2.5 py-1 text-xs font-semibold text-gov-navy bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors"
                    >
                      {b.status === 'Pending Approval' ? 'Review & Sign' : 'View Audit'}
                    </button>
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
