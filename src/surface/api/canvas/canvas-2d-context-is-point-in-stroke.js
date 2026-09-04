import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { isPointInStrokeOperation } from "./canvas-2d-context-operations.js";
export const isPointInStroke = canvasContextMethod("isPointInStroke", 2, isPointInStrokeOperation);
