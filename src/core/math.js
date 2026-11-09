export function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value))
}

export function shortestAngleDifference(from, to) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from))
}

export function approach(value, target, maxDelta) {
  if (Math.abs(target - value) <= maxDelta) return target
  return value + Math.sign(target - value) * maxDelta
}

export function easeOutCubic(value) {
  const inverse = 1 - value
  return 1 - inverse * inverse * inverse
}

export function easeInOutSine(value) {
  return -(Math.cos(Math.PI * value) - 1) / 2
}
