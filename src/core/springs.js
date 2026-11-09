import * as THREE from 'three'

const springDifference = new THREE.Vector3()

export function springNumber(state, target, stiffness, damping, delta) {
  const velocity = state.velocity ?? 0
  const force = (target - state.value) * stiffness
  const nextVelocity = (velocity + force * delta) * Math.exp(-damping * delta)
  state.value += nextVelocity * delta
  state.velocity = nextVelocity
  return state.value
}

export function springVector3(state, target, stiffness, damping, delta) {
  springDifference.subVectors(target, state.value)
  state.velocity.addScaledVector(springDifference, stiffness * delta)
  state.velocity.multiplyScalar(Math.exp(-damping * delta))
  state.value.addScaledVector(state.velocity, delta)
  return state.value
}

export function springQuaternion(state, target, stiffness, damping, delta) {
  const angle = state.value.angleTo(target)
  if (angle < 0.0001) {
    state.value.copy(target)
    state.velocity = 0
    return state.value
  }
  const step = Math.min(1, stiffness * delta)
  state.value.slerp(target, step)
  state.velocity *= Math.exp(-damping * delta)
  return state.value
}

export function createNumberSpring(value = 0) {
  return { value, velocity: 0 }
}

export function createVectorSpring(value = new THREE.Vector3()) {
  return { value: value.clone(), velocity: new THREE.Vector3() }
}

export function createQuaternionSpring(value = new THREE.Quaternion()) {
  return { value: value.clone(), velocity: 0 }
}
