import * as THREE from 'three'
import { easeInOutSine } from '../core/math.js'
import { BODY } from '../config.js'
import { solveTwoBoneIK } from './ik.js'

export function updateAnimation(character, state, time, speed, mirror, groundHeight = character.position.y) {
  const parts = character.userData.parts
  const phase = time * 8
  const walk = Math.min(1, speed / 4.2)
  const left = Math.sin(phase) * 0.45 * walk
  const right = -left
  parts.thighL.rotation.x = left
  parts.thighR.rotation.x = right
  parts.shinL.rotation.x = Math.max(0, -left) * 0.45
  parts.shinR.rotation.x = Math.max(0, -right) * 0.45
  parts.upperArmL.rotation.x = -left * 0.65
  parts.upperArmR.rotation.x = -right * 0.65
  parts.chest.rotation.z = Math.sin(phase * 0.5) * 0.03 * walk
  parts.head.rotation.y = 0
  parts.grip.rotation.z = 0
  if (state === 'attack') {
    const progress = Math.min(1, time / 0.62)
    const slash = Math.sin(easeInOutSine(progress) * Math.PI)
    parts.chest.rotation.y = (mirror ? -1 : 1) * slash * 0.6
    parts.upperArmR.rotation.z = (mirror ? -1 : 1) * (0.25 + slash * 1.2)
    parts.foreArmR.rotation.z = (mirror ? -1 : 1) * slash * 0.6
  } else {
    parts.chest.rotation.y = 0
    parts.upperArmR.rotation.z = 0.18
    parts.foreArmR.rotation.z = 0
  }
  if (state === 'roll') {
    character.rotation.x = -0.8
  } else {
    character.rotation.x = THREE.MathUtils.damp(character.rotation.x, 0, 12, 1 / 60)
  }
  if (state === 'hurt') character.rotation.x = 0.2
  if (state === 'dead') character.rotation.z = -1.5
  parts.footTargetL.position.set(-0.14, groundHeight - character.position.y, 0)
  parts.footTargetR.position.set(0.14, groundHeight - character.position.y, 0)
  parts.poleL.position.set(-0.14, groundHeight - character.position.y + 0.1, 0.7)
  parts.poleR.position.set(0.14, groundHeight - character.position.y + 0.1, 0.7)
  character.updateMatrixWorld(true)
  solveTwoBoneIK(parts.thighL, parts.shinL, parts.footL, parts.footTargetL, parts.poleL, BODY.thighLength, BODY.shinLength)
  solveTwoBoneIK(parts.thighR, parts.shinR, parts.footR, parts.footTargetR, parts.poleR, BODY.thighLength, BODY.shinLength)
}
