import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { translateOperation } from "./canvas-2d-context-operations.js";

export const translate = canvasContextMethod("translate", 2, translateOperation);
