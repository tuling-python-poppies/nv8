import assert from 'node:assert/strict';
import test from 'node:test';
import { createApp } from '../src/core/app.js';

test('Core App aggregates bounded lifecycle and diagnostics', async () => {
  const app = createApp({
    trace: false,
    maxLifecycleEntries: 16,
    maxDiagnosticEntries: 8,
  });
  app.registerProfile({
    id: 'empty',
    plugins: [],
  });
  const sandbox = await app.createSandbox({ profile: 'empty', trace: false });
  const created = app.diagnose();
  assert.equal(created.sandboxes.length, 1);
  assert.ok(created.lifecycle.some(event => event.name === 'sandbox.created'));
  assert.deepEqual(created.diagnostics, []);

  await app.destroySandbox(sandbox.id);
  assert.equal(app.diagnose().sandboxes.length, 0);
  assert.ok(app.diagnose().lifecycle.some(event => event.name === 'sandbox.destroyed'));

  await app.destroy();
  const destroyed = app.diagnose();
  assert.equal(destroyed.destroyed, true);
  assert.ok(destroyed.lifecycle.some(event => event.name === 'app.destroyed'));
  await app.destroy();
});

test('Core App records failed Sandbox creation', async () => {
  const app = createApp({ trace: false, maxDiagnosticEntries: 4 });
  await assert.rejects(
    () => app.createSandbox({ profile: 'missing' }),
    /Profile "missing" not found/,
  );
  const diagnosis = app.diagnose();
  assert.equal(diagnosis.diagnostics.length, 0);
  await app.destroy();
});
