import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../../engine/webidl/cross-realm-method.js";
import { Element } from "./element-constructor.js";
import { getAttributeValue } from "./element-state.js";

export const getAttribute = {
  getAttribute(name) {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "getAttribute",
      getAttribute,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    const result = getAttributeValue(this, name);
    traceCall("window.Element.prototype.getAttribute", "Element", [name], result);
    return result;
  },
}.getAttribute;
registerNativeFunction(getAttribute, "getAttribute");
export function installElementGetAttribute() {
  definePrototypeMethod(Element.prototype, "getAttribute", getAttribute);
}
