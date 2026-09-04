import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { currentDocument } from "./document-state.js";

export const globalDocument = Object.getOwnPropertyDescriptor({
  get document() {
    const value = currentDocument();
    traceGetter("window.document", "Window", value);
    return value;
  },
}, "document").get;
registerNativeGetter(globalDocument, "document");
