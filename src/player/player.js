import * as THREE from 'three';
import { COLORS, PLAYER, CAMERA } from '../config.js';
import { addOutlinedMesh, createToonMaterial } from '../scene/look.js';

export function createPlayer() {
  const player = new THREE.Group();
  player.position.set(PLAYER.spawn.x, PLAYER.spawn.y, PLAYER.spawn.z);
  player.userData.velocity = new THREE.Vector3();
  const bodyMaterial = createToonMaterial(COLORS.ink);
  const hatMaterial = createToonMaterial(COLORS.stoneDark);
  const body = addOutlinedMesh(player, new THREE.CapsuleGeometry(PLAYER.radius, PLAYER.height - PLAYER.radius * 2, 4, 8), bodyMaterial);
  body.position.y = PLAYER.height / 2;
  const hat = addOutlinedMesh(player, new THREE.ConeGeometry(PLAYER.hatRadius, PLAYER.hatHeight, 8), hatMaterial);
  hat.position.y = PLAYER.height + PLAYER.hatHeight / 2;
  const brim = addOutlinedMesh(player, new THREE.CylinderGeometry(PLAYER.hatRadius * 1.25, PLAYER.hatRadius * 1.25, 0.12, 12), hatMaterial);
  brim.position.y = PLAYER.height;
  return player;
}

export function updatePlayer(player, camera, delta, keys) {
  const direction = new THREE.Vector3();
  const velocity = player.userData.velocity;
  direction.z = Number(keys.forward) - Number(keys.backward);
  direction.x = Number(keys.right) - Number(keys.left);
  if (direction.lengthSq() > 0) {
    direction.normalize();
    velocity.x = THREE.MathUtils.damp(velocity.x, direction.x * PLAYER.speed, PLAYER.acceleration, delta);
    velocity.z = THREE.MathUtils.damp(velocity.z, direction.z * PLAYER.speed, PLAYER.acceleration, delta);
    player.rotation.y = Math.atan2(direction.x, direction.z);
  } else {
    velocity.x = THREE.MathUtils.damp(velocity.x, 0, PLAYER.damping, delta);
    velocity.z = THREE.MathUtils.damp(velocity.z, 0, PLAYER.damping, delta);
  }
  player.position.x += velocity.x * delta;
  player.position.z += velocity.z * delta;
  if (player.position.z < PLAYER.stairStartZ) {
    const distance = Math.hypot(player.position.x, player.position.z);
    if (distance > PLAYER.arenaLimit) {
      const angle = Math.atan2(player.position.x, player.position.z);
      player.position.x = Math.sin(angle) * PLAYER.arenaLimit;
      player.position.z = Math.cos(angle) * PLAYER.arenaLimit;
    }
  }
  if (player.position.z >= PLAYER.stairStartZ) {
    player.position.x = THREE.MathUtils.clamp(player.position.x, -PLAYER.stairLimitX, PLAYER.stairLimitX);
    player.position.z = THREE.MathUtils.clamp(player.position.z, PLAYER.stairStartZ, PLAYER.stairEndZ);
  }
  const target = player.position.clone();
  target.y += 1.2;
  const desiredCamera = new THREE.Vector3(player.position.x, player.position.y + CAMERA.height, player.position.z + CAMERA.distance);
  camera.position.lerp(desiredCamera, 1 - Math.exp(-CAMERA.follow * delta));
  camera.lookAt(target);
}
