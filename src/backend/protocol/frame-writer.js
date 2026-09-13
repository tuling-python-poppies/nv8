import { Buffer } from "node:buffer";
import {
  DEFAULT_PROTOCOL_LIMITS,
  FRAME_HEADER_BYTES,
  FRAME_MAGIC,
  PROTOCOL_VERSION,
} from "./constants.js";
import { ProtocolError } from "./protocol-error.js";
import { encodeValueWithPrefix } from "./value-encoder.js";

export function encodeFrame(opcode, requestId, payload, options = {}) {
  const limits = { ...DEFAULT_PROTOCOL_LIMITS, ...options };
  if (!Number.isInteger(opcode) || opcode < 0 || opcode > 0xffff) {
    throw new ProtocolError("Opcode must be an unsigned 16-bit integer");
  }
  if (!Number.isInteger(requestId) || requestId < 0 || requestId > 0xffffffff) {
    throw new ProtocolError("Request ID must be an unsigned 32-bit integer");
  }
  if (!(payload instanceof Uint8Array)) {
    throw new ProtocolError("Frame payload must be bytes");
  }
  if (payload.byteLength > limits.maxPayloadBytes) {
    throw new ProtocolError(
      "Frame payload exceeds the configured limit",
      "LIMIT_PAYLOAD_BYTES",
    );
  }

  const frame = Buffer.allocUnsafe(FRAME_HEADER_BYTES + payload.byteLength);
  writeFrameHeader(frame, opcode, requestId, payload.byteLength);
  Buffer.from(payload.buffer, payload.byteOffset, payload.byteLength).copy(
    frame,
    FRAME_HEADER_BYTES,
  );
  return frame;
}

/**
 * Encode a value directly into a framed buffer with zero intermediate copies.
 * The ValueWriter reserves FRAME_HEADER_BYTES at the start, then we write the
 * header into that reserved prefix.
 */
export function encodeFramedValue(opcode, requestId, value, options = {}) {
  const limits = { ...DEFAULT_PROTOCOL_LIMITS, ...options };
  if (!Number.isInteger(opcode) || opcode < 0 || opcode > 0xffff) {
    throw new ProtocolError("Opcode must be an unsigned 16-bit integer");
  }
  if (!Number.isInteger(requestId) || requestId < 0 || requestId > 0xffffffff) {
    throw new ProtocolError("Request ID must be an unsigned 32-bit integer");
  }
  const writer = encodeValueWithPrefix(value, FRAME_HEADER_BYTES, limits);
  const frame = writer.finishWithPrefix();
  const payloadLength = frame.length - FRAME_HEADER_BYTES;
  if (payloadLength > limits.maxPayloadBytes) {
    throw new ProtocolError(
      "Frame payload exceeds the configured limit",
      "LIMIT_PAYLOAD_BYTES",
    );
  }
  writeFrameHeader(frame, opcode, requestId, payloadLength);
  return frame;
}

function writeFrameHeader(buffer, opcode, requestId, payloadLength) {
  buffer.writeUInt32BE(FRAME_MAGIC, 0);
  buffer.writeUInt16BE(PROTOCOL_VERSION, 4);
  buffer.writeUInt16BE(opcode, 6);
  buffer.writeUInt32BE(requestId, 8);
  buffer.writeUInt32BE(payloadLength, 12);
}
