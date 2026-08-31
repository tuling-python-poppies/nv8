import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();
let queueSingleton = null;

export function LaunchParams() {
  throw new TypeError(
    "Failed to construct 'LaunchParams': Illegal constructor",
  );
}

export function LaunchQueue() {
  throw new TypeError(
    "Failed to construct 'LaunchQueue': Illegal constructor",
  );
}

registerNativeFunction(LaunchParams, "LaunchParams");
registerNativeFunction(LaunchQueue, "LaunchQueue");
export const launchHandlingConstructors = Object.freeze([
  LaunchParams,
  LaunchQueue,
]);

export function launchQueueGlobal() {
  if (queueSingleton === null) {
    queueSingleton = create(LaunchQueue, {
      kind: "queue",
      consumer: null,
    });
  }
  return queueSingleton;
}

export function resetLaunchQueue() {
  queueSingleton = null;
}

export function createLaunchParams(targetURL = "", files = []) {
  return create(LaunchParams, {
    kind: "params",
    targetURL: `${targetURL}`,
    files: [...files],
  });
}

export function deliverLaunchParams(targetURL, files = []) {
  const queue = launchQueueGlobal();
  const record = requireRecord(queue);
  if (record.consumer === null) return false;
  Reflect.apply(record.consumer, undefined, [
    createLaunchParams(targetURL, files),
  ]);
  return true;
}

export function launchHandlingProperty(value, name) {
  return requireRecord(value)[name];
}

export function launchHandlingOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind !== "queue" || name !== "setConsumer") {
    throw new TypeError("Illegal invocation");
  }
  if (args.length === 0) {
    throw new TypeError(
      "Failed to execute 'setConsumer' on 'LaunchQueue': "
        + "1 argument required, but only 0 present.",
    );
  }
  if (typeof args[0] !== "function") {
    throw new TypeError(
      "Failed to execute 'setConsumer' on 'LaunchQueue': "
        + "parameter 1 is not of type 'Function'.",
    );
  }
  record.consumer = args[0];
  return undefined;
}

function create(Constructor, record) {
  const value = Object.create(Constructor.prototype);
  state.set(value, record);
  return value;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}
