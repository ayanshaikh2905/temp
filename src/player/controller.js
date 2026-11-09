import * as THREE from 'three'
import { PHYSICS, PLAYER } from '../config.js'
import { approach, shortestAngleDifference } from '../core/math.js'
import { getGroundHeight } from '../scene/ground.js'

const desiredVelocity = new THREE.Vector3()
const movement = new THREE.Vector3()
const impulse = new THREE.Vector3()

export function createController(colliders) {
  const controller = {
    position: new THREE.Vector3(),
    velocity: new THREE.Vector3(),
    facing: 0,
    grounded: true,
    landImpact: 0,
    acceleration: 0,
    sprinting: false,
    addImpulse(vector) {
      impulse.add(vector)
    },
    update(delta, input, yaw, actionName) {
      const inputX = Number(input.held('KeyD')) - Number(input.held('KeyA'))
      const inputZ = Number(input.held('KeyS')) - Number(input.held('KeyW'))
      movement.set(inputX, 0, inputZ)
      if (movement.lengthSq() > 1) movement.normalize()
      movement.applyAxisAngle(THREE.Object3D.DEFAULT_UP, yaw)
      const sprinting = input.held('ShiftLeft') || input.held('ShiftRight')
      const maxSpeed = sprinting ? PHYSICS.sprintSpeed : PLAYER.speed
      desiredVelocity.copy(movement).multiplyScalar(actionName === 'attack' ? maxSpeed * 0.35 : maxSpeed)
      const rate = movement.lengthSq() > 0 ? PHYSICS.accel : PHYSICS.decel
      this.velocity.x = approach(this.velocity.x, desiredVelocity.x, rate * delta)
      this.velocity.z = approach(this.velocity.z, desiredVelocity.z, rate * delta)
      this.acceleration = movement.lengthSq() > 0 ? rate : PHYSICS.decel
      impulse.multiplyScalar(Math.exp(-PHYSICS.impulseDamping * delta))
      this.velocity.addScaledVector(impulse, delta)
      if (movement.lengthSq() > 0) {
        const target = Math.atan2(movement.x, movement.z)
        const turnRate = actionName ? PHYSICS.actionTurnRate : PHYSICS.turnRate
        this.facing += THREE.MathUtils.clamp(shortestAngleDifference(this.facing, target), -turnRate * delta, turnRate * delta)
      }
      this.velocity.y += PHYSICS.gravity * delta
      const wasGrounded = this.grounded
      this.position.addScaledVector(this.velocity, delta)
      const ground = getGroundHeight(this.position.x, this.position.z)
      if (this.position.y <= ground + PHYSICS.groundSnap && this.velocity.y <= 0) {
        if (!wasGrounded) this.landImpact = Math.abs(this.velocity.y)
        this.position.y = ground
        this.velocity.y = 0
        this.grounded = true
      } else {
        this.grounded = false
      }
      colliders.resolve(this.position, PLAYER.radius, this.velocity)
      this.sprinting = sprinting && movement.lengthSq() > 0
      this.landImpact *= Math.exp(-12 * delta)
    }
  }
  return controller
}
