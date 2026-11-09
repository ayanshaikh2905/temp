import * as THREE from 'three'
import { ATTACK, PLAYER, ROLL, STAMINA } from '../config.js'
import { resolveCollisions } from '../core/collision.js'
import { getGroundHeight } from '../scene/ground.js'
import { createCharacter } from './character.js'
import { updateAnimation } from './animations.js'
import { setState, createPlayerState } from './playerStates.js'

const direction = new THREE.Vector3()
const axis = new THREE.Vector3(0, 1, 0)
const facing = new THREE.Vector3()
const offset = new THREE.Vector3()

export function createPlayer() {
  const player = createCharacter()
  player.position.set(PLAYER.spawn.x, getGroundHeight(PLAYER.spawn.x, PLAYER.spawn.z), PLAYER.spawn.z)
  player.userData.velocity = new THREE.Vector3()
  player.userData.state = createPlayerState()
  player.userData.stamina = STAMINA.max
  player.userData.health = 100
  player.userData.staminaUsed = STAMINA.regenDelay
  player.userData.rollDirection = new THREE.Vector3()
  player.userData.attackHits = new Set()
  player.userData.takeDamage = (amount, fromPosition) => takeDamage(player, amount, fromPosition)
  return player
}

export function updatePlayer(player, cameraRig, delta, input, targets, onHit) {
  const data = player.userData
  const state = data.state
  state.timer += delta
  data.staminaUsed += delta
  if (state.name === 'dead') {
    if (input.pressed('KeyR')) resetPlayer(player)
    updateAnimation(player, state.name, state.timer, 0, state.mirror)
    return
  }
  if (data.stamina < STAMINA.max && data.staminaUsed > (data.stamina === 0 ? STAMINA.emptyDelay : STAMINA.regenDelay)) {
    data.stamina = Math.min(STAMINA.max, data.stamina + STAMINA.regen * delta)
  }
  const wantsRoll = input.pressed('Space')
  const wantsAttack = input.mousePressed(0)
  if (state.name === 'idle' || state.name === 'move') {
    readMove(input, cameraRig.yaw)
    if (wantsRoll && spendStamina(player, ROLL.cost)) {
      setState(state, 'roll')
      data.rollDirection.copy(direction.lengthSq() > 0 ? direction : facing.set(0, 0, -1).applyAxisAngle(axis, cameraRig.yaw)).normalize()
    } else if (wantsAttack && spendStamina(player, ATTACK.cost)) {
      setState(state, 'attack')
      data.attackHits.clear()
      state.mirror = !state.mirror
    } else {
      move(player, delta, cameraRig.yaw, input)
      setState(state, direction.lengthSq() > 0 ? 'move' : 'idle')
    }
  } else if (state.name === 'roll') {
    const progress = Math.min(1, state.timer / ROLL.duration)
    player.position.addScaledVector(data.rollDirection, (1 - progress) * ROLL.distance / ROLL.duration * delta * 2)
    state.invincible = state.timer >= ROLL.invincibleStart && state.timer <= ROLL.invincibleEnd
    if (state.timer >= ROLL.duration) setState(state, 'idle')
  } else if (state.name === 'attack') {
    if (state.timer <= ATTACK.windup + ATTACK.active) {
      player.getWorldDirection(facing)
      player.position.addScaledVector(facing, ATTACK.step * delta / (ATTACK.windup + ATTACK.active))
      if (state.timer >= ATTACK.windup) hitTargets(player, targets, onHit)
    } else if (state.timer >= ATTACK.windup + ATTACK.active + ATTACK.recovery) {
      if (wantsAttack && spendStamina(player, ATTACK.cost)) {
        setState(state, 'attack')
        data.attackHits.clear()
        state.mirror = !state.mirror
      } else setState(state, 'idle')
    }
  } else if (state.name === 'hurt' && state.timer >= 0.35) {
    setState(state, 'idle')
  }
  resolveCollisions(player.position, PLAYER.radius)
  player.position.y = THREE.MathUtils.damp(player.position.y, getGroundHeight(player.position.x, player.position.z), 18, delta)
  updateAnimation(player, state.name, state.timer, data.velocity.length(), state.mirror)
}

function readMove(input, yaw) {
  direction.set(Number(input.held('KeyD')) - Number(input.held('KeyA')), 0, Number(input.held('KeyS')) - Number(input.held('KeyW')))
  if (direction.lengthSq() > 0) direction.normalize().applyAxisAngle(axis, yaw)
}

function move(player, delta, yaw, input) {
  readMove(input, yaw)
  const velocity = player.userData.velocity
  velocity.x = THREE.MathUtils.damp(velocity.x, direction.x * PLAYER.speed, PLAYER.acceleration, delta)
  velocity.z = THREE.MathUtils.damp(velocity.z, direction.z * PLAYER.speed, PLAYER.acceleration, delta)
  player.position.addScaledVector(velocity, delta)
  if (direction.lengthSq() > 0) player.rotation.y = THREE.MathUtils.damp(player.rotation.y, Math.atan2(direction.x, direction.z), 14, delta)
}

function spendStamina(player, cost) {
  if (player.userData.stamina <= 0) return false
  player.userData.stamina = Math.max(0, player.userData.stamina - cost)
  player.userData.staminaUsed = 0
  return true
}

function hitTargets(player, targets, onHit) {
  player.getWorldDirection(facing)
  for (const target of targets) {
    if (!target.isAlive || player.userData.attackHits.has(target)) continue
    offset.subVectors(target.position, player.position)
    offset.y = 0
    if (offset.length() > ATTACK.range || facing.angleTo(offset.normalize()) > ATTACK.arc / 2) continue
    player.userData.attackHits.add(target)
    target.takeDamage(ATTACK.damage, player.position)
    onHit(target)
  }
}

function takeDamage(player, amount, fromPosition) {
  const state = player.userData.state
  if (state.name === 'dead' || state.invincible) return
  player.userData.health = Math.max(0, player.userData.health - amount)
  setState(state, player.userData.health === 0 ? 'dead' : 'hurt')
  if (fromPosition) player.position.addScaledVector(offset.subVectors(player.position, fromPosition).normalize(), 0.25)
}

function resetPlayer(player) {
  player.position.set(PLAYER.spawn.x, getGroundHeight(PLAYER.spawn.x, PLAYER.spawn.z), PLAYER.spawn.z)
  player.userData.health = 100
  player.userData.stamina = STAMINA.max
  setState(player.userData.state, 'idle')
}
