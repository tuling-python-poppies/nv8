import { definePrototypeAccessor } from "../../webidl/descriptor.js";
import { Document } from "./document-constructor.js";
import { setTitle } from "./document-title-setter.js";
import { title } from "./document-title-getter.js";

export function installDocumentTitle() {
  definePrototypeAccessor(Document.prototype, "title", title, setTitle);
}
