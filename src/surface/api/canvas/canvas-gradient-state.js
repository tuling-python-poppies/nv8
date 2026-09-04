import { CanvasGradient } from "./canvas-gradient-constructor.js";

const gradientState = new WeakMap();

export function createCanvasGradient(kind, parameters) {
  const gradient = Object.create(CanvasGradient.prototype);
  gradientState.set(gradient, {
    kind,
    parameters: parameters.map(Number),
    stops: [],
  });
  return gradient;
}

export function requireCanvasGradient(gradient) {
  const state = gradientState.get(gradient);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

export function isCanvasGradient(value) {
  return gradientState.has(value);
}
