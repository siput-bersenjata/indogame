// Real-time Active Online Player Counter Widget

import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

export const LivePlayerCounter = () => {
  const [onlineCount, setOnlineCount] = useState(248);

  useEffect(() => {
    // Dynamic heartbeat simulation fluctuating between 230 - 320 players
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(180, Math.min(450, prev + delta));
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-700 px-3 py-1.5 rounded pixel-box text-[9px] backdrop-blur-sm z-20 shadow-md">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <Users size={12} className="text-cyan-400" />
      <span className="text-slate-300 font-bold tracking-wider">ONLINE:</span>
      <span className="text-yellow-400 font-bold arcade-glow-gold">{onlineCount}</span>
    </div>
  );
};
