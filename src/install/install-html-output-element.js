import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { checkValidity } from "../api/dom/html-output-element-check-validity.js";
import {
  HTMLOutputElement,
  installHTMLOutputElementConstructor,
} from "../api/dom/html-output-element-constructor.js";
import { defaultValue, setDefaultValue } from "../api/dom/html-output-element-default-value-property.js";
import { form } from "../api/dom/html-output-element-form-getter.js";
import { htmlFor, setHtmlFor } from "../api/dom/html-output-element-html-for-property.js";
import { labels } from "../api/dom/html-output-element-labels-getter.js";
import { name, setName } from "../api/dom/html-output-element-name-property.js";
import { reportValidity } from "../api/dom/html-output-element-report-validity.js";
import { setCustomValidity } from "../api/dom/html-output-element-set-custom-validity.js";
import { type } from "../api/dom/html-output-element-type-getter.js";
import { validationMessage } from "../api/dom/html-output-element-validation-message-getter.js";
import { validity } from "../api/dom/html-output-element-validity-getter.js";
import { value, setValue } from "../api/dom/html-output-element-value-property.js";
import { willValidate } from "../api/dom/html-output-element-will-validate-getter.js";

export function installHTMLOutputElement() {
  installHTMLOutputElementConstructor();
  definePrototypeAccessor(HTMLOutputElement.prototype, "htmlFor", htmlFor, setHtmlFor);
  definePrototypeGetter(HTMLOutputElement.prototype, "form", form);
  definePrototypeAccessor(HTMLOutputElement.prototype, "name", name, setName);
  definePrototypeGetter(HTMLOutputElement.prototype, "type", type);
  definePrototypeAccessor(HTMLOutputElement.prototype, "defaultValue", defaultValue, setDefaultValue);
  definePrototypeAccessor(HTMLOutputElement.prototype, "value", value, setValue);
  definePrototypeGetter(HTMLOutputElement.prototype, "willValidate", willValidate);
  definePrototypeGetter(HTMLOutputElement.prototype, "validity", validity);
  definePrototypeGetter(HTMLOutputElement.prototype, "validationMessage", validationMessage);
  definePrototypeGetter(HTMLOutputElement.prototype, "labels", labels);
  definePrototypeMethod(HTMLOutputElement.prototype, "checkValidity", checkValidity);
  definePrototypeMethod(HTMLOutputElement.prototype, "reportValidity", reportValidity);
  definePrototypeMethod(HTMLOutputElement.prototype, "setCustomValidity", setCustomValidity);
  defineConstructorBacklink(HTMLOutputElement.prototype, HTMLOutputElement);
  defineToStringTag(HTMLOutputElement.prototype, "HTMLOutputElement");
}
