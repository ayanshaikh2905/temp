import { PLAYER, WORLD } from '../config.js'

export function getGroundHeight(x, z) {
  const arenaTop = WORLD.arenaHeight / 2
  if (z < PLAYER.stairStartZ || Math.abs(x) > PLAYER.stairLimitX) {
    return arenaTop
  }
  const index = Math.min(WORLD.stairCount - 1, Math.max(0, Math.floor((z - PLAYER.stairStartZ) / WORLD.stairDepth)))
  return arenaTop - index * WORLD.stairRise
}
