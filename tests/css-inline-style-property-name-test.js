/**
 * 内联 style 的 IDL 名（fontFamily）必须映射到 kebab-case 的 CSS 属性名
 * （font-family），而不是简单 toLowerCase 出来的 `fontfamily`。
 *
 * 修复前 `installCSSPropertyAccessors` 用 `normalizeCSSPropertyName`（只做
 * toLowerCase），于是：
 *
 *   el.style.fontFamily = 'mmllii, SimHei'
 *   el.getAttribute('style')            → "fontfamily: mmllii, SimHei;"  （错：无连字符）
 *
 *   el.style.cssText = 'font-family: a, b'
 *   el.style.fontFamily                 → ""                            （错：读不回来）
 *
 * 存储键（cssText 解析 / setProperty / getComputedStyle 全用 kebab-case）与
 * 访问器键不一致，双向都断。这里锁住两个方向都用 kebab-case。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const PAGE_HTML = '<!doctype html><html><head></head><body></body></html>';

const PROBE = `JSON.stringify((() => {
  const a = document.createElement('div');
  a.style.fontFamily = 'mmllii, SimHei';

  const b = document.createElement('div');
  b.style.cssText = 'font-family: a, b';

  const c = document.createElement('div');
  c.style.backgroundColor = 'rgb(1, 2, 3)';

  return {
    // 写 IDL 名 → 序列化成 kebab-case，且能读回来
    setAttr: a.getAttribute('style'),
    setReadBack: a.style.fontFamily,
    setViaGetProperty: a.style.getPropertyValue('font-family'),
    // cssText 里的 kebab-case → IDL 访问器读得回来
    cssTextReadBack: b.style.fontFamily,
    // 另一个多词属性同样成立
    bgAttr: c.getAttribute('style'),
    bgReadBack: c.style.backgroundColor,
  };
})())`;

async function probe() {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://css.test/page', {
    page: { html: PAGE_HTML },
    limits: { timeoutMs: 30_000 },
  });
  try {
    return JSON.parse(await sandbox.run(PROBE));
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
}

test('setting a camelCase style property serializes to kebab-case and reads back', async () => {
  const observed = await probe();
  assert.equal(observed.setAttr, 'font-family: mmllii, SimHei;');
  assert.equal(observed.setReadBack, 'mmllii, SimHei');
  assert.equal(observed.setViaGetProperty, 'mmllii, SimHei');
  assert.equal(observed.bgAttr, 'background-color: rgb(1, 2, 3);');
  assert.equal(observed.bgReadBack, 'rgb(1, 2, 3)');
});

test('a kebab-case property set via cssText is readable through the camelCase accessor', async () => {
  const observed = await probe();
  assert.equal(observed.cssTextReadBack, 'a, b');
});
