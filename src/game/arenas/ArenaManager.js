// Battle Arena Parallax and Dynamic Background Renderer

export const ARENAS = {
  ikn: {
    id: 'ikn',
    name: 'Istana Garuda IKN',
    location: 'Ibu Kota Nusantara, Kalimantan Timur',
    imageSrc: '/assets/arenas/ikn_palace.png',
    theme: 'royal',
    ambientColor: 'rgba(56, 189, 248, 0.08)'
  },
  forest_fire: {
    id: 'forest_fire',
    name: 'Kebakaran Hutan Gambut',
    location: 'Lahan Gambut Sumatera / Kalimantan',
    imageSrc: '/assets/arenas/forest_fire.png',
    theme: 'fire',
    ambientColor: 'rgba(239, 68, 68, 0.14)'
  },
  palm_oil: {
    id: 'palm_oil',
    name: 'Tengah Hutan Kebun Sawit',
    location: 'Perkebunan Kelapa Sawit Nasional',
    imageSrc: '/assets/arenas/palm_oil.png',
    theme: 'nature',
    ambientColor: 'rgba(34, 197, 94, 0.08)'
  }
};

export class ArenaManager {
  constructor(arenaId = 'ikn') {
    this.currentArenaId = arenaId;
    this.arenaImages = {};
    this.cloudOffset = 0;
    this.emberOffset = 0;
    this.ambientParticles = [];

    this.loadArenas();
    this.initAmbientParticles();
  }

  setArena(arenaId) {
    if (ARENAS[arenaId]) {
      this.currentArenaId = arenaId;
      this.initAmbientParticles();
    }
  }

  loadArenas() {
    Object.keys(ARENAS).forEach(key => {
      const img = new Image();
      img.src = ARENAS[key].imageSrc;
      this.arenaImages[key] = img;
    });
  }

  initAmbientParticles() {
    this.ambientParticles = [];
    if (this.currentArenaId === 'forest_fire') {
      // Fiery embers drifting upwards
      for (let i = 0; i < 35; i++) {
        this.ambientParticles.push({
          x: Math.random() * 800,
          y: Math.random() * 450,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -1 - Math.random() * 2,
          size: 1 + Math.random() * 3,
          color: Math.random() > 0.4 ? '#fb923c' : '#facc15'
        });
      }
    } else if (this.currentArenaId === 'ikn') {
      // Golden shimmering light flecks
      for (let i = 0; i < 15; i++) {
        this.ambientParticles.push({
          x: Math.random() * 800,
          y: Math.random() * 200,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.5,
          size: 2,
          color: 'rgba(253, 224, 71, 0.6)'
        });
      }
    } else if (this.currentArenaId === 'palm_oil') {
      // Drifting tropical pollen / dust
      for (let i = 0; i < 20; i++) {
        this.ambientParticles.push({
          x: Math.random() * 800,
          y: Math.random() * 450,
          vx: -0.8 - Math.random() * 1.2,
          vy: 0.3 + Math.random() * 0.5,
          size: 2,
          color: 'rgba(220, 252, 231, 0.5)'
        });
      }
    }
  }

  update() {
    this.cloudOffset = (this.cloudOffset + 0.3) % 800;
    this.emberOffset += 0.05;

    // Update ambient particles
    for (const p of this.ambientParticles) {
      p.x += p.vx;
      p.y += p.vy;

      if (this.currentArenaId === 'forest_fire') {
        if (p.y < 0) {
          p.y = 450;
          p.x = Math.random() * 800;
        }
      } else if (this.currentArenaId === 'palm_oil') {
        if (p.x < 0) {
          p.x = 800;
          p.y = Math.random() * 450;
        }
      } else {
        if (p.x < 0) p.x = 800;
        if (p.x > 800) p.x = 0;
      }
    }
  }

  draw(ctx) {
    const arena = ARENAS[this.currentArenaId];
    const img = this.arenaImages[this.currentArenaId];

    // 1. Draw Arena Backdrop
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, 0, 0, 800, 450);
    } else {
      // Fallback procedural backdrop
      ctx.fillStyle = arena.theme === 'fire' ? '#450a0a' : arena.theme === 'nature' ? '#14532d' : '#0284c7';
      ctx.fillRect(0, 0, 800, 360);
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 360, 800, 90);
    }

    // 2. Parallax Cloud Layer for IKN
    if (this.currentArenaId === 'ikn') {
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = '#ffffff';
      // Moving cloud shapes
      ctx.beginPath();
      ctx.arc((this.cloudOffset + 100) % 800, 60, 45, 0, Math.PI * 2);
      ctx.arc((this.cloudOffset + 140) % 800, 50, 60, 0, Math.PI * 2);
      ctx.arc((this.cloudOffset + 190) % 800, 65, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc((this.cloudOffset + 500) % 800, 80, 50, 0, Math.PI * 2);
      ctx.arc((this.cloudOffset + 560) % 800, 70, 70, 0, Math.PI * 2);
      ctx.arc((this.cloudOffset + 620) % 800, 85, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. Ambient Atmospheric Particles (Embers / Dust / Light)
    ctx.save();
    for (const p of this.ambientParticles) {
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    }

    // 4. Color tint overlay
    ctx.fillStyle = arena.ambientColor;
    ctx.fillRect(0, 0, 800, 450);
    ctx.restore();
  }
}
