// 60 FPS Canvas Fighter Entity & State Machine

import {
  CANVAS_WIDTH,
  GROUND_Y,
  GRAVITY,
  JUMP_POWER,
  WALK_SPEED,
  DASH_SPEED,
  FRICTION,
  STATES,
  ATTACK_DATA
} from './Constants.js';

export class Fighter {
  constructor({ id, name, characterId, x, facing = 1, isBot = false }) {
    this.id = id;
    this.name = name;
    this.characterId = characterId; // 'gufron', 'bahlil', 'wowo'
    this.isBot = isBot;

    // Spatial & Physics
    this.x = x;
    this.y = GROUND_Y;
    this.vx = 0;
    this.vy = 0;
    this.width = 64;
    this.height = 110;
    this.facing = facing; // 1: right, -1: left
    this.isGrounded = true;

    // Combat Stats
    this.health = 100;
    this.maxHealth = 100;
    this.energy = 0; // Super gauge (0 - 100)
    this.wins = 0;

    // State Machine
    this.state = STATES.IDLE;
    this.stateTime = 0;
    this.hitStop = 0;
    this.hitStun = 0;
    this.blockStun = 0;
    this.special1Cooldown = 0;
    this.ultimateCooldown = 0;

    // Active Attack Hitbox definition (relative to fighter x, y)
    this.hitbox = null;
    this.hasHit = false; // Prevent multi-hits per attack frame

    // Special summon entities (e.g. Babi Hutan, Oil Geyser, Poison Tray, Sonic waves)
    this.activeSummon = null;

    // Sprites cache
    this.sprites = {};
    this.loadSprites();
  }

  loadSprites() {
    const base = `/assets/sprites/${this.characterId}`;
    const poses = ['idle', 'walk', 'crouch', 'jump', 'punch', 'kick'];
    poses.forEach(pose => {
      const img = new Image();
      img.src = `${base}_${pose}.png`;
      this.sprites[pose] = img;
    });

    // Character unique action sprites
    if (this.characterId === 'gufron') {
      const babi = new Image();
      babi.src = '/assets/sprites/gufron_babi.png';
      this.sprites.babi = babi;

      const point = new Image();
      point.src = '/assets/sprites/gufron_point.png';
      this.sprites.point = point;

      const ant = new Image();
      ant.src = '/assets/vfx/ant_swarm.png';
      this.sprites.ant = ant;
    } else if (this.characterId === 'bahlil') {
      const ethStart = new Image();
      ethStart.src = '/assets/sprites/bahlil_ethanol_start.png';
      this.sprites.ethanol_start = ethStart;

      const ethAct = new Image();
      ethAct.src = '/assets/sprites/bahlil_ethanol_act.png';
      this.sprites.ethanol_act = ethAct;

      const oilStart = new Image();
      oilStart.src = '/assets/sprites/bahlil_oil_start.png';
      this.sprites.oil_start = oilStart;

      const oilGey = new Image();
      oilGey.src = '/assets/vfx/oil_geyser.png';
      this.sprites.oil_geyser = oilGey;
    } else if (this.characterId === 'wowo') {
      const trayStart = new Image();
      trayStart.src = '/assets/sprites/wowo_tray_start.png';
      this.sprites.tray_start = trayStart;

      const trayImp = new Image();
      trayImp.src = '/assets/vfx/wowo_tray_impact.png';
      this.sprites.tray_impact = trayImp;

      const sonic = new Image();
      sonic.src = '/assets/vfx/wowo_sonic_wave.png';
      this.sprites.sonic = sonic;
    }
  }

  // Get bounding hurtbox for incoming hits
  getHurtbox() {
    const isCrouching = this.state === STATES.CROUCH;
    const h = isCrouching ? this.height * 0.65 : this.height;
    const y = isCrouching ? this.y - h : this.y - this.height;
    return {
      x: this.x - this.width / 2,
      y,
      width: this.width,
      height: h
    };
  }

  // Handle Input Commands
  handleInput(input, opponent) {
    if (this.health <= 0 || this.state === STATES.KO || this.state === STATES.VICTORY) return;
    if (this.hitStop > 0 || this.hitStun > 0 || this.state === STATES.STUN) return;

    // Face the opponent if idle or walking
    if (opponent && [STATES.IDLE, STATES.WALK_FWD, STATES.WALK_BACK].includes(this.state)) {
      this.facing = this.x < opponent.x ? 1 : -1;
    }

    // Attacks have priority
    if (input.ultimate && this.canAttack() && this.energy >= ATTACK_DATA.ULTIMATE.energyCost && this.ultimateCooldown <= 0) {
      this.executeAttack(STATES.ULTIMATE);
      this.energy = Math.max(0, this.energy - ATTACK_DATA.ULTIMATE.energyCost);
      this.ultimateCooldown = ATTACK_DATA.ULTIMATE.cooldown;
      return;
    }

    if (input.special1 && this.canAttack() && this.energy >= ATTACK_DATA.SPECIAL_1.energyCost && this.special1Cooldown <= 0) {
      this.executeAttack(STATES.SPECIAL_1);
      this.energy = Math.max(0, this.energy - ATTACK_DATA.SPECIAL_1.energyCost);
      this.special1Cooldown = ATTACK_DATA.SPECIAL_1.cooldown;
      return;
    }

    if (input.punch && this.canAttack()) {
      this.executeAttack(STATES.PUNCH);
      return;
    }

    if (input.kick && this.canAttack()) {
      this.executeAttack(STATES.KICK);
      return;
    }

    // Jump
    if (input.up && this.isGrounded && [STATES.IDLE, STATES.WALK_FWD, STATES.WALK_BACK].includes(this.state)) {
      this.vy = JUMP_POWER;
      this.isGrounded = false;
      this.state = STATES.JUMP;
      this.stateTime = 0;
      return;
    }

    // Crouch & Block
    if (input.down && this.isGrounded) {
      this.state = STATES.CROUCH;
      this.vx = 0;
      return;
    }

    // Walk Left / Right
    if (this.isGrounded && ![STATES.PUNCH, STATES.KICK, STATES.SPECIAL_1, STATES.ULTIMATE, STATES.HURT, STATES.KNOCKDOWN].includes(this.state)) {
      if (input.left) {
        this.vx = -WALK_SPEED;
        this.state = this.facing === -1 ? STATES.WALK_FWD : STATES.WALK_BACK;
      } else if (input.right) {
        this.vx = WALK_SPEED;
        this.state = this.facing === 1 ? STATES.WALK_FWD : STATES.WALK_BACK;
      } else {
        this.vx = 0;
        this.state = STATES.IDLE;
      }
    }
  }

  canAttack() {
    return [STATES.IDLE, STATES.WALK_FWD, STATES.WALK_BACK, STATES.CROUCH, STATES.JUMP].includes(this.state);
  }

  executeAttack(attackState) {
    this.state = attackState;
    this.stateTime = 0;
    this.hasHit = false;
    this.hitbox = null;

    // If on ground, stop horizontal movement
    if (this.isGrounded) {
      this.vx = 0;
    }
  }

  update(particles, opponent) {
    // Cooldown ticks
    if (this.special1Cooldown > 0) this.special1Cooldown--;
    if (this.ultimateCooldown > 0) this.ultimateCooldown--;

    // Hit-stop freeze frames
    if (this.hitStop > 0) {
      this.hitStop--;
      return;
    }

    // Hit-stun / Block-stun ticks
    if (this.hitStun > 0) {
      this.hitStun--;
      if (this.hitStun === 0 && this.health > 0) {
        this.state = STATES.IDLE;
      }
    }
    if (this.blockStun > 0) {
      this.blockStun--;
      if (this.blockStun === 0) {
        this.state = STATES.IDLE;
      }
    }

    this.stateTime++;

    // Gravity & Physics
    if (!this.isGrounded) {
      this.vy += GRAVITY;
    }
    this.x += this.vx;
    this.y += this.vy;

    // Ground collision
    if (this.y >= GROUND_Y) {
      this.y = GROUND_Y;
      this.vy = 0;
      if (!this.isGrounded) {
        this.isGrounded = true;
        particles.addDust(this.x, GROUND_Y, 5);
        if (this.state === STATES.JUMP) {
          this.state = STATES.IDLE;
        }
      }
    }

    // Screen Boundary collision
    const halfW = this.width / 2;
    if (this.x - halfW < 30) {
      this.x = 30 + halfW;
      this.vx = 0;
    }
    if (this.x + halfW > CANVAS_WIDTH - 30) {
      this.x = CANVAS_WIDTH - 30 - halfW;
      this.vx = 0;
    }

    // Apply horizontal friction when grounded
    if (this.isGrounded && [STATES.IDLE, STATES.CROUCH, STATES.HURT, STATES.KNOCKDOWN].includes(this.state)) {
      this.vx *= FRICTION;
    }

    // Attack State Frame Progress & Hitbox Generation
    this.updateAttackFrames(particles, opponent);

    // Update active summons
    if (this.activeSummon) {
      this.activeSummon.update(particles, opponent, this);
      if (this.activeSummon.isExpired) {
        this.activeSummon = null;
      }
    }
  }

  updateAttackFrames(particles, opponent) {
    if (this.state === STATES.PUNCH) {
      const cfg = ATTACK_DATA.PUNCH;
      if (this.stateTime >= cfg.hitStart && this.stateTime <= cfg.hitEnd && !this.hasHit) {
        this.hitbox = {
          x: this.facing === 1 ? this.x + 15 : this.x - 65,
          y: this.y - 75,
          width: 50,
          height: 35,
          damage: cfg.damage,
          knockback: { x: cfg.knockback.x * this.facing, y: cfg.knockback.y },
          hitStop: cfg.hitStop,
          type: cfg.type
        };
      } else {
        this.hitbox = null;
      }
      if (this.stateTime >= cfg.duration) {
        this.state = STATES.IDLE;
        this.hitbox = null;
      }
    } else if (this.state === STATES.KICK) {
      const cfg = ATTACK_DATA.KICK;
      if (this.stateTime >= cfg.hitStart && this.stateTime <= cfg.hitEnd && !this.hasHit) {
        this.hitbox = {
          x: this.facing === 1 ? this.x + 20 : this.x - 75,
          y: this.y - 45,
          width: 55,
          height: 40,
          damage: cfg.damage,
          knockback: { x: cfg.knockback.x * this.facing, y: cfg.knockback.y },
          hitStop: cfg.hitStop,
          type: cfg.type
        };
      } else {
        this.hitbox = null;
      }
      if (this.stateTime >= cfg.duration) {
        this.state = STATES.IDLE;
        this.hitbox = null;
      }
    } else if (this.state === STATES.SPECIAL_1) {
      const cfg = ATTACK_DATA.SPECIAL_1;
      // Trigger character unique summon on startup frame 10
      if (this.stateTime === 10) {
        this.triggerSpecialSummon(particles, opponent);
      }
      if (this.stateTime >= cfg.duration) {
        this.state = STATES.IDLE;
      }
    } else if (this.state === STATES.ULTIMATE) {
      const cfg = ATTACK_DATA.ULTIMATE;
      if (this.stateTime === 12) {
        this.triggerUltimateSummon(particles, opponent);
      }
      if (this.stateTime >= cfg.duration) {
        this.state = STATES.IDLE;
      }
    }
  }

  triggerSpecialSummon(particles, opponent) {
    if (this.characterId === 'gufron') {
      // Babi Hutan Charge
      this.activeSummon = {
        type: 'babi_charge',
        x: this.x,
        y: GROUND_Y - 55,
        vx: this.facing * 9.0,
        facing: this.facing,
        life: 65,
        hasHit: false,
        update: (part, opp, owner) => {
          this.activeSummon.x += this.activeSummon.vx;
          this.activeSummon.life--;
          part.addDust(this.activeSummon.x, GROUND_Y, 2, -this.activeSummon.vx * 0.4);

          // Hitbox check
          if (!this.activeSummon.hasHit && opp) {
            const oppHurt = opp.getHurtbox();
            if (
              Math.abs(this.activeSummon.x - opp.x) < 55 &&
              Math.abs(this.activeSummon.y - (opp.y - opp.height / 2)) < 60
            ) {
              this.activeSummon.hasHit = true;
              opp.takeHit({
                damage: ATTACK_DATA.SPECIAL_1.damage,
                knockback: { x: this.activeSummon.facing * 10, y: -7 },
                hitStop: 8,
                status: 'KNOCKED!'
              }, part, owner);
            }
          }
          if (this.activeSummon.life <= 0 || this.activeSummon.x < -100 || this.activeSummon.x > CANVAS_WIDTH + 100) {
            this.activeSummon.isExpired = true;
          }
        },
        draw: (ctx) => {
          ctx.save();
          ctx.translate(this.activeSummon.x, this.activeSummon.y);
          if (this.activeSummon.facing === -1) ctx.scale(-1, 1);
          if (this.sprites.babi && this.sprites.babi.complete) {
            ctx.drawImage(this.sprites.babi, -65, -55, 130, 110);
          } else {
            // Procedural wild boar
            ctx.fillStyle = '#451a03';
            ctx.fillRect(-45, -25, 90, 50);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(25, -15, 6, 6); // Red glowing eyes
          }
          ctx.restore();
        }
      };
    } else if (this.characterId === 'bahlil') {
      // Hot Ethanol Splash
      this.activeSummon = {
        type: 'ethanol_splash',
        x: this.x + this.facing * 40,
        y: this.y - 70,
        vx: this.facing * 7.5,
        vy: -1.5,
        life: 45,
        hasHit: false,
        update: (part, opp, owner) => {
          this.activeSummon.x += this.activeSummon.vx;
          this.activeSummon.y += this.activeSummon.vy;
          this.activeSummon.vy += 0.18; // slight drop
          this.activeSummon.life--;
          part.addFire(this.activeSummon.x, this.activeSummon.y, 4);

          if (!this.activeSummon.hasHit && opp) {
            if (Math.abs(this.activeSummon.x - opp.x) < 45 && Math.abs(this.activeSummon.y - (opp.y - opp.height / 2)) < 55) {
              this.activeSummon.hasHit = true;
              opp.takeHit({
                damage: ATTACK_DATA.SPECIAL_1.damage,
                knockback: { x: this.activeSummon.vx * 0.9, y: -4 },
                hitStop: 8,
                status: 'FIRE!'
              }, part, owner);
            }
          }
          if (this.activeSummon.life <= 0 || this.activeSummon.y >= GROUND_Y) {
            this.activeSummon.isExpired = true;
          }
        },
        draw: (ctx) => {
          ctx.save();
          ctx.translate(this.activeSummon.x, this.activeSummon.y);
          if (this.sprites.ethanol_act && this.sprites.ethanol_act.complete) {
            ctx.drawImage(this.sprites.ethanol_act, -50, -45, 100, 90);
          } else {
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      };
    } else if (this.characterId === 'wowo') {
      // Tray Makan Racun
      this.activeSummon = {
        type: 'poison_tray',
        x: this.x + this.facing * 35,
        y: this.y - 65,
        vx: this.facing * 6.5,
        vy: -4.5,
        life: 90,
        grounded: false,
        hasHit: false,
        update: (part, opp, owner) => {
          if (!this.activeSummon.grounded) {
            this.activeSummon.x += this.activeSummon.vx;
            this.activeSummon.y += this.activeSummon.vy;
            this.activeSummon.vy += 0.35;
            if (this.activeSummon.y >= GROUND_Y - 5) {
              this.activeSummon.y = GROUND_Y - 5;
              this.activeSummon.grounded = true;
              part.addPoisonBubbles(this.activeSummon.x, GROUND_Y, 8);
            }
          } else {
            // Lingering bubbling toxic pool
            part.addPoisonBubbles(this.activeSummon.x, GROUND_Y, 1);
          }
          this.activeSummon.life--;

          // Contact check
          if (opp && Math.abs(this.activeSummon.x - opp.x) < 40 && opp.isGrounded && this.activeSummon.life % 20 === 0) {
            opp.takeHit({
              damage: 7,
              knockback: { x: this.activeSummon.vx * 0.2, y: -1 },
              hitStop: 3,
              status: 'POISONED!'
            }, part, owner);
          }

          if (this.activeSummon.life <= 0) {
            this.activeSummon.isExpired = true;
          }
        },
        draw: (ctx) => {
          ctx.save();
          ctx.translate(this.activeSummon.x, this.activeSummon.y);
          if (this.activeSummon.grounded) {
            // Puddle
            ctx.fillStyle = 'rgba(34, 197, 94, 0.7)';
            ctx.beginPath();
            ctx.ellipse(0, 0, 45, 10, 0, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Flying tray
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(-18, -10, 36, 20);
          }
          ctx.restore();
        }
      };
    }
  }

  triggerUltimateSummon(particles, opponent) {
    if (!opponent) return;

    if (this.characterId === 'gufron') {
      // Jurus Semut Gaib: Erupts right under opponent
      this.activeSummon = {
        type: 'ant_swarm',
        x: opponent.x,
        y: GROUND_Y,
        life: 100,
        tick: 0,
        update: (part, opp, owner) => {
          this.activeSummon.tick++;
          this.activeSummon.life--;

          // Erupt dust and multiple hits
          if (this.activeSummon.tick % 12 === 0) {
            part.addHitSparks(this.activeSummon.x, GROUND_Y - 40, '#78350f', 6);
            opp.takeHit({
              damage: 8,
              knockback: { x: 0, y: -2 },
              hitStop: 4,
              status: 'GNAW!'
            }, part, owner);
          }

          if (this.activeSummon.life <= 0) {
            this.activeSummon.isExpired = true;
          }
        },
        draw: (ctx) => {
          ctx.save();
          ctx.translate(this.activeSummon.x, this.activeSummon.y);
          if (this.sprites.ant && this.sprites.ant.complete) {
            ctx.drawImage(this.sprites.ant, -65, -120, 130, 120);
          } else {
            ctx.fillStyle = '#3e2723';
            ctx.beginPath();
            ctx.arc(0, -40, 50, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      };
    } else if (this.characterId === 'bahlil') {
      // Earth Oil Geyser: Geyser beneath opponent trapping them
      this.activeSummon = {
        type: 'oil_geyser',
        x: opponent.x,
        y: GROUND_Y,
        life: 90,
        tick: 0,
        update: (part, opp, owner) => {
          this.activeSummon.tick++;
          this.activeSummon.life--;
          part.addOilSplash(this.activeSummon.x, GROUND_Y, 3);

          if (this.activeSummon.tick % 15 === 0) {
            opp.takeHit({
              damage: 10,
              knockback: { x: 0, y: -4 },
              hitStop: 5,
              status: 'TRAP!'
            }, part, owner);
          }

          if (this.activeSummon.life <= 0) {
            this.activeSummon.isExpired = true;
          }
        },
        draw: (ctx) => {
          ctx.save();
          ctx.translate(this.activeSummon.x, this.activeSummon.y);
          if (this.sprites.oil_geyser && this.sprites.oil_geyser.complete) {
            ctx.drawImage(this.sprites.oil_geyser, -60, -130, 120, 130);
          } else {
            ctx.fillStyle = '#171717';
            ctx.fillRect(-35, -110, 70, 110);
          }
          ctx.restore();
        }
      };
    } else if (this.characterId === 'wowo') {
      // Megaphone Sonic Drone: Expanding shockwave
      this.activeSummon = {
        type: 'sonic_scream',
        x: this.x + this.facing * 40,
        y: this.y - 70,
        facing: this.facing,
        life: 80,
        tick: 0,
        hasHit: false,
        update: (part, opp, owner) => {
          this.activeSummon.tick++;
          this.activeSummon.life--;
          if (this.activeSummon.tick % 10 === 0) {
            part.addSonicRing(this.activeSummon.x, this.activeSummon.y, this.activeSummon.facing);
          }

          if (!this.activeSummon.hasHit && opp) {
            const dist = (opp.x - this.activeSummon.x) * this.activeSummon.facing;
            if (dist > 0 && dist < 280 && Math.abs(opp.y - this.activeSummon.y) < 90) {
              this.activeSummon.hasHit = true;
              opp.state = STATES.STUN;
              opp.hitStun = 90; // 1.5 second stun!
              opp.takeHit({
                damage: ATTACK_DATA.ULTIMATE.damage,
                knockback: { x: this.activeSummon.facing * 12, y: -6 },
                hitStop: 10,
                status: 'STUNNED!'
              }, part, owner);
            }
          }

          if (this.activeSummon.life <= 0) {
            this.activeSummon.isExpired = true;
          }
        },
        draw: (ctx) => {
          ctx.save();
          ctx.translate(this.activeSummon.x, this.activeSummon.y);
          if (this.activeSummon.facing === -1) ctx.scale(-1, 1);
          if (this.sprites.sonic && this.sprites.sonic.complete) {
            ctx.drawImage(this.sprites.sonic, 10, -50, 180, 100);
          }
          ctx.restore();
        }
      };
    }
  }

  takeHit(attackInfo, particles, attacker) {
    if (this.health <= 0) return;

    // Check if Blocking (Holding back away from attacker)
    const isHoldingBack = (this.x < attacker.x && this.vx < 0) || (this.x > attacker.x && this.vx > 0);
    const isBlocking = isHoldingBack && this.isGrounded && ![STATES.PUNCH, STATES.KICK, STATES.SPECIAL_1, STATES.ULTIMATE, STATES.HURT, STATES.STUN].includes(this.state);

    if (isBlocking) {
      this.state = STATES.BLOCK;
      this.blockStun = 14;
      this.health = Math.max(0, this.health - Math.floor(attackInfo.damage * 0.2));
      this.vx = (this.x < attacker.x ? -1 : 1) * 3;
      particles.addHitSparks(this.x, this.y - 60, '#38bdf8', 6);
      particles.addFloatingText('GUARD', this.x, this.y - 90, '#38bdf8', 12);
      return;
    }

    // Direct Hit
    this.health = Math.max(0, this.health - attackInfo.damage);
    this.hitStun = 20;
    this.hitStop = attackInfo.hitStop || 4;
    this.vx = attackInfo.knockback.x || (this.x < attacker.x ? -5 : 5);
    this.vy = attackInfo.knockback.y || -3;
    if (this.vy < 0) this.isGrounded = false;

    // Gain Energy when hit and when attacking
    this.energy = Math.min(100, this.energy + 8);
    attacker.energy = Math.min(100, attacker.energy + 14);

    // Particle hit sparks & floating damage
    particles.addHitSparks(this.x, this.y - 65, '#facc15', 14);
    particles.addFloatingText(attackInfo.status || `-${attackInfo.damage}`, this.x, this.y - 95, '#ef4444', 16);

    if (this.health <= 0) {
      this.state = STATES.KO;
      this.vx *= 1.5;
      this.vy = -7;
      this.isGrounded = false;
    } else {
      this.state = STATES.HURT;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(Math.floor(this.x), Math.floor(this.y));

    // Flip sprite horizontally when facing left
    if (this.facing === -1) {
      ctx.scale(-1, 1);
    }

    // Select sprite pose based on state
    let poseImg = this.sprites.idle;
    if (this.state === STATES.WALK_FWD || this.state === STATES.WALK_BACK) poseImg = this.sprites.walk;
    else if (this.state === STATES.CROUCH) poseImg = this.sprites.crouch;
    else if (this.state === STATES.JUMP) poseImg = this.sprites.jump;
    else if (this.state === STATES.PUNCH) poseImg = this.sprites.punch;
    else if (this.state === STATES.KICK) poseImg = this.sprites.kick;
    else if (this.state === STATES.SPECIAL_1 && this.sprites.point) poseImg = this.sprites.point;
    else if (this.state === STATES.SPECIAL_1 && this.sprites.ethanol_start) poseImg = this.sprites.ethanol_start;
    else if (this.state === STATES.SPECIAL_1 && this.sprites.tray_start) poseImg = this.sprites.tray_start;
    else if (this.state === STATES.ULTIMATE && this.sprites.oil_start) poseImg = this.sprites.oil_start;

    // Draw sprite if loaded, else procedural pixel box
    if (poseImg && poseImg.complete && poseImg.naturalWidth > 0) {
      const h = 120;
      const w = Math.round(poseImg.naturalWidth * (h / poseImg.naturalHeight));
      ctx.drawImage(poseImg, -w / 2, -h, w, h);
    } else {
      // Fallback procedural retro fighter silhouette
      ctx.fillStyle = this.characterId === 'gufron' ? '#1e293b' : this.characterId === 'bahlil' ? '#1e3a8a' : '#f8fafc';
      ctx.fillRect(-this.width / 2, -this.height, this.width, this.height);
    }

    ctx.restore();

    // Draw active summon
    if (this.activeSummon && this.activeSummon.draw) {
      this.activeSummon.draw(ctx);
    }
  }
}
