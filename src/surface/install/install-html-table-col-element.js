import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLTableColElement,
  installHTMLTableColElementConstructor,
} from "../api/dom/html-table-col-element-constructor.js";
import {
  setSpan,
  span,
} from "../api/dom/html-table-col-element-span-property.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";

export function installHTMLTableColElement() {
  installHTMLTableColElementConstructor();
  accessor("span", span, setSpan);
  for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  defineConstructorBacklink(HTMLTableColElement.prototype, HTMLTableColElement);
  defineToStringTag(HTMLTableColElement.prototype, "HTMLTableColElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLTableColElement.prototype, name, getter, setter);
}
