import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLBaseElement,
  installHTMLBaseElementConstructor,
} from "../api/dom/html-base-element-constructor.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";
import { urlReflectionTable } from "../api/dom/url-reflection-members.js";

export function installHTMLBaseElement() {
  installHTMLBaseElementConstructor();
  for (const [name, entry] of urlReflectionTable) definePrototypeAccessor(HTMLBaseElement.prototype, name, entry.get, entry.set);
  for (const [name, entry] of stringReflectionTable) definePrototypeAccessor( HTMLBaseElement.prototype, name, entry.get, entry.set, );
  defineConstructorBacklink(HTMLBaseElement.prototype, HTMLBaseElement);
  defineToStringTag(HTMLBaseElement.prototype, "HTMLBaseElement");
}
