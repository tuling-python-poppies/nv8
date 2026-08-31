import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  HTMLDataListElement,
  installHTMLDataListElementConstructor,
} from "../api/dom/html-data-list-element-constructor.js";
import {
  options,
} from "../api/dom/html-data-list-element-options-getter.js";

export function installHTMLDataListElement() {
  installHTMLDataListElementConstructor();
  definePrototypeGetter(HTMLDataListElement.prototype, "options", options);
  defineConstructorBacklink(HTMLDataListElement.prototype, HTMLDataListElement);
  defineToStringTag(HTMLDataListElement.prototype, "HTMLDataListElement");
}
