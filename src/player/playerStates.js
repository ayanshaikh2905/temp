export function createPlayerState() {
  return { name: 'idle', timer: 0, mirror: false, invincible: false }
}

export function setState(state, name) {
  if (state.name === name) return false
  state.name = name
  state.timer = 0
  state.invincible = name === 'roll'
  return true
}
