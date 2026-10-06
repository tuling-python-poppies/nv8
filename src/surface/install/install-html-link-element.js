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
import { sheet } from "../api/dom/html-link-element-sheet-getter.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";
import { linkTokenListPropertyTable } from "../api/dom/link-token-list-property-members.js";
import { urlReflectionTable } from "../api/dom/url-reflection-members.js";

export function installHTMLLinkElement() {
  installHTMLLinkElementConstructor();
  for (const [name, entry] of booleanReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of urlReflectionTable) accessor(name, entry.get, entry.set);
  accessor("crossOrigin", crossOrigin, setCrossOrigin);
  for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of linkTokenListPropertyTable) accessor(name, entry.get, entry.set);
  accessor("fetchPriority", fetchPriority, setFetchPriority);
  definePrototypeGetter(HTMLLinkElement.prototype, "sheet", sheet);
  defineConstructorBacklink(HTMLLinkElement.prototype, HTMLLinkElement);
  defineToStringTag(HTMLLinkElement.prototype, "HTMLLinkElement");
}

function accessor(name, get, set) {
  definePrototypeAccessor(HTMLLinkElement.prototype, name, get, set);
}
