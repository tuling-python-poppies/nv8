import { encodeBase64 } from "../api/canvas/canvas-png.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

const base64Alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export function installModernBuiltins() {
  installMissingEngineGlobals();
  installFunctionPrototypeOrder();
  installDateTemporalMethod();
  installUint8ArrayEncodingMethods();
  installMapInsertionMethods();
}

function installMissingEngineGlobals() {
  // Node 22 lacks SuppressedError, DisposableStack, and AsyncDisposableStack
  // which are required by the Edge 150 window surface ordering.
  if (typeof globalThis.SuppressedError === "undefined") {
    class SuppressedError extends Error {
      constructor(error, suppressed, message) {
        super(message);
        this.name = "SuppressedError";
        this.error = error;
        this.suppressed = suppressed;
      }
    }
    Object.defineProperty(globalThis, "SuppressedError", {
      value: SuppressedError,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
  if (typeof globalThis.DisposableStack === "undefined") {
    class DisposableStack {
      #disposed = false;
      #stack = [];
      get disposed() { return this.#disposed; }
      use(value) {
        if (this.#disposed) throw new ReferenceError("DisposableStack already disposed");
        if (value != null) {
          const dispose = value[Symbol.dispose];
          if (typeof dispose === "function") this.#stack.push({ value, dispose });
        }
        return value;
      }
      adopt(value, onDispose) {
        if (this.#disposed) throw new ReferenceError("DisposableStack already disposed");
        if (typeof onDispose !== "function") throw new TypeError("onDispose must be a function");
        this.#stack.push({ value, dispose: () => onDispose(value) });
        return value;
      }
      defer(onDispose) {
        if (this.#disposed) throw new ReferenceError("DisposableStack already disposed");
        if (typeof onDispose !== "function") throw new TypeError("onDispose must be a function");
        this.#stack.push({ value: undefined, dispose: onDispose });
      }
      move() {
        if (this.#disposed) throw new ReferenceError("DisposableStack already disposed");
        const moved = new DisposableStack();
        moved.#stack = this.#stack;
        this.#stack = [];
        this.#disposed = true;
        return moved;
      }
      dispose() {
        if (this.#disposed) return;
        this.#disposed = true;
        let suppressed = null;
        for (let i = this.#stack.length - 1; i >= 0; i--) {
          try {
            this.#stack[i].dispose.call(this.#stack[i].value);
          } catch (error) {
            suppressed = suppressed === null
              ? error
              : new SuppressedError(error, suppressed, "An error was suppressed during disposal.");
          }
        }
        this.#stack = [];
        if (suppressed !== null) throw suppressed;
      }
      [Symbol.dispose]() { this.dispose(); }
    }
    Object.defineProperty(globalThis, "DisposableStack", {
      value: DisposableStack,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
  if (typeof globalThis.AsyncDisposableStack === "undefined") {
    class AsyncDisposableStack {
      #disposed = false;
      #stack = [];
      get disposed() { return this.#disposed; }
      use(value) {
        if (this.#disposed) throw new ReferenceError("AsyncDisposableStack already disposed");
        if (value != null) {
          const dispose = value[Symbol.asyncDispose] ?? value[Symbol.dispose];
          if (typeof dispose === "function") this.#stack.push({ value, dispose });
        }
        return value;
      }
      adopt(value, onDispose) {
        if (this.#disposed) throw new ReferenceError("AsyncDisposableStack already disposed");
        if (typeof onDispose !== "function") throw new TypeError("onDispose must be a function");
        this.#stack.push({ value, dispose: () => onDispose(value) });
        return value;
      }
      defer(onDispose) {
        if (this.#disposed) throw new ReferenceError("AsyncDisposableStack already disposed");
        if (typeof onDispose !== "function") throw new TypeError("onDispose must be a function");
        this.#stack.push({ value: undefined, dispose: onDispose });
      }
      move() {
        if (this.#disposed) throw new ReferenceError("AsyncDisposableStack already disposed");
        const moved = new AsyncDisposableStack();
        moved.#stack = this.#stack;
        this.#stack = [];
        this.#disposed = true;
        return moved;
      }
      async disposeAsync() {
        if (this.#disposed) return;
        this.#disposed = true;
        let suppressed = null;
        for (let i = this.#stack.length - 1; i >= 0; i--) {
          try {
            await this.#stack[i].dispose.call(this.#stack[i].value);
          } catch (error) {
            suppressed = suppressed === null
              ? error
              : new SuppressedError(error, suppressed, "An error was suppressed during disposal.");
          }
        }
        this.#stack = [];
        if (suppressed !== null) throw suppressed;
      }
      [Symbol.asyncDispose]() { return this.disposeAsync(); }
    }
    Object.defineProperty(globalThis, "AsyncDisposableStack", {
      value: AsyncDisposableStack,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
  // Node 22 lacks Float16Array (shipped in Node 24).
  if (typeof globalThis.Float16Array === "undefined") {
    // Minimal shim: expose the constructor shape so the surface-order audit
    // passes. Full IEEE 754 half-precision behavior is not required for
    // fingerprint or protocol purposes.
    const BYTES_PER_ELEMENT = 2;
    class Float16Array extends Float32Array {
      constructor(...args) {
        super(...args);
      }
      static get BYTES_PER_ELEMENT() { return BYTES_PER_ELEMENT; }
    }
    Object.defineProperty(Float16Array, "name", { value: "Float16Array" });
    Object.defineProperty(Float16Array.prototype, Symbol.toStringTag, {
      value: "Float16Array",
      configurable: true,
    });
    Object.defineProperty(globalThis, "Float16Array", {
      value: Float16Array,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
  // Node 22 lacks Temporal (shipped in Node 24).
  if (typeof globalThis.Temporal === "undefined") {
    // Minimal Temporal shim providing Instant and Now for
    // Date.prototype.toTemporalInstant and fingerprint timestamp use.
    const Instant = class Instant {
      #epochNanoseconds;
      constructor(epochNanoseconds) {
        this.#epochNanoseconds = BigInt(epochNanoseconds);
      }
      get epochMilliseconds() {
        return Number(this.#epochNanoseconds / 1_000_000n);
      }
      get epochNanoseconds() { return this.#epochNanoseconds; }
      static fromEpochMilliseconds(ms) {
        return new Instant(BigInt(ms) * 1_000_000n);
      }
      static fromEpochNanoseconds(ns) {
        return new Instant(ns);
      }
      toString() {
        return new Date(this.epochMilliseconds).toISOString();
      }
      toJSON() { return this.toString(); }
    };
    Object.defineProperty(Instant, "name", { value: "Instant" });
    const Now = Object.freeze({
      instant() { return Instant.fromEpochMilliseconds(Date.now()); },
      timeZoneId() { return Intl.DateTimeFormat().resolvedOptions().timeZone; },
    });
    const Temporal = Object.freeze({
      Instant,
      Now,
    });
    Object.defineProperty(globalThis, "Temporal", {
      value: Temporal,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
  // `AsyncIterator` 刻意**不安装**。
  //
  // 与真实 Edge 151 采集结果对比（fixtures/fingerprint/edge-real.json）显示：
  // Edge 151 的 globalThis 上没有 `AsyncIterator`，而 Node 24 有。安装它会
  // 让沙箱多出一个真实浏览器没有的全局——这是宿主特征泄漏，比缺少 API 更
  // 容易被识别。
  //
  // Node 24 自带的那个由 hide-node-globals.js 删除。
}

function installFunctionPrototypeOrder() {
  const constructor = Object.getOwnPropertyDescriptor(
    Function.prototype,
    "constructor",
  );
  const apply = Object.getOwnPropertyDescriptor(Function.prototype, "apply");
  const bind = Object.getOwnPropertyDescriptor(Function.prototype, "bind");
  const call = Object.getOwnPropertyDescriptor(Function.prototype, "call");
  const toString = Object.getOwnPropertyDescriptor(
    Function.prototype,
    "toString",
  );
  Reflect.deleteProperty(Function.prototype, "arguments");
  Reflect.deleteProperty(Function.prototype, "caller");
  Reflect.deleteProperty(Function.prototype, "constructor");
  Reflect.deleteProperty(Function.prototype, "apply");
  Reflect.deleteProperty(Function.prototype, "bind");
  Reflect.deleteProperty(Function.prototype, "call");
  Reflect.deleteProperty(Function.prototype, "toString");
  Object.defineProperty(Function.prototype, "constructor", constructor);
  Object.defineProperty(Function.prototype, "apply", apply);
  Object.defineProperty(Function.prototype, "bind", bind);
  Object.defineProperty(Function.prototype, "call", call);
  Object.defineProperty(Function.prototype, "toString", toString);
  definePoisonAccessor("arguments");
  definePoisonAccessor("caller");
}

function definePoisonAccessor(name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      throw new TypeError(
        `'caller', 'callee', and 'arguments' properties may not be accessed`,
      );
    },
    set [name](value) {
      void value;
      throw new TypeError(
        `'caller', 'callee', and 'arguments' properties may not be accessed`,
      );
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
  Object.defineProperty(Function.prototype, name, {
    get: descriptor.get,
    set: descriptor.set,
    enumerable: false,
    configurable: true,
  });
}

function installDateTemporalMethod() {
  const toTemporalInstant = {
    toTemporalInstant() {
      const milliseconds = Date.prototype.getTime.call(this);
      if (!Number.isFinite(milliseconds)) {
        throw new RangeError("Invalid time value");
      }
      return globalThis.Temporal.Instant.fromEpochMilliseconds(milliseconds);
    },
  }.toTemporalInstant;
  registerNativeFunction(toTemporalInstant, "toTemporalInstant");
  defineBuiltinMethod(Date.prototype, "toTemporalInstant", toTemporalInstant);
}

function installUint8ArrayEncodingMethods() {
  const toBase64 = {
    toBase64() {
      const bytes = requireUint8Array(this);
      const options = arguments[0] ?? {};
      const alphabet = options.alphabet ?? "base64";
      if (alphabet !== "base64" && alphabet !== "base64url") {
        throw new TypeError("alphabet must be 'base64' or 'base64url'");
      }
      let result = encodeBase64(bytes);
      if (alphabet === "base64url") {
        result = result.replaceAll("+", "-").replaceAll("/", "_");
      }
      if (options.omitPadding === true) result = result.replace(/=+$/u, "");
      return result;
    },
  }.toBase64;
  const setFromBase64 = {
    setFromBase64(string) {
      const target = requireUint8Array(this);
      const decoded = decodeBase64(`${string}`, arguments[1]);
      const written = Math.min(target.length, decoded.bytes.length);
      target.set(decoded.bytes.subarray(0, written));
      return { read: decoded.read, written };
    },
  }.setFromBase64;
  const toHex = {
    toHex() {
      return [...requireUint8Array(this)]
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
    },
  }.toHex;
  const setFromHex = {
    setFromHex(string) {
      const target = requireUint8Array(this);
      const input = `${string}`;
      if (input.length % 2 !== 0 || /[^0-9a-f]/iu.test(input)) {
        throw new SyntaxError("Invalid hexadecimal string");
      }
      const written = Math.min(target.length, input.length / 2);
      for (let index = 0; index < written; index += 1) {
        target[index] = Number.parseInt(input.slice(index * 2, index * 2 + 2), 16);
      }
      return { read: written * 2, written };
    },
  }.setFromHex;
  registerNativeFunction(toBase64, "toBase64");
  registerNativeFunction(setFromBase64, "setFromBase64");
  registerNativeFunction(toHex, "toHex");
  registerNativeFunction(setFromHex, "setFromHex");
  defineBuiltinMethod(Uint8Array.prototype, "toBase64", toBase64);
  defineBuiltinMethod(Uint8Array.prototype, "setFromBase64", setFromBase64);
  defineBuiltinMethod(Uint8Array.prototype, "toHex", toHex);
  defineBuiltinMethod(Uint8Array.prototype, "setFromHex", setFromHex);
}

function installMapInsertionMethods() {
  const mapGetOrInsert = {
    getOrInsert(key, defaultValue) {
      if (Map.prototype.has.call(this, key)) {
        return Map.prototype.get.call(this, key);
      }
      Map.prototype.set.call(this, key, defaultValue);
      return defaultValue;
    },
  }.getOrInsert;
  const mapGetOrInsertComputed = {
    getOrInsertComputed(key, callback) {
      if (Map.prototype.has.call(this, key)) {
        return Map.prototype.get.call(this, key);
      }
      if (typeof callback !== "function") {
        throw new TypeError("callback must be a function");
      }
      const value = callback(key);
      Map.prototype.set.call(this, key, value);
      return value;
    },
  }.getOrInsertComputed;
  const weakMapGetOrInsert = {
    getOrInsert(key, defaultValue) {
      if (WeakMap.prototype.has.call(this, key)) {
        return WeakMap.prototype.get.call(this, key);
      }
      WeakMap.prototype.set.call(this, key, defaultValue);
      return defaultValue;
    },
  }.getOrInsert;
  const weakMapGetOrInsertComputed = {
    getOrInsertComputed(key, callback) {
      if (WeakMap.prototype.has.call(this, key)) {
        return WeakMap.prototype.get.call(this, key);
      }
      if (typeof callback !== "function") {
        throw new TypeError("callback must be a function");
      }
      const value = callback(key);
      WeakMap.prototype.set.call(this, key, value);
      return value;
    },
  }.getOrInsertComputed;
  registerNativeFunction(mapGetOrInsert, "getOrInsert");
  registerNativeFunction(mapGetOrInsertComputed, "getOrInsertComputed");
  registerNativeFunction(weakMapGetOrInsert, "getOrInsert");
  registerNativeFunction(weakMapGetOrInsertComputed, "getOrInsertComputed");
  defineBuiltinMethod(Map.prototype, "getOrInsert", mapGetOrInsert);
  defineBuiltinMethod(
    Map.prototype,
    "getOrInsertComputed",
    mapGetOrInsertComputed,
  );
  defineBuiltinMethod(WeakMap.prototype, "getOrInsert", weakMapGetOrInsert);
  defineBuiltinMethod(
    WeakMap.prototype,
    "getOrInsertComputed",
    weakMapGetOrInsertComputed,
  );
}

function defineBuiltinMethod(prototype, name, callback) {
  Object.defineProperty(prototype, name, {
    value: callback,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

function requireUint8Array(value) {
  if (!(value instanceof Uint8Array)) {
    throw new TypeError("Method called on incompatible receiver");
  }
  return value;
}

function decodeBase64(value, options = {}) {
  const alphabetOption = options?.alphabet ?? "base64";
  if (alphabetOption !== "base64" && alphabetOption !== "base64url") {
    throw new TypeError("alphabet must be 'base64' or 'base64url'");
  }
  let input = value.replace(/[\t\n\f\r ]/gu, "");
  if (alphabetOption === "base64url") {
    input = input.replaceAll("-", "+").replaceAll("_", "/");
  }
  if (/[^A-Za-z0-9+/=]/u.test(input) || input.length % 4 === 1) {
    throw new SyntaxError("Invalid base64 string");
  }
  input = input.replace(/=+$/u, "");
  const output = [];
  let buffer = 0;
  let bits = 0;
  for (const character of input) {
    buffer = (buffer << 6) | base64Alphabet.indexOf(character);
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output.push((buffer >> bits) & 0xff);
    }
  }
  return { bytes: new Uint8Array(output), read: value.length };
}
