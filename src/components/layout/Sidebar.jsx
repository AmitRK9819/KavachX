// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  BrainCircuit,
  CalendarClock,
  Layers,
  Sparkles,
  CalendarRange,
  Calendar,
  PlayCircle,
  BarChart3,
  UserCheck
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

const navItems = [
  {
    step: "01",
    label: "Dashboard (Control Room)",
    path: "/",
    icon: LayoutDashboard,
    badge: null
  },
  {
    step: "02",
    label: "Unified Data Explorer",
    path: "/data",
    icon: Database,
    badge: "7 Sources"
  },
  {
    step: "03",
    label: "AI Priority Engine",
    path: "/priority",
    icon: BrainCircuit,
    badge: "0-100 Score"
  },
  {
    step: "04",
    label: "Feasibility & Conflicts",
    path: "/feasibility",
    icon: CalendarClock,
    badge: "Gantt Timeline"
  },
  {
    step: "05",
    label: "Corridor Bundling",
    path: "/bundling",
    icon: Layers,
    badge: "Cross-Dept"
  },
  {
    step: "06",
    label: "Optimized Schedule",
    path: "/optimize",
    icon: Sparkles,
    badge: "CP-SAT"
  },
  {
    step: "07",
    label: "Weekly Block Plan",
    path: "/plan/weekly",
    icon: CalendarRange,
    badge: "7-Day"
  },
  {
    step: "08",
    label: "Monthly Block Plan",
    path: "/plan/monthly",
    icon: Calendar,
    badge: "30-Day"
  },
  {
    step: "09",
    label: "Demo Scenario",
    path: "/demo",
    icon: PlayCircle,
    badge: "Guided 1-7",
    highlight: true
  },
  {
    step: "10",
    label: "Before vs KavachX",
    path: "/comparison",
    icon: BarChart3,
    badge: "KPI Boost"
  },
  {
    step: "11",
    label: "Block Approval",
    path: "/approval",
    icon: UserCheck,
    badge: "Human Sign-off"
  }
];

export const Sidebar = () => {
  const { kpis } = useAppState();
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-88px)] select-none">
      {/* Sidebar Pipeline Header */}
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Decision Pipeline
          </span>
          <span className="text-[10px] font-mono text-gov-navy font-semibold px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200">
            v1.0 (Prototype)
          </span>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isApproval = item.path === '/approval';

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-50/90 text-gov-navy border-l-4 border-gov-navy shadow-sm font-semibold'
                  : item.highlight
                  ? 'text-gov-saffron bg-orange-50/60 hover:bg-orange-50 border border-orange-200/60'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-gov-navy' : 'text-slate-400'}`}>
                  {item.step}
                </span>
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-gov-navy' : item.highlight ? 'text-gov-saffron' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {/* Dynamic Badge for Pending Approvals or static tag */}
              {isApproval && kpis.pendingApprovalCount > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold font-mono text-[10px] shrink-0">
                  {kpis.pendingApprovalCount}
                </span>
              ) : item.badge ? (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded border shrink-0 ${
                    isActive
                      ? 'bg-blue-100 text-gov-navy border-blue-200'
                      : item.highlight
                      ? 'bg-orange-100 text-orange-800 border-orange-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>

      {/* Railway Authority Footnote */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Control Room Live Feed</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          Unified Multi-Department Scheduling Engine • SIH 2026
        </p>
      </div>
    </aside>
  );
};
