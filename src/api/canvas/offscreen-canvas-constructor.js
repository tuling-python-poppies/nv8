import { traceConstruct } from "../../trace/trace-function.js";
import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { EventTarget } from "../event/event-target-constructor.js";
import { initializeOffscreenCanvas } from "./offscreen-canvas-state.js";

export function OffscreenCanvas(width, height) {
  if (new.target === undefined) {
    throw new TypeError(
      "Failed to construct 'OffscreenCanvas': Please use the 'new' operator, this DOM object constructor cannot be called as a function.",
    );
  }
  if (arguments.length < 2) {
    throw new TypeError(
      "Failed to construct 'OffscreenCanvas': 2 arguments required",
    );
  }
  initializeOffscreenCanvas(this, width, height);
  traceConstruct("window.OffscreenCanvas", [width, height], "OffscreenCanvas");
}
registerNativeFunction(OffscreenCanvas, "OffscreenCanvas");

export function createOffscreenCanvas(width, height) {
  const canvas = Object.create(OffscreenCanvas.prototype);
  initializeOffscreenCanvas(canvas, width, height);
  return canvas;
}

export function installOffscreenCanvasConstructor() {
  Object.setPrototypeOf(OffscreenCanvas.prototype, EventTarget.prototype);
  Object.setPrototypeOf(OffscreenCanvas, EventTarget);
  delete OffscreenCanvas.prototype.constructor;
  defineGlobalConstructor("OffscreenCanvas", OffscreenCanvas);
}
