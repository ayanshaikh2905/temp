import * as THREE from 'three'
import { createArena } from './scene/arena.js'
import { createSky } from './scene/sky.js'
import { COLORS, LIGHT, RENDER, CAMERA } from './config.js'
import { addStyle } from './ui/style.js'
import { createHud } from './ui/hud.js'
import { createInput } from './core/input.js'
import { createPlayer, updatePlayer } from './player/player.js'
import { createCameraRig } from './player/cameraRig.js'
import { createDummy } from './boss/dummy.js'
import { createFeedback } from './core/feedback.js'

addStyle()
const scene = new THREE.Scene()
scene.background = new THREE.Color(COLORS.paper)
scene.fog = new THREE.Fog(COLORS.mist, RENDER.fogNear, RENDER.fogFar)
const camera = new THREE.PerspectiveCamera(CAMERA.fov, window.innerWidth / window.innerHeight, CAMERA.near, CAMERA.far)
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, RENDER.maxPixelRatio))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
document.querySelector('#app').appendChild(renderer.domElement)
const sun = new THREE.DirectionalLight(COLORS.white, LIGHT.sunIntensity)
sun.position.set(LIGHT.sunPosition.x, LIGHT.sunPosition.y, LIGHT.sunPosition.z)
scene.add(sun)
scene.add(new THREE.AmbientLight(COLORS.white, LIGHT.ambientIntensity))
const sky = createSky()
scene.add(sky)
scene.add(createArena())
const player = createPlayer()
const dummy = createDummy()
scene.add(player)
scene.add(dummy)
const cameraRig = createCameraRig(camera, renderer.domElement, player)
const input = createInput(renderer.domElement)
const hud = createHud()
const feedback = createFeedback(scene, cameraRig)
window.addEventListener('keydown', (event) => {
  if (event.code === 'F3') window.__inkFps = !window.__inkFps
})
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, RENDER.maxPixelRatio))
})
const clock = new THREE.Clock()
function animate() {
  const rawDelta = Math.min(clock.getDelta(), 0.05)
  input.update(rawDelta)
  const delta = feedback.getDelta(rawDelta)
  updatePlayer(player, cameraRig, delta, input, [dummy], (target) => feedback.hit(target))
  cameraRig.update(rawDelta)
  feedback.update(rawDelta)
  sky.position.copy(camera.position)
  hud.update(player, rawDelta)
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()
