import { WritableStream } from "../streams/stream-runtime.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

const state = new WeakMap();

// 文件系统根节点、bucket、observer 和 manager 单例原先是模块级状态，
// 会跨 Realm 共享虚拟文件系统。现在每个 Realm 拥有自己的存储图。
const fileSystemSlot = createRealmSlot(() => ({
  rootNode: directoryNode(""),
  buckets: new Map(),
  observers: new Set(),
  storageManager: null,
  bucketManager: null,
}), "file-system-runtime");

function fileSystemState() {
  return fileSystemSlot.get(globalThis);
}

export function StorageManager() { illegalConstructor("StorageManager"); }
export function FileSystemDirectoryHandle() { illegalConstructor("FileSystemDirectoryHandle"); }
export function FileSystemFileHandle() { illegalConstructor("FileSystemFileHandle"); }
export function FileSystemHandle() { illegalConstructor("FileSystemHandle"); }
export function FileSystemWritableFileStream() { illegalConstructor("FileSystemWritableFileStream"); }
export function FileSystemObserver(callback) {
  requireNew(new.target, "FileSystemObserver");
  if (typeof callback !== "function") throw new TypeError("Observer callback is required");
  state.set(this, {
    kind: "observer",
    object: this,
    callback,
    targets: new Set(),
    active: true,
  });
  fileSystemState().observers.add(this);
}
export function StorageBucket() { illegalConstructor("StorageBucket"); }
export function StorageBucketManager() { illegalConstructor("StorageBucketManager"); }

export const fileSystemConstructors = Object.freeze([
  StorageManager, FileSystemDirectoryHandle, FileSystemFileHandle,
  FileSystemHandle, FileSystemWritableFileStream, FileSystemObserver,
  StorageBucket, StorageBucketManager,
]);
for (const constructor of fileSystemConstructors) {
  registerNativeFunction(constructor, constructor.name);
}

export function createStorageManager() {
  if (fileSystemState().storageManager !== null) return fileSystemState().storageManager;
  fileSystemState().storageManager = Object.create(StorageManager.prototype);
  state.set(fileSystemState().storageManager, { kind: "storageManager", root: fileSystemState().rootNode });
  return fileSystemState().storageManager;
}

export function createStorageBucketManager() {
  if (fileSystemState().bucketManager !== null) return fileSystemState().bucketManager;
  fileSystemState().bucketManager = Object.create(StorageBucketManager.prototype);
  state.set(fileSystemState().bucketManager, { kind: "bucketManager" });
  return fileSystemState().bucketManager;
}

export function fileSystemBackingNode(value) {
  return requireKind(value, "fileHandle").node;
}

export function fileSystemProperty(value, name) {
  const record = requireRecord(value);
  if (
    name === "kind"
    && (record.kind === "directoryHandle" || record.kind === "fileHandle")
  ) {
    return record.node.kind;
  }
  return record[name];
}

export function fileSystemOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "storageManager") return storageManagerOperation(record, name);
  if (record.kind === "directoryHandle") return directoryOperation(record, name, args);
  if (record.kind === "fileHandle") return fileOperation(record, name, args);
  if (record.kind === "directoryHandle" || record.kind === "fileHandle") {
    return handleOperation(record, name, args);
  }
  if (record.kind === "writable") return writableOperation(record, name, args);
  if (record.kind === "observer") return observerOperation(record, name, args);
  if (record.kind === "bucketManager") return bucketManagerOperation(name, args);
  if (record.kind === "bucket") return bucketOperation(record, name, args);
  throw new TypeError(`Unsupported file-system operation: ${name}`);
}

export function fileSystemBaseOperation(value, name, args) {
  return handleOperation(requireRecord(value), name, args);
}

export function fileSystemAsyncIterator(value) {
  return directoryValues(requireKind(value, "directoryHandle"), "entries");
}

export function showPicker() {
  return Promise.reject(new DOMException(
    "The offline sandbox has no user file chooser.",
    "AbortError",
  ));
}

function storageManagerOperation(record, name) {
  if (name === "estimate") return Promise.resolve(estimateNode(record.root));
  if (name === "persisted") return Promise.resolve(true);
  if (name === "persist") return Promise.resolve(true);
  if (name === "getDirectory") return Promise.resolve(createHandle(record.root));
}

function directoryOperation(record, name, args) {
  if (["isSameEntry", "queryPermission", "requestPermission", "remove"].includes(name)) {
    return handleOperation(record, name, args);
  }
  if (name === "getDirectoryHandle") {
    const entryName = validName(args[0]);
    const options = args[1] ?? {};
    let child = record.node.entries.get(entryName);
    if (child === undefined && options.create) {
      child = directoryNode(entryName, record.node);
      record.node.entries.set(entryName, child);
      notify(record.node, "created", entryName);
    }
    if (child === undefined) return Promise.reject(notFound(entryName));
    if (child.kind !== "directory") return Promise.reject(typeMismatch(entryName));
    return Promise.resolve(createHandle(child));
  }
  if (name === "getFileHandle") {
    const entryName = validName(args[0]);
    const options = args[1] ?? {};
    let child = record.node.entries.get(entryName);
    if (child === undefined && options.create) {
      child = fileNode(entryName, record.node);
      record.node.entries.set(entryName, child);
      notify(record.node, "created", entryName);
    }
    if (child === undefined) return Promise.reject(notFound(entryName));
    if (child.kind !== "file") return Promise.reject(typeMismatch(entryName));
    return Promise.resolve(createHandle(child));
  }
  if (name === "removeEntry") {
    const entryName = validName(args[0]);
    const child = record.node.entries.get(entryName);
    if (child === undefined) return Promise.reject(notFound(entryName));
    if (child.kind === "directory" && child.entries.size > 0 && !args[1]?.recursive) {
      return Promise.reject(new DOMException("Directory is not empty", "InvalidModificationError"));
    }
    record.node.entries.delete(entryName);
    notify(record.node, "deleted", entryName);
    return Promise.resolve();
  }
  if (name === "resolve") {
    const target = requireRecord(args[0]).node;
    const path = pathFrom(record.node, target);
    return Promise.resolve(path);
  }
  if (["entries", "keys", "values"].includes(name)) {
    return directoryValues(record, name);
  }
}

function fileOperation(record, name, args) {
  if (["isSameEntry", "queryPermission", "requestPermission", "remove"].includes(name)) {
    return handleOperation(record, name, args);
  }
  if (name === "getFile") {
    return Promise.resolve(new File(
      [record.node.bytes],
      record.node.name,
      { type: record.node.type, lastModified: record.node.lastModified },
    ));
  }
  if (name === "createWritable") return Promise.resolve(createWritable(record.node, args[0] ?? {}));
  if (name === "move") {
    let destination = record.node.parent;
    let newName;
    if (args.length > 1) {
      destination = requireKind(args[0], "directoryHandle").node;
      newName = validName(args[1]);
    } else {
      newName = validName(args[0]);
    }
    record.node.parent?.entries.delete(record.node.name);
    record.node.name = newName;
    record.node.parent = destination;
    destination.entries.set(newName, record.node);
    notify(destination, "moved", newName);
    return Promise.resolve();
  }
}

function handleOperation(record, name, args) {
  if (name === "isSameEntry") {
    return Promise.resolve(state.get(args[0])?.node === record.node);
  }
  if (name === "queryPermission" || name === "requestPermission") {
    return Promise.resolve("granted");
  }
  if (name === "remove") {
    if (record.node.parent === null) {
      return Promise.reject(new DOMException("Root cannot be removed", "InvalidModificationError"));
    }
    record.node.parent.entries.delete(record.node.name);
    notify(record.node.parent, "deleted", record.node.name);
    return Promise.resolve();
  }
}

function createWritable(node, options) {
  const stream = new WritableStream();
  Object.setPrototypeOf(stream, FileSystemWritableFileStream.prototype);
  if (!options.keepExistingData) {
    node.bytes = new Uint8Array();
    node.lastModified = Date.now();
  }
  state.set(stream, {
    kind: "writable",
    node,
    position: 0,
    mode: "siloed",
  });
  return stream;
}

function writableOperation(record, name, args) {
  if (name === "seek") {
    record.position = nonNegativeInteger(args[0], "position");
    return Promise.resolve();
  }
  if (name === "truncate") {
    const size = nonNegativeInteger(args[0], "size");
    const bytes = new Uint8Array(size);
    bytes.set(record.node.bytes.subarray(0, size));
    record.node.bytes = bytes;
    record.position = Math.min(record.position, size);
    touch(record.node);
    return Promise.resolve();
  }
  if (name === "write") return writeData(record, args[0]);
}

async function writeData(record, input) {
  if (input !== null && typeof input === "object" && "type" in input) {
    if (input.type === "seek") return writableOperation(record, "seek", [input.position]);
    if (input.type === "truncate") return writableOperation(record, "truncate", [input.size]);
    if (input.type === "write") {
      if (input.position !== undefined) record.position = nonNegativeInteger(input.position, "position");
      input = input.data;
    }
  }
  const bytes = await bytesOf(input);
  const required = record.position + bytes.length;
  if (required > record.node.bytes.length) {
    const expanded = new Uint8Array(required);
    expanded.set(record.node.bytes);
    record.node.bytes = expanded;
  }
  record.node.bytes.set(bytes, record.position);
  record.position += bytes.length;
  touch(record.node);
}

function observerOperation(record, name, args) {
  if (name === "disconnect") {
    record.active = false;
    record.targets.clear();
    fileSystemState().observers.delete(record.object);
    return;
  }
  if (name === "observe") {
    record.targets.add(requireRecord(args[0]).node);
    return Promise.resolve();
  }
}

function bucketManagerOperation(name, args) {
  if (name === "keys") return Promise.resolve([...fileSystemState().buckets.keys()]);
  if (name === "delete") {
    fileSystemState().buckets.delete(`${args[0]}`);
    return Promise.resolve();
  }
  if (name === "open") {
    const bucketName = validName(args[0]);
    let bucket = fileSystemState().buckets.get(bucketName);
    if (bucket === undefined) {
      bucket = createBucket(bucketName, args[1] ?? {});
      fileSystemState().buckets.set(bucketName, bucket);
    }
    return Promise.resolve(bucket);
  }
}

function createBucket(name, options) {
  const value = Object.create(StorageBucket.prototype);
  state.set(value, {
    kind: "bucket",
    object: value,
    name,
    root: directoryNode(""),
    indexedDB: tagged("IDBFactory"),
    caches: tagged("CacheStorage"),
    expiration: options.expires ?? null,
    persistedValue: Boolean(options.persisted),
  });
  return value;
}

function bucketOperation(record, name, args) {
  if (name === "estimate") return Promise.resolve(estimateNode(record.root));
  if (name === "getDirectory") return Promise.resolve(createHandle(record.root));
  if (name === "persisted") return Promise.resolve(record.persistedValue);
  if (name === "expires") return Promise.resolve(record.expiration);
  if (name === "persist") {
    record.persistedValue = true;
    return Promise.resolve(true);
  }
  if (name === "setExpires") {
    state.set(record.object, {
      ...record,
      expiration: Number(args[0]),
    });
    return Promise.resolve();
  }
}

function createHandle(node) {
  const Constructor = node.kind === "directory"
    ? FileSystemDirectoryHandle
    : FileSystemFileHandle;
  const handle = Object.create(Constructor.prototype);
  state.set(handle, {
    kind: `${node.kind}Handle`,
    node,
    name: node.name,
  });
  state.get(handle).kind = node.kind === "directory" ? "directoryHandle" : "fileHandle";
  Object.defineProperty(state.get(handle), "kindValue", { value: node.kind });
  return handle;
}

function directoryValues(record, mode) {
  const snapshot = [...record.node.entries.entries()].map(([name, node]) => [
    name,
    createHandle(node),
  ]);
  return (async function* iterate() {
    for (const [name, handle] of snapshot) {
      if (mode === "keys") yield name;
      else if (mode === "values") yield handle;
      else yield [name, handle];
    }
  })();
}

function notify(node, type, relativePath) {
  for (const observer of fileSystemState().observers) {
    const record = requireRecord(observer);
    if (!record.active || !record.targets.has(node)) continue;
    Promise.resolve().then(() => {
      Reflect.apply(record.callback, record.object, [[{
        type,
        changedHandle: null,
        relativePathComponents: [relativePath],
      }], record.object]);
    });
  }
}

function touch(node) {
  node.lastModified = Date.now();
  if (node.parent !== null) notify(node.parent, "modified", node.name);
}

function directoryNode(name, parent = null) {
  return { kind: "directory", name, parent, entries: new Map() };
}

function fileNode(name, parent = null) {
  return {
    kind: "file",
    name,
    parent,
    bytes: new Uint8Array(),
    type: "",
    lastModified: Date.now(),
  };
}

function estimateNode(root) {
  let usage = 0;
  const visit = node => {
    if (node.kind === "file") usage += node.bytes.length;
    else for (const child of node.entries.values()) visit(child);
  };
  visit(root);
  return { usage, quota: 1024 * 1024 * 1024 };
}

function pathFrom(root, target) {
  const parts = [];
  let current = target;
  while (current !== root && current !== null) {
    parts.unshift(current.name);
    current = current.parent;
  }
  return current === root ? parts : null;
}

async function bytesOf(input) {
  if (typeof input === "string") return new TextEncoder().encode(input);
  if (input instanceof Blob) return new Uint8Array(await input.arrayBuffer());
  if (input instanceof ArrayBuffer) return new Uint8Array(input.slice(0));
  if (ArrayBuffer.isView(input)) {
    return new Uint8Array(input.buffer, input.byteOffset, input.byteLength).slice();
  }
  throw new TypeError("Unsupported file write data");
}

function validName(input) {
  const name = `${input}`;
  if (name === "" || name === "." || name === ".." || /[\\/]/u.test(name)) {
    throw new TypeError("Invalid file-system entry name");
  }
  return name;
}

function tagged(tag) {
  const value = {};
  Object.defineProperty(value, Symbol.toStringTag, { value: tag, configurable: true });
  return value;
}

function notFound(name) {
  return new DOMException(`${name} was not found`, "NotFoundError");
}

function typeMismatch(name) {
  return new DOMException(`${name} has a different entry kind`, "TypeMismatchError");
}

function nonNegativeInteger(value, name) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 0) {
    throw new RangeError(`${name} must be a non-negative integer`);
  }
  return number;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireKind(value, kind) {
  const record = requireRecord(value);
  if (record.kind !== kind) throw new TypeError("Illegal invocation");
  return record;
}

function requireNew(newTarget, name) {
  if (newTarget === undefined) {
    throw new TypeError(`Failed to construct '${name}': use the new operator`);
  }
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
