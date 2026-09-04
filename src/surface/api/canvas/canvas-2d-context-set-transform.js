import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { setTransformOperation } from "./canvas-2d-context-operations.js";

export const setTransform = canvasContextMethod(
  "setTransform",
  0,
  setTransformOperation,
);
