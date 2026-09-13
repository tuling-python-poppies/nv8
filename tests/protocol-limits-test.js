import assert from 'node:assert/strict';
import test from 'node:test';
import { EdgeSandbox } from '../src/public/edge-sandbox.js';
import { encodeValue } from '../src/backend/protocol/value-encoder.js';
import { decodeValue } from '../src/backend/protocol/value-decoder.js';

/**
 * 单个请求帧就超过队列上限的源码（约 4KB > 1024 字节上限）。
 *
 * 上限是在**发送时**按累计字节判定的，所以这里等的是确定的拒绝结果，而不是
 * 「多久之后响应会堆积」。曾经的写法把 16 个 20ms 定时器并发发出，赌响应
 * 到达前队列会满；现在第一个请求就必然超限，测试结束时不残留挂起请求
 * （残留会让 child-process 的 CLOSE 排在它们之后，直到 deadline 才失败）。
 */
const OVER_LIMIT_SOURCE = `new Promise(() => {}) /* ${'x'.repeat(4096)} */`;

for (const backend of ['child-process', 'worker-thread']) {
  test(`frame queue limit is enforced on ${backend}`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      limits: { maxFrameQueueBytes: 1024, timeoutMs: 2_000 },
    });
    try {
      const results = await Promise.allSettled(
        Array.from({ length: 16 }, () => sandbox.evaluate(OVER_LIMIT_SOURCE)),
      );
      assert.ok(results.some(result => (
        result.status === 'rejected'
        && result.reason.code === 'LIMIT_FRAME_QUEUE_BYTES'
      )));
    } finally {
      await sandbox.close();
    }
  });
}

test('value depth limit is configurable for protocol encode/decode', () => {
  const nested = { a: { b: { c: 1 } } };
  assert.throws(
    () => encodeValue(nested, { maxValueDepth: 1 }),
    error => error.code === 'LIMIT_VALUE_DEPTH',
  );
  const encoded = encodeValue(nested, { maxValueDepth: 8 });
  assert.throws(
    () => decodeValue(encoded, { maxValueDepth: 1 }),
    error => error.code === 'LIMIT_VALUE_DEPTH',
  );
});
