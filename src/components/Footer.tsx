"use client";

import { useMQTT } from "@/components/MQTTProvider";
import { Network, Activity, HardDrive } from "lucide-react";

export function Footer() {
  const { status, packetsReceived, topic } = useMQTT();

  return (
    <footer className="glass-panel rounded-xl p-3 flex items-center justify-between text-xs text-gray-400 font-mono">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Network size={14} className="text-[var(--color-brand-electric-blue)]" />
          <span>Topic: <span className="text-white">{topic}</span></span>
        </div>
        <div className="w-px h-4 bg-gray-700"></div>
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[var(--color-brand-neon-green)]" />
          <span>Packets: <span className="text-white">{packetsReceived.toLocaleString()}</span></span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <HardDrive size={14} />
          <span>Broker: <span className="text-white">EMQX Cloud WSS</span></span>
        </div>
        <div className="w-px h-4 bg-gray-700"></div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status === 'Connected' ? 'bg-[var(--color-brand-neon-green)]' : 'bg-red-500'}`}></div>
          <span>ESP32 {status}</span>
        </div>
      </div>
    </footer>
  );
}
