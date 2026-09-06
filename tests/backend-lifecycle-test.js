import assert from 'node:assert/strict';
import test from 'node:test';
import { Opcode } from '../src/backend/protocol/constants.js';
import { ChildProcessConnection } from '../src/backend/controller/child-process.js';
import { PooledWorkerThreadConnection } from '../src/backend/controller/worker-thread-pool.js';

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
  const calls = { terminate: 0 };
  return {
    calls,
    postMessage() {
      if (postError !== null) throw postError;
    },
    terminate() {
      calls.terminate += 1;
      return Promise.resolve(0);
    },
  };
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
