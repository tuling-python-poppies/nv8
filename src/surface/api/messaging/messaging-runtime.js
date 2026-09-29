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

// 跨模块图 port 注册表。
//
// 每个 Realm 有自己的模块图，因此有自己的 portState：在图 A 创建的 port，
// 其记录只存在于图 A。结构化克隆可能运行在**另一个**图里（window.postMessage
// 的克隆运行在接收方图，worker.postMessage 运行在发送方图），于是「要
// transfer 的 port 的记录在另一个图」是常态——没有共享注册表时
// canTransfer 直接落空，跨 Realm 的 port 转手（window → iframe → worker）
// 整体抛 DataCloneError。
//
// Sandbox 宿主（runtime-pool / engine core）为每个 Sandbox 创建**一个**
// 共享 WeakMap，注入到每个 Realm 的 messaging 模块。所有图都以 port 对象
// 本身为键登记/查询记录：canTransfer 因此能识别外图 port，prepare 在本图
// 创建**本图 MessagePort.prototype** 的 replacement，commit 时 detach 源
// port（真实浏览器语义）。对象身份就是唯一凭证——伪造 brand 的对象不在
// 任何注册表里，依旧抛 DataCloneError。未注入时保持 null，行为与单图
// 完全一致。
let sharedPortRegistry = null;

export function configureMessagePortRegistry(registry) {
  // 注意不能用 `instanceof WeakMap`：注册表由宿主 Realm 创建，跨 vm context
  // 时 instanceof 恒为 false。鸭子类型即可——宿主只会传真正的 WeakMap。
  sharedPortRegistry = registry !== null
    && typeof registry === "object"
    && typeof registry.get === "function"
    && typeof registry.set === "function"
    && typeof registry.has === "function"
    ? registry
    : null;
}

function lookupPort(value) {
  return portState.get(value) ?? sharedPortRegistry?.get(value);
}

function registerPort(port, record) {
  portState.set(port, record);
  sharedPortRegistry?.set(port, record);
}

// record 的调度闭包绑定在**持有方**图上：跨图投递时由持有方图创建
// MessageEvent 并 dispatch，避免把外图事件对象喂给本图 dispatchEvent
// （event-state 按图隔离，外图事件会被 "is not of type 'Event'" 拒绝）。
function bindRecordScheduler(record) {
  record.schedule = () => schedulePort(record);
}

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
  if (lookupPort(target) !== undefined && name === "onmessage" && typeof value === "function") {
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
  // 队列里放**原始条目**而不是 MessageEvent：事件必须在对端所属图里创建
  // （event-state 按图隔离），由对端的调度闭包在 drain 时物化，ports 也在
  // 那时才换成对图本地对象。
  peer.queue.push({
    data: cloned.value,
    ports: cloned.transferred.filter(value =>
      lookupPort(value) !== undefined),
  });
  // 经记录上的闭包调度：闭包绑定在 peer 的持有方图上。
  if (typeof peer.schedule === "function") {
    peer.schedule();
  } else {
    schedulePort(peer);
  }
}

export function portStart(port) {
  const record = requirePort(port);
  if (record.closed || record.detached) return;
  record.started = true;
  // start 的调用图通常就是持有方图；重绑闭包让后续跨图投递也走本图。
  bindRecordScheduler(record);
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
    return lookupPort(value) !== undefined;
  },
  canTransfer(value) {
    // 共享注册表兜底：记录可能由另一个模块图登记（跨 Realm 转手）。
    const record = lookupPort(value);
    return record !== undefined && !record.closed && !record.detached;
  },
  prepare(value) {
    const original = requirePort(value);
    // replacement 用**本图**的 MessagePort.prototype：克隆运行在哪个图，
    // 接收方拿到的就是哪个图的本地对象，不泄漏外图原型。
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
    registerPort(replacement, next);
    bindRecordScheduler(next);
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

/**
 * 把来自其他图的 port 对象换成**本图** MessagePort.prototype 的包装。
 *
 * worker 方向的 transfer 在发送方图里做结构化克隆，产出的 replacement 是
 * 发送方图的原型；接收 Realm 在物化 MessageEvent 前经这里换成本图对象。
 * 记录（连接、队列、handlers）跨图共享，包装只换「门面」；后续投递以
 * record.port 为准，因此同步改指本图包装，调度闭包也重绑到本图。
 * 本图 port 与未登记对象原样返回。
 */
export function localizeIncomingPorts(ports) {
  return ports.map(port => {
    if (portState.has(port)) return port;
    const record = sharedPortRegistry?.get(port);
    if (record === undefined) return port;
    const local = Object.create(MessagePort.prototype);
    initializeEventTarget(local);
    registerPort(local, record);
    record.port = local;
    bindRecordScheduler(record);
    return local;
  });
}

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
  registerPort(port, record);
  bindRecordScheduler(record);
  connection.states[index] = record;
  return port;
}

function schedulePort(record) {
  if (!record.started || record.scheduled || record.queue.length === 0) return;
  record.scheduled = true;
  Promise.resolve().then(() => {
    record.scheduled = false;
    if (record.closed || record.detached || !record.started) return;
    while (record.queue.length > 0) {
      const entry = record.queue.shift();
      const localPorts = localizeIncomingPorts(entry.ports);
      let data = entry.data;
      if (entry.ports.length > 0 && data !== null && typeof data === "object") {
        const incomingReplacements = new Map();
        for (let i = 0; i < entry.ports.length; i++) {
          incomingReplacements.set(entry.ports[i], localPorts[i]);
        }
        data = performStructuredCloneDetailed(data, {
          replacements: incomingReplacements,
        }).value;
      }
      // 事件在本图（持有方图）物化；随行的 transfer port 也换成本图对象。
      deliver(
        record.port,
        createMessageEvent(data, localPorts),
      );
    }
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
  const record = lookupPort(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireBroadcast(value) {
  const record = broadcastState.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireMessageTarget(value) {
  return lookupPort(value) ?? broadcastState.get(value) ?? illegal();
}

function illegal() {
  throw new TypeError("Illegal invocation");
}
