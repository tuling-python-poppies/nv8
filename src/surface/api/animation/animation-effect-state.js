const state = new WeakMap();

function defaultTiming() {
  return {
    delay: 0,
    direction: "normal",
    duration: "auto",
    easing: "linear",
    endDelay: 0,
    fill: "auto",
    iterationStart: 0,
    iterations: 1,
  };
}

export function initializeAnimationEffect(effect, options) {
  const timing = defaultTiming();
  applyTiming(timing, options);
  state.set(effect, timing);
}

function requireAnimationEffect(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function isAnimationEffect(value) {
  return state.has(value);
}

export function updateAnimationEffectTiming(effect, options) {
  applyTiming(requireAnimationEffect(effect), options);
}

export function animationEffectTiming(effect, computed = false) {
  const timing = requireAnimationEffect(effect);
  const duration = timing.duration === "auto" ? 0 : timing.duration;
  const result = {
    delay: timing.delay,
    direction: timing.direction,
    duration: computed ? duration : timing.duration,
    easing: timing.easing,
    endDelay: timing.endDelay,
    fill: computed && timing.fill === "auto" ? "none" : timing.fill,
    iterationStart: timing.iterationStart,
    iterations: timing.iterations,
  };
  if (computed) {
    result.activeDuration = duration * timing.iterations;
    result.currentIteration = null;
    result.endTime = timing.delay + result.activeDuration + timing.endDelay;
    result.localTime = null;
    result.progress = null;
  }
  return result;
}

function applyTiming(timing, value) {
  if (value === undefined || value === null) return;
  if (typeof value === "number") {
    timing.duration = finiteNonNegative(value, "duration");
    return;
  }
  if (typeof value !== "object") return;
  if (value.delay !== undefined) timing.delay = finiteNumber(value.delay, "delay");
  if (value.direction !== undefined) timing.direction = `${value.direction}`;
  if (value.duration !== undefined) {
    timing.duration = value.duration === "auto"
      ? "auto"
      : finiteNonNegative(value.duration, "duration");
  }
  if (value.easing !== undefined) timing.easing = `${value.easing}`;
  if (value.endDelay !== undefined) timing.endDelay = finiteNumber(value.endDelay, "endDelay");
  if (value.fill !== undefined) timing.fill = `${value.fill}`;
  if (value.iterationStart !== undefined) {
    timing.iterationStart = finiteNonNegative(value.iterationStart, "iterationStart");
  }
  if (value.iterations !== undefined) {
    timing.iterations = finiteNonNegative(value.iterations, "iterations");
  }
}

function finiteNumber(value, name) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError(`${name} must be finite`);
  return number;
}

function finiteNonNegative(value, name) {
  const number = finiteNumber(value, name);
  if (number < 0) throw new TypeError(`${name} must be non-negative`);
  return number;
}
