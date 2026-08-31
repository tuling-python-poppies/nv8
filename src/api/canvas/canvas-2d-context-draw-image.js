import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { drawImageOperation } from "./canvas-2d-context-operations.js";
export const drawImage = canvasContextMethod("drawImage", 3, drawImageOperation);
