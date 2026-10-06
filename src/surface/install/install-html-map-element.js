import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  areas,
} from "../api/dom/html-map-element-areas-getter.js";
import {
  HTMLMapElement,
  installHTMLMapElementConstructor,
} from "../api/dom/html-map-element-constructor.js";
import { stringReflectionTable } from "../api/dom/html-map-element-name-property.js";

export function installHTMLMapElement() {
  installHTMLMapElementConstructor();
  for (const [name, entry] of stringReflectionTable) definePrototypeAccessor(HTMLMapElement.prototype, name, entry.get, entry.set);
  definePrototypeGetter(HTMLMapElement.prototype, "areas", areas);
  defineConstructorBacklink(HTMLMapElement.prototype, HTMLMapElement);
  defineToStringTag(HTMLMapElement.prototype, "HTMLMapElement");
}
