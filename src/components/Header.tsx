"use client";

import { useMQTT } from "@/components/MQTTProvider";
import { Activity, Zap, Clock, Calendar, Download, Camera, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

export function Header() {
  const { status, lastPayload, history, updateConnection, brokerUrl, brokerUser } = useMQTT();
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [tempUrl, setTempUrl] = useState("");
  const [tempUser, setTempUser] = useState("");
  const [tempPass, setTempPass] = useState("");

  useEffect(() => {
    setTempUrl(brokerUrl);
    setTempUser(brokerUser);
  }, [brokerUrl, brokerUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString());
      setDateStr(now.toLocaleDateString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const displayTime = lastPayload?.time || timeStr;
  const displayDate = lastPayload?.date || dateStr;

  const exportCSV = () => {
    if (history.length === 0) {
      toast.error("No data to export");
      return;
    }
    const headers = Object.keys(history[0]).join(",");
    const rows = history.map(row => Object.values(row).join(",")).join("\n");
    const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gridsense_export_${new Date().getTime()}.csv`;
    a.click();
    toast.success("CSV Exported successfully");
  };

  const takeScreenshot = async () => {
    const el = document.body;
    try {
      toast.loading("Capturing screenshot...", { id: "screenshot" });
      const canvas = await html2canvas(el, { backgroundColor: "#0D1117" });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `gridsense_dashboard_${new Date().getTime()}.png`;
      a.click();
      toast.success("Screenshot saved", { id: "screenshot" });
    } catch (e) {
      toast.error("Failed to take screenshot", { id: "screenshot" });
    }
  };

  return (
    <header className="glass-panel rounded-xl p-4 flex items-center justify-between z-50">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[var(--color-brand-neon-green)]/10 flex items-center justify-center border border-[var(--color-brand-neon-green)]/30">
          <Zap className="text-[var(--color-brand-neon-green)] animate-pulse" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-white">GRIDSENSE <span className="neon-text-green">AI</span></h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Balancing the Grid, Empowering Renewable Energy.</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        
        {/* Bonus Tools */}
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="p-2 bg-black/40 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white" title="Export CSV">
            <Download size={18} />
          </button>
          <button onClick={takeScreenshot} className="p-2 bg-black/40 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white" title="Take Screenshot">
            <Camera size={18} />
          </button>
        </div>

        <div className="flex flex-col items-end border-l border-white/10 pl-6">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[var(--color-brand-electric-blue)]" />
            <span className="text-xl font-mono">{displayTime}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Calendar size={14} />
            <span>{displayDate}</span>
          </div>
        </div>

        <div 
          onClick={() => setShowSettings(true)}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg bg-black/40 border border-white/5 ml-2 cursor-pointer hover:bg-white/5 transition-colors`}
          title="Click to configure MQTT connection"
        >
          <div className={`w-3 h-3 rounded-full ${status === 'Connected' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
          <span className={`font-semibold uppercase tracking-wider text-sm ${status === 'Connected' ? 'text-green-500' : 'text-red-500'}`}>
            {status}
          </span>
          {status === 'Connected' ? <Activity size={18} className="text-green-500 animate-pulse" /> : <Settings size={18} className="text-gray-400 hover:rotate-90 transition-transform" />}
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-xl w-[400px] border border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Settings size={20}/> MQTT Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Broker URL (WSS/WS)</label>
                <input type="text" value={tempUrl} onChange={e => setTempUrl(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm text-white" placeholder="wss://broker.emqx.io:8084/mqtt" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Username</label>
                <input type="text" value={tempUser} onChange={e => setTempUser(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Password</label>
                <input type="password" value={tempPass} onChange={e => setTempPass(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm text-white" />
              </div>
            </div>

            <div className="flex gap-2 mt-6 justify-end">
              <button onClick={() => setShowSettings(false)} className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 transition-colors text-sm">Cancel</button>
              <button onClick={() => { updateConnection(tempUrl, tempUser, tempPass); setShowSettings(false); }} className="px-4 py-2 rounded bg-[var(--color-brand-electric-blue)] text-black font-bold hover:brightness-110 transition-all text-sm">Save & Connect</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
