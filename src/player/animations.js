import * as THREE from 'three'

export function updateAnimation(character, state, time, speed, mirror) {
  const parts = character.userData.parts
  const walk = Math.min(1, speed / 4.2)
  parts.torso.position.y = 1.25 + Math.sin(time * 2) * 0.025
  parts.armL.rotation.x = 0
  parts.armR.rotation.x = 0
  parts.legL.rotation.x = 0
  parts.legR.rotation.x = 0
  if (state === 'move') {
    parts.legL.rotation.x = Math.sin(time * 9) * 0.55 * walk
    parts.legR.rotation.x = -parts.legL.rotation.x
    parts.armL.rotation.x = -parts.legL.rotation.x
    parts.armR.rotation.x = -parts.legR.rotation.x
  }
  if (state === 'roll') {
    character.rotation.x = -0.8
    parts.torso.position.y = 1.1
  } else {
    character.rotation.x = THREE.MathUtils.damp(character.rotation.x, 0, 12, 1 / 60)
  }
  if (state === 'attack') {
    parts.armR.rotation.z = (mirror ? -1 : 1) * Math.sin(Math.min(1, time / 0.32) * Math.PI) * 1.8
    parts.sword.rotation.z = parts.armR.rotation.z - 0.5
  } else {
    parts.armR.rotation.z = 0.18
    parts.sword.rotation.z = -0.5
  }
  if (state === 'hurt') character.rotation.x = 0.2
  if (state === 'dead') character.rotation.z = -1.5
}
