// src/components/features/PriorityDrawer.jsx
import React from 'react';
import { X, Sparkles, AlertTriangle, Shield, CheckCircle, Info, TrendingUp } from 'lucide-react';
import { PriorityBadge } from '../common/PriorityBadge';
import { DeptTag } from '../common/DeptTag';
import { DisclaimerPill } from '../common/DisclaimerPill';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const PriorityDrawer = ({ task, isOpen, onClose }) => {
  if (!isOpen || !task) return null;

  const factorsData = [
    { name: 'Defect Severity', score: task.priorityFactors?.defectSeverity || 20, max: 25, color: '#E11D48' },
    { name: 'Criticality', score: task.priorityFactors?.criticality || 20, max: 25, color: '#EA580C' },
    { name: 'Urgency', score: task.priorityFactors?.urgency || 18, max: 20, color: '#D97706' },
    { name: 'Failure Risk', score: task.priorityFactors?.failureRisk || 14, max: 15, color: '#0284C7' },
    { name: 'Overdue Status', score: task.priorityFactors?.overdue || 11, max: 15, color: '#6366F1' },
    { name: 'Availability Impact', score: task.priorityFactors?.availabilityImpact || 10, max: 15, color: '#0D9488' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-blue-100 text-gov-navy flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-gov-navy" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">AI Priority Explainability</h3>
                <DisclaimerPill text="AI Model Output" variant="ai" />
              </div>
              <p className="text-xs text-slate-500">Task ID: <span className="font-mono font-semibold text-gov-navy">{task.id}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Main Score Banner */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-900">Computed Priority Score</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold font-mono text-gov-navy">{task.priorityScore}</span>
                <span className="text-sm font-medium text-slate-500">/ 100</span>
              </div>
              <div className="mt-1">
                <PriorityBadge score={task.priorityScore} band={task.priorityBand} size="sm" />
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Department</div>
              <div className="mt-1">
                <DeptTag dept={task.department} />
              </div>
              <div className="text-xs text-slate-500 mt-2 font-mono">Source: {task.sourceSystem}</div>
            </div>
          </div>

          {/* Natural Language Plain English Justification */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-lg p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1.5">
              <Info className="w-4 h-4 text-amber-700" />
              <span>AI Decision Rationale</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {task.aiJustification || `Task evaluated with priority score ${task.priorityScore}/100. High criticality asset requiring synchronized track possession.`}
            </p>
          </div>

          {/* Factor Contribution Chart */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Factor Contribution Breakdown</h4>
              <span className="text-[11px] text-slate-500 font-mono">Total Max: 110 pts normalized</span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={factorsData} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 25]} tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip
                    formatter={(value, name, item) => [`${value} pts (Max: ${item.payload.max})`, item.payload.name]}
                    contentStyle={{ fontSize: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {factorsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Factor Detailed Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="px-3 py-2">Parameter</th>
                  <th className="px-3 py-2">Raw Value</th>
                  <th className="px-3 py-2">Weight</th>
                  <th className="px-3 py-2 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                <tr>
                  <td className="px-3 py-2 font-sans font-medium">Defect Severity</td>
                  <td className="px-3 py-2">{task.defectSeverity} / 100</td>
                  <td className="px-3 py-2 font-sans">25%</td>
                  <td className="px-3 py-2 text-right font-bold text-rose-700">{task.priorityFactors?.defectSeverity || 22}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-sans font-medium">Overdue Days</td>
                  <td className="px-3 py-2">{task.overdueDays} days</td>
                  <td className="px-3 py-2 font-sans">15%</td>
                  <td className="px-3 py-2 text-right font-bold text-indigo-700">{task.priorityFactors?.overdue || 11}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-sans font-medium">Failure Risk Score</td>
                  <td className="px-3 py-2">{(task.failureRiskScore * 100).toFixed(0)}%</td>
                  <td className="px-3 py-2 font-sans">15%</td>
                  <td className="px-3 py-2 text-right font-bold text-sky-700">{task.priorityFactors?.failureRisk || 14}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-sans font-medium">Asset Availability Impact</td>
                  <td className="px-3 py-2">{task.assetAvailabilityImpact} / 100</td>
                  <td className="px-3 py-2 font-sans">15%</td>
                  <td className="px-3 py-2 text-right font-bold text-teal-700">{task.priorityFactors?.availabilityImpact || 10}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Safety & Resource Requisites */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Safety & Resource Metadata</h4>
            <div className="text-xs text-slate-600 space-y-1">
              <div><strong className="text-slate-800">Asset:</strong> <span className="font-mono">{task.assetId}</span> on {task.corridorName}</div>
              <div><strong className="text-slate-800">Estimated Duration:</strong> {task.estimatedDurationMins} minutes</div>
              <div><strong className="text-slate-800">Required Resources:</strong> {task.requiredResources}</div>
              <div><strong className="text-slate-800">25kV Power Block:</strong> {task.safetyRequirements?.powerOff ? 'Required (Mandatory OHE De-energization)' : 'Not Required'}</div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">SIH PS 26027 Explainable AI Model</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-semibold rounded-md transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
