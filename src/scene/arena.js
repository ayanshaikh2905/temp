import * as THREE from 'three'
import { COLORS, WORLD } from '../config.js'
import { addOutlinedMesh, createToonMaterial } from './look.js'

function createTree(parent, x, z, scale) {
  const tree = new THREE.Group()
  tree.position.set(x, 0, z)
  tree.scale.setScalar(scale)
  const trunkMaterial = createToonMaterial(COLORS.stoneDark)
  const leafMaterial = createToonMaterial(COLORS.mountainMid)
  addOutlinedMesh(tree, new THREE.CylinderGeometry(0.18, 0.28, 2.4, 6), trunkMaterial).position.y = 1.2
  addOutlinedMesh(tree, new THREE.ConeGeometry(1.7, 3.1, 7), leafMaterial).position.y = 3
  addOutlinedMesh(tree, new THREE.ConeGeometry(1.25, 2.6, 7), leafMaterial).position.y = 4.6
  addOutlinedMesh(tree, new THREE.ConeGeometry(0.78, 2, 7), leafMaterial).position.y = 6
  parent.add(tree)
}

function createTorii(parent) {
  const torii = new THREE.Group()
  const material = createToonMaterial(COLORS.red)
  const postGeometry = new THREE.CylinderGeometry(0.3, 0.4, WORLD.toriiHeight, 8)
  for (const x of [-2.2, 2.2]) {
    const post = addOutlinedMesh(torii, postGeometry, material)
    post.position.set(x, WORLD.toriiHeight / 2, -WORLD.arenaRadius - 1)
  }
  for (const [height, width, depth] of [[WORLD.toriiHeight - 0.5, 6.2, 0.55], [WORLD.toriiHeight - 1.35, 5.3, 0.45]]) {
    const beam = addOutlinedMesh(torii, new THREE.BoxGeometry(width, 0.4, depth), material)
    beam.position.set(0, height, -WORLD.arenaRadius - 1)
  }
  parent.add(torii)
}

export function createArena() {
  const arena = new THREE.Group()
  const stoneMaterial = createToonMaterial(COLORS.stone)
  const darkStoneMaterial = createToonMaterial(COLORS.stoneDark)
  const floor = addOutlinedMesh(arena, new THREE.CylinderGeometry(WORLD.arenaRadius, WORLD.arenaRadius + 0.3, WORLD.arenaHeight, 32), stoneMaterial)
  floor.position.y = 0
  const edge = addOutlinedMesh(arena, new THREE.TorusGeometry(WORLD.arenaRadius - 0.15, 0.22, 6, 32), darkStoneMaterial)
  edge.rotation.x = Math.PI / 2
  edge.position.y = WORLD.arenaHeight / 2 + 0.1
  for (let index = 0; index < WORLD.stairCount; index += 1) {
    const height = WORLD.arenaHeight / 2 - (WORLD.stairCount - index) * WORLD.stairRise
    const stair = addOutlinedMesh(arena, new THREE.BoxGeometry(WORLD.stairWidth, WORLD.stairRise * (WORLD.stairCount + 1), WORLD.stairDepth), stoneMaterial)
    stair.position.set(0, height - stair.geometry.parameters.height / 2, PLAYER_STAIR_Z(index))
  }
  createTorii(arena)
  createTree(arena, -8, -3, 0.9)
  createTree(arena, 8, 0, 1.15)
  createTree(arena, -6, 6, 0.72)
  return arena
}

function PLAYER_STAIR_Z(index) {
  return WORLD.arenaRadius + 1 + index * WORLD.stairDepth
}
