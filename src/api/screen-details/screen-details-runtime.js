import { initializeEventTarget } from "../event/event-target-state.js";
import {
  initializeScreen,
  requireScreen,
} from "../screen/screen-state.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();

export function ScreenDetailed() {
  throw new TypeError("Illegal constructor");
}

export function ScreenDetails() {
  throw new TypeError("Illegal constructor");
}

registerNativeFunction(ScreenDetailed, "ScreenDetailed");
registerNativeFunction(ScreenDetails, "ScreenDetails");
export const screenDetailsConstructors = Object.freeze([
  ScreenDetailed,
  ScreenDetails,
]);

export function getScreenDetails() {
  const screen = Object.create(ScreenDetailed.prototype);
  initializeScreen(screen);
  const screenProfile = requireScreen(screen);
  state.set(screen, {
    kind: "screen",
    left: screenProfile.availLeft,
    top: screenProfile.availTop,
    isPrimary: !screenProfile.isExtended,
    isInternal: true,
    devicePixelRatio: screenProfile.devicePixelRatio,
    label: "Primary Display",
  });
  const details = Object.create(ScreenDetails.prototype);
  initializeEventTarget(details);
  state.set(details, {
    kind: "details",
    screens: [screen],
    currentScreen: screen,
    onscreenschange: null,
    oncurrentscreenchange: null,
  });
  return Promise.resolve(details);
}
registerNativeFunction(getScreenDetails, "getScreenDetails");

export function screenDetailsProperty(value, name) {
  return requireRecord(value)[name];
}

export function setScreenDetailsProperty(value, name, input) {
  const record = requireRecord(value);
  if (
    record.kind !== "details"
    || !["onscreenschange", "oncurrentscreenchange"].includes(name)
  ) {
    throw new TypeError("Illegal invocation");
  }
  record[name] = typeof input === "function" ? input : null;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}
