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
  htmlFor,
  setHtmlFor,
} from "../api/dom/html-label-element-html-for-property.js";
import {
  HTMLLabelElement,
  installHTMLLabelElementConstructor,
} from "../api/dom/html-label-element-constructor.js";

export function installHTMLLabelElement() {
  installHTMLLabelElementConstructor();
  definePrototypeGetter(HTMLLabelElement.prototype, "form", form);
  definePrototypeAccessor(
    HTMLLabelElement.prototype,
    "htmlFor",
    htmlFor,
    setHtmlFor,
  );
  definePrototypeGetter(HTMLLabelElement.prototype, "control", control);
  defineConstructorBacklink(HTMLLabelElement.prototype, HTMLLabelElement);
  defineToStringTag(HTMLLabelElement.prototype, "HTMLLabelElement");
}
