import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { DOMException } from "./dom-exception-constructor.js";
import { requireDOMException } from "./dom-exception-state.js";

const domExceptionName = {
  domExceptionName() {
  const value = requireDOMException(this).name;
  traceGetter("window.DOMException.prototype.name", "DOMException", value);
  return value;

  },
}.domExceptionName;

registerNativeGetter(domExceptionName, "name");

export function installDOMExceptionName() {
  definePrototypeGetter(DOMException.prototype, "name", domExceptionName);
}
