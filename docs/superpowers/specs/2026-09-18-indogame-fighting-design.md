# Design Specification: IndoGame - 16-Bit Pixel Art Arcade Fighting Game

## 1. Overview & Vision
**IndoGame** is a satirical 16-bit arcade retro fighting web game featuring three iconic characters: **Mama Gufron**, **Bahlil**, and **Wowo**, clashing across iconic Indonesian arenas including the majestic **Istana Garuda IKN**, the blazing **Kebakaran Hutan (Forest Fire)**, and the dense **Hutan Kebun Sawit (Palm Oil Plantation)**. The game features full 60 FPS canvas-based fighting physics, hitboxes/hurtboxes, combos, procedural chiptune sound effects, dual-platform controls (keyboard & responsive mobile virtual touch pad), smart AI singleplayer with 4 difficulties, and real-time P2P online multiplayer with room codes deployable directly to Vercel and pushed to GitHub.

---

## 2. Technical Stack & Architecture
- **Bundler & Core**: Vite + React (JavaScript/TypeScript ES Modules) for blazing fast performance and clean static export to Vercel.
- **Rendering Engine**: HTML5 Canvas 2D running at fixed 60 FPS logic tick with `requestAnimationFrame`, crisp pixel-art scaling (`image-rendering: pixelated`).
- **Networking (Real-time Multiplayer)**: WebRTC DataChannels using PeerJS. Direct browser-to-browser P2P connection with low latency (<25ms) without requiring dedicated paid WebSocket servers.
- **Audio Engine**: Web Audio API procedural Chiptune Synthesizer producing arcade punches, kicks, fire sizzle, wild boar squeal & rumble, ant swarm hiss, toxic splash, megaphone sonic drone, and 8-bit/16-bit battle music.
- **Storage & Profile**: Local storage persistent profile and statistics (Wins, Losses, Win Rate, Max Combo) with clean extensible adapter for Firebase Auth.
- **Platform Responsiveness**: Full desktop keyboard support and on-screen responsive touch Gamepad (D-Pad + Arcade Action Buttons) for smartphones/tablets.

---

## 3. Roster of Characters & Move List

### Character 1: Mama Gufron (The Mystical Speaker)
- **Visuals**: Headband/sorban, long grey hair, black jacket over white shirt, holding microphone.
- **Normal Attacks**:
  - **Punch (P / J)**: Microphone strike / palm jab.
  - **Kick (K / K)**: Low ground sweep kick.
  - **Jump Attack**: Aerial flying kick.
- **Signature & Ultimate Moves**:
  - **Special 1 - Babi Hutan Charge (U)**: Points forward, summons and mounts a rampaging wild boar that charges across the screen kicking up thick dust clouds and bowling over the opponent.
  - **Ultimate - Jurus Semut Gaib (Ant Swarm Eruption) (I)**: Chants into the microphone ("ERUPT!"), geyser of ants erupts under the opponent's feet and swarms them for multi-hit gnawing damage ("GNAW GNAW GNAW") with victory banner *"K.O. BY SWARM"*.

### Character 2: Bahlil (The Smiling Minister / Brawler)
- **Visuals**: Dark blue business suit, white collared shirt, confident smile.
- **Normal Attacks**:
  - **Punch (P / J)**: Rapid document slap and executive jab.
  - **Kick (K / K)**: High roundhouse kick.
  - **Jump Attack**: Flying aerial kick.
- **Signature & Ultimate Moves**:
  - **Special 1 - Hot Ethanol Splash (U)**: Points at a steaming chemical beaker glass and splashes flaming ethanol forward, igniting the opponent in flames ("FIRE!").
  - **Ultimate - Earth Oil Eruption (Crude Oil Geyser) (I)**: Kneels and touches the ground, triggering an erupting black crude oil geyser from beneath the opponent, trapping them in bubbling oil ("TRAP") for massive damage.

### Character 3: Wowo (The Safari Commander)
- **Visuals**: Wide-brimmed cowboy hat, white safari/PDH shirt, khaki trousers, expressive gestures.
- **Normal Attacks**:
  - **Punch (P / J)**: Heavy safari punch & double palm strike.
  - **Kick (K / K)**: Heavy booted front kick.
  - **Jump Attack**: Airborne safari elbow drop.
- **Signature & Ultimate Moves**:
  - **Special 1 - Tray Makan Racun (Poisoned Food Tray) (U)**: Flings a metallic school lunch tray forward with milk and food, splashing a bubbling toxic green pool ("POISON POISON") that poisons and continuously damages the opponent ("POISONED!").
  - **Ultimate - Megaphone "HIDUP JOKOWI" Sonic Drone (I)**: Pulls out an electric megaphone and screams *"HIDUP JOKOWI"*, blasting expanding sonic shockwaves ("DENGUNG DENGUNG") that stun and blast the opponent ("STUNNED!").

---

## 4. Arenas / Battle Stages

1. **Istana Garuda IKN (Nusantara Palace)**:
   - Central giant metallic eagle-wing monument.
   - Tropical palm trees, government plaza, and clear blue Kalimantan sky.
2. **Kebakaran Hutan (Forest Wildfire / Lahan Gambut Terbakar)**:
   - Orange-red smoky haze sky with rising burnt ember particles.
   - Charred tree trunks, burning logs, and flickering background fire flames.
3. **Tengah Hutan Kebun Sawit (Palm Oil Plantation)**:
   - Dense rows of oil palm trees with hanging red-orange palm fruit bunches.
   - Plantation dirt road, tropical canopy, and lush agricultural backdrop.

---

## 5. Retro HUD & Visual Feedback
- Dual health bars with red-yellow damage meters.
- Character portrait boxes (Mama Gufron, Bahlil, Wowo).
- Centered 99-second round timer.
- Dynamic Floating Text: "HIT!", "FIRE!", "TRAP", "POISONED!", "STUNNED!", "K.O. BY SWARM".
- Combo Counter ("2 HITS!", "3 HITS COMBO!").
- Screen shake on heavy impacts and ultimates.

---

## 6. Game Modes & Bot AI
1. **Singleplayer (Player vs Bot)**:
   - 4 difficulty settings: **Easy**, **Medium**, **Hard**, **Expert**.
   - Bot adjusts reaction latency, blocking probability, combo frequency, and special move execution.
2. **Multiplayer Online (WebRTC P2P Room Code)**:
   - Host generates a 4-letter Room Code.
   - Guest joins from any other device/browser.
   - Direct low-latency P2P state sync (60 Hz).
3. **Live Online Players Counter**:
   - Floating widget showing live arcade players count.

---

## 7. Controls & Input Mapping
- **Desktop Keyboard**:
  - Left / Right: `A` / `D` or Left / Right Arrows
  - Jump: `W` or Up Arrow or Spacebar
  - Crouch / Guard: `S` or Down Arrow
  - Punch: `J` or `Z`
  - Kick: `K` or `X`
  - Special Move 1: `U` or `C`
  - Ultimate Skill: `I` or `V`
- **Mobile Touch Controls**:
  - Responsive on-screen virtual D-Pad (Left, Right, Down/Crouch, Up/Jump).
  - Arcade button cluster: [PUNCH], [KICK], [SP 1], [ULT].

---

## 8. Deployment & Repository
- Git remote linked to `https://github.com/siput-bersenjata/indogame.git`.
- Clean Vite build tested without any TypeScript / bundler errors.
- Vercel-ready with single-command deployment instructions.
