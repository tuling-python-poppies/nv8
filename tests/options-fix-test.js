/**
 * `src/public` 选项归一化的入参校验回归。
 *
 * 覆盖：
 *
 * - IKFD9R：`page` 必须是对象或字符串；非法输入抛 TypeError，不再静默回退默认页
 * - IKFD9Q：局部覆盖 fingerprint 时 UA 兜底走合并后的基线，不退化成裸 Chrome
 * - IKFDAB：partial screen 不抛 RangeError；`pixelDepth` / `avail*` 的 fallback 链
 * - IKFDA2：replay 的 `repeat` / `sequence` / `matching` 入口校验
 * - IKFD9M：`EdgeSandbox.create` 在 start 失败后关闭 controller
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeRuntimeOptions, RUNTIME_OPTION_KEYS, NESTED_OPTION_KEYS } from '../src/public/edge-runtime-options.js';
import { edge150Fingerprint } from '../src/infra/fingerprint/edge-150.js';
import { edge151Fingerprint } from '../src/infra/fingerprint/edge-151.js';

// --------------------------------------------- unknown top-level keys

test('unknown top-level options fail closed instead of being silently dropped', () => {
  for (const options of [
    { environment: {} },
    { proxyTrac: {} },
    { totallyBogusKey: 1 },
  ]) {
    assert.throws(
      () => normalizeRuntimeOptions(options),
      error => error instanceof TypeError && /not supported/.test(error.message),
      `${Object.keys(options)[0]} must be rejected`,
    );
  }
});

test('whitelist exactly matches the keys normalization emits (no drift either way)', () => {
  // 双向相等断言，把 jev 点名的 whitelist_drift 焊死：
  //   缺键 → 归一化新增的选项会被误拒（且 setPage / Agent Session 回环会红）；
  //   多键 → 白名单放过一个归一化其实不读的键，退回静默丢弃。
  const emitted = Object.keys(normalizeRuntimeOptions({})).sort();
  assert.deepStrictEqual(emitted, [...RUNTIME_OPTION_KEYS].sort());
});

// --------------------------------------------- unknown nested keys

test('unknown nested keys fail closed too (not just top-level)', () => {
  // 顶层修了但嵌套层曾静默丢弃，后果更隐蔽：
  //   proxyTrace.enable 拼错 → trace 没开；limits.timeoutMS → 长跑脚本被 1s 杀。
  for (const options of [
    { proxyTrace: { enable: true } },
    { limits: { timeoutMS: 60_000 } },
    { networkCapture: { enable: false } },
    { execution: { backends: 'worker-thread' } },
    { page: { url: 'https://a.test/', htlm: '<p>' } },
    { fingerprint: { scren: { width: 1440 } } },
  ]) {
    const group = Object.keys(options)[0];
    assert.throws(
      () => normalizeRuntimeOptions(options),
      error => error instanceof TypeError && /not supported/.test(error.message),
      `${group} 的嵌套拼错必须报错`,
    );
  }
});

test('correct nested keys still take effect (no false rejection)', () => {
  const o = normalizeRuntimeOptions({
    proxyTrace: { enabled: true },
    limits: { timeoutMs: 60_000, maxBatchConcurrency: 8 },
    networkCapture: { enabled: false },
    execution: { backend: 'worker-thread', restart: 'restart' },
    fingerprint: { locale: 'zh-CN', screen: { width: 1440 } },
  });
  assert.equal(o.proxyTrace.enabled, true);
  assert.equal(o.limits.timeoutMs, 60_000);
  assert.equal(o.networkCapture.enabled, false);
  assert.equal(o.execution.restart, 'restart');
  assert.equal(o.fingerprint.screen.width, 1440);
});

test('each nested whitelist exactly matches the keys that group emits (no drift)', () => {
  // 与顶层同款的双向断言，逐组焊死。fingerprint 只比顶层键（深层有意不管）。
  const normalized = normalizeRuntimeOptions({});
  for (const [group, keys] of Object.entries(NESTED_OPTION_KEYS)) {
    const emitted = Object.keys(normalized[group]).sort();
    assert.deepStrictEqual(
      emitted, [...keys].sort(),
      `${group} 的嵌套白名单与输出键集不一致`,
    );
  }
});

// ------------------------------------------------------------- page (IKFD9R)

test('a page string is accepted as a { url } shorthand', () => {
  const { page } = normalizeRuntimeOptions({ page: 'https://page.test/x' });
  assert.equal(page.url, 'https://page.test/x');
  assert.equal(page.html, '<!doctype html><html><head></head><body></body></html>');
  assert.equal(page.referrer, '');
  assert.equal(page.contentType, 'text/html');
});

test('execution restart policy is preserved and validated', () => {
  assert.equal(
    normalizeRuntimeOptions({ execution: { restart: 'restart' } }).execution.restart,
    'restart',
  );
  assert.equal(
    normalizeRuntimeOptions({ execution: { restart: 'fail-fast' } }).execution.restart,
    'fail-fast',
  );
  assert.throws(
    () => normalizeRuntimeOptions({ execution: { restart: 'silent' } }),
    /execution\.restart/,
  );
});

test('a page object is normalized as before', () => {
  const input = Object.freeze({
    url: 'https://page.test/y',
    html: '<p>y</p>',
    referrer: 'https://ref.test/',
    contentType: 'text/plain',
  });
  assert.deepEqual(normalizeRuntimeOptions({ page: input }).page, input);
});

test('an invalid page value throws instead of silently using the default', () => {
  for (const page of [42, true, [], () => {}, Symbol('page')]) {
    assert.throws(
      () => normalizeRuntimeOptions({ page }),
      TypeError,
      `page = ${String(page)} must be rejected`,
    );
  }
  // null / undefined 仍是"用默认页"，与既有行为一致。
  assert.equal(
    normalizeRuntimeOptions({ page: null }).page.url,
    'https://sandbox.test/',
  );
});

// --------------------------------------------------- fingerprint fallback (IKFD9Q)

test('a partial fingerprint keeps the baseline Edge userAgent', () => {
  const { fingerprint } = normalizeRuntimeOptions({
    fingerprint: {
      locale: 'en-US',
      timezone: 'UTC',
      screen: { width: 1280, height: 720 },
    },
  });
  assert.equal(fingerprint.navigator.userAgent, edge150Fingerprint.navigator.userAgent);
  assert.match(fingerprint.navigator.userAgent, /\bEdg\/150\b/);
  assert.match(fingerprint.navigator.userAgent, /Windows NT 10\.0; Win64; x64/);
  assert.equal(fingerprint.navigator.platform, 'Win32');
});

test('fingerprint.locale drives navigator.language and languages', () => {
  const { fingerprint } = normalizeRuntimeOptions({
    fingerprint: { locale: 'en-US', timezone: 'UTC' },
  });
  assert.equal(fingerprint.locale, 'en-US');
  assert.equal(fingerprint.navigator.language, 'en-US');
  assert.deepEqual(fingerprint.navigator.languages, ['en-US']);
  assert.equal(fingerprint.timezone, 'UTC');
});

test('an explicit navigator object wins over fingerprint.locale', () => {
  const { fingerprint } = normalizeRuntimeOptions({
    fingerprint: {
      locale: 'en-US',
      browserMajorVersion: 151,
      navigator: edge151Fingerprint.navigator,
    },
  });
  assert.equal(fingerprint.navigator.language, 'zh-CN');
  assert.deepEqual(fingerprint.navigator.languages, ['zh-CN', 'zh']);
  assert.equal(
    fingerprint.navigator.userAgent,
    edge151Fingerprint.navigator.userAgent,
  );
});

// -------------------------------------------------- partial screen (IKFDAB)

test('a partial screen does not throw and derives pixelDepth from colorDepth', () => {
  const { fingerprint } = normalizeRuntimeOptions({
    fingerprint: { screen: { width: 800, height: 600 } },
  });
  assert.equal(fingerprint.screen.width, 800);
  assert.equal(fingerprint.screen.height, 600);
  // 此前 fallback 直接用未归一化的 screen.colorDepth（undefined）→ RangeError。
  assert.equal(fingerprint.screen.colorDepth, 24);
  assert.equal(fingerprint.screen.pixelDepth, 24);
});

test('screen.avail* falls back to the baseline field, not to width/height', () => {
  const partial = normalizeRuntimeOptions({
    fingerprint: { screen: { width: 1280, height: 720 } },
  }).fingerprint.screen;
  // 基线是 1920x1080 / avail 1920x1040；旧实现会在缺省时给出 availHeight=1080。
  assert.equal(partial.availWidth, 1920);
  assert.equal(partial.availHeight, 1040);

  const untouched = normalizeRuntimeOptions({}).fingerprint.screen;
  assert.deepEqual(untouched, edge150Fingerprint.screen);
  assert.equal(untouched.availHeight, 1040);
});

test('explicit avail* and pixelDepth values still win', () => {
  const { fingerprint } = normalizeRuntimeOptions({
    fingerprint: {
      screen: {
        width: 1280,
        height: 720,
        availWidth: 1280,
        availHeight: 680,
        colorDepth: 30,
        pixelDepth: 30,
      },
    },
  });
  assert.equal(fingerprint.screen.availWidth, 1280);
  assert.equal(fingerprint.screen.availHeight, 680);
  assert.equal(fingerprint.screen.pixelDepth, 30);
});

test('a partial fingerprint keeps a coherent Edge identity inside the realm', async () => {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://ua.test/page', {
    page: { html: '<!doctype html><html><head></head><body></body></html>' },
    fingerprint: {
      locale: 'en-US',
      timezone: 'UTC',
      screen: { width: 1280, height: 720 },
    },
    limits: { timeoutMs: 30_000 },
  });
  try {
    const observed = JSON.parse(await sandbox.run(`JSON.stringify({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      languages: navigator.languages,
      screenWidth: screen.width,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      pixelDepth: screen.pixelDepth,
    })`));
    assert.match(observed.userAgent, /\bEdg\/150\b/);
    assert.match(observed.userAgent, /Chrome\/150\./);
    assert.equal(observed.platform, 'Win32');
    assert.equal(observed.language, 'en-US');
    assert.deepEqual(observed.languages, ['en-US']);
    assert.equal(observed.screenWidth, 1280);
    assert.equal(observed.availWidth, 1920);
    assert.equal(observed.availHeight, 1040);
    assert.equal(observed.pixelDepth, 24);
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
});

// ----------------------------------------------------- replay validation (IKFDA2)

function replayOptions(entry) {
  return normalizeRuntimeOptions({
    replay: [{ url: 'https://api.test/data', body: '{}', ...entry }],
  });
}

test('legal replay repeat / sequence / matching values are preserved', () => {
  const record = (entry) => replayOptions(entry).replay[0];
  assert.equal(record({}).repeat, 'once');
  assert.equal(record({}).sequence, undefined);
  assert.equal(record({}).matching, null);
  assert.equal(record({ repeat: 'unlimited' }).repeat, 'unlimited');
  assert.equal(record({ repeat: 0 }).repeat, 0);
  assert.equal(record({ repeat: 3 }).repeat, 3);
  assert.equal(record({ sequence: 0 }).sequence, 0);
  assert.equal(record({ sequence: 7 }).sequence, 7);
  for (const matching of [
    'method-url',
    'method-url-body',
    'method-url-body-sha256',
    'exact',
  ]) {
    assert.equal(record({ matching }).matching, matching);
  }
});

test('illegal replay repeat values are rejected at the entrance', () => {
  // 消费端用 `Number(repeat)` 判定次数：这些值会让语义悄悄漂移。
  for (const repeat of ['always', '2', 2.5, -1, true, {}]) {
    assert.throws(
      () => replayOptions({ repeat }),
      TypeError,
      `repeat = ${String(repeat)} must be rejected`,
    );
  }
});

test('illegal replay sequence values are rejected at the entrance', () => {
  for (const sequence of [-1, 1.5, '1', true, {}]) {
    assert.throws(
      () => replayOptions({ sequence }),
      TypeError,
      `sequence = ${String(sequence)} must be rejected`,
    );
  }
});

test('illegal replay matching values are rejected at the entrance', () => {
  // 消费端只做字符串精确比较，未登记的字符串会让所有请求都匹配失败。
  for (const matching of ['bogus', 'method-url-body-sha256-x', 42, {}, /x/]) {
    assert.throws(
      () => replayOptions({ matching }),
      TypeError,
      `matching = ${String(matching)} must be rejected`,
    );
  }
});

// ------------------------------------ EdgeSandbox.create cleanup (IKFD9M)

test('EdgeSandbox.create closes the controller when start fails', async () => {
  const { EdgeSandbox } = await import('../src/public/edge-sandbox.js');
  const { RuntimeController } = await import('../src/backend/controller/runtime-controller.js');
  const originalStart = RuntimeController.prototype.start;
  const originalClose = RuntimeController.prototype.close;
  const events = [];
  let controller = null;

  RuntimeController.prototype.start = async function failingStart() {
    events.push('start');
    throw new Error('init exploded');
  };
  RuntimeController.prototype.close = async function recordingClose() {
    events.push('close');
    controller = this;
    return originalClose.call(this);
  };
  try {
    await assert.rejects(() => EdgeSandbox.create({}), /init exploded/);
  } finally {
    RuntimeController.prototype.start = originalStart;
    RuntimeController.prototype.close = originalClose;
  }

  assert.deepEqual(events, ['start', 'close'], 'create must close after a failed start');
  assert.notEqual(controller, null);
  assert.equal(controller.closed, true, 'the leaked controller must be closed');
  assert.equal(controller.connection.child, null, 'no child process may be left behind');
});
