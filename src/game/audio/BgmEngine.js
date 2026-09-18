// Procedural 16-Bit Arcade Background Battle Music Synthesizer

class BgmEngineClass {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.35;
    this.timer = null;
    this.step = 0;
    this.tempo = 135; // BPM
  }

  init(audioCtx) {
    this.ctx = audioCtx;
  }

  start() {
    if (this.isPlaying) return;
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.step = 0;
    this.scheduleNextStep();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  setMuted(muted) {
    this.isMuted = muted;
  }

  // 16-Step Arcade Fighting Bassline & Melody (Key of D Minor / Pentatonic)
  scheduleNextStep() {
    if (!this.isPlaying || !this.ctx) return;

    const stepDuration = 60 / this.tempo / 4; // 16th note in seconds
    const now = this.ctx.currentTime;

    if (!this.isMuted) {
      // 1. Bassline (Punchy sawtooth/square 16th notes)
      const bassNotes = [
        146.83, 146.83, 220.00, 146.83, // D3, D3, A3, D3
        174.61, 146.83, 196.00, 146.83, // F3, D3, G3, D3
        130.81, 130.81, 196.00, 130.81, // C3, C3, G3, C3
        164.81, 146.83, 130.81, 110.00  // E3, D3, C3, A2
      ];
      const bassFreq = bassNotes[this.step % bassNotes.length];
      this.playSynthNote(bassFreq, 'sawtooth', 0.1, this.volume * 0.45, now);

      // 2. Arcade Lead Melody (Plays every 2 steps or on key accents)
      const leadPattern = [
        293.66, 0, 349.23, 0, 392.00, 440.00, 392.00, 0,
        523.25, 0, 440.00, 392.00, 349.23, 0, 293.66, 0
      ];
      const leadFreq = leadPattern[this.step % leadPattern.length];
      if (leadFreq > 0) {
        this.playSynthNote(leadFreq, 'square', 0.16, this.volume * 0.35, now);
      }

      // 3. Drum Beats: Kick on 0, 4, 8, 12; Snare on 4, 12; Hi-hat on every step
      const step16 = this.step % 16;
      if (step16 === 0 || step16 === 8) {
        this.playDrumKick(now);
      }
      if (step16 === 4 || step16 === 12) {
        this.playDrumSnare(now);
      }
      if (step16 % 2 === 0) {
        this.playDrumHiHat(now);
      }
    }

    this.step++;
    this.timer = setTimeout(() => {
      this.scheduleNextStep();
    }, stepDuration * 1000);
  }

  playSynthNote(freq, type, duration, vol, time) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {
      // Audio context might be suspended or closed
    }
  }

  playDrumKick(time) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(130, time);
      osc.frequency.exponentialRampToValueAtTime(28, time + 0.12);

      gain.gain.setValueAtTime(this.volume * 0.7, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.12);
    } catch (e) {}
  }

  playDrumSnare(time) {
    try {
      const bufferSize = this.ctx.sampleRate * 0.09;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.45, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

      noise.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(time);
    } catch (e) {}
  }

  playDrumHiHat(time) {
    try {
      const bufferSize = this.ctx.sampleRate * 0.03;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7000, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(time);
    } catch (e) {}
  }
}

export const BgmEngine = new BgmEngineClass();
