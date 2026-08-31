import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { resetOperation } from "./canvas-2d-context-operations.js";
export const reset = canvasContextMethod("reset", 0, resetOperation);
