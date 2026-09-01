// src/context/AppStateContext.jsx
import React, { createContext, useContext, useState, useMemo } from 'react';
import { initialWeeklyBlocks } from '../mockData/blocks';
import { controlRoomKpis } from '../mockData/kpis';

const AppStateContext = createContext(null);

export const AppStateProvider = ({ children }) => {
  const [blocks, setBlocks] = useState(initialWeeklyBlocks);
  const [demoStep, setDemoStep] = useState(1);
  const [selectedCorridor, setSelectedCorridor] = useState('NDLS-CNB');
  const [auditLogs, setAuditLogs] = useState([
    {
      id: "LOG-101",
      blockId: "BLK-0043",
      action: "APPROVED",
      reviewer: "Chief Controller / Ops (HQ)",
      timestamp: "2026-09-01 18:20 IST",
      remarks: "Night slot verified against Steel Freight Rake. Approved for execution."
    },
    {
      id: "LOG-102",
      blockId: "BLK-0046",
      action: "APPROVED",
      reviewer: "Divisional Ops Controller (SBC)",
      timestamp: "2026-09-01 16:45 IST",
      remarks: "Thermal rail de-stressing clearance granted."
    },
    {
      id: "LOG-103",
      blockId: "BLK-0048",
      action: "APPROVED",
      reviewer: "Chief Controller / Ops (HQ)",
      timestamp: "2026-09-01 19:10 IST",
      remarks: "CSM tamping block approved for Grand Chord section."
    }
  ]);

  // Update block status (Approve, Reject, Request Revision)
  const updateBlockStatus = (blockId, status, reviewer = "Authorized Duty Controller", remarks = "") => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + " IST";
    
    setBlocks(prev =>
      prev.map(b => (b.blockId === blockId ? { ...b, status, reviewedBy: reviewer, reviewTimestamp: timestamp } : b))
    );

    setAuditLogs(prev => [
      {
        id: `LOG-${Date.now()}`,
        blockId,
        action: status.toUpperCase(),
        reviewer,
        timestamp,
        remarks: remarks || `Block status changed to ${status}`
      },
      ...prev
    ]);
  };

  // Dynamically calculate KPIs based on current state
  const dynamicKpis = useMemo(() => {
    const pending = blocks.filter(b => b.status === 'Pending Approval').length;
    const approved = blocks.filter(b => b.status === 'Approved').length;
    const rejected = blocks.filter(b => b.status === 'Rejected').length;
    const approvedHours = blocks
      .filter(b => b.status === 'Approved')
      .reduce((acc, curr) => acc + (curr.durationMins / 60), 0);

    return {
      ...controlRoomKpis,
      plannedBlocksWeek: blocks.length,
      pendingApprovalCount: pending,
      approvedCount: approved,
      rejectedCount: rejected,
      approvedHours: Number(approvedHours.toFixed(1))
    };
  }, [blocks]);

  const resetAllState = () => {
    setBlocks(initialWeeklyBlocks);
    setDemoStep(1);
  };

  return (
    <AppStateContext.Provider
      value={{
        blocks,
        updateBlockStatus,
        kpis: dynamicKpis,
        demoStep,
        setDemoStep,
        selectedCorridor,
        setSelectedCorridor,
        auditLogs,
        resetAllState
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
