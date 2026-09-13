import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const EXAMPLES = new URL('../examples/', import.meta.url);

async function runExample(name) {
  return run(process.execPath, [
    '--experimental-vm-modules',
    fileURLToPath(new URL(name, EXAMPLES)),
  ], {
    cwd: fileURLToPath(new URL('../', import.meta.url)),
    maxBuffer: 1024 * 1024,
  });
}

test('basic-eval example executes in an isolated Realm', async () => {
  const { stdout } = await runExample('basic-eval.mjs');
  assert.match(stdout, /"sum": 5/);
  assert.match(stdout, /"hasProcess": false/);
});

test('protocol-collector example uses a bounded stub transport', async () => {
  const { stdout } = await runExample('protocol-collector.mjs');
  assert.match(stdout, /"status": 200/);
  assert.match(stdout, /"signature": \[\s*"offline-signature"/);
  assert.match(stdout, /"transportCalls": 1/);
});

test('pagination example demonstrates bounded traversal and idempotent sink writes', async () => {
  const { stdout } = await runExample('pagination.mjs');
  assert.match(stdout, /"stop": "exhausted"/);
  assert.match(stdout, /"duplicates": 1/);
  assert.match(stdout, /"requests": 2/);
});
