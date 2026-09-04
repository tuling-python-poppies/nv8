import { Opcode } from "../protocol/constants.js";
import { FrameReader } from "../protocol/frame-reader.js";
import { encodeFramedValue } from "../protocol/frame-writer.js";
import { decodeValue } from "../protocol/value-decoder.js";
import { createDeadline, SandboxTimeoutError } from "./deadline.js";

const DISABLE_TIMEOUT_ENV = "EDGE_SANDBOX_DISABLE_TIMEOUT";

export class ConnectionBase {
  constructor(limits) {
    this.limits = limits;
    this.deadlinesDisabled = process.env[DISABLE_TIMEOUT_ENV] === "1";
    this.pending = new Map();
    this.queuedFrameBytes = 0;
    this.nextRequestId = 1;
    this.ready = false;
  }

  createFrameReader() {
    return new FrameReader({
      maxPayloadBytes: this.limits.maxPayloadBytes,
      maxValueDepth: this.limits.maxValueDepth,
      onFrame: frame => this.handleFrame(frame),
      onError: error => this.handleProtocolFailure(error),
    });
  }

  rawRequest(opcode, payload, timeoutMs) {
    const requestId = this.allocateRequestId();
    const frame = encodeFramedValue(opcode, requestId, payload, this.protocolLimits());
    const queueLimit = this.limits.maxFrameQueueBytes;
    if (
      this.ready
      && Number.isSafeInteger(queueLimit)
      && this.queuedFrameBytes + frame.byteLength > queueLimit
    ) {
      const error = new Error('Sandbox frame queue exceeds limits.maxFrameQueueBytes');
      error.code = 'LIMIT_FRAME_QUEUE_BYTES';
      error.limit = queueLimit;
      throw error;
    }
    this.queuedFrameBytes += frame.byteLength;
    return new Promise((resolve, reject) => {
      const cancelDeadline = this.deadlinesDisabled
        ? () => {}
        : createDeadline(timeoutMs, () => {
          this.pending.delete(requestId);
          const timeout = new SandboxTimeoutError(timeoutMs);
          reject(timeout);
          this.terminate(timeout);
        });
      this.pending.set(requestId, {
        opcode,
        resolve,
        reject,
        cancelDeadline,
        frameBytes: frame.byteLength,
      });
      this.sendFrame(frame, requestId);
    });
  }

  allocateRequestId() {
    const requestId = this.nextRequestId;
    this.nextRequestId = this.nextRequestId === 0xffffffff
      ? 1
      : this.nextRequestId + 1;
    return requestId;
  }

  handleFrame(frame) {
    const pending = this.pending.get(frame.requestId);
    if (pending === undefined) {
      this.handleProtocolFailure(new Error("Response has an unknown request ID"));
      return;
    }
    this.pending.delete(frame.requestId);
    this.queuedFrameBytes = Math.max(
      0,
      this.queuedFrameBytes - pending.frameBytes,
    );
    pending.cancelDeadline();
    let value;
    try {
      value = decodeValue(frame.payload, this.protocolLimits());
    } catch (error) {
      pending.reject(error);
      this.handleProtocolFailure(error);
      return;
    }
    if (frame.opcode === Opcode.ERROR) {
      pending.reject(value instanceof Error ? value : new Error("Unknown sandbox error"));
      return;
    }
    const expectedOpcode = pending.opcode | Opcode.RESPONSE_FLAG;
    if (frame.opcode !== expectedOpcode) {
      pending.reject(new Error("Sandbox response opcode does not match request"));
      this.handleProtocolFailure(new Error("Mismatched sandbox response opcode"));
      return;
    }
    pending.resolve(value);
  }

  rejectAllPending(error) {
    for (const pending of this.pending.values()) {
      pending.cancelDeadline();
      pending.reject(error);
    }
    this.pending.clear();
    this.queuedFrameBytes = 0;
  }

  rejectPending(requestId, error) {
    const pending = this.pending.get(requestId);
    if (pending === undefined) return;
    this.pending.delete(requestId);
    this.queuedFrameBytes = Math.max(
      0,
      this.queuedFrameBytes - pending.frameBytes,
    );
    pending.cancelDeadline();
    pending.reject(error);
  }

  protocolLimits() {
    return {
      maxPayloadBytes: this.limits.maxPayloadBytes,
      maxValueDepth: this.limits.maxValueDepth,
    };
  }

  // Subclasses must implement:
  // sendFrame(frame, requestId) - deliver encoded frame to the transport
  // handleProtocolFailure(cause) - handle unrecoverable protocol error
  // terminate(reason) - kill the transport and reject pending
}
