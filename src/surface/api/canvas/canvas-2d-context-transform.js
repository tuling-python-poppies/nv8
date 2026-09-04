import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { transformOperation } from "./canvas-2d-context-operations.js";

export const transform = canvasContextMethod("transform", 6, transformOperation);
