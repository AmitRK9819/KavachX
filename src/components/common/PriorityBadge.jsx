// src/components/common/PriorityBadge.jsx
import React from 'react';

export const PriorityBadge = ({ score, band, showScore = true, size = 'md' }) => {
  // Determine band if not explicitly provided
  let computedBand = band;
  if (!computedBand && typeof score === 'number') {
    if (score >= 80) computedBand = 'Critical';
    else if (score >= 60) computedBand = 'High';
    else if (score >= 40) computedBand = 'Medium';
    else computedBand = 'Low';
  }

  const bandStyles = {
    Critical: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-600'
    },
    High: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-amber-500'
    },
    Medium: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      dot: 'bg-blue-500'
    },
    Low: {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-200',
      dot: 'bg-slate-400'
    }
  };

  const style = bandStyles[computedBand] || bandStyles.Medium;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3.5 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${style.bg} ${style.text} ${style.border} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span>{computedBand}</span>
      {showScore && typeof score === 'number' && (
        <span className="font-mono font-semibold opacity-90">({score})</span>
      )}
    </span>
  );
};
