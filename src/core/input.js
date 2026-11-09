const held = new Set()
const pressed = new Set()
const mouseHeld = new Set()
const mousePressed = new Set()
const mouseBuffer = new Set()
const buffer = new Map()
const BUFFER_TIME = 0.15

export function createInput(element) {
  window.addEventListener('keydown', (event) => {
    if (!held.has(event.code)) pressed.add(event.code)
    held.add(event.code)
  })
  window.addEventListener('keyup', (event) => held.delete(event.code))
  window.addEventListener('mousedown', (event) => {
    mouseHeld.add(event.button)
    mousePressed.add(event.button)
  })
  window.addEventListener('mouseup', (event) => mouseHeld.delete(event.button))
  window.addEventListener('blur', clearInput)
  element.addEventListener('contextmenu', (event) => event.preventDefault())
  return {
    update(delta) {
      for (const code of pressed) buffer.set(code, BUFFER_TIME)
      for (const button of mousePressed) mouseBuffer.add(button)
      for (const [code, time] of buffer) {
        const next = time - delta
        if (next <= 0) buffer.delete(code)
        else buffer.set(code, next)
      }
      pressed.clear()
      mousePressed.clear()
    },
    held(code) { return held.has(code) },
    pressed(code) { return buffer.has(code) },
    consume(code) { return buffer.delete(code) },
    mousePressed(button) { return mouseBuffer.has(button) },
    consumeMouse(button) { return mouseBuffer.delete(button) },
    clearPressed() { buffer.clear() }
  }
}

function clearInput() {
  held.clear()
  pressed.clear()
  mouseHeld.clear()
  mousePressed.clear()
  mouseBuffer.clear()
  buffer.clear()
}
