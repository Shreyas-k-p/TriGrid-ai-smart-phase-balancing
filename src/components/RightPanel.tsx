"use client";

import { useMQTT } from "@/components/MQTTProvider";
import { Brain, ArrowRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function RightPanel() {
  const { lastPayload } = useMQTT();
  
  const bestPhase = lastPayload?.bestPhase || "R";
  const reasonText = bestPhase === "R" ? "Higher Voltage & Lower Current" : "Higher Voltage & Stable Health";

  return (
    <div className="h-full flex flex-col gap-4">

      {/* AI Decision Card */}
      <div className="glass-panel rounded-xl p-4 flex-1 flex flex-col">
        <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-2 flex items-center gap-2">
          <Brain size={16} /> AI Decision
        </h2>

        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-black/40 rounded-lg p-3 border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand-electric-blue)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="text-xs text-gray-500 uppercase mb-1">Reason</p>
            <p className="text-sm font-medium text-[var(--color-brand-electric-blue)] flex items-center gap-2">
              <ArrowRight size={14} />
              {reasonText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
