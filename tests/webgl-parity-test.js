/**
 * WebGL 与真实 Edge 的对等性
 *
 * WebGL 有两组 vendor/renderer，混淆它们是可检测的偏差：
 *
 * | 参数 | 取值 | 是否与机器相关 |
 * |---|---|---|
 * | `gl.VENDOR` / `gl.RENDERER` | `"WebKit"` / `"WebKit WebGL"` | 否，Chromium 固定值 |
 * | `UNMASKED_VENDOR_WEBGL` (0x9245) | `"Google Inc. (NVIDIA)"` | 是 |
 * | `UNMASKED_RENDERER_WEBGL` (0x9246) | `"ANGLE (NVIDIA, ...)"` | 是 |
 *
 * masked 参数在**任何机器上都相同**，GPU 信息只通过
 * `WEBGL_debug_renderer_info` 扩展的 UNMASKED_* 参数暴露。把 GPU 字符串放在
 * masked 参数上，等于宣告这不是真实浏览器。
 *
 * 真实值来源：`fixtures/fingerprint/edge-real.json`（`npm run fingerprint:collect`）。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const REAL_URL = new URL('../fixtures/fingerprint/edge-real.json', import.meta.url);
const hasFixture = existsSync(REAL_URL);
const realWebgl = hasFixture
  ? (JSON.parse(await readFile(REAL_URL, 'utf8')).webgl ?? null)
  : null;

/** 在沙箱里跑一段 WebGL 探针。 */
async function probeWebgl(source) {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://webgl.test/', {
    page: { html: '<!doctype html><html><body><canvas id="c"></canvas></body></html>' },
  });
  try {
    return JSON.parse(await sandbox.run(source));
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
}

/**
 * WebGL2 masked/unmasked 参数只采一次，给全部断言复用。
 *
 * 每个用例各起一个沙箱会把全量套件的并行负载推高，而这些断言看的是
 * 同一份快照。
 */
let webglProbePromise = null;

function maskedProbe() {
  webglProbePromise ??= probeWebgl(MASKED_PROBE);
  return webglProbePromise;
}

const MASKED_PROBE = `JSON.stringify((() => {
  const gl = document.getElementById('c').getContext('webgl2');
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  return {
    vendor: gl.getParameter(gl.VENDOR),
    renderer: gl.getParameter(gl.RENDERER),
    version: gl.getParameter(gl.VERSION),
    shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
    unmaskedVendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
    unmaskedRenderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
  };
})())`;

// ------------------------------------------------------- 前提

test('the real-Edge WebGL capture is present', () => {
  assert.ok(hasFixture, 'run: npm run fingerprint:collect');
  assert.ok(realWebgl, 'the fixture has no webgl section');
  assert.equal(realWebgl.vendor, 'WebKit', 'precondition: Chromium masks VENDOR');
  assert.equal(realWebgl.renderer, 'WebKit WebGL', 'precondition: Chromium masks RENDERER');
});

// ------------------------------------- masked 参数必须是固定值

test('masked VENDOR and RENDERER match Chromium constants', async () => {
  const observed = await maskedProbe();

  // 这两个值与 GPU 无关，直接对齐真实采集结果
  assert.equal(observed.vendor, realWebgl.vendor);
  assert.equal(observed.renderer, realWebgl.renderer);
});

test('masked RENDERER leaks no GPU information', async () => {
  const observed = await maskedProbe();

  // 曾经这里返回 profile.webglRenderer（"ANGLE (NVIDIA, ...)"）——
  // masked 参数泄漏 GPU 是明确可检测的
  for (const marker of ['ANGLE', 'NVIDIA', 'Direct3D', 'Intel', 'AMD', 'Radeon']) {
    assert.equal(
      observed.renderer.includes(marker),
      false,
      `masked RENDERER must not contain "${marker}"`
    );
  }
  assert.equal(
    observed.vendor.includes('Google'),
    false,
    'masked VENDOR is "WebKit", not "Google Inc."'
  );
});

test('VERSION and SHADING_LANGUAGE_VERSION match the real browser', async () => {
  const observed = await maskedProbe();
  assert.equal(observed.version, realWebgl.version);
  assert.equal(observed.shadingLanguageVersion, realWebgl.shadingLanguageVersion);
});

// ------------------------------------- unmasked 才带 GPU 信息

test('unmasked parameters carry the GPU identity', async () => {
  const observed = await maskedProbe();

  // 形状必须与真实一致；具体型号不必相同——它是机器相关字段，
  // 照抄采集机器的 GPU 会把指纹钉死在一台机器上。
  assert.match(observed.unmaskedVendor, /^Google Inc\. \(.+\)$/);
  assert.match(observed.unmaskedRenderer, /^ANGLE \(.+\)$/);
  assert.match(realWebgl.unmaskedVendor, /^Google Inc\. \(.+\)$/);
  assert.match(realWebgl.unmaskedRenderer, /^ANGLE \(.+\)$/);
});

test('unmasked values are not copied from the collecting machine', async () => {
  const observed = await maskedProbe();

  // 采集机是 headless 环境（Microsoft Basic Render Driver）。照抄它会让
  // 每个 NV8 实例都声称使用软件渲染器——比中性默认值更可疑。
  assert.notEqual(
    observed.unmaskedRenderer,
    realWebgl.unmaskedRenderer,
    'the profile must not copy the collector machine GPU'
  );
  assert.equal(
    observed.unmaskedRenderer.includes('Basic Render Driver'),
    false,
    'a software renderer is a poor default'
  );
});

// ------------------------------------- 默认值单一来源

test('the runtime fallback GPU matches the fingerprint profile', async () => {
  // 曾经运行时兜底是 RTX 3060 Ti 而 profile 是 RTX 5060：调用方传不传
  // profile 会拿到不同 GPU。同一个沙箱里 GPU 型号不该有两个来源。
  const runtimeSource = await readFile(
    new URL('../src/api/webgl/webgl-runtime.js', import.meta.url), 'utf8'
  );
  const { edge150Fingerprint } = await import('../src/fingerprint/edge-150.js');

  const vendor = edge150Fingerprint.rendering.webglVendor;
  const renderer = edge150Fingerprint.rendering.webglRenderer;

  assert.ok(
    runtimeSource.includes(`webglVendor: "${vendor}"`),
    `webgl-runtime.js fallback vendor drifted from the profile (${vendor})`
  );
  assert.ok(
    runtimeSource.includes(`webglRenderer: "${renderer}"`),
    `webgl-runtime.js fallback renderer drifted from the profile (${renderer})`
  );
});

test('WebGL 1 reports its own version strings', async () => {
  const observed = await probeWebgl(`JSON.stringify((() => {
    const gl = document.getElementById('c').getContext('webgl');
    return {
      vendor: gl.getParameter(gl.VENDOR),
      renderer: gl.getParameter(gl.RENDERER),
      version: gl.getParameter(gl.VERSION),
    };
  })())`);

  // masked 值不随 WebGL 版本变化
  assert.equal(observed.vendor, 'WebKit');
  assert.equal(observed.renderer, 'WebKit WebGL');
  assert.equal(observed.version, 'WebGL 1.0 (OpenGL ES 2.0 Chromium)');
});
