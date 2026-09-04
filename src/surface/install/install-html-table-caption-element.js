import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  align,
  setAlign,
} from "../api/dom/html-table-caption-element-align-property.js";
import {
  HTMLTableCaptionElement,
  installHTMLTableCaptionElementConstructor,
} from "../api/dom/html-table-caption-element-constructor.js";

export function installHTMLTableCaptionElement() {
  installHTMLTableCaptionElementConstructor();
  definePrototypeAccessor(
    HTMLTableCaptionElement.prototype,
    "align",
    align,
    setAlign,
  );
  defineConstructorBacklink(
    HTMLTableCaptionElement.prototype,
    HTMLTableCaptionElement,
  );
  defineToStringTag(
    HTMLTableCaptionElement.prototype,
    "HTMLTableCaptionElement",
  );
}
