// src/components/features/ApprovalModal.jsx
import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, UserCheck } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { DeptTag } from '../common/DeptTag';
import { PriorityBadge } from '../common/PriorityBadge';

export const ApprovalModal = ({ block, isOpen, onClose }) => {
  const { updateBlockStatus } = useAppState();
  const [controllerName, setControllerName] = useState('Senior Divisional Operations Controller (DOM)');
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState('approve'); // 'approve' | 'reject' | 'revise'

  if (!isOpen || !block) return null;

  const handleSubmit = () => {
    let newStatus = 'Approved';
    if (actionType === 'reject') newStatus = 'Rejected';
    else if (actionType === 'revise') newStatus = 'Revision Requested';

    updateBlockStatus(
      block.blockId,
      newStatus,
      controllerName,
      remarks || `${newStatus} by ${controllerName}`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-blue-100 text-gov-navy flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Human Controller Decision Hub</h3>
              <p className="text-xs text-slate-500 font-mono">Block ID: {block.blockId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Block Overview */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">{block.corridorName}</span>
              <PriorityBadge score={block.priority} band={block.priorityBand} size="sm" />
            </div>
            <div className="text-slate-600 font-mono">
              Date: <strong>{block.date}</strong> | Slot: <strong>{block.start} - {block.end} ({block.durationMins} mins)</strong>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {block.departments.map(d => (
                <DeptTag key={d} dept={d} size="sm" />
              ))}
            </div>
            <div className="pt-2 border-t border-slate-200 text-slate-700">
              <span className="font-semibold text-gov-navy">AI Recommendation Rationale:</span> {block.reasonSelected}
            </div>
          </div>

          {/* Action Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Select Decision Action:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setActionType('approve')}
                className={`flex flex-col items-center justify-center p-3 rounded-md border text-xs font-semibold transition-all ${
                  actionType === 'approve'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-1" />
                <span>Approve Block</span>
              </button>

              <button
                type="button"
                onClick={() => setActionType('revise')}
                className={`flex flex-col items-center justify-center p-3 rounded-md border text-xs font-semibold transition-all ${
                  actionType === 'revise'
                    ? 'bg-amber-50 text-amber-900 border-amber-500 ring-2 ring-amber-500/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 mb-1" />
                <span>Request Revision</span>
              </button>

              <button
                type="button"
                onClick={() => setActionType('reject')}
                className={`flex flex-col items-center justify-center p-3 rounded-md border text-xs font-semibold transition-all ${
                  actionType === 'reject'
                    ? 'bg-rose-50 text-rose-800 border-rose-500 ring-2 ring-rose-500/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-600 mb-1" />
                <span>Reject Block</span>
              </button>
            </div>
          </div>

          {/* Controller Credentials */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Authorizing Officer / Role:</label>
            <input
              type="text"
              value={controllerName}
              onChange={(e) => setControllerName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gov-navy font-mono"
            />
          </div>

          {/* Remarks input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Audit Remarks / Justification:</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g., Section traffic clearance verified with Station Master; power block permit confirmed."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gov-navy resize-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audit trail logged with timestamp</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md text-white shadow-sm transition-colors ${
                actionType === 'approve'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : actionType === 'reject'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              Confirm Decision
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
