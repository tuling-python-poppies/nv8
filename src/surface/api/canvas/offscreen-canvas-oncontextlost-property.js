import { offscreenCanvasProperty } from "./offscreen-canvas-property.js";
import { setOffscreenCanvasHandler } from "./offscreen-canvas-state.js";
const descriptor = offscreenCanvasProperty(
  "oncontextlost",
  state => state.oncontextlost,
  (canvas, value) => setOffscreenCanvasHandler(canvas, "oncontextlost", value),
);
export const oncontextlost = descriptor.get;
export const setOncontextlost = descriptor.set;
