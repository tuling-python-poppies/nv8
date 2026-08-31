import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { appendPathOperation } from "./canvas-2d-context-operations.js";

export const bezierCurveTo = canvasContextMethod(
  "bezierCurveTo",
  6,
  appendPathOperation("bezierCurveTo", 6),
);
