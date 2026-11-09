import * as THREE from 'three'
import { CAMERA } from '../config.js'
import { getGroundHeight } from '../scene/ground.js'

export function createCameraRig(camera, canvas, player) {
  const rig = { yaw: 0, pitch: 0.65, locked: false, shake: 0, shakeTime: 0, target: new THREE.Vector3(), followPoint: new THREE.Vector3(), desired: new THREE.Vector3(), offset: new THREE.Vector3() }
  canvas.addEventListener('click', () => canvas.requestPointerLock())
  document.addEventListener('pointerlockchange', () => { rig.locked = document.pointerLockElement === canvas })
  document.addEventListener('mousemove', (event) => {
    if (!rig.locked) return
    rig.yaw -= event.movementX * CAMERA.sensitivity
    const pitchSign = CAMERA.invertY ? 1 : -1
    rig.pitch = THREE.MathUtils.clamp(rig.pitch + event.movementY * CAMERA.sensitivity * pitchSign, CAMERA.minPitch, CAMERA.maxPitch)
  })
  rig.update = (delta) => {
    rig.target.set(player.position.x, player.position.y + 1.4, player.position.z)
    rig.followPoint.lerp(rig.target, 1 - Math.exp(-CAMERA.follow * delta))
    const horizontal = Math.cos(rig.pitch) * CAMERA.distance
    rig.desired.set(
      rig.followPoint.x + Math.sin(rig.yaw) * horizontal + Math.cos(rig.yaw) * CAMERA.shoulder,
      rig.followPoint.y + Math.sin(rig.pitch) * CAMERA.distance,
      rig.followPoint.z + Math.cos(rig.yaw) * horizontal - Math.sin(rig.yaw) * CAMERA.shoulder
    )
    rig.desired.y = Math.max(rig.desired.y, getGroundHeight(rig.desired.x, rig.desired.z) + 0.4)
    camera.position.copy(rig.desired)
    camera.lookAt(rig.followPoint)
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
