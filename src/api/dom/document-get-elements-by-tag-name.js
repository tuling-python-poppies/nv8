import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Document } from "./document-constructor.js";
import {
  documentCollection,
  documentElements,
  requireDocument,
} from "./document-record.js";

export const getElementsByTagName = {
  getElementsByTagName(qualifiedName) {
    requireDocument(this);
    const name = `${qualifiedName}`.toLowerCase();
    const key = `tag:${name}`;
    const result = documentCollection(
      this,
      key,
      () => documentElements(this).filter(
        element => name === "*" || element.localName === name,
      ),
    );
    traceCall(
      "window.Document.prototype.getElementsByTagName",
      "Document",
      [qualifiedName],
      result,
    );
    return result;
  },
}.getElementsByTagName;
registerNativeFunction(getElementsByTagName, "getElementsByTagName");
export function installDocumentGetElementsByTagName() {
  definePrototypeMethod(
    Document.prototype,
    "getElementsByTagName",
    getElementsByTagName,
  );
}
