import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  cite,
  setCite,
} from "../api/dom/html-quote-element-cite-property.js";
import {
  HTMLQuoteElement,
  installHTMLQuoteElementConstructor,
} from "../api/dom/html-quote-element-constructor.js";

export function installHTMLQuoteElement() {
  installHTMLQuoteElementConstructor();
  definePrototypeAccessor(HTMLQuoteElement.prototype, "cite", cite, setCite);
  defineConstructorBacklink(HTMLQuoteElement.prototype, HTMLQuoteElement);
  defineToStringTag(HTMLQuoteElement.prototype, "HTMLQuoteElement");
}
