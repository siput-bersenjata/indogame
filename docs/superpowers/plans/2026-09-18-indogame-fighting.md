# IndoGame - 16-Bit Pixel Art Arcade Fighting Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, production-ready 16-bit arcade pixel-art fighting game featuring Mama Gufron, Bahlil, and Wowo clashing at Istana Garuda IKN, Kebakaran Hutan, and Hutan Kebun Sawit, featuring 60 FPS canvas physics, chiptune audio synth, singleplayer bot AI (4 difficulties), online P2P multiplayer via WebRTC, responsive mobile touch controls, and direct push to GitHub (`https://github.com/siput-bersenjata/indogame.git`).

**Architecture:** Vite + React frontend rendering a 60 FPS HTML5 Canvas game loop with hitboxes, particle systems, and state machines. Procedural audio using the Web Audio API. Real-time multiplayer powered by PeerJS WebRTC DataChannels with zero server maintenance, deployable cleanly to Vercel as a static web app.

**Tech Stack:** React 19, Vite, HTML5 Canvas 2D, Web Audio API, PeerJS (WebRTC), Tailwind CSS / Retro Arcade CSS, Lucide React.

**Spec:** `docs/superpowers/specs/2026-09-18-indogame-fighting-design.md`

## Global Constraints
- Must run at fixed 60 FPS on standard modern browsers (Chrome, Firefox, Safari, Edge, Mobile Safari/Chrome).
- Zero external image 404 risk: All character sprites, arena backgrounds, portraits, and VFX must be bundled locally or generated dynamically into the assets folder.
- Zero external audio 404 risk: All sound effects and background battle music are procedurally synthesized via the Web Audio API.
- Fully compatible with Vercel deployment without requiring a Node.js persistent WebSocket server.
- Mobile and desktop responsive with dedicated virtual D-pad and touch buttons.
- Target repository: `https://github.com/siput-bersenjata/indogame.git`.

---

### Task 1: Project Initialization & Dependency Setup

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/index.css`
- Create: `vercel.json`

- [ ] **Step 1: Create package.json with dependencies**
  Configure Vite, React, React DOM, PeerJS, Lucide React, and Canvas Confetti.
- [ ] **Step 2: Install dependencies**
  Run `npm install` and verify `node_modules` is installed cleanly.
- [ ] **Step 3: Create vite.config.js and index.html**
  Set up Vite with `@vitejs/plugin-react` and retro typography (`Press Start 2P` font loaded via Google Fonts with local fallback).
- [ ] **Step 4: Configure vercel.json and test build**
  Verify `npm run build` generates `dist/` without errors.
- [ ] **Step 5: Commit**
  `git add . && git commit -m "chore: scaffold vite react arcade project"`

---

### Task 2: Asset Extraction & Retro Sprite Pipeline

**Files:**
- Create: `scripts/extract_assets.py`
- Create: `public/assets/sprites/`
- Create: `public/assets/arenas/`
- Create: `public/assets/portraits/`

- [ ] **Step 1: Write python asset extractor script**
  Use Pillow to crop and extract high-resolution pixel art frames and backgrounds from `.user_uploaded/media_1789735199716.png`, `.user_uploaded/media_1789735457312.png`, and `.user_uploaded/media_1789735715538.png`.
- [ ] **Step 2: Run extraction script**
  Generate clean transparent PNGs for:
  - Mama Gufron: Idle, Walk, Crouch, Jump, Punch, Kick, Babi Hutan, Ant Swarm.
  - Bahlil: Idle, Walk, Crouch, Jump, Punch, Kick, Ethanol Beaker & Fire, Crude Oil Geyser.
  - Wowo: Idle, Walk, Crouch, Jump, Punch, Kick, Poison Tray & Puddle, Megaphone & Sonic Waves.
  - Arenas: Istana Garuda IKN, Kebakaran Hutan, and Hutan Kebun Sawit.
  - Character Portraits: Mama Gufron, Bahlil, Wowo.
- [ ] **Step 3: Validate generated sprite assets**
  Check that all image files exist and are valid PNGs.
- [ ] **Step 4: Commit**
  `git add public/assets scripts/ && git commit -m "assets: extract and generate character sprites and arenas"`

---

### Task 3: Procedural Web Audio API Chiptune Engine

**Files:**
- Create: `src/game/audio/SoundEngine.js`
- Create: `src/game/audio/BgmEngine.js`

- [ ] **Step 1: Implement SoundEngine with Web Audio synthesis**
  Oscillators and noise buffers for:
  - `playPunch()`: Quick frequency drop square wave + white noise punch crunch.
  - `playKick()`: Deep bass thump + triangle wave sweep.
  - `playBabiCharge()`: Wild boar snort & continuous dust rumble loop.
  - `playAntSwarm()`: Multitone eerie chittering frequency noise.
  - `playFireSplash()`: Crackling flame whoosh.
  - `playOilEruption()`: Deep bubbling eruption surge.
  - `playPoisonSplash()`: Slime sizzle burst.
  - `playMegaphoneShout()`: Resonant siren scream + distortion drone.
  - `playRoundStart()`: Japanese arcade gong + synth trumpet fanfare.
  - `playKO()`: Dramatic impact boom + slow pitch drop.
- [ ] **Step 2: Implement BgmEngine retro arcade music loop**
  16-bit arcade synth battle track using polyphonic Web Audio oscillator channels (lead synth, bass arpeggio, noise hi-hat & snare) with volume control and mute toggle.
- [ ] **Step 3: Test audio engine in isolated runner**
  Verify sound initialization upon user interaction without browser AudioContext errors.
- [ ] **Step 4: Commit**
  `git add src/game/audio/ && git commit -m "feat(audio): add procedural chiptune sound effects and bgm engine"`

---

### Task 4: Core 2D Canvas Physics Engine & Combat State Machine

**Files:**
- Create: `src/game/engine/Constants.js`
- Create: `src/game/engine/Fighter.js`
- Create: `src/game/engine/ParticleSystem.js`
- Create: `src/game/engine/CombatEngine.js`

- [ ] **Step 1: Define Constants & Frame Data**
  Ground level, stage width (800x450 canvas internal resolution), gravity, jump velocity, walk speed, hitbox frames, damage values, and cooldowns.
- [ ] **Step 2: Implement ParticleSystem**
  Dust puffs on landing/dash, hit sparks on impact, flame particles, oil splashes, toxic bubbles, and floating damage/status popups ("HIT!", "FIRE!", "TRAP", "POISONED!", "STUNNED!").
- [ ] **Step 3: Implement Fighter State Machine**
  States: `IDLE`, `WALK_FWD`, `WALK_BACK`, `CROUCH`, `JUMP`, `PUNCH`, `KICK`, `SPECIAL_1`, `ULTIMATE`, `HURT`, `BLOCK`, `STUN`, `KNOCKDOWN`, `KO`, `VICTORY`. Handle facing direction, velocity, friction, bounding box, hurtbox, and active hitboxes.
- [ ] **Step 4: Implement CombatEngine**
  Manage collision checking (AABB), block detection (holding backwards while being attacked), combo counter, screen shake, and hit-stop (impact freeze frames).
- [ ] **Step 5: Commit**
  `git add src/game/engine/ && git commit -m "feat(engine): add 60fps canvas combat engine and particle system"`

---

### Task 5: Character Implementations & Signature Moves

**Files:**
- Create: `src/game/characters/MamaGufron.js`
- Create: `src/game/characters/Bahlil.js`
- Create: `src/game/characters/Wowo.js`
- Create: `src/game/characters/CharacterRegistry.js`

- [ ] **Step 1: Implement MamaGufron special moves**
  - Special 1: Babi Hutan Charge (spawns mounted boar entity moving across screen, high knockback).
  - Ultimate: Jurus Semut Gaib (ground explosion "ERUPT!" at opponent location, ant swarm column, multi-hit gnawing, "K.O. BY SWARM").
- [ ] **Step 2: Implement Bahlil special moves**
  - Special 1: Hot Ethanol Splash (forward flame arc projectile, applies burning status over time).
  - Ultimate: Earth Oil Eruption (crude oil geyser beneath opponent, root/trap status effect, high damage).
- [ ] **Step 3: Implement Wowo special moves**
  - Special 1: Tray Makan Racun (lobbed meal tray projectile, leaves green toxic ground pool that damages on contact).
  - Ultimate: Megaphone "HIDUP JOKOWI" Sonic Drone (wide conical acoustic waves, stuns opponent in place for 2.5s).
- [ ] **Step 4: CharacterRegistry export**
  Registry mapping character IDs, stats, move lists, sound links, and sprite definitions.
- [ ] **Step 5: Commit**
  `git add src/game/characters/ && git commit -m "feat(characters): implement Mama Gufron, Bahlil, and Wowo signature moves"`

---

### Task 6: Battle Arenas & Parallax Backgrounds

**Files:**
- Create: `src/game/arenas/ArenaManager.js`
- Create: `src/game/arenas/IstanaGarudaStage.js`
- Create: `src/game/arenas/ForestFireStage.js`
- Create: `src/game/arenas/PalmOilStage.js`

- [ ] **Step 1: Implement IstanaGarudaStage**
  Blue tropical sky, animated floating clouds, majestic Istana Garuda wing monument backdrop, palm trees, tiled royal ground, and fluttering flags.
- [ ] **Step 2: Implement ForestFireStage**
  Smoky orange-red haze sky, flickering flame animations, rising ash/ember particles, charred tree silhouettes, and smoldering peat soil.
- [ ] **Step 3: Implement PalmOilStage**
  Lush tropical palm oil rows, rich oil palm fruit bunches, dirt tractor paths, and deep plantation perspective.
- [ ] **Step 4: Implement ArenaManager**
  Selectable stages with dynamic animated background rendering and ambient stage effects.
- [ ] **Step 5: Commit**
  `git add src/game/arenas/ && git commit -m "feat(arenas): implement Istana Garuda, Forest Fire, and Palm Oil stages"`

---

### Task 7: Smart Bot AI Engine (Single Player)

**Files:**
- Create: `src/game/ai/BotAI.js`

- [ ] **Step 1: Implement AI decision loop with 4 difficulty levels**
  - `EASY`: Delayed reactions (450ms), wanders randomly, basic punches, 10% block rate.
  - `MEDIUM`: Moderate reactions (220ms), closes in, mixes punches & kicks, 40% block rate, occasional special move.
  - `HARD`: Fast reactions (100ms), actively zones and counters, 75% block rate, executes combo into special move.
  - `EXPERT`: Aggressive spacing, frame-perfect whiff punish, 90% block/parry, optimal Ultimate execution, reads player attacks.
- [ ] **Step 2: Integrate Bot with Fighter controller input stream**
  Simulate controller button presses for the bot player.
- [ ] **Step 3: Commit**
  `git add src/game/ai/ && git commit -m "feat(ai): implement multi-difficulty bot AI engine"`

---

### Task 8: WebRTC Real-Time P2P Multiplayer (PeerJS)

**Files:**
- Create: `src/game/network/PeerManager.js`
- Create: `src/game/network/Protocol.js`

- [ ] **Step 1: Implement PeerManager**
  - Host game: creates Peer instance, generates 4-character Room Code (e.g. `GARUDA`, `IKN9`).
  - Join game: connects to Host Peer using Room Code.
  - Connection status handler: Connected, Disconnected, Reconnecting, Latency / Ping display.
- [ ] **Step 2: Implement state synchronization protocol**
  - Host operates authoritative game physics loop.
  - Client sends input vectors at 60 Hz.
  - Host broadcasts player states, health, particles, and round transitions at 30-60 Hz.
- [ ] **Step 3: Commit**
  `git add src/game/network/ && git commit -m "feat(network): implement WebRTC P2P multiplayer via PeerJS"`

---

### Task 9: Retro Arcade HUD, Mobile Gamepad, Character Selection & Auth

**Files:**
- Create: `src/components/ArcadeHUD.jsx`
- Create: `src/components/MobileGamepad.jsx`
- Create: `src/components/CharacterSelect.jsx`
- Create: `src/components/MultiplayerModal.jsx`
- Create: `src/components/ProfileModal.jsx`
- Create: `src/components/LivePlayerCounter.jsx`
- Create: `src/services/StorageService.js`
- Create: `src/App.jsx`
- Create: `src/main.jsx`

- [ ] **Step 1: Implement ArcadeHUD**
  Retro health bars with damage delay gauge, character portraits, round timer (99s), combo counter, and "ROUND", "FIGHT!", "K.O." banners.
- [ ] **Step 2: Implement MobileGamepad**
  On-screen touch D-Pad (Left, Right, Jump, Crouch) + 4 Arcade Action buttons ([PUNCH], [KICK], [SP 1], [ULT]) with multi-touch event prevention of scrolling.
- [ ] **Step 3: Implement CharacterSelect and StageSelect**
  Select P1 Fighter, P2/Bot Fighter, Stage (IKN, Kebakaran Hutan, Kebun Sawit), and AI Difficulty.
- [ ] **Step 4: Implement ProfileModal & LivePlayerCounter**
  Email login / guest profile, wins/losses/winrate stats, and live active arcade player counter widget.
- [ ] **Step 5: Assemble App.jsx and wire full game flow**
  Menu -> Character Select -> Battle Canvas -> Game Over / Rematch.
- [ ] **Step 6: Commit**
  `git add src/ && git commit -m "feat(ui): add arcade HUD, touch gamepad, character select, and profile tracking"`

---

### Task 10: Build Verification, GitHub Push & Deployment Guide

**Files:**
- Create: `README.md`

- [ ] **Step 1: Run production build verification**
  Run `npm run build` and ensure `dist/` builds with zero errors.
- [ ] **Step 2: Write comprehensive README.md**
  Documentation detailing gameplay controls, character move lists, local setup (`npm run dev`), GitHub sync, and 1-click Vercel deployment instructions.
- [ ] **Step 3: Git commit all files**
  Ensure working directory is clean.
- [ ] **Step 4: Push to GitHub repository**
  Run `git push -u origin main` to push to `https://github.com/siput-bersenjata/indogame.git`.
- [ ] **Step 5: Verify GitHub status and provide Vercel deployment link**
  Display complete instructions and link for the user.
