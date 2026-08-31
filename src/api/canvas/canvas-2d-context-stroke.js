import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { strokeOperation } from "./canvas-2d-context-operations.js";

export const stroke = canvasContextMethod("stroke", 0, strokeOperation);
