// src/pages/FeasibilityPage.jsx
import React, { useState, useEffect } from 'react';
import {
  CalendarClock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { apiClient } from '../api/client';
import { ConflictTimeline } from '../components/features/ConflictTimeline';
import { DisclaimerPill } from '../components/common/DisclaimerPill';
import { StatusBadge } from '../components/common/StatusBadge';

export const FeasibilityPage = () => {
  const [selectedCorridor, setSelectedCorridor] = useState('NDLS-CNB');
  const [feasibilityData, setFeasibilityData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await apiClient.getFeasibilityData(selectedCorridor);
      setFeasibilityData(data);
      setLoading(false);
    };
    fetchData();
  }, [selectedCorridor]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gov-navy tracking-tight">
              Feasibility & Conflict Resolution Engine
            </h1>
            <DisclaimerPill text="Hard Constraint Enforcement" variant="ai" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated conflict detection against Passenger Working Time Table, Freight FOIS slots, and safety clearance rules
          </p>
        </div>

        {/* Corridor Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700">Select Corridor Section:</label>
          <select
            value={selectedCorridor}
            onChange={(e) => setSelectedCorridor(e.target.value)}
            className="text-xs font-bold text-gov-navy px-3 py-2 border border-slate-300 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-navy font-mono"
          >
            <option value="NDLS-CNB">NDLS-CNB (Delhi - Kanpur Central)</option>
            <option value="HWH-MGS">HWH-MGS (Howrah - Mughalsarai)</option>
          </select>
        </div>
      </div>

      {/* Corridor Gantt Visual Timeline */}
      {feasibilityData && (
        <ConflictTimeline timelineData={feasibilityData.timeline} />
      )}

      {/* Hard Constraints Enforcement Checklist */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Non-Negotiable Hard Safety & Operational Constraints
              </h3>
              <p className="text-xs text-slate-500">
                Guaranteed by mathematical solver — zero compromises on traffic safety
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            5 / 5 Hard Rules Enforced
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {feasibilityData?.hardConstraints?.map((hc) => (
            <div
              key={hc.id}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-gov-navy">{hc.id}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {hc.status}
                </span>
              </div>
              <div className="font-bold text-slate-900">{hc.name}</div>
              <p className="text-slate-600 leading-relaxed text-[11px]">{hc.description}</p>
              <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500 font-mono">
                Category: <strong>{hc.category}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
