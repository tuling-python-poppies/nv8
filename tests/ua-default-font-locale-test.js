/**
 * profile 的 locale 必须与 UA 默认样式表的标准字体族配对
 *
 * 修复前：profile 声明 `locale: "zh-CN"`，而 `css-ua-defaults.js` 里 `fontFamily`
 * 的基线是 `"Times New Roman"`——那是 **en-US** 的默认字体。于是
 *
 * ```
 * navigator.language                              → "zh-CN"
 * getComputedStyle(document.body).fontFamily      → "Times New Roman"
 * ```
 *
 * 读这两个值一比就对不上。ADR-0005 把这种情况叫「比缺值更糟的内部矛盾」——
 * 缺一个值只是功能不全，两个值互相打脸是身份造假的直接证据。
 *
 * README 记的是反向的那次修复（「采集机的中文系统语言混进默认样式表，而
 * navigator.language 声明 en-US」）。但 profile 实际写的是 zh-CN，所以当时把采集器
 * 锁到 `--lang=en-US` 是**制造**了矛盾——修了采集器没修 profile。
 *
 * ## 实测基准（Windows 11 + Edge 152）
 *
 * | `--lang` | body fontFamily |
 * |---|---|
 * | en-US / en-GB / de-DE / ru-RU / zh-TW | `"Times New Roman"` |
 * | zh-CN | `"Noto Sans SC"` |
 * | ja-JP | `"Yu Gothic"` |
 * | ko-KR | `"Malgun Gothic"` |
 *
 * `<pre>` 在八个 locale 下一律 `monospace`——标签级 override 与 locale 无关，
 * 所以覆盖只能作用于**基线**值。
 *
 * ## 为什么是一致性测试而不是行为探针
 *
 * 探针的期望值来自真实 Edge，而采集器不传 `--lang`，真实 Edge 用的就是采集机的
 * 系统 locale。拿它当基准等于把采集机的 locale 写进契约——ADR-0005 的
 * `fontFamily` 就是这么中招的。所以这里测「profile 声明什么，运行时就该是什么」。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  STANDARD_FONT_BY_LOCALE,
  standardFontFamilyFor,
  validateLocaleFontPair,
} from '../src/infra/fingerprint/ua-default-fonts.js';

const PAGE_HTML = '<!doctype html><html><head></head><body></body></html>';

const PROBE = `JSON.stringify((() => {
  const pre = document.createElement('pre');
  document.body.appendChild(pre);
  return {
    language: navigator.language,
    intlLocale: Intl.DateTimeFormat().resolvedOptions().locale,
    bodyFontFamily: getComputedStyle(document.body).fontFamily,
    preFontFamily: getComputedStyle(pre).fontFamily,
    divFontFamily: (() => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      return getComputedStyle(div).fontFamily;
    })(),
  };
})())`;

async function probeWithLocale(locale) {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const { edge151Fingerprint } = await import('../src/infra/fingerprint/edge-151.js');
  const fingerprint = locale === null ? null : {
    ...edge151Fingerprint,
    browserMajorVersion: 151,
    locale,
    navigator: {
      ...edge151Fingerprint.navigator,
      language: locale,
      languages: [locale, locale.split('-')[0]],
    },
  };
  const sandbox = await createSandbox('https://font.test/page', {
    page: { html: PAGE_HTML },
    limits: { timeoutMs: 30_000 },
    ...(fingerprint === null ? {} : { fingerprint }),
  });
  try {
    return JSON.parse(await sandbox.run(PROBE));
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
}

// ------------------------------------------------------ 查表

test('the locale to font table uses longest-prefix matching', () => {
  assert.equal(standardFontFamilyFor('zh-CN'), '"Noto Sans SC"');
  assert.equal(standardFontFamilyFor('zh-Hans-CN'), '"Noto Sans SC"');
  assert.equal(standardFontFamilyFor('ja-JP'), '"Yu Gothic"');
  assert.equal(standardFontFamilyFor('ja'), '"Yu Gothic"');
  assert.equal(standardFontFamilyFor('ko-KR'), '"Malgun Gothic"');
  // 实测 zh-TW 走通用默认，不跟 zh-CN 一起——所以不能按 `zh` 前缀一刀切
  assert.equal(standardFontFamilyFor('zh-TW'), '"Times New Roman"');
  assert.equal(standardFontFamilyFor('en-US'), '"Times New Roman"');
  assert.equal(standardFontFamilyFor('de-DE'), '"Times New Roman"');
  assert.equal(standardFontFamilyFor('ru-RU'), '"Times New Roman"');
  assert.equal(standardFontFamilyFor(''), '"Times New Roman"');
});

test('the pair validator catches a mismatched declaration', () => {
  assert.deepEqual(validateLocaleFontPair('zh-CN', '"Noto Sans SC"'), []);
  assert.equal(validateLocaleFontPair('zh-CN', '"Times New Roman"').length, 1);
  assert.equal(validateLocaleFontPair('ja-JP', '"Times New Roman"').length, 1);
  // 缺值也要报——这是修复前的状态
  assert.equal(validateLocaleFontPair('zh-CN', '').length, 1);
  // 表外的 locale 允许调用方自己声明（可能在模拟某台特定机器），不拦
  assert.deepEqual(validateLocaleFontPair('fr-FR', '"Some Font"'), []);
});

test('every table entry is a computed-value form string', () => {
  // 计算值里字体名是带引号的（真实浏览器的序列化形态）。漏引号会让
  // `getComputedStyle(...).fontFamily === '"Noto Sans SC"'` 这类比较失败。
  for (const [locale, font] of Object.entries(STANDARD_FONT_BY_LOCALE)) {
    assert.match(font, /^".+"$/u, `${locale} → ${font} is not quoted`);
  }
});

// ------------------------------------------------------ 运行时一致性

test('the default profile keeps language and font family coherent', async () => {
  const observed = await probeWithLocale(null);

  assert.equal(observed.language, 'zh-CN');
  assert.equal(observed.intlLocale, 'zh-CN');
  assert.equal(
    observed.bodyFontFamily, standardFontFamilyFor(observed.language),
    'body font family must match the declared locale',
  );
});

test('switching the locale switches the standard font family', async () => {
  for (const locale of ['en-US', 'ja-JP', 'ko-KR', 'zh-TW']) {
    const observed = await probeWithLocale(locale);
    assert.equal(observed.language, locale);
    assert.equal(observed.intlLocale, locale);
    assert.equal(
      observed.bodyFontFamily, standardFontFamilyFor(locale),
      `${locale} font family did not follow the locale`,
    );
  }
});

test('a tag-level override still wins over the locale baseline', async () => {
  // 覆盖只能作用于**基线**值。`<pre>` 的 monospace 与 locale 无关（实测八个
  // locale 一律 monospace），把它也按 locale 换掉就是修坏了。
  for (const locale of [null, 'en-US', 'ja-JP']) {
    const observed = await probeWithLocale(locale);
    assert.equal(observed.preFontFamily, 'monospace', `${locale} broke <pre>`);
    // 没有标签级 override 的元素跟基线走
    assert.equal(observed.divFontFamily, observed.bodyFontFamily);
  }
});
