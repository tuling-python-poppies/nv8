export const FRAME_MAGIC = 0x45444745;
export const PROTOCOL_VERSION = 1;
export const FRAME_HEADER_BYTES = 16;

export const Opcode = Object.freeze({
  INIT: 1,
  EVALUATE: 2,
  EVALUATE_MODULE: 3,
  SET_PAGE: 4,
  ENABLE_TRACE: 5,
  DISABLE_TRACE: 6,
  CLEAR_TRACE: 7,
  READ_TRACE: 8,
  CLOSE: 9,
  READ_NETWORK_REQUESTS: 10,
  CLEAR_NETWORK_REQUESTS: 11,
  RESET_REALM: 12,
  BATCH_EVALUATE: 13,
  READ_RESOURCES: 14,
  // INIT 前的小握手，父侧收到确认才发送 INIT（含可能超过 8MiB 的 replay）。
  UPDATE_LIMITS: 15,
  // 在承载 Realm 的子进程里打开 V8 inspector，返回 CDP WebSocket 地址供
  // Chrome DevTools 连接。仅 child-process 后端支持（见 inspector-control.js）。
  OPEN_INSPECTOR: 16,
  RESPONSE_FLAG: 0x8000,
  ERROR: 0xffff,
});

export const ValueTag = Object.freeze({
  UNDEFINED: 0,
  NULL: 1,
  FALSE: 2,
  TRUE: 3,
  SIGNED_INTEGER: 4,
  DOUBLE: 5,
  STRING: 6,
  BYTES: 7,
  ARRAY: 8,
  RECORD: 9,
  EVALUATION_RESULT: 10,
  ERROR: 11,
  TRACE_ENTRY: 12,
});

export const DEFAULT_PROTOCOL_LIMITS = Object.freeze({
  maxPayloadBytes: 8 * 1024 * 1024,
  maxValueDepth: 32,
  maxArrayLength: 100_000,
  maxFieldCount: 10_000,
  maxStringBytes: 4 * 1024 * 1024,
  maxBytesLength: 4 * 1024 * 1024,
});
