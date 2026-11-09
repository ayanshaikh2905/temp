import * as THREE from 'three'
import { PLAYER, WORLD } from '../config.js'

const trees = [
  { x: -8, z: -3, radius: 1.1 },
  { x: 8, z: 0, radius: 1.35 },
  { x: -6, z: 6, radius: 0.9 }
]

export function resolveCollisions(position, radius) {
  if (position.z < PLAYER.stairStartZ) {
    const distance = Math.hypot(position.x, position.z)
    const limit = WORLD.arenaRadius - radius
    if (distance > limit) {
      position.x *= limit / distance
      position.z *= limit / distance
    }
  } else {
    position.x = THREE.MathUtils.clamp(position.x, -PLAYER.stairLimitX + radius, PLAYER.stairLimitX - radius)
    position.z = THREE.MathUtils.clamp(position.z, PLAYER.stairStartZ, PLAYER.stairEndZ)
  }
  for (const tree of trees) {
    const dx = position.x - tree.x
    const dz = position.z - tree.z
    const distance = Math.hypot(dx, dz)
    const limit = radius + tree.radius
    if (distance > 0 && distance < limit) {
      position.x = tree.x + dx / distance * limit
      position.z = tree.z + dz / distance * limit
    }
  }
}
