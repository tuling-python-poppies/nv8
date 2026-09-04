export function hideNodeGlobals() {
  // AsyncIterator 是 Node 24 的 V8 特性，真实 Edge 151 没有这个全局。
  // 留着它等于给沙箱盖上"我是 Node"的戳。
  delete globalThis.AsyncIterator;
  delete globalThis.process;
  delete globalThis.require;
  delete globalThis.module;
  delete globalThis.exports;
  delete globalThis.Buffer;
  delete globalThis.global;
  delete globalThis.GLOBAL;
  delete globalThis.root;
  delete globalThis.__dirname;
  delete globalThis.__filename;
  delete globalThis.setImmediate;
  delete globalThis.clearImmediate;
  delete globalThis.AsyncLocalStorage;
  delete globalThis.MessagePort;
  delete globalThis.BroadcastChannel;
  delete globalThis.SharedArrayBuffer;
  delete globalThis.fetch;
  delete globalThis.Headers;
  delete globalThis.Request;
  delete globalThis.Response;
  delete globalThis.FormData;
  delete globalThis.Blob;
  delete globalThis.File;
  delete globalThis.URL;
  delete globalThis.URLSearchParams;
  delete globalThis.TextEncoder;
  delete globalThis.TextDecoder;
  delete globalThis.performance;
  delete globalThis.crypto;
  delete globalThis.navigator;
  delete globalThis.structuredClone;
  delete globalThis.CompressionStream;
  delete globalThis.DecompressionStream;
  delete globalThis.ReadableStream;
  delete globalThis.WritableStream;
  delete globalThis.TransformStream;
  delete globalThis.DOMException;
  delete globalThis.Event;
  delete globalThis.EventTarget;
}
