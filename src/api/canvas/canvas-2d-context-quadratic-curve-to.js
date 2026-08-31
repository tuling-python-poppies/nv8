import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { appendPathOperation } from "./canvas-2d-context-operations.js";

export const quadraticCurveTo = canvasContextMethod(
  "quadraticCurveTo",
  4,
  appendPathOperation("quadraticCurveTo", 4),
);
