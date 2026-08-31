import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { scaleOperation } from "./canvas-2d-context-operations.js";

export const scale = canvasContextMethod("scale", 2, scaleOperation);
