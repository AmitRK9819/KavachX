// src/pages/DemoScenarioPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlayCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Layers,
  Cpu,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  Hammer,
  Radio,
  Zap,
  Info
} from 'lucide-react';
import { apiClient } from '../api/client';
import { useAppState } from '../context/AppStateContext';
import { DeptTag } from '../components/common/DeptTag';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { DisclaimerPill } from '../components/common/DisclaimerPill';

export const DemoScenarioPage = () => {
  const navigate = useNavigate();
  const { demoStep, setDemoStep, updateBlockStatus } = useAppState();
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedInDemo, setApprovedInDemo] = useState(false);

  useEffect(() => {
    const fetchSteps = async () => {
      const data = await apiClient.getDemoSteps();
      setSteps(data);
      setLoading(false);
    };
    fetchSteps();
  }, []);

  const currentStepIndex = demoStep - 1;
  const currentStepData = steps[currentStepIndex] || steps[0];

  const handleNext = () => {
    if (demoStep < 7) {
      setDemoStep(demoStep + 1);
    }
  };

  const handlePrev = () => {
    if (demoStep > 1) {
      setDemoStep(demoStep - 1);
    }
  };

  const handleReset = () => {
    setDemoStep(1);
    setApprovedInDemo(false);
  };

  const handleDemoApproval = () => {
    updateBlockStatus(
      'BLK-0042',
      'Approved',
      'Demo Chief Controller (HQ)',
      'Approved during SIH live scenario demo evaluation.'
    );
    setApprovedInDemo(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Step Progress Stepper */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-orange-100 text-gov-saffron">
                <PlayCircle className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-gov-navy tracking-tight">
                KavachX Live Demo Scenario Walkthrough
              </h1>
              <DisclaimerPill text="Guided 7-Step Evaluation" variant="ai" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Follow the end-to-end pipeline: from 3 siloed department requests to AI prioritization, conflict rejection, corridor bundling, CP-SAT solving, and human approval.
            </p>
          </div>

          {/* Persistent Reset Button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md border border-slate-300 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo (Step 1)</span>
          </button>
        </div>

        {/* 7-Step Stepper Header */}
        <div className="grid grid-cols-7 gap-2 pt-2 border-t border-slate-100">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => {
            const isCurrent = demoStep === num;
            const isPassed = demoStep > num;
            const stepTitles = [
              '1. Siloed Requests',
              '2. AI Priority',
              '3. Conflict Rejection',
              '4. Feasible Window',
              '5. Bundled Block',
              '6. CP-SAT Solver',
              '7. Plan & Sign-off'
            ];

            return (
              <button
                key={num}
                onClick={() => setDemoStep(num)}
                className={`py-2 px-1 text-center rounded-md border transition-all ${
                  isCurrent
                    ? 'bg-gov-navy text-white border-gov-navy shadow-sm font-bold'
                    : isPassed
                    ? 'bg-blue-50 text-gov-navy border-blue-200 font-semibold'
                    : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-mono">{stepTitles[num - 1]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Active Step Canvas */}
      {currentStepData && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-6">
          {/* Step Header */}
          <div className="border-b border-slate-100 pb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gov-saffron uppercase tracking-wider">
                <span>Step {currentStepData.step} of 7</span>
                <span>•</span>
                <span>Corridor: NDLS-CNB (Delhi - Kanpur)</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {currentStepData.title}: <span className="text-gov-navy font-semibold">{currentStepData.subtitle}</span>
              </h2>
              <p className="text-xs text-slate-600 mt-2 max-w-4xl leading-relaxed">
                {currentStepData.caption}
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-2 rounded-lg text-xs font-semibold max-w-xs shrink-0">
              <span className="text-[10px] uppercase tracking-wider block text-amber-700 font-bold mb-0.5">Key Real-world Impact</span>
              {currentStepData.keyTakeaway}
            </div>
          </div>

          {/* STEP 1 CANVAS: Independent Siloed Requests */}
          {demoStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  3 Separate Senior Section Engineers (SSEs) entered their demands into separate systems:
                </span>
                <span className="font-mono text-rose-700 font-bold">Uncoordinated State</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentStepData.data.requests.map((req) => (
                  <div key={req.id} className="p-4 rounded-lg border border-slate-200 bg-white shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-gov-navy">{req.id}</span>
                      <DeptTag dept={req.dept} size="sm" />
                    </div>
                    <div className="font-bold text-slate-900 text-sm">{req.task}</div>
                    <div className="text-xs font-mono text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                      <div>Requested: <strong className="text-rose-700">{req.requestedSlot}</strong></div>
                      <div>Source System: <strong>{req.system}</strong></div>
                    </div>
                    <div className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Siloed: Unaware of other 2 department plans</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 CANVAS: AI Prioritization */}
          {demoStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-blue-50/70 p-4 rounded-lg border border-blue-200 text-xs text-blue-950 font-medium">
                KavachX AI scores every request dynamically based on defect severity, asset criticality, failure risk, and overdue days.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentStepData.data.scores.map((sc) => (
                  <div key={sc.id} className="p-5 rounded-lg border border-slate-200 bg-white shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900">{sc.id}</span>
                      <DeptTag dept={sc.dept} size="sm" />
                    </div>

                    <div className="flex items-baseline justify-between border-y border-slate-100 py-2">
                      <span className="text-xs text-slate-500 font-semibold">AI Priority Score:</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold font-mono text-gov-navy">{sc.score}</span>
                        <span className="text-xs text-slate-400">/ 100</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <PriorityBadge score={sc.score} band={sc.band} size="sm" />
                      <span className="text-[11px] text-slate-500 font-mono">6 Factors Evaluated</span>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed">
                      {sc.aiReason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 CANVAS: Conflicting Windows Rejected */}
          {demoStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-xs text-rose-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>
                  <strong>Safety Violation Detected:</strong> The requested morning windows (07:00–09:30) collide with scheduled express trains on the Working Time Table. The system automatically REJECTS the naive slots.
                </span>
              </div>

              <div className="space-y-3">
                {currentStepData.data.rejectedWindows.map((rw, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-rose-200 bg-rose-50/30 flex items-start justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-rose-900">{rw.slot}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          {rw.status}
                        </span>
                      </div>
                      <p className="text-rose-800 mt-1 font-medium">{rw.reason}</p>
                    </div>
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 CANVAS: Feasible Window Found */}
          {demoStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-xs text-emerald-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Zero-Conflict Night Window Found:</strong> 02:10 – 04:40 (150 minutes) satisfies all passenger, freight, and power clearance constraints.
                  </span>
                </div>
                <span className="font-mono font-bold text-emerald-800">FEASIBLE (GREEN)</span>
              </div>

              <div className="p-5 rounded-lg border border-slate-200 bg-slate-50 space-y-3 text-xs">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                  Automated Feasibility Verification Checklist
                </h3>
                <ul className="space-y-2">
                  {currentStepData.data.foundWindow.verification.map((v, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* STEP 5 CANVAS: Multi-Department Bundled */}
          {demoStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-xs text-indigo-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600 shrink-0" />
                  <span>
                    <strong>Cross-Department Coordination:</strong> Merging Track + S&T + Traction tasks into 1 synchronized possession card.
                  </span>
                </div>
                <span className="font-mono font-bold text-indigo-700 bg-white px-2.5 py-1 rounded border border-indigo-200">
                  {currentStepData.data.bundleCard.savedHours}
                </span>
              </div>

              {/* Bundled Comparison Card */}
              <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-sm">{currentStepData.data.bundleCard.id}</span>
                    <span className="text-xs text-slate-500 ml-2">Slot: {currentStepData.data.bundleCard.window}</span>
                  </div>
                  <PriorityBadge score={currentStepData.data.bundleCard.combinedPriority} band="High" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {currentStepData.data.bundleCard.tasks.map((t) => (
                    <div key={t.id} className="p-3 rounded border border-slate-200 bg-slate-50 text-xs space-y-1">
                      <div className="flex items-center justify-between font-mono font-bold">
                        <span>{t.id}</span>
                        <DeptTag dept={t.dept} size="sm" />
                      </div>
                      <div className="font-medium text-slate-800">{t.title}</div>
                      <div className="text-slate-500 font-mono">Duration: {t.dur}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs p-3 rounded bg-slate-50 border border-slate-200 text-center font-mono">
                  <div>
                    <span className="text-slate-500 font-sans">Without Bundling (3 Isolated Blocks):</span>
                    <div className="font-bold text-rose-700 text-base">{currentStepData.data.bundleCard.isolatedDuration}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-sans">With KavachX Bundling (1 Joint Block):</span>
                    <div className="font-bold text-emerald-700 text-base">{currentStepData.data.bundleCard.bundledDuration}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6 CANVAS: CP-SAT Optimization */}
          {demoStep === 6 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 text-xs text-gov-navy flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-gov-navy shrink-0" />
                  <span>
                    <strong>Google OR-Tools CP-SAT:</strong> Solved global integer program in 0.284s, proving BUNDLE-014 is globally optimal.
                  </span>
                </div>
                <span className="font-mono font-bold text-emerald-700 bg-white px-2.5 py-1 rounded border border-blue-200">
                  OPTIMAL STATUS
                </span>
              </div>

              <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-sm space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900 text-sm font-mono">Selected Block: BLK-0042</span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold font-mono">
                    GLOBAL OPTIMUM
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono py-2">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-sans">Corridor</span>
                    <div className="font-bold text-slate-900">NDLS-CNB</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-sans">Date & Window</span>
                    <div className="font-bold text-slate-900">05 Sep | 02:10-04:40</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-sans">Downtime Saved</span>
                    <div className="font-bold text-emerald-700">1.75 Hours</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-sans">Passenger Delay</span>
                    <div className="font-bold text-emerald-700">0 Minutes</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7 CANVAS: Final Plan & Human Sign-off */}
          {demoStep === 7 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-xs text-emerald-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Human-in-the-Loop Sign-off:</strong> The AI recommendation is ready for the Chief Controller's 1-click green signal.
                  </span>
                </div>
                <span className="font-mono font-bold text-gov-navy">AI Recommends • Humans Approve</span>
              </div>

              {/* Before vs After Benchmark Summary Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center font-mono">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-sans text-[11px]">Track Possessions</span>
                  <div className="font-bold text-slate-900 text-sm mt-1">{currentStepData.data.beforeAfterSummary.possessions}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-sans text-[11px]">Train Conflicts</span>
                  <div className="font-bold text-emerald-700 text-sm mt-1">{currentStepData.data.beforeAfterSummary.conflicts}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-sans text-[11px]">Downtime</span>
                  <div className="font-bold text-emerald-700 text-sm mt-1">{currentStepData.data.beforeAfterSummary.downtime}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-sans text-[11px]">Passenger Disruption</span>
                  <div className="font-bold text-emerald-700 text-sm mt-1">{currentStepData.data.beforeAfterSummary.passengerDelays}</div>
                </div>
              </div>

              {/* 1-Click Interactive Sign-off Button */}
              <div className="p-5 rounded-lg border border-slate-200 bg-white text-center space-y-3">
                <div className="text-xs text-slate-600">
                  Block <strong>BLK-0042</strong> is queued for approval in the active Weekly Schedule.
                </div>
                {approvedInDemo ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-md font-bold text-xs border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Block Approved & Published to Weekly Schedule!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleDemoApproval}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md shadow-md transition-all flex items-center gap-2 mx-auto"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Click to Approve Block (Chief Controller)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Navigation Controls: Previous / Next */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={demoStep === 1}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md border transition-all ${
                demoStep === 1
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Step</span>
            </button>

            <span className="text-xs text-slate-500 font-mono">
              Step {demoStep} / 7
            </span>

            {demoStep < 7 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-semibold rounded-md shadow-sm transition-all"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/comparison')}
                className="flex items-center gap-1.5 px-5 py-2 bg-gov-saffron hover:bg-[#d8661e] text-white text-xs font-bold rounded-md shadow-sm transition-all"
              >
                <span>View Full Before vs KavachX Benchmark</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
