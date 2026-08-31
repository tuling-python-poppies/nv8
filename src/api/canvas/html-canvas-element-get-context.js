import { htmlCanvasMethod } from "./html-canvas-element-method.js";
import { getHTMLCanvasContext } from "./html-canvas-element-state.js";
export const getContext = htmlCanvasMethod(
  "getContext",
  1,
  (canvas, args) => getHTMLCanvasContext(canvas, args[0], args[1]),
);
