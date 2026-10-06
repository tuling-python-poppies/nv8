import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLAnchorElement,
  installHTMLAnchorElementConstructor,
} from "../api/dom/html-anchor-element-constructor.js";
import {
  href,
  setHref,
} from "../api/dom/html-anchor-element-href-property.js";
import {
  interestForElement,
  setInterestForElement,
} from "../api/dom/html-anchor-element-interest-for-element-property.js";
import { origin } from "../api/dom/html-anchor-element-origin-getter.js";
import {
  relList,
} from "../api/dom/html-anchor-element-rel-list-getter.js";
import {
  text,
  setText,
} from "../api/dom/html-anchor-element-text-property.js";
import { toString } from "../api/dom/html-anchor-element-to-string.js";
import { anchorURLComponentPropertyTable } from "../api/dom/anchor-urlcomponent-property-members.js";
import { stringReflectionTable } from "../api/dom/string-reflection-html-anchor-element-members.js";

export function installHTMLAnchorElement() {
  installHTMLAnchorElementConstructor();
  for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  definePrototypeGetter(HTMLAnchorElement.prototype, "relList", relList);
  accessor("text", text, setText);
  definePrototypeGetter(HTMLAnchorElement.prototype, "origin", origin);
  for (const [name, entry] of anchorURLComponentPropertyTable) accessor(name, entry.get, entry.set);
  accessor("href", href, setHref);
  accessor(
    "interestForElement",
    interestForElement,
    setInterestForElement,
  );
  definePrototypeMethod(HTMLAnchorElement.prototype, "toString", toString);
  defineConstructorBacklink(
    HTMLAnchorElement.prototype,
    HTMLAnchorElement,
  );
  defineToStringTag(HTMLAnchorElement.prototype, "HTMLAnchorElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(
    HTMLAnchorElement.prototype,
    name,
    getter,
    setter,
  );
}
