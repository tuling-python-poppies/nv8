import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { measureTextOperation } from "./canvas-2d-context-operations.js";
export const measureText = canvasContextMethod("measureText", 1, measureTextOperation);
