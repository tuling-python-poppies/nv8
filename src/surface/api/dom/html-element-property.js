import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import {
  htmlBooleanProperty,
  htmlStringProperty,
  requireHTMLElement,
  setHTMLBooleanProperty,
  setHTMLStringProperty,
} from "./html-element-state.js";

export function htmlStringDescriptor(name, defaultValue = "") {
  return descriptor(name, element => htmlStringProperty(element, name, defaultValue),
    (element, value) => setHTMLStringProperty(element, name, value));
}

export function htmlBooleanDescriptor(name, defaultValue = false) {
  return descriptor(name, element => htmlBooleanProperty(element, name, defaultValue),
    (element, value) => setHTMLBooleanProperty(element, name, value));
}

export function htmlReadonlyDescriptor(name, operation) {
  const value = descriptor(name, operation, null);
  return { get: value.get };
}

export function htmlStateDescriptor(name, defaultValue = null, normalize = value => value) {
  return descriptor(name, element => {
    const state = requireHTMLElement(element);
    return state[name] ?? defaultValue;
  }, (element, value) => {
    requireHTMLElement(element)[name] = normalize(value);
  });
}

export function htmlCustomDescriptor(name, getOperation, setOperation) {
  return descriptor(name, getOperation, setOperation);
}

function descriptor(name, getOperation, setOperation) {
  const definition = setOperation === null ? {
    get [name]() {
      requireHTMLElement(this);
      const result = getOperation(this);
      traceGetter(`window.HTMLElement.prototype.${name}`, "HTMLElement", result);
      return result;
    },
  } : {
    get [name]() {
      requireHTMLElement(this);
      const result = getOperation(this);
      traceGetter(`window.HTMLElement.prototype.${name}`, "HTMLElement", result);
      return result;
    },
    set [name](value) {
      requireHTMLElement(this);
      setOperation(this, value);
    },
  };
  const result = Object.getOwnPropertyDescriptor(definition, name);
  registerNativeGetter(result.get, name);
  if (result.set !== undefined) registerNativeFunction(result.set, `set ${name}`);
  return result;
}
