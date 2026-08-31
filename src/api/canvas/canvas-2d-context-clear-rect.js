import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { clearRectOperation } from "./canvas-2d-context-operations.js";

export const clearRect = canvasContextMethod("clearRect", 4, clearRectOperation);
