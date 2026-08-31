import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { requireDocument } from "./document-record.js";
import { documentDefaultView } from "./document-default-view-state.js";

export const defaultView = Object.getOwnPropertyDescriptor({
  get defaultView() {
    requireDocument(this);
    const value = documentDefaultView();
    traceGetter("window.Document.prototype.defaultView", "Document", value);
    return value;
  },
}, "defaultView").get;
registerNativeGetter(defaultView, "defaultView");
export function installDocumentDefaultView() {
  definePrototypeGetter(Document.prototype, "defaultView", defaultView);
}
