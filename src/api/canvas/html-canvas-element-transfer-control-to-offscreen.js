import { htmlCanvasMethod } from "./html-canvas-element-method.js";
import { transferHTMLCanvasControl } from "./html-canvas-element-state.js";
export const transferControlToOffscreen = htmlCanvasMethod(
  "transferControlToOffscreen",
  0,
  canvas => transferHTMLCanvasControl(canvas),
);
