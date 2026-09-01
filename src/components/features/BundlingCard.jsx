// src/components/features/BundlingCard.jsx
import React from 'react';
import { Layers, Clock, Zap, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { DeptTag } from '../common/DeptTag';
import { PriorityBadge } from '../common/PriorityBadge';
import { DisclaimerPill } from '../common/DisclaimerPill';

export const BundlingCard = ({ bundle }) => {
  if (!bundle) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow transition-all overflow-hidden">
      {/* Header bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 font-mono">{bundle.bundleId}</h3>
              <span className="text-xs text-slate-500 font-medium">({bundle.corridor})</span>
              <DisclaimerPill text="Bundled Candidate" variant="ai" />
            </div>
            <p className="text-xs text-slate-500">{bundle.corridorName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-gov-navy">
            <Clock className="w-3.5 h-3.5 text-gov-navy" />
            <span>{bundle.window.date} | {bundle.window.start} - {bundle.window.end} ({bundle.window.durationMins} mins)</span>
          </div>
          <PriorityBadge score={bundle.combinedPriority} band="High" />
        </div>
      </div>

      {/* Main content grid */}
      <div className="p-5 space-y-4">
        {/* Contributing Tasks List */}
        <div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Contributing Cross-Department Tasks ({bundle.tasks.length})
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {bundle.tasks.map((task) => (
              <div key={task.id} className="p-3 rounded-md bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{task.id}</span>
                  <DeptTag dept={task.dept} size="sm" />
                </div>
                <div className="font-medium text-slate-700 line-clamp-2">{task.title}</div>
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-200/60 font-mono">
                  <span>Dur: {task.dur} min</span>
                  <PriorityBadge score={task.priority} band={task.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Before vs Bundled Disruption Savings Visualizer */}
        <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-emerald-50/70 border border-indigo-100 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Isolated time */}
            <div className="text-center md:text-left">
              <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">
                Uncoordinated Possession
              </span>
              <div className="text-xl font-bold font-mono text-rose-800 mt-0.5">
                {bundle.isolatedPossessionHours} hrs
              </div>
              <span className="text-[11px] text-slate-500">3 Separate Line Shutdowns</span>
            </div>

            {/* Arrow & Delta */}
            <div className="flex flex-col items-center px-4">
              <div className="flex items-center gap-2 text-gov-navy font-semibold text-xs bg-white px-3 py-1 rounded-full border border-indigo-200 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-gov-saffron" />
                <span>KavachX Synergy: Save {bundle.downtimeSavedHours} hrs ({Math.round((bundle.downtimeSavedHours / bundle.isolatedPossessionHours) * 100)}%)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Bundled time */}
            <div className="text-center md:text-right">
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                Coordinated Block
              </span>
              <div className="text-xl font-bold font-mono text-emerald-800 mt-0.5">
                {bundle.bundledPossessionHours} hrs
              </div>
              <span className="text-[11px] text-slate-500">1 Synchronized Traffic Block</span>
            </div>
          </div>
        </div>

        {/* Why Bundled & Safety Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50/70 p-3.5 rounded-lg border border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-gov-navy" />
              <span>Bundling Logic & Synergy Rationale</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">{bundle.whyBundled}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safety & Electrical Clearances</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">{bundle.safetyCompatibility}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
