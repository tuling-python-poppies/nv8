import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { saveOperation } from "./canvas-2d-context-operations.js";

export const save = canvasContextMethod("save", 0, saveOperation);
