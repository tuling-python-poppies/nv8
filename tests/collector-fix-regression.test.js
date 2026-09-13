/**
 * Collector 修复回归（Gitee: IKF39P / IKF39N / IKF39L / IKFD9S / IKFD9T /
 * IKFDA0 / IKFDA1 / boundary proxy URIError / IKF39E）
 *
 * 每个用例对应一个已修复缺陷，覆盖缺陷当初可复现的最小路径。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CircuitBreaker,
  CircuitState,
  CollectorError,
  CollectorErrorCode,
  CollectorRequestError,
  CookieJar,
  CredentialStore,
  RateLimiter,
  REDACTED,
  createBatchingResultSink,
  createCollector,
  createCollectorResponse,
  createFetchTransport,
  createStubTransport,
  inspectCheckpoint,
  createCheckpoint,
  jobFingerprint,
  parseProxy,
  redactHeaders,
} from '../src/collection/collector/index.js';
import { createRequestPlan } from '../src/collection/request-protocol/index.js';

const ORIGIN = 'https://target.test';
const OTHER_ORIGIN = 'https://cdn.test';

function plan(overrides = {}) {
  return createRequestPlan({ method: 'GET', url: `${ORIGIN}/api`, ...overrides });
}

function okTransport(response = {}) {
  return createStubTransport([{
    match: () => true,
    response: { status: 200, statusText: 'OK', headers: [], body: 'ok', ...response },
  }]);
}

function collectorWith(config = {}) {
  return createCollector({
    transport: config.transport ?? okTransport(),
    policy: config.policy ?? { enabled: true, allowedOrigins: [ORIGIN] },
    credentials: config.credentials,
    retry: config.retry ?? { maxAttempts: 1 },
    sleep: config.sleep ?? (() => Promise.resolve()),
    circuitBreaker: config.circuitBreaker,
    rateLimiter: config.rateLimiter,
  });
}

function timeoutError() {
  return new CollectorError(CollectorErrorCode.REQUEST_TIMEOUT, 'timed out', {
    retryable: true,
  });
}

// ------------------------------------------------------- IKF39E result sink

test('result sink releases keys for retry after a failed auto-flush', async () => {
  const persisted = [];
  let attempts = 0;
  const sink = createBatchingResultSink({
    batchSize: 2,
    keyOf: (item) => item.id,
    persist: async (batch) => {
      attempts += 1;
      if (attempts === 1) throw new Error('storage temporarily unavailable');
      persisted.push(...batch.map((item) => item.id));
    },
  });

  await assert.rejects(
    () => sink.write([{ id: 'a' }, { id: 'b' }]),
    /storage temporarily unavailable/,
  );
  assert.equal(sink.stats().written, 0);
  assert.equal(sink.stats().buffered, 0);

  assert.equal(await sink.write([{ id: 'a' }, { id: 'b' }]), 2);
  await sink.close();
  assert.deepEqual(persisted, ['a', 'b']);
  assert.equal(sink.stats().duplicates, 0);
  assert.equal(sink.stats().batches, 1);
});

test('a pending key is deduplicated before persist resolves and committed after', async () => {
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  let persistCalls = 0;
  const sink = createBatchingResultSink({
    batchSize: 2,
    keyOf: (item) => item.id,
    persist: async () => {
      persistCalls += 1;
      await gate;
    },
  });

  const first = sink.write([{ id: 'a' }, { id: 'b' }]);
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(await sink.write([{ id: 'a' }]), 0, 'in-flight key must be deduplicated');
  assert.equal(sink.stats().duplicates, 1);

  release();
  await first;
  assert.equal(await sink.write([{ id: 'a' }]), 0, 'committed key must stay deduplicated');
  await sink.close();
  assert.equal(persistCalls, 1);
});

// ----------------------------------------------------------- IKF39P transport

function streamOf(totalBytes, chunkSize, onCancel) {
  let sent = 0;
  return new ReadableStream({
    pull(controller) {
      if (sent >= totalBytes) {
        controller.close();
        return;
      }
      const size = Math.min(chunkSize, totalBytes - sent);
      controller.enqueue(new Uint8Array(size).fill(0x61));
      sent += size;
    },
    cancel() { onCancel?.(); },
  });
}

test('fetch transport rejects an oversized body while streaming and cancels the reader', async () => {
  let cancelled = false;
  const fetchImpl = async () => new Response(streamOf(64, 16, () => { cancelled = true; }), {
    status: 200,
    headers: { 'content-type': 'text/plain' },
  });
  const transport = createFetchTransport({ fetchImpl, maxResponseBytes: 20 });

  await assert.rejects(
    () => transport.send(plan()),
    (error) => {
      assert.equal(error.code, CollectorErrorCode.RESPONSE_TOO_LARGE);
      assert.equal(error.retryable, false);
      assert.match(error.message, /maxResponseBytes/);
      return true;
    },
  );
  assert.equal(cancelled, true, 'the stream must be cancelled as soon as the limit is hit');
});

test('fetch transport streams a normal body into base64', async () => {
  const fetchImpl = async () => new Response(streamOf(8, 3), { status: 200, headers: {} });
  const transport = createFetchTransport({ fetchImpl });

  const response = await transport.send(plan());
  assert.equal(response.status, 200);
  assert.equal(Buffer.from(response.body, 'base64').toString('utf8'), 'aaaaaaaa');
});

function redirectTransport(location, targetStatus = 200) {
  return createStubTransport([
    {
      match: (request) => request.url === `${ORIGIN}/start`,
      response: { status: 302, headers: [{ name: 'location', values: [location] }] },
    },
    {
      match: (request) => request.url === `${ORIGIN}/next`,
      response: { status: targetStatus, headers: [], body: 'done' },
    },
  ]);
}

test('collector does not follow redirects while policy keeps them disabled', async () => {
  const transport = redirectTransport('/next');
  const collector = collectorWith({ transport });

  const result = await collector.send(plan({ url: `${ORIGIN}/start` }));
  assert.equal(result.response.status, 302);
  assert.equal(result.redirected, false);
  assert.equal(transport.calls.length, 1);
  await collector.dispose();
});

test('collector follows same-origin redirects when policy allows', async () => {
  const transport = redirectTransport('/next');
  const collector = collectorWith({
    transport,
    policy: { enabled: true, allowedOrigins: [ORIGIN], followRedirects: true, maxRedirects: 3 },
  });

  const result = await collector.send(plan({ url: `${ORIGIN}/start` }));
  assert.equal(result.response.status, 200);
  assert.equal(result.redirected, true);
  assert.equal(transport.calls.length, 2);
  assert.equal(transport.calls[1].url, `${ORIGIN}/next`);
  await collector.dispose();
});

test('collector rejects a cross-origin redirect unless policy allows it', async () => {
  const transport = redirectTransport(`${OTHER_ORIGIN}/next`);
  const collector = collectorWith({
    transport,
    policy: {
      enabled: true,
      allowedOrigins: [ORIGIN, OTHER_ORIGIN],
      followRedirects: true,
    },
  });

  await assert.rejects(
    () => collector.send(plan({ url: `${ORIGIN}/start` })),
    (error) => error.code === CollectorErrorCode.REDIRECT_NOT_ALLOWED,
  );
  assert.equal(transport.calls.length, 1, 'the target of the redirect must never be hit');
  await collector.dispose();
});

test('collector stops at maxRedirects', async () => {
  const transport = createStubTransport([
    {
      match: (request) => request.url.startsWith(`${ORIGIN}/hop`),
      response: {
        status: 302,
        headers: [{ name: 'location', values: ['/hop'] }],
      },
    },
  ]);
  const collector = collectorWith({
    transport,
    policy: { enabled: true, allowedOrigins: [ORIGIN], followRedirects: true, maxRedirects: 1 },
  });

  await assert.rejects(
    () => collector.send(plan({ url: `${ORIGIN}/hop0` })),
    (error) => error.code === CollectorErrorCode.REDIRECT_LIMIT,
  );
  assert.equal(transport.calls.length, 2);
  await collector.dispose();
});

test('cross-origin follow drops plan credentials and re-resolves target credentials', async () => {
  const transport = createStubTransport([
    {
      match: (request) => request.url === `${ORIGIN}/start`,
      response: { status: 302, headers: [{ name: 'location', values: [`${OTHER_ORIGIN}/next`] }] },
    },
    {
      match: (request) => request.url === `${OTHER_ORIGIN}/next`,
      response: { status: 200, headers: [], body: 'ok' },
    },
  ]);
  const collector = createCollector({
    transport,
    policy: {
      enabled: true,
      allowedOrigins: [ORIGIN, OTHER_ORIGIN],
      followRedirects: true,
      allowCrossOriginRedirect: true,
    },
    credentials: {
      origins: { [OTHER_ORIGIN]: { headers: { 'x-api-key': 'other-secret' } } },
    },
    retry: { maxAttempts: 1 },
  });

  await collector.send(plan({
    url: `${ORIGIN}/start`,
    headers: { 'x-plan': 'keep' },
    cookies: { sid: 'plan-cookie' },
  }));

  const originCall = transport.calls[0];
  const redirectedCall = transport.calls[1];
  assert.equal(originCall.headers.find((entry) => entry.name === 'x-plan')?.values[0], 'keep');
  assert.equal(
    redirectedCall.headers.find((entry) => entry.name === 'x-plan'),
    undefined,
    'plan headers must not leak to another origin',
  );
  assert.deepEqual(redirectedCall.cookies, [], 'plan cookies must not leak to another origin');
  assert.deepEqual(
    redirectedCall.headers.find((entry) => entry.name === 'x-api-key')?.values,
    ['other-secret'],
    'the target origin credentials must be injected after the hop',
  );
  await collector.dispose();
});

test('a redirect hop re-checks the allowlist for the new origin', async () => {
  const transport = redirectTransport('https://not-allowed.test/next');
  const collector = collectorWith({
    transport,
    policy: { enabled: true, allowedOrigins: [ORIGIN], followRedirects: true, allowCrossOriginRedirect: true },
  });

  await assert.rejects(
    () => collector.send(plan({ url: `${ORIGIN}/start` })),
    (error) => error.code === CollectorErrorCode.ORIGIN_NOT_ALLOWED,
  );
  assert.equal(transport.calls.length, 1);
  await collector.dispose();
});

// ------------------------------------------------------------ IKF39N 脱敏

test('audit redacts query values and custom credential header values', async () => {
  const transport = okTransport();
  const collector = createCollector({
    transport,
    policy: { enabled: true, allowedOrigins: [ORIGIN] },
    credentials: {
      origins: { [ORIGIN]: { headers: { 'X-Api-Key': 'super-secret-key' } } },
    },
    retry: { maxAttempts: 1 },
  });

  await collector.send(createRequestPlan({
    method: 'GET',
    url: `${ORIGIN}/api?token=super-secret-token&page=2`,
  }));

  const [entry] = collector.audit();
  const serialized = JSON.stringify(entry);
  assert.ok(!serialized.includes('super-secret-token'), 'query token must not appear');
  assert.ok(!serialized.includes('super-secret-key'), 'custom credential header must not appear');
  assert.equal(entry.headers['x-api-key'], REDACTED);
  assert.match(entry.url, /token=\[redacted\]/);
  assert.match(entry.url, /page=\[redacted\]/);
  await collector.dispose();
});

test('redactHeaders masks every credential header registered by the store', () => {
  // eslint-disable-next-line no-new
  new CredentialStore({
    origins: { [ORIGIN]: { headers: { 'x-signature-v2': 'raw-value' } } },
  });
  const redacted = redactHeaders([
    { name: 'x-signature-v2', values: ['raw-value'] },
    { name: 'accept', values: ['*/*'] },
  ]);
  assert.equal(redacted['x-signature-v2'], REDACTED);
  assert.deepEqual(redacted.accept, ['*/*']);
});

test('transport errors never echo query credentials', async () => {
  const fetchImpl = async () => { throw new Error('boom'); };
  const transport = createFetchTransport({ fetchImpl });

  await assert.rejects(
    () => transport.send(plan({ url: `${ORIGIN}/api?token=leaked-token` })),
    (error) => {
      assert.ok(!error.message.includes('leaked-token'), 'message must be redacted');
      assert.ok(!JSON.stringify(error.context ?? {}).includes('leaked-token'), 'context must be redacted');
      return true;
    },
  );
});

// ------------------------------------------------ IKF39L 熔断探针与重试

test('a pre-send credential failure does not leak a half-open probe', async () => {
  const breaker = new CircuitBreaker({ failureThreshold: 1, cooldownMs: 0 });
  breaker.record(`${ORIGIN}/api`, { error: timeoutError() });

  const transport = okTransport();
  const collector = createCollector({
    transport,
    policy: { enabled: true, allowedOrigins: [ORIGIN] },
    circuitBreaker: breaker,
    retry: { maxAttempts: 1 },
  });

  try {
    await assert.rejects(
      () => collector.send(plan(), { requireCredentials: true }),
      (error) => error.code === CollectorErrorCode.CREDENTIAL_NOT_FOUND,
    );
    // 旧实现会在凭据检查之前取走探针，导致这里永远半开拒绝
    const result = await collector.send(plan());
    assert.equal(result.response.status, 200);
    assert.equal(transport.calls.length, 1);
    assert.equal(breaker.stateFor(`${ORIGIN}/api`), CircuitState.CLOSED);
  } finally {
    await collector.dispose();
  }
});

test('retries do not bypass an open circuit', async () => {
  const breaker = new CircuitBreaker({ failureThreshold: 1, cooldownMs: 60_000 });
  const transport = createStubTransport([{
    match: () => true,
    error: new CollectorRequestError(
      CollectorErrorCode.REQUEST_FAILED,
      'socket hang up',
      { retryable: true },
    ),
  }]);
  const collector = createCollector({
    transport,
    policy: { enabled: true, allowedOrigins: [ORIGIN] },
    circuitBreaker: breaker,
    retry: { maxAttempts: 3 },
    sleep: () => Promise.resolve(),
  });

  try {
    await assert.rejects(
      () => collector.send(plan()),
      (error) => error.code === CollectorErrorCode.CIRCUIT_OPEN,
    );
    assert.equal(transport.calls.length, 1, 'the retry must be stopped by the open circuit');
  } finally {
    await collector.dispose();
  }
});

test('a transport failure releases the half-open probe for the next attempt', async () => {
  const breaker = new CircuitBreaker({ failureThreshold: 1, cooldownMs: 0 });
  breaker.record(`${ORIGIN}/api`, { error: timeoutError() });

  let calls = 0;
  const transport = {
    async send() {
      calls += 1;
      if (calls === 1) {
        throw new CollectorRequestError(
          CollectorErrorCode.REQUEST_FAILED,
          'probe failed',
          { retryable: false },
        );
      }
      return createCollectorResponse({ status: 200, headers: [], body: 'ok' });
    },
  };
  const collector = createCollector({
    transport,
    policy: { enabled: true, allowedOrigins: [ORIGIN] },
    circuitBreaker: breaker,
    retry: { maxAttempts: 1 },
  });

  try {
    await assert.rejects(() => collector.send(plan()));
    // 探针失败后电路重新打开；冷却期已过，下一次请求应能再探测并恢复
    const result = await collector.send(plan());
    assert.equal(result.response.status, 200);
  } finally {
    await collector.dispose();
  }
});

// ------------------------------------------------------- IKFD9S Set-Cookie

test('multiple split set-cookie entries all enter the jar', () => {
  const jar = new CookieJar();
  jar.acceptFromResponse(`${ORIGIN}/`, {
    headers: [
      { name: 'set-cookie', values: ['a=1; Path=/'] },
      { name: 'set-cookie', values: ['b=2; Path=/'] },
    ],
  });
  const cookies = jar.cookiesFor(`${ORIGIN}/`);
  assert.equal(cookies.get('a'), '1');
  assert.equal(cookies.get('b'), '2');
});

test('aggregated set-cookie values all enter the jar', () => {
  const jar = new CookieJar();
  jar.acceptFromResponse(`${ORIGIN}/`, {
    headers: [{ name: 'set-cookie', values: ['a=1; Path=/', 'b=2; Path=/'] }],
  });
  const cookies = jar.cookiesFor(`${ORIGIN}/`);
  assert.equal(cookies.get('a'), '1');
  assert.equal(cookies.get('b'), '2');
});

// --------------------------------------------------- IKFD9T 凭据优先级

test('plan headers and cookies win over credentials without duplicate Authorization', async () => {
  const transport = okTransport();
  const collector = createCollector({
    transport,
    policy: { enabled: true, allowedOrigins: [ORIGIN] },
    credentials: {
      origins: {
        [ORIGIN]: {
          headers: { authorization: 'Bearer credential' },
          cookies: { sid: 'credential-sid' },
        },
      },
    },
    retry: { maxAttempts: 1 },
  });

  await collector.send(plan({
    headers: { authorization: 'Bearer plan' },
    cookies: { sid: 'plan-sid' },
  }));

  const call = transport.calls[0];
  const authorization = call.headers.filter((entry) => entry.name === 'authorization');
  assert.equal(authorization.length, 1, 'no duplicate Authorization header');
  assert.deepEqual(authorization[0].values, ['Bearer plan']);
  assert.deepEqual(call.cookies, [{ name: 'sid', value: 'plan-sid' }]);
  await collector.dispose();
});

test('credentials only fill the header slots the plan left empty', async () => {
  const transport = okTransport();
  const collector = createCollector({
    transport,
    policy: { enabled: true, allowedOrigins: [ORIGIN] },
    credentials: {
      origins: {
        [ORIGIN]: {
          headers: { authorization: 'Bearer credential', 'x-api-key': 'key-1' },
          cookies: { sid: 'credential-sid' },
        },
      },
    },
    retry: { maxAttempts: 1 },
  });

  await collector.send(plan({ headers: { authorization: 'Bearer plan' } }));

  const call = transport.calls[0];
  assert.deepEqual(
    call.headers.find((entry) => entry.name === 'authorization')?.values,
    ['Bearer plan'],
  );
  assert.deepEqual(
    call.headers.find((entry) => entry.name === 'x-api-key')?.values,
    ['key-1'],
  );
  assert.deepEqual(call.cookies, [{ name: 'sid', value: 'credential-sid' }]);
  await collector.dispose();
});

// ------------------------------------------------ IKFDA0 背压与检查点

test('rate limiting is excluded from circuit health', () => {
  const breaker = new CircuitBreaker();
  const rateLimited = new CollectorError(
    CollectorErrorCode.RATE_LIMITED,
    'queue full',
    { retryable: true },
  );
  assert.equal(breaker.countsAsFailure({ error: rateLimited }), false);
});

test('a full queue is local backpressure and never trips the circuit', async () => {
  let releaseFirst;
  const gate = new Promise((resolve) => { releaseFirst = resolve; });
  let calls = 0;
  const transport = {
    async send() {
      calls += 1;
      if (calls === 1) await gate;
      return createCollectorResponse({ status: 200, headers: [], body: 'ok' });
    },
  };
  const collector = createCollector({
    transport,
    // 真实（ref'd）定时器：默认 sleep 是 unref 的，测试进程没有其他句柄时
    // 事件循环会先退出，排队中的请求永远等不到唤醒
    rateLimiter: new RateLimiter({
      maxConcurrent: 1,
      maxQueued: 1,
      sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms || 1)),
    }),
    circuitBreaker: new CircuitBreaker({ failureThreshold: 1, cooldownMs: 60_000 }),
    policy: { enabled: true, allowedOrigins: [ORIGIN] },
    retry: { maxAttempts: 1 },
  });

  try {
    const first = collector.send(plan());
    await Promise.resolve();
    await Promise.resolve();
    const second = collector.send(plan());
    await Promise.resolve();

    await assert.rejects(
      () => collector.send(plan()),
      (error) => {
        assert.equal(error.code, CollectorErrorCode.RATE_LIMITED);
        assert.equal(error.retryable, true, 'backpressure stays retryable');
        return true;
      },
    );
    assert.equal(
      collector.circuitBreaker.stateFor(`${ORIGIN}/api`),
      CircuitState.CLOSED,
      'local throttling must not count against the target',
    );

    releaseFirst();
    await first;
    await second;
  } finally {
    await collector.dispose();
  }
});

test('checkpoints with corrupt totalItems or seenCursors are unusable', () => {
  const fingerprint = jobFingerprint({ q: 1 });
  const valid = createCheckpoint({
    jobFingerprint: fingerprint,
    pageIndex: 1,
    totalItems: 3,
  });

  assert.deepEqual(inspectCheckpoint(valid, fingerprint), { usable: true, reason: null });
  assert.equal(inspectCheckpoint({ ...valid, totalItems: -1 }, fingerprint).reason, 'corrupt');
  assert.equal(inspectCheckpoint({ ...valid, totalItems: 1.5 }, fingerprint).reason, 'corrupt');
  assert.equal(inspectCheckpoint({ ...valid, seenCursors: 'oops' }, fingerprint).reason, 'corrupt');
  assert.equal(inspectCheckpoint({ ...valid, seenCursors: ['ok', 7] }, fingerprint).reason, 'corrupt');
});

// --------------------------------------------------- 附加: proxy URIError

test('malformed proxy percent-encoding becomes a redacted CollectorConfigError', () => {
  assert.throws(
    () => parseProxy('http://user:p%zz@host:8080'),
    (error) => {
      assert.equal(error.code, CollectorErrorCode.INVALID_CONFIG);
      assert.ok(!error.message.includes('p%zz'), 'the credential section must be redacted');
      return true;
    },
  );
});
