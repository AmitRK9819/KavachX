// src/pages/PriorityEnginePage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  BrainCircuit,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  ChevronRight,
  Info,
  Layers,
  AlertCircle
} from 'lucide-react';
import { apiClient } from '../api/client';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { DeptTag } from '../components/common/DeptTag';
import { DisclaimerPill } from '../components/common/DisclaimerPill';
import { PriorityDrawer } from '../components/features/PriorityDrawer';

export const PriorityEnginePage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [bandFilter, setBandFilter] = useState('ALL');
  const [corridorFilter, setCorridorFilter] = useState('ALL');
  const [sortField, setSortField] = useState('priorityScore');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await apiClient.getTasks();
      setTasks(data);
      setLoading(false);
    };
    fetchTasks();
  }, []);

  const handleRowClick = (task) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        const matchesSearch =
          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.taskType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.corridor.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDept = deptFilter === 'ALL' || t.department === deptFilter;
        const matchesBand = bandFilter === 'ALL' || t.priorityBand === bandFilter;
        const matchesCorridor = corridorFilter === 'ALL' || t.corridor === corridorFilter;

        return matchesSearch && matchesDept && matchesBand && matchesCorridor;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [tasks, searchQuery, deptFilter, bandFilter, corridorFilter, sortField, sortAsc]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gov-navy tracking-tight">
              AI Priority Ranking Engine & Explainability
            </h1>
            <DisclaimerPill text="Deterministic Scoring" variant="ai" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic 0–100 scoring based on defect severity, telemetry, overdue status, and safety criticality
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-500">Tasks Evaluated</div>
          <div className="text-lg font-bold font-mono text-gov-navy">{filteredTasks.length} / {tasks.length}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Task ID, defect, asset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gov-navy bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-navy"
          >
            <option value="ALL">All Departments (Track / S&T / Traction)</option>
            <option value="Engineering">Engineering (Track)</option>
            <option value="S&T">S&T (Signal & Telecom)</option>
            <option value="Traction">Traction (Electrical / OHE)</option>
          </select>

          {/* Priority Band Filter */}
          <select
            value={bandFilter}
            onChange={(e) => setBandFilter(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-navy"
          >
            <option value="ALL">All Priority Bands (0 - 100)</option>
            <option value="Critical">Critical (80 - 100)</option>
            <option value="High">High (60 - 79)</option>
            <option value="Medium">Medium (40 - 59)</option>
            <option value="Low">Low (0 - 39)</option>
          </select>

          {/* Corridor Filter */}
          <select
            value={corridorFilter}
            onChange={(e) => setCorridorFilter(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-navy"
          >
            <option value="ALL">All Trunk Corridors</option>
            <option value="NDLS-CNB">NDLS-CNB (Delhi - Kanpur)</option>
            <option value="HWH-MGS">HWH-MGS (Howrah - Mughalsarai)</option>
            <option value="BCT-BRC">BCT-BRC (Mumbai - Vadodara)</option>
            <option value="MAS-RU">MAS-RU (Chennai - Renigunta)</option>
            <option value="SBC-JTJ">SBC-JTJ (Bengaluru - Jolarpettai)</option>
          </select>
        </div>

        {/* Explainability Tip */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-gov-navy" />
            <span>Click any row to open the <strong>Explainability Side Panel</strong> and inspect factor weights</span>
          </span>
          <span className="font-mono text-[11px] text-slate-400">Sort by clicking column headers</span>
        </div>
      </div>

      {/* Main Priority Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider select-none">
              <tr>
                <th
                  onClick={() => toggleSort('id')}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Task ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Corridor & Asset ID</th>
                <th className="px-4 py-3">Defect / Maintenance Activity</th>
                <th
                  onClick={() => toggleSort('defectSeverity')}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Severity</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('overdueDays')}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Overdue</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('priorityScore')}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>AI Priority Score</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3">Band</th>
                <th className="px-4 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => handleRowClick(task)}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3 font-mono font-bold text-gov-navy group-hover:underline">
                    {task.id}
                  </td>
                  <td className="px-4 py-3">
                    <DeptTag dept={task.department} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{task.corridor}</div>
                    <div className="text-[11px] font-mono text-slate-500">{task.assetId}</div>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="font-medium text-slate-900 truncate">{task.taskType}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Dur: {task.estimatedDurationMins}m | Power Cut: {task.safetyRequirements?.powerOff ? 'Yes' : 'No'}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            task.defectSeverity >= 80 ? 'bg-rose-600' : task.defectSeverity >= 60 ? 'bg-amber-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${task.defectSeverity}%` }}
                        />
                      </div>
                      <span className="font-bold">{task.defectSeverity}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold">
                    <span className={task.overdueDays > 7 ? 'text-rose-700 font-bold' : 'text-slate-600'}>
                      {task.overdueDays} days
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            task.priorityScore >= 80 ? 'bg-rose-600' : task.priorityScore >= 60 ? 'bg-amber-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${task.priorityScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-extrabold text-slate-900">{task.priorityScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge score={task.priorityScore} band={task.priorityBand} size="sm" showScore={false} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1 rounded text-slate-400 group-hover:text-gov-navy group-hover:bg-blue-100 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Explainability Drawer */}
      <PriorityDrawer
        task={selectedTask}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};
