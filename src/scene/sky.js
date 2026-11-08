import * as THREE from 'three';
import { COLORS, MIST, WORLD } from '../config.js';
import { createToonMaterial, addOutlinedMesh } from './look.js';

export function createSky() {
  const sky = new THREE.Group();
  const skyGeometry = new THREE.PlaneGeometry(150, 100);
  const skyMaterial = new THREE.MeshBasicMaterial({ color: COLORS.paper });
  const skyPlane = new THREE.Mesh(skyGeometry, skyMaterial);
  skyPlane.position.set(0, 35, -45);
  skyPlane.rotation.x = 0;
  sky.add(skyPlane);

  const sunMaterial = new THREE.MeshBasicMaterial({ color: COLORS.red, transparent: true, opacity: 0.76 });
  const sun = new THREE.Mesh(new THREE.CircleGeometry(MIST.sunRadius, 24), sunMaterial);
  sun.position.set(MIST.sunOffsetX, MIST.sunHeight, -40);
  sky.add(sun);

  for (let index = 0; index < WORLD.mountainCount; index += 1) {
    const depth = -20 - index * WORLD.mountainDepth;
    const height = 13 - index * 1.3;
    const material = createToonMaterial(index < 2 ? COLORS.mountainMid : COLORS.mountainFar);
    const geometry = new THREE.ConeGeometry(24 - index * 2, height, 5);
    const mountain = addOutlinedMesh(sky, geometry, material);
    mountain.position.set((index % 2 === 0 ? -1 : 1) * (12 + index * 8), height / 2 - 1, depth);
    mountain.scale.x = 1.4;
  }

  return sky;
}
