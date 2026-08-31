import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../webidl/cross-realm-method.js";
import { URL } from "./url-constructor.js";
import { serializeURL } from "./url-state.js";

export const toString = {
  toString() {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "toString",
      toString,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    const value = serializeURL(this);
    traceCall("window.URL.prototype.toString", "URL", [], value);
    return value;
  },
}.toString;
registerNativeFunction(toString, "toString");
export function installURLToString() {
  definePrototypeMethod(URL.prototype, "toString", toString);
}
