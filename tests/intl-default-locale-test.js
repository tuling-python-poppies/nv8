/**
 * `Intl` 的默认 locale 必须跟随 profile
 *
 * 实测（Windows 中文系统）修复前的状态：
 *
 * ```
 * profile 声明 locale=en-US / navigator.language=en-US
 *   Intl.DateTimeFormat().resolvedOptions().locale  → "zh-CN"   ← 宿主机器的
 *   new Intl.ListFormat().format(['a','b','c'])     → "a、b和c"  ← 宿主机器的
 * ```
 *
 * 两层后果：
 *
 * 1. **内部矛盾**：`navigator.language` 与 `Intl.DateTimeFormat().resolvedOptions()`
 *    是最常被一起读的一对字段，对不上是一眼可见的伪造痕迹。
 * 2. **身份随机器变**：同一 profile 在中文机器与英文机器上给出不同身份。与
 *    ADR-0005 的铁律直接冲突，和 `module-bundle.json` 那次「本机命中率恒为 0」
 *    是同一类错。
 *
 * 宿主侧改不了（实测 `LANG` / `LC_ALL` 在 Windows 无效、没有
 * `--icu-default-locale`、`vm.createContext()` 无 locale 选项），所以只能在 Realm
 * 内接管默认值。
 *
 * **这一层不能靠行为探针验证**：探针的期望值来自真实 Edge，而采集时真实 Edge 的
 * 默认 locale 就是采集机的系统 locale——拿它当基准等于把采集机的 locale 写进契约。
 * 所以这里测的是**内部一致性**：profile 声明什么，运行时就该是什么。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const PAGE_HTML = '<!doctype html><html><head></head><body></body></html>';

const PROBE = `JSON.stringify((() => {
  const resolved = Intl.DateTimeFormat().resolvedOptions();
  const numberFormat = new Intl.NumberFormat();
  return {
    navigatorLanguage: navigator.language,
    resolvedLocale: resolved.locale,
    resolvedTimeZone: resolved.timeZone,
    listFormat: new Intl.ListFormat().format(['a', 'b', 'c']),
    relativeTime: new Intl.RelativeTimeFormat().format(-1, 'day'),
    displayRegion: new Intl.DisplayNames(undefined, { type: 'region' }).of('CN'),
    pluralRule: new Intl.PluralRules().select(2),
    collatorLocale: new Intl.Collator().resolvedOptions().locale,
    segmenterLocale: new Intl.Segmenter().resolvedOptions().locale,
    dateToLocaleString: new Date(0).toLocaleString(),
    // 显式 locale 必须原样透传
    explicitNumber: new Intl.NumberFormat('de-DE').format(1234.5),
    explicitList: new Intl.ListFormat('de-DE').format(['a', 'b']),
    // 身份保全
    ctorBacklink: numberFormat.constructor === Intl.NumberFormat,
    instanceOf: numberFormat instanceof Intl.NumberFormat,
    ctorName: Intl.NumberFormat.name,
    ctorLength: Intl.NumberFormat.length,
    ctorToString: Intl.NumberFormat.toString(),
    methodToString: Date.prototype.toLocaleString.toString(),
    supportedLocalesOf: typeof Intl.NumberFormat.supportedLocalesOf,
    prototypeShared: Object.getPrototypeOf(numberFormat) === Intl.NumberFormat.prototype,
  };
})())`;

async function probeWithProfile(patch) {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://locale.test/page', {
    page: { html: PAGE_HTML },
    limits: { timeoutMs: 30_000 },
    ...(patch === null ? {} : { fingerprint: patch }),
  });
  try {
    return JSON.parse(await sandbox.run(PROBE));
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
}

async function enUsProfile() {
  const { edge151Fingerprint } = await import('../src/fingerprint/edge-151.js');
  return {
    ...edge151Fingerprint,
    browserMajorVersion: 151,
    locale: 'en-US',
    timezone: 'America/New_York',
    navigator: {
      ...edge151Fingerprint.navigator,
      language: 'en-US',
      languages: ['en-US', 'en'],
    },
  };
}

// ------------------------------------------------------ 一致性

test('the default profile resolves Intl to its declared locale', async () => {
  const observed = await probeWithProfile(null);

  // 默认 profile 声明 zh-CN / Asia/Shanghai
  assert.equal(observed.navigatorLanguage, 'zh-CN');
  assert.equal(
    observed.resolvedLocale, observed.navigatorLanguage,
    'Intl default locale must equal navigator.language',
  );
  assert.equal(observed.resolvedTimeZone, 'Asia/Shanghai');
  assert.equal(observed.listFormat, 'a、b和c');
  assert.equal(observed.relativeTime, '1天前');
  assert.equal(observed.displayRegion, '中国');
});

test('an en-US profile resolves Intl to en-US on a zh-CN host', async () => {
  // 这条是核心：修复前它会拿到宿主机器的 zh-CN。在英文机器上跑的话反过来
  // ——上一条会红。两条一起才能证明「跟着 profile 而不是跟着机器」。
  const observed = await probeWithProfile(await enUsProfile());

  assert.equal(observed.navigatorLanguage, 'en-US');
  assert.equal(observed.resolvedLocale, 'en-US');
  assert.equal(observed.resolvedTimeZone, 'America/New_York');
  assert.equal(observed.listFormat, 'a, b, and c');
  assert.equal(observed.relativeTime, '1 day ago');
  assert.equal(observed.displayRegion, 'China');
  assert.equal(observed.collatorLocale, 'en-US');
  assert.equal(observed.segmenterLocale, 'en-US');
  assert.equal(observed.pluralRule, 'other');
  assert.equal(observed.dateToLocaleString, '12/31/1969, 7:00:00 PM');
});

test('switching the profile switches every Intl default together', async () => {
  // 部分覆盖比不覆盖更糟：`Intl.DateTimeFormat` 说 en-US 而 `Intl.ListFormat`
  // 说 zh-CN，是 Intl **内部**的自相矛盾。
  const zh = await probeWithProfile(null);
  const en = await probeWithProfile(await enUsProfile());

  for (const key of [
    'resolvedLocale', 'collatorLocale', 'segmenterLocale',
    'listFormat', 'relativeTime', 'displayRegion', 'dateToLocaleString',
  ]) {
    assert.notEqual(
      zh[key], en[key],
      `${key} did not follow the profile locale`,
    );
  }
});

// ------------------------------------------------------ 语义与身份

test('an explicit locale argument is passed through untouched', async () => {
  // 包装的目的是修**默认值**，不是改语义。显式传了 locale 还被替换，
  // 就从「身份不一致」变成「功能错误」。
  for (const patch of [null, await enUsProfile()]) {
    const observed = await probeWithProfile(patch);
    assert.equal(observed.explicitNumber, '1.234,5');
    assert.equal(observed.explicitList, 'a und b');
  }
});

test('wrapping preserves constructor identity and native disguise', async () => {
  const observed = await probeWithProfile(null);

  // 不改 prototype.constructor 回链的话这条会红——那是包装最容易漏的一处
  assert.equal(observed.ctorBacklink, true, 'prototype.constructor must point at the wrapper');
  assert.equal(observed.instanceOf, true);
  assert.equal(observed.prototypeShared, true);
  assert.equal(observed.ctorName, 'NumberFormat');
  assert.equal(observed.ctorLength, 0);
  // 包装函数必须伪装成原生，否则 toString 直接吐出包装体
  assert.equal(observed.ctorToString, 'function NumberFormat() { [native code] }');
  assert.equal(observed.methodToString, 'function toLocaleString() { [native code] }');
  assert.equal(observed.supportedLocalesOf, 'function', 'statics must survive wrapping');
});
