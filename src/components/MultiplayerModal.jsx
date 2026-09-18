// Real-time WebRTC Multiplayer Lobby & Room Code Modal

import React, { useState } from 'react';
import { Wifi, Copy, Check, X, ArrowRight, Loader2 } from 'lucide-react';

export const MultiplayerModal = ({
  isOpen,
  onClose,
  networkState,
  onCreateRoom,
  onJoinRoom,
  onStartOnlineMatch
}) => {
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (networkState.roomCode) {
      navigator.clipboard.writeText(networkState.roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (joinCodeInput.trim().length === 4) {
      onJoinRoom(joinCodeInput.trim().toUpperCase());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-cyan-500 pixel-box w-full max-w-md p-5 text-white relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Wifi className="text-cyan-400" size={20} />
          <h2 className="text-sm font-bold text-cyan-400 arcade-glow-cyan tracking-widest uppercase">
            ONLINE MULTIPLAYER P2P
          </h2>
        </div>

        {/* Network Status Badge */}
        <div className="flex items-center justify-between bg-slate-950 px-3 py-2 border border-slate-800 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                networkState.status === 'CONNECTED'
                  ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                  : networkState.status === 'CONNECTING' || networkState.status === 'WAITING'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-red-500'
              }`}
            />
            <span className="text-[10px] text-slate-300 font-bold">
              STATUS: {networkState.status}
            </span>
          </div>
          {networkState.ping > 0 && (
            <span className="text-[9px] text-emerald-400 font-mono">
              PING: {networkState.ping}ms
            </span>
          )}
        </div>

        {/* Error message */}
        {networkState.error && (
          <div className="bg-red-950/70 border border-red-500 p-2 mb-4 text-[9px] text-red-300 font-bold">
            ⚠ {networkState.error}
          </div>
        )}

        {/* Host Room or Join Room Section */}
        {networkState.status === 'DISCONNECTED' || networkState.status === 'ERROR' ? (
          <div className="space-y-4">
            {/* Host Section */}
            <div className="bg-slate-950 p-4 border border-slate-800">
              <div className="text-[10px] text-yellow-400 font-bold mb-2 uppercase">
                1. BUAT RUANG (HOST)
              </div>
              <p className="text-[9px] text-slate-400 mb-3 leading-relaxed">
                Buat ruangan online dan bagikan 4 digit kode ke teman Anda di HP atau PC lain.
              </p>
              <button
                onClick={onCreateRoom}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 text-[10px] pixel-btn tracking-wider uppercase"
              >
                BUAT RUANGAN BARU
              </button>
            </div>

            {/* Join Section */}
            <div className="bg-slate-950 p-4 border border-slate-800">
              <div className="text-[10px] text-cyan-400 font-bold mb-2 uppercase">
                2. GABUNG RUANG (JOIN)
              </div>
              <form onSubmit={handleJoin} className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  placeholder="KODE"
                  className="w-28 bg-slate-900 border border-slate-700 px-3 py-1.5 text-sm text-center text-cyan-300 font-bold tracking-widest font-mono focus:border-cyan-400 focus:outline-none uppercase"
                />
                <button
                  type="submit"
                  disabled={joinCodeInput.length !== 4}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold py-1.5 text-[10px] pixel-btn flex items-center justify-center gap-1 uppercase tracking-wider"
                >
                  GABUNG <ArrowRight size={14} />
                </button>
              </form>
            </div>
          </div>
        ) : networkState.status === 'WAITING' ? (
          /* Host Waiting for Peer */
          <div className="bg-slate-950 p-5 border border-yellow-500/50 text-center">
            <div className="text-[10px] text-slate-400 mb-2">KODE RUANGAN ANDA:</div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="text-3xl font-extrabold text-yellow-400 arcade-glow-gold tracking-widest font-mono bg-slate-900 px-4 py-2 border border-yellow-500">
                {networkState.roomCode}
              </div>
              <button
                onClick={handleCopy}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white pixel-btn"
                title="Salin Kode"
              >
                {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-yellow-300 animate-pulse">
              <Loader2 size={14} className="animate-spin" />
              <span className="text-[9px]">MENUNGGU LAWAN BERGABUNG...</span>
            </div>
          </div>
        ) : networkState.status === 'CONNECTING' ? (
          /* Connecting to Host */
          <div className="bg-slate-950 p-6 border border-cyan-500/50 text-center">
            <Loader2 size={24} className="animate-spin text-cyan-400 mx-auto mb-3" />
            <div className="text-xs text-cyan-300 font-bold tracking-wider">
              MENGHUBUNGKAN KE ROOM: {networkState.roomCode}...
            </div>
          </div>
        ) : (
          /* CONNECTED! */
          <div className="bg-slate-950 p-5 border border-emerald-500/60 text-center">
            <div className="text-sm font-bold text-emerald-400 mb-1">
              ✓ TERHUBUNG DENGAN LAWAN!
            </div>
            <div className="text-[9px] text-slate-400 mb-4">
              Koneksi Peer-to-Peer ultra-low latency WebRTC aktif.
            </div>
            <button
              onClick={onStartOnlineMatch}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-2.5 text-xs pixel-btn uppercase tracking-widest"
            >
              MULAI PERTANDINGAN!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
