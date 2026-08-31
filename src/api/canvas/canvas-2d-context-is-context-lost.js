import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { isContextLostOperation } from "./canvas-2d-context-operations.js";
export const isContextLost = canvasContextMethod("isContextLost", 0, isContextLostOperation);
