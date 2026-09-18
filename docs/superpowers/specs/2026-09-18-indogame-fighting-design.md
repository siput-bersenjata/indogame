# Design Specification: IndoGame - 16-Bit Pixel Art Arcade Fighting Game

## 1. Overview & Vision
**IndoGame** is a nostalgic 16-bit arcade retro fighting web application featuring iconic characters: **Mama Gufron** and **Bahlil**, clashing in front of the majestic **Istana Garuda IKN**. The game features full 60 FPS canvas-based fighting physics, hitboxes/hurtboxes, combos, chiptune sound effects, dual-platform controls (keyboard & mobile virtual touch pad), smart AI singleplayer with 4 difficulties, and real-time P2P online multiplayer with room codes deployable directly to Vercel.

---

## 2. Technical Stack & Architecture
- **Bundler & Core**: Vite + React (TypeScript / JavaScript ES Modules) for ultra-fast HMR and seamless static build optimization on Vercel.
- **Rendering Engine**: HTML5 Canvas 2D with `requestAnimationFrame` running at a fixed 60 FPS logic tick with interpolation, crisp pixel-art scaling (`image-rendering: pixelated`).
- **Networking (Real-time Multiplayer)**: WebRTC DataChannels using PeerJS. Allows direct low-latency P2P match play between two browsers on desktop or mobile without needing dedicated WebSocket VPS servers.
- **Audio Engine**: Web Audio API procedural Chiptune Synthesizer (oscillator nodes, white noise generators, custom ADSR envelopes) producing arcade punches, kicks, fire sizzle, wild boar charge rumble, ant eruption, and 8-bit/16-bit battle music.
- **Storage & Profile**: Local storage persistent profile and statistics (Wins, Losses, Win Rate, Max Combo) with clean extensible adapter for Firebase Auth.
- **Platform Responsiveness**: Dynamic layout supporting Desktop keyboard and responsive Touch Gamepad (D-Pad + Arcade buttons) for mobile/tablet.

---

## 3. Characters & Move List

### Character 1: Mama Gufron (The Mystical Chymist)
- **Visuals**: Headband, grey flowing hair, black jacket over white shirt, holding a microphone.
- **Normal Attacks**:
  - **Punch (P / J)**: Swift microphone strike / palm jab.
  - **Kick (K / K)**: Low ground sweep kick.
  - **Jump Attack**: Aerial flying kick.
- **Signature & Ultimate Moves**:
  - **Special 1 - Babi Hutan Charge (U)**: Mama Gufron points forward, summons and mounts a rampaging wild boar that charges across the screen with dust clouds, knocking back the opponent.
  - **Ultimate - Jurus Semut (Ant Swarm Eruption) (I)**: Chants into the microphone ("ERUPT!"), geyser of ants erupts under the opponent's feet and swarms them for multi-hit gnawing damage ("GNAW GNAW GNAW") with special victory text: *"K.O. BY SWARM"*.

### Character 2: Bahlil (The Smiling Minister / Brawler)
- **Visuals**: Dark blue business suit, white collared shirt, energetic posture, confident smile.
- **Normal Attacks**:
  - **Punch (P / J)**: Executive jab & rapid document slap.
  - **Kick (K / K)**: High roundhouse kick.
  - **Jump Attack**: Flying aerial kick.
- **Signature & Ultimate Moves**:
  - **Special 1 - Hot Ethanol Splash (U)**: Points at a steaming laboratory beaker glass and splashes flaming ethanol forward, setting the opponent ablaze with fire hit effects.
  - **Ultimate - Earth Oil Eruption (Crude Oil Geyser) (I)**: Kneels and touches the ground, triggering an erupting black crude oil geyser from beneath the opponent, trapping them in bubbling oil ("TRAP") for massive damage.

---

## 4. Stage & Visuals

- **Stage**: **Istana Garuda IKN**
  - Parallax sky with drifting tropical clouds.
  - The iconic eagle-winged national monument palace architecture.
  - Palm trees and landscaped green grounds.
  - Sandy/dirt battle terrain with dynamic dust particles, hit sparks, and screen shake.
- **Retro HUD (Heads-Up Display)**:
  - Dual health bars with red-yellow damage meters.
  - Character portrait boxes (Mama Gufron / Bahlil).
  - Fighter nameplates and player tags (`1P`, `2P`, `CPU`).
  - Centered 99-second round timer.
  - Combo Counter ("2 HITS!", "3 HITS COMBO!").
  - Animated announcement banners ("ROUND 1", "FIGHT!", "K.O.!", "PERFECT!").

---

## 5. Game Modes & Bot AI

1. **Player vs Bot (Singleplayer)**:
   - **Easy**: Slower reaction time (400ms delay), walks forward, basic attacks, rarely blocks.
   - **Medium**: Balanced reaction time (200ms delay), uses kicks and crouch blocks, occasionally triggers special moves.
   - **Hard**: Quick reaction time (90ms delay), dashes, counter-attacks, actively blocks projectiles, uses Ultimate skill when available.
   - **Expert**: Frame-trap combos, relentless pressure, optimal punishes, and high special skill usage.
2. **Player vs Player Online (Multiplayer P2P)**:
   - Host generates a 4-character Room Code (e.g., `IKN7`).
   - Guest inputs the room code on their device (PC or Smartphone).
   - PeerJS WebRTC DataChannel connects directly with minimal ping.
   - Host drives authoritative physics sync; guest inputs are sent at 60Hz.
3. **Live Online Players Counter**:
   - Live simulated active player presence widget in top corner reflecting active arcade challengers.

---

## 6. Controls & Input Mapping

| Action | Desktop Keyboard | Mobile Touch Control |
| :--- | :--- | :--- |
| Move Left | `A` / Left Arrow | D-Pad Left |
| Move Right | `D` / Right Arrow | D-Pad Right |
| Jump | `W` / Up Arrow / Space | D-Pad Up / Jump Btn |
| Crouch / Guard | `S` / Down Arrow | D-Pad Down |
| Normal Punch | `J` / `Z` | [PUNCH] Button |
| Normal Kick | `K` / `X` | [KICK] Button |
| Special Move 1 | `U` / `C` | [SP 1] Button (Babi / Ethanol) |
| Ultimate Skill | `I` / `V` | [ULT] Button (Semut / Oil Trap) |

---

## 7. Audio System
- **Web Audio API Chiptune Engine**:
  - Punch impact: White noise blast + frequency down-chirp (Square wave).
  - Kick impact: Low-pitch triangle wave drop + thump.
  - Special Move / Flame / Swarm: Filtered pink noise + modulated sine buzz.
  - Announcer: Arpeggiated square synth fanfare for "FIGHT!", "ROUND 1", "K.O.".
  - 16-Bit Battle Theme: Melodic chiptune loop with bassline and drum pulse, with audio toggle.

---

## 8. Deployment & Repository
- Git repository synced with `https://github.com/siput-bersenjata/indogame.git`.
- Vercel configuration (`vercel.json` / static build via `npm run build`).
