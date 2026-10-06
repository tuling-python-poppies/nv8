import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  control,
} from "../api/dom/html-label-element-control-getter.js";
import {
  form,
} from "../api/dom/html-label-element-form-getter.js";
import {
  HTMLLabelElement,
  installHTMLLabelElementConstructor,
} from "../api/dom/html-label-element-constructor.js";
import { stringReflectionTable } from "../api/dom/html-label-element-html-for-property.js";

export function installHTMLLabelElement() {
  installHTMLLabelElementConstructor();
  definePrototypeGetter(HTMLLabelElement.prototype, "form", form);
  for (const [name, entry] of stringReflectionTable) definePrototypeAccessor( HTMLLabelElement.prototype, name, entry.get, entry.set, );
  definePrototypeGetter(HTMLLabelElement.prototype, "control", control);
  defineConstructorBacklink(HTMLLabelElement.prototype, HTMLLabelElement);
  defineToStringTag(HTMLLabelElement.prototype, "HTMLLabelElement");
}
