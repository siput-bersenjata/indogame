// 16-Bit Arcade Character, Stage, and Difficulty Selection Screen

import React, { useState } from 'react';
import { CHARACTER_LIST } from '../game/characters/CharacterRegistry.js';
import { ARENAS } from '../game/arenas/ArenaManager.js';
import { Swords, Bot, Wifi, Volume2, VolumeX, User, Sparkles } from 'lucide-react';
import { SoundEngine } from '../game/audio/SoundEngine.js';

export const CharacterSelect = ({
  p1Char,
  setP1Char,
  p2Char,
  setP2Char,
  selectedArena,
  setSelectedArena,
  gameMode,
  setGameMode,
  aiDifficulty,
  setAiDifficulty,
  onStartBattle,
  onOpenMultiplayer,
  onOpenProfile,
  isMuted,
  onToggleMute
}) => {
  const [activeTab, setActiveTab] = useState('p1'); // 'p1' or 'p2'

  const handleSelectChar = (charId) => {
    SoundEngine.playSelect();
    if (activeTab === 'p1') {
      setP1Char(charId);
      if (gameMode === 'BOT') {
        // Auto pick different opponent
        const others = CHARACTER_LIST.filter(c => c.id !== charId);
        setP2Char(others[0].id);
      }
    } else {
      setP2Char(charId);
    }
  };

  const handleSelectArena = (arenaId) => {
    SoundEngine.playSelect();
    setSelectedArena(arenaId);
  };

  const currentChar = CHARACTER_LIST.find(c => c.id === (activeTab === 'p1' ? p1Char : p2Char)) || CHARACTER_LIST[0];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 bg-slate-950 text-white overflow-y-auto">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-yellow-400 arcade-glow-gold tracking-widest uppercase">
            INDOGAME 16-BIT
          </h1>
          <p className="text-[9px] text-slate-400 tracking-wider">
            ARCADE CLASH OF THE NUSANTARA TITANS
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-2 bg-slate-900 border border-slate-700 hover:border-yellow-400 text-yellow-400 pixel-btn"
            title="Toggle Audio"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Profile Modal Trigger */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-yellow-400 text-yellow-400 text-[10px] font-bold pixel-btn"
          >
            <User size={14} />
            <span>PROFIL</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Character Selection & Preview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-auto py-2">
        {/* Left Column: Character Cards List */}
        <div className="md:col-span-6 flex flex-col gap-3">
          {/* P1 / P2 Switcher */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('p1')}
              className={`flex-1 py-1.5 text-[10px] font-bold border-2 pixel-btn uppercase ${
                activeTab === 'p1'
                  ? 'bg-yellow-500 text-black border-yellow-300'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              1P: {CHARACTER_LIST.find(c => c.id === p1Char)?.name}
            </button>
            <button
              onClick={() => setActiveTab('p2')}
              className={`flex-1 py-1.5 text-[10px] font-bold border-2 pixel-btn uppercase ${
                activeTab === 'p2'
                  ? 'bg-red-500 text-white border-red-300'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              {gameMode === 'BOT' ? 'CPU' : '2P'}: {CHARACTER_LIST.find(c => c.id === p2Char)?.name}
            </button>
          </div>

          {/* Character Options */}
          <div className="grid grid-cols-3 gap-2">
            {CHARACTER_LIST.map((char) => {
              const isSelected = (activeTab === 'p1' ? p1Char : p2Char) === char.id;
              return (
                <button
                  key={char.id}
                  onClick={() => handleSelectChar(char.id)}
                  className={`relative p-2 bg-slate-900 border-2 pixel-btn flex flex-col items-center transition-all ${
                    isSelected
                      ? activeTab === 'p1'
                        ? 'border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.6)]'
                        : 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]'
                      : 'border-slate-800 hover:border-slate-600 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="w-16 h-16 bg-slate-950 border border-slate-700 overflow-hidden mb-1.5">
                    <img
                      src={char.avatar}
                      alt={char.name}
                      className="w-full h-full object-cover"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                  <span className="text-[9px] font-bold text-slate-200 tracking-tighter truncate w-full text-center">
                    {char.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Arena Stage Selection */}
          <div className="mt-2">
            <label className="block text-[9px] text-slate-400 font-bold mb-1 uppercase tracking-wider">
              PILIH ARENA PERTARUNGAN:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(ARENAS).map((arena) => (
                <button
                  key={arena.id}
                  onClick={() => handleSelectArena(arena.id)}
                  className={`p-1.5 bg-slate-900 border-2 pixel-btn text-left overflow-hidden ${
                    selectedArena === arena.id
                      ? 'border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="h-10 w-full mb-1 overflow-hidden border border-slate-800">
                    <img
                      src={arena.imageSrc}
                      alt={arena.name}
                      className="w-full h-full object-cover"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                  <div className="text-[8px] font-bold text-yellow-300 truncate">
                    {arena.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Fighter Spotlight & Signature Moves */}
        <div className="md:col-span-6 bg-slate-900/90 border-2 border-slate-700 pixel-box p-4 flex flex-col justify-between">
          <div>
            {/* Fighter Title & Name */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div>
                <span className="text-[8px] text-cyan-400 font-bold tracking-widest uppercase">
                  {currentChar.title}
                </span>
                <h2 className="text-base font-extrabold text-yellow-400 arcade-glow-gold tracking-wider">
                  {currentChar.name}
                </h2>
              </div>
              <span className="text-[9px] px-2 py-0.5 bg-slate-800 border border-slate-600 text-slate-300 font-bold">
                {activeTab === 'p1' ? 'PLAYER 1' : gameMode === 'BOT' ? 'CPU BOT' : 'PLAYER 2'}
              </span>
            </div>

            {/* Signature Moves Breakdown */}
            <div className="space-y-2 mb-4">
              <div className="bg-slate-950 p-2 border-l-4 border-amber-500">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[9px] text-amber-400 font-bold uppercase flex items-center gap-1">
                    <Sparkles size={11} /> JURUS 1: {currentChar.moves.special1.name}
                  </span>
                  <span className="text-[8px] text-slate-400">TOMBOL (U)</span>
                </div>
                <p className="text-[8px] text-slate-300 leading-relaxed">
                  {currentChar.moves.special1.desc}
                </p>
              </div>

              <div className="bg-slate-950 p-2 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[9px] text-purple-400 font-bold uppercase flex items-center gap-1">
                    ⚡ ULTIMATE: {currentChar.moves.ultimate.name}
                  </span>
                  <span className="text-[8px] text-slate-400">TOMBOL (I)</span>
                </div>
                <p className="text-[8px] text-slate-300 leading-relaxed">
                  {currentChar.moves.ultimate.desc}
                </p>
              </div>
            </div>

            {/* Keyboard Controls Legend */}
            <div className="bg-slate-950/80 p-2 border border-slate-800 text-[8px] text-slate-400">
              <span className="text-yellow-400 font-bold">KONTROL KEYBOARD:</span> WASD / Panah (Gerak/Lompat/Jongkok), J (Pukul), K (Tendang), U (Jurus 1), I (Ultimate).
            </div>
          </div>

          {/* Mode & Difficulty Selector */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setGameMode('BOT')}
                className={`flex-1 py-1.5 text-[9px] font-bold border pixel-btn flex items-center justify-center gap-1 uppercase ${
                  gameMode === 'BOT'
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <Bot size={13} /> VS BOT
              </button>

              <button
                onClick={() => {
                  setGameMode('ONLINE');
                  onOpenMultiplayer();
                }}
                className={`flex-1 py-1.5 text-[9px] font-bold border pixel-btn flex items-center justify-center gap-1 uppercase ${
                  gameMode === 'ONLINE'
                    ? 'bg-cyan-600 border-cyan-400 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <Wifi size={13} /> ONLINE P2P
              </button>
            </div>

            {/* Difficulty Pills (for VS BOT) */}
            {gameMode === 'BOT' && (
              <div className="flex items-center justify-between gap-1 mb-3">
                <span className="text-[8px] text-slate-400 font-bold">DIFFICULTY:</span>
                {['EASY', 'MEDIUM', 'HARD', 'EXPERT'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setAiDifficulty(level)}
                    className={`px-2 py-1 text-[8px] font-bold border pixel-btn ${
                      aiDifficulty === level
                        ? 'bg-yellow-500 border-yellow-300 text-black'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            )}

            {/* START BATTLE BUTTON */}
            <button
              onClick={onStartBattle}
              className="w-full bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 hover:brightness-110 text-black font-extrabold py-3 text-xs tracking-widest pixel-btn uppercase shadow-[0_0_15px_rgba(234,179,8,0.5)] flex items-center justify-center gap-2"
            >
              <Swords size={18} /> MULAI BERTARUNG!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
