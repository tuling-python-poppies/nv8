import assert from 'node:assert/strict';
import test from 'node:test';
import { EdgeSandbox } from '../src/public/edge-sandbox.js';
import { encodeValue } from '../src/backend/protocol/value-encoder.js';
import { decodeValue } from '../src/backend/protocol/value-decoder.js';

for (const backend of ['child-process', 'worker-thread']) {
  test(`frame queue limit is enforced on ${backend}`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      limits: { maxFrameQueueBytes: 1024, timeoutMs: 2_000 },
    });
    try {
      const calls = Array.from({ length: 16 }, () => (
        sandbox.evaluate('new Promise(resolve => setTimeout(() => resolve(1), 20))')
      ));
      const results = await Promise.allSettled(calls);
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
