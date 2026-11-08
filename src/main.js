import * as THREE from 'three';
import { createArena } from './scene/arena.js';
import { createSky } from './scene/sky.js';
import { createPlayer, updatePlayer } from './player/player.js';
import { COLORS, LIGHT, RENDER, CAMERA } from './config.js';

const PLAYER_Z = 12;
const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.paper);
scene.fog = new THREE.Fog(COLORS.mist, RENDER.fogNear, RENDER.fogFar);

const camera = new THREE.PerspectiveCamera(CAMERA.fov, window.innerWidth / window.innerHeight, CAMERA.near, CAMERA.far);
camera.position.set(0, CAMERA.height, PLAYER_Z);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, RENDER.maxPixelRatio));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const sun = new THREE.DirectionalLight(COLORS.white, LIGHT.sunIntensity);
sun.position.set(LIGHT.sunPosition.x, LIGHT.sunPosition.y, LIGHT.sunPosition.z);
scene.add(sun);
scene.add(new THREE.AmbientLight(COLORS.white, LIGHT.ambientIntensity));
scene.add(createSky());
scene.add(createArena());

const player = createPlayer();
scene.add(player);

const style = document.createElement('style');
style.textContent = `
  :root { background: #e7d8b8; }
  html, body, #app { width: 100%; height: 100%; margin: 0; overflow: hidden; }
  body { background: #e7d8b8; }
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: 0.22;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.16'/%3E%3C/svg%3E");
    mix-blend-mode: multiply;
  }
  canvas { display: block; }
`;
document.head.appendChild(style);

const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false
};

window.addEventListener('keydown', (event) => {
  setKey(event.key, true);
});

window.addEventListener('keyup', (event) => {
  setKey(event.key, false);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, RENDER.maxPixelRatio));
});

const clock = new THREE.Clock();

function setKey(key, value) {
  const normalized = key.toLowerCase();
  if (normalized === 'w' || normalized === 'arrowup') {
    keys.forward = value;
  }
  if (normalized === 's' || normalized === 'arrowdown') {
    keys.backward = value;
  }
  if (normalized === 'a' || normalized === 'arrowleft') {
    keys.left = value;
  }
  if (normalized === 'd' || normalized === 'arrowright') {
    keys.right = value;
  }
}

function animate() {
  const delta = Math.min(clock.getDelta(), 0.05);
  updatePlayer(player, camera, delta, keys);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
