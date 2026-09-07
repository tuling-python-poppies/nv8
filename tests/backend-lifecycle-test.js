import assert from 'node:assert/strict';
import { execFile as execFileCallback } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { promisify } from 'node:util';
import test from 'node:test';
import { Opcode } from '../src/backend/protocol/constants.js';
import { ChildProcessConnection } from '../src/backend/controller/child-process.js';
import { PooledWorkerThreadConnection } from '../src/backend/controller/worker-thread-pool.js';

const execFile = promisify(execFileCallback);

const limits = {
  maxHeapBytes: 512 * 1024 * 1024,
  maxPayloadBytes: 1024 * 1024,
  maxValueDepth: 64,
  maxFrameQueueBytes: 1024 * 1024,
};

function fakeChild({ writeError = null } = {}) {
  const calls = {
    stdinDestroy: 0,
    stdoutDestroy: 0,
    stderrDestroy: 0,
    kill: 0,
  };
  return {
    calls,
    stdin: {
      destroy() {
        calls.stdinDestroy += 1;
      },
      write(_frame, callback) {
        if (writeError !== null) throw writeError;
        callback?.();
      },
    },
    stdout: {
      destroy() {
        calls.stdoutDestroy += 1;
      },
    },
    stderr: {
      destroy() {
        calls.stderrDestroy += 1;
      },
    },
    kill() {
      calls.kill += 1;
    },
  };
}

function fakeWorker({ postError = null } = {}) {
  const worker = new EventEmitter();
  worker.calls = { terminate: 0 };
  worker.postMessage = () => {
    if (postError !== null) throw postError;
  };
  worker.terminate = () => {
    worker.calls.terminate += 1;
    return Promise.resolve(0);
  };
  return worker;
}

test('child-process protocol failure terminates transport and rejects its queue', async () => {
  const connection = new ChildProcessConnection(limits);
  const child = fakeChild();
  connection.child = child;
  connection.ready = true;
  const pending = connection.rawRequest(
    Opcode.EVALUATE,
    { source: '1' },
    1_000,
  );

  connection.handleProtocolFailure(new Error('malformed frame'));

  await assert.rejects(
    pending,
    error => error.code === 'ERR_EDGE_CHILD_PROTOCOL',
  );
  assert.equal(connection.child, null);
  assert.equal(connection.ready, false);
  assert.equal(connection.pending.size, 0);
  assert.equal(connection.queuedFrameBytes, 0);
  assert.deepEqual(child.calls, {
    stdinDestroy: 1,
    stdoutDestroy: 1,
    stderrDestroy: 1,
    kill: 1,
  });
});

test('child-process synchronous write failure removes its pending request', async () => {
  const connection = new ChildProcessConnection(limits);
  const writeError = new Error('stdin is already closed');
  const child = fakeChild({ writeError });
  connection.child = child;
  connection.ready = true;

  const pending = connection.rawRequest(
    Opcode.EVALUATE,
    { source: '1' },
    1_000,
  );

  await assert.rejects(pending, error => error === writeError);
  assert.equal(connection.child, null);
  assert.equal(connection.pending.size, 0);
  assert.equal(connection.queuedFrameBytes, 0);
  assert.deepEqual(child.calls, {
    stdinDestroy: 1,
    stdoutDestroy: 1,
    stderrDestroy: 1,
    kill: 1,
  });
});

test('worker-thread synchronous post failure terminates transport', async () => {
  const connection = new PooledWorkerThreadConnection(limits);
  const postError = new Error('worker is no longer usable');
  const worker = fakeWorker({ postError });
  connection.worker = worker;
  connection.ready = true;

  const pending = connection.rawRequest(
    Opcode.EVALUATE,
    { source: '1' },
    1_000,
  );

  await assert.rejects(pending, error => error === postError);
  assert.equal(connection.worker, null);
  assert.equal(connection.pending.size, 0);
  assert.equal(connection.queuedFrameBytes, 0);
  assert.equal(worker.calls.terminate, 1);
});

test('worker-thread CLOSE failure terminates transport instead of recycling it', async () => {
  const connection = new PooledWorkerThreadConnection(limits);
  const worker = fakeWorker();
  connection.worker = worker;
  connection.ready = true;
  const closeError = new Error('CLOSE response was lost');
  connection.rawRequest = async () => {
    throw closeError;
  };

  await connection.closeAndRecycle();

  assert.equal(connection.worker, null);
  assert.equal(connection.ready, false);
  assert.equal(worker.calls.terminate, 1);
  assert.equal(worker.listenerCount('error'), 0);
  assert.equal(worker.listenerCount('exit'), 0);
});

test('recycled worker is removed from the idle pool after an error', async () => {
  const moduleUrl = new URL(
    '../src/backend/controller/worker-thread-pool.js',
    import.meta.url,
  ).href;
  const script = `
    import { EventEmitter } from 'node:events';
    import { PooledWorkerThreadConnection } from ${JSON.stringify(moduleUrl)};

    const worker = new EventEmitter();
    worker.terminateCalls = 0;
    worker.postMessage = () => {};
    worker.terminate = () => {
      worker.terminateCalls += 1;
      return Promise.resolve(0);
    };
    const connection = new PooledWorkerThreadConnection(${JSON.stringify(limits)});
    connection.worker = worker;
    connection.ready = true;
    connection.rawRequest = async () => undefined;
    await connection.closeAndRecycle();
    if (worker.listenerCount('error') !== 1 || worker.listenerCount('exit') !== 1) {
      throw new Error('recycled worker listeners were not installed');
    }
    worker.emit('error', new Error('idle worker failed'));
    await new Promise(resolve => setImmediate(resolve));
    if (worker.terminateCalls !== 1) throw new Error('idle worker was not terminated');
    if (worker.listenerCount('error') !== 0 || worker.listenerCount('exit') !== 0) {
      throw new Error('idle worker listeners were not removed');
    }
  `;
  await execFile(process.execPath, ['--input-type=module', '-e', script]);
});

test('worker-thread exit terminates the handle and rejects its queue', async () => {
  const connection = new PooledWorkerThreadConnection(limits);
  const worker = fakeWorker();
  connection.worker = worker;
  connection.ready = true;
  const pending = connection.rawRequest(
    Opcode.EVALUATE,
    { source: '1' },
    1_000,
  );
  const exitError = new Error('message channel failed');

  connection.handleExit(worker, exitError);

  await assert.rejects(pending, error => error === exitError);
  await Promise.resolve();
  assert.equal(connection.worker, null);
  assert.equal(connection.ready, false);
  assert.equal(connection.pending.size, 0);
  assert.equal(connection.queuedFrameBytes, 0);
  assert.equal(worker.calls.terminate, 1);
});
