import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLLIElement,
  installHTMLLIElementConstructor,
} from "../api/dom/html-li-element-constructor.js";
import {
  setType,
  type,
} from "../api/dom/html-li-element-type-property.js";
import {
  setValue,
  value,
} from "../api/dom/html-li-element-value-property.js";

export function installHTMLLIElement() {
  installHTMLLIElementConstructor();
  definePrototypeAccessor(HTMLLIElement.prototype, "value", value, setValue);
  definePrototypeAccessor(HTMLLIElement.prototype, "type", type, setType);
  defineConstructorBacklink(HTMLLIElement.prototype, HTMLLIElement);
  defineToStringTag(HTMLLIElement.prototype, "HTMLLIElement");
}
