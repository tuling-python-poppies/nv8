import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { checkValidity } from "../api/dom/html-button-element-check-validity.js";
import { command, setCommand } from "../api/dom/html-button-element-command-property.js";
import { commandForElement, setCommandForElement } from "../api/dom/html-button-element-command-for-element-property.js";
import {
  HTMLButtonElement,
  installHTMLButtonElementConstructor,
} from "../api/dom/html-button-element-constructor.js";
import { formAction, setFormAction } from "../api/dom/html-button-element-form-action-property.js";
import { formEnctype, setFormEnctype } from "../api/dom/html-button-element-form-enctype-property.js";
import { form } from "../api/dom/html-button-element-form-getter.js";
import { formMethod, setFormMethod } from "../api/dom/html-button-element-form-method-property.js";
import { interestForElement, setInterestForElement } from "../api/dom/html-button-element-interest-for-element-property.js";
import { labels } from "../api/dom/html-button-element-labels-getter.js";
import { popoverTargetAction, setPopoverTargetAction } from "../api/dom/html-button-element-popover-target-action-property.js";
import { popoverTargetElement, setPopoverTargetElement } from "../api/dom/html-button-element-popover-target-element-property.js";
import { reportValidity } from "../api/dom/html-button-element-report-validity.js";
import { setCustomValidity } from "../api/dom/html-button-element-set-custom-validity.js";
import { type, setType } from "../api/dom/html-button-element-type-property.js";
import { validationMessage } from "../api/dom/html-button-element-validation-message-getter.js";
import { validity } from "../api/dom/html-button-element-validity-getter.js";
import { willValidate } from "../api/dom/html-button-element-will-validate-getter.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";

export function installHTMLButtonElement() {
  installHTMLButtonElementConstructor();
  for (const [name, entry] of booleanReflectionTable) accessor(name, entry.get, entry.set);
  getter("form", form);
  accessor("formAction", formAction, setFormAction);
  accessor("formEnctype", formEnctype, setFormEnctype);
  accessor("formMethod", formMethod, setFormMethod);
  for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  accessor("type", type, setType);
  getter("willValidate", willValidate);
  getter("validity", validity);
  getter("validationMessage", validationMessage);
  getter("labels", labels);
  accessor("popoverTargetElement", popoverTargetElement, setPopoverTargetElement);
  accessor("popoverTargetAction", popoverTargetAction, setPopoverTargetAction);
  accessor("commandForElement", commandForElement, setCommandForElement);
  accessor("command", command, setCommand);
  accessor("interestForElement", interestForElement, setInterestForElement);
  method("checkValidity", checkValidity);
  method("reportValidity", reportValidity);
  method("setCustomValidity", setCustomValidity);
  defineConstructorBacklink(HTMLButtonElement.prototype, HTMLButtonElement);
  defineToStringTag(HTMLButtonElement.prototype, "HTMLButtonElement");
}

function accessor(name, get, set) {
  definePrototypeAccessor(HTMLButtonElement.prototype, name, get, set);
}
function getter(name, callback) {
  definePrototypeGetter(HTMLButtonElement.prototype, name, callback);
}
function method(name, callback) {
  definePrototypeMethod(HTMLButtonElement.prototype, name, callback);
}
