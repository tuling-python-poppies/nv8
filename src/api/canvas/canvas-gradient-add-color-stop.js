import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { DOMException } from "../event/dom-exception-constructor.js";
import { requireCanvasGradient } from "./canvas-gradient-state.js";

export const addColorStop = {
  addColorStop(offset, color) {
    const normalizedOffset = Number(offset);
    if (!Number.isFinite(normalizedOffset) || normalizedOffset < 0 || normalizedOffset > 1) {
      throw new DOMException("The offset must be between 0 and 1", "IndexSizeError");
    }
    const normalizedColor = `${color}`;
    if (normalizedColor.trim() === "") {
      throw new DOMException("The color cannot be parsed", "SyntaxError");
    }
    const state = requireCanvasGradient(this);
    state.stops.push([normalizedOffset, normalizedColor]);
    state.stops.sort((left, right) => left[0] - right[0]);
    traceCall(
      "window.CanvasGradient.prototype.addColorStop",
      "CanvasGradient",
      [offset, color],
      undefined,
    );
  },
}.addColorStop;
registerNativeFunction(addColorStop, "addColorStop");
