import * as THREE from 'three'
import { CAMERA } from '../config.js'
import { getGroundHeight } from '../scene/ground.js'

export function createCameraRig(camera, canvas, player) {
  const rig = { yaw: 0, pitch: 0.65, locked: false, shake: 0, shakeTime: 0, target: new THREE.Vector3(), desired: new THREE.Vector3(), offset: new THREE.Vector3() }
  canvas.addEventListener('click', () => canvas.requestPointerLock())
  document.addEventListener('pointerlockchange', () => { rig.locked = document.pointerLockElement === canvas })
  document.addEventListener('mousemove', (event) => {
    if (!rig.locked) return
    rig.yaw -= event.movementX * CAMERA.sensitivity
    rig.pitch = THREE.MathUtils.clamp(rig.pitch - event.movementY * CAMERA.sensitivity, CAMERA.minPitch, CAMERA.maxPitch)
  })
  rig.update = (delta) => {
    rig.target.set(player.position.x, player.position.y + 1.4, player.position.z)
    const horizontal = Math.cos(rig.pitch) * CAMERA.distance
    rig.desired.set(
      player.position.x + Math.sin(rig.yaw) * horizontal + Math.cos(rig.yaw) * CAMERA.shoulder,
      rig.target.y + Math.sin(rig.pitch) * CAMERA.distance,
      player.position.z + Math.cos(rig.yaw) * horizontal - Math.sin(rig.yaw) * CAMERA.shoulder
    )
    rig.desired.y = Math.max(rig.desired.y, getGroundHeight(rig.desired.x, rig.desired.z) + 0.4)
    camera.position.lerp(rig.desired, 1 - Math.exp(-CAMERA.follow * delta))
    camera.lookAt(rig.target)
    if (rig.shakeTime > 0) {
      rig.shakeTime -= delta
      rig.offset.set((Math.random() - 0.5) * rig.shake, (Math.random() - 0.5) * rig.shake, (Math.random() - 0.5) * rig.shake)
      camera.position.add(rig.offset)
    }
  }
  rig.addShake = (strength, duration) => { rig.shake = strength; rig.shakeTime = duration }
  return rig
}

export function addShake(rig, strength, duration) {
  rig.addShake(strength, duration)
}
