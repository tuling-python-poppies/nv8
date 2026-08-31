import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { fillRectOperation } from "./canvas-2d-context-operations.js";

export const fillRect = canvasContextMethod("fillRect", 4, fillRectOperation);
