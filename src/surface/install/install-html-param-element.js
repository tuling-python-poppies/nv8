import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLParamElement,
  installHTMLParamElementConstructor,
} from "../api/dom/html-param-element-constructor.js";
import {
  stringReflectionPart1Table,
  stringReflectionPart2Table,
} from "../api/dom/string-reflection-html-param-element-members.js";

export function installHTMLParamElement() {
  installHTMLParamElementConstructor();
  for (const [name, entry] of stringReflectionPart1Table) definePrototypeAccessor(HTMLParamElement.prototype, name, entry.get, entry.set);
  for (const [name, entry] of stringReflectionPart2Table) definePrototypeAccessor( HTMLParamElement.prototype, name, entry.get, entry.set, );
  defineConstructorBacklink(HTMLParamElement.prototype, HTMLParamElement);
  defineToStringTag(HTMLParamElement.prototype, "HTMLParamElement");
}
