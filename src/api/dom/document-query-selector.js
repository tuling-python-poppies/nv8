import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../webidl/cross-realm-method.js";
import { Document } from "./document-constructor.js";
import { querySelectorAlgorithm } from "./selector-engine.js";

export const querySelector = {
  querySelector(selector) {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "querySelector",
      querySelector,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    const result = querySelectorAlgorithm(this, selector);
    traceCall("window.Document.prototype.querySelector", "Document", [selector], result);
    return result;
  },
}.querySelector;
registerNativeFunction(querySelector, "querySelector");
export function installDocumentQuerySelector() {
  definePrototypeMethod(Document.prototype, "querySelector", querySelector);
}
