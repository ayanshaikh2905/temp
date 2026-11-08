import * as THREE from 'three';
import { COLORS, WORLD } from '../config.js';

const toonGradient = new Uint8Array([
  32, 32, 32, 255,
  108, 108, 108, 255,
  210, 210, 210, 255
]);
const gradientTexture = new THREE.DataTexture(toonGradient, 3, 1, THREE.RGBAFormat);
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.needsUpdate = true;

export function createToonMaterial(color) {
  return new THREE.MeshToonMaterial({
    color: color,
    gradientMap: gradientTexture
  });
}

export function addOutline(mesh, parent) {
  const outlineMaterial = new THREE.MeshBasicMaterial({
    color: COLORS.ink,
    side: THREE.BackSide,
    transparent: true,
    opacity: WORLD.outlineOpacity
  });
  const outline = new THREE.Mesh(mesh.geometry, outlineMaterial);
  outline.scale.setScalar(WORLD.outlineScale);
  mesh.add(outline);
  return outline;
}

export function addOutlinedMesh(parent, geometry, material) {
  const mesh = new THREE.Mesh(geometry, material);
  parent.add(mesh);
  addOutline(mesh, parent);
  return mesh;
}
