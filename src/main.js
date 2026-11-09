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
import { createColliders } from './core/colliders.js'
import { setRigDebug } from './player/rig.js'

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
const colliders = createColliders()
const player = createPlayer(colliders)
const dummy = createDummy()
colliders.addCollider(dummy.position, dummy.radius)
scene.add(player)
scene.add(dummy)
const cameraRig = createCameraRig(camera, renderer.domElement, player)
const input = createInput(renderer.domElement)
const hud = createHud()
const feedback = createFeedback(scene, cameraRig)
window.addEventListener('keydown', (event) => {
  if (event.code === 'F3') window.__inkFps = !window.__inkFps
  if (event.code === 'F4') window.__inkDebug = !window.__inkDebug
  if (event.code === 'F5') {
    window.__inkSkeleton = !window.__inkSkeleton
    setRigDebug(player, window.__inkSkeleton)
  }
})
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, RENDER.maxPixelRatio))
})
const clock = new THREE.Clock()
let accumulator = 0
let timeScale = 1
window.addEventListener('keydown', (event) => {
  if (event.code === 'BracketLeft') timeScale = 0.25
  if (event.code === 'BracketRight') timeScale = 1
})
function animate() {
  const rawDelta = Math.min(clock.getDelta(), 0.05)
  input.update(rawDelta)
  const delta = feedback.getDelta(rawDelta) * timeScale
  accumulator += delta
  let steps = 0
  while (accumulator >= 1 / 60 && steps < 4) {
    updatePlayer(player, cameraRig, 1 / 60, input, [dummy], (target) => feedback.hit(target))
    accumulator -= 1 / 60
    steps += 1
  }
  dummy.userData.update(rawDelta)
  cameraRig.update(rawDelta)
  feedback.update(rawDelta)
  sky.userData.dome.position.copy(camera.position)
  hud.update(player, rawDelta)
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()
