import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLLinkElement,
  installHTMLLinkElementConstructor,
} from "../api/dom/html-link-element-constructor.js";
import { crossOrigin, setCrossOrigin } from "../api/dom/html-link-element-cross-origin-property.js";
import { fetchPriority, setFetchPriority } from "../api/dom/html-link-element-fetch-priority-property.js";
import { href, setHref } from "../api/dom/html-link-element-href-property.js";
import { sheet } from "../api/dom/html-link-element-sheet-getter.js";
import { linkTokenListPropertyTable } from "../api/dom/link-token-list-property-members.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";

export function installHTMLLinkElement() {
  installHTMLLinkElementConstructor();for (const [name, entry] of booleanReflectionTable) accessor(name, entry.get, entry.set);
  accessor("href", href, setHref);
  accessor("crossOrigin", crossOrigin, setCrossOrigin);for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of linkTokenListPropertyTable) accessor(name, entry.get, entry.set);for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of linkTokenListPropertyTable) accessor(name, entry.get, entry.set);
  accessor("fetchPriority", fetchPriority, setFetchPriority);for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  definePrototypeGetter(HTMLLinkElement.prototype, "sheet", sheet);for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of linkTokenListPropertyTable) accessor(name, entry.get, entry.set);
  defineConstructorBacklink(HTMLLinkElement.prototype, HTMLLinkElement);
  defineToStringTag(HTMLLinkElement.prototype, "HTMLLinkElement");
}

function accessor(name, get, set) {
  definePrototypeAccessor(HTMLLinkElement.prototype, name, get, set);
}
