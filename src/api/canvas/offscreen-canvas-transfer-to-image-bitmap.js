import { offscreenCanvasMethod } from "./offscreen-canvas-method.js";
import { offscreenCanvasBitmap } from "./offscreen-canvas-state.js";
export const transferToImageBitmap = offscreenCanvasMethod(
  "transferToImageBitmap",
  0,
  canvas => offscreenCanvasBitmap(canvas),
);
