import { traceCall } from "../../../infra/trace/trace-function.js";
import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLOptionElement,
  createHTMLOptionElement,
} from "./html-option-element-constructor.js";
import {
  configureOptionSelectedness,
} from "./html-option-element-state.js";

export function Option() {
  const text = arguments[0] === undefined ? "" : `${arguments[0]}`;
  const value = arguments[1] === undefined ? text : `${arguments[1]}`;
  const defaultSelected = Boolean(arguments[2]);
  const selected = Boolean(arguments[3]);
  const option = createHTMLOptionElement("option", globalThis.document);
  option.text = text;
  if (arguments[1] !== undefined) {
    option.value = value;
  }
  option.defaultSelected = defaultSelected;
  configureOptionSelectedness(option, selected, defaultSelected);
  traceCall("window.Option", "Window", [...arguments], option);
  return option;
}
registerNativeFunction(Option, "Option");

export function installOptionConstructor() {
  Object.defineProperty(Option, "prototype", {
    value: HTMLOptionElement.prototype,
    writable: false,
    enumerable: false,
    configurable: false,
  });
  defineGlobalConstructor("Option", Option);
}
