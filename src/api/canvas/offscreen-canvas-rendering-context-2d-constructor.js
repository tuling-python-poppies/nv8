import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { initializeCanvas2DContext } from "./canvas-2d-context-state.js";

export function OffscreenCanvasRenderingContext2D() {
  throw new TypeError(
    "Failed to construct 'OffscreenCanvasRenderingContext2D': Illegal constructor",
  );
}
registerNativeFunction(
  OffscreenCanvasRenderingContext2D,
  "OffscreenCanvasRenderingContext2D",
);

export function createOffscreenCanvasRenderingContext2D(
  canvas,
  width,
  height,
  options,
) {
  const context = Object.create(OffscreenCanvasRenderingContext2D.prototype);
  initializeCanvas2DContext(context, canvas, width, height, options);
  return context;
}

export function installOffscreenCanvasRenderingContext2DConstructor() {
  delete OffscreenCanvasRenderingContext2D.prototype.constructor;
  defineGlobalConstructor(
    "OffscreenCanvasRenderingContext2D",
    OffscreenCanvasRenderingContext2D,
  );
}
