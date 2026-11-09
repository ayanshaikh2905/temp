import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { COLORS, WORLD } from '../config.js'

const toonGradient = new Uint8Array([
  32, 32, 32, 255,
  108, 108, 108, 255,
  210, 210, 210, 255
])
const gradientTexture = new THREE.DataTexture(toonGradient, 3, 1, THREE.RGBAFormat)
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.needsUpdate = true
const hullCache = new WeakMap()

export function createToonMaterial(color) {
  return new THREE.MeshToonMaterial({ color, gradientMap: gradientTexture })
}

function getHullGeometry(geometry) {
  if (!hullCache.has(geometry)) {
    const hull = mergeVertices(geometry.clone())
    hull.computeVertexNormals()
    hullCache.set(geometry, hull)
  }
  return hullCache.get(geometry)
}

export function addOutline(mesh, parent) {
  const outlineMaterial = new THREE.MeshBasicMaterial({
    color: COLORS.ink,
    side: THREE.BackSide,
    fog: true
  })
  outlineMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.outlineThickness = { value: WORLD.outlineThickness }
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      '#include <begin_vertex>\n transformed += normal * outlineThickness;'
    )
  }
  const outline = new THREE.Mesh(getHullGeometry(mesh.geometry), outlineMaterial)
  mesh.add(outline)
  return outline
}

export function addOutlinedMesh(parent, geometry, material) {
  const mesh = new THREE.Mesh(geometry, material)
  parent.add(mesh)
  addOutline(mesh, parent)
  return mesh
}
