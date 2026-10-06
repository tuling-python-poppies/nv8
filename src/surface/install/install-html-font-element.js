import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLFontElement,
  installHTMLFontElementConstructor,
} from "../api/dom/html-font-element-constructor.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";

export function installHTMLFontElement() {
  installHTMLFontElementConstructor();for (const [name, entry] of stringReflectionTable) definePrototypeAccessor(HTMLFontElement.prototype, name, entry.get, entry.set);
  defineConstructorBacklink(HTMLFontElement.prototype, HTMLFontElement);
  defineToStringTag(HTMLFontElement.prototype, "HTMLFontElement");
}
