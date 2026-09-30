/**
 * 外部传输中继（`networkRelay`）：把 Realm 的 fetch 交给外部 helper 真发请求。
 *
 * 覆盖：模块协议（命中过滤 / 响应转换 / 错误回退 / 超时 / 进程死亡）与
 * 沙箱端到端（child-process 后端 → 页面 fetch 拿到 helper 响应、Set-Cookie
 * 落进页面的 cookie jar、未命中 origin 仍走 replay-miss 回退）。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { createNetworkRelay } from '../src/engine/core/network-relay.js';

// 伪 helper：JSON Lines 协议。把请求原样回显成响应体；/boom 回错误；
// 带 set-cookie 两条（验证多值保留）；/silent 不回复（测超时）。
const FAKE_HELPER = `
const readline = require('node:readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', line => {
  const request = JSON.parse(line);
  if (request.url.includes('/silent')) return;
  if (request.url.includes('/boom')) {
    console.log(JSON.stringify({ id: request.id, error: 'boom' }));
    return;
  }
  const payload = Buffer.from(JSON.stringify({
    url: request.url,
    method: request.method,
    body: request.body,
    headerCount: request.headers.length,
  })).toString('base64');
  console.log(JSON.stringify({
    id: request.id,
    status: 201,
    statusText: 'Created',
    headers: [
      ['content-type', 'application/json'],
      ['set-cookie', 'relaytest=1; Path=/'],
      ['set-cookie', 'relaytest2=2; Path=/'],
    ],
    body: payload,
    url: request.url,
  }));
});
`;

function fakeRelay(options = {}) {
  return createNetworkRelay({
    command: [process.execPath, '-e', FAKE_HELPER],
    origins: ['https://relay.test'],
    timeoutMs: 5_000,
    ...options,
  });
}

// ------------------------------------------------------------ 模块协议

test('a matching request is relayed and the response is converted losslessly', async () => {
  const relay = fakeRelay();
  try {
    const response = await relay.fetch({
      method: 'POST',
      url: 'https://relay.test/api/x',
      headers: { 'content-type': 'text/plain', 'x-note': 'hi' },
      body: new TextEncoder().encode('hello'),
    });
    assert.notEqual(response, null);
    assert.equal(response.status, 201);
    assert.equal(response.statusText, 'Created');
    assert.equal(response.url, 'https://relay.test/api/x');
    // 多条 set-cookie 必须以键值对列表形态保留，不能被合并成一条
    const setCookies = response.headers
      .filter(([name]) => name === 'set-cookie')
      .map(([, value]) => value);
    assert.deepEqual(setCookies, ['relaytest=1; Path=/', 'relaytest2=2; Path=/']);
    const echoed = JSON.parse(new TextDecoder().decode(response.body));
    assert.equal(echoed.url, 'https://relay.test/api/x');
    assert.equal(echoed.method, 'POST');
    assert.equal(echoed.body, Buffer.from('hello').toString('base64'));
    assert.equal(echoed.headerCount, 2);
  } finally {
    relay.dispose();
  }
});

test('a non-matching origin returns null without touching the helper', async () => {
  const relay = fakeRelay();
  try {
    const response = await relay.fetch({
      method: 'GET',
      url: 'https://other.test/page',
      headers: {},
      body: null,
    });
    assert.equal(response, null);
  } finally {
    relay.dispose();
  }
});

test('a helper error falls back to replay (null)', async () => {
  const relay = fakeRelay();
  try {
    const response = await relay.fetch({
      method: 'POST',
      url: 'https://relay.test/boom',
      headers: {},
      body: null,
    });
    assert.equal(response, null);
  } finally {
    relay.dispose();
  }
});

test('a silent helper times out into replay fallback', async () => {
  const relay = fakeRelay({ timeoutMs: 300 });
  try {
    const started = Date.now();
    const response = await relay.fetch({
      method: 'GET',
      url: 'https://relay.test/silent',
      headers: {},
      body: null,
    });
    assert.equal(response, null);
    assert.ok(Date.now() - started >= 250, 'must wait for the timeout window');
  } finally {
    relay.dispose();
  }
});

test('a dead helper (spawn failure) fails open to replay', async () => {
  const relay = createNetworkRelay({
    command: ['Z:\\definitely-missing\\nv8-relay-helper.exe'],
    origins: ['https://relay.test'],
    timeoutMs: 1_000,
  });
  try {
    const response = await relay.fetch({
      method: 'GET',
      url: 'https://relay.test/x',
      headers: {},
      body: null,
    });
    assert.equal(response, null);
  } finally {
    relay.dispose();
  }
});

test('after dispose every request falls back without process leakage', async () => {
  const relay = fakeRelay();
  await relay.fetch({ method: 'GET', url: 'https://relay.test/a', headers: {}, body: null });
  relay.dispose();
  const response = await relay.fetch({
    method: 'GET',
    url: 'https://relay.test/b',
    headers: {},
    body: null,
  });
  assert.equal(response, null);
});

// ------------------------------------------------------------ 沙箱端到端

const PAGE_HTML = '<!doctype html><html><head></head><body></body></html>';

async function withSandbox(body) {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://relay.test/page', {
    page: { html: PAGE_HTML },
    limits: { timeoutMs: 30_000 },
    networkRelay: {
      enabled: true,
      command: [process.execPath, '-e', FAKE_HELPER],
      origins: ['https://relay.test'],
      timeoutMs: 10_000,
    },
  });
  try {
    return await body(sandbox);
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
}

test('realm fetch receives the relayed live response', async () => {
  await withSandbox(async sandbox => {
    const observed = JSON.parse(await sandbox.run(`(async () => {
      const response = await fetch('https://relay.test/live/one', {
        method: 'POST',
        body: 'hello-relay',
      });
      const payload = await response.json();
      return JSON.stringify({
        status: response.status,
        contentType: response.headers.get('content-type'),
        echoedBody: payload.body,
        echoedUrl: payload.url,
      });
    })()`));
    assert.equal(observed.status, 201);
    assert.equal(observed.contentType, 'application/json');
    assert.equal(observed.echoedBody, Buffer.from('hello-relay').toString('base64'));
    assert.equal(observed.echoedUrl, 'https://relay.test/live/one');
  });
});

test('relayed Set-Cookie headers land in the realm cookie jar', async () => {
  await withSandbox(async sandbox => {
    const cookie = JSON.parse(await sandbox.run(`(async () => {
      await fetch('https://relay.test/live/cookie', { method: 'GET' });
      return JSON.stringify(document.cookie);
    })()`));
    assert.match(cookie, /relaytest=1/);
    assert.match(cookie, /relaytest2=2/);
  });
});

test('unmatched origins still fail as replay-miss (fallback path intact)', async () => {
  await withSandbox(async sandbox => {
    const outcome = JSON.parse(await sandbox.run(`(async () => {
      try {
        await fetch('https://offline.test/nope');
        return JSON.stringify({ rejected: false });
      } catch (error) {
        return JSON.stringify({ rejected: true, message: String(error && error.message) });
      }
    })()`));
    assert.equal(outcome.rejected, true);
    assert.match(outcome.message, /replay miss/i);
  });
});
