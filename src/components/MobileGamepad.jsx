// Mobile & Tablet Virtual Touch Gamepad (D-Pad & Arcade Action Buttons)

import React from 'react';

export const MobileGamepad = ({ onInputStateChange, charMoves }) => {
  const handleTouch = (action, isPressed) => (e) => {
    e.preventDefault();
    onInputStateChange(action, isPressed);
  };

  return (
    <div className="absolute bottom-3 inset-x-0 px-4 pointer-events-none z-30 flex items-end justify-between select-none">
      {/* Left: 4-Way D-Pad */}
      <div className="pointer-events-auto relative w-36 h-36 bg-slate-900/80 rounded-full border-2 border-slate-700 p-2 shadow-2xl backdrop-blur-sm">
        {/* Up (Jump) */}
        <button
          onTouchStart={handleTouch('up', true)}
          onTouchEnd={handleTouch('up', false)}
          onMouseDown={() => onInputStateChange('up', true)}
          onMouseUp={() => onInputStateChange('up', false)}
          className="absolute top-1.5 left-1/2 -translate-x-1/2 w-11 h-11 bg-slate-800 active:bg-yellow-500 rounded-t border-t-2 border-x border-slate-600 flex items-center justify-center text-xs font-bold text-slate-300"
        >
          ▲
        </button>

        {/* Down (Crouch/Guard) */}
        <button
          onTouchStart={handleTouch('down', true)}
          onTouchEnd={handleTouch('down', false)}
          onMouseDown={() => onInputStateChange('down', true)}
          onMouseUp={() => onInputStateChange('down', false)}
          className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-11 h-11 bg-slate-800 active:bg-yellow-500 rounded-b border-b-2 border-x border-slate-600 flex items-center justify-center text-xs font-bold text-slate-300"
        >
          ▼
        </button>

        {/* Left */}
        <button
          onTouchStart={handleTouch('left', true)}
          onTouchEnd={handleTouch('left', false)}
          onMouseDown={() => onInputStateChange('left', true)}
          onMouseUp={() => onInputStateChange('left', false)}
          className="absolute left-1.5 top-1/2 -translate-y-1/2 w-11 h-11 bg-slate-800 active:bg-yellow-500 rounded-l border-l-2 border-y border-slate-600 flex items-center justify-center text-xs font-bold text-slate-300"
        >
          ◀
        </button>

        {/* Right */}
        <button
          onTouchStart={handleTouch('right', true)}
          onTouchEnd={handleTouch('right', false)}
          onMouseDown={() => onInputStateChange('right', true)}
          onMouseUp={() => onInputStateChange('right', false)}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-11 h-11 bg-slate-800 active:bg-yellow-500 rounded-r border-r-2 border-y border-slate-600 flex items-center justify-center text-xs font-bold text-slate-300"
        >
          ▶
        </button>

        {/* Center Pivot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-slate-950 rounded-full border border-slate-700" />
      </div>

      {/* Right: Arcade Action Buttons Cluster */}
      <div className="pointer-events-auto flex flex-col gap-2">
        {/* Top row: Special 1 & Ultimate */}
        <div className="flex gap-3 justify-end">
          {/* Special Move 1 (Babi / Ethanol / Tray) */}
          <button
            onTouchStart={handleTouch('special1', true)}
            onTouchEnd={handleTouch('special1', false)}
            onMouseDown={() => onInputStateChange('special1', true)}
            onMouseUp={() => onInputStateChange('special1', false)}
            className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-600 active:scale-95 rounded-full border-2 border-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.5)] flex flex-col items-center justify-center text-black font-bold pixel-btn"
          >
            <span className="text-[9px] tracking-tighter">SP 1</span>
            <span className="text-[7px] leading-none opacity-85">{charMoves?.special1?.badge || 'SKILL'}</span>
          </button>

          {/* Ultimate (Semut / Oil / Megaphone) */}
          <button
            onTouchStart={handleTouch('ultimate', true)}
            onTouchEnd={handleTouch('ultimate', false)}
            onMouseDown={() => onInputStateChange('ultimate', true)}
            onMouseUp={() => onInputStateChange('ultimate', false)}
            className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-700 active:scale-95 rounded-full border-2 border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.7)] flex flex-col items-center justify-center text-white font-bold pixel-btn animate-pulse"
          >
            <span className="text-[9px] tracking-tighter">ULT</span>
            <span className="text-[7px] leading-none opacity-85">{charMoves?.ultimate?.badge || 'SUPER'}</span>
          </button>
        </div>

        {/* Bottom row: Punch & Kick */}
        <div className="flex gap-3 justify-end">
          {/* Punch */}
          <button
            onTouchStart={handleTouch('punch', true)}
            onTouchEnd={handleTouch('punch', false)}
            onMouseDown={() => onInputStateChange('punch', true)}
            onMouseUp={() => onInputStateChange('punch', false)}
            className="w-14 h-14 bg-gradient-to-br from-rose-600 to-red-700 active:scale-95 rounded-full border-2 border-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.5)] flex flex-col items-center justify-center text-white font-bold pixel-btn"
          >
            <span className="text-[10px]">PUNCH</span>
            <span className="text-[8px] opacity-75">(J)</span>
          </button>

          {/* Kick */}
          <button
            onTouchStart={handleTouch('kick', true)}
            onTouchEnd={handleTouch('kick', false)}
            onMouseDown={() => onInputStateChange('kick', true)}
            onMouseUp={() => onInputStateChange('kick', false)}
            className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-700 active:scale-95 rounded-full border-2 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.5)] flex flex-col items-center justify-center text-white font-bold pixel-btn"
          >
            <span className="text-[10px]">KICK</span>
            <span className="text-[8px] opacity-75">(K)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
