import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import {
  getAttributeValue,
  requireElement,
  setAttributeValue,
} from "./element-state.js";
import { requireNode } from "./node-state.js";

export function stringReflection(interfaceName, propertyName, attributeName) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      requireElement(this);
      const result = getAttributeValue(this, attributeName) ?? "";
      traceGetter(
        `window.${interfaceName}.prototype.${propertyName}`,
        interfaceName,
        result,
      );
      return result;
    },
    set [propertyName](value) {
      requireElement(this);
      setAttributeValue(this, attributeName, `${value}`);
    },
  }, propertyName);
  registerNativeGetter(descriptor.get, propertyName);
  registerNativeFunction(descriptor.set, `set ${propertyName}`);
  return descriptor;
}

export function booleanReflection(interfaceName, propertyName, attributeName) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      requireElement(this);
      const result = getAttributeValue(this, attributeName) !== null;
      traceGetter(
        `window.${interfaceName}.prototype.${propertyName}`,
        interfaceName,
        result,
      );
      return result;
    },
    set [propertyName](value) {
      requireElement(this);
      if (Boolean(value)) {
        setAttributeValue(this, attributeName, "");
      } else {
        this.removeAttribute(attributeName);
      }
    },
  }, propertyName);
  registerNativeGetter(descriptor.get, propertyName);
  registerNativeFunction(descriptor.set, `set ${propertyName}`);
  return descriptor;
}

export function unsignedReflection(interfaceName, propertyName, attributeName) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      requireElement(this);
      const parsed = Number.parseInt(
        getAttributeValue(this, attributeName) ?? "",
        10,
      );
      const result = Number.isFinite(parsed) && parsed >= 0
        ? parsed >>> 0
        : 0;
      traceGetter(
        `window.${interfaceName}.prototype.${propertyName}`,
        interfaceName,
        result,
      );
      return result;
    },
    set [propertyName](value) {
      requireElement(this);
      setAttributeValue(this, attributeName, `${Number(value) >>> 0}`);
    },
  }, propertyName);
  registerNativeGetter(descriptor.get, propertyName);
  registerNativeFunction(descriptor.set, `set ${propertyName}`);
  return descriptor;
}

export function longReflection(
  interfaceName,
  propertyName,
  attributeName,
  defaultValue = 0,
) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      requireElement(this);
      const parsed = Number.parseInt(
        getAttributeValue(this, attributeName) ?? "",
        10,
      );
      const result = Number.isFinite(parsed)
        && parsed >= -2_147_483_648
        && parsed <= 2_147_483_647
        ? parsed
        : defaultValue;
      traceGetter(
        `window.${interfaceName}.prototype.${propertyName}`,
        interfaceName,
        result,
      );
      return result;
    },
    set [propertyName](value) {
      requireElement(this);
      setAttributeValue(this, attributeName, `${Number(value) >> 0}`);
    },
  }, propertyName);
  registerNativeGetter(descriptor.get, propertyName);
  registerNativeFunction(descriptor.set, `set ${propertyName}`);
  return descriptor;
}

export function urlReflection(interfaceName, propertyName, attributeName) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      requireElement(this);
      const raw = getAttributeValue(this, attributeName);
      const result = raw === null
        ? ""
        : new URL(raw, ownerURL(this)).href;
      traceGetter(
        `window.${interfaceName}.prototype.${propertyName}`,
        interfaceName,
        result,
      );
      return result;
    },
    set [propertyName](value) {
      requireElement(this);
      setAttributeValue(this, attributeName, `${value}`);
    },
  }, propertyName);
  registerNativeGetter(descriptor.get, propertyName);
  registerNativeFunction(descriptor.set, `set ${propertyName}`);
  return descriptor;
}

export function nullableStringReflection(
  interfaceName,
  propertyName,
  attributeName,
) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [propertyName]() {
      requireElement(this);
      const result = getAttributeValue(this, attributeName);
      traceGetter(
        `window.${interfaceName}.prototype.${propertyName}`,
        interfaceName,
        result,
      );
      return result;
    },
    set [propertyName](value) {
      requireElement(this);
      setAttributeValue(
        this,
        attributeName,
        value === null ? "" : `${value}`,
      );
    },
  }, propertyName);
  registerNativeGetter(descriptor.get, propertyName);
  registerNativeFunction(descriptor.set, `set ${propertyName}`);
  return descriptor;
}

export function ownerURL(element) {
  return requireNode(element).ownerDocument?.URL ?? "about:blank";
}
