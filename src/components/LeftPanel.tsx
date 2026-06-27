"use client";

import { useMQTT } from "@/components/MQTTProvider";
import { Server, Cpu, ShieldAlert, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export function LeftPanel() {
  const { lastPayload } = useMQTT();
  
  const status = lastPayload?.systemStatus || "Stopped";
  const isRunning = status === "Running";
  const isSwitching = status === "Switching";
  const isFault = status === "Fault";

  return (
    <div className="h-full flex flex-col gap-4">
      {/* System Status Card */}
      <div className="glass-panel rounded-xl p-4 flex-1 flex flex-col">
        <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
          <Server size={16} /> System Status
        </h2>
        
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
              isRunning ? 'bg-[var(--color-brand-neon-green)]/20 shadow-[0_0_30px_#39ff14_inset]' : 
              isFault ? 'bg-red-500/20 shadow-[0_0_30px_#ef4444_inset]' : 
              isSwitching ? 'bg-[var(--color-brand-orange)]/20 shadow-[0_0_30px_#ff6a00_inset]' :
              'bg-gray-500/20 shadow-[0_0_30px_#6b7280_inset]'
            }`}
          >
            {isRunning && <CheckCircle size={40} className="text-[var(--color-brand-neon-green)]" />}
            {isFault && <ShieldAlert size={40} className="text-red-500" />}
            {!isRunning && !isFault && <Server size={40} className="text-gray-400" />}
          </motion.div>
          
          <h3 className={`text-2xl font-bold uppercase tracking-wider ${
            isRunning ? 'neon-text-green' : isFault ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : isSwitching ? 'text-[var(--color-brand-orange)]' : 'text-gray-400'
          }`}>
            {status}
          </h3>
        </div>
      </div>

    </div>
  );
}
