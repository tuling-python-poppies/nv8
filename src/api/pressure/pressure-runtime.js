import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();

export function PressureObserver(callback) {
  if (new.target === undefined) throw new TypeError("PressureObserver requires new");
  if (typeof callback !== "function") throw new TypeError("callback required");
  state.set(this, {
    kind: "observer",
    object: this,
    callback,
    sources: new Set(),
    records: [],
  });
}

export function PressureRecord() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(PressureObserver, "PressureObserver");
registerNativeFunction(PressureRecord, "PressureRecord");
export const pressureConstructors = Object.freeze([
  PressureObserver,
  PressureRecord,
]);

export function pressureProperty(value, name) {
  const record = requireRecord(value);
  return record[name];
}

export function pressureOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "observer") {
    if (name === "observe") {
      const source = `${args[0]}`;
      record.sources.add(source);
      const pressureRecord = createPressureRecord(source, "nominal", 0);
      record.records.push(pressureRecord);
      Reflect.apply(record.callback, record.object, [
        Object.freeze([pressureRecord]),
        record.object,
      ]);
      return Promise.resolve();
    }
    if (name === "takeRecords") {
      return Object.freeze(record.records.splice(0));
    }
    if (name === "unobserve") {
      record.sources.delete(`${args[0]}`);
      return undefined;
    }
    if (name === "disconnect") {
      record.sources.clear();
      record.records.length = 0;
      return undefined;
    }
  }
  if (record.kind === "record" && name === "toJSON") {
    return Object.freeze({ source: record.source, state: record.state });
  }
  throw new TypeError(`Unsupported pressure operation: ${name}`);
}

function createPressureRecord(source, pressureState, time) {
  const value = Object.create(PressureRecord.prototype);
  state.set(value, {
    kind: "record",
    source,
    state: pressureState,
    time,
  });
  return value;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}
