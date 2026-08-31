const transferHandlers = new Set();

export function registerStructuredCloneTransferHandler(handler) {
  transferHandlers.add(handler);
}

export function performStructuredClone(value, options) {
  return performStructuredCloneDetailed(value, options).value;
}

export function performStructuredCloneDetailed(value, options) {
  const transfers = parseTransferList(options);
  const seen = new Map();
  const replacements = new Map(transfers.map(entry => [entry.source, entry.replacement]));
  const cloned = cloneValue(value, seen, replacements);
  for (const entry of transfers) entry.commit();
  return {
    value: cloned,
    transferred: transfers.map(entry => entry.replacement),
  };
}

function parseTransferList(options) {
  if (options === undefined || options === null || options.transfer === undefined) {
    return [];
  }
  const transfers = [];
  const seen = new Set();
  for (const value of options.transfer) {
    if (seen.has(value)) {
      dataCloneError("Transfer list contains duplicate transferable values.");
    }
    let entry;
    if (isArrayBuffer(value)) {
      let replacement;
      try {
        replacement = copyArrayBuffer(value);
      } catch {
        dataCloneError("Transfer list contains a detached ArrayBuffer.");
      }
      entry = {
        source: value,
        replacement,
        commit() {
          try {
            ArrayBuffer.prototype.transfer.call(value, 0);
          } catch {
            dataCloneError("An ArrayBuffer in the transfer list could not be detached.");
          }
        },
      };
    } else {
      const handler = [...transferHandlers].find(candidate =>
        candidate.canTransfer(value));
      if (handler === undefined) {
        dataCloneError("The transfer list contains a non-transferable value.");
      }
      entry = handler.prepare(value);
    }
    seen.add(value);
    transfers.push(entry);
  }
  return transfers;
}

function cloneValue(value, seen, transfers) {
  if (
    value === null
    || typeof value === "undefined"
    || typeof value === "boolean"
    || typeof value === "number"
    || typeof value === "string"
    || typeof value === "bigint"
  ) {
    return value;
  }
  if (typeof value === "symbol" || typeof value === "function") {
    dataCloneError("The value could not be cloned.");
  }
  const known = seen.get(value);
  if (known !== undefined) {
    return known;
  }
  const transferred = transfers.get(value);
  if (transferred !== undefined) {
    seen.set(value, transferred);
    return transferred;
  }
  for (const handler of transferHandlers) {
    if (handler.isTransferable(value)) {
      dataCloneError("A transferable value was not listed in the transfer list.");
    }
  }
  if (isArrayBuffer(value)) {
    let output;
    try {
      output = copyArrayBuffer(value);
    } catch {
      dataCloneError("A detached ArrayBuffer could not be cloned.");
    }
    seen.set(value, output);
    return output;
  }
  if (ArrayBuffer.isView(value)) {
    return cloneView(value, seen, transfers);
  }
  if (objectTag(value) === "[object Date]") {
    const output = new Date(Date.prototype.getTime.call(value));
    seen.set(value, output);
    return output;
  }
  if (objectTag(value) === "[object RegExp]") {
    const output = new RegExp(
      Reflect.apply(
        Object.getOwnPropertyDescriptor(RegExp.prototype, "source").get,
        value,
        [],
      ),
      Reflect.apply(
        Object.getOwnPropertyDescriptor(RegExp.prototype, "flags").get,
        value,
        [],
      ),
    );
    seen.set(value, output);
    return output;
  }
  if (objectTag(value) === "[object Map]") {
    const output = new Map();
    seen.set(value, output);
    for (const [key, item] of Map.prototype.entries.call(value)) {
      output.set(
        cloneValue(key, seen, transfers),
        cloneValue(item, seen, transfers),
      );
    }
    return output;
  }
  if (objectTag(value) === "[object Set]") {
    const output = new Set();
    seen.set(value, output);
    for (const item of Set.prototype.values.call(value)) {
      output.add(cloneValue(item, seen, transfers));
    }
    return output;
  }
  if (typeof DOMException === "function" && value instanceof DOMException) {
    const output = new DOMException(value.message, value.name);
    seen.set(value, output);
    return output;
  }
  if (value instanceof Error) {
    const output = new Error(value.message);
    output.name = value.name;
    seen.set(value, output);
    if (value.cause !== undefined) {
      output.cause = cloneValue(value.cause, seen, transfers);
    }
    cloneEnumerableProperties(value, output, seen, transfers);
    return output;
  }
  if (value instanceof WeakMap || value instanceof WeakSet || value instanceof Promise) {
    dataCloneError("The value could not be cloned.");
  }
  const output = Array.isArray(value) ? new Array(value.length) : {};
  seen.set(value, output);
  cloneEnumerableProperties(value, output, seen, transfers);
  return output;
}

function cloneView(value, seen, transfers) {
  const clonedBuffer = cloneValue(value.buffer, seen, transfers);
  let output;
  const tag = objectTag(value);
  if (tag === "[object DataView]") {
    output = new DataView(clonedBuffer, value.byteOffset, value.byteLength);
  } else {
    const constructor = typedArrayConstructor(tag);
    if (constructor === null) dataCloneError("Unsupported typed array.");
    output = new constructor(
      clonedBuffer,
      value.byteOffset,
      value.length,
    );
  }
  seen.set(value, output);
  return output;
}

function cloneEnumerableProperties(source, target, seen, transfers) {
  for (const key of Object.keys(source)) {
    target[key] = cloneValue(source[key], seen, transfers);
  }
}

function dataCloneError(message) {
  throw new DOMException(message, "DataCloneError");
}

function isArrayBuffer(value) {
  if (value === null || typeof value !== "object") return false;
  try {
    new Uint8Array(value);
    return objectTag(value) === "[object ArrayBuffer]";
  } catch {
    return false;
  }
}

function copyArrayBuffer(value) {
  const source = new Uint8Array(value);
  const output = new ArrayBuffer(source.byteLength);
  new Uint8Array(output).set(source);
  return output;
}

function objectTag(value) {
  return Object.prototype.toString.call(value);
}

function typedArrayConstructor(tag) {
  return {
    "[object Int8Array]": Int8Array,
    "[object Uint8Array]": Uint8Array,
    "[object Uint8ClampedArray]": Uint8ClampedArray,
    "[object Int16Array]": Int16Array,
    "[object Uint16Array]": Uint16Array,
    "[object Int32Array]": Int32Array,
    "[object Uint32Array]": Uint32Array,
    "[object Float32Array]": Float32Array,
    "[object Float64Array]": Float64Array,
    "[object BigInt64Array]": BigInt64Array,
    "[object BigUint64Array]": BigUint64Array,
  }[tag] ?? null;
}
