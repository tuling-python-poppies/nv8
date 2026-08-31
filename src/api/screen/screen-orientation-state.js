import { initializeEventTarget } from "../event/event-target-state.js";
import { ScreenOrientation } from "./screen-orientation-constructor.js";

const orientationState = new WeakMap();

export function createScreenOrientation(width, height) {
  const value = Object.create(ScreenOrientation.prototype);
  initializeEventTarget(value);
  orientationState.set(value, {
    angle: 0,
    type: width >= height ? "landscape-primary" : "portrait-primary",
    onchange: null,
  });
  return value;
}

export function requireScreenOrientation(value) {
  const state = orientationState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}
