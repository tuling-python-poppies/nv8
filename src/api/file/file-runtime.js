import { initializeEventTarget } from "../event/event-target-state.js";
import { Blob } from "./blob-constructor.js";
import { decodeUtf8, initializeBlob, requireBlob } from "./blob-state.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

const fileState = new WeakMap();
const readerState = new WeakMap();

export function File(fileBits, fileName) {
  if (!new.target) throw new TypeError("Constructor File requires 'new'");
  const options = arguments[2] ?? {};
  initializeBlob(this, fileBits === undefined ? [] : Array.from(fileBits), options);
  const modified = Number(options.lastModified ?? Date.now());
  fileState.set(this, {
    name: `${fileName}`,
    lastModified: Number.isFinite(modified) ? Math.trunc(modified) : Date.now(),
    webkitRelativePath: "",
  });
}
registerNativeFunction(File, "File");

export function FileReader() {
  if (!new.target) throw new TypeError("Constructor FileReader requires 'new'");
  initializeEventTarget(this);
  readerState.set(this, {
    readyState: 0,
    result: null,
    error: null,
    operation: 0,
    handlers: new Map(),
  });
}
registerNativeFunction(FileReader, "FileReader");

export function fileProperty(file, name) {
  const state = requireFile(file);
  if (name === "lastModifiedDate") return new Date(state.lastModified);
  return state[name];
}

export function readerProperty(reader, name) {
  return requireReader(reader)[name];
}

export function readerHandler(reader, name) {
  return requireReader(reader).handlers.get(name) ?? null;
}

export function setReaderHandler(reader, name, value) {
  requireReader(reader).handlers.set(name, typeof value === "function" ? value : null);
}

export function readerAbort(reader) {
  const state = requireReader(reader);
  if (state.readyState !== 1) {
    state.result = null;
    return;
  }
  state.operation += 1;
  state.readyState = 2;
  state.result = null;
  dispatch(reader, "abort");
  dispatch(reader, "loadend");
}

export function readerReadAsArrayBuffer(reader, blob) {
  startRead(reader, blob, bytes =>
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
}

export function readerReadAsBinaryString(reader, blob) {
  startRead(reader, blob, bytes =>
    [...bytes].map(value => String.fromCharCode(value)).join(""));
}

export function readerReadAsDataURL(reader, blob) {
  const blobRecord = requireBlob(blob);
  startRead(reader, blob, bytes => {
    const binary = [...bytes].map(value => String.fromCharCode(value)).join("");
    return `data:${blobRecord.type};base64,${btoa(binary)}`;
  });
}

export function readerReadAsText(reader, blob) {
  startRead(reader, blob, decodeUtf8);
}

function startRead(reader, blob, convert) {
  const state = requireReader(reader);
  if (state.readyState === 1) {
    throw new DOMException("The object is already busy reading Blobs.", "InvalidStateError");
  }
  const bytes = requireBlob(blob).bytes.slice();
  state.readyState = 1;
  state.result = null;
  state.error = null;
  state.operation += 1;
  const operation = state.operation;
  dispatch(reader, "loadstart");
  Promise.resolve().then(() => {
    if (state.operation !== operation) return;
    try {
      state.result = convert(bytes);
      state.readyState = 2;
      dispatch(reader, "progress");
      dispatch(reader, "load");
    } catch (error) {
      state.error = error;
      state.result = null;
      state.readyState = 2;
      dispatch(reader, "error");
    }
    dispatch(reader, "loadend");
  });
}

function dispatch(reader, type) {
  const event = new Event(type);
  reader.dispatchEvent(event);
  const handler = requireReader(reader).handlers.get(`on${type}`) ?? null;
  if (handler !== null) Reflect.apply(handler, reader, [event]);
}

function requireFile(value) {
  const state = fileState.get(value);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

function requireReader(value) {
  const state = readerState.get(value);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

export function installFileInheritance() {
  Object.setPrototypeOf(File.prototype, Blob.prototype);
  Object.setPrototypeOf(File, Blob);
}
