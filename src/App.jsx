// Main Application Orchestrator for IndoGame

import React, { useState, useEffect, useRef } from 'react';
import { CharacterSelect } from './components/CharacterSelect.jsx';
import { ArcadeHUD } from './components/ArcadeHUD.jsx';
import { MobileGamepad } from './components/MobileGamepad.jsx';
import { LivePlayerCounter } from './components/LivePlayerCounter.jsx';
import { ProfileModal } from './components/ProfileModal.jsx';
import { MultiplayerModal } from './components/MultiplayerModal.jsx';

import { Fighter } from './game/engine/Fighter.js';
import { CombatEngine } from './game/engine/CombatEngine.js';
import { ParticleSystem } from './game/engine/ParticleSystem.js';
import { ArenaManager } from './game/arenas/ArenaManager.js';
import { BotAI } from './game/ai/BotAI.js';
import { SoundEngine } from './game/audio/SoundEngine.js';
import { BgmEngine } from './game/audio/BgmEngine.js';
import { PeerManager } from './game/network/PeerManager.js';
import { StorageService } from './services/StorageService.js';
import { CHARACTERS } from './game/characters/CharacterRegistry.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './game/engine/Constants.js';

import { ArrowLeft, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const App = () => {
  // Screen States
  const [view, setView] = useState('SELECT'); // 'SELECT', 'BATTLE'
  const [p1Char, setP1Char] = useState('gufron');
  const [p2Char, setP2Char] = useState('bahlil');
  const [selectedArena, setSelectedArena] = useState('ikn');
  const [gameMode, setGameMode] = useState('BOT'); // 'BOT', 'ONLINE'
  const [aiDifficulty, setAiDifficulty] = useState('MEDIUM');

  // Modals & Sound
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMultiplayerOpen, setIsMultiplayerOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [profile, setProfile] = useState(StorageService.getProfile());

  // Multiplayer Peer State
  const [networkState, setNetworkState] = useState({
    status: 'DISCONNECTED',
    isHost: false,
    roomCode: null,
    ping: 0,
    error: null
  });

  // Canvas and Engine References
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const p1Ref = useRef(null);
  const p2Ref = useRef(null);
  const arenaManagerRef = useRef(null);
  const particlesRef = useRef(null);
  const botAiRef = useRef(null);
  const peerManagerRef = useRef(null);
  const animationFrameId = useRef(null);

  // HUD Reactive State (Reflects 60fps canvas engine into UI)
  const [hudData, setHudData] = useState({
    f1Health: 100,
    f2Health: 100,
    f1Energy: 0,
    f2Energy: 0,
    f1Wins: 0,
    f2Wins: 0,
    timer: 99,
    round: 1,
    roundState: 'START',
    koReason: 'K.O.!',
    f1Combo: 0,
    f2Combo: 0
  });

  // Match Finished Modal State
  const [matchResult, setMatchResult] = useState(null);

  // Controller Inputs
  const p1Inputs = useRef({
    left: false, right: false, up: false, down: false,
    punch: false, kick: false, special1: false, ultimate: false
  });
  const p2Inputs = useRef({
    left: false, right: false, up: false, down: false,
    punch: false, kick: false, special1: false, ultimate: false
  });

  // Initialize PeerJS Network Manager
  useEffect(() => {
    peerManagerRef.current = new PeerManager(
      (statusObj) => {
        setNetworkState(statusObj);
      },
      (data) => {
        // Handle incoming data packet
        if (data.type === 'INPUT') {
          p2Inputs.current = data.inputs;
        } else if (data.type === 'MATCH_START') {
          setP1Char(data.p1Char);
          setP2Char(data.p2Char);
          setSelectedArena(data.arena);
          setIsMultiplayerOpen(false);
          startBattle();
        }
      }
    );

    return () => {
      if (peerManagerRef.current) peerManagerRef.current.disconnect();
    };
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Audio activation on first user gesture
      SoundEngine.init();
      BgmEngine.init(SoundEngine.ctx);

      switch (e.code) {
        case 'KeyA':
        case 'ArrowLeft':
          p1Inputs.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          p1Inputs.current.right = true;
          break;
        case 'KeyW':
        case 'ArrowUp':
        case 'Space':
          p1Inputs.current.up = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          p1Inputs.current.down = true;
          break;
        case 'KeyJ':
        case 'KeyZ':
          p1Inputs.current.punch = true;
          break;
        case 'KeyK':
        case 'KeyX':
          p1Inputs.current.kick = true;
          break;
        case 'KeyU':
        case 'KeyC':
          p1Inputs.current.special1 = true;
          break;
        case 'KeyI':
        case 'KeyV':
          p1Inputs.current.ultimate = true;
          break;
        default:
          break;
      }

      // If Online Guest, broadcast inputs
      if (gameMode === 'ONLINE' && peerManagerRef.current && !networkState.isHost) {
        peerManagerRef.current.send({
          type: 'INPUT',
          inputs: p1Inputs.current
        });
      }
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyA':
        case 'ArrowLeft':
          p1Inputs.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          p1Inputs.current.right = false;
          break;
        case 'KeyW':
        case 'ArrowUp':
        case 'Space':
          p1Inputs.current.up = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          p1Inputs.current.down = false;
          break;
        case 'KeyJ':
        case 'KeyZ':
          p1Inputs.current.punch = false;
          break;
        case 'KeyK':
        case 'KeyX':
          p1Inputs.current.kick = false;
          break;
        case 'KeyU':
        case 'KeyC':
          p1Inputs.current.special1 = false;
          break;
        case 'KeyI':
        case 'KeyV':
          p1Inputs.current.ultimate = false;
          break;
        default:
          break;
      }

      if (gameMode === 'ONLINE' && peerManagerRef.current && !networkState.isHost) {
        peerManagerRef.current.send({
          type: 'INPUT',
          inputs: p1Inputs.current
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameMode, networkState.isHost]);

  // Toggle Audio Mute
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    SoundEngine.setMuted(nextMuted);
    BgmEngine.setMuted(nextMuted);
  };

  // Start Battle Function
  const startBattle = () => {
    SoundEngine.init();
    BgmEngine.init(SoundEngine.ctx);
    if (!isMuted) BgmEngine.start();

    // Create Entities
    const f1 = new Fighter({
      id: 'p1',
      name: CHARACTERS[p1Char]?.name || 'MAMA GUFRON',
      characterId: p1Char,
      x: 220,
      facing: 1,
      isBot: false
    });

    const f2 = new Fighter({
      id: 'p2',
      name: CHARACTERS[p2Char]?.name || 'BAHLIL',
      characterId: p2Char,
      x: 580,
      facing: -1,
      isBot: gameMode === 'BOT'
    });

    const particles = new ParticleSystem();
    const arenaMgr = new ArenaManager(selectedArena);

    p1Ref.current = f1;
    p2Ref.current = f2;
    particlesRef.current = particles;
    arenaManagerRef.current = arenaMgr;

    if (gameMode === 'BOT') {
      botAiRef.current = new BotAI(f2, f1, aiDifficulty);
    } else {
      botAiRef.current = null;
    }

    const engine = new CombatEngine(f1, f2, particles, (eventType, data) => {
      if (eventType === 'MATCH_OVER') {
        setMatchResult(data);
        if (data.isF1Winner) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
        // Save record to persistent storage
        const updated = StorageService.recordMatchResult(
          data.isF1Winner,
          f1.characterId,
          f2.characterId,
          engine.f1Combo
        );
        setProfile(updated);
      }
    });

    engineRef.current = engine;
    setMatchResult(null);
    setView('BATTLE');
  };

  // 60 FPS Game Loop
  useEffect(() => {
    if (view !== 'BATTLE') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    let frameCount = 0;

    const loop = () => {
      const f1 = p1Ref.current;
      const f2 = p2Ref.current;
      const engine = engineRef.current;
      const arenaMgr = arenaManagerRef.current;
      const particles = particlesRef.current;
      const botAi = botAiRef.current;

      if (f1 && f2 && engine && arenaMgr && particles) {
        // 1. Process Inputs
        f1.handleInput(p1Inputs.current, f2);

        if (gameMode === 'BOT' && botAi) {
          const aiInputs = botAi.update();
          f2.handleInput(aiInputs, f1);
        } else {
          f2.handleInput(p2Inputs.current, f1);
        }

        // 2. Physics & Combat Engine Update
        engine.update();
        arenaMgr.update();

        // 3. Render Stage, Particles & Fighters
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Apply screen shake if active
        ctx.save();
        if (engine.screenShake > 0) {
          const dx = (Math.random() - 0.5) * engine.screenShake;
          const dy = (Math.random() - 0.5) * engine.screenShake;
          ctx.translate(dx, dy);
        }

        // Draw Arena Backdrop
        arenaMgr.draw(ctx);

        // Draw Fighters
        f1.draw(ctx);
        f2.draw(ctx);

        // Draw Particles & Visual FX
        particles.draw(ctx);

        ctx.restore();

        // 4. Synchronize HUD state every 3 frames (~20Hz)
        frameCount++;
        if (frameCount % 3 === 0) {
          setHudData({
            f1Health: f1.health,
            f2Health: f2.health,
            f1Energy: f1.energy,
            f2Energy: f2.energy,
            f1Wins: f1.wins,
            f2Wins: f2.wins,
            timer: engine.roundTimer,
            round: engine.round,
            roundState: engine.roundState,
            koReason: engine.koReason,
            f1Combo: engine.f1Combo,
            f2Combo: engine.f2Combo
          });
        }
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [view, gameMode]);

  // Mobile Gamepad touch handler
  const handleMobileInput = (action, isPressed) => {
    p1Inputs.current[action] = isPressed;
    if (gameMode === 'ONLINE' && peerManagerRef.current && !networkState.isHost) {
      peerManagerRef.current.send({
        type: 'INPUT',
        inputs: p1Inputs.current
      });
    }
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex flex-col items-center justify-center crt-overlay">
      {/* Top Bar Floating Widgets */}
      <div className="absolute top-3 right-4 z-40 flex items-center gap-3">
        <LivePlayerCounter />
      </div>

      {view === 'SELECT' ? (
        <CharacterSelect
          p1Char={p1Char}
          setP1Char={setP1Char}
          p2Char={p2Char}
          setP2Char={setP2Char}
          selectedArena={selectedArena}
          setSelectedArena={setSelectedArena}
          gameMode={gameMode}
          setGameMode={setGameMode}
          aiDifficulty={aiDifficulty}
          setAiDifficulty={setAiDifficulty}
          onStartBattle={startBattle}
          onOpenMultiplayer={() => setIsMultiplayerOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      ) : (
        /* Battle View Screen */
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {/* Back to Menu & Sound Controls Button */}
          <div className="absolute top-3 left-4 z-40 flex items-center gap-2">
            <button
              onClick={() => {
                setView('SELECT');
                BgmEngine.stop();
              }}
              className="flex items-center gap-1 bg-slate-950/80 border border-slate-700 hover:border-yellow-400 text-yellow-400 text-[9px] px-2.5 py-1.5 pixel-btn"
            >
              <ArrowLeft size={12} /> MENU
            </button>
            <button
              onClick={handleToggleMute}
              className="bg-slate-950/80 border border-slate-700 hover:border-yellow-400 text-yellow-400 p-1.5 pixel-btn"
            >
              {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
          </div>

          {/* Canvas Aspect Ratio Container */}
          <div className="relative w-full max-w-[1000px] aspect-[16/9] max-h-screen bg-slate-950 border-y-2 md:border-2 border-slate-800 shadow-2xl overflow-hidden">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="w-full h-full object-contain"
            />

            {/* In-Game Arcade HUD */}
            <ArcadeHUD
              f1={{
                characterId: p1Char,
                health: hudData.f1Health,
                maxHealth: 100,
                energy: hudData.f1Energy,
                wins: hudData.f1Wins
              }}
              f2={{
                characterId: p2Char,
                health: hudData.f2Health,
                maxHealth: 100,
                energy: hudData.f2Energy,
                wins: hudData.f2Wins,
                isBot: gameMode === 'BOT'
              }}
              timer={hudData.timer}
              round={hudData.round}
              roundState={hudData.roundState}
              koReason={hudData.koReason}
              f1Combo={hudData.f1Combo}
              f2Combo={hudData.f2Combo}
            />

            {/* Match Finished Overlay Modal */}
            {matchResult && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4">
                <div className="bg-slate-900 border-2 border-yellow-400 pixel-box-gold p-6 text-center max-w-sm w-full animate-in fade-in zoom-in">
                  <div className="text-[10px] text-slate-400 mb-1">PERTANDINGAN SELESAI</div>
                  <h2 className="text-2xl font-extrabold text-yellow-400 arcade-glow-gold tracking-wider mb-2">
                    {matchResult.winner} MENANG!
                  </h2>
                  <p className="text-[9px] text-slate-300 mb-5">
                    {matchResult.isF1Winner ? 'Selamat atas kemenangan telak!' : 'Tetap semangat, coba lagi!'}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={startBattle}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 text-[10px] pixel-btn flex items-center justify-center gap-1 uppercase"
                    >
                      <RotateCcw size={12} /> REMATCH
                    </button>
                    <button
                      onClick={() => {
                        setView('SELECT');
                        BgmEngine.stop();
                      }}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 text-[10px] pixel-box uppercase"
                    >
                      MENU
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Virtual Touch Gamepad for Mobile & Tablet Devices */}
          <MobileGamepad
            onInputStateChange={handleMobileInput}
            charMoves={CHARACTERS[p1Char]?.moves}
          />
        </div>
      )}

      {/* Profile & Login Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onUpdateProfile={setProfile}
      />

      {/* Online P2P Multiplayer Modal */}
      <MultiplayerModal
        isOpen={isMultiplayerOpen}
        onClose={() => setIsMultiplayerOpen(false)}
        networkState={networkState}
        onCreateRoom={() => peerManagerRef.current?.createRoom()}
        onJoinRoom={(code) => peerManagerRef.current?.joinRoom(code)}
        onStartOnlineMatch={() => {
          if (peerManagerRef.current && networkState.isHost) {
            peerManagerRef.current.send({
              type: 'MATCH_START',
              p1Char: p2Char, // Invert for opponent
              p2Char: p1Char,
              arena: selectedArena
            });
          }
          setIsMultiplayerOpen(false);
          startBattle();
        }}
      />
    </div>
  );
};
