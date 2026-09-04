import { initializeAbortController, requireAbortController } from "../abort/abort-controller-state.js";
import { createAbortSignal, requireAbortSignal } from "../abort/abort-signal-state.js";
import { initializeEvent } from "../event/event-state.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { Event } from "../event/event-constructor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

const state = new WeakMap();

// scheduler/scheduling/userActivation 单例与 idle 回调表原先是模块级状态，
// 跨 Realm 共享会导致 idle 取消误伤到另一个 Realm 的回调。
const schedulingSlot = createRealmSlot(() => ({
  schedulerSingleton: null,
  schedulingSingleton: null,
  activationSingleton: null,
  nextIdleId: 0,
  idleTimers: new Map(),
}), "scheduling-runtime");

function schedulingState() {
  return schedulingSlot.get(globalThis);
}

export function IdleDeadline() { illegalConstructor("IdleDeadline"); }
export function IdleDetector() {
  if (new.target === undefined) throw new TypeError("IdleDetector requires new");
  initializeEventTarget(this);
  state.set(this, {
    kind: "idleDetector",
    object: this,
    userState: null,
    screenState: null,
    handlers: new Map([["onchange", null]]),
    started: false,
  });
}
export function Scheduling() { illegalConstructor("Scheduling"); }
export function Scheduler() { illegalConstructor("Scheduler"); }
export function TaskController() {
  if (new.target === undefined) throw new TypeError("TaskController requires new");
  const init = arguments[0] ?? {};
  initializeAbortController(this);
  const signal = createAbortSignal();
  Object.setPrototypeOf(signal, TaskSignal.prototype);
  state.set(signal, {
    kind: "taskSignal",
    object: signal,
    priority: normalizePriority(init.priority),
    handlers: new Map([["onprioritychange", null]]),
  });
  requireAbortController(this).signal = signal;
  state.set(this, { kind: "taskController", signal });
}
export function TaskSignal() { illegalConstructor("TaskSignal"); }
export function TaskPriorityChangeEvent(type, init) {
  if (new.target === undefined) throw new TypeError("TaskPriorityChangeEvent requires new");
  if (init === null || typeof init !== "object") throw new TypeError("Event init required");
  initializeEvent(this, `${type}`, {
    bubbles: Boolean(init.bubbles),
    cancelable: Boolean(init.cancelable),
    composed: Boolean(init.composed),
  });
  state.set(this, {
    kind: "priorityEvent",
    previousPriority: normalizePriority(init.previousPriority),
  });
}
export function UserActivation() { illegalConstructor("UserActivation"); }

export const schedulingConstructors = Object.freeze([
  IdleDeadline, IdleDetector, Scheduling, Scheduler, TaskController, TaskSignal,
  TaskPriorityChangeEvent, UserActivation,
]);
for (const Constructor of schedulingConstructors) registerNativeFunction(Constructor, Constructor.name);

export function createScheduler() {
  const scope = schedulingState();
  if (scope.schedulerSingleton !== null) return scope.schedulerSingleton;
  const value = Object.create(Scheduler.prototype);
  state.set(value, { kind: "scheduler" });
  scope.schedulerSingleton = value;
  return value;
}
export function createScheduling() {
  const scope = schedulingState();
  if (scope.schedulingSingleton !== null) return scope.schedulingSingleton;
  const value = Object.create(Scheduling.prototype);
  state.set(value, { kind: "scheduling" });
  scope.schedulingSingleton = value;
  return value;
}
export function createUserActivation() {
  const scope = schedulingState();
  if (scope.activationSingleton !== null) return scope.activationSingleton;
  const value = Object.create(UserActivation.prototype);
  state.set(value, { kind: "activation", hasBeenActive: false, isActive: false });
  scope.activationSingleton = value;
  return value;
}

export function schedulingProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  return record[name];
}
export function setSchedulingProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
  }
}

export function schedulingOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "deadline" && name === "timeRemaining") {
    return Math.max(0, record.deadline - performance.now());
  }
  if (record.kind === "idleDetector" && name === "start") {
    const options = args[0] ?? {};
    if (options.signal?.aborted) return Promise.reject(options.signal.reason);
    record.started = true;
    record.userState = "active";
    record.screenState = "unlocked";
    Promise.resolve().then(() => emit(record, "change", "onchange"));
    return Promise.resolve();
  }
  if (record.kind === "scheduling" && name === "isInputPending") return false;
  if (record.kind === "scheduler") {
    if (name === "yield") return Promise.resolve();
    if (name === "postTask") return postTask(args[0], args[1]);
  }
  if (record.kind === "taskController" && name === "setPriority") {
    setTaskPriority(record.signal, args[0]);
    return;
  }
}

export function requestIdleCallback(callback, options = {}) {
  if (typeof callback !== "function") throw new TypeError("Idle callback must be callable");
  const scope = schedulingState();
  scope.nextIdleId += 1;
  const id = scope.nextIdleId;
  const timeout = Number(options.timeout ?? 1);
  const handle = setTimeout(() => {
    scope.idleTimers.delete(id);
    const deadline = Object.create(IdleDeadline.prototype);
    state.set(deadline, {
      kind: "deadline",
      didTimeout: timeout <= 0,
      deadline: performance.now() + 50,
    });
    Reflect.apply(callback, globalThis, [deadline]);
  }, Math.max(0, Math.min(timeout, 1)));
  scope.idleTimers.set(id, handle);
  return id;
}
export function cancelIdleCallback(id) {
  const scope = schedulingState();
  const handle = scope.idleTimers.get(Number(id));
  if (handle !== undefined) clearTimeout(handle);
  scope.idleTimers.delete(Number(id));
}
registerNativeFunction(requestIdleCallback, "requestIdleCallback");
registerNativeFunction(cancelIdleCallback, "cancelIdleCallback");

export function idlePermission() { return Promise.resolve("granted"); }

function postTask(callback, options = {}) {
  if (typeof callback !== "function") return Promise.reject(new TypeError("Task callback must be callable"));
  const signal = options.signal;
  if (signal?.aborted) return Promise.reject(signal.reason);
  const delay = Math.max(0, Number(options.delay ?? 0));
  if (delay > 0) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (signal?.aborted) reject(signal.reason);
        else Promise.resolve().then(() => Reflect.apply(callback, undefined, [])).then(resolve, reject);
      }, delay);
    });
  }
  return Promise.resolve().then(() => {
    if (signal?.aborted) throw signal.reason;
    return Reflect.apply(callback, undefined, []);
  });
}

function setTaskPriority(signal, input) {
  requireAbortSignal(signal);
  const record = requireRecord(signal);
  const priority = normalizePriority(input);
  if (priority === record.priority) return;
  const previousPriority = record.priority;
  record.priority = priority;
  const event = new TaskPriorityChangeEvent("prioritychange", { previousPriority });
  signal.dispatchEvent(event);
  const handler = record.handlers.get("onprioritychange");
  if (handler !== null) Reflect.apply(handler, signal, [event]);
}

function emit(record, type, handlerName) {
  const event = new Event(type);
  record.object.dispatchEvent(event);
  const handler = record.handlers.get(handlerName);
  if (handler !== null) Reflect.apply(handler, record.object, [event]);
}
function normalizePriority(value = "user-visible") {
  const normalized = `${value}`;
  if (!["user-blocking", "user-visible", "background"].includes(normalized)) {
    throw new TypeError("Invalid task priority");
  }
  return normalized;
}
function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}
function illegalConstructor() { throw new TypeError("Illegal constructor"); }
