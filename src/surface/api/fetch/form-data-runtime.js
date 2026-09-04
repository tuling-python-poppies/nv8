import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireBlob } from "../file/blob-state.js";

const state = new WeakMap();

export function FormData() {
  if (!new.target) throw new TypeError("Constructor FormData requires 'new'");
  state.set(this, []);
}
registerNativeFunction(FormData, "FormData");

export function formDataAppend(form, name, value, filename) {
  requireFormData(form).push([
    `${name}`,
    normalizeValue(value, filename),
  ]);
}

export function formDataDelete(form, name) {
  const values = requireFormData(form);
  const normalized = `${name}`;
  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (values[index][0] === normalized) values.splice(index, 1);
  }
}

export function formDataGet(form, name) {
  return requireFormData(form).find(([key]) => key === `${name}`)?.[1] ?? null;
}

export function formDataGetAll(form, name) {
  return requireFormData(form)
    .filter(([key]) => key === `${name}`)
    .map(([, value]) => value);
}

export function formDataHas(form, name) {
  return requireFormData(form).some(([key]) => key === `${name}`);
}

export function formDataSet(form, name, value, filename) {
  const values = requireFormData(form);
  const normalized = `${name}`;
  const next = normalizeValue(value, filename);
  const index = values.findIndex(([key]) => key === normalized);
  formDataDelete(form, normalized);
  values.splice(index < 0 ? values.length : index, 0, [normalized, next]);
}

export function formDataEntries(form) {
  return requireFormData(form).map(pair => [...pair])[Symbol.iterator]();
}

export function formDataForEach(form, callback, thisArg) {
  if (typeof callback !== "function") throw new TypeError("A callback is required");
  for (const [name, value] of requireFormData(form)) {
    Reflect.apply(callback, thisArg, [value, name, form]);
  }
}

export function formDataKeys(form) {
  return requireFormData(form).map(([name]) => name)[Symbol.iterator]();
}

export function formDataValues(form) {
  return requireFormData(form).map(([, value]) => value)[Symbol.iterator]();
}

export function requireFormData(value) {
  const values = state.get(value);
  if (values === undefined) throw new TypeError("Illegal invocation");
  return values;
}

function normalizeValue(value, _filename) {
  try {
    requireBlob(value);
    return value;
  } catch {
    return `${value}`;
  }
}
