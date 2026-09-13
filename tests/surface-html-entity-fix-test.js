/**
 * Gitee IKFD9W 回归：越界数字字符引用不能把页面创建打崩。
 *
 * `&#x110000;`（> U+10FFFF）与 `&#xD800;`（代理区）交给
 * `String.fromCodePoint` 会抛 RangeError，解析阶段即可导致 Realm 创建失败。
 * 按 HTML 规范应替换为 U+FFFD。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { createNv8, domPreset } from '../src/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

async function createPageWithEntity(html) {
  const nv8 = await createNv8({
    plugins: domPreset,
    profile: {
      id: 'html-entity-fix',
      url: 'https://entity.test/',
      pageHtml: html,
    },
    trace: false,
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    const text = await realm.evaluate('document.body.textContent');
    return { nv8, realm, text };
  } catch (error) {
    await nv8.destroy();
    throw error;
  }
}

test('out-of-range character references decode to U+FFFD', async () => {
  const { nv8, realm, text } = await createPageWithEntity(
    '<!doctype html><html><body>&#x110000;&#xD800;&#xFFFFFFFF;</body></html>',
  );
  try {
    assert.equal(text, '\uFFFD\uFFFD\uFFFD');
  } finally {
    await nv8.sandbox.destroyRealm(realm.id);
    await nv8.destroy();
  }
});

test('regular entities still decode normally next to the clamped ones', async () => {
  const { nv8, realm, text } = await createPageWithEntity(
    '<!doctype html><html><body>a&amp;b&lt;c&#65;&#x42;</body></html>',
  );
  try {
    assert.equal(text, 'a&b<cAB');
  } finally {
    await nv8.sandbox.destroyRealm(realm.id);
    await nv8.destroy();
  }
});
