import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Document } from "./document-constructor.js";
import { createHTMLAllCollection } from "./html-all-collection-state.js";
import { requireDocument } from "./document-record.js";

export const all = Object.getOwnPropertyDescriptor({
  get all() {
    const state = requireDocument(this);
    if (state.all === undefined) {
      state.all = createHTMLAllCollection(this);
    }
    traceGetter("window.Document.prototype.all", "Document", state.all);
    return state.all;
  },
}, "all").get;
registerNativeGetter(all, "all");

export function installDocumentAll() {
  definePrototypeGetter(Document.prototype, "all", all);
}
