import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeAccessor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import {
  getAttributeValue,
  requireElement,
  setAttributeValue,
} from "./element-state.js";
import { HTMLHtmlElement } from "./html-html-element-constructor.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get version() {
    requireElement(this);
    const result = getAttributeValue(this, "version") ?? "";
    traceGetter(
      "window.HTMLHtmlElement.prototype.version",
      "HTMLHtmlElement",
      result,
    );
    return result;
  },
  set version(value) {
    requireElement(this);
    setAttributeValue(this, "version", `${value}`);
  },
}, "version");

export const version = descriptor.get;
export const setVersion = descriptor.set;
registerNativeGetter(version, "version");
registerNativeFunction(setVersion, "set version");

export function installHTMLHtmlElementVersion() {
  definePrototypeAccessor(
    HTMLHtmlElement.prototype,
    "version",
    version,
    setVersion,
  );
}
