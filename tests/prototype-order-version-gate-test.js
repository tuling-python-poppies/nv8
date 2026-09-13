/**
 * Gitee IKF3A3 回归：原型顺序修正表的版本门控必须是数据驱动的。
 *
 * 迁移前 `finalizePrototypeSurfaceOrder()` 写死 `browserMajorVersion !== 152`
 * 就 return。150/151 profile 跳过是对的（那些项还不存在或不是这个顺序），
 * 但 153+ profile 也会静默跳过——修正过的顺序退回安装顺序，Surface 顺序
 * 悄悄偏离真实 Edge。
 *
 * profile 校验（src/config）目前只允许 150–152，所以这里直接走 legacy
 * Realm 创建入口，用一个 153 的 browserMajorVersion 验证门控语义。
 */

import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  activateRealmShell,
  createRealmShellAsync,
} from '../src/engine/realm/create-realm.js';
import { EDGE_152_PROTOTYPE_ORDER } from '../src/surface/install/prototype-surface-order.js';

test('the 153 profile still applies the Edge 152 prototype order corrections', async () => {
  const origin = 'https://prototype-order-153.test';
  const shell = await createRealmShellAsync('prototype-order-153', origin);
  const realm = activateRealmShell(shell, {
    label: 'prototype-order-153',
    origin,
    pageUrl: `${origin}/`,
    pageHtml: '<!doctype html><html><head></head><body></body></html>',
    browserMajorVersion: 153,
  });
  try {
    const names = Object.keys(EDGE_152_PROTOTYPE_ORDER);
    const observed = JSON.parse(vm.runInContext(`JSON.stringify(Object.fromEntries(
      ${JSON.stringify(names)}.map((name) => [
        name,
        Reflect.ownKeys(globalThis[name].prototype)
          .filter((key) => typeof key === 'string'),
      ]),
    ))`, realm.context));
    for (const [name, expected] of Object.entries(EDGE_152_PROTOTYPE_ORDER)) {
      assert.deepEqual(observed[name], expected, name);
    }
  } finally {
    realm.moduleLoader?.dispose?.();
  }
});
