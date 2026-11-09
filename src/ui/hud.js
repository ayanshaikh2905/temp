import { HUD } from '../config.js'

export function createHud() {
  const hud = document.createElement('div')
  hud.id = 'hud'
  hud.innerHTML = '<div id="bars"><div class="bar"><div id="health-fill" class="fill"></div></div><div class="bar"><div id="stamina-fill" class="fill"></div></div></div><div id="hint">WASD move &nbsp;|&nbsp; Mouse look &nbsp;|&nbsp; Space roll &nbsp;|&nbsp; Click attack</div><div id="lock-overlay">Click to play</div><div id="dead">YOU DIED<small>Press R</small></div><div id="fps"></div><div id="debug"></div><div id="boss-bar"></div>'
  document.body.appendChild(hud)
  const hint = hud.querySelector('#hint')
  window.setTimeout(() => { hint.style.opacity = '0' }, HUD.hintDuration * 1000)
  return {
    update(player, delta) {
      hud.querySelector('#health-fill').style.width = `${player.userData.health}%`
      hud.querySelector('#stamina-fill').style.width = `${player.userData.stamina}%`
      hud.querySelector('#dead').style.display = player.userData.state.name === 'dead' ? 'block' : 'none'
      hud.querySelector('#lock-overlay').style.display = document.pointerLockElement ? 'none' : 'block'
      if (window.__inkFps) {
        hud.querySelector('#fps').textContent = `${Math.round(1 / Math.max(delta, 0.001))} FPS`
      }
      const debug = hud.querySelector('#debug')
      debug.style.display = window.__inkDebug ? 'block' : 'none'
      if (window.__inkDebug) {
        const controller = player.userData.controller
        debug.textContent = `speed ${controller.velocity.length().toFixed(2)}  accel ${controller.acceleration.toFixed(2)}  grounded ${controller.grounded}  state ${player.userData.state.name}`
      }
    }
  }
}
