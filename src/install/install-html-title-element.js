import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  HTMLTitleElement,
  installHTMLTitleElementConstructor,
} from "../api/dom/html-title-element-constructor.js";
import {
  setText,
  text,
} from "../api/dom/html-title-element-text-property.js";

export function installHTMLTitleElement() {
  installHTMLTitleElementConstructor();
  definePrototypeAccessor(HTMLTitleElement.prototype, "text", text, setText);
  defineConstructorBacklink(HTMLTitleElement.prototype, HTMLTitleElement);
  defineToStringTag(HTMLTitleElement.prototype, "HTMLTitleElement");
}
