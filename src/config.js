export const COLORS = {
  paper: 0xe7d8b8,
  stone: 0x777d7b,
  stoneDark: 0x4c5557,
  mountainFar: 0x9caeb2,
  mountainMid: 0x718990,
  ink: 0x171b1b,
  red: 0x9d302c,
  mist: 0x9b9b91,
  white: 0xf3ead5
};

export const WORLD = {
  arenaRadius: 10,
  arenaHeight: 0.6,
  stairCount: 9,
  stairWidth: 9,
  stairDepth: 1.2,
  stairRise: 0.45,
  toriiHeight: 7,
  treeCount: 3,
  outlineScale: 1.035,
  outlineOpacity: 0.9,
  mountainCount: 5,
  mountainDepth: 24
};

export const PLAYER = {
  radius: 0.45,
  height: 1.8,
  speed: 4.2,
  acceleration: 14,
  damping: 9,
  hatRadius: 0.8,
  hatHeight: 0.45,
  spawn: { x: 0, y: 1.2, z: 7 },
  arenaLimit: 9.1,
  stairLimitX: 4.1,
  stairStartZ: 10.4,
  stairEndZ: 21
};

export const CAMERA = {
  distance: 8,
  height: 4.3,
  lookHeight: 1.2,
  follow: 5,
  fov: 48,
  near: 0.1,
  far: 180
};

export const RENDER = {
  maxPixelRatio: 1.5,
  fogNear: 28,
  fogFar: 125,
  shadowMapSize: 1024
};

export const LIGHT = {
  sunIntensity: 2.2,
  ambientIntensity: 1.6,
  sunPosition: { x: -18, y: 25, z: 10 }
};

export const MIST = {
  sunRadius: 4.5,
  sunHeight: 18,
  sunOffsetX: 24,
  overlayOpacity: 0.22
};
