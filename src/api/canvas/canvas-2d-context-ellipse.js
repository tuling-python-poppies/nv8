import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { appendPathOperation } from "./canvas-2d-context-operations.js";

export const ellipse = canvasContextMethod(
  "ellipse",
  7,
  appendPathOperation("ellipse", 8, 7),
);
