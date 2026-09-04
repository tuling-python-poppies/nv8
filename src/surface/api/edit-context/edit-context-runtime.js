import { initializeEventTarget } from "../event/event-target-state.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();
const handlerNames = new Set([
  "ontextupdate",
  "ontextformatupdate",
  "oncharacterboundsupdate",
  "oncompositionstart",
  "oncompositionend",
]);

export function TextFormat() {
  if (new.target === undefined) {
    throw new TypeError("Failed to construct 'TextFormat': use new");
  }
  const init = objectValue(arguments[0]);
  state.set(this, {
    kind: "text-format",
    rangeStart: uintProperty(init, "rangeStart"),
    rangeEnd: uintProperty(init, "rangeEnd"),
    underlineStyle: stringProperty(init, "underlineStyle"),
    underlineThickness: stringProperty(init, "underlineThickness"),
  });
}

export function EditContext() {
  if (new.target === undefined) {
    throw new TypeError("Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
  }
  const init = objectValue(arguments[0]);
  const text = init?.text === undefined ? "" : `${init.text}`;
  const max = text.length;
  const selectionStart = Math.min(
    init?.selectionStart === undefined ? 0 : toUint32(init.selectionStart),
    max,
  );
  const selectionEnd = Math.min(
    init?.selectionEnd === undefined
      ? selectionStart
      : toUint32(init.selectionEnd),
    max,
  );
  initializeEventTarget(this);
  state.set(this, {
    kind: "edit-context",
    text,
    selectionStart,
    selectionEnd,
    characterBoundsRangeStart: 0,
    characterBounds: [],
    handlers: new Map(),
  });
}

registerNativeFunction(TextFormat, "TextFormat");
registerNativeFunction(EditContext, "EditContext");
export const editContextConstructors = Object.freeze([
  TextFormat,
  EditContext,
]);

export function editContextProperty(value, name) {
  const record = requireRecord(value);
  if (record.kind === "text-format") {
    if ([
      "rangeStart",
      "rangeEnd",
      "underlineStyle",
      "underlineThickness",
    ].includes(name)) return record[name];
  } else if (record.kind === "edit-context") {
    if (handlerNames.has(name)) return record.handlers.get(name) ?? null;
    if ([
      "text",
      "selectionStart",
      "selectionEnd",
      "characterBoundsRangeStart",
    ].includes(name)) return record[name];
  }
  throw new TypeError("Illegal invocation");
}

export function setEditContextProperty(value, name, input) {
  const record = requireEditContext(value);
  if (!handlerNames.has(name)) throw new TypeError("Illegal invocation");
  if (typeof input === "function") record.handlers.set(name, input);
  else record.handlers.delete(name);
}

export function editContextOperation(value, name, args) {
  const record = requireEditContext(value);
  if (name === "attachedElements") return [];
  if (name === "characterBounds") return [...record.characterBounds];
  if (name === "updateCharacterBounds") {
    requireCount(args, 2);
    const values = objectValue(args[1]);
    if (values === null) throw new TypeError("bounds must be a sequence");
    record.characterBoundsRangeStart = toUint32(args[0]);
    const length = toUint32(values.length);
    record.characterBounds = Array.from(
      { length },
      (_, index) => values[index],
    );
    return undefined;
  }
  if (name === "updateControlBounds") {
    requireCount(args, 1);
    return undefined;
  }
  if (name === "updateSelection") {
    const start = toUint32(args[0]);
    const end = args[1] === undefined ? start : toUint32(args[1]);
    record.selectionStart = Math.min(start, record.text.length);
    record.selectionEnd = Math.min(end, record.text.length);
    return undefined;
  }
  if (name === "updateSelectionBounds") {
    requireCount(args, 1);
    return undefined;
  }
  if (name === "updateText") {
    requireCount(args, 3);
    const start = Math.min(toUint32(args[0]), record.text.length);
    const end = Math.max(
      start,
      Math.min(toUint32(args[1]), record.text.length),
    );
    const replacement = `${args[2]}`;
    record.text = record.text.slice(0, start)
      + replacement
      + record.text.slice(end);
    const caret = start + replacement.length;
    record.selectionStart = caret;
    record.selectionEnd = caret;
    return undefined;
  }
  throw new TypeError("Illegal invocation");
}

function requireCount(args, count) {
  if (args.length < count) {
    throw new TypeError(`${count} argument${count === 1 ? "" : "s"} required`);
  }
}

function objectValue(value) {
  if (
    (typeof value === "object" && value !== null)
    || typeof value === "function"
  ) return value;
  return null;
}

function uintProperty(value, name) {
  return value === null || value[name] === undefined
    ? 0
    : toUint32(value[name]);
}

function stringProperty(value, name) {
  return value === null || value[name] === undefined ? "" : `${value[name]}`;
}

function toUint32(value) {
  return Number(value) >>> 0;
}

function requireEditContext(value) {
  const record = requireRecord(value);
  if (record.kind !== "edit-context") throw new TypeError("Illegal invocation");
  return record;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}
