import { canvasContextMethod } from "./canvas-2d-context-method.js";
import { appendPathOperation } from "./canvas-2d-context-operations.js";

export const roundRect = canvasContextMethod(
  "roundRect",
  4,
  appendPathOperation("roundRect", 4),
);
