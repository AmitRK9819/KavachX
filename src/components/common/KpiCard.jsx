// src/components/common/KpiCard.jsx
import React from 'react';
import { DisclaimerPill } from './DisclaimerPill';

export const KpiCard = ({
  title,
  value,
  unit,
  subtitle,
  trend,
  trendType = 'positive', // 'positive' | 'negative' | 'neutral'
  icon: Icon,
  badge = 'Simulated',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200 rounded-lg p-5 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-gov-navy/40 hover:shadow' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="flex items-center gap-1.5">
          {badge && <DisclaimerPill text={badge} variant="synthetic" />}
          {Icon && (
            <div className="w-8 h-8 rounded-md bg-blue-50 text-gov-navy flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">{value}</span>
        {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
      </div>

      <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100">
        <span className="text-slate-600 truncate">{subtitle}</span>
        {trend && (
          <span
            className={`font-medium shrink-0 ml-2 ${
              trendType === 'positive'
                ? 'text-emerald-700'
                : trendType === 'negative'
                ? 'text-rose-600'
                : 'text-slate-600'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
