import * as THREE from 'three'
import { COLORS, FEEDBACK } from '../config.js'

export function createFeedback(scene, cameraRig) {
  const group = new THREE.Group()
  const splashGeometry = new THREE.PlaneGeometry(0.08, 0.08)
  const splashMaterials = [
    new THREE.MeshBasicMaterial({ color: COLORS.red, transparent: true, side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ color: COLORS.ink, transparent: true, side: THREE.DoubleSide })
  ]
  const splashes = Array.from({ length: 40 }, (_, index) => {
    const mesh = new THREE.Mesh(splashGeometry, splashMaterials[index === 0 ? 0 : 1])
    mesh.visible = false
    mesh.rotation.x = -Math.PI / 2
    group.add(mesh)
    return { mesh, life: 0, velocity: new THREE.Vector3() }
  })
  let hitStop = 0
  scene.add(group)
  return {
    update(delta) {
      hitStop = Math.max(0, hitStop - delta)
      for (const splash of splashes) {
        if (!splash.mesh.visible) continue
        splash.life -= delta
        splash.velocity.y -= 8 * delta
        splash.mesh.position.addScaledVector(splash.velocity, delta)
        splash.mesh.scale.setScalar(Math.max(0, splash.life / 0.4))
        if (splash.life <= 0) splash.mesh.visible = false
      }
    },
    getDelta(delta) { return hitStop > 0 ? 0 : delta },
    hit(target) {
      hitStop = FEEDBACK.hitStop
      cameraRig.addShake(FEEDBACK.shakeStrength, FEEDBACK.shakeDuration)
      for (let index = 0; index < 10; index += 1) {
        const splash = splashes.find((candidate) => !candidate.mesh.visible)
        if (!splash) break
        const mesh = splash.mesh
        mesh.position.copy(target.position)
        mesh.position.y += 1
        mesh.visible = true
        splash.life = 0.4
        splash.velocity.set((Math.random() - 0.5) * 3, Math.random() * 2 + 1, (Math.random() - 0.5) * 3)
      }
    }
  }
}
