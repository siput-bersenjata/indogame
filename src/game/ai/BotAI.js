// Smart 4-Tier Fighting AI Engine for IndoGame Singleplayer

import { STATES } from '../engine/Constants.js';

export class BotAI {
  constructor(botFighter, playerFighter, difficulty = 'MEDIUM') {
    this.bot = botFighter;
    this.player = playerFighter;
    this.difficulty = difficulty.toUpperCase(); // 'EASY', 'MEDIUM', 'HARD', 'EXPERT'

    this.decisionTimer = 0;
    this.currentInput = {
      left: false,
      right: false,
      up: false,
      down: false,
      punch: false,
      kick: false,
      special1: false,
      ultimate: false
    };

    this.config = this.getDifficultyConfig();
  }

  setDifficulty(diff) {
    this.difficulty = diff.toUpperCase();
    this.config = this.getDifficultyConfig();
  }

  getDifficultyConfig() {
    switch (this.difficulty) {
      case 'EASY':
        return {
          decisionInterval: 35, // slow reactions (~600ms)
          blockChance: 0.12,
          attackChance: 0.35,
          specialChance: 0.15,
          spacingRange: 130
        };
      case 'HARD':
        return {
          decisionInterval: 10, // fast reactions (~160ms)
          blockChance: 0.75,
          attackChance: 0.70,
          specialChance: 0.55,
          spacingRange: 75
        };
      case 'EXPERT':
        return {
          decisionInterval: 4, // frame-perfect (~60ms)
          blockChance: 0.90,
          attackChance: 0.85,
          specialChance: 0.75,
          spacingRange: 60
        };
      case 'MEDIUM':
      default:
        return {
          decisionInterval: 20, // normal reactions (~330ms)
          blockChance: 0.40,
          attackChance: 0.50,
          specialChance: 0.30,
          spacingRange: 90
        };
    }
  }

  update() {
    this.resetInput();

    if (this.bot.health <= 0 || this.player.health <= 0) return this.currentInput;

    const dx = this.player.x - this.bot.x;
    const distance = Math.abs(dx);
    const isPlayerAttacking = [
      STATES.PUNCH,
      STATES.KICK,
      STATES.SPECIAL_1,
      STATES.ULTIMATE
    ].includes(this.player.state);

    // 1. Reactive Defense (Incoming player attack)
    if (isPlayerAttacking && distance < 120 && Math.random() < this.config.blockChance) {
      // Hold away to block
      if (dx > 0) {
        this.currentInput.left = true;
      } else {
        this.currentInput.right = true;
      }
      // Crouch block if player kicking
      if (this.player.state === STATES.KICK) {
        this.currentInput.down = true;
      }
      return this.currentInput;
    }

    // 2. Periodic Decision Loop
    this.decisionTimer--;
    if (this.decisionTimer <= 0) {
      this.decisionTimer = this.config.decisionInterval + Math.floor(Math.random() * 5);

      // Ultimate execution if energy is full and within range
      if (this.bot.energy >= 100 && this.bot.ultimateCooldown <= 0 && Math.random() < this.config.specialChance) {
        this.currentInput.ultimate = true;
        return this.currentInput;
      }

      // Special 1 execution if available
      if (this.bot.energy >= 35 && this.bot.special1Cooldown <= 0 && Math.random() < this.config.specialChance) {
        this.currentInput.special1 = true;
        return this.currentInput;
      }

      // Close Combat Attack Range
      if (distance <= this.config.spacingRange) {
        if (Math.random() < this.config.attackChance) {
          // Mix between Punch and Kick
          if (Math.random() > 0.45) {
            this.currentInput.punch = true;
          } else {
            this.currentInput.kick = true;
          }
        } else {
          // Tactical retreat or crouch
          if (Math.random() > 0.5) {
            this.currentInput.down = true;
          } else {
            if (dx > 0) this.currentInput.left = true;
            else this.currentInput.right = true;
          }
        }
      } else {
        // Approach Player
        if (dx > 0) {
          this.currentInput.right = true;
        } else {
          this.currentInput.left = true;
        }

        // Occasional jump-in attack
        if (distance > 160 && distance < 260 && Math.random() < 0.20 && this.bot.isGrounded) {
          this.currentInput.up = true;
          if (Math.random() > 0.5) this.currentInput.kick = true;
        }
      }
    }

    return this.currentInput;
  }

  resetInput() {
    this.currentInput.left = false;
    this.currentInput.right = false;
    this.currentInput.up = false;
    this.currentInput.down = false;
    this.currentInput.punch = false;
    this.currentInput.kick = false;
    this.currentInput.special1 = false;
    this.currentInput.ultimate = false;
  }
}
