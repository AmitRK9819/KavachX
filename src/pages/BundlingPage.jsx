// src/pages/BundlingPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  Zap,
  Hammer,
  Radio,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { apiClient } from '../api/client';
import { BundlingCard } from '../components/features/BundlingCard';
import { DisclaimerPill } from '../components/common/DisclaimerPill';

export const BundlingPage = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');

  useEffect(() => {
    const fetchBundles = async () => {
      const data = await apiClient.getBundles();
      setBundles(data);
      setLoading(false);
    };
    fetchBundles();
  }, []);

  const totalDowntimeSaved = bundles.reduce((acc, b) => acc + b.downtimeSavedHours, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gov-navy tracking-tight">
              Cross-Department Corridor Bundling Engine
            </h1>
            <DisclaimerPill text="Multi-Branch Synergy" variant="ai" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Intelligently clustering Track (Civil), S&T (Signal), and Traction (OHE) requests on identical corridor sections
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 text-right">
            <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Total Disruption Saved</div>
            <div className="text-lg font-mono font-extrabold text-emerald-700">{totalDowntimeSaved.toFixed(2)} Hours</div>
          </div>
        </div>
      </div>

      {/* Concept Explainer Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-gov-navy text-white rounded-lg p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Why Multi-Department Bundling Matters for Indian Railways</span>
        </div>
        <p className="text-xs text-blue-100 leading-relaxed max-w-4xl">
          In conventional operations, the <strong>Engineering (Track)</strong> team requests a line block for rail grinding, the <strong>Traction (Electrical)</strong> team requests a separate power block for insulator cleaning, and the <strong>S&T (Signalling)</strong> team requests a third block for switch maintenance. This results in <strong>three separate section closures</strong>. KavachX unifies compatible work into <strong>one synchronized window</strong>, sharing 25kV power shutdowns and earthing safety discharge setups.
        </p>
      </div>

      {/* Bundled Candidates List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Optimized Corridor Bundled Blocks ({bundles.length} Active Candidates)
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Evaluated for Track Space, Power Isolation & Crew Safety
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {bundles.map((bundle) => (
            <BundlingCard key={bundle.bundleId} bundle={bundle} />
          ))}
        </div>
      </div>
    </div>
  );
};
