// src/components/common/DeptTag.jsx
import React from 'react';
import { Hammer, Radio, Zap, ShieldCheck } from 'lucide-react';

export const DeptTag = ({ dept, size = 'md', showLabel = true }) => {
  const deptConfigs = {
    'Engineering': {
      label: 'Engineering (Track)',
      shortLabel: 'Engineering',
      icon: Hammer,
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200'
    },
    'S&T': {
      label: 'S&T (Signal & Telecom)',
      shortLabel: 'S&T',
      icon: Radio,
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200'
    },
    'Traction': {
      label: 'Traction (Electrical/OHE)',
      shortLabel: 'Traction',
      icon: Zap,
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200'
    },
    'Multi-Department': {
      label: 'Multi-Department Unified',
      shortLabel: 'Bundled',
      icon: ShieldCheck,
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-200'
    }
  };

  const config = deptConfigs[dept] || deptConfigs['Engineering'];
  const IconComponent = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
      title={config.label}
    >
      <IconComponent className="w-3.5 h-3.5 shrink-0" />
      {showLabel && <span>{size === 'sm' ? config.shortLabel : config.shortLabel}</span>}
    </span>
  );
};
