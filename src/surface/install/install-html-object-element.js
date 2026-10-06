import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { checkValidity } from "../api/dom/html-object-element-check-validity.js";
import { contentDocument } from "../api/dom/html-object-element-content-document-getter.js";
import { contentWindow } from "../api/dom/html-object-element-content-window-getter.js";
import {
  HTMLObjectElement,
  installHTMLObjectElementConstructor,
} from "../api/dom/html-object-element-constructor.js";
import { form } from "../api/dom/html-object-element-form-getter.js";
import { getSVGDocument } from "../api/dom/html-object-element-get-svg-document.js";
import { reportValidity } from "../api/dom/html-object-element-report-validity.js";
import { setCustomValidity } from "../api/dom/html-object-element-set-custom-validity.js";
import { validationMessage } from "../api/dom/html-object-element-validation-message-getter.js";
import { validity } from "../api/dom/html-object-element-validity-getter.js";
import { willValidate } from "../api/dom/html-object-element-will-validate-getter.js";
import { stringReflectionTable } from "../api/dom/string-reflection-html-object-element-members.js";
import { booleanReflectionTable } from "../api/dom/html-object-element-declare-property.js";
import { unsignedReflectionTable } from "../api/dom/unsigned-reflection-html-object-element-members.js";

export function installHTMLObjectElement() {
  installHTMLObjectElementConstructor();
  for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  getter("form", form);
  getter("contentDocument", contentDocument);
  getter("contentWindow", contentWindow);
  getter("willValidate", willValidate);
  getter("validity", validity);
  getter("validationMessage", validationMessage);
  for (const [name, entry] of booleanReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of unsignedReflectionTable) accessor(name, entry.get, entry.set);
  method("checkValidity", checkValidity);
  method("getSVGDocument", getSVGDocument);
  method("reportValidity", reportValidity);
  method("setCustomValidity", setCustomValidity);
  defineConstructorBacklink(HTMLObjectElement.prototype, HTMLObjectElement);
  defineToStringTag(HTMLObjectElement.prototype, "HTMLObjectElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLObjectElement.prototype, name, getter, setter);
}
function getter(name, callback) {
  definePrototypeGetter(HTMLObjectElement.prototype, name, callback);
}
function method(name, callback) {
  definePrototypeMethod(HTMLObjectElement.prototype, name, callback);
}
