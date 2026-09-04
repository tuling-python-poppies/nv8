import { definePrototypeAccessor } from "../../../engine/webidl/descriptor.js";
import { Document } from "./document-constructor.js";
import { cookie } from "./document-cookie-getter.js";
import { setCookie } from "./document-cookie-setter.js";

export function installDocumentCookie() {
  definePrototypeAccessor(Document.prototype, "cookie", cookie, setCookie);
}
