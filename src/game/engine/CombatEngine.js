// 60 FPS Combat Collision, Round State & Match Orchestrator

import { STATES } from './Constants.js';
import { SoundEngine } from '../audio/SoundEngine.js';

export class CombatEngine {
  constructor(fighter1, fighter2, particleSystem, onMatchEvent) {
    this.f1 = fighter1;
    this.f2 = fighter2;
    this.particles = particleSystem;
    this.onMatchEvent = onMatchEvent; // Callback for UI updates (score, round, winner)

    this.round = 1;
    this.roundTimer = 99;
    this.timerTick = 0;
    this.roundState = 'START'; // 'START', 'FIGHT', 'KO', 'TIMEOVER'
    this.stateTimer = 120; // 2 seconds startup intro

    this.screenShake = 0;
    this.f1Combo = 0;
    this.f2Combo = 0;
    this.koReason = 'K.O.!';
  }

  resetRound() {
    this.f1.x = 220;
    this.f1.y = 360;
    this.f1.vx = 0;
    this.f1.vy = 0;
    this.f1.health = this.f1.maxHealth;
    this.f1.state = STATES.IDLE;
    this.f1.facing = 1;
    this.f1.activeSummon = null;

    this.f2.x = 580;
    this.f2.y = 360;
    this.f2.vx = 0;
    this.f2.vy = 0;
    this.f2.health = this.f2.maxHealth;
    this.f2.state = STATES.IDLE;
    this.f2.facing = -1;
    this.f2.activeSummon = null;

    this.particles.reset();
    this.roundTimer = 99;
    this.timerTick = 0;
    this.roundState = 'START';
    this.stateTimer = 120;
    this.f1Combo = 0;
    this.f2Combo = 0;
    this.koReason = 'K.O.!';

    SoundEngine.playRoundBell();
  }

  update() {
    // Screen shake decay
    if (this.screenShake > 0) this.screenShake--;

    // Round Startup State ("ROUND 1... FIGHT!")
    if (this.roundState === 'START') {
      this.stateTimer--;
      if (this.stateTimer === 60) {
        SoundEngine.playRoundBell();
      }
      if (this.stateTimer <= 0) {
        this.roundState = 'FIGHT';
      }
      return;
    }

    // Round Over / KO State
    if (this.roundState === 'KO' || this.roundState === 'TIMEOVER') {
      this.stateTimer--;
      this.f1.update(this.particles, this.f2);
      this.f2.update(this.particles, this.f1);
      this.particles.update();

      if (this.stateTimer <= 0) {
        // Next round or match finish
        this.checkMatchProgression();
      }
      return;
    }

    // FIGHTING STATE
    // 1. Timer countdown (60 ticks = 1 second)
    this.timerTick++;
    if (this.timerTick >= 60) {
      this.timerTick = 0;
      if (this.roundTimer > 0) {
        this.roundTimer--;
      }
      if (this.roundTimer <= 0) {
        this.handleTimeOver();
        return;
      }
    }

    // 2. Update Fighters & Particle System
    this.f1.update(this.particles, this.f2);
    this.f2.update(this.particles, this.f1);
    this.particles.update();

    // 3. Prevent Fighters from walking through each other
    this.resolvePushbox(this.f1, this.f2);

    // 4. Hitbox vs Hurtbox Collisions
    this.checkHitboxCollision(this.f1, this.f2);
    this.checkHitboxCollision(this.f2, this.f1);

    // 5. Check Health & K.O.
    if (this.f1.health <= 0 || this.f2.health <= 0) {
      this.handleKO();
    }
  }

  resolvePushbox(a, b) {
    const minDist = 45;
    const dx = b.x - a.x;
    if (Math.abs(dx) < minDist && a.isGrounded && b.isGrounded) {
      const push = (minDist - Math.abs(dx)) / 2;
      if (dx > 0) {
        a.x -= push;
        b.x += push;
      } else {
        a.x += push;
        b.x -= push;
      }
    }
  }

  checkHitboxCollision(attacker, defender) {
    if (!attacker.hitbox || attacker.hasHit) return;

    const hb = attacker.hitbox;
    const hurt = defender.getHurtbox();

    // AABB Overlap check
    const isColliding =
      hb.x < hurt.x + hurt.width &&
      hb.x + hb.width > hurt.x &&
      hb.y < hurt.y + hurt.height &&
      hb.y + hb.height > hurt.y;

    if (isColliding) {
      attacker.hasHit = true;
      attacker.hitStop = hb.hitStop || 4;

      // Audio trigger
      if (hb.type === 'punch') {
        SoundEngine.playPunch();
      } else if (hb.type === 'kick') {
        SoundEngine.playKick();
      }

      // Screen shake
      this.screenShake = hb.damage > 15 ? 12 : 5;

      // Combo increment
      if (attacker === this.f1) {
        this.f1Combo++;
        if (this.f1Combo > 1) {
          this.particles.addFloatingText(`${this.f1Combo} HITS!`, attacker.x, attacker.y - 120, '#fbbf24', 18);
        }
      } else {
        this.f2Combo++;
        if (this.f2Combo > 1) {
          this.particles.addFloatingText(`${this.f2Combo} HITS!`, attacker.x, attacker.y - 120, '#fbbf24', 18);
        }
      }

      // Check special move signature KO text
      if (attacker.characterId === 'gufron' && attacker.state === STATES.ULTIMATE) {
        this.koReason = 'K.O. BY SWARM';
      } else {
        this.koReason = 'K.O.!';
      }

      // Deliver hit to defender
      defender.takeHit(hb, this.particles, attacker);
    }
  }

  handleKO() {
    this.roundState = 'KO';
    this.stateTimer = 180; // 3 seconds celebration
    this.screenShake = 18;
    SoundEngine.playKO();

    if (this.f1.health <= 0) {
      this.f2.wins++;
      this.f2.state = STATES.VICTORY;
      this.particles.addFloatingText(this.koReason, 400, 180, '#ef4444', 28);
    } else {
      this.f1.wins++;
      this.f1.state = STATES.VICTORY;
      this.particles.addFloatingText(this.koReason, 400, 180, '#ef4444', 28);
    }

    if (this.onMatchEvent) {
      this.onMatchEvent('ROUND_END', {
        f1Wins: this.f1.wins,
        f2Wins: this.f2.wins,
        winner: this.f1.health > 0 ? this.f1.name : this.f2.name
      });
    }
  }

  handleTimeOver() {
    this.roundState = 'TIMEOVER';
    this.stateTimer = 180;
    SoundEngine.playKO();

    if (this.f1.health > this.f2.health) {
      this.f1.wins++;
      this.f1.state = STATES.VICTORY;
    } else if (this.f2.health > this.f1.health) {
      this.f2.wins++;
      this.f2.state = STATES.VICTORY;
    }

    this.particles.addFloatingText('TIME OVER', 400, 180, '#eab308', 26);

    if (this.onMatchEvent) {
      this.onMatchEvent('ROUND_END', {
        f1Wins: this.f1.wins,
        f2Wins: this.f2.wins,
        winner: this.f1.health > this.f2.health ? this.f1.name : this.f2.name
      });
    }
  }

  checkMatchProgression() {
    // Best of 3 (first to 2 wins)
    if (this.f1.wins >= 2 || this.f2.wins >= 2) {
      const matchWinner = this.f1.wins >= 2 ? this.f1 : this.f2;
      if (this.onMatchEvent) {
        this.onMatchEvent('MATCH_OVER', {
          winner: matchWinner.name,
          winnerId: matchWinner.characterId,
          isF1Winner: matchWinner === this.f1
        });
      }
    } else {
      this.round++;
      this.resetRound();
    }
  }
}
