import { documentMethod } from "./document-method.js";
import { exitFullscreenOperation } from "./document-extended-method-operations.js";
export const exitFullscreen = documentMethod("exitFullscreen", 0, exitFullscreenOperation);
