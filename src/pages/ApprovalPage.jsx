// src/pages/ApprovalPage.jsx
import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Sparkles,
  Info,
  History,
  FileCheck2,
  Calendar
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { DeptTag } from '../components/common/DeptTag';
import { DisclaimerPill } from '../components/common/DisclaimerPill';
import { ApprovalModal } from '../components/features/ApprovalModal';

export const ApprovalPage = () => {
  const { blocks, auditLogs, updateBlockStatus } = useAppState();
  const [activeModalBlock, setActiveModalBlock] = useState(null);
  const [filterTab, setFilterTab] = useState('pending'); // 'pending' | 'approved' | 'all'

  const pendingBlocks = blocks.filter((b) => b.status === 'Pending Approval');
  const approvedBlocks = blocks.filter((b) => b.status === 'Approved');
  const rejectedBlocks = blocks.filter((b) => b.status === 'Rejected' || b.status === 'Revision Requested');

  const displayedBlocks =
    filterTab === 'pending'
      ? pendingBlocks
      : filterTab === 'approved'
      ? approvedBlocks
      : blocks;

  const handleQuickApprove = (blockId) => {
    updateBlockStatus(
      blockId,
      'Approved',
      'Duty Chief Controller (Operations)',
      '1-Click quick approval granted after timetable clearance.'
    );
  };

  const handleQuickReject = (blockId) => {
    updateBlockStatus(
      blockId,
      'Rejected',
      'Duty Chief Controller (Operations)',
      'Rejected due to sectional traffic priority.'
    );
  };

  return (
    <div className="space-y-6">
      {/* Official Human Authority Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-blue-100 text-gov-navy">
                <UserCheck className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-gov-navy tracking-tight">
                Controller Block Approval & Human Sign-off Hub
              </h1>
              <DisclaimerPill text="Human-in-the-Loop Hub" variant="ai" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Statutory Railway Rule: <strong>Final block approval rests with authorized railway personnel. AI provides recommendations only.</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-3 py-1.5 rounded-md border border-amber-300">
              {pendingBlocks.length} Blocks Awaiting Decision
            </span>
          </div>
        </div>

        {/* Filter Sub-Tabs */}
        <div className="flex gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md border transition-all ${
              filterTab === 'pending'
                ? 'bg-gov-navy text-white border-gov-navy shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Pending Decision ({pendingBlocks.length})
          </button>
          <button
            onClick={() => setFilterTab('approved')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md border transition-all ${
              filterTab === 'approved'
                ? 'bg-gov-navy text-white border-gov-navy shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Approved Blocks ({approvedBlocks.length})
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md border transition-all ${
              filterTab === 'all'
                ? 'bg-gov-navy text-white border-gov-navy shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Scheduled ({blocks.length})
          </button>
        </div>
      </div>

      {/* Main Blocks List */}
      <div className="space-y-4">
        {displayedBlocks.map((b) => (
          <div
            key={b.blockId}
            className={`bg-white border rounded-lg p-5 shadow-sm space-y-4 transition-all ${
              b.status === 'Pending Approval'
                ? 'border-amber-300 ring-1 ring-amber-400/20'
                : b.status === 'Approved'
                ? 'border-emerald-200'
                : 'border-rose-200 opacity-80'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-gov-navy flex flex-col items-center justify-center font-mono font-bold text-xs">
                  <span>{b.dayOfWeek.slice(0, 3)}</span>
                  <span className="text-[10px] text-slate-500">{b.date.slice(8)}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900 font-mono">{b.blockId}</span>
                    <span className="text-xs text-slate-600 font-semibold">({b.corridor})</span>
                    <PriorityBadge score={b.priority} band={b.priorityBand} size="sm" />
                    <StatusBadge status={b.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500">{b.corridorName}</p>
                </div>
              </div>

              {/* Action Buttons for Pending Blocks */}
              <div className="flex items-center gap-2">
                {b.status === 'Pending Approval' ? (
                  <>
                    <button
                      onClick={() => handleQuickApprove(b.blockId)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Block</span>
                    </button>
                    <button
                      onClick={() => setActiveModalBlock(b)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-md shadow-sm transition-colors"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Modify / Remarks</span>
                    </button>
                    <button
                      onClick={() => handleQuickReject(b.blockId)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-semibold rounded-md transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setActiveModalBlock(b)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md border border-slate-300 transition-colors"
                  >
                    Change Decision
                  </button>
                )}
              </div>
            </div>

            {/* Block Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-slate-700">Time Window & Duration:</span>
                <div className="font-mono text-slate-900 bg-slate-50 p-2 rounded border border-slate-100">
                  <div>Date: <strong>{b.date} ({b.dayOfWeek})</strong></div>
                  <div>Slot: <strong>{b.start} – {b.end} ({b.durationMins} mins)</strong></div>
                  <div className="text-[11px] text-slate-500">25kV Power Cut: {b.powerShutoffRequired ? 'Required' : 'None'}</div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-700">Coordinated Departments:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {b.departments.map((d) => (
                    <DeptTag key={d} dept={d} size="sm" />
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-700">Activities Bundled:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  {b.activities.map((act, i) => (
                    <li key={i} className="truncate">{act}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Selection Justification */}
            <div className="p-3 bg-blue-50/60 rounded-md border border-blue-200/60 text-xs text-slate-700 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-gov-navy shrink-0 mt-0.5" />
              <div>
                <strong className="text-gov-navy">AI Decision Rationale:</strong> {b.reasonSelected}
              </div>
            </div>

            {/* Audit Log Signature if reviewed */}
            {b.reviewedBy && (
              <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200 flex items-center justify-between">
                <span>Authorized Sign-off: <strong>{b.reviewedBy}</strong></span>
                <span>Timestamp: <strong>{b.reviewTimestamp}</strong></span>
              </div>
            )}
          </div>
        ))}

        {displayedBlocks.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <div className="font-semibold text-slate-700 text-sm">No Blocks in this Filter Category</div>
            <p className="text-xs">All candidate blocks have been processed or moved to active schedules.</p>
          </div>
        )}
      </div>

      {/* Decision Audit Trail Section */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <History className="w-4 h-4 text-gov-navy" />
          <h3 className="text-sm font-bold text-slate-900">Controller Decision Audit Trail (Immutable Log)</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-mono">
              <tr>
                <th className="px-3 py-2">Log ID</th>
                <th className="px-3 py-2">Block ID</th>
                <th className="px-3 py-2">Action</th>
                <th className="px-3 py-2">Authorizing Officer</th>
                <th className="px-3 py-2">Timestamp</th>
                <th className="px-3 py-2">Audit Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="px-3 py-2 text-slate-400">{log.id}</td>
                  <td className="px-3 py-2 font-bold text-gov-navy">{log.blockId}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.action === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-sans font-medium text-slate-900">{log.reviewer}</td>
                  <td className="px-3 py-2 text-slate-500">{log.timestamp}</td>
                  <td className="px-3 py-2 font-sans text-slate-600">{log.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Action Modal */}
      <ApprovalModal
        block={activeModalBlock}
        isOpen={Boolean(activeModalBlock)}
        onClose={() => setActiveModalBlock(null)}
      />
    </div>
  );
};
