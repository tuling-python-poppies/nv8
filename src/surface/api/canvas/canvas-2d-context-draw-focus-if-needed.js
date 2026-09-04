import { requireElement } from "../dom/element-state.js";
import { canvasContextMethod } from "./canvas-2d-context-method.js";

function drawFocusIfNeededOperation(state, args) {
  requireElement(args[0]);
}

export const drawFocusIfNeeded = canvasContextMethod(
  "drawFocusIfNeeded",
  1,
  drawFocusIfNeededOperation,
);
