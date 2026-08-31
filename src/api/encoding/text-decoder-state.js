import { decodeBytes, streamingPrefixLength } from "./utf-codec.js";

const decoderState = new WeakMap();

export function initializeTextDecoder(value, label, options) {
  decoderState.set(value, {
    encoding: canonicalEncoding(label),
    fatal: Boolean(options?.fatal),
    ignoreBOM: Boolean(options?.ignoreBOM),
    pending: [],
    bomSeen: false,
  });
}

export function requireTextDecoder(value) {
  const state = decoderState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function decodeText(value, input, options) {
  const state = requireTextDecoder(value);
  const incoming = bytesFromInput(input);
  const combined = [...state.pending, ...incoming];
  const streaming = Boolean(options?.stream);
  const prefixLength = streaming
    ? streamingPrefixLength(state.encoding, combined)
    : combined.length;
  const ready = combined.slice(0, prefixLength);
  state.pending = streaming ? combined.slice(prefixLength) : [];
  const output = decodeBytes(
    state.encoding,
    ready,
    state.fatal,
    state.ignoreBOM || state.bomSeen,
  );
  if (ready.length > 0) {
    state.bomSeen = true;
  }
  return output;
}

function canonicalEncoding(label) {
  const normalized = `${label}`.trim().toLowerCase();
  if (["utf-8", "utf8", "unicode-1-1-utf-8"].includes(normalized)) {
    return "utf-8";
  }
  if (["utf-16", "utf-16le", "unicodefffe"].includes(normalized)) {
    return "utf-16le";
  }
  if (["utf-16be", "unicodefeff"].includes(normalized)) {
    return "utf-16be";
  }
  if ([
    "windows-1252", "cp1252", "ascii", "us-ascii",
    "iso-8859-1", "latin1",
  ].includes(normalized)) {
    return "windows-1252";
  }
  throw new RangeError("The encoding label is not supported");
}

function bytesFromInput(input) {
  if (input === undefined) {
    return [];
  }
  if (ArrayBuffer.isView(input)) {
    return Array.from(
      new Uint8Array(input.buffer, input.byteOffset, input.byteLength),
    );
  }
  if (input instanceof ArrayBuffer) {
    return Array.from(new Uint8Array(input));
  }
  throw new TypeError("input must be an ArrayBuffer or ArrayBufferView");
}
