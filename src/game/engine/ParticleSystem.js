// 16-Bit Particle and Floating Combat Text Engine

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.floatingTexts = [];
  }

  reset() {
    this.particles = [];
    this.floatingTexts = [];
  }

  // Add hit spark shards
  addHitSparks(x, y, color = '#fef08a', count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      this.particles.push({
        type: 'spark',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        color,
        life: 14 + Math.floor(Math.random() * 10),
        maxLife: 24
      });
    }
  }

  // Dust cloud puffs for dashes, landing, and charging boars
  addDust(x, y, count = 4, vxOffset = 0) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'dust',
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 6,
        vx: vxOffset + (Math.random() - 0.5) * 2.5,
        vy: -0.5 - Math.random() * 1.5,
        radius: 4 + Math.random() * 6,
        color: 'rgba(215, 205, 185, 0.7)',
        life: 16 + Math.floor(Math.random() * 8),
        maxLife: 24
      });
    }
  }

  // Fire particles for Hot Ethanol Splash
  addFire(x, y, count = 5) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'fire',
        x: x + (Math.random() - 0.5) * 24,
        y: y + (Math.random() - 0.5) * 24,
        vx: (Math.random() - 0.5) * 2,
        vy: -2 - Math.random() * 3,
        radius: 3 + Math.random() * 5,
        color: Math.random() > 0.4 ? '#f97316' : '#eab308',
        life: 18 + Math.floor(Math.random() * 10),
        maxLife: 28
      });
    }
  }

  // Oil splashes for Crude Oil Geyser
  addOilSplash(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'oil',
        x: x + (Math.random() - 0.5) * 28,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: -3 - Math.random() * 4,
        radius: 3 + Math.random() * 5,
        color: '#1c1917',
        life: 25,
        maxLife: 25
      });
    }
  }

  // Toxic green bubbles for Poison Food Tray
  addPoisonBubbles(x, y, count = 4) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'poison',
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 1,
        vy: -1 - Math.random() * 2,
        radius: 3 + Math.random() * 4,
        color: '#22c55e',
        life: 22,
        maxLife: 22
      });
    }
  }

  // Sonic Shockwave Rings for Megaphone "HIDUP JOKOWI"
  addSonicRing(x, y, facing = 1) {
    this.particles.push({
      type: 'sonic',
      x,
      y,
      vx: facing * 6.5,
      radius: 12,
      maxRadius: 75,
      facing,
      life: 30,
      maxLife: 30
    });
  }

  // Floating Arcade Combat Text
  addFloatingText(text, x, y, color = '#facc15', size = 16) {
    this.floatingTexts.push({
      text,
      x,
      y,
      vy: -1.6,
      color,
      size,
      life: 45,
      maxLife: 45
    });
  }

  update() {
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life--;
      p.x += p.vx || 0;
      p.y += p.vy || 0;

      if (p.type === 'spark') {
        p.vy += 0.3; // Gravity for sparks
      } else if (p.type === 'dust') {
        p.radius *= 0.96;
      } else if (p.type === 'oil') {
        p.vy += 0.4;
      } else if (p.type === 'sonic') {
        p.radius += 2.2;
      }

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.life--;
      t.y += t.vy;
      t.vy *= 0.95;
      if (t.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    ctx.save();
    // Draw Particles
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;

      if (p.type === 'spark') {
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      } else if (p.type === 'dust') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, p.radius), 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'fire') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'oil') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'poison') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'sonic') {
        ctx.strokeStyle = `rgba(240, 249, 255, ${alpha * 0.8})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, -Math.PI / 3, Math.PI / 3, p.facing < 0);
        ctx.stroke();
      }
    }

    // Draw Floating Text
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    for (const t of this.floatingTexts) {
      const alpha = Math.max(0, t.life / t.maxLife);
      ctx.globalAlpha = alpha;
      ctx.font = `${t.size}px "Press Start 2P", monospace`;

      // Text Shadow / Stroke for retro arcade pop
      ctx.fillStyle = '#000';
      ctx.fillText(t.text, t.x - 2, t.y);
      ctx.fillText(t.text, t.x + 2, t.y);
      ctx.fillText(t.text, t.x, t.y - 2);
      ctx.fillText(t.text, t.x, t.y + 2);

      // Text Main
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, t.x, t.y);
    }
    ctx.restore();
  }
}
