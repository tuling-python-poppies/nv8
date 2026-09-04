import { initializeEventTarget } from "../event/event-target-state.js";
import { Screen } from "./screen-constructor.js";
import { createScreenOrientation } from "./screen-orientation-state.js";

const screenState = new WeakMap();
let profile = {
  width: 1920,
  height: 1080,
  availWidth: 1920,
  availHeight: 1040,
  colorDepth: 24,
  pixelDepth: 24,
  devicePixelRatio: 1,
  availLeft: 0,
  availTop: 0,
  isExtended: false,
};
let singleton = null;

export function configureScreenProfile(
  width,
  height,
  availWidth,
  availHeight,
  colorDepth,
  pixelDepth,
  devicePixelRatio = 1,
  availLeft = 0,
  availTop = 0,
  isExtended = false,
) {
  profile = {
    width,
    height,
    availWidth,
    availHeight,
    colorDepth,
    pixelDepth,
    devicePixelRatio,
    availLeft,
    availTop,
    isExtended: Boolean(isExtended),
  };
  singleton = null;
}

export function currentScreenDevicePixelRatio() {
  return profile.devicePixelRatio;
}

export function currentScreen() {
  if (singleton !== null) {
    return singleton;
  }
  const value = Object.create(Screen.prototype);
  initializeScreen(value);
  singleton = value;
  return value;
}

export function initializeScreen(value) {
  initializeEventTarget(value);
  screenState.set(value, {
    ...profile,
    orientation: createScreenOrientation(profile.width, profile.height),
    onchange: null,
  });
}

export function requireScreen(value) {
  const state = screenState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}
