"use client";

import { Header } from "@/components/Header";
import { LeftPanel } from "@/components/LeftPanel";
import { CenterPanel } from "@/components/CenterPanel";
import { RightPanel } from "@/components/RightPanel";
import { BottomPanel } from "@/components/BottomPanel";
import { LiveCharts } from "@/components/LiveCharts";
import { Footer } from "@/components/Footer";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen max-h-screen p-4 gap-4 overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
        
        {/* Left Panel */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <LeftPanel />
        </div>

        {/* Center Panel - Phase Monitors */}
        <div className="md:col-span-8 flex flex-col gap-4 min-h-0">
          <CenterPanel />
          <LiveCharts />
        </div>

        {/* Right Panel */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <RightPanel />
        </div>

      </div>

      {/* Bottom Control Panel */}
      <BottomPanel />

      {/* Footer */}
      <Footer />
    </div>
  );
}
