import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { beginPathOperation } from "./canvas-2d-context-operations.js";

export const beginPath = canvasContextMethod("beginPath", 0, beginPathOperation);
