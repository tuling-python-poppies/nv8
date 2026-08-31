import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { appendPathOperation } from "./canvas-2d-context-operations.js";

export const moveTo = canvasContextMethod("moveTo", 2, appendPathOperation("moveTo", 2));
