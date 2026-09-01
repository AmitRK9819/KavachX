// src/components/layout/Topbar.jsx
import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Clock, AlertCircle, PlayCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';

export const Topbar = () => {
  const navigate = useNavigate();
  const { kpis, resetAllState } = useAppState();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) + ' | ' +
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-gradient-to-r from-gov-navy via-[#0D449E] to-gov-navy-dark text-white border-b border-blue-900 shadow-sm sticky top-0 z-40">
      {/* Top micro masthead bar */}
      <div className="bg-[#061E47] px-4 sm:px-6 py-1 text-[11px] flex flex-wrap items-center justify-between border-b border-blue-950/60 text-slate-300">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-amber-400">SMART INDIA HACKATHON 2026</span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="hidden sm:inline">Problem Statement: PS 26027 (Unified Railway Block Planning)</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono text-slate-200">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{currentTime || 'Loading IST Time...'}</span>
          </div>
          <span className="hidden md:inline px-1.5 py-0.2 bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 rounded text-[10px]">
            System Status: Nominal (Simulated)
          </span>
        </div>
      </div>

      {/* Main header banner */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-amber-400 shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white flex items-center">
                Kavach<span className="text-gov-saffron">X</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-blue-800/80 border border-blue-700 text-blue-200">
                Decision Support System
              </span>
            </div>
            <p className="text-xs text-blue-200 font-normal">
              AI-Assisted Multi-Department Railway Block-Planning Engine
            </p>
          </div>
        </div>

        {/* Action badges & Demo trigger */}
        <div className="flex items-center gap-2.5">
          {/* AI Recommends Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 border border-white/15 text-xs text-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Recommends • Humans Approve</span>
          </div>

          {/* Pending Approvals CTA */}
          <button
            onClick={() => navigate('/approval')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              kpis.pendingApprovalCount > 0
                ? 'bg-amber-500/20 text-amber-200 border-amber-400/40 hover:bg-amber-500/30'
                : 'bg-white/10 text-slate-200 border-white/20'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>Pending Approvals</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold font-mono text-[11px]">
              {kpis.pendingApprovalCount}
            </span>
          </button>

          {/* Launch Demo Scenario CTA */}
          <button
            onClick={() => navigate('/demo')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-gov-saffron hover:bg-[#d8661e] text-white text-xs font-semibold shadow-sm transition-all border border-orange-400/50"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Judge Demo Walkthrough</span>
          </button>

          {/* Reset App State */}
          <button
            onClick={resetAllState}
            title="Reset Mock State to Defaults"
            className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white transition-colors border border-white/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
