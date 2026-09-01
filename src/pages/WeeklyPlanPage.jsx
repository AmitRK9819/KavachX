// src/pages/WeeklyPlanPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarRange,
  Filter,
  Search,
  Printer,
  Sparkles,
  Clock,
  CheckCircle2,
  ChevronDown,
  Info,
  Calendar
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { DeptTag } from '../components/common/DeptTag';
import { DisclaimerPill } from '../components/common/DisclaimerPill';
import { ApprovalModal } from '../components/features/ApprovalModal';

export const WeeklyPlanPage = () => {
  const navigate = useNavigate();
  const { blocks } = useAppState();
  const [selectedCorridor, setSelectedCorridor] = useState('ALL');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('agenda'); // 'agenda' | 'matrix'
  const [activeModalBlock, setActiveModalBlock] = useState(null);

  const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const filteredBlocks = blocks.filter((b) => {
    const matchCorridor = selectedCorridor === 'ALL' || b.corridor === selectedCorridor;
    const matchDept = selectedDept === 'ALL' || b.departments.includes(selectedDept);
    const matchStatus = selectedStatus === 'ALL' || b.status === selectedStatus;
    return matchCorridor && matchDept && matchStatus;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gov-navy tracking-tight">
              Weekly Unified Block Schedule (7-Day Plan)
            </h1>
            <DisclaimerPill text="Optimized Plan" variant="ai" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Active Block Cycle: <strong>05 Sep 2026 – 11 Sep 2026</strong> | Total Coordinated Possessions: <strong>{filteredBlocks.length}</strong>
          </p>
        </div>

        {/* View Toggle & Print Action */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-md border border-slate-200 flex items-center text-xs">
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1 rounded font-semibold transition-all ${
                viewMode === 'agenda' ? 'bg-white text-gov-navy shadow-sm' : 'text-slate-600'
              }`}
            >
              Agenda View
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1 rounded font-semibold transition-all ${
                viewMode === 'matrix' ? 'bg-white text-gov-navy shadow-sm' : 'text-slate-600'
              }`}
            >
              7-Day Matrix
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md border border-slate-300 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export / Print</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-wrap gap-3 items-center">
        {/* Corridor Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Corridor:</span>
          <select
            value={selectedCorridor}
            onChange={(e) => setSelectedCorridor(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-slate-50 font-mono"
          >
            <option value="ALL">All Corridors (5 Sections)</option>
            <option value="NDLS-CNB">NDLS-CNB (Delhi - Kanpur)</option>
            <option value="HWH-MGS">HWH-MGS (Howrah - Mughalsarai)</option>
            <option value="BCT-BRC">BCT-BRC (Mumbai - Vadodara)</option>
            <option value="MAS-RU">MAS-RU (Chennai - Renigunta)</option>
            <option value="SBC-JTJ">SBC-JTJ (Bengaluru - Jolarpettai)</option>
          </select>
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-slate-50"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering (Track)</option>
            <option value="S&T">S&T (Signal & Telecom)</option>
            <option value="Traction">Traction (Electrical)</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Approval Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-slate-50"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Display: Agenda or Matrix */}
      {viewMode === 'agenda' ? (
        <div className="space-y-4">
          {filteredBlocks.map((b) => (
            <div
              key={b.blockId}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow transition-all space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-gov-navy flex flex-col items-center justify-center font-mono font-bold text-xs">
                    <span>{b.dayOfWeek.slice(0, 3)}</span>
                    <span className="text-[10px] text-slate-500">{b.date.slice(8)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 font-mono">{b.blockId}</h3>
                      <span className="text-xs text-slate-600 font-semibold">({b.corridor})</span>
                      <PriorityBadge score={b.priority} band={b.priorityBand} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500">{b.corridorName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-gov-navy" />
                    <span>{b.date} | {b.start} - {b.end} ({b.durationMins}m)</span>
                  </div>
                  <StatusBadge status={b.status} />
                  <button
                    onClick={() => setActiveModalBlock(b)}
                    className="px-3 py-1 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-semibold rounded transition-colors"
                  >
                    Action
                  </button>
                </div>
              </div>

              {/* Department tags & activity checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 block mb-1.5">Coordinated Departments ({b.departments.length}):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {b.departments.map((d) => (
                      <DeptTag key={d} dept={d} size="sm" />
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 block mb-1.5">Key Maintenance Operations:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                    {b.activities.map((act, idx) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Optimization justification note */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="truncate">
                  <strong className="text-slate-700">CP-SAT Selection Rationale:</strong> {b.reasonSelected}
                </span>
                {b.reviewedBy && (
                  <span className="shrink-0 font-mono text-[11px] text-emerald-700 font-medium">
                    Signed off by {b.reviewedBy} ({b.reviewTimestamp})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Matrix View (7 Columns by Day) */
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {daysOfWeek.map((day) => {
            const dayBlocks = filteredBlocks.filter((b) => b.dayOfWeek === day);
            return (
              <div key={day} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm space-y-2">
                <div className="border-b border-slate-100 pb-2 text-center">
                  <div className="text-xs font-bold text-gov-navy">{day}</div>
                  <div className="text-[10px] font-mono text-slate-400">{dayBlocks.length} Block(s)</div>
                </div>

                <div className="space-y-2">
                  {dayBlocks.map((b) => (
                    <div
                      key={b.blockId}
                      onClick={() => setActiveModalBlock(b)}
                      className="p-2.5 rounded border border-slate-200 bg-slate-50 hover:bg-blue-50 cursor-pointer text-xs space-y-1 transition-all"
                    >
                      <div className="flex items-center justify-between font-mono font-bold text-[11px] text-gov-navy">
                        <span>{b.blockId}</span>
                        <span>{b.corridor}</span>
                      </div>
                      <div className="font-mono text-[10px] text-slate-600">
                        {b.start} - {b.end}
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <StatusBadge status={b.status} size="sm" />
                      </div>
                    </div>
                  ))}
                  {dayBlocks.length === 0 && (
                    <div className="text-center py-6 text-[11px] text-slate-400 italic">
                      No blocks scheduled
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Decision Action Modal */}
      <ApprovalModal
        block={activeModalBlock}
        isOpen={Boolean(activeModalBlock)}
        onClose={() => setActiveModalBlock(null)}
      />
    </div>
  );
};
