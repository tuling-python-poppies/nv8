/**
 * IKFD9N 回归：帧协议限制两侧一致 + 编码失败保留真实错误码 + 深度计数统一。
 *
 * 关键场景：
 * - 子侧 FrameReader 的默认上限是 8MiB，父侧却可以按用户配置发送更大的帧；
 *   INIT 之后必须通过 setLimits 同步配置，否则 >8MiB 的合法请求会打死 transport；
 * - maxStringBytes / maxBytesLength 必须可配置（不再被硬编码 4MiB 卡死）；
 * - 数组/record 深度两侧每层恰好 +1，depth=32 成功、33 失败保持一致。
 */

import assert from "node:assert/strict";
import test from "node:test";
import { Opcode } from "../src/backend/protocol/constants.js";
import { FrameReader } from "../src/backend/protocol/frame-reader.js";
import { encodeFrame } from "../src/backend/protocol/frame-writer.js";
import { encodeValue } from "../src/backend/protocol/value-encoder.js";
import { decodeValue } from "../src/backend/protocol/value-decoder.js";
import { RuntimeController } from "../src/backend/controller/runtime-controller.js";
import { normalizeRuntimeOptions } from "../src/public/edge-runtime-options.js";

const MIB = 1024 * 1024;

function nestedArray(depth) {
  let value = 1;
  for (let index = 0; index < depth; index += 1) value = [value];
  return value;
}

function nestedRecord(depth) {
  let value = 1;
  for (let index = 0; index < depth; index += 1) value = { a: value };
  return value;
}

function backendOptions(backend, limitOverrides) {
  const base = normalizeRuntimeOptions({
    execution: { backend },
    limits: { timeoutMs: 30_000, maxRealms: 4 },
  });
  return Object.freeze({
    ...base,
    limits: Object.freeze({ ...base.limits, ...limitOverrides }),
  });
}

test("array depth is counted once per level on both encode and decode", () => {
  const atLimit = nestedArray(32);
  assert.doesNotThrow(() => encodeValue(atLimit, { maxValueDepth: 32 }));
  const encoded = encodeValue(atLimit, { maxValueDepth: 32 });
  assert.doesNotThrow(() => decodeValue(encoded, { maxValueDepth: 32 }));

  assert.throws(
    () => encodeValue(nestedArray(33), { maxValueDepth: 32 }),
    error => error.code === "LIMIT_VALUE_DEPTH",
  );
  const encoded33 = encodeValue(nestedArray(33), { maxValueDepth: 33 });
  assert.throws(
    () => decodeValue(encoded33, { maxValueDepth: 32 }),
    error => error.code === "LIMIT_VALUE_DEPTH",
  );
  assert.doesNotThrow(() => decodeValue(encoded33, { maxValueDepth: 33 }));
});

test("record depth is counted once per level on both encode and decode", () => {
  const atLimit = nestedRecord(32);
  assert.doesNotThrow(() => encodeValue(atLimit, { maxValueDepth: 32 }));
  const encoded = encodeValue(atLimit, { maxValueDepth: 32 });
  assert.doesNotThrow(() => decodeValue(encoded, { maxValueDepth: 32 }));

  assert.throws(
    () => encodeValue(nestedRecord(33), { maxValueDepth: 32 }),
    error => error.code === "LIMIT_VALUE_DEPTH",
  );
  const encoded33 = encodeValue(nestedRecord(33), { maxValueDepth: 33 });
  assert.throws(
    () => decodeValue(encoded33, { maxValueDepth: 32 }),
    error => error.code === "LIMIT_VALUE_DEPTH",
  );
});

test("array depth roundtrip preserves the value", () => {
  const value = { list: [1, [2, [3, { deep: [4] }]]], tail: "x" };
  const decoded = decodeValue(
    encodeValue(value, { maxValueDepth: 32 }),
    { maxValueDepth: 32 },
  );
  // decodeValue 产出 null-prototype record；用 JSON 归一化后再比较。
  assert.deepEqual(JSON.parse(JSON.stringify(decoded)), value);
});

test("encode failures keep their real limit codes", () => {
  assert.throws(
    () => encodeValue("x".repeat(1024), { maxStringBytes: 100 }),
    error => error.code === "LIMIT_STRING_BYTES",
  );
  assert.throws(
    () => encodeValue(new Uint8Array(1024), { maxBytesLength: 100 }),
    error => error.code === "LIMIT_BYTES",
  );
  assert.throws(
    () => encodeValue([1, 2, 3, 4], { maxArrayLength: 2 }),
    error => error.code === "LIMIT_ARRAY_LENGTH",
  );
  assert.throws(
    () => encodeValue({ a: 1, b: 2, c: 3 }, { maxFieldCount: 2 }),
    error => error.code === "LIMIT_FIELD_COUNT",
  );
});

test("FrameReader.setLimits accepts a frame above the default 8MiB ceiling", () => {
  const payload = encodeValue("z".repeat(9 * MIB), {
    maxStringBytes: 16 * MIB,
    maxPayloadBytes: 16 * MIB,
  });
  const frame = encodeFrame(Opcode.EVALUATE, 1, payload, {
    maxPayloadBytes: 16 * MIB,
  });

  const defaultErrors = [];
  const defaultReader = new FrameReader({
    onFrame() {},
    onError: error => defaultErrors.push(error),
  });
  defaultReader.push(frame);
  assert.equal(defaultErrors.length, 1);
  assert.equal(defaultErrors[0].code, "LIMIT_PAYLOAD_BYTES");

  const frames = [];
  const errors = [];
  const reader = new FrameReader({
    onFrame: received => frames.push(received),
    onError: error => errors.push(error),
  });
  reader.setLimits({ maxPayloadBytes: 16 * MIB });
  reader.push(frame);
  assert.equal(errors.length, 0);
  assert.equal(frames.length, 1);
  assert.equal(frames[0].opcode, Opcode.EVALUATE);
});

test("a request above 8MiB completes on the child backend", async () => {
  const controller = new RuntimeController(backendOptions("child-process", {
    maxSourceBytes: 16 * MIB,
    maxStringBytes: 16 * MIB,
    maxPayloadBytes: 16 * MIB,
    maxFrameQueueBytes: 32 * MIB,
  }));
  try {
    await controller.start();
    const source = `/*${"a".repeat(9 * MIB)}*/ 7`;
    const result = await controller.evaluate(source);
    assert.equal(result.type, "number");
    assert.equal(result.value, 7);
  } finally {
    await controller.close();
  }
});

test("a 5MiB string response succeeds when the configured limits allow it", async () => {
  const controller = new RuntimeController(backendOptions("child-process", {
    maxOutputBytes: 8 * MIB,
    maxStringBytes: 8 * MIB,
    maxPayloadBytes: 8 * MIB,
  }));
  try {
    await controller.start();
    const result = await controller.evaluate(`"y".repeat(${5 * MIB})`);
    assert.equal(result.type, "string");
    assert.equal(result.value.length, 5 * MIB);
  } finally {
    await controller.close();
  }
});

test("an over-limit string reports LIMIT_STRING_BYTES, not LIMIT_PAYLOAD_BYTES", async () => {
  const controller = new RuntimeController(backendOptions("child-process", {
    maxOutputBytes: 8 * MIB,
    maxStringBytes: 1 * MIB,
    maxPayloadBytes: 8 * MIB,
  }));
  try {
    await controller.start();
    await assert.rejects(
      () => controller.evaluate(`"y".repeat(${5 * MIB})`),
      error => error.code === "LIMIT_STRING_BYTES",
    );
  } finally {
    await controller.close();
  }
});

test("batchEvaluate uses bounded concurrency and keeps result order", async () => {
  const controller = new RuntimeController(backendOptions("child-process", {
    timeoutMs: 30_000,
  }));
  try {
    await controller.start();
    // 用「同批至少 4 项同时开跑」作释放条件：默认并发 4 时前 4 项互相等待、
    // 一起登记（峰值 4），第 5 项在某个槽位释放后启动。0ms 定时器只做轮询让位，
    // 16 轮上限让退化实现也能收口（峰值会暴露成 1/2/3），不会挂死。
    const sources = [0, 1, 2, 3, 4].map(index => `
      new Promise(resolve => {
        const probe = globalThis.__batchProbe ??= { active: 0, peak: 0, started: 0 };
        probe.active += 1;
        probe.started += 1;
        probe.peak = Math.max(probe.peak, probe.active);
        let yields = 0;
        const releaseWhenBatchStarted = () => {
          if (probe.started >= 4 || yields >= 16) {
            probe.active -= 1;
            resolve(${index});
            return;
          }
          yields += 1;
          setTimeout(releaseWhenBatchStarted, 0);
        };
        releaseWhenBatchStarted();
      })
    `);
    const results = await controller.batchEvaluate(sources);
    assert.deepEqual(results.map(entry => entry.value), [0, 1, 2, 3, 4]);

    const probe = JSON.parse((await controller.evaluate(
      "JSON.stringify(globalThis.__batchProbe)",
    )).value);
    assert.equal(probe.started, 5);
    // 默认有界并发是 4（src/backend/child/runtime-pool.js 的
    // DEFAULT_BATCH_CONCURRENCY）；峰值 1 说明退化成串行，5 说明并发无界。
    assert.equal(probe.peak, 4, `concurrency peak was ${probe.peak}`);
  } finally {
    await controller.close();
  }
});
