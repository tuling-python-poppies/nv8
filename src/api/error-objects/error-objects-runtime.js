import { initializeDOMException } from "../event/dom-exception-state.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

const domErrorState = new WeakMap();
const quotaExceededState = new WeakMap();

export function DOMError(name) {
  if (new.target === undefined) {
    throw new TypeError(
      "Failed to construct 'DOMError': Please use the 'new' operator, this DOM object constructor cannot be called as a function.",
    );
  }
  domErrorState.set(this, {
    name: `${name}`,
    message: arguments[1] === undefined ? "" : `${arguments[1]}`,
  });
}

export function QuotaExceededError() {
  if (new.target === undefined) {
    throw new TypeError(
      "Failed to construct 'QuotaExceededError': "
        + "Please use the 'new' operator, this DOM object constructor cannot be called as a function.",
    );
  }
  const message = arguments[0] === undefined ? "" : `${arguments[0]}`;
  const init = objectValue(arguments[1]);
  initializeDOMException(this, message, "QuotaExceededError");
  quotaExceededState.set(this, {
    quota: numberProperty(init, "quota"),
    requested: numberProperty(init, "requested"),
  });
}

registerNativeFunction(DOMError, "DOMError");
registerNativeFunction(QuotaExceededError, "QuotaExceededError");
export const errorObjectConstructors = Object.freeze([
  DOMError,
  QuotaExceededError,
]);

export function errorObjectProperty(value, name) {
  const domError = domErrorState.get(value);
  if (domError !== undefined && (name === "name" || name === "message")) {
    return domError[name];
  }
  const quota = quotaExceededState.get(value);
  if (quota !== undefined && (name === "quota" || name === "requested")) {
    return quota[name];
  }
  throw new TypeError("Illegal invocation");
}

function objectValue(value) {
  if (
    (typeof value === "object" && value !== null)
    || typeof value === "function"
  ) return value;
  return null;
}

function numberProperty(value, name) {
  if (value === null || value[name] === undefined) return null;
  return Number(value[name]);
}
