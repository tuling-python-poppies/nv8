import { initializeEventTarget } from "../event/event-target-state.js";
import {
  performStructuredClone,
} from "../clone/structured-clone-algorithm.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();
import { createRealmSlot } from "../../core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const presentationSlot = createRealmSlot(() => ({
  presentationSingleton: null,
  nextConnectionId: 1,
}), "presentation");

function presentationState() {
  return presentationSlot.get(globalThis);
}

export function Presentation() { illegalConstructor("Presentation"); }
export function PresentationRequest(urls) {
  if (new.target === undefined) {
    throw new TypeError("PresentationRequest requires new");
  }
  if (arguments.length === 0) throw new TypeError("URL required");
  const normalized = Array.isArray(urls)
    ? urls.map(value => new URL(`${value}`, globalThis.location.href).href)
    : [new URL(`${urls}`, globalThis.location.href).href];
  if (normalized.length === 0) throw new TypeError("At least one URL is required");
  initializeEventTarget(this);
  state.set(this, {
    kind: "request",
    urls: Object.freeze(normalized),
    handlers: new Map([["onconnectionavailable", null]]),
    availability: null,
  });
}
export function PresentationAvailability() { illegalConstructor("PresentationAvailability"); }
export function PresentationConnection() { illegalConstructor("PresentationConnection"); }
export function PresentationConnectionList() { illegalConstructor("PresentationConnectionList"); }
export function PresentationReceiver() { illegalConstructor("PresentationReceiver"); }

export const presentationConstructors = Object.freeze([
  Presentation,
  PresentationRequest,
  PresentationAvailability,
  PresentationConnection,
  PresentationConnectionList,
  PresentationReceiver,
]);
for (const Constructor of presentationConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function createPresentation() {
  if (presentationState().presentationSingleton !== null) return presentationState().presentationSingleton;
  const receiver = createReceiver();
  const value = Object.create(Presentation.prototype);
  state.set(value, {
    kind: "presentation",
    defaultRequest: null,
    receiver,
  });
  presentationState().presentationSingleton = value;
  return value;
}

export function presentationProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  return record[name];
}

export function setPresentationProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
    return;
  }
  if (record.kind === "presentation" && name === "defaultRequest") {
    if (input !== null && state.get(input)?.kind !== "request") {
      throw new TypeError("Expected PresentationRequest or null");
    }
    record.defaultRequest = input;
  }
  if (record.kind === "connection" && name === "binaryType") {
    const normalized = `${input}`;
    if (!["blob", "arraybuffer"].includes(normalized)) {
      throw new TypeError("Invalid binaryType");
    }
    record.binaryType = normalized;
  }
}

export function presentationOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "request") {
    if (name === "getAvailability") {
      if (record.availability === null) {
        record.availability = createAvailability(true);
      }
      return Promise.resolve(record.availability);
    }
    if (name === "start") {
      return Promise.resolve(createConnection(
        `presentation-${presentationState().nextConnectionId++}`,
        record.urls[0],
      ));
    }
    if (name === "reconnect") {
      return Promise.resolve(createConnection(`${args[0]}`, record.urls[0]));
    }
  }
  if (record.kind === "connection") {
    if (name === "send") {
      if (record.state !== "connected") {
        throw new DOMException("Connection is not connected", "InvalidStateError");
      }
      record.messages.push(performStructuredClone(args[0]));
      return undefined;
    }
    if (name === "close") {
      record.state = "closed";
      return undefined;
    }
    if (name === "terminate") {
      record.state = "terminated";
      return undefined;
    }
  }
  throw new TypeError(`Unsupported presentation operation: ${name}`);
}

function createAvailability(available) {
  const value = Object.create(PresentationAvailability.prototype);
  initializeEventTarget(value);
  state.set(value, {
    kind: "availability",
    value: Boolean(available),
    handlers: new Map([["onchange", null]]),
  });
  return value;
}

function createConnection(id, url) {
  const value = Object.create(PresentationConnection.prototype);
  initializeEventTarget(value);
  state.set(value, {
    kind: "connection",
    id,
    url,
    state: "connected",
    binaryType: "arraybuffer",
    messages: [],
    handlers: new Map([
      ["onconnect", null],
      ["onclose", null],
      ["onterminate", null],
      ["onmessage", null],
    ]),
  });
  return value;
}

function createConnectionList(connections = []) {
  const value = Object.create(PresentationConnectionList.prototype);
  initializeEventTarget(value);
  state.set(value, {
    kind: "connectionList",
    connections: Object.freeze([...connections]),
    handlers: new Map([["onconnectionavailable", null]]),
  });
  return value;
}

function createReceiver() {
  const value = Object.create(PresentationReceiver.prototype);
  state.set(value, {
    kind: "receiver",
    connectionList: Promise.resolve(createConnectionList()),
  });
  return value;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function illegalConstructor(name) {
  // 真实 Chromium：`Failed to construct 'Node': Illegal constructor`
  // 不带接口名的裸文案是可检测偏差。
  throw new TypeError(
    name === undefined
      ? "Illegal constructor"
      : `Failed to construct '${name}': Illegal constructor`,
  );
}
