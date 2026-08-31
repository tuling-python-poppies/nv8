import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { createPatternOperation } from "./canvas-2d-context-operations.js";
export const createPattern = canvasContextMethod("createPattern", 2, createPatternOperation);
