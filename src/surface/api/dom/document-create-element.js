import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../../engine/webidl/cross-realm-method.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";
import { validateName } from "./element-state.js";
import { createHTMLElement } from "./html-element-constructor.js";
import { requireArguments } from "../../../engine/webidl/conversions.js";

export const createElement = {
  createElement(localName) {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "createElement",
      createElement,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    requireArguments(1, arguments.length, "createElement", "Document");
    requireDocument(this);
    const name = `${localName}`.toLowerCase();
    validateName(name);
    const result = createHTMLElement(name, this);
    traceCall("window.Document.prototype.createElement", "Document", [localName], result);
    return result;
  },
}.createElement;
registerNativeFunction(createElement, "createElement");
export function installDocumentCreateElement() {
  definePrototypeMethod(Document.prototype, "createElement", createElement);
}
