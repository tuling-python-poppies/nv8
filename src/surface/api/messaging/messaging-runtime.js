import {
  performStructuredClone,
  performStructuredCloneDetailed,
  registerStructuredCloneTransferHandler,
} from "../clone/structured-clone-algorithm.js";
import { Event } from "../event/event-constructor.js";
import { initializeEvent } from "../event/event-state.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

const messageEventState = new WeakMap();
const portState = new WeakMap();
const channelState = new WeakMap();
const broadcastState = new WeakMap();

// BroadcastChannel 分组、存活集合和跨 Realm connector 原先是模块级状态，
// 会让不同 Realm 共享广播频道拓扑。
const messagingSlot = createRealmSlot(() => ({
  broadcasts: new Map(),
  liveBroadcasts: new Set(),
  broadcastConnector: null,
}), "messaging-runtime");

function messagingState() {
  return messagingSlot.get(globalThis);
}

export function configureBroadcastConnector(connector) {
  messagingState().broadcastConnector = typeof connector === "function" ? connector : null;
}

export function MessageEvent(type) {
  if (!new.target) throw new TypeError("Constructor MessageEvent requires 'new'");
  const init = arguments[1] ?? {};
  initializeEvent(this, `${type}`, {
    bubbles: Boolean(init.bubbles),
    cancelable: Boolean(init.cancelable),
    composed: Boolean(init.composed),
  });
  initializeMessageEvent(this, init);
}
registerNativeFunction(MessageEvent, "MessageEvent");

export function MessagePort() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(MessagePort, "MessagePort");

export function MessageChannel() {
  if (!new.target) throw new TypeError("Constructor MessageChannel requires 'new'");
  const connection = { states: new Array(2) };
  const port1 = createPort(connection, 0);
  const port2 = createPort(connection, 1);
  channelState.set(this, { port1, port2 });
}
registerNativeFunction(MessageChannel, "MessageChannel");

export function BroadcastChannel(name) {
  if (!new.target) throw new TypeError("Constructor BroadcastChannel requires 'new'");
  initializeEventTarget(this);
  const record = {
    channel: this,
    name: `${name}`,
    closed: false,
    handlers: new Map(),
    connection: null,
  };
  broadcastState.set(this, record);
  messagingState().liveBroadcasts.add(record);
  if (messagingState().broadcastConnector !== null) {
    record.connection = messagingState().broadcastConnector(record.name, message => {
      if (record.closed) return;
      const cloned = performStructuredClone(message);
      Promise.resolve().then(() => {
        if (!record.closed) {
          deliver(record.channel, createMessageEvent(cloned, []));
        }
      });
    });
    return;
  }
  let group = messagingState().broadcasts.get(record.name);
  if (group === undefined) {
    group = new Set();
    messagingState().broadcasts.set(record.name, group);
  }
  group.add(record);
}
registerNativeFunction(BroadcastChannel, "BroadcastChannel");

export function messageEventProperty(event, name) {
  return requireMessageEvent(event)[name];
}

export function initMessageEvent(
  event,
  type,
  bubbles = false,
  cancelable = false,
  data = null,
  origin = "",
  lastEventId = "",
  source = null,
  ports = [],
) {
  requireMessageEvent(event);
  initializeEvent(event, `${type}`, {
    bubbles: Boolean(bubbles),
    cancelable: Boolean(cancelable),
    composed: false,
  });
  initializeMessageEvent(event, {
    data,
    origin,
    lastEventId,
    source,
    ports,
  });
}

export function channelProperty(channel, name) {
  const record = channelState.get(channel);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record[name];
}

export function messageHandler(target, name) {
  return requireMessageTarget(target).handlers.get(name) ?? null;
}

export function setMessageHandler(target, name, value) {
  const record = requireMessageTarget(target);
  record.handlers.set(name, typeof value === "function" ? value : null);
  if (portState.has(target) && name === "onmessage" && typeof value === "function") {
    portStart(target);
  }
}

export function portClose(port) {
  const record = requirePort(port);
  record.closed = true;
  record.queue.splice(0);
}

export function portPostMessage(port, message, transferOrOptions) {
  const record = requirePort(port);
  if (record.closed || record.detached) {
    throw new DOMException("The port is no longer active.", "InvalidStateError");
  }
  const options = normalizeTransferOptions(transferOrOptions);
  const cloned = performStructuredCloneDetailed(message, options);
  const peer = record.connection.states[1 - record.index];
  if (peer === undefined || peer.closed || peer.detached) return;
  peer.queue.push(createMessageEvent(cloned.value, cloned.transferred.filter(value =>
    portState.has(value))));
  schedulePort(peer);
}

export function portStart(port) {
  const record = requirePort(port);
  if (record.closed || record.detached) return;
  record.started = true;
  schedulePort(record);
}

export function broadcastName(channel) {
  return requireBroadcast(channel).name;
}

export function broadcastClose(channel) {
  const record = requireBroadcast(channel);
  if (record.closed) return;
  record.closed = true;
  messagingState().liveBroadcasts.delete(record);
  record.connection?.close();
  messagingState().broadcasts.get(record.name)?.delete(record);
}

export function broadcastPostMessage(channel, message) {
  const sender = requireBroadcast(channel);
  if (sender.closed) {
    throw new DOMException("The channel is closed.", "InvalidStateError");
  }
  if (sender.connection !== null) {
    sender.connection.publish(performStructuredClone(message));
    return;
  }
  const group = messagingState().broadcasts.get(sender.name) ?? [];
  for (const receiver of group) {
    if (receiver === sender || receiver.closed) continue;
    const cloned = performStructuredClone(message);
    Promise.resolve().then(() => {
      if (!receiver.closed) {
        deliver(receiver.channel, createMessageEvent(cloned, []));
      }
    });
  }
}

export function closeAllBroadcastChannels() {
  for (const record of [...messagingState().liveBroadcasts]) {
    if (!record.closed) broadcastClose(record.channel);
  }
}

registerStructuredCloneTransferHandler({
  isTransferable(value) {
    return portState.has(value);
  },
  canTransfer(value) {
    const record = portState.get(value);
    return record !== undefined && !record.closed && !record.detached;
  },
  prepare(value) {
    const original = requirePort(value);
    const replacement = Object.create(MessagePort.prototype);
    initializeEventTarget(replacement);
    const next = {
      port: replacement,
      connection: original.connection,
      index: original.index,
      queue: original.queue,
      started: false,
      closed: false,
      detached: false,
      scheduled: false,
      handlers: new Map(),
    };
    portState.set(replacement, next);
    return {
      source: value,
      replacement,
      commit() {
        original.detached = true;
        original.closed = true;
        original.queue = [];
        original.connection.states[original.index] = next;
      },
    };
  },
});

function createPort(connection, index) {
  const port = Object.create(MessagePort.prototype);
  initializeEventTarget(port);
  const record = {
    port,
    connection,
    index,
    queue: [],
    started: false,
    closed: false,
    detached: false,
    scheduled: false,
    handlers: new Map(),
  };
  portState.set(port, record);
  connection.states[index] = record;
  return port;
}

function schedulePort(record) {
  if (!record.started || record.scheduled || record.queue.length === 0) return;
  record.scheduled = true;
  Promise.resolve().then(() => {
    record.scheduled = false;
    if (record.closed || record.detached || !record.started) return;
    while (record.queue.length > 0) deliver(record.port, record.queue.shift());
  });
}

function deliver(target, event) {
  target.dispatchEvent(event);
  const handler = requireMessageTarget(target).handlers.get("onmessage") ?? null;
  if (handler !== null) Reflect.apply(handler, target, [event]);
}

function createMessageEvent(data, ports) {
  return new MessageEvent("message", { data, ports });
}

function initializeMessageEvent(event, init) {
  messageEventState.set(event, {
    data: init.data ?? null,
    origin: `${init.origin ?? ""}`,
    lastEventId: `${init.lastEventId ?? ""}`,
    source: init.source ?? null,
    ports: Object.freeze([...(init.ports ?? [])]),
    userActivation: init.userActivation ?? null,
  });
}

function normalizeTransferOptions(value) {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return { transfer: value };
  return value;
}

function requireMessageEvent(value) {
  const record = messageEventState.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requirePort(value) {
  const record = portState.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireBroadcast(value) {
  const record = broadcastState.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireMessageTarget(value) {
  return portState.get(value) ?? broadcastState.get(value) ?? illegal();
}

function illegal() {
  throw new TypeError("Illegal invocation");
}
