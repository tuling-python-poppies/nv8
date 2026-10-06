import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLBaseElement,
  installHTMLBaseElementConstructor,
} from "../api/dom/html-base-element-constructor.js";
import {
  href,
  setHref,
} from "../api/dom/html-base-element-href-property.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";

export function installHTMLBaseElement() {
  installHTMLBaseElementConstructor();
  definePrototypeAccessor(HTMLBaseElement.prototype, "href", href, setHref);for (const [name, entry] of stringReflectionTable) definePrototypeAccessor( HTMLBaseElement.prototype, name, entry.get, entry.set, );
  defineConstructorBacklink(HTMLBaseElement.prototype, HTMLBaseElement);
  defineToStringTag(HTMLBaseElement.prototype, "HTMLBaseElement");
}
