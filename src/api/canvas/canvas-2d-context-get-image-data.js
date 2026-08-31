import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { getImageDataOperation } from "./canvas-2d-context-operations.js";
export const getImageData = canvasContextMethod("getImageData", 4, getImageDataOperation);
