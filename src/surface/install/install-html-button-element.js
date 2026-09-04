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
import { disabled, setDisabled } from "../api/dom/html-button-element-disabled-property.js";
import { formAction, setFormAction } from "../api/dom/html-button-element-form-action-property.js";
import { formEnctype, setFormEnctype } from "../api/dom/html-button-element-form-enctype-property.js";
import { form } from "../api/dom/html-button-element-form-getter.js";
import { formMethod, setFormMethod } from "../api/dom/html-button-element-form-method-property.js";
import { formNoValidate, setFormNoValidate } from "../api/dom/html-button-element-form-no-validate-property.js";
import { formTarget, setFormTarget } from "../api/dom/html-button-element-form-target-property.js";
import { interestForElement, setInterestForElement } from "../api/dom/html-button-element-interest-for-element-property.js";
import { labels } from "../api/dom/html-button-element-labels-getter.js";
import { name, setName } from "../api/dom/html-button-element-name-property.js";
import { popoverTargetAction, setPopoverTargetAction } from "../api/dom/html-button-element-popover-target-action-property.js";
import { popoverTargetElement, setPopoverTargetElement } from "../api/dom/html-button-element-popover-target-element-property.js";
import { reportValidity } from "../api/dom/html-button-element-report-validity.js";
import { setCustomValidity } from "../api/dom/html-button-element-set-custom-validity.js";
import { type, setType } from "../api/dom/html-button-element-type-property.js";
import { validationMessage } from "../api/dom/html-button-element-validation-message-getter.js";
import { validity } from "../api/dom/html-button-element-validity-getter.js";
import { value, setValue } from "../api/dom/html-button-element-value-property.js";
import { willValidate } from "../api/dom/html-button-element-will-validate-getter.js";

export function installHTMLButtonElement() {
  installHTMLButtonElementConstructor();
  accessor("disabled", disabled, setDisabled);
  getter("form", form);
  accessor("formAction", formAction, setFormAction);
  accessor("formEnctype", formEnctype, setFormEnctype);
  accessor("formMethod", formMethod, setFormMethod);
  accessor("formNoValidate", formNoValidate, setFormNoValidate);
  accessor("formTarget", formTarget, setFormTarget);
  accessor("name", name, setName);
  accessor("type", type, setType);
  accessor("value", value, setValue);
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
