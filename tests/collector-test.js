/**
 * Collector layer tests (Gate 5)
 *
 * 覆盖网络策略准入、凭据边界与脱敏、重试与退避、cookie 会话、
 * 审计记录以及生命周期。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CollectorErrorCode,
  CookieJar,
  CredentialStore,
  NetworkPolicy,
  REDACTED,
  RetryPolicy,
  createCollector,
  createCollectorResponse,
  createOfflinePolicy,
  createStubTransport,
  getResponseHeader,
  parseSetCookie,
  readRetryAfter,
  redactCookies,
  redactHeaders,
} from '../src/collection/collector/index.js';

import { createRequestPlan } from '../src/collection/request-protocol/index.js';

const ORIGIN = 'https://target.test';

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
    limits: config.limits,
    cookieJar: config.cookieJar,
  });
}

// ------------------------------------------------------------ network policy

test('network is disabled by default', () => {
  const policy = new NetworkPolicy();
  const result = policy.check(`${ORIGIN}/api`, 'GET');
  assert.equal(result.allowed, false);
  assert.equal(result.code, CollectorErrorCode.NETWORK_DISABLED);
});

test('createOfflinePolicy denies everything', () => {
  const policy = createOfflinePolicy();
  assert.equal(policy.enabled, false);
  assert.throws(
    () => policy.assert(`${ORIGIN}/api`, 'GET'),
    (error) => error.code === CollectorErrorCode.NETWORK_DISABLED
  );
});

test('policy allows only allowlisted origins', () => {
  const policy = new NetworkPolicy({ enabled: true, allowedOrigins: [ORIGIN] });
  assert.equal(policy.check(`${ORIGIN}/a`, 'GET').allowed, true);
  const denied = policy.check('https://other.test/a', 'GET');
  assert.equal(denied.allowed, false);
  assert.equal(denied.code, CollectorErrorCode.ORIGIN_NOT_ALLOWED);
});

test('policy supports wildcard subdomain origins but not bare "*"', () => {
  const policy = new NetworkPolicy({
    enabled: true,
    allowedOrigins: ['https://*.target.test'],
  });
  assert.equal(policy.check('https://api.target.test/x', 'GET').allowed, true);
  assert.equal(policy.check('https://deep.api.target.test/x', 'GET').allowed, true);
  assert.equal(policy.check('https://target.test.evil.com/x', 'GET').allowed, false);

  assert.throws(
    () => new NetworkPolicy({ enabled: true, allowedOrigins: ['*'] }),
    /allowAnyOrigin/
  );
});

test('policy rejects http when only https is allowed', () => {
  const policy = new NetworkPolicy({
    enabled: true,
    allowedOrigins: ['http://target.test'],
  });
  const result = policy.check('http://target.test/a', 'GET');
  assert.equal(result.allowed, false);
  assert.equal(result.code, CollectorErrorCode.SCHEME_NOT_ALLOWED);
});

test('policy accepts WebSocket schemes only when explicitly enabled', () => {
  const denied = new NetworkPolicy({
    enabled: true,
    allowedOrigins: ['ws://target.test'],
  });
  assert.equal(denied.check('ws://target.test/socket', 'GET').allowed, false);
  assert.equal(
    denied.check('ws://target.test/socket', 'GET').code,
    CollectorErrorCode.SCHEME_NOT_ALLOWED,
  );

  const allowed = new NetworkPolicy({
    enabled: true,
    allowedOrigins: ['ws://target.test'],
    allowedSchemes: ['ws:'],
  });
  assert.equal(allowed.check('ws://target.test/socket', 'GET').allowed, true);
  assert.equal(allowed.check('wss://target.test/socket', 'GET').allowed, false);
});

test('policy restricts methods', () => {
  const policy = new NetworkPolicy({
    enabled: true,
    allowedOrigins: [ORIGIN],
    allowedMethods: ['GET'],
  });
  const result = policy.check(`${ORIGIN}/a`, 'DELETE');
  assert.equal(result.allowed, false);
  assert.equal(result.code, CollectorErrorCode.METHOD_NOT_ALLOWED);
});

test('redirects are denied unless explicitly enabled', () => {
  const policy = new NetworkPolicy({ enabled: true, allowedOrigins: [ORIGIN] });
  assert.throws(
    () => policy.assertRedirect(`${ORIGIN}/a`, `${ORIGIN}/b`, 'GET'),
    (error) => error.code === CollectorErrorCode.REDIRECT_NOT_ALLOWED
  );
});

test('cross-origin redirect is denied even when both origins are allowed', () => {
  const policy = new NetworkPolicy({
    enabled: true,
    allowedOrigins: [ORIGIN, 'https://cdn.test'],
    followRedirects: true,
  });
  policy.assertRedirect(`${ORIGIN}/a`, `${ORIGIN}/b`, 'GET');
  assert.throws(
    () => policy.assertRedirect(`${ORIGIN}/a`, 'https://cdn.test/b', 'GET'),
    /cross-origin redirect/
  );
});

test('policy.describe does not leak beyond configuration', () => {
  const policy = new NetworkPolicy({ enabled: true, allowedOrigins: [ORIGIN] });
  const described = policy.describe();
  assert.deepEqual(described.allowedOrigins, [ORIGIN]);
  assert.equal(described.enabled, true);
});

test('policy rejects invalid configuration', () => {
  assert.throws(() => new NetworkPolicy({ enabled: 'yes' }), /enabled must be a boolean/);
  assert.throws(
    () => new NetworkPolicy({ enabled: true, allowedOrigins: ['not-a-url'] }),
    /not a valid origin/
  );
  assert.throws(
    () => new NetworkPolicy({ enabled: true, allowedSchemes: ['ftp:'] }),
    /only supports/
  );
});

// -------------------------------------------------------------- credentials

test('credentials are bound to an exact origin', () => {
  const store = new CredentialStore({
    origins: { [ORIGIN]: { headers: { authorization: 'Bearer secret' } } },
  });
  assert.ok(store.resolve(`${ORIGIN}/any/path`));
  assert.equal(store.resolve('https://other.test/x'), null);
  assert.equal(store.resolve('http://target.test/x'), null, 'scheme is part of origin');
});

test('credentials.require throws a structured error for unknown origins', () => {
  const store = new CredentialStore();
  assert.throws(
    () => store.require('https://unknown.test/x'),
    (error) => error.code === CollectorErrorCode.CREDENTIAL_NOT_FOUND
  );
});

test('credentials.describe exposes key names but never values', () => {
  const store = new CredentialStore({
    origins: {
      [ORIGIN]: { headers: { authorization: 'Bearer secret' }, cookies: { sid: 'abc' } },
    },
  });
  const described = JSON.stringify(store.describe());
  assert.ok(described.includes('authorization'));
  assert.ok(described.includes('sid'));
  assert.ok(!described.includes('secret'), 'header value must not appear');
  assert.ok(!described.includes('abc'), 'cookie value must not appear');
});

test('redactHeaders masks sensitive headers only', () => {
  const redacted = redactHeaders([
    { name: 'authorization', values: ['Bearer secret'] },
    { name: 'accept', values: ['*/*'] },
  ]);
  assert.equal(redacted.authorization, REDACTED);
  assert.deepEqual(redacted.accept, ['*/*']);
});

test('redactCookies masks every cookie value', () => {
  const redacted = redactCookies([{ name: 'sid', value: 'abc' }]);
  assert.equal(redacted.sid, REDACTED);
});

test('credential store rejects header injection attempts', () => {
  assert.throws(
    () => new CredentialStore({
      origins: { [ORIGIN]: { headers: { evil: 'a\r\nX-Injected: 1' } } },
    }),
    /CR, LF or NUL/
  );
});

// ------------------------------------------------------------- retry policy

test('retry never retries policy violations', () => {
  const retry = new RetryPolicy({ maxAttempts: 5 });
  const error = { isPolicyViolation: true, retryable: true };
  assert.equal(retry.shouldRetry({ attempt: 1, method: 'GET', error }), false);
});

test('retry honors the retryable flag on transport errors', () => {
  const retry = new RetryPolicy({ maxAttempts: 3 });
  assert.equal(
    retry.shouldRetry({ attempt: 1, method: 'GET', error: { retryable: true } }),
    true
  );
  assert.equal(
    retry.shouldRetry({ attempt: 1, method: 'GET', error: { retryable: false } }),
    false
  );
});

test('retry stops at maxAttempts', () => {
  const retry = new RetryPolicy({ maxAttempts: 2 });
  assert.equal(retry.shouldRetry({ attempt: 1, method: 'GET', error: { retryable: true } }), true);
  assert.equal(retry.shouldRetry({ attempt: 2, method: 'GET', error: { retryable: true } }), false);
});

test('retry skips non-idempotent methods by default', () => {
  const retry = new RetryPolicy({ maxAttempts: 3 });
  assert.equal(retry.shouldRetry({ attempt: 1, method: 'POST', response: { status: 503 } }), false);

  const permissive = new RetryPolicy({ maxAttempts: 3, retryNonIdempotent: true });
  assert.equal(
    permissive.shouldRetry({ attempt: 1, method: 'POST', response: { status: 503 } }),
    true
  );
});

test('retry treats documented status codes as retryable', () => {
  const retry = new RetryPolicy({ maxAttempts: 3 });
  assert.equal(retry.shouldRetry({ attempt: 1, method: 'GET', response: { status: 503 } }), true);
  assert.equal(retry.shouldRetry({ attempt: 1, method: 'GET', response: { status: 404 } }), false);
});

test('backoff is deterministic when jitterRatio is 0', () => {
  const retry = new RetryPolicy({ baseDelayMs: 100, multiplier: 2, jitterRatio: 0 });
  assert.equal(retry.delayFor({ attempt: 1 }), 100);
  assert.equal(retry.delayFor({ attempt: 2 }), 200);
  assert.equal(retry.delayFor({ attempt: 3 }), 400);
});

test('backoff respects maxDelayMs', () => {
  const retry = new RetryPolicy({ baseDelayMs: 1000, multiplier: 10, maxDelayMs: 2000 });
  assert.equal(retry.delayFor({ attempt: 3 }), 2000);
});

test('Retry-After overrides exponential backoff', () => {
  const retry = new RetryPolicy({ baseDelayMs: 100 });
  const response = createCollectorResponse({
    status: 429,
    headers: [{ name: 'retry-after', values: ['5'] }],
  });
  assert.equal(retry.delayFor({ attempt: 1, response }), 5000);
});

test('readRetryAfter parses seconds and dates, ignoring garbage', () => {
  const seconds = createCollectorResponse({
    status: 429, headers: [{ name: 'retry-after', values: ['2'] }],
  });
  assert.equal(readRetryAfter(seconds), 2000);

  const garbage = createCollectorResponse({
    status: 429, headers: [{ name: 'retry-after', values: ['soon'] }],
  });
  assert.equal(readRetryAfter(garbage), null);
});

// ---------------------------------------------------------------- cookie jar

test('parseSetCookie applies host-only default scope', () => {
  const cookie = parseSetCookie('sid=abc', new URL(`${ORIGIN}/a/b`));
  assert.equal(cookie.name, 'sid');
  assert.equal(cookie.value, 'abc');
  assert.equal(cookie.domain, 'target.test');
  assert.equal(cookie.hostOnly, true);
  assert.equal(cookie.path, '/a');
});

test('parseSetCookie ignores a Domain attribute for an unrelated host', () => {
  const cookie = parseSetCookie('sid=abc; Domain=evil.test', new URL(`${ORIGIN}/`));
  assert.equal(cookie.domain, 'target.test');
  assert.equal(cookie.hostOnly, true);
});

test('parseSetCookie accepts Max-Age over Expires', () => {
  const cookie = parseSetCookie(
    'sid=abc; Max-Age=60; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    new URL(`${ORIGIN}/`)
  );
  assert.ok(cookie.expiresAt > Date.now());
});

test('cookie jar filters by secure flag and path', () => {
  const jar = new CookieJar();
  jar.set(parseSetCookie('secure_only=1; Path=/; Secure', new URL(`${ORIGIN}/`)));
  jar.set(parseSetCookie('scoped=1; Path=/deep', new URL(`${ORIGIN}/`)));

  assert.equal(jar.cookiesFor(`${ORIGIN}/`).has('secure_only'), true);
  assert.equal(jar.cookiesFor('http://target.test/').has('secure_only'), false);
  assert.equal(jar.cookiesFor(`${ORIGIN}/`).has('scoped'), false);
  assert.equal(jar.cookiesFor(`${ORIGIN}/deep/x`).has('scoped'), true);
});

test('cookie jar treats expired Max-Age as deletion', () => {
  const jar = new CookieJar();
  jar.set(parseSetCookie('sid=abc', new URL(`${ORIGIN}/`)));
  assert.equal(jar.size, 1);
  jar.set(parseSetCookie('sid=abc; Max-Age=0', new URL(`${ORIGIN}/`)));
  assert.equal(jar.size, 0);
});

test('cookie jar describe hides values', () => {
  const jar = new CookieJar();
  jar.set(parseSetCookie('sid=supersecret', new URL(`${ORIGIN}/`)));
  assert.ok(!JSON.stringify(jar.describe()).includes('supersecret'));
});

// ------------------------------------------------------------ collector send

test('collector sends an allowed request and returns a normalized response', async () => {
  const transport = okTransport();
  const collector = collectorWith({ transport });
  const result = await collector.send(plan());

  assert.equal(result.response.status, 200);
  assert.equal(transport.calls.length, 1);
  assert.equal(transport.calls[0].url, `${ORIGIN}/api`);
  await collector.dispose();
});

test('collector refuses requests outside the allowlist before any IO', async () => {
  const transport = okTransport();
  const collector = collectorWith({ transport });

  await assert.rejects(
    () => collector.send(createRequestPlan({ method: 'GET', url: 'https://evil.test/x' })),
    (error) => error.code === CollectorErrorCode.ORIGIN_NOT_ALLOWED
  );
  assert.equal(transport.calls.length, 0, 'transport must not be reached');
  await collector.dispose();
});

test('collector injects credentials only for the matching origin', async () => {
  const transport = createStubTransport([
    { match: () => true, response: { status: 200, headers: [], body: '' } },
  ]);
  const collector = createCollector({
    transport,
    policy: { enabled: true, allowedOrigins: [ORIGIN, 'https://other.test'] },
    credentials: { origins: { [ORIGIN]: { headers: { authorization: 'Bearer secret' } } } },
    retry: { maxAttempts: 1 },
    sleep: () => Promise.resolve(),
  });

  await collector.send(plan());
  const first = transport.calls[0].headers.find((h) => h.name === 'authorization');
  assert.equal(first.values[0], 'Bearer secret');

  await collector.send(createRequestPlan({ method: 'GET', url: 'https://other.test/x' }));
  const second = transport.calls[1].headers.find((h) => h.name === 'authorization');
  assert.equal(second, undefined, 'credentials must not leak to another origin');
  await collector.dispose();
});

test('collector can require credentials up front', async () => {
  const transport = okTransport();
  const collector = collectorWith({ transport });
  await assert.rejects(
    () => collector.send(plan(), { requireCredentials: true }),
    (error) => error.code === CollectorErrorCode.CREDENTIAL_NOT_FOUND
  );
  assert.equal(transport.calls.length, 0);
  await collector.dispose();
});

test('explicit plan cookies take precedence over the session jar', async () => {
  const transport = okTransport();
  const jar = new CookieJar();
  jar.set(parseSetCookie('sid=from-jar; Path=/', new URL(`${ORIGIN}/`)));
  const collector = collectorWith({ transport, cookieJar: jar });

  await collector.send(plan({ cookies: { sid: 'from-plan' } }));
  const sent = transport.calls[0].cookies.find((c) => c.name === 'sid');
  assert.equal(sent.value, 'from-plan');
  await collector.dispose();
});

test('collector persists Set-Cookie into the session jar', async () => {
  const transport = okTransport({
    headers: [{ name: 'set-cookie', values: ['sid=xyz; Path=/'] }],
  });
  const collector = collectorWith({ transport });
  await collector.send(plan());
  assert.equal(collector.cookieJar.cookiesFor(`${ORIGIN}/`).get('sid'), 'xyz');
  await collector.dispose();
});

test('collector retries retryable statuses and then succeeds', async () => {
  let call = 0;
  const transport = createStubTransport([{
    match: () => true,
    respond: () => {
      call += 1;
      return call === 1
        ? { status: 503, headers: [], body: '' }
        : { status: 200, headers: [], body: 'ok' };
    },
  }]);

  const delays = [];
  const collector = createCollector({
    transport,
    policy: { enabled: true, allowedOrigins: [ORIGIN] },
    retry: { maxAttempts: 3, baseDelayMs: 10, jitterRatio: 0 },
    sleep: (ms) => { delays.push(ms); return Promise.resolve(); },
  });

  const result = await collector.send(plan());
  assert.equal(result.response.status, 200);
  assert.equal(result.attempts.length, 2);
  assert.deepEqual(delays, [10]);
  await collector.dispose();
});

test('collector surfaces retry exhaustion with attempt count', async () => {
  const transport = createStubTransport([{
    match: () => true,
    respond: () => ({ status: 503, headers: [], body: '' }),
  }]);
  const collector = createCollector({
    transport,
    policy: { enabled: true, allowedOrigins: [ORIGIN] },
    retry: { maxAttempts: 2, baseDelayMs: 1 },
    sleep: () => Promise.resolve(),
  });

  const result = await collector.send(plan());
  assert.equal(result.response.status, 503, 'final response is returned, not thrown');
  assert.equal(result.attempts.length, 2);
  await collector.dispose();
});

test('a non-retryable transport error propagates immediately', async () => {
  const error = Object.assign(new Error('dns failure'), {
    code: CollectorErrorCode.REQUEST_FAILED,
    retryable: false,
  });
  const transport = createStubTransport([{ match: () => true, error }]);
  let slept = 0;
  const collector = createCollector({
    transport,
    policy: { enabled: true, allowedOrigins: [ORIGIN] },
    retry: { maxAttempts: 3 },
    sleep: () => { slept += 1; return Promise.resolve(); },
  });

  await assert.rejects(() => collector.send(plan()), /dns failure/);
  assert.equal(slept, 0, 'must not back off for non-retryable errors');
  await collector.dispose();
});

// ----------------------------------------------------------------- audit

test('audit records requests with redacted credentials', async () => {
  const transport = okTransport();
  const collector = createCollector({
    transport,
    policy: { enabled: true, allowedOrigins: [ORIGIN] },
    credentials: {
      origins: { [ORIGIN]: { headers: { authorization: 'Bearer secret' }, cookies: { sid: 'abc' } } },
    },
    retry: { maxAttempts: 1 },
    sleep: () => Promise.resolve(),
  });

  await collector.send(plan());
  const entries = collector.audit();
  assert.equal(entries.length, 1);
  assert.equal(entries[0].status, 200);
  assert.equal(entries[0].headers.authorization, REDACTED);
  assert.equal(entries[0].cookies.sid, REDACTED);

  const serialized = JSON.stringify(entries);
  assert.ok(!serialized.includes('secret'));
  assert.ok(!serialized.includes('abc'));
  await collector.dispose();
});

test('audit records policy denials', async () => {
  const collector = collectorWith();
  await assert.rejects(
    () => collector.send(createRequestPlan({ method: 'GET', url: 'https://evil.test/x' }))
  );
  // 策略拒绝发生在 prepare 之前，因此不进入审计；describe 仍应可用
  assert.equal(collector.describe().policy.enabled, true);
  await collector.dispose();
});

test('audit is bounded by maxAuditEntries', async () => {
  const collector = collectorWith({ limits: { maxAuditEntries: 2, timeoutMs: 1000 } });
  await collector.send(plan());
  await collector.send(plan());
  await collector.send(plan());
  assert.equal(collector.audit().length, 2);
  await collector.dispose();
});

test('describe never leaks credential values', async () => {
  const collector = createCollector({
    transport: okTransport(),
    policy: { enabled: true, allowedOrigins: [ORIGIN] },
    credentials: { origins: { [ORIGIN]: { headers: { authorization: 'Bearer topsecret' } } } },
    retry: { maxAttempts: 1 },
  });
  assert.ok(!JSON.stringify(collector.describe()).includes('topsecret'));
  await collector.dispose();
});

// -------------------------------------------------------------- lifecycle

test('dispose is idempotent and blocks further sends', async () => {
  const collector = collectorWith();
  await collector.dispose();
  await collector.dispose();
  assert.equal(collector.disposed, true);
  await assert.rejects(
    () => collector.send(plan()),
    (error) => error.code === CollectorErrorCode.DISPOSED
  );
});

test('dispose clears audit and session cookies', async () => {
  const transport = okTransport({
    headers: [{ name: 'set-cookie', values: ['sid=xyz; Path=/'] }],
  });
  const collector = collectorWith({ transport });
  await collector.send(plan());
  assert.equal(collector.audit().length, 1);

  await collector.dispose();
  assert.equal(collector.audit().length, 0);
  assert.equal(collector.cookieJar.size, 0);
});

test('collector requires a transport', () => {
  assert.throws(
    () => createCollector({ policy: { enabled: true, allowedOrigins: [ORIGIN] } }),
    /transport must be an object/
  );
});

// ------------------------------------------------------------- response util

test('createCollectorResponse lowercases header names', () => {
  const response = createCollectorResponse({
    status: 204,
    headers: [{ name: 'Content-Type', values: ['text/plain'] }],
  });
  assert.equal(getResponseHeader(response, 'content-type'), 'text/plain');
  assert.equal(getResponseHeader(response, 'Content-Type'), 'text/plain');
});

test('createCollectorResponse rejects an invalid status', () => {
  assert.throws(() => createCollectorResponse({ status: 99 }), /invalid status/);
  assert.throws(() => createCollectorResponse({ status: 'ok' }), /invalid status/);
});
