import { encodeBase64 } from "../api/canvas/canvas-png.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

const base64Alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export function installModernBuiltins() {
  installMissingEngineGlobals();
  installFloat16DataViewMethods();
  installFunctionPrototypeOrder();
  installDateTemporalMethod();
  installUint8ArrayEncodingMethods();
  installMapInsertionMethods();
}

/**
 * Node 20 以下缺 `Symbol.dispose` / `Symbol.asyncDispose`（V8 13 才有）。
 *
 * 必须**先于** DisposableStack 的 shim 安装，否则 `[Symbol.dispose]() {}` 里的
 * 计算键会取到 `undefined`，被 ToPropertyKey 转成**字符串 `"undefined"`**。
 * 后果是 `DisposableStack.prototype` 上多出一个真实浏览器绝不会有的字符串键，
 * 而符号键少两个——`edge-member-parity` 正是这样抓到
 * `DisposableStack.undefined` 的。多出的成员比缺少的危险：它是宿主特征泄漏。
 *
 * 描述符按 well-known symbol 的形状：三个 false。
 */
function installDisposeSymbols() {
  for (const name of ["dispose", "asyncDispose"]) {
    if (typeof Symbol[name] === "symbol") continue;
    Object.defineProperty(Symbol, name, {
      value: Symbol(`Symbol.${name}`),
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }
}

/**
 * 把 shim 类原型上的方法与访问器登记为原生函数。
 *
 * 不登记的话 `DisposableStack.prototype.use.toString()` 会吐出这里的 JS 源码，
 * 而真实浏览器给 `function use() { [native code] }`。这是最经典的检测手法，
 * 不能因为「只有 Node 18–22 才走 shim」就放过——支持矩阵里声明了这些版本。
 *
 * 只遍历字符串键：这些原型上的符号键成员（`Symbol.dispose` /
 * `Symbol.asyncDispose`）按规范就是对应字符串键方法的**同一个函数对象**，
 * 名字也随之是 `dispose` / `disposeAsync`。所以由 `aliasSymbolMethod()`
 * 在登记之后做别名，不需要单独登记。
 *
 * @param {object} prototype
 */
function registerShimPrototype(prototype) {
  for (const key of Object.getOwnPropertyNames(prototype)) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
    // `constructor` 的函数名是类名而不是 "constructor"，照抄真实形状，
    // 否则 `DisposableStack.toString()` 会说自己叫 constructor。
    const label = key === "constructor"
      ? (descriptor.value?.name ?? "constructor")
      : key;
    if (typeof descriptor.value === "function") {
      registerNativeFunction(descriptor.value, label);
    }
    if (typeof descriptor.get === "function") {
      registerNativeGetter(descriptor.get, label);
    }
    if (typeof descriptor.set === "function") {
      registerNativeFunction(descriptor.set, `set ${label}`);
    }
  }
}

/**
 * 把符号键指向已有的字符串键方法（同一个函数对象）。
 *
 * 实测 Node 24 原生实现：
 * `DisposableStack.prototype[Symbol.dispose] === DisposableStack.prototype.dispose`
 * 为 true，因此 `[Symbol.dispose].name` 是 `"dispose"` 而不是
 * `"[Symbol.dispose]"`。
 *
 * 这条只能靠实测。原来在类体里写 `[Symbol.dispose]() { this.dispose(); }`
 * 会造出**第二个**函数对象，identity 比较为 false、`toString` 的名字也不一样
 * ——两处都是可检测偏差，而形状层（成员计数）完全看不出来。
 *
 * @param {object} prototype
 * @param {symbol} symbolKey
 * @param {string} methodName
 */
function aliasSymbolMethod(prototype, symbolKey, methodName) {
  defineBuiltinMethod(prototype, symbolKey, prototype[methodName]);
}

function installMissingEngineGlobals() {
  installDisposeSymbols();
  // Node 22 lacks SuppressedError, DisposableStack, and AsyncDisposableStack
  // which are required by the Edge 150 window surface ordering.
  if (typeof globalThis.SuppressedError === "undefined") {
    class SuppressedError extends Error {
      constructor(error, suppressed, message) {
        super(message);
        this.error = error;
        this.suppressed = suppressed;
      }
    }
    // 真实 SuppressedError.prototype 的自有成员恰好是
    // `constructor` / `message` / `name` 三个（实测 Edge 151）。
    // 原来在构造器里写 `this.name = ...` 只会落在**实例**上，原型仍只有
    // `constructor`——比对时表现为缺 2 个成员。
    defineBuiltinMethod(SuppressedError.prototype, "name", "SuppressedError");
    defineBuiltinMethod(SuppressedError.prototype, "message", "");
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
    }
    // 真实 DisposableStack.prototype 有 7 个字符串成员与 **2 个符号成员**
    // （`Symbol.dispose` 与 `Symbol.toStringTag`）。少了 toStringTag 会让
    // `Object.prototype.toString.call(stack)` 变成 `[object Object]`。
    defineSymbolTag(DisposableStack.prototype, "DisposableStack");
    registerShimPrototype(DisposableStack.prototype);
    aliasSymbolMethod(DisposableStack.prototype, Symbol.dispose, "dispose");
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
    }
    defineSymbolTag(AsyncDisposableStack.prototype, "AsyncDisposableStack");
    registerShimPrototype(AsyncDisposableStack.prototype);
    aliasSymbolMethod(
      AsyncDisposableStack.prototype,
      Symbol.asyncDispose,
      "disposeAsync",
    );
    Object.defineProperty(globalThis, "AsyncDisposableStack", {
      value: AsyncDisposableStack,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
  // Node 22 lacks Float16Array (shipped in Node 24).
  if (typeof globalThis.Float16Array === "undefined") {
    // 只补构造器形状；不做真正的半精度存储（指纹与协议都用不到）。
    //
    // 真实 `Float16Array.prototype` 的自有成员是
    // `BYTES_PER_ELEMENT` + `constructor`，**没有** `Symbol.toStringTag`
    // （它是 `%TypedArray%.prototype` 上的 getter）。原来这里显式装了一个
    // toStringTag，于是成员计数是 1 个字符串 + 1 个符号，而真实是 2 + 0。
    //
    // 代价：`Object.prototype.toString.call(new Float16Array(1))` 会给
    // `[object Float32Array]`。取形状一致而不是标签一致——形状进对等性比对，
    // 标签只在极少数探针里出现，且这条只影响 Node 18–22。
    const BYTES_PER_ELEMENT = 2;
    class Float16Array extends Float32Array {
      constructor(...args) {
        super(...args);
      }
    }
    Object.defineProperty(Float16Array, "name", { value: "Float16Array" });
    for (const target of [Float16Array, Float16Array.prototype]) {
      Object.defineProperty(target, "BYTES_PER_ELEMENT", {
        value: BYTES_PER_ELEMENT,
        writable: false,
        enumerable: false,
        configurable: false,
      });
    }
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

/** `Symbol.toStringTag` 的原生形状：只读、不可枚举、可配置。 */
function defineSymbolTag(prototype, tag) {
  Object.defineProperty(prototype, Symbol.toStringTag, {
    value: tag,
    writable: false,
    enumerable: false,
    configurable: true,
  });
}

/**
 * Node 22 以下缺 `DataView.prototype.getFloat16` / `setFloat16`
 * （半精度随 Float16Array 一起在 Node 24 才有）。
 *
 * 与 `Float16Array` 的处理不同，这两个方法**做真实的 IEEE 754 binary16
 * 编解码**：DataView 的读写结果会直接进入协议字节，给个近似值等于静默产出
 * 错误数据。Float16Array 只需要形状，因为没人拿它算签名。
 */
function installFloat16DataViewMethods() {
  if (typeof DataView.prototype.getFloat16 === "function") return;

  const getFloat16 = {
    getFloat16(byteOffset) {
      // 第二个参数（littleEndian）走 arguments：真实 length 是 1，
      // 写成形参会变成 2，而 length 已经被 WebIDL 实参检查当作权威来源。
      const bits = DataView.prototype.getUint16.call(
        this,
        byteOffset,
        arguments[1],
      );
      return decodeFloat16(bits);
    },
  }.getFloat16;
  const setFloat16 = {
    setFloat16(byteOffset, value) {
      DataView.prototype.setUint16.call(
        this,
        byteOffset,
        encodeFloat16(value),
        arguments[2],
      );
    },
  }.setFloat16;

  registerNativeFunction(getFloat16, "getFloat16");
  registerNativeFunction(setFloat16, "setFloat16");
  defineBuiltinMethod(DataView.prototype, "getFloat16", getFloat16);
  defineBuiltinMethod(DataView.prototype, "setFloat16", setFloat16);
}

/** binary16 位模式 → Number。 */
function decodeFloat16(bits) {
  const sign = (bits & 0x8000) === 0 ? 1 : -1;
  const exponent = (bits >> 10) & 0x1f;
  const fraction = bits & 0x03ff;
  if (exponent === 0) return sign * fraction * 2 ** -24;
  if (exponent === 0x1f) return fraction === 0 ? sign * Infinity : NaN;
  return sign * (fraction + 0x0400) * 2 ** (exponent - 25);
}

/**
 * Number → binary16 位模式。
 *
 * 舍入必须是 **round-to-nearest, ties-to-even**，和硬件一致。用
 * `Math.round` 会在正中间统一往上取，于是 2049 这类值的最后一位错掉——
 * 单个 bit 的偏差在字节流里表现成「偶尔算出来的签名不对」，极难定位。
 */
function encodeFloat16(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return 0x7e00;
  const sign = (number < 0 || Object.is(number, -0)) ? 0x8000 : 0;
  const magnitude = Math.abs(number);
  if (magnitude === 0) return sign;
  // 65520 是 65504（最大有限半精度）与 65536 的正中点，ties-to-even 取到
  // 无穷。所以边界是 >=，不是 >。
  if (magnitude >= 65520) return sign | 0x7c00;
  if (magnitude < 2 ** -14) {
    // 非规格化数。取整后若达到 1024 就自然进位成最小的规格化数，
    // 位模式恰好等于 1024，不需要特殊分支。
    return sign | roundTiesToEven(magnitude / 2 ** -24);
  }
  let exponent = Math.floor(Math.log2(magnitude));
  // log2 在边界上有舍入误差，钳一下比信任它更可靠。
  if (magnitude / 2 ** exponent >= 2) exponent += 1;
  if (magnitude / 2 ** exponent < 1) exponent -= 1;
  let fraction = roundTiesToEven(magnitude / 2 ** exponent * 0x0400) - 0x0400;
  if (fraction === 0x0400) {
    fraction = 0;
    exponent += 1;
  }
  if (exponent > 15) return sign | 0x7c00;
  return sign | ((exponent + 15) << 10) | fraction;
}

function roundTiesToEven(value) {
  const lower = Math.floor(value);
  const remainder = value - lower;
  if (remainder > 0.5) return lower + 1;
  if (remainder < 0.5) return lower;
  return lower % 2 === 0 ? lower : lower + 1;
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
