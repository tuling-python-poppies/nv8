import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { strokeTextOperation } from "./canvas-2d-context-operations.js";
export const strokeText = canvasContextMethod("strokeText", 3, strokeTextOperation);
