import * as THREE from 'three'
import { COLORS, FEEDBACK } from '../config.js'

export function createFeedback(scene, cameraRig) {
  const group = new THREE.Group()
  const splashes = []
  let hitStop = 0
  scene.add(group)
  return {
    update(delta) {
      hitStop = Math.max(0, hitStop - delta)
      for (const splash of splashes) {
        splash.life -= delta
        splash.velocity.y -= 8 * delta
        splash.mesh.position.addScaledVector(splash.velocity, delta)
        splash.mesh.scale.setScalar(Math.max(0, splash.life / 0.4))
        if (splash.life <= 0) group.remove(splash.mesh)
      }
    },
    getDelta(delta) { return hitStop > 0 ? 0 : delta },
    hit(target) {
      hitStop = FEEDBACK.hitStop
      cameraRig.addShake(FEEDBACK.shakeStrength, FEEDBACK.shakeDuration)
      for (let index = 0; index < 10; index += 1) {
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.08), new THREE.MeshBasicMaterial({ color: index === 0 ? COLORS.red : COLORS.ink, transparent: true, side: THREE.DoubleSide }))
        mesh.position.copy(target.position)
        mesh.position.y += 1
        mesh.rotation.x = -Math.PI / 2
        group.add(mesh)
        splashes.push({ mesh, life: 0.4, velocity: new THREE.Vector3((Math.random() - 0.5) * 3, Math.random() * 2 + 1, (Math.random() - 0.5) * 3) })
      }
    }
  }
}
