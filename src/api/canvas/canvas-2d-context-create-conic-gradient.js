import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { createConicGradientOperation } from "./canvas-2d-context-operations.js";
export const createConicGradient = canvasContextMethod("createConicGradient", 3, createConicGradientOperation);
