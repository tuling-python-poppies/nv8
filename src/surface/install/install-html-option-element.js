import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  defaultSelected,
  setDefaultSelected,
} from "../api/dom/html-option-element-default-selected-property.js";
import { disabled, setDisabled } from "../api/dom/html-option-element-disabled-property.js";
import { form } from "../api/dom/html-option-element-form-getter.js";
import {
  HTMLOptionElement,
  installHTMLOptionElementConstructor,
} from "../api/dom/html-option-element-constructor.js";
import { index } from "../api/dom/html-option-element-index-getter.js";
import { label, setLabel } from "../api/dom/html-option-element-label-property.js";
import { selected, setSelected } from "../api/dom/html-option-element-selected-property.js";
import { setText, text } from "../api/dom/html-option-element-text-property.js";
import { setValue, value } from "../api/dom/html-option-element-value-property.js";

export function installHTMLOptionElement() {
  installHTMLOptionElementConstructor();
  accessor("disabled", disabled, setDisabled);
  definePrototypeGetter(HTMLOptionElement.prototype, "form", form);
  accessor("label", label, setLabel);
  accessor("defaultSelected", defaultSelected, setDefaultSelected);
  accessor("selected", selected, setSelected);
  accessor("value", value, setValue);
  accessor("text", text, setText);
  definePrototypeGetter(HTMLOptionElement.prototype, "index", index);
  defineConstructorBacklink(HTMLOptionElement.prototype, HTMLOptionElement);
  defineToStringTag(HTMLOptionElement.prototype, "HTMLOptionElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLOptionElement.prototype, name, getter, setter);
}
