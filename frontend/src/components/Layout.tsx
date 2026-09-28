import React from 'react';
import { RoleSimulatorBar } from './RoleSimulatorBar';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. Top Prototype Role Simulator Bar */}
      <RoleSimulatorBar />

      {/* 2. Top Application Header */}
      <Navbar />

      {/* 3. Main Body Container (Sidebar + Content) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Left Sidebar */}
        <Sidebar />

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-8 max-w-5xl overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* 4. Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
