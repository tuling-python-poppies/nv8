import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
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
