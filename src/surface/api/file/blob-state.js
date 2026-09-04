import { Blob } from "./blob-constructor.js";

const blobState = new WeakMap();
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const blobRegistrySlot = createRealmSlot(() => ({
  sharedBlobRegistry: null,
}), "blobRegistry");

function blobRegistryState() {
  return blobRegistrySlot.get(globalThis);
}

export function configureBlobRegistry(registry) {
  blobRegistryState().sharedBlobRegistry = registry;
}

export function initializeBlob(blob, parts = [], options = {}) {
  const chunks = [];
  for (const part of parts) appendBlobPart(chunks, part);
  const type = normalizeBlobType(options?.type);
  const state = {
    bytes: concatenate(chunks),
    type,
  };
  blobState.set(blob, state);
  registerSharedBlob(blob, state);
}

export function createBlob(bytes, type = "") {
  const blob = Object.create(Blob.prototype);
  const state = {
    bytes: new Uint8Array(bytes),
    type: normalizeBlobType(type),
  };
  blobState.set(blob, state);
  registerSharedBlob(blob, state);
  return blob;
}

export function requireBlob(blob) {
  const state = blobState.get(blob);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

function registerSharedBlob(blob, state) {
  blobRegistryState().sharedBlobRegistry?.registerBlob(blob, state.bytes, state.type);
}

export function encodeUtf8(value) {
  const bytes = [];
  const string = `${value}`;
  for (let index = 0; index < string.length; index += 1) {
    let point = string.codePointAt(index);
    if (point > 0xffff) index += 1;
    if (point <= 0x7f) {
      bytes.push(point);
    } else if (point <= 0x7ff) {
      bytes.push(0xc0 | (point >>> 6), 0x80 | (point & 0x3f));
    } else if (point <= 0xffff) {
      bytes.push(
        0xe0 | (point >>> 12),
        0x80 | ((point >>> 6) & 0x3f),
        0x80 | (point & 0x3f),
      );
    } else {
      bytes.push(
        0xf0 | (point >>> 18),
        0x80 | ((point >>> 12) & 0x3f),
        0x80 | ((point >>> 6) & 0x3f),
        0x80 | (point & 0x3f),
      );
    }
  }
  return new Uint8Array(bytes);
}

export function decodeUtf8(bytes) {
  let result = "";
  for (let index = 0; index < bytes.length;) {
    const first = bytes[index];
    let point;
    let count;
    if (first <= 0x7f) {
      point = first;
      count = 1;
    } else if ((first & 0xe0) === 0xc0) {
      point = first & 0x1f;
      count = 2;
    } else if ((first & 0xf0) === 0xe0) {
      point = first & 0x0f;
      count = 3;
    } else if ((first & 0xf8) === 0xf0) {
      point = first & 0x07;
      count = 4;
    } else {
      result += "\ufffd";
      index += 1;
      continue;
    }
    if (index + count > bytes.length) {
      result += "\ufffd";
      break;
    }
    let valid = true;
    for (let offset = 1; offset < count; offset += 1) {
      const continuation = bytes[index + offset];
      if ((continuation & 0xc0) !== 0x80) {
        valid = false;
        break;
      }
      point = (point << 6) | (continuation & 0x3f);
    }
    result += valid ? String.fromCodePoint(point) : "\ufffd";
    index += valid ? count : 1;
  }
  return result;
}

function appendBlobPart(chunks, part) {
  if (blobState.has(part)) {
    chunks.push(requireBlob(part).bytes);
  } else if (part instanceof ArrayBuffer) {
    chunks.push(new Uint8Array(part.slice(0)));
  } else if (ArrayBuffer.isView(part)) {
    chunks.push(new Uint8Array(
      part.buffer.slice(part.byteOffset, part.byteOffset + part.byteLength),
    ));
  } else {
    chunks.push(encodeUtf8(part));
  }
}

function concatenate(chunks) {
  const result = new Uint8Array(
    chunks.reduce((length, chunk) => length + chunk.length, 0),
  );
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

function normalizeBlobType(value) {
  const type = value === undefined ? "" : `${value}`;
  for (const character of type) {
    const code = character.charCodeAt(0);
    if (code < 0x20 || code > 0x7e) return "";
  }
  return type.toLowerCase();
}
