import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { appendPathOperation } from "./canvas-2d-context-operations.js";

export const arcTo = canvasContextMethod("arcTo", 5, appendPathOperation("arcTo", 5));
