import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { documentCookieString } from "./cookie-state.js";
import { requireDocument } from "./document-record.js";

export const cookie = Object.getOwnPropertyDescriptor({
  get cookie() {
    requireDocument(this);
    const value = documentCookieString();
    traceGetter("window.Document.prototype.cookie", "Document", value);
    return value;
  },
}, "cookie").get;
registerNativeGetter(cookie, "cookie");
