import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { restoreOperation } from "./canvas-2d-context-operations.js";

export const restore = canvasContextMethod("restore", 0, restoreOperation);
