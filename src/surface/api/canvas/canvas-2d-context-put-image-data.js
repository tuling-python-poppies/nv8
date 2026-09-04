import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { putImageDataOperation } from "./canvas-2d-context-operations.js";

export const putImageData = canvasContextMethod(
  "putImageData",
  3,
  putImageDataOperation,
);
