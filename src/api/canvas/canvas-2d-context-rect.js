import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { appendPathOperation } from "./canvas-2d-context-operations.js";

export const rect = canvasContextMethod("rect", 4, appendPathOperation("rect", 4));
