import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { getLineDashOperation } from "./canvas-2d-context-operations.js";
export const getLineDash = canvasContextMethod("getLineDash", 0, getLineDashOperation);
