import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { currentDocument } from "./document-state.js";

export const globalDocument = Object.getOwnPropertyDescriptor({
  get document() {
    const value = currentDocument();
    traceGetter("window.document", "Window", value);
    return value;
  },
}, "document").get;
registerNativeGetter(globalDocument, "document");
