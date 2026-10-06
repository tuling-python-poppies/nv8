import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { checkValidity } from "../api/dom/html-input-element-check-validity.js";
import { checked, setChecked } from "../api/dom/html-input-element-checked-property.js";
import {
  HTMLInputElement,
  installHTMLInputElementConstructor,
} from "../api/dom/html-input-element-constructor.js";
import { defaultChecked, setDefaultChecked } from "../api/dom/html-input-element-default-checked-property.js";
import { defaultValue, setDefaultValue } from "../api/dom/html-input-element-default-value-property.js";
import { files, setFiles } from "../api/dom/html-input-element-files-property.js";
import { formAction, setFormAction } from "../api/dom/html-input-element-form-action-property.js";
import { formEnctype, setFormEnctype } from "../api/dom/html-input-element-form-enctype-property.js";
import { form } from "../api/dom/html-input-element-form-getter.js";
import { formMethod, setFormMethod } from "../api/dom/html-input-element-form-method-property.js";
import { indeterminate, setIndeterminate } from "../api/dom/html-input-element-indeterminate-property.js";
import { labels } from "../api/dom/html-input-element-labels-getter.js";
import { list } from "../api/dom/html-input-element-list-getter.js";
import { popoverTargetAction, setPopoverTargetAction } from "../api/dom/html-input-element-popover-target-action-property.js";
import { popoverTargetElement, setPopoverTargetElement } from "../api/dom/html-input-element-popover-target-element-property.js";
import { reportValidity } from "../api/dom/html-input-element-report-validity.js";
import { select } from "../api/dom/html-input-element-select.js";
import { selectionDirection, setSelectionDirection } from "../api/dom/html-input-element-selection-direction-property.js";
import { selectionEnd, setSelectionEnd } from "../api/dom/html-input-element-selection-end-property.js";
import { selectionStart, setSelectionStart } from "../api/dom/html-input-element-selection-start-property.js";
import { setCustomValidity } from "../api/dom/html-input-element-set-custom-validity.js";
import { setRangeText } from "../api/dom/html-input-element-set-range-text.js";
import { setSelectionRange } from "../api/dom/html-input-element-set-selection-range.js";
import { showPicker } from "../api/dom/html-input-element-show-picker.js";
import { stepDown } from "../api/dom/html-input-element-step-down.js";
import { stepUp } from "../api/dom/html-input-element-step-up.js";
import { type, setType } from "../api/dom/html-input-element-type-property.js";
import { validationMessage } from "../api/dom/html-input-element-validation-message-getter.js";
import { validity } from "../api/dom/html-input-element-validity-getter.js";
import { valueAsDate, setValueAsDate } from "../api/dom/html-input-element-value-as-date-property.js";
import { valueAsNumber, setValueAsNumber } from "../api/dom/html-input-element-value-as-number-property.js";
import { value, setValue } from "../api/dom/html-input-element-value-property.js";
import { webkitEntries } from "../api/dom/html-input-element-webkit-entries-getter.js";
import { willValidate } from "../api/dom/html-input-element-will-validate-getter.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";
import { inputNumberReflectionTable } from "../api/dom/input-number-reflection-members.js";
import { urlReflectionTable } from "../api/dom/url-reflection-members.js";

export function installHTMLInputElement() {
  installHTMLInputElementConstructor();
  for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  accessor("defaultChecked", defaultChecked, setDefaultChecked);
  accessor("checked", checked, setChecked);
  for (const [name, entry] of booleanReflectionTable) accessor(name, entry.get, entry.set);
  getter("form", form);
  accessor("files", files, setFiles);
  accessor("formAction", formAction, setFormAction);
  accessor("formEnctype", formEnctype, setFormEnctype);
  accessor("formMethod", formMethod, setFormMethod);
  for (const [name, entry] of inputNumberReflectionTable) accessor(name, entry.get, entry.set);
  accessor("indeterminate", indeterminate, setIndeterminate);
  getter("list", list);
  for (const [name, entry] of urlReflectionTable) accessor(name, entry.get, entry.set);
  accessor("type", type, setType);
  accessor("defaultValue", defaultValue, setDefaultValue);
  accessor("value", value, setValue);
  accessor("valueAsDate", valueAsDate, setValueAsDate);
  accessor("valueAsNumber", valueAsNumber, setValueAsNumber);
  getter("willValidate", willValidate);
  getter("validity", validity);
  getter("validationMessage", validationMessage);
  getter("labels", labels);
  accessor("selectionStart", selectionStart, setSelectionStart);
  accessor("selectionEnd", selectionEnd, setSelectionEnd);
  accessor("selectionDirection", selectionDirection, setSelectionDirection);
  accessor("popoverTargetElement", popoverTargetElement, setPopoverTargetElement);
  accessor("popoverTargetAction", popoverTargetAction, setPopoverTargetAction);
  method("checkValidity", checkValidity);
  method("reportValidity", reportValidity);
  method("select", select);
  method("setCustomValidity", setCustomValidity);
  method("setRangeText", setRangeText);
  method("setSelectionRange", setSelectionRange);
  method("showPicker", showPicker);
  method("stepDown", stepDown);
  method("stepUp", stepUp);
  getter("webkitEntries", webkitEntries);
  defineConstructorBacklink(HTMLInputElement.prototype, HTMLInputElement);
  defineToStringTag(HTMLInputElement.prototype, "HTMLInputElement");
}

function accessor(name, get, set) {
  definePrototypeAccessor(HTMLInputElement.prototype, name, get, set);
}
function getter(name, callback) {
  definePrototypeGetter(HTMLInputElement.prototype, name, callback);
}
function method(name, callback) {
  definePrototypeMethod(HTMLInputElement.prototype, name, callback);
}
