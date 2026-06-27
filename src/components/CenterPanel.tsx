"use client";

import { useMQTT } from "@/components/MQTTProvider";
import { Activity, Zap } from "lucide-react";
import { motion } from "framer-motion";

const CircularGauge = ({ value, max, label, color, suffix }: { value: number, max: number, label: string, color: string, suffix: string }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDasharray = `${(percentage * 251.2) / 100} 251.2`;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
        <motion.circle 
          cx="50" cy="50" r="40" 
          stroke={color} 
          strokeWidth="8" 
          fill="none" 
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          initial={{ strokeDasharray: "0 251.2" }}
          animate={{ strokeDasharray }}
          transition={{ duration: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold" style={{ color }}>{value.toFixed(1)}</span>
        <span className="text-[10px] text-gray-500">{suffix}</span>
      </div>
      <div className="absolute -bottom-6 text-xs text-gray-400 font-semibold uppercase tracking-wider">{label}</div>
    </div>
  );
};

export function CenterPanel() {
  const { lastPayload } = useMQTT();

  const renderPhaseCard = (phase: "R" | "Y" | "B", voltage: number, current: number, health: number) => {
    const isR = phase === "R";
    const isY = phase === "Y";
    const color = isR ? "#ef4444" : isY ? "#facc15" : "#3b82f6"; // Red, Yellow, Blue
    const glowClass = isR ? "shadow-[0_0_15px_rgba(239,68,68,0.2)]" : isY ? "shadow-[0_0_15px_rgba(250,204,21,0.2)]" : "shadow-[0_0_15px_rgba(59,130,246,0.2)]";
    
    let statusText = "Healthy";
    let statusColor = "text-green-500";
    if (voltage < 10) { statusText = "Low Voltage"; statusColor = "text-yellow-500"; }
    else if (current > 1.5) { statusText = "Overloaded"; statusColor = "text-red-500"; }

    return (
      <div className={`glass-panel rounded-xl p-6 flex-1 flex flex-col relative overflow-hidden ${glowClass} border-t-2`} style={{ borderTopColor: color }}>
        {/* Background Phase Letter */}
        <div className="absolute -right-10 -bottom-10 text-[180px] font-black opacity-5 pointer-events-none" style={{ color }}>
          {phase}
        </div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black mb-1 flex items-center gap-2" style={{ color }}>
              <Zap size={24} /> {phase} PHASE
            </h2>
            <div className="flex items-center gap-2 text-sm font-semibold bg-black/30 px-3 py-1 rounded-full w-fit border border-white/5">
              <Activity size={14} className={statusColor} />
              <span className={statusColor}>{statusText}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Health Score</div>
            <div className="text-3xl font-mono text-white flex items-baseline justify-end gap-1">
              {health.toFixed(2)}
              <span className="text-sm text-gray-500">/ 10</span>
            </div>
            {/* Animated Health Bar */}
            <div className="w-24 h-1.5 bg-gray-800 rounded-full mt-2 overflow-hidden ml-auto">
              <motion.div 
                className="h-full" 
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${(health / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-around items-center mt-4">
          <CircularGauge value={voltage} max={15} label="Voltage" color={color} suffix="V" />
          <CircularGauge value={current} max={2} label="Current" color={color} suffix="A" />
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-4 h-full">
      {renderPhaseCard("R", lastPayload?.voltageR || 0, lastPayload?.currentR || 0, lastPayload?.healthR || 0)}
      {renderPhaseCard("Y", lastPayload?.voltageY || 0, lastPayload?.currentY || 0, lastPayload?.healthY || 0)}
      {renderPhaseCard("B", lastPayload?.voltageB || 0, lastPayload?.currentB || 0, lastPayload?.healthB || 0)}
    </div>
  );
}
