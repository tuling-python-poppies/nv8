import { CanvasPattern } from "./canvas-pattern-constructor.js";

const patternState = new WeakMap();

export function createCanvasPattern(source, repetition) {
  if (!["repeat", "repeat-x", "repeat-y", "no-repeat"].includes(repetition)) {
    throw new TypeError("The repetition type is invalid");
  }
  const pattern = Object.create(CanvasPattern.prototype);
  patternState.set(pattern, {
    source,
    repetition,
    transform: [1, 0, 0, 1, 0, 0],
  });
  return pattern;
}

export function requireCanvasPattern(pattern) {
  const state = patternState.get(pattern);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

export function isCanvasPattern(value) {
  return patternState.has(value);
}
