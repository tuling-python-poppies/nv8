import { Buffer } from "node:buffer";
import {
  DEFAULT_PROTOCOL_LIMITS,
  FRAME_HEADER_BYTES,
  FRAME_MAGIC,
  PROTOCOL_VERSION,
} from "./constants.js";
import { ProtocolError } from "./protocol-error.js";
import { PROTOCOL_LIMIT_KEYS } from "./limits.js";

export class FrameReader {
  constructor({ onFrame, onError, ...options }) {
    this.onFrame = onFrame;
    this.onError = onError;
    this.limits = { ...DEFAULT_PROTOCOL_LIMITS, ...options };
    this.chunks = [];
    this.totalLength = 0;
    this.failed = false;
  }

  /**
   * 运行期更新限制（INIT 携带用户配置后由 entry 调用）。
   *
   * 只采纳协议限制白名单中的值，避免把任意 options 字段塞进 limits。
   * 已经缓冲的帧会在下一次 drain 时按新限制校验。
   */
  setLimits(options) {
    if (this.failed || options === null || typeof options !== "object") {
      return;
    }
    for (const key of PROTOCOL_LIMIT_KEYS) {
      const value = options[key];
      if (Number.isSafeInteger(value) && value >= 1) {
        this.limits[key] = value;
      }
    }
  }

  push(chunk) {
    if (this.failed || chunk.length === 0) {
      return;
    }
    try {
      this.chunks.push(Buffer.from(chunk));
      this.totalLength += chunk.length;
      this.drain();
    } catch (error) {
      this.failed = true;
      this.onError(error);
    }
  }

  compact() {
    if (this.chunks.length === 0) return;
    if (this.chunks.length === 1) return;
    const merged = Buffer.concat(this.chunks, this.totalLength);
    this.chunks = [merged];
  }

  drain() {
    while (this.totalLength >= FRAME_HEADER_BYTES) {
      this.compact();
      const buffer = this.chunks[0];
      const magic = buffer.readUInt32BE(0);
      const version = buffer.readUInt16BE(4);
      const opcode = buffer.readUInt16BE(6);
      const requestId = buffer.readUInt32BE(8);
      const payloadLength = buffer.readUInt32BE(12);
      if (magic !== FRAME_MAGIC) {
        throw new ProtocolError("Invalid frame magic");
      }
      if (version !== PROTOCOL_VERSION) {
        throw new ProtocolError(`Unsupported protocol version: ${version}`);
      }
      if (payloadLength > this.limits.maxPayloadBytes) {
        throw new ProtocolError(
          "Frame payload exceeds the configured limit",
          "LIMIT_PAYLOAD_BYTES",
        );
      }
      const frameLength = FRAME_HEADER_BYTES + payloadLength;
      if (this.totalLength < frameLength) {
        return;
      }
      const payload = buffer.subarray(FRAME_HEADER_BYTES, frameLength);
      const remainder = buffer.subarray(frameLength);
      if (remainder.length > 0) {
        this.chunks = [remainder];
        this.totalLength = remainder.length;
      } else {
        this.chunks = [];
        this.totalLength = 0;
      }
      this.onFrame({ opcode, requestId, payload });
    }
  }
}
