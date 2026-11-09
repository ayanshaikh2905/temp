import * as THREE from 'three'
import { COLORS, PLAYER } from '../config.js'
import { addOutlinedMesh, createToonMaterial } from '../scene/look.js'

export function createCharacter() {
  const root = new THREE.Group()
  const robe = createToonMaterial(COLORS.robe)
  const grey = createToonMaterial(COLORS.robeGrey)
  const hat = createToonMaterial(COLORS.straw)
  const skin = createToonMaterial(COLORS.skin)
  const red = createToonMaterial(COLORS.red)
  const parts = {}
  for (const name of ['hips', 'torso', 'head', 'armL', 'armR', 'legL', 'legR', 'sword']) {
    parts[name] = new THREE.Group()
    parts[name].name = name
    root.add(parts[name])
  }
  const legGeometry = new THREE.CylinderGeometry(0.13, 0.18, 0.7, 6)
  for (const [name, x] of [['legL', -0.18], ['legR', 0.18]]) {
    parts[name].position.set(x, 0.7, 0)
    addOutlinedMesh(parts[name], legGeometry, grey).position.y = -0.35
  }
  parts.hips.position.y = 1.05
  addOutlinedMesh(parts.hips, new THREE.ConeGeometry(0.48, 0.48, 7), robe).position.y = 0.15
  parts.torso.position.y = 1.25
  addOutlinedMesh(parts.torso, new THREE.CylinderGeometry(0.36, 0.5, 0.7, 7), robe).position.y = 0.35
  const sash = addOutlinedMesh(root, new THREE.CylinderGeometry(0.44, 0.44, 0.12, 8), red)
  sash.position.y = 1.08
  parts.head.position.y = 1.78
  addOutlinedMesh(parts.head, new THREE.SphereGeometry(0.26, 8, 6), skin)
  const kasa = addOutlinedMesh(parts.head, new THREE.ConeGeometry(0.75, 0.25, 8), hat)
  kasa.position.y = 0.27
  kasa.rotation.z = -0.08
  for (const [name, x] of [['armL', -0.48], ['armR', 0.48]]) {
    parts[name].position.set(x, 1.55, 0)
    parts[name].rotation.z = name === 'armL' ? -0.18 : 0.18
    addOutlinedMesh(parts[name], new THREE.CylinderGeometry(0.11, 0.14, 0.65, 6), grey).position.y = -0.32
  }
  parts.sword.position.set(0.58, 1.22, 0)
  parts.sword.rotation.z = -0.5
  const handle = addOutlinedMesh(parts.sword, new THREE.CylinderGeometry(0.045, 0.045, 0.28, 6), COLORS.ink ? createToonMaterial(COLORS.ink) : robe)
  handle.position.y = -0.18
  const blade = addOutlinedMesh(parts.sword, new THREE.BoxGeometry(0.07, 0.85, 0.025), createToonMaterial(COLORS.white))
  blade.position.y = 0.35
  root.userData.parts = parts
  root.userData.height = PLAYER.height
  return root
}
