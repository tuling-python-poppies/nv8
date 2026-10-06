import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLTableCaptionElement,
  installHTMLTableCaptionElementConstructor,
} from "../api/dom/html-table-caption-element-constructor.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";

export function installHTMLTableCaptionElement() {
  installHTMLTableCaptionElementConstructor();for (const [name, entry] of stringReflectionTable) definePrototypeAccessor( HTMLTableCaptionElement.prototype, name, entry.get, entry.set, );
  defineConstructorBacklink(
    HTMLTableCaptionElement.prototype,
    HTMLTableCaptionElement,
  );
  defineToStringTag(
    HTMLTableCaptionElement.prototype,
    "HTMLTableCaptionElement",
  );
}
