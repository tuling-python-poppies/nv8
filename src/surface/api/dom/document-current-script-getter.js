import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { currentScriptOf } from "./document-record.js";

export const currentScript = Object.getOwnPropertyDescriptor({
  get currentScript() {
    const value = currentScriptOf(this);
    traceGetter("window.Document.prototype.currentScript", "Document", value);
    return value;
  },
}, "currentScript").get;
registerNativeGetter(currentScript, "currentScript");
export function installDocumentCurrentScript() {
  definePrototypeGetter(Document.prototype, "currentScript", currentScript);
}
