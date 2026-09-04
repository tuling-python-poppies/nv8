import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  ElementInternals,
  installElementInternalsConstructor,
} from "../api/dom/element-internals-constructor.js";
import { form } from "../api/dom/element-internals-form-getter.js";
import { willValidate } from "../api/dom/element-internals-will-validate-getter.js";
import { validity } from "../api/dom/element-internals-validity-getter.js";
import { validationMessage } from "../api/dom/element-internals-validation-message-getter.js";
import { labels } from "../api/dom/element-internals-labels-getter.js";
import { states } from "../api/dom/element-internals-states-getter.js";
import { shadowRoot } from "../api/dom/element-internals-shadow-root-getter.js";
import { checkValidity } from "../api/dom/element-internals-check-validity.js";
import { reportValidity } from "../api/dom/element-internals-report-validity.js";
import { setFormValue } from "../api/dom/element-internals-set-form-value.js";
import { setValidity } from "../api/dom/element-internals-set-validity.js";
import {
  installElementInternalsARIAAfterMethods,
  installElementInternalsARIABeforeMethods,
} from "./install-element-internals-aria.js";

export function installElementInternals() {
  installElementInternalsConstructor();
  getter("form", form);
  getter("willValidate", willValidate);
  getter("validity", validity);
  getter("validationMessage", validationMessage);
  getter("labels", labels);
  getter("states", states);
  getter("shadowRoot", shadowRoot);
  installElementInternalsARIABeforeMethods(accessor);
  method("checkValidity", checkValidity);
  method("reportValidity", reportValidity);
  method("setFormValue", setFormValue);
  method("setValidity", setValidity);
  installElementInternalsARIAAfterMethods(accessor);
  defineConstructorBacklink(ElementInternals.prototype, ElementInternals);
  defineToStringTag(ElementInternals.prototype, "ElementInternals");
}

function getter(name, callback) {
  definePrototypeGetter(ElementInternals.prototype, name, callback);
}

function accessor(name, descriptor) {
  definePrototypeAccessor(
    ElementInternals.prototype,
    name,
    descriptor.get,
    descriptor.set,
  );
}

function method(name, callback) {
  definePrototypeMethod(ElementInternals.prototype, name, callback);
}
