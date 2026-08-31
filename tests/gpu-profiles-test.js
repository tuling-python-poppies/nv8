/**
 * GPU 身份组合的内部一致性
 *
 * 一块 GPU 的身份散落在 WebGL 和 WebGPU 的多个字段里。手工改型号时漏掉任何
 * 一处，就出现「WebGL 说 NVIDIA、WebGPU 说 Intel」这类自相矛盾——比用默认值
 * 更容易被识别。
 *
 * 这份测试锁住两件事：
 * 1. 内置的每套组合都自洽（包括 `subgroupMinSize`/`subgroupMaxSize` 这类
 *    真实硬件特性）；
 * 2. `validateGpuIdentity()` 真的能抓到矛盾——否则它只是装饰。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GPU_IDENTITIES,
  DEFAULT_GPU_IDENTITY,
  gpuIdentityById,
  validateGpuIdentity,
} from '../src/fingerprint/gpu-profiles.js';

// ------------------------------------------------- 内置组合自洽

test('every built-in GPU identity is self-consistent', () => {
  assert.ok(GPU_IDENTITIES.length >= 3, 'a single GPU defeats the purpose');

  for (const identity of GPU_IDENTITIES) {
    const problems = validateGpuIdentity(identity);
    assert.deepEqual(problems, [], `${identity.id} is inconsistent`);
  }
});

test('GPU ids are unique and free of redundant vendor prefixes', () => {
  const ids = GPU_IDENTITIES.map((entry) => entry.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate GPU id');

  for (const id of ids) {
    // device 已含厂商名，id 不该出现 "nvidia-nvidia-..." 这种重复
    assert.equal(/^(\w+)-\1/.test(id), false, `${id} repeats its vendor`);
  }
});

test('subgroup sizes reflect real hardware', () => {
  // NVIDIA warp = 32；AMD wave64 = 32–64；Intel EU SIMD = 8–32。
  // 这些不是可以随便填的数字。
  const expected = { nvidia: [32, 32], amd: [32, 64], intel: [8, 32] };

  for (const identity of GPU_IDENTITIES) {
    const [min, max] = expected[identity.webgpu.vendor];
    assert.equal(identity.webgpu.subgroupMinSize, min, `${identity.id} min`);
    assert.equal(identity.webgpu.subgroupMaxSize, max, `${identity.id} max`);
  }
});

test('no built-in identity is a fallback (software) adapter', () => {
  for (const identity of GPU_IDENTITIES) {
    assert.equal(
      identity.webgpu.isFallbackAdapter, false,
      `${identity.id} must not claim software rendering`
    );
  }
});

// ------------------------------------------------- 查找

test('gpuIdentityById returns the requested identity', () => {
  const identity = gpuIdentityById('amd-radeon-rx-7600');
  assert.equal(identity.webgpu.device, 'AMD Radeon RX 7600');
  assert.equal(identity.webglVendor, 'Google Inc. (AMD)');
});

test('gpuIdentityById rejects unknown ids with the known list', () => {
  assert.throws(
    () => gpuIdentityById('nvidia-geforce-rtx-9999'),
    (error) => {
      assert.ok(error instanceof RangeError);
      // 报错要能自助排查，光说"unknown"没用
      assert.match(error.message, /nvidia-geforce-rtx-5060/);
      return true;
    }
  );
});

// ------------------------------------------------- 与 profile 对齐

test('the default identity matches the edge-150 rendering profile', async () => {
  const { edge150Fingerprint } = await import('../src/fingerprint/edge-150.js');
  const rendering = edge150Fingerprint.rendering;

  assert.equal(DEFAULT_GPU_IDENTITY.webglVendor, rendering.webglVendor);
  assert.equal(DEFAULT_GPU_IDENTITY.webglRenderer, rendering.webglRenderer);
  assert.equal(DEFAULT_GPU_IDENTITY.webgpu.device, rendering.webgpu.device);
});

test('shipped fingerprint profiles are internally consistent', async () => {
  const { edge150Fingerprint } = await import('../src/fingerprint/edge-150.js');
  const { edge151Fingerprint } = await import('../src/fingerprint/edge-151.js');

  for (const [name, fingerprint] of [
    ['edge-150', edge150Fingerprint],
    ['edge-151', edge151Fingerprint],
  ]) {
    assert.deepEqual(
      validateGpuIdentity(fingerprint.rendering), [],
      `${name} has a contradictory GPU identity`
    );
  }
});

// ------------------------------------------------- 校验器本身有效

test('validateGpuIdentity catches a WebGL/WebGPU vendor mismatch', () => {
  const problems = validateGpuIdentity({
    ...DEFAULT_GPU_IDENTITY,
    webglVendor: 'Google Inc. (Intel)', // WebGPU 仍说 nvidia
  });
  assert.ok(problems.length > 0);
  assert.match(problems[0], /disagrees with webgpu\.vendor/);
});

test('validateGpuIdentity catches a renderer that omits the device', () => {
  const problems = validateGpuIdentity({
    ...DEFAULT_GPU_IDENTITY,
    webglRenderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4090 Direct3D11)',
  });
  assert.ok(problems.some((entry) => /does not mention webgpu\.device/.test(entry)));
});

test('validateGpuIdentity catches an impossible subgroup size', () => {
  const problems = validateGpuIdentity({
    ...DEFAULT_GPU_IDENTITY,
    webgpu: { ...DEFAULT_GPU_IDENTITY.webgpu, subgroupMinSize: 16, subgroupMaxSize: 16 },
  });
  assert.ok(problems.some((entry) => /not a real nvidia configuration/.test(entry)));
});

test('validateGpuIdentity catches a driver string from the wrong vendor', () => {
  const problems = validateGpuIdentity({
    ...DEFAULT_GPU_IDENTITY,
    webgpu: { ...DEFAULT_GPU_IDENTITY.webgpu, description: 'Intel driver 31.0.101.5333' },
  });
  assert.ok(problems.some((entry) => /does not mention NVIDIA/.test(entry)));
});

test('validateGpuIdentity reports a missing webgpu section instead of throwing', () => {
  const problems = validateGpuIdentity({ webglVendor: 'x', webglRenderer: 'y' });
  assert.deepEqual(problems, ['rendering.webgpu is missing']);
});
