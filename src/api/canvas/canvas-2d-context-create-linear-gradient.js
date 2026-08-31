import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { createLinearGradientOperation } from "./canvas-2d-context-operations.js";
export const createLinearGradient = canvasContextMethod("createLinearGradient", 4, createLinearGradientOperation);
