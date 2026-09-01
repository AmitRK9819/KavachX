// src/components/layout/AppLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { FooterDisclaimer } from './FooterDisclaimer';

export const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] text-slate-800 font-sans">
      {/* Official Topbar Masthead */}
      <Topbar />

      {/* Main Content Area with Sidebar */}
      <div className="flex-1 flex flex-row overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F7F9FB]">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sticky Sitewide Disclaimer Strip */}
      <FooterDisclaimer />
    </div>
  );
};
