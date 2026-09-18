// Player Profile & Statistics Modal

import React, { useState } from 'react';
import { Trophy, Swords, Flame, X, User, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../services/StorageService.js';
import { CHARACTERS } from '../game/characters/CharacterRegistry.js';

export const ProfileModal = ({ isOpen, onClose, profile, onUpdateProfile }) => {
  const [emailInput, setEmailInput] = useState(profile?.email || '');
  const [usernameInput, setUsernameInput] = useState(profile?.username || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    const updated = StorageService.login(emailInput, usernameInput);
    onUpdateProfile(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const favChar = CHARACTERS[profile?.stats?.favoriteCharacter] || CHARACTERS.gufron;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-yellow-500 pixel-box-gold w-full max-w-md p-5 text-white relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <User className="text-yellow-400" size={20} />
          <h2 className="text-sm font-bold text-yellow-400 arcade-glow-gold tracking-widest uppercase">
            PROFIL PENDEKAR
          </h2>
        </div>

        {/* Login / Identity Form */}
        <form onSubmit={handleSave} className="bg-slate-950 p-3 border border-slate-700 mb-4 text-xs">
          <label className="block text-[10px] text-slate-400 mb-1">EMAIL LOGIN:</label>
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="nama@email.com"
            className="w-full bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs text-yellow-300 font-mono mb-2 focus:border-yellow-400 focus:outline-none"
            required
          />

          <label className="block text-[10px] text-slate-400 mb-1">NICKNAME:</label>
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="Ksatria Garuda"
            className="w-full bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs text-yellow-300 font-mono mb-3 focus:border-yellow-400 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-1.5 text-[10px] pixel-btn flex items-center justify-center gap-1 uppercase tracking-wider"
          >
            {isSaved ? <CheckCircle2 size={14} className="text-black" /> : null}
            {isSaved ? 'TERSIPMAN!' : 'SIMPAN PROFIL'}
          </button>
        </form>

        {/* Player Statistics */}
        <div className="text-[10px] text-slate-400 mb-2 uppercase font-bold tracking-wider">
          STATISTIK PERTARUNGAN:
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="bg-slate-950 p-2 border border-slate-800 flex items-center gap-2">
            <Trophy size={16} className="text-yellow-400" />
            <div>
              <div className="text-[9px] text-slate-400">MENANG</div>
              <div className="text-sm font-bold text-yellow-300">{profile?.stats?.wins || 0}</div>
            </div>
          </div>

          <div className="bg-slate-950 p-2 border border-slate-800 flex items-center gap-2">
            <Swords size={16} className="text-red-400" />
            <div>
              <div className="text-[9px] text-slate-400">KALAH</div>
              <div className="text-sm font-bold text-red-400">{profile?.stats?.losses || 0}</div>
            </div>
          </div>

          <div className="bg-slate-950 p-2 border border-slate-800 flex items-center gap-2">
            <Flame size={16} className="text-cyan-400" />
            <div>
              <div className="text-[9px] text-slate-400">WIN RATE</div>
              <div className="text-sm font-bold text-cyan-400">{profile?.stats?.winRate || 0}%</div>
            </div>
          </div>

          <div className="bg-slate-950 p-2 border border-slate-800 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full overflow-hidden border border-yellow-400 flex-shrink-0">
              <img src={favChar.avatar} alt="fav" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[9px] text-slate-400">FAVORIT</div>
              <div className="text-[10px] font-bold text-yellow-300 truncate max-w-[90px]">{favChar.name}</div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold py-2 pixel-box uppercase tracking-wider"
        >
          KEMBALI KE GAME
        </button>
      </div>
    </div>
  );
};
