import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();
let nextWorkletSelection = 0;
let sharedStorageSingleton = null;

export function SharedStorage() {
  throw new TypeError("Illegal constructor");
}
export function SharedStorageWorklet() {
  throw new TypeError("Illegal constructor");
}
export function SharedStorageModifierMethod() {
  throw new TypeError("Illegal constructor");
}
export function SharedStorageAppendMethod(key, value) {
  requireNew(new.target, "SharedStorageAppendMethod");
  requireConstructorArguments(
    arguments,
    2,
    "SharedStorageAppendMethod",
  );
  attachOperation(this, {
    operation: "append",
    key: `${key}`,
    value: `${value}`,
    withLock: optionString(arguments[2], "withLock"),
  });
}
export function SharedStorageClearMethod() {
  requireNew(new.target, "SharedStorageClearMethod");
  attachOperation(this, {
    operation: "clear",
    withLock: optionString(arguments[0], "withLock"),
  });
}
export function SharedStorageDeleteMethod(key) {
  requireNew(new.target, "SharedStorageDeleteMethod");
  requireConstructorArguments(
    arguments,
    1,
    "SharedStorageDeleteMethod",
  );
  attachOperation(this, {
    operation: "delete",
    key: `${key}`,
    withLock: optionString(arguments[1], "withLock"),
  });
}
export function SharedStorageSetMethod(key, value) {
  requireNew(new.target, "SharedStorageSetMethod");
  requireConstructorArguments(arguments, 2, "SharedStorageSetMethod");
  attachOperation(this, {
    operation: "set",
    key: `${key}`,
    value: `${value}`,
    ignoreIfPresent: optionBoolean(arguments[2], "ignoreIfPresent"),
    withLock: optionString(arguments[2], "withLock"),
  });
}

export const sharedStorageConstructors = Object.freeze([
  SharedStorage,
  SharedStorageWorklet,
  SharedStorageAppendMethod,
  SharedStorageClearMethod,
  SharedStorageDeleteMethod,
  SharedStorageModifierMethod,
  SharedStorageSetMethod,
]);
for (const Constructor of sharedStorageConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function createSharedStorage() {
  const worklet = createWorklet();
  return create(SharedStorage, {
    kind: "storage",
    entries: new Map(),
    worklet,
    nextSelection: 0,
  });
}

export function sharedStorageGlobal() {
  if (sharedStorageSingleton === null) {
    sharedStorageSingleton = createSharedStorage();
  }
  return sharedStorageSingleton;
}

export function resetSharedStorage() {
  sharedStorageSingleton = null;
  nextWorkletSelection = 0;
}

export function sharedStorageProperty(value, name) {
  return requireRecord(value)[name];
}

export function sharedStorageOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "storage") {
    return storageOperation(record, name, args);
  }
  if (record.kind === "worklet") {
    return workletOperation(record, name, args);
  }
  throw new TypeError("Illegal invocation");
}

function storageOperation(record, name, args) {
  if (name === "append") {
    requireMethodArguments(args, 2, name, "SharedStorage");
    const key = `${args[0]}`;
    const value = `${args[1]}`;
    record.entries.set(key, `${record.entries.get(key) ?? ""}${value}`);
    return Promise.resolve();
  }
  if (name === "clear") {
    record.entries.clear();
    return Promise.resolve();
  }
  if (name === "delete") {
    requireMethodArguments(args, 1, name, "SharedStorage");
    record.entries.delete(`${args[0]}`);
    return Promise.resolve();
  }
  if (name === "set") {
    requireMethodArguments(args, 2, name, "SharedStorage");
    const key = `${args[0]}`;
    if (
      !optionBoolean(args[2], "ignoreIfPresent")
      || !record.entries.has(key)
    ) {
      record.entries.set(key, `${args[1]}`);
    }
    return Promise.resolve();
  }
  if (name === "batchUpdate") {
    requireMethodArguments(args, 1, name, "SharedStorage");
    if (!Array.isArray(args[0])) {
      throw new TypeError("SharedStorage batch methods must be an array");
    }
    const operations = args[0].map(method => {
      const operation = state.get(method);
      if (operation?.kind !== "operation") {
        throw new TypeError("Invalid shared storage modifier method");
      }
      return operation;
    });
    for (const operation of operations) applyOperation(record, operation);
    return Promise.resolve();
  }
  if (name === "createWorklet") {
    requireMethodArguments(args, 1, name, "SharedStorage");
    return Promise.resolve(createWorklet());
  }
  if (name === "run") {
    requireMethodArguments(args, 1, name, "SharedStorage");
    return Promise.resolve();
  }
  if (name === "selectURL") {
    requireMethodArguments(args, 2, name, "SharedStorage");
    record.nextSelection += 1;
    return Promise.resolve(
      `urn:uuid:shared-storage-${record.nextSelection}`,
    );
  }
  throw new TypeError(`Unsupported Shared Storage operation: ${name}`);
}

function workletOperation(record, name, args) {
  if (name === "addModule") {
    requireMethodArguments(args, 1, name, "Worklet");
    const url = `${args[0]}`;
    if (!record.modules.includes(url)) record.modules.push(url);
    return Promise.resolve();
  }
  if (name === "run") {
    requireMethodArguments(args, 1, name, "SharedStorageWorklet");
    record.runs += 1;
    return Promise.resolve();
  }
  if (name === "selectURL") {
    requireMethodArguments(args, 2, name, "SharedStorageWorklet");
    nextWorkletSelection += 1;
    return Promise.resolve(`urn:uuid:shared-storage-${nextWorkletSelection}`);
  }
  throw new TypeError(`Unsupported Shared Storage worklet operation: ${name}`);
}

function applyOperation(storage, operation) {
  if (operation.operation === "append") {
    storage.entries.set(
      operation.key,
      `${storage.entries.get(operation.key) ?? ""}${operation.value}`,
    );
  } else if (operation.operation === "clear") {
    storage.entries.clear();
  } else if (operation.operation === "delete") {
    storage.entries.delete(operation.key);
  } else if (
    operation.operation === "set"
    && (!operation.ignoreIfPresent || !storage.entries.has(operation.key))
  ) {
    storage.entries.set(operation.key, operation.value);
  }
}

function createWorklet() {
  return create(SharedStorageWorklet, {
    kind: "worklet",
    modules: [],
    runs: 0,
  });
}

function attachOperation(value, operation) {
  state.set(value, { kind: "operation", ...operation });
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

function requireNew(target, name) {
  if (target === undefined) {
    throw new TypeError(
      `Failed to construct '${name}': Please use the 'new' operator, this DOM object constructor cannot be called as a function.`,
    );
  }
}

function requireConstructorArguments(args, count, name) {
  if (args.length >= count) return;
  throw new TypeError(
    `Failed to construct '${name}': ${count} arguments required, `
      + `but only ${args.length} present.`,
  );
}

function requireMethodArguments(args, count, method, interfaceName) {
  if (args.length >= count) return;
  throw new TypeError(
    `Failed to execute '${method}' on '${interfaceName}': `
      + `${count} arguments required, but only ${args.length} present.`,
  );
}

function optionString(value, name) {
  if (value === null || typeof value !== "object") return null;
  return value[name] === undefined ? null : `${value[name]}`;
}

function optionBoolean(value, name) {
  return value !== null
    && typeof value === "object"
    && value[name] !== undefined
    && Boolean(value[name]);
}
