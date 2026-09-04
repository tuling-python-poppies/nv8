import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { appendPathOperation } from "./canvas-2d-context-operations.js";

export const lineTo = canvasContextMethod("lineTo", 2, appendPathOperation("lineTo", 2));
