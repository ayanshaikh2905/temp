import * as THREE from 'three'
import { ATTACK, PLAYER, ROLL, STAMINA } from '../config.js'
import { createColliders } from '../core/colliders.js'
import { getGroundHeight } from '../scene/ground.js'
import { createRig } from './rig.js'
import { createController } from './controller.js'
import { updateAnimation } from './animations.js'
import { setState, createPlayerState } from './playerStates.js'

const direction = new THREE.Vector3()
const facing = new THREE.Vector3()
const offset = new THREE.Vector3()
const impulse = new THREE.Vector3()

export function createPlayer(colliders = createColliders()) {
  const player = createRig()
  const controller = createController(colliders)
  controller.position.set(PLAYER.spawn.x, getGroundHeight(PLAYER.spawn.x, PLAYER.spawn.z), PLAYER.spawn.z)
  player.position.copy(controller.position)
  player.userData.controller = controller
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
    if (input.pressed('KeyR')) {
      input.consume('KeyR')
      resetPlayer(player)
    }
    updateAnimation(player, state.name, state.timer, 0, state.mirror, player.position.y)
    return
  }
  if (data.stamina < STAMINA.max && data.staminaUsed > (data.stamina === 0 ? STAMINA.emptyDelay : STAMINA.regenDelay)) {
    data.stamina = Math.min(STAMINA.max, data.stamina + STAMINA.regen * delta)
  }
  readMove(input, cameraRig.yaw)
  const wantsRoll = input.pressed('Space')
  const wantsAttack = input.mousePressed(0) && cameraRig.locked
  if (state.name === 'idle' || state.name === 'move') {
    if (wantsRoll && spendStamina(player, ROLL.cost)) {
      input.consume('Space')
      setState(state, 'roll')
      data.rollDirection.copy(direction.lengthSq() > 0 ? direction : facing.set(0, 0, -1).applyAxisAngle(THREE.Object3D.DEFAULT_UP, cameraRig.yaw)).normalize()
      impulse.copy(data.rollDirection).multiplyScalar(5)
      data.controller.addImpulse(impulse)
    } else if (wantsAttack && spendStamina(player, ATTACK.cost)) {
      input.consumeMouse(0)
      setState(state, 'attack')
      data.attackHits.clear()
      state.mirror = !state.mirror
    } else {
      if (!cameraRig.locked && wantsAttack) input.consumeMouse(0)
      setState(state, direction.lengthSq() > 0 ? 'move' : 'idle')
    }
  } else if (state.name === 'roll') {
    if (state.timer >= ROLL.duration) setState(state, 'idle')
  } else if (state.name === 'attack') {
    if (state.timer >= ATTACK.windup && state.timer <= ATTACK.windup + ATTACK.active) hitTargets(player, targets, onHit)
    if (state.timer >= ATTACK.windup + ATTACK.active + ATTACK.recovery) {
      if (wantsAttack && spendStamina(player, ATTACK.cost)) {
        input.consumeMouse(0)
        setState(state, 'attack')
        data.attackHits.clear()
        state.mirror = !state.mirror
        facing.set(Math.sin(player.rotation.y), 0, Math.cos(player.rotation.y))
        data.controller.addImpulse(facing.multiplyScalar(ATTACK.step / Math.max(ATTACK.windup, 0.01)))
      } else {
        setState(state, 'idle')
      }
    }
  } else if (state.name === 'hurt' && state.timer >= 0.35) {
    setState(state, 'idle')
  }
  data.controller.update(delta, input, cameraRig.yaw, state.name === 'attack' ? 'attack' : '')
  player.position.copy(data.controller.position)
  player.rotation.y = data.controller.facing
  updateAnimation(player, state.name, state.timer, data.controller.velocity.length(), state.mirror, data.controller.position.y)
}

function readMove(input, yaw) {
  direction.set(Number(input.held('KeyD')) - Number(input.held('KeyA')), 0, Number(input.held('KeyS')) - Number(input.held('KeyW')))
  if (direction.lengthSq() > 0) direction.normalize().applyAxisAngle(THREE.Object3D.DEFAULT_UP, yaw)
}

function spendStamina(player, cost) {
  if (player.userData.stamina < cost) return false
  player.userData.stamina -= cost
  player.userData.staminaUsed = 0
  return true
}

function hitTargets(player, targets, onHit) {
  facing.set(Math.sin(player.rotation.y), 0, Math.cos(player.rotation.y))
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
  if (fromPosition) {
    impulse.subVectors(player.position, fromPosition).setY(0).normalize().multiplyScalar(4)
    player.userData.controller.addImpulse(impulse)
  }
}

function resetPlayer(player) {
  const controller = player.userData.controller
  controller.position.set(PLAYER.spawn.x, getGroundHeight(PLAYER.spawn.x, PLAYER.spawn.z), PLAYER.spawn.z)
  controller.velocity.set(0, 0, 0)
  controller.facing = 0
  player.position.copy(controller.position)
  player.rotation.set(0, 0, 0)
  resetRotations(player)
  player.userData.health = 100
  player.userData.stamina = STAMINA.max
  setState(player.userData.state, 'idle')
}

function resetRotations(root) {
  root.traverse((child) => {
    if (child !== root) child.rotation.set(0, 0, 0)
  })
}
