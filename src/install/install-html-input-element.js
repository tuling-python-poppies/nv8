import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { accept, setAccept } from "../api/dom/html-input-element-accept-property.js";
import { align, setAlign } from "../api/dom/html-input-element-align-property.js";
import { alt, setAlt } from "../api/dom/html-input-element-alt-property.js";
import { autocomplete, setAutocomplete } from "../api/dom/html-input-element-autocomplete-property.js";
import { checkValidity } from "../api/dom/html-input-element-check-validity.js";
import { checked, setChecked } from "../api/dom/html-input-element-checked-property.js";
import {
  HTMLInputElement,
  installHTMLInputElementConstructor,
} from "../api/dom/html-input-element-constructor.js";
import { defaultChecked, setDefaultChecked } from "../api/dom/html-input-element-default-checked-property.js";
import { defaultValue, setDefaultValue } from "../api/dom/html-input-element-default-value-property.js";
import { dirName, setDirName } from "../api/dom/html-input-element-dir-name-property.js";
import { disabled, setDisabled } from "../api/dom/html-input-element-disabled-property.js";
import { files, setFiles } from "../api/dom/html-input-element-files-property.js";
import { formAction, setFormAction } from "../api/dom/html-input-element-form-action-property.js";
import { formEnctype, setFormEnctype } from "../api/dom/html-input-element-form-enctype-property.js";
import { form } from "../api/dom/html-input-element-form-getter.js";
import { formMethod, setFormMethod } from "../api/dom/html-input-element-form-method-property.js";
import { formNoValidate, setFormNoValidate } from "../api/dom/html-input-element-form-no-validate-property.js";
import { formTarget, setFormTarget } from "../api/dom/html-input-element-form-target-property.js";
import { height, setHeight } from "../api/dom/html-input-element-height-property.js";
import { incremental, setIncremental } from "../api/dom/html-input-element-incremental-property.js";
import { indeterminate, setIndeterminate } from "../api/dom/html-input-element-indeterminate-property.js";
import { labels } from "../api/dom/html-input-element-labels-getter.js";
import { list } from "../api/dom/html-input-element-list-getter.js";
import { maxLength, setMaxLength } from "../api/dom/html-input-element-max-length-property.js";
import { max, setMax } from "../api/dom/html-input-element-max-property.js";
import { minLength, setMinLength } from "../api/dom/html-input-element-min-length-property.js";
import { min, setMin } from "../api/dom/html-input-element-min-property.js";
import { multiple, setMultiple } from "../api/dom/html-input-element-multiple-property.js";
import { name, setName } from "../api/dom/html-input-element-name-property.js";
import { pattern, setPattern } from "../api/dom/html-input-element-pattern-property.js";
import { placeholder, setPlaceholder } from "../api/dom/html-input-element-placeholder-property.js";
import { popoverTargetAction, setPopoverTargetAction } from "../api/dom/html-input-element-popover-target-action-property.js";
import { popoverTargetElement, setPopoverTargetElement } from "../api/dom/html-input-element-popover-target-element-property.js";
import { readOnly, setReadOnly } from "../api/dom/html-input-element-read-only-property.js";
import { reportValidity } from "../api/dom/html-input-element-report-validity.js";
import { required, setRequired } from "../api/dom/html-input-element-required-property.js";
import { select } from "../api/dom/html-input-element-select.js";
import { selectionDirection, setSelectionDirection } from "../api/dom/html-input-element-selection-direction-property.js";
import { selectionEnd, setSelectionEnd } from "../api/dom/html-input-element-selection-end-property.js";
import { selectionStart, setSelectionStart } from "../api/dom/html-input-element-selection-start-property.js";
import { setCustomValidity } from "../api/dom/html-input-element-set-custom-validity.js";
import { setRangeText } from "../api/dom/html-input-element-set-range-text.js";
import { setSelectionRange } from "../api/dom/html-input-element-set-selection-range.js";
import { showPicker } from "../api/dom/html-input-element-show-picker.js";
import { size, setSize } from "../api/dom/html-input-element-size-property.js";
import { src, setSrc } from "../api/dom/html-input-element-src-property.js";
import { stepDown } from "../api/dom/html-input-element-step-down.js";
import { step, setStep } from "../api/dom/html-input-element-step-property.js";
import { stepUp } from "../api/dom/html-input-element-step-up.js";
import { type, setType } from "../api/dom/html-input-element-type-property.js";
import { useMap, setUseMap } from "../api/dom/html-input-element-use-map-property.js";
import { validationMessage } from "../api/dom/html-input-element-validation-message-getter.js";
import { validity } from "../api/dom/html-input-element-validity-getter.js";
import { valueAsDate, setValueAsDate } from "../api/dom/html-input-element-value-as-date-property.js";
import { valueAsNumber, setValueAsNumber } from "../api/dom/html-input-element-value-as-number-property.js";
import { value, setValue } from "../api/dom/html-input-element-value-property.js";
import { webkitEntries } from "../api/dom/html-input-element-webkit-entries-getter.js";
import { webkitdirectory, setWebkitdirectory } from "../api/dom/html-input-element-webkitdirectory-property.js";
import { width, setWidth } from "../api/dom/html-input-element-width-property.js";
import { willValidate } from "../api/dom/html-input-element-will-validate-getter.js";

export function installHTMLInputElement() {
  installHTMLInputElementConstructor();
  accessor("accept", accept, setAccept);
  accessor("alt", alt, setAlt);
  accessor("autocomplete", autocomplete, setAutocomplete);
  accessor("defaultChecked", defaultChecked, setDefaultChecked);
  accessor("checked", checked, setChecked);
  accessor("dirName", dirName, setDirName);
  accessor("disabled", disabled, setDisabled);
  getter("form", form);
  accessor("files", files, setFiles);
  accessor("formAction", formAction, setFormAction);
  accessor("formEnctype", formEnctype, setFormEnctype);
  accessor("formMethod", formMethod, setFormMethod);
  accessor("formNoValidate", formNoValidate, setFormNoValidate);
  accessor("formTarget", formTarget, setFormTarget);
  accessor("height", height, setHeight);
  accessor("indeterminate", indeterminate, setIndeterminate);
  getter("list", list);
  accessor("max", max, setMax);
  accessor("maxLength", maxLength, setMaxLength);
  accessor("min", min, setMin);
  accessor("minLength", minLength, setMinLength);
  accessor("multiple", multiple, setMultiple);
  accessor("name", name, setName);
  accessor("pattern", pattern, setPattern);
  accessor("placeholder", placeholder, setPlaceholder);
  accessor("readOnly", readOnly, setReadOnly);
  accessor("required", required, setRequired);
  accessor("size", size, setSize);
  accessor("src", src, setSrc);
  accessor("step", step, setStep);
  accessor("type", type, setType);
  accessor("defaultValue", defaultValue, setDefaultValue);
  accessor("value", value, setValue);
  accessor("valueAsDate", valueAsDate, setValueAsDate);
  accessor("valueAsNumber", valueAsNumber, setValueAsNumber);
  accessor("width", width, setWidth);
  getter("willValidate", willValidate);
  getter("validity", validity);
  getter("validationMessage", validationMessage);
  getter("labels", labels);
  accessor("selectionStart", selectionStart, setSelectionStart);
  accessor("selectionEnd", selectionEnd, setSelectionEnd);
  accessor("selectionDirection", selectionDirection, setSelectionDirection);
  accessor("align", align, setAlign);
  accessor("useMap", useMap, setUseMap);
  accessor("webkitdirectory", webkitdirectory, setWebkitdirectory);
  accessor("incremental", incremental, setIncremental);
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
