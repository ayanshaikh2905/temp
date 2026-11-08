# Ink Boss

## Folder structure

```text
src/
  main.js             Three.js boot, input, render loop, and camera wiring
  config.js           World dimensions, palette, lighting, and render constants
  scene/arena.js      Stone arena, staircase, torii gate, and pine trees
  scene/sky.js        Paper sky, sun, and layered mountain planes
  scene/look.js       Three-tone toon material and inverted-hull outlines
  player/player.js    Capsule player, straw hat, movement, and camera follow
  boss/boss.js        Combat-phase boss placeholder
  ui/hud.js           Combat-phase HUD placeholder
  ui/style.js         Canvas layout and paper-grain overlay
```

## Current state

The visual exploration phase is playable in the browser. It includes a low-poly sumi-e arena, staircase, torii, trees, misty mountains, warm paper sky, toon shading, inverted-hull outlines, fog, and a paper grain overlay. The player moves with WASD or arrow keys and the third-person camera follows smoothly. Combat, boss logic, and HUD are intentionally not implemented yet.
