import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { initializeCanvas2DContext } from "./canvas-2d-context-state.js";

export function CanvasRenderingContext2D() {
  throw new TypeError(
    "Failed to construct 'CanvasRenderingContext2D': Illegal constructor",
  );
}
registerNativeFunction(CanvasRenderingContext2D, "CanvasRenderingContext2D");

export function createCanvasRenderingContext2D(canvas, width, height, options) {
  const context = Object.create(CanvasRenderingContext2D.prototype);
  initializeCanvas2DContext(context, canvas, width, height, options);
  return context;
}

export function installCanvasRenderingContext2DConstructor() {
  delete CanvasRenderingContext2D.prototype.constructor;
  defineGlobalConstructor("CanvasRenderingContext2D", CanvasRenderingContext2D);
}
