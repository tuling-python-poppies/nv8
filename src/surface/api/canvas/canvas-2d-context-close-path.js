import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { closePathOperation } from "./canvas-2d-context-operations.js";

export const closePath = canvasContextMethod("closePath", 0, closePathOperation);
