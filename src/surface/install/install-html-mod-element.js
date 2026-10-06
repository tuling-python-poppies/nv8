import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLModElement,
  installHTMLModElementConstructor,
} from "../api/dom/html-mod-element-constructor.js";
import { urlReflectionTable } from "../api/dom/html-mod-element-cite-property.js";
import { stringReflectionTable } from "../api/dom/html-mod-element-date-time-property.js";

export function installHTMLModElement() {
  installHTMLModElementConstructor();
  for (const [name, entry] of urlReflectionTable) definePrototypeAccessor(HTMLModElement.prototype, name, entry.get, entry.set);
  for (const [name, entry] of stringReflectionTable) definePrototypeAccessor( HTMLModElement.prototype, name, entry.get, entry.set, );
  defineConstructorBacklink(HTMLModElement.prototype, HTMLModElement);
  defineToStringTag(HTMLModElement.prototype, "HTMLModElement");
}
