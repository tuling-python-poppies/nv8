import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  cite,
  setCite,
} from "../api/dom/html-mod-element-cite-property.js";
import {
  HTMLModElement,
  installHTMLModElementConstructor,
} from "../api/dom/html-mod-element-constructor.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";

export function installHTMLModElement() {
  installHTMLModElementConstructor();
  definePrototypeAccessor(HTMLModElement.prototype, "cite", cite, setCite);for (const [name, entry] of stringReflectionTable) definePrototypeAccessor( HTMLModElement.prototype, name, entry.get, entry.set, );
  defineConstructorBacklink(HTMLModElement.prototype, HTMLModElement);
  defineToStringTag(HTMLModElement.prototype, "HTMLModElement");
}
