/**
 * Gitee IKFD9V 回归：removeEventListener 之后重新添加必须重新生效。
 *
 * 迁移前 remove / once 只把条目标成 `removed = true`，而 add 的判重不看这个
 * 标记，于是重新 add 被当成重复、监听器永久不触发。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { createNv8, basicPreset } from '../src/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

test('remove-then-add and once-then-add listeners fire again', async () => {
  const nv8 = await createNv8({
    plugins: basicPreset,
    profile: { id: 'event-target-fix', url: 'https://events.test/' },
    trace: false,
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    const result = JSON.parse(await realm.evaluate(`(() => {
      const target = new EventTarget();
      const order = [];
      const handler = () => order.push('readd');
      target.addEventListener('probe', handler);
      target.removeEventListener('probe', handler);
      target.addEventListener('probe', handler);
      target.dispatchEvent(new Event('probe'));
      const afterRemove = order.length;

      const once = () => order.push('once');
      target.addEventListener('once', once, { once: true });
      target.dispatchEvent(new Event('once'));
      target.addEventListener('once', once, { once: true });
      target.dispatchEvent(new Event('once'));
      const afterOnce = order.length;

      const dedupe = () => order.push('dedupe');
      target.addEventListener('dedupe', dedupe);
      target.addEventListener('dedupe', dedupe);
      target.dispatchEvent(new Event('dedupe'));
      const afterDedupe = order.length;

      // remove 后不应再触发
      target.removeEventListener('dedupe', dedupe);
      target.dispatchEvent(new Event('dedupe'));
      const afterFinalRemove = order.length;

      return JSON.stringify({ afterRemove, afterOnce, afterDedupe, afterFinalRemove, order });
    })()`));
    assert.equal(result.afterRemove, 1, 'remove → 重加后应触发一次');
    assert.equal(result.afterOnce, 3, 'once 触发后重加应再次触发');
    assert.equal(result.afterDedupe, 4, '重复 add 同一函数只注册一次');
    assert.equal(result.afterFinalRemove, 4, 'remove 后不再触发');
  } finally {
    await nv8.destroy();
  }
});
