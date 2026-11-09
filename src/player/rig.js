import * as THREE from 'three'
import { BODY, COLORS, PLAYER } from '../config.js'
import { addOutlinedMesh, createToonMaterial } from '../scene/look.js'

export function createRig() {
  const root = new THREE.Group()
  const robe = createToonMaterial(COLORS.robe)
  const grey = createToonMaterial(COLORS.robeGrey)
  const skin = createToonMaterial(COLORS.skin)
  const hat = createToonMaterial(COLORS.straw)
  const red = createToonMaterial(COLORS.red)
  const ink = createToonMaterial(COLORS.ink)
  const bladeMaterial = createToonMaterial(COLORS.white)
  const parts = {}
  const limbGeometry = new THREE.CylinderGeometry(0.1, 0.13, 1, 6)
  const jointGeometry = new THREE.SphereGeometry(0.105, 6, 4)
  const handGeometry = new THREE.BoxGeometry(0.13, 0.1, 0.16)
  const footGeometry = new THREE.BoxGeometry(0.22, 0.12, BODY.footLength)

  parts.pelvis = group(root, 'pelvis')
  parts.pelvis.position.y = BODY.hipHeight
  parts.spine = group(parts.pelvis, 'spine')
  parts.spine.position.y = 0.1
  parts.chest = group(parts.spine, 'chest')
  parts.chest.position.y = BODY.pelvisChest
  addOutlinedMesh(parts.chest, new THREE.CylinderGeometry(0.27, 0.36, 0.42, 7), robe).position.y = 0.1
  addOutlinedMesh(parts.pelvis, new THREE.CylinderGeometry(0.34, 0.4, 0.24, 7), robe).position.y = -0.01
  const sash = addOutlinedMesh(parts.pelvis, new THREE.CylinderGeometry(0.38, 0.38, 0.1, 8), red)
  sash.position.y = 0.06

  parts.neck = group(parts.chest, 'neck')
  parts.neck.position.y = BODY.chestShoulders
  addOutlinedMesh(parts.neck, new THREE.CylinderGeometry(0.07, 0.08, BODY.neckLength, 6), skin).position.y = 0.04
  parts.head = group(parts.neck, 'head')
  parts.head.position.y = BODY.neckLength
  addOutlinedMesh(parts.head, new THREE.SphereGeometry(BODY.headRadius, 8, 6), skin)
  const nose = addOutlinedMesh(parts.head, new THREE.BoxGeometry(0.05, 0.05, 0.08), skin)
  nose.position.set(0, -0.01, BODY.headRadius)
  const kasa = addOutlinedMesh(parts.head, new THREE.ConeGeometry(0.38, 0.16, 8), hat)
  kasa.position.y = BODY.headRadius + 0.08
  parts.hat = kasa

  for (const side of [-1, 1]) {
    const suffix = side < 0 ? 'L' : 'R'
    const shoulder = group(parts.chest, `shoulder${suffix}`)
    shoulder.position.set(side * 0.21, 0.2, 0)
    parts[`shoulder${suffix}`] = shoulder
    const upperArm = group(shoulder, `upperArm${suffix}`)
    upperArm.position.y = -0.03
    upperArm.rotation.z = side * 0.12
    parts[`upperArm${suffix}`] = upperArm
    limb(upperArm, limbGeometry, grey, BODY.upperArmLength, -0.14)
    joint(upperArm, jointGeometry, grey, 0, -0.28)
    const foreArm = group(upperArm, `foreArm${suffix}`)
    foreArm.position.y = -BODY.upperArmLength
    parts[`foreArm${suffix}`] = foreArm
    limb(foreArm, limbGeometry, grey, BODY.foreArmLength, -0.13)
    joint(foreArm, jointGeometry, grey, 0, -0.26)
    const hand = group(foreArm, `hand${suffix}`)
    hand.position.y = -BODY.foreArmLength
    parts[`hand${suffix}`] = hand
    addOutlinedMesh(hand, handGeometry, skin).position.set(0, -0.04, 0)
    const fingers = group(hand, `fingers${suffix}`)
    fingers.position.set(0, -0.08, 0.04)
    parts[`fingers${suffix}`] = fingers
    addOutlinedMesh(fingers, new THREE.BoxGeometry(0.12, 0.07, 0.09), skin)
  }

  for (const side of [-1, 1]) {
    const suffix = side < 0 ? 'L' : 'R'
    const thigh = group(parts.pelvis, `thigh${suffix}`)
    thigh.position.set(side * 0.14, -0.08, 0)
    parts[`thigh${suffix}`] = thigh
    limb(thigh, limbGeometry, grey, BODY.thighLength, -0.22)
    joint(thigh, jointGeometry, grey, 0, -BODY.thighLength)
    const shin = group(thigh, `shin${suffix}`)
    shin.position.y = -BODY.thighLength
    parts[`shin${suffix}`] = shin
    limb(shin, limbGeometry, grey, BODY.shinLength, -0.22)
    joint(shin, jointGeometry, grey, 0, -BODY.shinLength)
    const foot = group(shin, `foot${suffix}`)
    foot.position.y = -BODY.shinLength
    parts[`foot${suffix}`] = foot
    addOutlinedMesh(foot, footGeometry, ink).position.z = 0.06
  }

  parts.grip = group(parts.handR, 'grip')
  parts.grip.position.set(0, -0.04, 0)
  const guard = addOutlinedMesh(parts.grip, new THREE.BoxGeometry(0.25, 0.04, 0.05), red)
  guard.rotation.z = Math.PI / 2
  const handle = addOutlinedMesh(parts.grip, new THREE.CylinderGeometry(0.035, 0.035, 0.22, 6), ink)
  handle.rotation.z = Math.PI / 2
  const blade = addOutlinedMesh(parts.grip, new THREE.BoxGeometry(0.05, 0.85, 0.025), bladeMaterial)
  blade.position.y = 0.48
  const sheath = addOutlinedMesh(parts.pelvis, new THREE.BoxGeometry(0.06, 0.72, 0.06), ink)
  sheath.position.set(-0.3, -0.08, -0.02)
  sheath.rotation.z = -0.2
  parts.sashTailL = addOutlinedMesh(parts.pelvis, new THREE.BoxGeometry(0.08, 0.42, 0.03), red)
  parts.sashTailL.position.set(-0.2, -0.22, -0.05)
  parts.sashTailR = addOutlinedMesh(parts.pelvis, new THREE.BoxGeometry(0.08, 0.42, 0.03), red)
  parts.sashTailR.position.set(0.2, -0.22, -0.05)
  root.userData.parts = parts
  root.userData.height = PLAYER.height ?? 1.85
  return root
}

export function setRigDebug(root, enabled) {
  if (!root.userData.debugGroup) {
    const debugGroup = new THREE.Group()
    debugGroup.name = 'skeletonDebug'
    root.userData.debugGroup = debugGroup
    root.userData.debugHelpers = []
    for (const child of Object.values(root.userData.parts)) {
      if (child instanceof THREE.Group) {
        const helper = new THREE.AxesHelper(0.12)
        child.add(helper)
        root.userData.debugHelpers.push(helper)
      }
    }
  }
  for (const helper of root.userData.debugHelpers) helper.visible = enabled
}

function group(parent, name) {
  const value = new THREE.Group()
  value.name = name
  parent.add(value)
  return value
}

function limb(parent, geometry, material, length, y) {
  const mesh = addOutlinedMesh(parent, geometry, material)
  mesh.scale.y = length
  mesh.position.y = y
  return mesh
}

function joint(parent, geometry, material, x, y) {
  const mesh = addOutlinedMesh(parent, geometry, material)
  mesh.position.set(x, y, 0)
  return mesh
}
