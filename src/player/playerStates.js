export function createPlayerState() {
  return { name: 'idle', timer: 0, mirror: false, invincible: false }
}

export function setState(state, name) {
  state.name = name
  state.timer = 0
  state.invincible = name === 'roll'
}
