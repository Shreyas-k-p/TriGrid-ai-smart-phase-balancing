"use client";

import { useMQTT } from "@/components/MQTTProvider";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Activity } from "lucide-react";

export function LiveCharts() {
  const { history } = useMQTT();

  // We want to format history for Recharts
  const data = history.map(item => ({
    time: item.time,
    voltageR: item.voltageR,
    voltageY: item.voltageY,
    voltageB: item.voltageB,
    currentR: item.currentR,
    currentY: item.currentY,
    currentB: item.currentB,
  }));

  return (
    <div className="glass-panel rounded-xl p-4 flex-1 flex flex-col min-h-0">
      <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-4 flex items-center gap-2 shrink-0">
        <Activity size={16} /> Live Realtime Telemetry
      </h2>
      
      <div className="flex-1 flex gap-4 min-h-0">
        
        {/* Voltage Chart */}
        <div className="flex-1 flex flex-col min-h-0 bg-black/20 rounded-lg p-2 border border-white/5 relative">
           <h3 className="text-[10px] text-gray-500 uppercase tracking-widest absolute top-2 left-2 z-10">Voltage (V)</h3>
           <div className="flex-1 min-h-0 pt-4 mt-2">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={data}>
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                 <XAxis dataKey="time" hide />
                 <YAxis domain={['auto', 'auto']} width={30} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#000', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} 
                   itemStyle={{ fontSize: 12 }}
                   labelStyle={{ fontSize: 12, color: '#aaa', marginBottom: 4 }}
                 />
                 <Line type="monotone" dataKey="voltageR" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} name="R Phase" />
                 <Line type="monotone" dataKey="voltageY" stroke="#facc15" strokeWidth={2} dot={false} isAnimationActive={false} name="Y Phase" />
                 <Line type="monotone" dataKey="voltageB" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} name="B Phase" />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Current Chart */}
        <div className="flex-1 flex flex-col min-h-0 bg-black/20 rounded-lg p-2 border border-white/5 relative">
           <h3 className="text-[10px] text-gray-500 uppercase tracking-widest absolute top-2 left-2 z-10">Current (A)</h3>
           <div className="flex-1 min-h-0 pt-4 mt-2">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={data}>
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                 <XAxis dataKey="time" hide />
                 <YAxis domain={[0, 'auto']} width={30} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#000', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} 
                   itemStyle={{ fontSize: 12 }}
                   labelStyle={{ fontSize: 12, color: '#aaa', marginBottom: 4 }}
                 />
                 <Line type="monotone" dataKey="currentR" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} name="R Phase" />
                 <Line type="monotone" dataKey="currentY" stroke="#facc15" strokeWidth={2} dot={false} isAnimationActive={false} name="Y Phase" />
                 <Line type="monotone" dataKey="currentB" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} name="B Phase" />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>

      </div>
    </div>
  );
}
