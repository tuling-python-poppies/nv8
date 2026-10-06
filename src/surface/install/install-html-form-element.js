import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { action, setAction } from "../api/dom/html-form-element-action-property.js";
import { autocomplete, setAutocomplete } from "../api/dom/html-form-element-autocomplete-property.js";
import { checkValidity } from "../api/dom/html-form-element-check-validity.js";
import {
  HTMLFormElement,
  installHTMLFormElementConstructor,
} from "../api/dom/html-form-element-constructor.js";
import { elements } from "../api/dom/html-form-element-elements-getter.js";
import { encoding, setEncoding } from "../api/dom/html-form-element-encoding-property.js";
import { enctype, setEnctype } from "../api/dom/html-form-element-enctype-property.js";
import { length } from "../api/dom/html-form-element-length-getter.js";
import { method, setMethod } from "../api/dom/html-form-element-method-property.js";
import { relList } from "../api/dom/html-form-element-rel-list-getter.js";
import { reportValidity } from "../api/dom/html-form-element-report-validity.js";
import { requestSubmit } from "../api/dom/html-form-element-request-submit.js";
import { reset } from "../api/dom/html-form-element-reset.js";
import { submit } from "../api/dom/html-form-element-submit.js";
import { values } from "../api/dom/html-form-element-values.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";

export function installHTMLFormElement() {
  installHTMLFormElementConstructor();for (const [name, entry] of stringReflectionTable) definePrototypeAccessor(HTMLFormElement.prototype, name, entry.get, entry.set);
  definePrototypeAccessor(HTMLFormElement.prototype, "action", action, setAction);
  definePrototypeAccessor(HTMLFormElement.prototype, "autocomplete", autocomplete, setAutocomplete);
  definePrototypeAccessor(HTMLFormElement.prototype, "enctype", enctype, setEnctype);
  definePrototypeAccessor(HTMLFormElement.prototype, "encoding", encoding, setEncoding);
  definePrototypeAccessor(HTMLFormElement.prototype, "method", method, setMethod);for (const [name, entry] of stringReflectionTable) definePrototypeAccessor(HTMLFormElement.prototype, name, entry.get, entry.set);for (const [name, entry] of booleanReflectionTable) definePrototypeAccessor(HTMLFormElement.prototype, name, entry.get, entry.set);for (const [name, entry] of stringReflectionTable) definePrototypeAccessor(HTMLFormElement.prototype, name, entry.get, entry.set);
  definePrototypeGetter(HTMLFormElement.prototype, "relList", relList);
  definePrototypeGetter(HTMLFormElement.prototype, "elements", elements);
  definePrototypeGetter(HTMLFormElement.prototype, "length", length);
  definePrototypeMethod(HTMLFormElement.prototype, "checkValidity", checkValidity);
  definePrototypeMethod(HTMLFormElement.prototype, "reportValidity", reportValidity);
  definePrototypeMethod(HTMLFormElement.prototype, "requestSubmit", requestSubmit);
  definePrototypeMethod(HTMLFormElement.prototype, "reset", reset);
  definePrototypeMethod(HTMLFormElement.prototype, "submit", submit);
  defineConstructorBacklink(HTMLFormElement.prototype, HTMLFormElement);
  defineToStringTag(HTMLFormElement.prototype, "HTMLFormElement");
  Object.defineProperty(HTMLFormElement.prototype, Symbol.iterator, {
    value: values,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}
