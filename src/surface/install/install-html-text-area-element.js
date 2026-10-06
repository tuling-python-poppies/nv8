import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { autocomplete, setAutocomplete } from "../api/dom/html-text-area-element-autocomplete-property.js";
import { checkValidity } from "../api/dom/html-text-area-element-check-validity.js";
import { cols, setCols } from "../api/dom/html-text-area-element-cols-property.js";
import {
  HTMLTextAreaElement,
  installHTMLTextAreaElementConstructor,
} from "../api/dom/html-text-area-element-constructor.js";
import { defaultValue, setDefaultValue } from "../api/dom/html-text-area-element-default-value-property.js";
import { dirName, setDirName } from "../api/dom/html-text-area-element-dir-name-property.js";
import { disabled, setDisabled } from "../api/dom/html-text-area-element-disabled-property.js";
import { form } from "../api/dom/html-text-area-element-form-getter.js";
import { labels } from "../api/dom/html-text-area-element-labels-getter.js";
import { maxLength, setMaxLength } from "../api/dom/html-text-area-element-max-length-property.js";
import { minLength, setMinLength } from "../api/dom/html-text-area-element-min-length-property.js";
import { name, setName } from "../api/dom/html-text-area-element-name-property.js";
import { placeholder, setPlaceholder } from "../api/dom/html-text-area-element-placeholder-property.js";
import { readOnly, setReadOnly } from "../api/dom/html-text-area-element-read-only-property.js";
import { reportValidity } from "../api/dom/html-text-area-element-report-validity.js";
import { required, setRequired } from "../api/dom/html-text-area-element-required-property.js";
import { rows, setRows } from "../api/dom/html-text-area-element-rows-property.js";
import { select } from "../api/dom/html-text-area-element-select.js";
import { selectionDirection, setSelectionDirection } from "../api/dom/html-text-area-element-selection-direction-property.js";
import { selectionEnd, setSelectionEnd } from "../api/dom/html-text-area-element-selection-end-property.js";
import { selectionStart, setSelectionStart } from "../api/dom/html-text-area-element-selection-start-property.js";
import { setCustomValidity } from "../api/dom/html-text-area-element-set-custom-validity.js";
import { setRangeText } from "../api/dom/html-text-area-element-set-range-text.js";
import { setSelectionRange } from "../api/dom/html-text-area-element-set-selection-range.js";
import { textLength } from "../api/dom/html-text-area-element-text-length-getter.js";
import { type } from "../api/dom/html-text-area-element-type-getter.js";
import { validationMessage } from "../api/dom/html-text-area-element-validation-message-getter.js";
import { validity } from "../api/dom/html-text-area-element-validity-getter.js";
import { value, setValue } from "../api/dom/html-text-area-element-value-property.js";
import { willValidate } from "../api/dom/html-text-area-element-will-validate-getter.js";
import { wrap, setWrap } from "../api/dom/html-text-area-element-wrap-property.js";

export function installHTMLTextAreaElement() {
  installHTMLTextAreaElementConstructor();
  accessor("autocomplete", autocomplete, setAutocomplete);
  accessor("cols", cols, setCols);
  accessor("dirName", dirName, setDirName);
  accessor("disabled", disabled, setDisabled);
  getter("form", form);
  accessor("maxLength", maxLength, setMaxLength);
  accessor("minLength", minLength, setMinLength);
  accessor("name", name, setName);
  accessor("placeholder", placeholder, setPlaceholder);
  accessor("readOnly", readOnly, setReadOnly);
  accessor("required", required, setRequired);
  accessor("rows", rows, setRows);
  accessor("wrap", wrap, setWrap);
  getter("type", type);
  accessor("defaultValue", defaultValue, setDefaultValue);
  accessor("value", value, setValue);
  getter("textLength", textLength);
  getter("willValidate", willValidate);
  getter("validity", validity);
  getter("validationMessage", validationMessage);
  getter("labels", labels);
  accessor("selectionStart", selectionStart, setSelectionStart);
  accessor("selectionEnd", selectionEnd, setSelectionEnd);
  accessor("selectionDirection", selectionDirection, setSelectionDirection);
  method("checkValidity", checkValidity);
  method("reportValidity", reportValidity);
  method("select", select);
  method("setCustomValidity", setCustomValidity);
  method("setRangeText", setRangeText);
  method("setSelectionRange", setSelectionRange);
  defineConstructorBacklink(HTMLTextAreaElement.prototype, HTMLTextAreaElement);
  defineToStringTag(HTMLTextAreaElement.prototype, "HTMLTextAreaElement");
}

function accessor(name, get, set) {
  definePrototypeAccessor(HTMLTextAreaElement.prototype, name, get, set);
}
function getter(name, callback) {
  definePrototypeGetter(HTMLTextAreaElement.prototype, name, callback);
}
function method(name, callback) {
  definePrototypeMethod(HTMLTextAreaElement.prototype, name, callback);
}
