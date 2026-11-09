import * as THREE from 'three'
import { COLORS } from '../config.js'
import { addOutlinedMesh, createToonMaterial } from '../scene/look.js'

export function createDummy() {
  const root = new THREE.Group()
  root.position.set(0, 0.3, -4)
  addOutlinedMesh(root, new THREE.CylinderGeometry(0.16, 0.22, 2.4, 8), createToonMaterial(COLORS.wood)).position.y = 1.2
  addOutlinedMesh(root, new THREE.CylinderGeometry(0.75, 0.75, 0.7, 10), createToonMaterial(COLORS.straw)).position.y = 2.3
  root.userData.health = 200
  root.radius = 0.9
  root.userData.hitFlash = 0
  root.userData.materials = root.children.flatMap((child) => child.material ? [child.material] : [])
  Object.defineProperty(root, 'isAlive', { get: () => root.userData.health > 0 })
  root.takeDamage = (amount) => {
    root.userData.health -= amount
    root.userData.hitFlash = 0.08
    if (root.userData.health <= 0) root.userData.health = 200
  }
  root.userData.update = (delta) => {
    root.userData.hitFlash = Math.max(0, root.userData.hitFlash - delta)
    const flash = root.userData.hitFlash > 0
    for (const material of root.userData.materials) material.emissive.setHex(flash ? COLORS.white : 0x000000)
  }
  return root
}
