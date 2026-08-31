import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();
let registrySingleton = null;

export function Highlight() {
  if (new.target === undefined) throw new TypeError("Highlight requires new");
  state.set(this, {
    kind: "highlight",
    values: new Set([...arguments]),
    priority: 0,
    type: "highlight",
  });
}
export function HighlightRegistry() { throw new TypeError("Illegal constructor"); }
for (const Constructor of [Highlight, HighlightRegistry]) {
  registerNativeFunction(Constructor, Constructor.name);
}
export const highlightConstructors = Object.freeze([Highlight, HighlightRegistry]);

export function createHighlightRegistry() {
  if (registrySingleton !== null) return registrySingleton;
  const value = Object.create(HighlightRegistry.prototype);
  state.set(value, { kind: "registry", values: new Map() });
  registrySingleton = value;
  return value;
}

export function highlightProperty(value, name) {
  const record = requireRecord(value);
  if (name === "size") return record.values.size;
  return record[name];
}

export function setHighlightProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.kind !== "highlight") return;
  if (name === "priority") record.priority = Number(input) | 0;
  if (name === "type") {
    const normalized = `${input}`;
    if (!["highlight", "spelling-error", "grammar-error"].includes(normalized)) {
      throw new TypeError("Invalid highlight type");
    }
    record.type = normalized;
  }
}

export function highlightOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "highlight") return setOperation(record, value, name, args);
  if (record.kind === "registry") return mapOperation(record, value, name, args);
}

export function highlightIterator(value) {
  const record = requireRecord(value);
  return record.kind === "registry"
    ? record.values.entries()
    : record.values.values();
}

function setOperation(record, object, name, args) {
  if (name === "add") { record.values.add(args[0]); return object; }
  if (name === "clear") return record.values.clear();
  if (name === "delete") return record.values.delete(args[0]);
  if (name === "has") return record.values.has(args[0]);
  if (name === "entries") return record.values.entries();
  if (name === "keys" || name === "values") return record.values.values();
  if (name === "forEach") {
    record.values.forEach(item => Reflect.apply(args[0], args[1], [item, item, object]));
  }
}

function mapOperation(record, object, name, args) {
  if (name === "set") {
    if (state.get(args[1])?.kind !== "highlight") throw new TypeError("Expected Highlight");
    record.values.set(`${args[0]}`, args[1]);
    return object;
  }
  if (name === "clear") return record.values.clear();
  if (name === "delete") return record.values.delete(`${args[0]}`);
  if (name === "get") return record.values.get(`${args[0]}`);
  if (name === "has") return record.values.has(`${args[0]}`);
  if (name === "entries") return record.values.entries();
  if (name === "keys") return record.values.keys();
  if (name === "values") return record.values.values();
  if (name === "forEach") {
    record.values.forEach((item, key) => Reflect.apply(args[0], args[1], [item, key, object]));
    return;
  }
  if (name === "highlightsFromPoint") {
    return [...record.values].map(([key, highlight]) => Object.freeze({
      highlight,
      ranges: Object.freeze([...requireRecord(highlight).values]),
      name: key,
    }));
  }
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}
