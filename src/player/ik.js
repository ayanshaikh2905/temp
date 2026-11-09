import * as THREE from 'three'

const rootPosition = new THREE.Vector3()
const targetPosition = new THREE.Vector3()
const polePosition = new THREE.Vector3()
const direction = new THREE.Vector3()
const planeNormal = new THREE.Vector3()
const bendDirection = new THREE.Vector3()
const midPosition = new THREE.Vector3()

export function solveTwoBoneIK(root, mid, end, target, pole, firstLength, secondLength) {
  root.getWorldPosition(rootPosition)
  target.getWorldPosition(targetPosition)
  pole.getWorldPosition(polePosition)
  direction.subVectors(targetPosition, rootPosition)
  const distance = Math.min(direction.length(), (firstLength + secondLength) * 0.99)
  direction.normalize()
  targetPosition.copy(rootPosition).addScaledVector(direction, distance)
  planeNormal.crossVectors(direction, polePosition.sub(rootPosition)).normalize()
  bendDirection.crossVectors(planeNormal, direction).normalize()
  const cosine = THREE.MathUtils.clamp((firstLength * firstLength + distance * distance - secondLength * secondLength) / (2 * firstLength * distance), -1, 1)
  const adjacent = firstLength * cosine
  const height = Math.sqrt(Math.max(0, firstLength * firstLength - adjacent * adjacent))
  midPosition.copy(rootPosition)
    .addScaledVector(direction, adjacent)
    .addScaledVector(bendDirection, height)
  mid.worldToLocal(midPosition)
  end.worldToLocal(targetPosition)
  mid.position.copy(midPosition)
  end.position.copy(targetPosition)
}
