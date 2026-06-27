"use client";

import { useMQTT } from "@/components/MQTTProvider";
import { ToggleRight, ArrowRightCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function BottomPanel() {
  const { lastPayload, publishMessage } = useMQTT();
  const [showShiftAnim, setShowShiftAnim] = useState(false);
  const [prevShift, setPrevShift] = useState("");

  const k1 = lastPayload?.relayK1 || false;
  const k2 = lastPayload?.relayK2 || false;
  const k3 = lastPayload?.relayK3 || false;
  const k4 = lastPayload?.relayK4 || false;

  const handleRelayClick = (id: string, currentState: boolean) => {
    // Send a JSON command to toggle the relay
    const commandPayload = {
      command: "toggle_relay",
      relay: id,
      state: !currentState
    };
    publishMessage("gridsense/command", JSON.stringify(commandPayload));
  };

  const lastShift = lastPayload?.lastShift || "None";

  useEffect(() => {
    if (lastShift !== "None" && lastShift !== prevShift) {
      setShowShiftAnim(true);
      setPrevShift(lastShift);
      const t = setTimeout(() => setShowShiftAnim(false), 3000);
      return () => clearTimeout(t);
    }
  }, [lastShift, prevShift]);

  const RelayBox = ({ id, active }: { id: string, active: boolean }) => (
    <button 
      onClick={() => handleRelayClick(id, active)}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
      active ? 'bg-[var(--color-brand-neon-green)]/10 border-[var(--color-brand-neon-green)]/30 shadow-[0_0_15px_rgba(57,255,20,0.15)]' : 'bg-black/40 border-white/5 hover:bg-black/60 hover:border-white/20'
    }`}>
      <div className="flex flex-col text-left">
        <span className="text-xs text-gray-500 font-mono tracking-widest">{id}</span>
        <span className={`font-bold tracking-wider ${active ? 'text-[var(--color-brand-neon-green)]' : 'text-gray-500'}`}>
          {active ? 'ON' : 'OFF'}
        </span>
      </div>
      <ToggleRight size={24} className={`ml-auto ${active ? 'text-[var(--color-brand-neon-green)]' : 'text-gray-600'}`} />
    </button>
  );

  return (
    <div className="flex gap-4 shrink-0 h-[100px]">
      {/* Relays */}
      <div className="glass-panel rounded-xl p-4 flex-[2] flex justify-between items-center">
        <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-6 h-full">
          <div className="text-xs text-gray-400 font-semibold uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">
            Relay Status
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-4 gap-4">
          <RelayBox id="K1" active={k1} />
          <RelayBox id="K2" active={k2} />
          <RelayBox id="K3" active={k3} />
          <RelayBox id="K4" active={k4} />
        </div>
      </div>

      {/* Load Shift Panel */}
      <div className="glass-panel rounded-xl p-4 flex-1 flex flex-col justify-center relative overflow-hidden">
        <h2 className="text-xs text-gray-400 font-semibold uppercase tracking-widest absolute top-2 left-3">
          Load Shift Panel
        </h2>

        <div className="mt-4 flex items-center justify-between px-4 relative">
          <AnimatePresence>
            {showShiftAnim && (
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[var(--color-brand-electric-blue)]/20 z-0 rounded flex items-center justify-center border border-[var(--color-brand-electric-blue)]/50"
              >
                <div className="h-1 w-full max-w-[200px] bg-black/50 rounded-full overflow-hidden mx-auto">
                  <motion.div 
                    className="h-full bg-[var(--color-brand-electric-blue)]"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5 }}
                  />
                </div>
                <span className="absolute text-xs text-[var(--color-brand-electric-blue)] font-bold uppercase tracking-widest bg-[#0D1117] px-2">Switching...</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-4 w-full justify-center z-10">
            <span className="text-2xl font-black text-gray-300">{lastShift.split(' ')[0] || '-'}</span>
            <ArrowRightCircle size={24} className="text-[var(--color-brand-orange)]" />
            <span className="text-2xl font-black text-gray-300">{lastShift.split(' ')[2] || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
