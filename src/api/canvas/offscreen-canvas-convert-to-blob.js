import { offscreenCanvasMethod } from "./offscreen-canvas-method.js";
import { offscreenCanvasBlob } from "./offscreen-canvas-state.js";
export const convertToBlob = offscreenCanvasMethod(
  "convertToBlob",
  0,
  (canvas, args) => Promise.resolve(offscreenCanvasBlob(canvas, args[0])),
);
