import { offscreenCanvasProperty } from "./offscreen-canvas-property.js";
import { setOffscreenCanvasHandler } from "./offscreen-canvas-state.js";
const descriptor = offscreenCanvasProperty(
  "oncontextrestored",
  state => state.oncontextrestored,
  (canvas, value) => setOffscreenCanvasHandler(canvas, "oncontextrestored", value),
);
export const oncontextrestored = descriptor.get;
export const setOncontextrestored = descriptor.set;
