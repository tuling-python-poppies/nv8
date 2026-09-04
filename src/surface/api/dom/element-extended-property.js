import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
import { createDOMTokenList } from "./dom-token-list-state.js";
import { elementLayoutRect } from "./element-layout.js";
import {
  getAttributeValue,
  removeAttributeValue,
  requireElement,
  setAttributeValue,
} from "./element-state.js";

export function elementStringProperty(name, attributeName = name) {
  return elementProperty(
    name,
    element => getAttributeValue(element, attributeName) ?? "",
    (element, value) => setAttributeValue(element, attributeName, `${value}`),
  );
}

export function elementNullableStringProperty(name, attributeName) {
  return elementProperty(
    name,
    element => getAttributeValue(element, attributeName),
    (element, value) => {
      if (value === null || value === undefined) {
        removeAttributeValue(element, attributeName);
      } else {
        setAttributeValue(element, attributeName, `${value}`);
      }
    },
  );
}

export function elementNumberProperty(name, readonly = false) {
  return elementProperty(
    name,
    (element, state) => readonly ? readonlyLayoutNumber(element, name) : state[name],
    readonly
      ? undefined
      : (element, value, state) => {
        const number = Number(value);
        state[name] = Number.isFinite(number) ? number : 0;
      },
  );
}

function readonlyLayoutNumber(element, name) {
  if (name === "clientWidth" || name === "scrollWidth") {
    return Math.round(elementLayoutRect(element).width);
  }
  if (name === "clientHeight" || name === "scrollHeight") {
    return Math.round(elementLayoutRect(element).height);
  }
  return 0;
}

export function elementHandlerProperty(name) {
  return elementProperty(
    name,
    (element, state) => state.handlers.get(name) ?? null,
    (element, value, state) => {
      state.handlers.set(name, typeof value === "function" ? value : null);
    },
  );
}

export function elementPartProperty() {
  return elementReadonlyProperty("part", (element, state) => {
    if (state.part === null) state.part = createDOMTokenList(element, "part");
    return state.part;
  });
}

function elementReadonlyProperty(name, select) {
  const getter = Object.getOwnPropertyDescriptor({
    get [name]() {
      const state = requireElement(this);
      const result = select(this, state);
      traceGetter(`window.Element.prototype.${name}`, "Element", result);
      return result;
    },
  }, name).get;
  registerNativeGetter(getter, name);
  return { get: getter, set: undefined };
}

function elementProperty(name, select, assign) {
  if (assign === undefined) return elementReadonlyProperty(name, select);
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const state = requireElement(this);
      const result = select(this, state);
      traceGetter(`window.Element.prototype.${name}`, "Element", result);
      return result;
    },
    set [name](value) {
      const state = requireElement(this);
      assign(this, value, state);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
  return descriptor;
}
