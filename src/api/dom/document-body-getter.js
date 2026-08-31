import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { documentBody } from "./document-record.js";

export const body = Object.getOwnPropertyDescriptor({
  get body() {
    const value = documentBody(this);
    traceGetter("window.Document.prototype.body", "Document", value);
    return value;
  },
}, "body").get;
registerNativeGetter(body, "body");
export function installDocumentBody() {
  definePrototypeGetter(Document.prototype, "body", body);
}
