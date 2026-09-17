import assert from 'node:assert/strict';
import test from 'node:test';
import { EdgeSandbox } from '../src/public/edge-sandbox.js';
import { DiagnosticsCollector } from '../src/engine/core/diagnostics/collector.js';
import { DiagnosticError } from '../src/engine/core/diagnostics/errors.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

for (const backend of ['child-process', 'worker-thread']) {
  test(`evaluation output limit is structured on ${backend}`, async () => {
    const nv8 = await EdgeSandbox.create({
      execution: { backend },
      limits: { maxOutputBytes: 32 },
    });
    try {
      await assert.rejects(
        () => nv8.evaluate('"x".repeat(100)'),
        error => error.code === 'LIMIT_OUTPUT_BYTES',
      );
    } finally {
      await nv8.close();
    }
  });
}

test('diagnostics collector is bounded and preserves structured errors', () => {
  const collector = new DiagnosticsCollector({ maxEntries: 2 });
  collector.warn({ pluginId: 'one', message: 'old' });
  collector.error({ pluginId: 'two', message: 'new' });
  collector.record(new DiagnosticError(
    'LIMIT_REALM_CAPACITY',
    'capacity reached',
    { limit: 1, context: { sandboxId: 'sandbox-1' } },
  ), { phase: 'create-realm' });
  assert.deepEqual(collector.getAll().map(item => item.message), [
    'new',
    'capacity reached',
  ]);
  assert.equal(collector.getErrors()[1].code, 'LIMIT_REALM_CAPACITY');
  assert.equal(collector.getErrors()[1].context.phase, 'create-realm');
});
