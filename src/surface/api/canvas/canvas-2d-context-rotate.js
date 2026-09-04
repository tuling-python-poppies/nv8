import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { rotateOperation } from "./canvas-2d-context-operations.js";

export const rotate = canvasContextMethod("rotate", 1, rotateOperation);
