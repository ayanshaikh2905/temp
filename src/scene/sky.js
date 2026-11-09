import * as THREE from 'three'
import { COLORS, MIST, WORLD } from '../config.js'

function createSkyTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const context = canvas.getContext('2d')
  const gradient = context.createLinearGradient(0, 0, 0, 32)
  gradient.addColorStop(0, '#9caeb2')
  gradient.addColorStop(0.7, '#e7d8b8')
  gradient.addColorStop(1, '#f2e7cb')
  context.fillStyle = gradient
  context.fillRect(0, 0, 32, 32)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function createRidge(index) {
  const geometry = new THREE.CylinderGeometry(70 + index * 17, 70 + index * 17, 34, 64, 1, true)
  const position = geometry.attributes.position
  for (let i = 0; i < position.count; i += 1) {
    if (position.getY(i) > 0) {
      const angle = Math.atan2(position.getZ(i), position.getX(i))
      position.setY(i, 8 + Math.sin(angle * (index + 3) * 2.1 + index) * 3 + Math.sin(angle * 11) * 1.2)
    }
  }
  position.needsUpdate = true
  geometry.computeVertexNormals()
  const color = new THREE.Color(COLORS.mountainFar).lerp(new THREE.Color(COLORS.mountainMid), (WORLD.mountainCount - index) / WORLD.mountainCount)
  return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color, side: THREE.BackSide, fog: true }))
}

export function createSky() {
  const sky = new THREE.Group()
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(160, 32, 16),
    new THREE.MeshBasicMaterial({ map: createSkyTexture(), side: THREE.BackSide, fog: false, depthWrite: false })
  )
  sky.add(dome)
  const sun = new THREE.Mesh(new THREE.CircleGeometry(MIST.sunRadius, 24), new THREE.MeshBasicMaterial({ color: COLORS.red, transparent: true, opacity: 0.76, fog: false }))
  sun.position.set(MIST.sunOffsetX, MIST.sunHeight, -40)
  sun.lookAt(0, 0, 0)
  sky.add(sun)
  for (let index = 0; index < WORLD.mountainCount; index += 1) {
    sky.add(createRidge(index))
  }
  for (let index = 0; index < 3; index += 1) {
    const mist = new THREE.Mesh(new THREE.PlaneGeometry(90, 2), new THREE.MeshBasicMaterial({ color: COLORS.white, transparent: true, opacity: 0.1, depthWrite: false }))
    mist.position.set(0, 5 + index * 3, -18 - index * 15)
    sky.add(mist)
  }
  sky.userData.dome = dome
  return sky
}
