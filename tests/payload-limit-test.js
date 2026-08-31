import assert from 'node:assert/strict';
import test from 'node:test';
import { EdgeSandbox } from '../src/public/edge-sandbox.js';

for (const backend of ['child-process', 'worker-thread']) {
  test(`oversized batch response is structured on ${backend}`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      limits: { maxPayloadBytes: 8192 },
    });
    try {
      const sources = Array.from({ length: 300 }, () => '1');
      await assert.rejects(
        () => sandbox.batchEvaluate(sources),
        error => error.code === 'LIMIT_PAYLOAD_BYTES',
      );
    } finally {
      await sandbox.close();
    }
  });
}
