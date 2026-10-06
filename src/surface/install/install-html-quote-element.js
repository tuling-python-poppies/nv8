import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLQuoteElement,
  installHTMLQuoteElementConstructor,
} from "../api/dom/html-quote-element-constructor.js";
import { urlReflectionTable } from "../api/dom/url-reflection-members.js";

export function installHTMLQuoteElement() {
  installHTMLQuoteElementConstructor();
  for (const [name, entry] of urlReflectionTable) definePrototypeAccessor(HTMLQuoteElement.prototype, name, entry.get, entry.set);
  defineConstructorBacklink(HTMLQuoteElement.prototype, HTMLQuoteElement);
  defineToStringTag(HTMLQuoteElement.prototype, "HTMLQuoteElement");
}
