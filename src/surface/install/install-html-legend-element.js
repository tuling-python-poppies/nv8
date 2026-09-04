import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  align,
  setAlign,
} from "../api/dom/html-legend-element-align-property.js";
import {
  HTMLLegendElement,
  installHTMLLegendElementConstructor,
} from "../api/dom/html-legend-element-constructor.js";
import {
  form,
} from "../api/dom/html-legend-element-form-getter.js";

export function installHTMLLegendElement() {
  installHTMLLegendElementConstructor();
  definePrototypeGetter(HTMLLegendElement.prototype, "form", form);
  definePrototypeAccessor(
    HTMLLegendElement.prototype,
    "align",
    align,
    setAlign,
  );
  defineConstructorBacklink(HTMLLegendElement.prototype, HTMLLegendElement);
  defineToStringTag(HTMLLegendElement.prototype, "HTMLLegendElement");
}
