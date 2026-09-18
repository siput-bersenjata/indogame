// Procedural 16-Bit Retro Arcade Web Audio API Sound Synthesizer

class SoundEngineClass {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterVolume = 0.6;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
  }

  // --- Core Sound Generators ---

  // Quick noise burst for punch / hit / crunch
  playPunch() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;

    // Oscillator thump
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.12);

    gain.gain.setValueAtTime(this.masterVolume * 0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);

    // Noise crackle
    this.playNoise(0.08, 0.5, 800);
  }

  playKick() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.18);

    gain.gain.setValueAtTime(this.masterVolume * 0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);

    this.playNoise(0.12, 0.6, 600);
  }

  playBlock() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(550, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(this.masterVolume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // --- Signature Moves SFX ---

  // Mama Gufron: Babi Hutan Charge (Snort & galloping rumble)
  playBabiCharge() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;

    // Snort / Squeal
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(580, now + 0.15);
    osc.frequency.linearRampToValueAtTime(220, now + 0.35);

    gain.gain.setValueAtTime(this.masterVolume * 0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);

    // Deep galloping motor rumble
    const rumble = this.ctx.createOscillator();
    const rumbleGain = this.ctx.createGain();
    rumble.type = 'square';
    rumble.frequency.setValueAtTime(55, now);
    rumble.frequency.linearRampToValueAtTime(75, now + 0.5);

    rumbleGain.gain.setValueAtTime(this.masterVolume * 0.4, now);
    rumbleGain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

    rumble.connect(rumbleGain);
    rumbleGain.connect(this.ctx.destination);
    rumble.start(now);
    rumble.stop(now + 0.7);
  }

  // Mama Gufron: Jurus Semut Gaib (Eerie chittering eruption)
  playAntSwarm() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;

    // Rapid arpeggiated high frequency swarm
    for (let i = 0; i < 6; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const freq = 600 + (i * 120) + (Math.random() * 80);
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      osc.frequency.linearRampToValueAtTime(freq * 1.5, now + i * 0.06 + 0.1);

      gain.gain.setValueAtTime(this.masterVolume * 0.3, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.12);
    }
    this.playNoise(0.6, 0.4, 3000);
  }

  // Bahlil: Hot Ethanol Splash (Fire whoosh & sizzle)
  playFireSplash() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.45);

    gain.gain.setValueAtTime(this.masterVolume * 0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);

    this.playNoise(0.4, 0.6, 1800);
  }

  // Bahlil: Earth Oil Eruption (Heavy bubbling seismic rumble)
  playOilEruption() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(45, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.25);
    osc.frequency.linearRampToValueAtTime(35, now + 0.7);

    gain.gain.setValueAtTime(this.masterVolume * 0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.7);

    this.playNoise(0.5, 0.5, 450);
  }

  // Wowo: Tray Makan Racun (Metallic fling + toxic puddle hiss)
  playPoisonTray() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;

    // Metallic clang
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(780, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.15);

    gain.gain.setValueAtTime(this.masterVolume * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);

    // Sizzling toxic puddle
    this.playNoise(0.45, 0.5, 2200);
  }

  // Wowo: Megaphone "HIDUP JOKOWI" (Siren blast + feedback drone)
  playMegaphoneShout() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;

    // Siren sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(880, now + 0.2);
    osc.frequency.linearRampToValueAtTime(440, now + 0.4);
    osc.frequency.linearRampToValueAtTime(990, now + 0.6);

    gain.gain.setValueAtTime(this.masterVolume * 0.75, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.7);
  }

  // --- UI and Match Events ---

  playRoundBell() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;

    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(this.masterVolume * 0.6, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  }

  playKO() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;

    // Dramatic sub boom
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.9);

    gain.gain.setValueAtTime(this.masterVolume * 1.0, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.0);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.0);

    this.playNoise(0.6, 0.7, 500);
  }

  playSelect() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(880, now + 0.05);

    gain.gain.setValueAtTime(this.masterVolume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // White noise generator with lowpass/bandpass filter
  playNoise(duration, volume, cutoff = 1000) {
    if (this.isMuted || !this.ctx) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.masterVolume * volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }
}

export const SoundEngine = new SoundEngineClass();
