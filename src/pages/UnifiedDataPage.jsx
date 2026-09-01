// src/pages/UnifiedDataPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Filter,
  Layers,
  Train,
  Hammer,
  Radio,
  Zap,
  Activity,
  Calendar,
  FileSpreadsheet,
  Info,
  Clock
} from 'lucide-react';
import { apiClient } from '../api/client';
import { DisclaimerPill } from '../components/common/DisclaimerPill';
import { DeptTag } from '../components/common/DeptTag';

export const UnifiedDataPage = () => {
  const [activeTab, setActiveTab] = useState('tms');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const res = await apiClient.getSystemsData();
      setData(res);
      setLoading(false);
    };
    loadData();
  }, []);

  const tabs = [
    { key: 'tms', label: 'TMS (Track)', icon: Hammer, count: data?.rawTms?.length || 7 },
    { key: 'smms', label: 'SMMS (Signal & Telecom)', icon: Radio, count: data?.rawSmms?.length || 6 },
    { key: 'tdms', label: 'TDMS (Traction OHE)', icon: Zap, count: data?.rawTdms?.length || 5 },
    { key: 'bdms', label: 'BDMS (Block Demands)', icon: FileSpreadsheet, count: data?.rawBdms?.length || 6 },
    { key: 'coa', label: 'COA (Control Office)', icon: Activity, count: data?.rawCoa?.length || 5 },
    { key: 'timetable', label: 'WTT (Passenger Timetable)', icon: Train, count: data?.rawTimetable?.length || 8 },
    { key: 'goods', label: 'Goods & Freight Forecast', icon: Clock, count: data?.rawGoods?.length || 4 }
  ];

  const currentSystemInfo = data?.systemsInfo?.[activeTab] || {};

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gov-navy tracking-tight">
                Unified Multi-Source Data Explorer
              </h1>
              <DisclaimerPill text="Data Integration Layer" variant="synthetic" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Consolidating disparate silos: TMS, SMMS, TDMS, BDMS, COA, Timetable, and Freight into a unified schema
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assets, corridors, defects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gov-navy bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4 mt-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all border ${
                  isActive
                    ? 'bg-gov-navy text-white border-gov-navy shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current System Description Banner */}
      <div className="bg-blue-50/60 border border-blue-200/80 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-md bg-blue-100 text-gov-navy flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-gov-navy" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <strong className="text-gov-navy font-bold">{currentSystemInfo.name} ({currentSystemInfo.code})</strong>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded border border-blue-200">
                {currentSystemInfo.sourceBadge}
              </span>
            </div>
            <p className="text-slate-600 mt-0.5">{currentSystemInfo.description}</p>
          </div>
        </div>

        <div className="text-right text-[11px] text-slate-500 font-mono">
          <div>Last System Sync: <strong>{currentSystemInfo.lastSync}</strong></div>
          <div className="text-amber-700 font-semibold mt-0.5">Synthetic Test Sample Dataset</div>
        </div>
      </div>

      {/* Tab Data Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {activeTab === 'tms' && data?.rawTms && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Record ID</th>
                  <th className="px-4 py-3">Asset ID</th>
                  <th className="px-4 py-3">Corridor & Chainage</th>
                  <th className="px-4 py-3">Track Defect Description</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Overdue</th>
                  <th className="px-4 py-3">Track Type</th>
                  <th className="px-4 py-3">Reported</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {data.rawTms.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-bold text-gov-navy">{r.id}</td>
                    <td className="px-4 py-3 text-slate-900 font-semibold">{r.assetId}</td>
                    <td className="px-4 py-3">
                      <div className="font-sans font-medium text-slate-900">{r.corridor}</div>
                      <div className="text-[11px] text-slate-500">{r.chainage}</div>
                    </td>
                    <td className="px-4 py-3 font-sans font-medium text-slate-800">{r.defect}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-sans font-semibold ${
                        r.severity === 'Critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        r.severity === 'High' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {r.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-rose-700">{r.overdueDays} days</td>
                    <td className="px-4 py-3 font-sans">{r.trackType}</td>
                    <td className="px-4 py-3 text-slate-500">{r.reportedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'smms' && data?.rawSmms && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Record ID</th>
                  <th className="px-4 py-3">Asset ID</th>
                  <th className="px-4 py-3">Corridor & Location</th>
                  <th className="px-4 py-3">Asset Type</th>
                  <th className="px-4 py-3">Telemetry / Condition Parameter</th>
                  <th className="px-4 py-3">Degradation Status</th>
                  <th className="px-4 py-3">Overdue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {data.rawSmms.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-bold text-gov-navy">{r.id}</td>
                    <td className="px-4 py-3 text-slate-900 font-semibold">{r.assetId}</td>
                    <td className="px-4 py-3">
                      <div className="font-sans font-medium text-slate-900">{r.corridor}</div>
                      <div className="text-[11px] text-slate-500 font-sans">{r.location}</div>
                    </td>
                    <td className="px-4 py-3 font-sans">{r.assetType}</td>
                    <td className="px-4 py-3 font-sans font-medium text-slate-800">{r.parameter}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-sans font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-amber-700">{r.overdueDays} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'tdms' && data?.rawTdms && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Record ID</th>
                  <th className="px-4 py-3">Asset ID</th>
                  <th className="px-4 py-3">Corridor & Location</th>
                  <th className="px-4 py-3">OHE Component</th>
                  <th className="px-4 py-3">Condition Metric</th>
                  <th className="px-4 py-3">Risk Level</th>
                  <th className="px-4 py-3">Overdue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {data.rawTdms.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-bold text-gov-navy">{r.id}</td>
                    <td className="px-4 py-3 text-slate-900 font-semibold">{r.assetId}</td>
                    <td className="px-4 py-3 font-sans">
                      <div className="font-medium text-slate-900">{r.corridor}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{r.kmSpan}</div>
                    </td>
                    <td className="px-4 py-3 font-sans">{r.component}</td>
                    <td className="px-4 py-3 font-sans font-medium text-slate-800">{r.metric}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-sans font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        {r.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-rose-700">{r.overdueDays} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'bdms' && data?.rawBdms && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Request ID</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Corridor</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Requested Slot</th>
                  <th className="px-4 py-3">Stated Purpose</th>
                  <th className="px-4 py-3">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {data.rawBdms.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono font-bold text-gov-navy">{r.id}</td>
                    <td className="px-4 py-3"><DeptTag dept={r.department} size="sm" /></td>
                    <td className="px-4 py-3 font-mono font-medium">{r.corridor}</td>
                    <td className="px-4 py-3 font-mono">{r.date}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-900">{r.requestedSlot}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{r.reason}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'coa' && data?.rawCoa && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Corridor Code</th>
                  <th className="px-4 py-3">Section Description</th>
                  <th className="px-4 py-3">Track Infrastructure Status</th>
                  <th className="px-4 py-3">Max Permissible Speed</th>
                  <th className="px-4 py-3">Active Caution Orders</th>
                  <th className="px-4 py-3">Section Congestion Density</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {data.rawCoa.map((r) => (
                  <tr key={r.corridor} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-bold text-gov-navy">{r.corridor}</td>
                    <td className="px-4 py-3 font-sans font-semibold text-slate-900">{r.section}</td>
                    <td className="px-4 py-3 font-sans text-slate-700">{r.doubleLineStatus}</td>
                    <td className="px-4 py-3 font-sans font-medium text-blue-700">{r.maxSectionSpeed}</td>
                    <td className="px-4 py-3 font-sans font-bold text-amber-700">{r.activeCautionOrders} Active</td>
                    <td className="px-4 py-3 font-sans font-semibold text-slate-900">{r.currentCongestion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'timetable' && data?.rawTimetable && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Train Number</th>
                  <th className="px-4 py-3">Train Name</th>
                  <th className="px-4 py-3">Corridor</th>
                  <th className="px-4 py-3">Scheduled Section Path Window</th>
                  <th className="px-4 py-3">Timetable Priority</th>
                  <th className="px-4 py-3">Speed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {data.rawTimetable.map((r) => (
                  <tr key={r.trainNo} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-bold text-gov-navy">{r.trainNo}</td>
                    <td className="px-4 py-3 font-sans font-semibold text-slate-900">{r.name}</td>
                    <td className="px-4 py-3">{r.corridor}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{r.scheduledWindow}</td>
                    <td className="px-4 py-3 font-sans">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {r.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans">{r.speedKmh} km/h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'goods' && data?.rawGoods && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Slot ID</th>
                  <th className="px-4 py-3">Corridor</th>
                  <th className="px-4 py-3">Forecasted Transit Window</th>
                  <th className="px-4 py-3">Freight Rake Type</th>
                  <th className="px-4 py-3">Slot Flexibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {data.rawGoods.map((r) => (
                  <tr key={r.slotId} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-bold text-gov-navy">{r.slotId}</td>
                    <td className="px-4 py-3">{r.corridor}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{r.pathWindow}</td>
                    <td className="px-4 py-3 font-sans font-medium text-slate-800">{r.rakeType}</td>
                    <td className="px-4 py-3 font-sans">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {r.pathFlexibility}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
