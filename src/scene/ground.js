import { PLAYER, WORLD } from '../config.js'

export function getGroundHeight(x, z) {
  const arenaTop = WORLD.arenaHeight / 2
  if (z < PLAYER.stairStartZ) {
    return arenaTop
  }
  const index = Math.min(WORLD.stairCount - 1, Math.max(0, Math.floor((z - PLAYER.stairStartZ) / WORLD.stairDepth)))
  return arenaTop - (WORLD.stairCount - 1 - index) * WORLD.stairRise
}
