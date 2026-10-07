import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
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
import {
  booleanReflectionPart1Table,
  booleanReflectionPart2Table,
} from "../api/dom/boolean-reflection-html-option-element-members.js";

export function installHTMLOptionElement() {
  installHTMLOptionElementConstructor();
  for (const [name, entry] of booleanReflectionPart1Table) accessor(name, entry.get, entry.set);
  definePrototypeGetter(HTMLOptionElement.prototype, "form", form);
  accessor("label", label, setLabel);
  for (const [name, entry] of booleanReflectionPart2Table) accessor(name, entry.get, entry.set);
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
