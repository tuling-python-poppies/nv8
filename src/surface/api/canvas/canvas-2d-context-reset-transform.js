import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { resetTransformOperation } from "./canvas-2d-context-operations.js";

export const resetTransform = canvasContextMethod(
  "resetTransform",
  0,
  resetTransformOperation,
);
