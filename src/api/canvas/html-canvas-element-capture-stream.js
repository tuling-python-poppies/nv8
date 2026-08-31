import { htmlCanvasMethod } from "./html-canvas-element-method.js";
import { captureHTMLCanvasStream } from "./html-canvas-element-state.js";
export const captureStream = htmlCanvasMethod(
  "captureStream",
  0,
  (canvas, args) => captureHTMLCanvasStream(canvas, args[0]),
);
