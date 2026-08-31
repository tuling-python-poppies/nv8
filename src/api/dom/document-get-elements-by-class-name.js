import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Document } from "./document-constructor.js";
import {
  documentCollection,
  documentElements,
  requireDocument,
} from "./document-record.js";

export const getElementsByClassName = {
  getElementsByClassName(classNames) {
    requireDocument(this);
    const tokens = `${classNames}`.trim().split(/\s+/u).filter(Boolean);
    const key = `class:${tokens.join(" ")}`;
    const result = documentCollection(
      this,
      key,
      () => documentElements(this).filter((element) => {
        const classes = (element.getAttribute("class") ?? "").split(/\s+/u);
        return tokens.every(token => classes.includes(token));
      }),
    );
    traceCall(
      "window.Document.prototype.getElementsByClassName",
      "Document",
      [classNames],
      result,
    );
    return result;
  },
}.getElementsByClassName;
registerNativeFunction(getElementsByClassName, "getElementsByClassName");
export function installDocumentGetElementsByClassName() {
  definePrototypeMethod(
    Document.prototype,
    "getElementsByClassName",
    getElementsByClassName,
  );
}
