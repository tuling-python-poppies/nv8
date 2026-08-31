import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../webidl/cross-realm-method.js";
import { Element } from "./element-constructor.js";
import { setAttributeValue } from "./element-state.js";
import { requireArguments } from "../../webidl/conversions.js";

export const setAttribute = {
  setAttribute(name, value) {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "setAttribute",
      setAttribute,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    requireArguments(2, arguments.length, "setAttribute", "Element");
    setAttributeValue(this, name, `${value}`);
    traceCall("window.Element.prototype.setAttribute", "Element", [name, value], undefined);
  },
}.setAttribute;
registerNativeFunction(setAttribute, "setAttribute");
export function installElementSetAttribute() {
  definePrototypeMethod(Element.prototype, "setAttribute", setAttribute);
}
