import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  clear,
  setClear,
} from "../api/dom/html-br-element-clear-property.js";
import {
  HTMLBRElement,
  installHTMLBRElementConstructor,
} from "../api/dom/html-br-element-constructor.js";

export function installHTMLBRElement() {
  installHTMLBRElementConstructor();
  definePrototypeAccessor(HTMLBRElement.prototype, "clear", clear, setClear);
  defineConstructorBacklink(HTMLBRElement.prototype, HTMLBRElement);
  defineToStringTag(HTMLBRElement.prototype, "HTMLBRElement");
}
