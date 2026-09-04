import { traceConstruct } from "../../../infra/trace/trace-function.js";
import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { DOMException } from "../event/dom-exception-constructor.js";
import { initializeDOMException } from "../event/dom-exception-state.js";
import { initializeOverconstrainedError } from "./overconstrained-error-state.js";
export function OverconstrainedError(constraint) {
  if (new.target === undefined || arguments.length < 1) {
    throw new TypeError(
      "Failed to construct 'OverconstrainedError': 1 argument required",
    );
  }
  const normalizedConstraint = `${constraint}`;
  const message = arguments[1] === undefined ? "" : `${arguments[1]}`;
  initializeDOMException(this, message, "OverconstrainedError");
  initializeOverconstrainedError(this, normalizedConstraint);
  traceConstruct(
    "window.OverconstrainedError",
    [normalizedConstraint, message],
    "OverconstrainedError",
  );
}
registerNativeFunction(OverconstrainedError, "OverconstrainedError");
export function installOverconstrainedErrorConstructor() {
  Object.setPrototypeOf(OverconstrainedError.prototype, DOMException.prototype);
  Object.setPrototypeOf(OverconstrainedError, DOMException);
  delete OverconstrainedError.prototype.constructor;
  defineGlobalConstructor("OverconstrainedError", OverconstrainedError);
}
