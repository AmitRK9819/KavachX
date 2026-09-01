// src/components/features/ConflictTimeline.jsx
import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, XCircle, Train, ShieldAlert, Sparkles } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { DisclaimerPill } from '../common/DisclaimerPill';

export const ConflictTimeline = ({ timelineData, onSelectCandidate }) => {
  if (!timelineData) return null;

  const totalMinutes = 24 * 60; // 1440 mins
  const hours = Array.from({ length: 25 }, (_, i) => i); // 0 to 24

  // Convert minutes into percentage width/position
  const getPosPct = (mins) => (mins / totalMinutes) * 100;

  return (
    <div className="space-y-6">
      {/* Visual Gantt Chart Timeline */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Corridor Timeline: {timelineData.corridorName} ({timelineData.corridorId})
              </h3>
              <DisclaimerPill text="24-Hour Section Gantt" variant="ai" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Date: {timelineData.date} | Resolution: Full 24-Hour Corridor Occupancy</p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-600 inline-block" />
              <span className="text-slate-600">Passenger / Express</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
              <span className="text-slate-600">Goods / Freight Slot</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-600 inline-block" />
              <span className="text-slate-600">Rejected (Conflict)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
              <span className="text-slate-600">Feasible Block Window</span>
            </div>
          </div>
        </div>

        {/* Hour markers ruler */}
        <div className="relative pt-6 pb-2">
          {/* Time axis line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200" />

          {/* Hour labels */}
          <div className="relative flex justify-between text-[10px] font-mono text-slate-600 select-none">
            {hours.filter(h => h % 2 === 0).map(h => (
              <div key={h} className="flex flex-col items-center">
                <span className="h-2 w-0.5 bg-slate-400 mb-1" />
                <span>{h.toString().padStart(2, '0')}:00</span>
              </div>
            ))}
          </div>

          {/* Gantt Track Layers */}
          <div className="mt-4 space-y-3">
            {/* Layer 1: Passenger Trains */}
            <div className="relative h-8 bg-slate-50 border border-slate-200 rounded flex items-center px-2">
              <span className="absolute left-2 text-[10px] font-semibold text-slate-600 z-10 uppercase tracking-wider">
                Passenger Timetable
              </span>
              <div className="relative w-full h-5 ml-32">
                {timelineData.trains.filter(t => t.type === 'passenger').map(train => {
                  const left = getPosPct(train.start);
                  const width = Math.max(getPosPct(train.end - train.start), 2.5);
                  return (
                    <div
                      key={train.id}
                      style={{ left: `${left}%`, width: `${width}%` }}
                      className={`absolute top-0 h-5 rounded ${train.color} text-white text-[10px] px-1.5 flex items-center truncate shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400`}
                      title={`${train.name} (${train.label})`}
                    >
                      <span className="truncate">{train.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Layer 2: Freight / Goods Slots */}
            <div className="relative h-8 bg-slate-50 border border-slate-200 rounded flex items-center px-2">
              <span className="absolute left-2 text-[10px] font-semibold text-slate-600 z-10 uppercase tracking-wider">
                Freight Forecast
              </span>
              <div className="relative w-full h-5 ml-32">
                {timelineData.trains.filter(t => t.type === 'goods').map(train => {
                  const left = getPosPct(train.start);
                  const width = Math.max(getPosPct(train.end - train.start), 2.5);
                  return (
                    <div
                      key={train.id}
                      style={{ left: `${left}%`, width: `${width}%` }}
                      className="absolute top-0 h-5 rounded bg-amber-500 text-white text-[10px] px-1.5 flex items-center truncate shadow-sm cursor-pointer hover:ring-2 hover:ring-amber-300"
                      title={`${train.name} (${train.label})`}
                    >
                      <span className="truncate">{train.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Layer 3: Candidate Maintenance Windows */}
            <div className="relative h-10 bg-slate-100/70 border border-slate-300 rounded flex items-center px-2">
              <span className="absolute left-2 text-[10px] font-bold text-gov-navy z-10 uppercase tracking-wider">
                Candidate Windows
              </span>
              <div className="relative w-full h-7 ml-32">
                {timelineData.candidateWindows.map((cw) => {
                  const left = getPosPct(cw.startMin);
                  const width = Math.max(getPosPct(cw.endMin - cw.startMin), 3.5);
                  const isFeasible = cw.feasible;
                  return (
                    <div
                      key={cw.id}
                      onClick={() => onSelectCandidate && onSelectCandidate(cw)}
                      style={{ left: `${left}%`, width: `${width}%` }}
                      className={`absolute top-0 h-7 rounded border font-semibold text-[10px] px-2 flex items-center justify-between cursor-pointer transition-transform hover:scale-105 shadow-sm ${
                        isFeasible
                          ? 'bg-emerald-600 text-white border-emerald-700 animate-pulse'
                          : 'bg-rose-50 text-rose-800 border-rose-400 border-dashed'
                      }`}
                      title={`${cw.taskId}: ${cw.requestedSlot} - ${isFeasible ? 'FEASIBLE' : 'REJECTED'}`}
                    >
                      <span className="truncate">{cw.taskId}</span>
                      {isFeasible ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Evaluation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {timelineData.candidateWindows.map((cw) => (
          <div
            key={cw.id}
            className={`border rounded-lg p-4 bg-white shadow-sm transition-all ${
              cw.feasible ? 'border-emerald-300 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-sm">{cw.taskId}</span>
                  <span className="text-xs text-slate-500">({cw.department})</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cw.requestedSlot}</span>
                </div>
              </div>
              <StatusBadge status={cw.feasible ? 'Feasible' : 'Rejected'} />
            </div>

            <p className={`text-xs mt-2 leading-relaxed ${cw.feasible ? 'text-emerald-900 font-medium' : 'text-rose-800'}`}>
              {cw.conflictDetails}
            </p>

            <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Recommendation:</span>
              <span className="font-semibold text-gov-navy">{cw.recommendedAlternative}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
