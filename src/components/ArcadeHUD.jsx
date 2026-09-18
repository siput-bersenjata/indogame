// Retro 16-Bit Arcade Heads-Up Display (HUD)

import React from 'react';
import { CHARACTERS } from '../game/characters/CharacterRegistry.js';

export const ArcadeHUD = ({
  f1,
  f2,
  timer,
  round,
  roundState,
  koReason,
  f1Combo,
  f2Combo
}) => {
  const char1 = CHARACTERS[f1.characterId] || CHARACTERS.gufron;
  const char2 = CHARACTERS[f2.characterId] || CHARACTERS.bahlil;

  const f1HealthPct = Math.max(0, Math.min(100, (f1.health / f1.maxHealth) * 100));
  const f2HealthPct = Math.max(0, Math.min(100, (f2.health / f2.maxHealth) * 100));

  const f1EnergyPct = Math.max(0, Math.min(100, f1.energy));
  const f2EnergyPct = Math.max(0, Math.min(100, f2.energy));

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-3 select-none">
      {/* Top HUD: Health Bars, Portraits, and Timer */}
      <div className="w-full flex items-start justify-between max-w-4xl mx-auto">
        {/* Player 1 HUD (Left) */}
        <div className="flex items-center gap-2 flex-1">
          {/* Portrait Box */}
          <div className="relative w-14 h-14 bg-slate-900 border-2 border-yellow-400 pixel-box shadow-md flex-shrink-0 overflow-hidden">
            <img
              src={char1.avatar}
              alt={char1.name}
              className="w-full h-full object-cover"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="absolute bottom-0 left-0 bg-blue-600 text-[8px] px-1 font-bold">1P</span>
          </div>

          {/* Name & Bars */}
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-yellow-300 font-bold tracking-wider uppercase arcade-glow-gold drop-shadow">
                {char1.name}
              </span>
              {/* Win Orbs */}
              <div className="flex gap-1">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full border border-black ${
                      i < f1.wins ? 'bg-yellow-400 shadow-[0_0_6px_#facc15]' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Health Bar (Fills left to right) */}
            <div className="w-full h-5 bg-slate-900 border-2 border-black relative overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-300 transition-all duration-100"
                style={{ width: `${f1HealthPct}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-start pl-2">
                <span className="text-[9px] font-bold text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                  {Math.ceil(f1.health)}
                </span>
              </div>
            </div>

            {/* Super Gauge Meter */}
            <div className="w-4/5 h-2 bg-slate-950 border border-black mt-1 relative overflow-hidden">
              <div
                className={`h-full transition-all duration-100 ${
                  f1EnergyPct >= 100
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse'
                    : 'bg-blue-600'
                }`}
                style={{ width: `${f1EnergyPct}%` }}
              />
              {f1EnergyPct >= 100 && (
                <span className="absolute inset-0 flex items-center justify-center text-[7px] text-white font-bold tracking-widest">
                  SUPER MAX
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center Round Timer */}
        <div className="flex flex-col items-center mx-4 flex-shrink-0">
          <div className="text-[9px] text-yellow-400 font-bold mb-0.5 tracking-wider">
            ROUND {round}
          </div>
          <div className="bg-slate-950 border-2 border-yellow-500 px-3 py-1 pixel-box flex items-center justify-center shadow-lg">
            <span className="text-2xl text-cyan-400 font-bold arcade-glow-cyan tracking-widest">
              {timer.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Player 2 / CPU HUD (Right) */}
        <div className="flex items-center gap-2 flex-1 flex-row-reverse">
          {/* Portrait Box */}
          <div className="relative w-14 h-14 bg-slate-900 border-2 border-red-500 pixel-box-red shadow-md flex-shrink-0 overflow-hidden">
            <img
              src={char2.avatar}
              alt={char2.name}
              className="w-full h-full object-cover scale-x-[-1]"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="absolute bottom-0 right-0 bg-red-600 text-[8px] px-1 font-bold">
              {f2.isBot ? 'CPU' : '2P'}
            </span>
          </div>

          {/* Name & Bars */}
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between mb-1 flex-row-reverse">
              <span className="text-xs text-red-400 font-bold tracking-wider uppercase drop-shadow">
                {char2.name}
              </span>
              {/* Win Orbs */}
              <div className="flex gap-1">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full border border-black ${
                      i < f2.wins ? 'bg-red-500 shadow-[0_0_6px_#ef4444]' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Health Bar (Fills right to left) */}
            <div className="w-full h-5 bg-slate-900 border-2 border-black relative overflow-hidden shadow-inner flex justify-end">
              <div
                className="h-full bg-gradient-to-l from-red-600 via-amber-500 to-yellow-300 transition-all duration-100"
                style={{ width: `${f2HealthPct}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-end pr-2">
                <span className="text-[9px] font-bold text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                  {Math.ceil(f2.health)}
                </span>
              </div>
            </div>

            {/* Super Gauge Meter */}
            <div className="w-4/5 h-2 bg-slate-950 border border-black mt-1 self-end relative overflow-hidden flex justify-end">
              <div
                className={`h-full transition-all duration-100 ${
                  f2EnergyPct >= 100
                    ? 'bg-gradient-to-l from-cyan-400 to-red-500 animate-pulse'
                    : 'bg-red-600'
                }`}
                style={{ width: `${f2EnergyPct}%` }}
              />
              {f2EnergyPct >= 100 && (
                <span className="absolute inset-0 flex items-center justify-center text-[7px] text-white font-bold tracking-widest">
                  SUPER MAX
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Floating Combo Display */}
      <div className="w-full flex justify-between px-6 pointer-events-none">
        {f1Combo > 1 && (
          <div className="text-xl text-yellow-300 font-bold arcade-glow-gold animate-bounce">
            {f1Combo} HITS!
          </div>
        )}
        {f2Combo > 1 && (
          <div className="text-xl text-red-400 font-bold arcade-glow-red animate-bounce ml-auto">
            {f2Combo} HITS!
          </div>
        )}
      </div>

      {/* Center Announcer Banners */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {roundState === 'START' && (
          <div className="flex flex-col items-center animate-pulse">
            <span className="text-3xl text-yellow-400 font-extrabold arcade-glow-gold mb-2 tracking-widest">
              ROUND {round}
            </span>
            <span className="text-4xl text-cyan-300 font-extrabold arcade-glow-cyan tracking-widest">
              FIGHT!
            </span>
          </div>
        )}

        {(roundState === 'KO' || roundState === 'TIMEOVER') && (
          <div className="flex flex-col items-center scale-110 transform transition-transform">
            <span className="text-4xl text-red-500 font-extrabold arcade-glow-red tracking-widest mb-2 animate-bounce">
              {koReason || 'K.O.!'}
            </span>
            <span className="text-lg text-yellow-300 font-bold arcade-glow-gold">
              {f1.health > f2.health ? `${char1.name} WINS!` : `${char2.name} WINS!`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
