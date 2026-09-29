import { createDOMTokenList } from "./dom-token-list-state.js";
import { createHTMLFormControlsCollection } from "./html-form-controls-collection-state.js";
import { formOwnerOf } from "./form-association.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";
import {
  descendants,
  ELEMENT_NODE,
  registerMutationHook,
  requireNode,
  rootOf,
} from "./node-state.js";

// form 的命名属性访问：form[name-or-id] 返回对应控件，遮蔽 `id`/`innerText`
// 等原型属性。RS6 用同名/同 id 的 input 构造该陷阱（见 iv8 追踪），
// 缺失该行为即被判定为环境异常。描述符与真实浏览器一致：
// { writable: false, enumerable: false, configurable: true }。
const namedAccessSlot = createRealmSlot(() => ({
  liveForms: new Set(),
}), "formNamedAccess");

function namedAccessState() {
  return namedAccessSlot.get(globalThis);
}

const namedAccessFinalization = new FinalizationRegistry((ref) => {
  namedAccessState().liveForms.delete(ref);
});

const formState = new WeakMap();
const listedNames = new Set([
  "button",
  "fieldset",
  "input",
  "object",
  "output",
  "select",
  "textarea",
]);

export function initializeForm(form) {
  const state = {
    relList: createDOMTokenList(form, "rel"),
    elements: null,
    submitCount: 0,
    resetCount: 0,
    namedProperties: new Set(),
  };
  formState.set(form, state);
  state.elements = createHTMLFormControlsCollection(
    () => formControls(form),
  );
  const ref = new WeakRef(form);
  namedAccessState().liveForms.add(ref);
  namedAccessFinalization.register(form, ref);
  refreshFormNamedProperties(form);
}

export function requireForm(form) {
  const state = formState.get(form);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function formControls(form) {
  requireForm(form);
  const root = rootOf(form);
  return [root, ...descendants(root)].filter(candidate => (
    requireNode(candidate).nodeType === ELEMENT_NODE
    && listedNames.has(candidate.localName)
    && formOwnerOf(candidate) === form
  ));
}

export function refreshFormNamedProperties(form) {
  const state = requireForm(form);
  const seen = new Set();
  for (const control of formControls(form)) {
    for (const name of [
      control.getAttribute("name"),
      control.getAttribute("id"),
    ]) {
      if (!name || seen.has(name)) {
        continue;
      }
      seen.add(name);
      Object.defineProperty(form, name, {
        value: control,
        writable: false,
        enumerable: false,
        configurable: true,
      });
      state.namedProperties.add(name);
    }
  }
  for (const name of state.namedProperties) {
    if (!seen.has(name)) {
      delete form[name];
      state.namedProperties.delete(name);
    }
  }
}

registerMutationHook(() => {
  const refs = namedAccessState().liveForms;
  for (const ref of refs) {
    const form = ref.deref();
    if (form === undefined) {
      refs.delete(ref);
    } else if (formState.has(form)) {
      refreshFormNamedProperties(form);
    }
  }
});

export function normalizedAutocomplete(form) {
  requireForm(form);
  return form.getAttribute("autocomplete")?.toLowerCase() === "off"
    ? "off"
    : "on";
}

export function normalizedEnctype(form) {
  requireForm(form);
  const value = form.getAttribute("enctype")?.toLowerCase();
  return value === "multipart/form-data" || value === "text/plain"
    ? value
    : "application/x-www-form-urlencoded";
}

export function normalizedMethod(form) {
  requireForm(form);
  const value = form.getAttribute("method")?.toLowerCase();
  return value === "post" || value === "dialog" ? value : "get";
}

export function controlsAreValid(form, report = false) {
  let valid = true;
  for (const control of formControls(form)) {
    const callback = report ? control.reportValidity : control.checkValidity;
    if (typeof callback === "function" && !Reflect.apply(callback, control, [])) {
      valid = false;
    }
  }
  return valid;
}
