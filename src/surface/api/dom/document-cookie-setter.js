import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { setDocumentCookie } from "./cookie-state.js";
import { requireDocument } from "./document-record.js";

export const setCookie = Object.getOwnPropertyDescriptor({
  set cookie(value) {
    requireDocument(this);
    setDocumentCookie(value);
  },
}, "cookie").set;
registerNativeFunction(setCookie, "set cookie");
