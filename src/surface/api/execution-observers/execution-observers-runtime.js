import { EventTarget } from "../event/event-target-constructor.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";

const createMonitorState = new WeakMap();
const profilerState = new WeakMap();

export function CreateMonitor() {
  throw new TypeError(
    "Failed to construct 'CreateMonitor': Illegal constructor",
  );
}

export function Profiler(options) {
  if (new.target === undefined || arguments.length === 0) {
    throw new TypeError(
      "Failed to construct 'Profiler': 1 argument required, but only 0 present.",
    );
  }
  initializeEventTarget(this);
  const object = isObject(options) ? options : {};
  profilerState.set(this, {
    sampleInterval: object.sampleInterval === undefined
      ? 10
      : Number(object.sampleInterval),
    stopped: false,
    started: performance.now(),
  });
}

for (const Constructor of [CreateMonitor, Profiler]) {
  registerNativeFunction(Constructor, Constructor.name);
}
export const executionObserverConstructors = Object.freeze([
  CreateMonitor,
  Profiler,
]);

export function createCreateMonitor() {
  const monitor = Object.create(CreateMonitor.prototype);
  initializeEventTarget(monitor);
  createMonitorState.set(monitor, { ondownloadprogress: null });
  return monitor;
}

export const ondownloadprogress = Object.getOwnPropertyDescriptor({
  get ondownloadprogress() {
    return requireCreateMonitor(this).ondownloadprogress;
  },
  set ondownloadprogress(value) {
    requireCreateMonitor(this).ondownloadprogress =
      typeof value === "function" || isObject(value) ? value : null;
  },
}, "ondownloadprogress");
registerNativeGetter(ondownloadprogress.get, "ondownloadprogress");
registerNativeFunction(
  ondownloadprogress.set,
  "set ondownloadprogress",
);

export function profilerProperty(value, name) {
  return requireProfiler(value)[name];
}

export function stop() {
  const state = requireProfiler(this);
  state.stopped = true;
  return Promise.resolve({
    startTime: 0,
    endTime: Math.max(0, performance.now() - state.started),
    frames: [],
    samples: [],
  });
}
registerNativeFunction(stop, "stop");

export function createProfilerForTest(options = {}) {
  return Reflect.construct(Profiler, [options]);
}

function requireCreateMonitor(value) {
  const state = createMonitorState.get(value);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

function requireProfiler(value) {
  const state = profilerState.get(value);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

function isObject(value) {
  return (typeof value === "object" && value !== null)
    || typeof value === "function";
}

Object.setPrototypeOf(CreateMonitor.prototype, EventTarget.prototype);
Object.setPrototypeOf(CreateMonitor, EventTarget);
Object.setPrototypeOf(Profiler.prototype, EventTarget.prototype);
Object.setPrototypeOf(Profiler, EventTarget);
