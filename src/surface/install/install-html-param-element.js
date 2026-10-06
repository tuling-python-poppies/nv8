import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLParamElement,
  installHTMLParamElementConstructor,
} from "../api/dom/html-param-element-constructor.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";

export function installHTMLParamElement() {
  installHTMLParamElementConstructor();for (const [name, entry] of stringReflectionTable) definePrototypeAccessor(HTMLParamElement.prototype, name, entry.get, entry.set);for (const [name, entry] of stringReflectionTable) definePrototypeAccessor( HTMLParamElement.prototype, name, entry.get, entry.set, );
  defineConstructorBacklink(HTMLParamElement.prototype, HTMLParamElement);
  defineToStringTag(HTMLParamElement.prototype, "HTMLParamElement");
}
