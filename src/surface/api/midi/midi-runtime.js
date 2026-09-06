import { initializeEventTarget } from "../event/event-target-state.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const midiSlot = createRealmSlot(() => ({
  accessSingleton: null,
}), "midi");

function midiState() {
  return midiSlot.get(globalThis);
}

const state = new WeakMap();

export function MIDIAccess() { illegalConstructor("MIDIAccess", new.target); }
export function MIDIPort() { illegalConstructor("MIDIPort", new.target); }
export function MIDIInput() { illegalConstructor("MIDIInput", new.target); }
export function MIDIOutput() { illegalConstructor("MIDIOutput", new.target); }
export function MIDIInputMap() { illegalConstructor("MIDIInputMap", new.target); }
export function MIDIOutputMap() { illegalConstructor("MIDIOutputMap", new.target); }
export const midiConstructors = Object.freeze([
  MIDIAccess,
  MIDIPort,
  MIDIInput,
  MIDIOutput,
  MIDIInputMap,
  MIDIOutputMap,
]);
for (const Constructor of midiConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function createMIDIAccess() {
  if (midiState().accessSingleton !== null) return midiState().accessSingleton;
  const inputs = createPortMap(MIDIInputMap, "inputMap");
  const outputs = createPortMap(MIDIOutputMap, "outputMap");
  const value = Object.create(MIDIAccess.prototype);
  initializeEventTarget(value);
  state.set(value, {
    kind: "access",
    inputs,
    outputs,
    sysexEnabled: false,
    handlers: new Map([["onstatechange", null]]),
  });
  midiState().accessSingleton = value;
  return value;
}

export function createMIDIPort(type, init = {}) {
  const Constructor = type === "output" ? MIDIOutput : MIDIInput;
  const value = Object.create(Constructor.prototype);
  initializeEventTarget(value);
  const handlers = new Map([["onstatechange", null]]);
  if (type === "input") handlers.set("onmidimessage", null);
  state.set(value, {
    kind: "port",
    object: value,
    connection: "closed",
    id: `${init.id ?? ""}`,
    manufacturer: `${init.manufacturer ?? ""}`,
    name: `${init.name ?? ""}`,
    state: "connected",
    type,
    version: `${init.version ?? ""}`,
    handlers,
    sent: [],
  });
  return value;
}

export function midiProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  if (["inputMap", "outputMap"].includes(record.kind) && name === "size") {
    return record.values.size;
  }
  return record[name];
}

export function setMIDIProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
  }
}

export function midiOperation(value, name, args) {
  const record = requireRecord(value);
  if (["inputMap", "outputMap"].includes(record.kind)) {
    if (name === "entries") return record.values.entries();
    if (name === "keys") return record.values.keys();
    if (name === "values") return record.values.values();
    if (name === "get") return record.values.get(`${args[0]}`);
    if (name === "has") return record.values.has(`${args[0]}`);
    if (name === "forEach") {
      if (typeof args[0] !== "function") throw new TypeError("Callback required");
      record.values.forEach((port, id) => {
        Reflect.apply(args[0], args[1], [port, id, value]);
      });
      return undefined;
    }
  }
  if (record.kind === "port") {
    if (name === "open") {
      record.connection = "open";
      return Promise.resolve(record.object);
    }
    if (name === "close") {
      record.connection = "closed";
      return Promise.resolve(record.object);
    }
    if (name === "send") {
      if (record.type !== "output") throw new TypeError("Expected MIDIOutput");
      const data = Uint8Array.from(args[0] ?? []);
      const timestamp = Number(args[1] ?? 0);
      record.sent.push(Object.freeze({ data, timestamp }));
      return undefined;
    }
  }
  throw new TypeError(`Unsupported MIDI operation: ${name}`);
}

export function midiIterator(value) {
  const record = requireRecord(value);
  if (!["inputMap", "outputMap"].includes(record.kind)) {
    throw new TypeError("Illegal invocation");
  }
  return record.values.entries();
}

function createPortMap(Constructor, kind) {
  const value = Object.create(Constructor.prototype);
  state.set(value, { kind, values: new Map() });
  return value;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function illegalConstructor(name, newTarget) {
  // 真实 Chromium：`Failed to construct 'Node': Illegal constructor`
  // 不带接口名的裸文案是可检测偏差。
  throw new TypeError(
    newTarget === undefined
      ? "Illegal constructor"
      : `Failed to construct '${name}': Illegal constructor`,
  );
}
