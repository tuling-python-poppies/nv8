import { initializeEventTarget } from "../event/event-target-state.js";
import { PictureInPictureWindow } from "./picture-in-picture-window-constructor.js";

const windowState = new WeakMap();

export function createPictureInPictureWindow(width = 0, height = 0) {
  const window = Object.create(PictureInPictureWindow.prototype);
  initializeEventTarget(window);
  windowState.set(window, {
    width: Number(width),
    height: Number(height),
    onresize: null,
  });
  return window;
}

export function requirePictureInPictureWindow(window) {
  const state = windowState.get(window);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}
