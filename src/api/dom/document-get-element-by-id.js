import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { documentElements } from "./document-record.js";
import { requireArguments } from "../../webidl/conversions.js";

export const getElementById = {
  getElementById(id) {
    requireArguments(1, arguments.length, "getElementById", "Document");
    const normalized = `${id}`;
    const result = documentElements(this).find(
      element => element.getAttribute("id") === normalized,
    ) ?? null;
    traceCall("window.Document.prototype.getElementById", "Document", [id], result);
    return result;
  },
}.getElementById;
registerNativeFunction(getElementById, "getElementById");
export function installDocumentGetElementById() {
  definePrototypeMethod(Document.prototype, "getElementById", getElementById);
}
