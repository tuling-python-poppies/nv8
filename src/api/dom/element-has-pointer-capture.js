import { elementExtendedMethod } from "./element-extended-method.js";
import { hasPointerCaptureOperation } from "./element-extended-operations.js";
export const hasPointerCapture = elementExtendedMethod("hasPointerCapture", 1, hasPointerCaptureOperation);
