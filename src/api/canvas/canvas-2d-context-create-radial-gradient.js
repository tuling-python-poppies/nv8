import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { createRadialGradientOperation } from "./canvas-2d-context-operations.js";
export const createRadialGradient = canvasContextMethod("createRadialGradient", 6, createRadialGradientOperation);
