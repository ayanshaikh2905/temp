export const COLORS = {
  paper: 0xe7d8b8,
  stone: 0x777d7b,
  stoneDark: 0x4c5557,
  mountainFar: 0x9caeb2,
  mountainMid: 0x718990,
  ink: 0x171b1b,
  red: 0x9d302c,
  mist: 0x9b9b91,
  white: 0xf3ead5,
  skin: 0xd8c6a5,
  robe: 0x2d3539,
  robeGrey: 0x66757a,
  wood: 0x735542,
  straw: 0xb69a62
}

export const WORLD = {
  arenaRadius: 10,
  arenaHeight: 0.6,
  stairCount: 9,
  stairWidth: 9,
  stairDepth: 1.2,
  stairRise: 0.45,
  toriiHeight: 7,
  outlineThickness: 0.04,
  mountainCount: 5,
  mountainDepth: 24
}

export const PLAYER = {
  radius: 0.45,
  height: 1.85,
  speed: 4.2,
  spawn: { x: 0, z: 7 },
  stairLimitX: 4.1,
  stairStartZ: 10.4,
  stairEndZ: 21
}

export const CAMERA = {
  distance: 6,
  shoulder: 0.55,
  follow: 5,
  fov: 48,
  near: 0.1,
  far: 180,
  sensitivity: 0.0025,
  minPitch: -0.15,
  maxPitch: 1.2,
  invertY: false
}

export const PHYSICS = {
  gravity: -24,
  accel: 14,
  decel: 18,
  turnRate: 10,
  actionTurnRate: 4,
  groundSnap: 0.18,
  impulseDamping: 7,
  sprintSpeed: 6.2
}

export const BODY = {
  hipHeight: 0.95,
  thighLength: 0.44,
  shinLength: 0.44,
  ankleHeight: 0.08,
  footLength: 0.26,
  pelvisChest: 0.3,
  chestShoulders: 0.28,
  shoulderHalfWidth: 0.21,
  upperArmLength: 0.28,
  foreArmLength: 0.26,
  handLength: 0.1,
  neckLength: 0.08,
  headRadius: 0.14
}

export const GAIT = {
  strideLength: 1.3,
  stepHeight: 0.11,
  pelvisBob: 0.025,
  pelvisSway: 0.018,
  torsoTwist: 0.08
}

export const SECONDARY = {
  hatSpring: 18,
  sashGravity: -14,
  sashDrag: 0.86,
  sashLength: 0.12
}

export const ROLL = {
  cost: 20,
  duration: 0.5,
  distance: 4.5,
  backstepDistance: 3,
  invincibleStart: 0.05,
  invincibleEnd: 0.32
}

export const ATTACK = {
  cost: 18,
  windup: 0.2,
  active: 0.12,
  recovery: 0.3,
  step: 0.8,
  arc: Math.PI * 110 / 180,
  range: 2.2,
  damage: 12
}

export const STAMINA = {
  max: 100,
  regen: 35,
  regenDelay: 0.8,
  emptyDelay: 1.2
}

export const FEEDBACK = {
  hitStop: 0.07,
  shakeStrength: 0.12,
  shakeDuration: 0.15
}

export const HUD = {
  hintDuration: 10
}

export const RENDER = {
  maxPixelRatio: 1.5,
  fogNear: 28,
  fogFar: 125
}

export const LIGHT = {
  sunIntensity: 2.2,
  ambientIntensity: 1.6,
  sunPosition: { x: -18, y: 25, z: 10 }
}

export const MIST = {
  sunRadius: 4.5,
  sunHeight: 18,
  sunOffsetX: 24
}
