import React from 'react';
import { RoleSimulatorBar } from './RoleSimulatorBar';
import { Navbar } from './Navbar';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Simulator Bar */}
      <RoleSimulatorBar />

      {/* Center Frame Container */}
      <div className="flex-1 flex justify-center items-start w-full sm:py-4 px-0 sm:px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="w-full sm:max-w-md bg-slate-900 sm:rounded-3xl sm:border sm:border-slate-800 sm:shadow-2xl flex flex-col min-h-screen sm:min-h-[840px] sm:max-h-[920px] overflow-hidden relative">
          
          {/* Header Navbar */}
          <Navbar />

          {/* Main Viewport Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-20 sm:pb-8 flex flex-col">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
