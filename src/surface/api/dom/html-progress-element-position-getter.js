import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import {
  getAttributeValue,
  requireElement,
} from "./element-state.js";
import {
  progressMaximum,
  progressValue,
} from "./html-progress-element-state.js";

export const position = Object.getOwnPropertyDescriptor({
  get position() {
    requireElement(this);
    const result = getAttributeValue(this, "value") === null
      ? -1
      : progressValue(this) / progressMaximum(this);
    traceGetter(
      "window.HTMLProgressElement.prototype.position",
      "HTMLProgressElement",
      result,
    );
    return result;
  },
}, "position").get;
registerNativeGetter(position, "position");
