import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLLegendElement,
  installHTMLLegendElementConstructor,
} from "../api/dom/html-legend-element-constructor.js";
import {
  form,
} from "../api/dom/html-legend-element-form-getter.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";

export function installHTMLLegendElement() {
  installHTMLLegendElementConstructor();
  definePrototypeGetter(HTMLLegendElement.prototype, "form", form);
  for (const [name, entry] of stringReflectionTable) definePrototypeAccessor( HTMLLegendElement.prototype, name, entry.get, entry.set, );
  defineConstructorBacklink(HTMLLegendElement.prototype, HTMLLegendElement);
  defineToStringTag(HTMLLegendElement.prototype, "HTMLLegendElement");
}
