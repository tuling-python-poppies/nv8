import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../../engine/webidl/cross-realm-method.js";
import { Element } from "./element-constructor.js";
import { matchesAlgorithm } from "./selector-engine.js";

export const matches = {
  matches(selector) {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "matches",
      matches,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    const result = matchesAlgorithm(this, selector);
    traceCall("window.Element.prototype.matches", "Element", [selector], result);
    return result;
  },
}.matches;
registerNativeFunction(matches, "matches");
export function installElementMatches() {
  definePrototypeMethod(Element.prototype, "matches", matches);
}
