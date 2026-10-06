import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLDataElement,
  installHTMLDataElementConstructor,
} from "../api/dom/html-data-element-constructor.js";
import {
  setValue,
  value,
} from "../api/dom/html-data-element-value-property.js";

export function installHTMLDataElement() {
  installHTMLDataElementConstructor();
  definePrototypeAccessor(HTMLDataElement.prototype, "value", value, setValue);
  defineConstructorBacklink(HTMLDataElement.prototype, HTMLDataElement);
  defineToStringTag(HTMLDataElement.prototype, "HTMLDataElement");
}
