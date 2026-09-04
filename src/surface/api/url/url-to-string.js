import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../../engine/webidl/cross-realm-method.js";
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
