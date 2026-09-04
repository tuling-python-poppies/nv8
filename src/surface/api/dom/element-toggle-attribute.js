import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Element } from "./element-constructor.js";
import {
  getAttributeValue,
  removeAttributeValue,
  setAttributeValue,
} from "./element-state.js";

export const toggleAttribute = {
  toggleAttribute(name) {
    const present = getAttributeValue(this, name) !== null;
    const force = arguments.length > 1 ? Boolean(arguments[1]) : undefined;
    let result;
    if (present && force !== true) {
      removeAttributeValue(this, name);
      result = false;
    } else if (!present && force !== false) {
      setAttributeValue(this, name, "");
      result = true;
    } else {
      result = present;
    }
    traceCall(
      "window.Element.prototype.toggleAttribute",
      "Element",
      [name, force],
      result,
    );
    return result;
  },
}.toggleAttribute;
registerNativeFunction(toggleAttribute, "toggleAttribute");
export function installElementToggleAttribute() {
  definePrototypeMethod(Element.prototype, "toggleAttribute", toggleAttribute);
}
