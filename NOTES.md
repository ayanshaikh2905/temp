# Ink Boss

## Folder structure

```text
src/
  main.js                 Scene boot, render loop, and system wiring
  config.js               World, player, combat, camera, HUD, and palette values
  core/input.js           Keyboard, mouse, buffering, and focus handling
  core/collision.js       Arena, stair, and tree collision limits
  core/feedback.js        Hit stop, camera shake, and ink splash feedback
  scene/arena.js          Arena, stairs, torii, and trees
  scene/ground.js         Shared ground-height lookup
  scene/sky.js            Paper dome, sun, ridge layers, and mist
  scene/look.js           Toon materials and cached normal-push outlines
  player/character.js     Primitive wandering swordsman and named pivots
  player/animations.js    Idle, walk, roll, attack, hurt, and dead poses
  player/player.js        Movement, stamina, roll, attack, health, and targets
  player/playerStates.js  Player state transitions
  player/cameraRig.js     Pointer-lock orbit camera and shake
  boss/dummy.js           Training target implementing the target interface
  ui/style.js             Global paper and HUD styling
  ui/hud.js               DOM health, stamina, hint, death, and FPS HUD
```

## Controls

WASD moves relative to the camera. Mouse movement orbits while pointer lock is active.
Space rolls, left click attacks, R restarts after death, and F3 toggles FPS.

## Current state

Phase 2 is playable with the swordsman, stairs, camera, stamina, dodge roll, light
attack, training dummy, and hit feedback. The boss is intentionally not implemented.

Simple decisions:

- The arena top is the shared ground height and stairs descend away from it.
- The sky dome follows the camera while the ridge layers remain world geometry.
- A dummy resets immediately after reaching zero health so combat can be tested repeatedly.
- Feedback uses a small transient mesh pool; its simple cleanup keeps the renderer light.
