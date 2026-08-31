import { offscreenCanvasMethod } from "./offscreen-canvas-method.js";
import { getOffscreenCanvasContext } from "./offscreen-canvas-state.js";
export const getContext = offscreenCanvasMethod(
  "getContext",
  1,
  (canvas, args) => getOffscreenCanvasContext(canvas, args[0], args[1]),
);
