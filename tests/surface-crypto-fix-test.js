/**
 * Gitee IKFD9D 回归：WebCrypto 随机源不得是固定种子。
 *
 * 迁移前每个 Realm 的 `crypto-state` 用固定种子 0x6d2b79f5 的 xorshift32，
 * 同进程两个沙箱的 `getRandomValues` / `randomUUID` / `generateKey` 完全一致，
 * 且序列可预测。这里断言跨沙箱不同、UUID 是合法 v4、generateKey 的原始密钥
 * 也不同。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { createNv8, basicPreset } from '../src/index.js';
import {
  createCryptoObjects,
  cryptoGetRandomValues,
  cryptoRandomUUID,
} from '../src/surface/api/crypto/crypto-runtime.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

async function sampleCrypto() {
  const nv8 = await createNv8({
    plugins: basicPreset,
    profile: { id: 'crypto-seed-test', url: 'https://crypto.test/' },
    trace: false,
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    const result = JSON.parse(await realm.evaluate(`(async () => {
      const first = new Uint8Array(16);
      const second = new Uint8Array(16);
      crypto.getRandomValues(first);
      crypto.getRandomValues(second);
      const key = await crypto.subtle.generateKey(
        { name: 'HMAC', hash: 'SHA-256' },
        true,
        ['sign'],
      );
      const raw = new Uint8Array(await crypto.subtle.exportKey('raw', key));
      return JSON.stringify({
        first: [...first],
        second: [...second],
        uuid: crypto.randomUUID(),
        key: [...raw],
      });
    })()`));
    await nv8.sandbox.destroyRealm(realm.id);
    return result;
  } finally {
    await nv8.destroy();
  }
}

test('two sandboxes in one process produce different crypto randomness', async () => {
  const first = await sampleCrypto();
  const second = await sampleCrypto();

  assert.deepEqual(first.first.length, 16);
  assert.deepEqual(second.first.length, 16);
  assert.notDeepEqual(first.first, second.first, '跨沙箱 getRandomValues 不能相同');
  assert.notDeepEqual(first.key, second.key, '跨沙箱 generateKey 不能相同');

  assert.match(first.uuid, UUID_V4, 'randomUUID 必须是 v4');
  assert.match(second.uuid, UUID_V4, 'randomUUID 必须是 v4');
  assert.notEqual(first.uuid, second.uuid, '跨沙箱 randomUUID 不能相同');
  assert.notDeepEqual(first.first, first.second, '同一 Realm 连续两次不能相同');
});

test('the host-entropy-free fallback still differs across realms', () => {
  // legacy bootstrap 拿不到宿主熵源，走 HMAC-DRBG 兜底；固定种子缺陷
  // 也必须不复现。
  const firstRealm = createCryptoObjects({});
  const secondRealm = createCryptoObjects({});
  const first = new Uint8Array(16);
  const second = new Uint8Array(16);
  cryptoGetRandomValues(firstRealm.crypto, first);
  cryptoGetRandomValues(secondRealm.crypto, second);
  assert.notDeepEqual([...first], [...second], '兜底随机源也要跨 Realm 不同');
  const third = new Uint8Array(16);
  cryptoGetRandomValues(firstRealm.crypto, third);
  assert.notDeepEqual([...first], [...third], '同一 Realm 连续两次不能相同');
  assert.match(cryptoRandomUUID(firstRealm.crypto), UUID_V4);
});
