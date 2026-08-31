import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  areas,
} from "../api/dom/html-map-element-areas-getter.js";
import {
  HTMLMapElement,
  installHTMLMapElementConstructor,
} from "../api/dom/html-map-element-constructor.js";
import {
  name,
  setName,
} from "../api/dom/html-map-element-name-property.js";

export function installHTMLMapElement() {
  installHTMLMapElementConstructor();
  definePrototypeAccessor(HTMLMapElement.prototype, "name", name, setName);
  definePrototypeGetter(HTMLMapElement.prototype, "areas", areas);
  defineConstructorBacklink(HTMLMapElement.prototype, HTMLMapElement);
  defineToStringTag(HTMLMapElement.prototype, "HTMLMapElement");
}
