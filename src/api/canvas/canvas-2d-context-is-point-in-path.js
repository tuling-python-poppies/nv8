import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { isPointInPathOperation } from "./canvas-2d-context-operations.js";
export const isPointInPath = canvasContextMethod("isPointInPath", 2, isPointInPathOperation);
