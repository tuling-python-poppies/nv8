import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { strokeRectOperation } from "./canvas-2d-context-operations.js";

export const strokeRect = canvasContextMethod("strokeRect", 4, strokeRectOperation);
