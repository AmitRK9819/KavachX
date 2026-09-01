// src/components/layout/FooterDisclaimer.jsx
import React from 'react';
import { AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

export const FooterDisclaimer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 px-4 sm:px-6 py-2.5 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3 shadow-inner">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
        <p className="font-medium text-slate-700">
          <strong className="text-gov-navy">KavachX Decision Support:</strong> All operational data and KPIs displayed are <span className="underline decoration-amber-400 font-semibold text-slate-800">synthetic prototype simulations</span> developed for Smart India Hackathon (SIH PS 26027), not live Indian Railways records.
        </p>
      </div>
      <div className="flex items-center gap-3 text-[11px] text-slate-400">
        <span className="flex items-center gap-1 text-gov-navy font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Final approval requires authorized railway personnel
        </span>
        <span>•</span>
        <span>AI Recommends Only</span>
      </div>
    </footer>
  );
};
