import { encodeBase64 } from "../canvas/canvas-png.js";
import { Event } from "../event/event-constructor.js";
import { decodeUtf8, requireBlob } from "../file/blob-state.js";
import {
  FileSystemFileHandle,
  fileSystemBackingNode,
} from "../file-system/file-system-runtime.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../webidl/native-function.js";

const syncAccessState = new WeakMap();
const transformState = new WeakMap();
let rtcTransformHandler = null;
const syncFileSystems = new Map();
const syncEntries = new Map();

export function FileReaderSync() {
  if (!new.target) {
    throw new TypeError(
      "Failed to construct 'FileReaderSync': Please use the 'new' operator, this DOM object constructor cannot be called as a function.",
    );
  }
}
registerNativeFunction(FileReaderSync, "FileReaderSync");

export function FileSystemSyncAccessHandle() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(
  FileSystemSyncAccessHandle,
  "FileSystemSyncAccessHandle",
);

export function RTCRtpScriptTransformer() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(RTCRtpScriptTransformer, "RTCRtpScriptTransformer");

export function RTCTransformEvent() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(RTCTransformEvent, "RTCTransformEvent");

export function installWorkerOnlyAPIs() {
  installFileReaderSync();
  installSyncAccessHandle();
  installFileSystemFileHandleSyncAccess();
  installRTCTransform();
  installLegacyFileSystemGlobals();
}

export function createFileSystemSyncAccessHandle(
  backing = { bytes: new Uint8Array(), lastModified: Date.now() },
) {
  const handle = Object.create(FileSystemSyncAccessHandle.prototype);
  syncAccessState.set(handle, {
    node: backing instanceof Uint8Array
      ? { bytes: backing.slice(), lastModified: Date.now() }
      : backing,
    closed: false,
  });
  return handle;
}

export function createRTCRtpScriptTransformer(options = null) {
  const transformer = Object.create(RTCRtpScriptTransformer.prototype);
  transformState.set(transformer, {
    options,
    readable: new ReadableStream(),
    writable: new WritableStream(),
  });
  return transformer;
}

function installFileReaderSync() {
  defineGlobalConstructor("FileReaderSync", FileReaderSync);
  const methods = {
    readAsArrayBuffer(blob) {
      const bytes = blobBytes(this, blob);
      return bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + bytes.byteLength,
      );
    },
    readAsBinaryString(blob) {
      return [...blobBytes(this, blob)]
        .map(byte => String.fromCharCode(byte))
        .join("");
    },
    readAsText(blob) {
      return decodeUtf8(blobBytes(this, blob));
    },
    readAsDataURL(blob) {
      requireFileReaderSync(this);
      const record = requireBlob(blob);
      return `data:${record.type};base64,${encodeBase64(record.bytes)}`;
    },
  };
  for (const [name, callback] of Object.entries(methods)) {
    registerNativeFunction(callback, name);
    definePrototypeMethod(FileReaderSync.prototype, name, callback);
  }
  defineConstructorBacklink(FileReaderSync.prototype, FileReaderSync);
  defineToStringTag(FileReaderSync.prototype, "FileReaderSync");
}

function installSyncAccessHandle() {
  defineGlobalConstructor(
    "FileSystemSyncAccessHandle",
    FileSystemSyncAccessHandle,
  );
  const methods = {
    close() {
      const record = requireSyncAccess(this);
      record.closed = true;
    },
    flush() {
      requireSyncAccess(this);
    },
    getSize() {
      return requireSyncAccess(this).node.bytes.length;
    },
    read(buffer) {
      const record = requireSyncAccess(this);
      const target = requireBufferSource(buffer);
      const at = normalizeOffset(arguments[1]?.at);
      const count = Math.min(
        target.length,
        Math.max(0, record.node.bytes.length - at),
      );
      target.set(record.node.bytes.subarray(at, at + count));
      return count;
    },
    truncate(size) {
      const record = requireSyncAccess(this);
      const length = normalizeOffset(size);
      const bytes = new Uint8Array(length);
      bytes.set(record.node.bytes.subarray(0, length));
      record.node.bytes = bytes;
      record.node.lastModified = Date.now();
    },
    write(buffer) {
      const record = requireSyncAccess(this);
      const source = requireBufferSource(buffer);
      const at = normalizeOffset(arguments[1]?.at);
      const required = at + source.length;
      if (required > record.node.bytes.length) {
        const bytes = new Uint8Array(required);
        bytes.set(record.node.bytes);
        record.node.bytes = bytes;
      }
      record.node.bytes.set(source, at);
      record.node.lastModified = Date.now();
      return source.length;
    },
  };
  const lengths = {
    close: 0,
    flush: 0,
    getSize: 0,
    read: 1,
    truncate: 1,
    write: 1,
  };
  for (const [name, callback] of Object.entries(methods)) {
    Object.defineProperty(callback, "length", {
      value: lengths[name],
      configurable: true,
    });
    registerNativeFunction(callback, name);
    definePrototypeMethod(
      FileSystemSyncAccessHandle.prototype,
      name,
      callback,
    );
  }
  defineConstructorBacklink(
    FileSystemSyncAccessHandle.prototype,
    FileSystemSyncAccessHandle,
  );
  defineToStringTag(
    FileSystemSyncAccessHandle.prototype,
    "FileSystemSyncAccessHandle",
  );
}

function installFileSystemFileHandleSyncAccess() {
  const callback = {
    createSyncAccessHandle() {
      const node = fileSystemBackingNode(this);
      return Promise.resolve(createFileSystemSyncAccessHandle(node));
    },
  }.createSyncAccessHandle;
  registerNativeFunction(callback, "createSyncAccessHandle");
  definePrototypeMethod(
    FileSystemFileHandle.prototype,
    "createSyncAccessHandle",
    callback,
  );
}

function installRTCTransform() {
  Object.setPrototypeOf(RTCTransformEvent.prototype, Event.prototype);
  Object.setPrototypeOf(RTCTransformEvent, Event);
  defineGlobalConstructor("RTCTransformEvent", RTCTransformEvent);
  defineGlobalConstructor("RTCRtpScriptTransformer", RTCRtpScriptTransformer);
  for (const name of ["options", "readable", "writable"]) {
    const getter = Object.getOwnPropertyDescriptor({
      get [name]() {
        const state = transformState.get(this);
        if (state === undefined) throw new TypeError("Illegal invocation");
        return state[name];
      },
    }, name).get;
    registerNativeGetter(getter, name);
    definePrototypeGetter(RTCRtpScriptTransformer.prototype, name, getter);
  }
  for (const name of ["generateKeyFrame", "sendKeyFrameRequest"]) {
    const callback = {
      [name]() {
        if (!transformState.has(this)) throw new TypeError("Illegal invocation");
        return Promise.resolve();
      },
    }[name];
    registerNativeFunction(callback, name);
    definePrototypeMethod(RTCRtpScriptTransformer.prototype, name, callback);
  }
  defineConstructorBacklink(
    RTCRtpScriptTransformer.prototype,
    RTCRtpScriptTransformer,
  );
  defineToStringTag(
    RTCRtpScriptTransformer.prototype,
    "RTCRtpScriptTransformer",
  );
  const transformer = Object.getOwnPropertyDescriptor({
    get transformer() {
      const value = transformState.get(this)?.transformer;
      if (value === undefined) throw new TypeError("Illegal invocation");
      return value;
    },
  }, "transformer").get;
  registerNativeGetter(transformer, "transformer");
  definePrototypeGetter(RTCTransformEvent.prototype, "transformer", transformer);
  defineConstructorBacklink(RTCTransformEvent.prototype, RTCTransformEvent);
  defineToStringTag(RTCTransformEvent.prototype, "RTCTransformEvent");
  const descriptor = Object.getOwnPropertyDescriptor({
    get onrtctransform() { return rtcTransformHandler; },
    set onrtctransform(value) {
      rtcTransformHandler = typeof value === "function" ? value : null;
    },
  }, "onrtctransform");
  registerNativeGetter(descriptor.get, "onrtctransform");
  registerNativeFunction(descriptor.set, "set onrtctransform");
  Object.defineProperty(globalThis, "onrtctransform", {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: true,
    configurable: true,
  });
}

function installLegacyFileSystemGlobals() {
  const request = function webkitRequestFileSystem(
    type,
    size,
    successCallback,
  ) {
    void size;
    if (typeof successCallback !== "function") {
      throw new TypeError("the success callback is required");
    }
    try {
      const fileSystem = getSyncFileSystem(type);
      queueMicrotask(() => successCallback(fileSystem));
    } catch (error) {
      const errorCallback = arguments[3];
      if (typeof errorCallback === "function") {
        queueMicrotask(() => errorCallback(error));
      }
    }
  };
  const requestSync = function webkitRequestFileSystemSync(type, size) {
    void size;
    return getSyncFileSystem(type);
  };
  const resolve = function webkitResolveLocalFileSystemURL(
    url,
    successCallback,
  ) {
    if (typeof successCallback !== "function") {
      throw new TypeError("the success callback is required");
    }
    const entry = syncEntries.get(`${url}`);
    const errorCallback = arguments[2];
    queueMicrotask(() => {
      if (entry !== undefined) successCallback(entry);
      else if (typeof errorCallback === "function") {
        errorCallback(new DOMException("Entry not found", "NotFoundError"));
      }
    });
  };
  const resolveSync = function webkitResolveLocalFileSystemSyncURL(url) {
    const entry = syncEntries.get(`${url}`);
    if (entry === undefined) {
      throw new DOMException("Entry not found", "NotFoundError");
    }
    return entry;
  };
  for (const callback of [request, requestSync, resolve, resolveSync]) {
    registerNativeFunction(callback, callback.name);
    Object.defineProperty(globalThis, callback.name, {
      value: callback,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
}

function getSyncFileSystem(type) {
  const normalized = Math.trunc(Number(type));
  if (normalized !== 0 && normalized !== 1) {
    throw new DOMException("Unsupported file system type", "NotSupportedError");
  }
  let fileSystem = syncFileSystems.get(normalized);
  if (fileSystem !== undefined) return fileSystem;
  const storage = normalized === 0 ? "temporary" : "persistent";
  const url = `filesystem:${globalThis.location.origin}/${storage}/`;
  const root = {
    isFile: false,
    isDirectory: true,
    name: "",
    fullPath: "/",
    toURL() { return url; },
  };
  Object.defineProperty(root, Symbol.toStringTag, {
    value: "DirectoryEntry",
  });
  fileSystem = {
    name: `${globalThis.location.origin}:${storage}`,
    root,
  };
  Object.defineProperty(fileSystem, Symbol.toStringTag, {
    value: "DOMFileSystem",
  });
  syncFileSystems.set(normalized, fileSystem);
  syncEntries.set(url, root);
  return fileSystem;
}

function requireFileReaderSync(value) {
  if (!(value instanceof FileReaderSync)) {
    throw new TypeError("Illegal invocation");
  }
}

function blobBytes(reader, blob) {
  requireFileReaderSync(reader);
  return requireBlob(blob).bytes.slice();
}

function requireSyncAccess(value) {
  const record = syncAccessState.get(value);
  if (record === undefined || record.closed) {
    throw new TypeError("The access handle is closed");
  }
  return record;
}

function requireBufferSource(value) {
  if (!ArrayBuffer.isView(value) || value instanceof DataView) {
    throw new TypeError("A typed array is required");
  }
  return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
}

function normalizeOffset(value) {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number) || number < 0) {
    throw new TypeError("Offset must be a non-negative finite number");
  }
  return Math.trunc(number);
}
