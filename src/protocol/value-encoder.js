import { Buffer } from "node:buffer";
import {
  DEFAULT_PROTOCOL_LIMITS,
  ValueTag,
} from "./constants.js";
import { ProtocolError } from "./protocol-error.js";
import { typedValueKind } from "./typed-values.js";

const INITIAL_BUFFER_SIZE = 8192;

class ValueWriter {
  constructor(limits, prefixBytes = 0) {
    this.limits = limits;
    this.prefixBytes = prefixBytes;
    this.buffer = Buffer.allocUnsafe(INITIAL_BUFFER_SIZE);
    this.offset = prefixBytes;
  }

  ensure(bytes) {
    const required = this.offset + bytes;
    if (required <= this.buffer.length) return;
    let nextSize = this.buffer.length * 2;
    while (nextSize < required) nextSize *= 2;
    const next = Buffer.allocUnsafe(nextSize);
    this.buffer.copy(next, 0, 0, this.offset);
    this.buffer = next;
  }

  checkLimit() {
    if (this.offset > this.limits.maxPayloadBytes) {
      throw new ProtocolError("Encoded payload exceeds the configured limit");
    }
  }

  uint8(value) {
    this.ensure(1);
    this.buffer[this.offset++] = value;
    this.checkLimit();
  }

  uint32(value) {
    this.ensure(4);
    this.buffer.writeUInt32BE(value, this.offset);
    this.offset += 4;
    this.checkLimit();
  }

  int64(value) {
    this.ensure(8);
    this.buffer.writeBigInt64BE(BigInt(value), this.offset);
    this.offset += 8;
    this.checkLimit();
  }

  double(value) {
    this.ensure(8);
    this.buffer.writeDoubleBE(value, this.offset);
    this.offset += 8;
    this.checkLimit();
  }

  appendBytes(source) {
    this.ensure(source.length);
    source.copy
      ? source.copy(this.buffer, this.offset)
      : Buffer.from(source.buffer, source.byteOffset, source.byteLength)
        .copy(this.buffer, this.offset);
    this.offset += source.length;
    this.checkLimit();
  }

  rawString(value) {
    const bytes = Buffer.from(value, "utf8");
    if (bytes.length > this.limits.maxStringBytes) {
      throw new ProtocolError("String exceeds the configured limit");
    }
    this.uint32(bytes.length);
    this.appendBytes(bytes);
  }

  value(value, depth) {
    if (depth > this.limits.maxValueDepth) {
      throw new ProtocolError(
        "Value nesting exceeds the configured limit",
        "LIMIT_VALUE_DEPTH",
      );
    }

    const kind = typedValueKind(value);
    if (kind === "evaluation-result") {
      this.uint8(ValueTag.EVALUATION_RESULT);
      this.recordFields({ type: value.type, value: value.value }, depth + 1);
      return;
    }
    if (kind === "error") {
      this.uint8(ValueTag.ERROR);
      this.recordFields({
        name: value.name,
        message: value.message,
        code: value.code,
        stack: value.stack,
      }, depth + 1);
      return;
    }
    if (kind === "trace-entry") {
      this.uint8(ValueTag.TRACE_ENTRY);
      const fields = { ...value };
      this.recordFields(fields, depth + 1);
      return;
    }

    if (value === undefined) {
      this.uint8(ValueTag.UNDEFINED);
      return;
    }
    if (value === null) {
      this.uint8(ValueTag.NULL);
      return;
    }
    if (value === false) {
      this.uint8(ValueTag.FALSE);
      return;
    }
    if (value === true) {
      this.uint8(ValueTag.TRUE);
      return;
    }
    if (typeof value === "number") {
      if (Number.isSafeInteger(value)) {
        this.uint8(ValueTag.SIGNED_INTEGER);
        this.int64(value);
      } else {
        this.uint8(ValueTag.DOUBLE);
        this.double(value);
      }
      return;
    }
    if (typeof value === "string") {
      this.uint8(ValueTag.STRING);
      this.rawString(value);
      return;
    }
    if (value instanceof Uint8Array) {
      if (value.byteLength > this.limits.maxBytesLength) {
        throw new ProtocolError("Byte sequence exceeds the configured limit");
      }
      this.uint8(ValueTag.BYTES);
      this.uint32(value.byteLength);
      this.appendBytes(Buffer.from(value.buffer, value.byteOffset, value.byteLength));
      return;
    }
    if (Array.isArray(value)) {
      if (value.length > this.limits.maxArrayLength) {
        throw new ProtocolError("Array exceeds the configured limit");
      }
      this.uint8(ValueTag.ARRAY);
      this.uint32(value.length);
      for (const item of value) {
        this.value(item, depth + 1);
      }
      return;
    }
    if (isPlainRecord(value)) {
      this.uint8(ValueTag.RECORD);
      this.recordFields(value, depth + 1);
      return;
    }
    throw new ProtocolError(`Unsupported protocol value: ${typeof value}`);
  }

  recordFields(record, depth) {
    const keys = Object.keys(record);
    if (keys.length > this.limits.maxFieldCount) {
      throw new ProtocolError("Record field count exceeds the configured limit");
    }
    this.uint32(keys.length);
    for (const key of keys) {
      this.rawString(key);
      this.value(record[key], depth + 1);
    }
  }

  finish() {
    return this.buffer.subarray(this.prefixBytes, this.offset);
  }

  finishWithPrefix() {
    return this.buffer.subarray(0, this.offset);
  }
}

function isPlainRecord(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function encodeValue(value, options = {}) {
  const limits = { ...DEFAULT_PROTOCOL_LIMITS, ...options };
  const writer = new ValueWriter(limits);
  writer.value(value, 0);
  return writer.finish();
}

export function encodeValueWithPrefix(value, prefixBytes, options = {}) {
  const limits = { ...DEFAULT_PROTOCOL_LIMITS, ...options };
  const writer = new ValueWriter(limits, prefixBytes);
  writer.value(value, 0);
  return writer;
}
