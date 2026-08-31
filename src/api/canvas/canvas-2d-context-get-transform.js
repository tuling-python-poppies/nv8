import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { getTransformOperation } from "./canvas-2d-context-operations.js";
export const getTransform = canvasContextMethod("getTransform", 0, getTransformOperation);
