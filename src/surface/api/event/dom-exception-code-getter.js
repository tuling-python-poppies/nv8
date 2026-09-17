import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import {
  DOMException,
  domExceptionLegacyCode,
} from "./dom-exception-constructor.js";
import { requireDOMException } from "./dom-exception-state.js";

const domExceptionCode = {
  domExceptionCode() {
  const value = domExceptionLegacyCode(requireDOMException(this).name);
  traceGetter("window.DOMException.prototype.code", "DOMException", value);
  return value;

  },
}.domExceptionCode;

registerNativeGetter(domExceptionCode, "code");

export function installDOMExceptionCode() {
  definePrototypeGetter(DOMException.prototype, "code", domExceptionCode);
}
