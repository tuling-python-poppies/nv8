import {
  DEFAULT_PROTOCOL_LIMITS,
  ValueTag,
} from "./constants.js";
import {
  ProtocolError,
  RemoteSandboxError,
} from "./protocol-error.js";

class ValueReader {
  constructor(buffer, limits) {
    this.buffer = buffer;
    this.limits = limits;
    this.offset = 0;
  }

  ensure(length) {
    if (this.offset + length > this.buffer.length) {
      throw new ProtocolError("Truncated protocol value");
    }
  }

  uint8() {
    this.ensure(1);
    const value = this.buffer.readUInt8(this.offset);
    this.offset += 1;
    return value;
  }

  uint32() {
    this.ensure(4);
    const value = this.buffer.readUInt32BE(this.offset);
    this.offset += 4;
    return value;
  }

  int64() {
    this.ensure(8);
    const value = this.buffer.readBigInt64BE(this.offset);
    this.offset += 8;
    const number = Number(value);
    if (!Number.isSafeInteger(number)) {
      throw new ProtocolError("Integer is outside the JavaScript safe range");
    }
    return number;
  }

  double() {
    this.ensure(8);
    const value = this.buffer.readDoubleBE(this.offset);
    this.offset += 8;
    return value;
  }

  rawString() {
    const length = this.uint32();
    if (length > this.limits.maxStringBytes) {
      throw new ProtocolError(
        "String exceeds the configured limit",
        "LIMIT_STRING_BYTES",
      );
    }
    this.ensure(length);
    const value = this.buffer.toString("utf8", this.offset, this.offset + length);
    this.offset += length;
    return value;
  }

  value(depth) {
    if (depth > this.limits.maxValueDepth) {
      throw new ProtocolError(
        "Value nesting exceeds the configured limit",
        "LIMIT_VALUE_DEPTH",
      );
    }
    const tag = this.uint8();
    switch (tag) {
      case ValueTag.UNDEFINED:
        return undefined;
      case ValueTag.NULL:
        return null;
      case ValueTag.FALSE:
        return false;
      case ValueTag.TRUE:
        return true;
      case ValueTag.SIGNED_INTEGER:
        return this.int64();
      case ValueTag.DOUBLE:
        return this.double();
      case ValueTag.STRING:
        return this.rawString();
      case ValueTag.BYTES:
        return this.bytes();
      case ValueTag.ARRAY:
        return this.array(depth);
      case ValueTag.RECORD:
        return this.record(depth);
      case ValueTag.EVALUATION_RESULT:
        return this.record(depth);
      case ValueTag.ERROR:
        return new RemoteSandboxError(this.record(depth));
      case ValueTag.TRACE_ENTRY:
        return this.record(depth);
      default:
        throw new ProtocolError(`Unknown value tag: ${tag}`);
    }
  }

  bytes() {
    const length = this.uint32();
    if (length > this.limits.maxBytesLength) {
      throw new ProtocolError(
        "Byte sequence exceeds the configured limit",
        "LIMIT_BYTES",
      );
    }
    this.ensure(length);
    const value = new Uint8Array(
      this.buffer.buffer,
      this.buffer.byteOffset + this.offset,
      length,
    ).slice();
    this.offset += length;
    return value;
  }

  array(depth) {
    const length = this.uint32();
    if (length > this.limits.maxArrayLength) {
      throw new ProtocolError(
        "Array exceeds the configured limit",
        "LIMIT_ARRAY_LENGTH",
      );
    }
    const value = new Array(length);
    for (let index = 0; index < length; index += 1) {
      value[index] = this.value(depth + 1);
    }
    return value;
  }

  record(depth) {
    const fieldCount = this.uint32();
    if (fieldCount > this.limits.maxFieldCount) {
      throw new ProtocolError(
        "Record field count exceeds the configured limit",
        "LIMIT_FIELD_COUNT",
      );
    }
    const value = Object.create(null);
    for (let index = 0; index < fieldCount; index += 1) {
      const key = this.rawString();
      if (Object.hasOwn(value, key)) {
        throw new ProtocolError(`Duplicate record field: ${key}`);
      }
      value[key] = this.value(depth + 1);
    }
    return value;
  }
}

export function decodeValue(buffer, options = {}) {
  const limits = { ...DEFAULT_PROTOCOL_LIMITS, ...options };
  if (buffer.length > limits.maxPayloadBytes) {
    throw new ProtocolError(
      "Payload exceeds the configured limit",
      "LIMIT_PAYLOAD_BYTES",
    );
  }
  const reader = new ValueReader(buffer, limits);
  const value = reader.value(0);
  if (reader.offset !== buffer.length) {
    throw new ProtocolError("Trailing bytes after protocol value");
  }
  return value;
}
