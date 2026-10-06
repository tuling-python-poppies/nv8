import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { checkValidity } from "../api/dom/html-field-set-element-check-validity.js";
import {
  HTMLFieldSetElement,
  installHTMLFieldSetElementConstructor,
} from "../api/dom/html-field-set-element-constructor.js";
import { elements } from "../api/dom/html-field-set-element-elements-getter.js";
import { form } from "../api/dom/html-field-set-element-form-getter.js";
import { name, setName } from "../api/dom/html-field-set-element-name-property.js";
import { reportValidity } from "../api/dom/html-field-set-element-report-validity.js";
import { setCustomValidity } from "../api/dom/html-field-set-element-set-custom-validity.js";
import { type } from "../api/dom/html-field-set-element-type-getter.js";
import { validationMessage } from "../api/dom/html-field-set-element-validation-message-getter.js";
import { validity } from "../api/dom/html-field-set-element-validity-getter.js";
import { willValidate } from "../api/dom/html-field-set-element-will-validate-getter.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";

export function installHTMLFieldSetElement() {
  installHTMLFieldSetElementConstructor();for (const [name, entry] of booleanReflectionTable) definePrototypeAccessor(HTMLFieldSetElement.prototype, name, entry.get, entry.set);
  definePrototypeGetter(HTMLFieldSetElement.prototype, "form", form);
  definePrototypeAccessor(HTMLFieldSetElement.prototype, "name", name, setName);
  definePrototypeGetter(HTMLFieldSetElement.prototype, "type", type);
  definePrototypeGetter(HTMLFieldSetElement.prototype, "elements", elements);
  definePrototypeGetter(HTMLFieldSetElement.prototype, "willValidate", willValidate);
  definePrototypeGetter(HTMLFieldSetElement.prototype, "validity", validity);
  definePrototypeGetter(HTMLFieldSetElement.prototype, "validationMessage", validationMessage);
  definePrototypeMethod(HTMLFieldSetElement.prototype, "checkValidity", checkValidity);
  definePrototypeMethod(HTMLFieldSetElement.prototype, "reportValidity", reportValidity);
  definePrototypeMethod(HTMLFieldSetElement.prototype, "setCustomValidity", setCustomValidity);
  defineConstructorBacklink(HTMLFieldSetElement.prototype, HTMLFieldSetElement);
  defineToStringTag(HTMLFieldSetElement.prototype, "HTMLFieldSetElement");
}
