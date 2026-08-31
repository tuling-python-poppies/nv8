import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { appendPathOperation } from "./canvas-2d-context-operations.js";

export const arc = canvasContextMethod("arc", 5, appendPathOperation("arc", 6, 5));
