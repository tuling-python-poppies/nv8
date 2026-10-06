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
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";
import { anchorURLComponentPropertyTable } from "../api/dom/anchor-urlcomponent-property-members.js";
import { urlReflectionTable } from "../api/dom/url-reflection-members.js";

export function installHTMLAnchorElement() {
  installHTMLAnchorElementConstructor();
  for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  definePrototypeGetter(HTMLAnchorElement.prototype, "relList", relList);
  accessor("text", text, setText);
  definePrototypeGetter(HTMLAnchorElement.prototype, "origin", origin);
  for (const [name, entry] of anchorURLComponentPropertyTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of urlReflectionTable) accessor(name, entry.get, entry.set);
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
