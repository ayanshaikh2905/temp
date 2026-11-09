# Ink Boss

## Folder structure

```text
src/
  main.js                 Scene boot, render loop, and system wiring
  config.js               World, player, combat, camera, HUD, and palette values
  core/input.js           Keyboard, mouse, buffering, and focus handling
  core/colliders.js       Arena, stair, tree, and dynamic circle colliders
  core/math.js            Shared clamps, easing, and shortest-angle helpers
  core/springs.js         Reusable damped spring helpers
  core/feedback.js        Hit stop, camera shake, and ink splash feedback
  scene/arena.js          Arena, stairs, torii, and trees
  scene/ground.js         Shared ground-height lookup
  scene/sky.js            Paper dome, sun, ridge layers, and mist
  scene/look.js           Toon materials and cached normal-push outlines
  player/controller.js    Fixed-step acceleration, gravity, impulses, and grounding
  player/rig.js           Jointed humanoid skeleton and sword hierarchy
  player/ik.js            Analytic two-bone limb solver
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

Phase 3 Tasks 1-5 are playable with a jointed humanoid, stairs, camera, stamina,
dodge roll, light attack, training dummy, hit feedback, fixed-step movement, and
basic leg IK. The boss and advanced locomotion are intentionally not implemented.

Simple decisions:

- The arena top is the shared ground height and stairs descend away from it.
- The sky dome follows the camera while the ridge layers remain world geometry.
- A dummy resets immediately after reaching zero health so combat can be tested repeatedly.
- Feedback uses a 40-mesh pool that is created once and reused.
- Physics runs at 60 Hz with acceleration, deceleration, gravity, impulses, and circle
  colliders. Tuning values live in `src/config.js` under `PHYSICS`, `BODY`, `GAIT`,
  and `SECONDARY`.

Debug controls:

- F3 toggles FPS.
- F4 toggles the physics overlay.
- F5 toggles skeleton joint axes.
- `[` enables 0.25x slow motion and `]` restores normal speed.
