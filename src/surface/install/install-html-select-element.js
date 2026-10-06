import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { add } from "../api/dom/html-select-element-add.js";
import { autocomplete, setAutocomplete } from "../api/dom/html-select-element-autocomplete-property.js";
import { checkValidity } from "../api/dom/html-select-element-check-validity.js";
import {
  HTMLSelectElement,
  installHTMLSelectElementConstructor,
} from "../api/dom/html-select-element-constructor.js";
import { form } from "../api/dom/html-select-element-form-getter.js";
import { item } from "../api/dom/html-select-element-item.js";
import { labels } from "../api/dom/html-select-element-labels-getter.js";
import { length, setLength } from "../api/dom/html-select-element-length-property.js";
import { name, setName } from "../api/dom/html-select-element-name-property.js";
import { namedItem } from "../api/dom/html-select-element-named-item.js";
import { options } from "../api/dom/html-select-element-options-getter.js";
import { remove } from "../api/dom/html-select-element-remove.js";
import { reportValidity } from "../api/dom/html-select-element-report-validity.js";
import {
  selectedIndex,
  setSelectedIndex,
} from "../api/dom/html-select-element-selected-index-property.js";
import { selectedOptions } from "../api/dom/html-select-element-selected-options-getter.js";
import { setCustomValidity } from "../api/dom/html-select-element-set-custom-validity.js";
import { showPicker } from "../api/dom/html-select-element-show-picker.js";
import { type } from "../api/dom/html-select-element-type-getter.js";
import { validity } from "../api/dom/html-select-element-validity-getter.js";
import { validationMessage } from "../api/dom/html-select-element-validation-message-getter.js";
import { setValue, value } from "../api/dom/html-select-element-value-property.js";
import { values } from "../api/dom/html-select-element-values.js";
import { willValidate } from "../api/dom/html-select-element-will-validate-getter.js";
import { unsignedReflectionTable } from "../api/dom/unsigned-reflection-members.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";

export function installHTMLSelectElement() {
  installHTMLSelectElementConstructor();
  accessor("autocomplete", autocomplete, setAutocomplete);for (const [name, entry] of booleanReflectionTable) accessor(name, entry.get, entry.set);
  getter("form", form);for (const [name, entry] of booleanReflectionTable) accessor(name, entry.get, entry.set);
  accessor("name", name, setName);for (const [name, entry] of booleanReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of unsignedReflectionTable) accessor(name, entry.get, entry.set);
  getter("type", type);
  getter("options", options);
  accessor("length", length, setLength);
  getter("selectedOptions", selectedOptions);
  accessor("selectedIndex", selectedIndex, setSelectedIndex);
  accessor("value", value, setValue);
  getter("willValidate", willValidate);
  getter("validity", validity);
  getter("validationMessage", validationMessage);
  getter("labels", labels);
  method("add", add);
  method("checkValidity", checkValidity);
  method("item", item);
  method("namedItem", namedItem);
  method("remove", remove);
  method("reportValidity", reportValidity);
  method("setCustomValidity", setCustomValidity);
  method("showPicker", showPicker);
  defineConstructorBacklink(HTMLSelectElement.prototype, HTMLSelectElement);
  defineToStringTag(HTMLSelectElement.prototype, "HTMLSelectElement");
  Object.defineProperty(HTMLSelectElement.prototype, Symbol.iterator, {
    value: values,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

function accessor(name, get, set) {
  definePrototypeAccessor(HTMLSelectElement.prototype, name, get, set);
}

function getter(name, callback) {
  definePrototypeGetter(HTMLSelectElement.prototype, name, callback);
}

function method(name, callback) {
  definePrototypeMethod(HTMLSelectElement.prototype, name, callback);
}
