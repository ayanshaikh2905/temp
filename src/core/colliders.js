import * as THREE from 'three'
import { PLAYER, WORLD } from '../config.js'

const trees = [
  { x: -8, z: -3, radius: 1.1 },
  { x: 8, z: 0, radius: 1.35 },
  { x: -6, z: 6, radius: 0.9 }
]

export function createColliders() {
  const colliders = trees.map((tree) => ({ target: tree, radius: tree.radius }))
  return {
    addCollider(target, radius) {
      colliders.push({ target, radius })
    },
    resolve(position, radius, velocity) {
      resolveArena(position, radius)
      for (const collider of colliders) {
        const dx = position.x - collider.target.x
        const dz = position.z - collider.target.z
        const distance = Math.hypot(dx, dz)
        const limit = radius + collider.radius
        if (distance <= 0 || distance >= limit) continue
        const normalX = dx / distance
        const normalZ = dz / distance
        position.x = collider.target.x + normalX * limit
        position.z = collider.target.z + normalZ * limit
        if (velocity) {
          const into = velocity.x * normalX + velocity.z * normalZ
          if (into < 0) {
            velocity.x -= normalX * into
            velocity.z -= normalZ * into
          }
        }
      }
    }
  }
}

function resolveArena(position, radius) {
  const stairGap = position.z >= WORLD.arenaRadius - radius && position.z <= PLAYER.stairEndZ
    && Math.abs(position.x) <= PLAYER.stairLimitX
  if (!stairGap && position.z < PLAYER.stairStartZ) {
    const distance = Math.hypot(position.x, position.z)
    const limit = WORLD.arenaRadius - radius
    if (distance > limit) {
      position.x *= limit / distance
      position.z *= limit / distance
    }
    return
  }
  if (position.z >= PLAYER.stairStartZ) {
    position.x = THREE.MathUtils.clamp(position.x, -PLAYER.stairLimitX + radius, PLAYER.stairLimitX - radius)
    position.z = THREE.MathUtils.clamp(position.z, PLAYER.stairStartZ, PLAYER.stairEndZ)
  }
}

export function resolveCollisions(position, radius, velocity) {
  createColliders().resolve(position, radius, velocity)
}
