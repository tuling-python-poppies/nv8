import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CollectorErrorCode,
  createCollector,
  createStubTransport,
} from '../src/collection/collector/index.js';

const URL = 'https://target.test/api';

function header(request, name) {
  return request.headers.find(entry => entry.name === name)?.values ?? [];
}

test('credentials are origin-bound and injected only into the transport request', async () => {
  const transport = createStubTransport([{
    match: () => true,
    response: { status: 200, headers: [], body: 'ok' },
  }]);
  const collector = createCollector({
    transport,
    policy: { enabled: true, allowedOrigins: ['https://target.test'] },
    credentials: {
      origins: {
        'https://target.test/ignored-path': {
          headers: { Authorization: 'Bearer secret-token' },
          cookies: { session: 'session-secret' },
        },
      },
    },
  });
  try {
    await collector.send({ method: 'GET', url: URL });
    assert.deepEqual(header(transport.calls[0], 'authorization'), ['Bearer secret-token']);
    assert.deepEqual(transport.calls[0].cookies, [{ name: 'session', value: 'session-secret' }]);
  } finally {
    await collector.dispose();
  }
});

test('required credentials fail before transport IO and do not retry', async () => {
  const transport = createStubTransport([]);
  const collector = createCollector({
    transport,
    policy: { enabled: true, allowedOrigins: ['https://target.test'] },
    retry: { maxAttempts: 3, baseDelayMs: 0 },
  });
  try {
    await assert.rejects(
      () => collector.send({ method: 'GET', url: URL }, { requireCredentials: true }),
      error => error.code === CollectorErrorCode.CREDENTIAL_NOT_FOUND && error.retryable === false,
    );
    assert.equal(transport.calls.length, 0);
  } finally {
    await collector.dispose();
  }
});

test('credential and cookie values are redacted from diagnostics and audit', async () => {
  const transport = createStubTransport([{
    match: () => true,
    response: { status: 200, headers: [], body: 'ok' },
  }]);
  const collector = createCollector({
    transport,
    policy: { enabled: true, allowedOrigins: ['https://target.test'] },
    credentials: {
      origins: {
        'https://target.test': {
          headers: { Authorization: 'secret-header' },
          cookies: { session: 'secret-cookie' },
        },
      },
    },
  });
  try {
    await collector.send({ method: 'GET', url: URL });
    const snapshot = JSON.stringify({ description: collector.describe(), audit: collector.audit() });
    assert.doesNotMatch(snapshot, /secret-header|secret-cookie/);
    assert.match(snapshot, /\[redacted\]/);
  } finally {
    await collector.dispose();
  }
});

test('idempotent requests may retry transient statuses, with no fixed wait in tests', async () => {
  const delays = [];
  const transport = createStubTransport([{
    match: () => true,
    respond: (_request, call) => call === 1
      ? { status: 503, headers: [], body: 'retry' }
      : { status: 200, headers: [], body: 'ok' },
  }]);
  const collector = createCollector({
    transport,
    policy: { enabled: true, allowedOrigins: ['https://target.test'] },
    retry: { maxAttempts: 2, baseDelayMs: 10, maxDelayMs: 10 },
    sleep: async delay => delays.push(delay),
  });
  try {
    const result = await collector.send({ method: 'GET', url: URL });
    assert.equal(result.response.status, 200);
    assert.equal(transport.calls.length, 2);
    assert.deepEqual(delays, [10]);
    assert.deepEqual(result.attempts.map(attempt => attempt.status), [503, 200]);
  } finally {
    await collector.dispose();
  }
});

test('non-idempotent requests do not retry unless explicitly enabled', async () => {
  const createFailing = retry => {
    const transport = createStubTransport([{
      match: () => true,
      response: { status: 503, headers: [], body: 'retry' },
    }]);
    return {
      transport,
      collector: createCollector({
        transport,
        policy: { enabled: true, allowedOrigins: ['https://target.test'] },
        retry,
        sleep: async () => {},
      }),
    };
  };
  const first = createFailing({ maxAttempts: 2, baseDelayMs: 0 });
  const second = createFailing({ maxAttempts: 2, baseDelayMs: 0, retryNonIdempotent: true });
  try {
    const firstResult = await first.collector.send({ method: 'POST', url: URL });
    const secondResult = await second.collector.send({ method: 'POST', url: URL });
    assert.equal(firstResult.response.status, 503);
    assert.equal(secondResult.response.status, 503);
    assert.equal(firstResult.attempts.length, 1);
    assert.equal(secondResult.attempts.length, 2);
    assert.equal(first.transport.calls.length, 1);
    assert.equal(second.transport.calls.length, 2);
  } finally {
    await first.collector.dispose();
    await second.collector.dispose();
  }
});

test('policy violations are never retried even when retry is configured', async () => {
  const transport = createStubTransport([{
    match: () => true,
    response: { status: 200, headers: [], body: 'must-not-send' },
  }]);
  const collector = createCollector({
    transport,
    policy: { enabled: true, allowedOrigins: ['https://target.test'] },
    retry: { maxAttempts: 4, baseDelayMs: 0 },
  });
  try {
    await assert.rejects(
      () => collector.send({ method: 'GET', url: 'https://evil.test/exfiltrate' }),
      error => error.code === CollectorErrorCode.ORIGIN_NOT_ALLOWED,
    );
    assert.equal(transport.calls.length, 0);
  } finally {
    await collector.dispose();
  }
});
