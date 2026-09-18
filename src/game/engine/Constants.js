// Canvas 2D Fighting Engine Constants & Game Rules

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 450;
export const GROUND_Y = 360;

export const GRAVITY = 0.72;
export const JUMP_POWER = -15.5;
export const WALK_SPEED = 4.2;
export const DASH_SPEED = 7.5;
export const FRICTION = 0.82;

// Fighter States
export const STATES = {
  IDLE: 'IDLE',
  WALK_FWD: 'WALK_FWD',
  WALK_BACK: 'WALK_BACK',
  CROUCH: 'CROUCH',
  JUMP: 'JUMP',
  PUNCH: 'PUNCH',
  KICK: 'KICK',
  SPECIAL_1: 'SPECIAL_1',
  ULTIMATE: 'ULTIMATE',
  HURT: 'HURT',
  BLOCK: 'BLOCK',
  STUN: 'STUN',
  KNOCKDOWN: 'KNOCKDOWN',
  KO: 'KO',
  VICTORY: 'VICTORY'
};

// Attack Frame Configurations
export const ATTACK_DATA = {
  PUNCH: {
    duration: 18,     // frames (~300ms)
    hitStart: 4,
    hitEnd: 11,
    damage: 8,
    knockback: { x: 3.5, y: -2.0 },
    hitStop: 4,
    energyGain: 8,
    type: 'mid'
  },
  KICK: {
    duration: 22,
    hitStart: 6,
    hitEnd: 14,
    damage: 12,
    knockback: { x: 5.5, y: -3.5 },
    hitStop: 5,
    energyGain: 12,
    type: 'low'
  },
  SPECIAL_1: {
    duration: 45,
    hitStart: 12,
    hitEnd: 38,
    damage: 22,
    knockback: { x: 9.0, y: -6.0 },
    hitStop: 7,
    cooldown: 180, // frames (3s)
    energyCost: 35,
    type: 'special'
  },
  ULTIMATE: {
    duration: 75,
    hitStart: 15,
    hitEnd: 65,
    damage: 42,
    knockback: { x: 12.0, y: -8.0 },
    hitStop: 12,
    cooldown: 450, // frames (7.5s)
    energyCost: 100,
    type: 'ultimate'
  }
};
