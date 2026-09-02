#!/usr/bin/env node
/**
 * 从真实 Edge 采集指纹基准。
 *
 * 为什么需要它：`src/fingerprint/*.js` 里的值原本是手写常量，没有任何机制
 * 保证它们与真实浏览器一致。Baseline 只能保证「NV8 自己前后一致」，
 * 保证不了「与真实 Edge 一致」。
 *
 * 采集方式刻意保持轻量：headless Edge 加载一个本地 HTML，页面脚本把指纹
 * 序列化进 DOM，用 `--dump-dom` 取回。**不引入 Puppeteer / CDP 依赖**——
 * 按架构计划，浏览器自动化不属于 NV8 的职责，这里只是一次性的数据采集工具。
 *
 * 用法：
 *   node scripts/collect-edge-fingerprint.mjs                # 打印
 *   node scripts/collect-edge-fingerprint.mjs --out <path>   # 写入 JSON
 *   node scripts/collect-edge-fingerprint.mjs --edge <exe>   # 指定可执行文件
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';

/** WSL 下 Windows Edge 的常见位置 */
const EDGE_CANDIDATES = [
  // 原生 Windows 路径放在最前：脚本原来只列了 WSL(/mnt/c) 与 Linux 路径，
  // 在 Windows 上必须手动 --edge。而『基准跟随本机 Edge』要成为常规做法，
  // 就不能依赖每次手动传参。
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/mnt/c/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/microsoft-edge',
  '/usr/bin/microsoft-edge-stable',
];

/** 采集脚本。放在 DOM 里再 dump 出来，避免依赖 CDP。 */
const COLLECTOR_PAGE = `<!doctype html><html><head><meta charset="utf-8"></head><body>
<pre id="out">pending</pre>
<script>
(async () => {
  const n = navigator;
  const s = screen;
  const hints = ['architecture','bitness','model','platformVersion',
    'uaFullVersion','wow64','fullVersionList','formFactors'];
  let high = {};
  try { high = await n.userAgentData.getHighEntropyValues(hints); }
  catch (error) { high = { error: String(error) }; }

  let webgl = {};
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const debugInfo = gl && gl.getExtension('WEBGL_debug_renderer_info');
    webgl = {
      vendor: gl ? gl.getParameter(gl.VENDOR) : null,
      renderer: gl ? gl.getParameter(gl.RENDERER) : null,
      version: gl ? gl.getParameter(gl.VERSION) : null,
      shadingLanguageVersion: gl ? gl.getParameter(gl.SHADING_LANGUAGE_VERSION) : null,
      unmaskedVendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null,
      unmaskedRenderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null,
    };
  } catch (error) { webgl = { error: String(error) }; }

  document.getElementById('out').textContent = JSON.stringify({
    collectedAt: new Date().toISOString(),
    navigator: {
      userAgent: n.userAgent,
      appCodeName: n.appCodeName,
      appName: n.appName,
      appVersion: n.appVersion,
      platform: n.platform,
      product: n.product,
      productSub: n.productSub,
      vendor: n.vendor,
      vendorSub: n.vendorSub,
      language: n.language,
      languages: [...n.languages],
      hardwareConcurrency: n.hardwareConcurrency,
      deviceMemory: n.deviceMemory,
      maxTouchPoints: n.maxTouchPoints,
      cookieEnabled: n.cookieEnabled,
      doNotTrack: n.doNotTrack,
      onLine: n.onLine,
      pdfViewerEnabled: n.pdfViewerEnabled,
      webdriver: n.webdriver,
    },
    userAgentData: {
      brands: n.userAgentData ? n.userAgentData.brands.map(
        entry => ({ brand: entry.brand, version: entry.version }),
      ) : null,
      mobile: n.userAgentData ? n.userAgentData.mobile : null,
      platform: n.userAgentData ? n.userAgentData.platform : null,
      highEntropy: high,
    },
    screen: {
      width: s.width, height: s.height,
      availWidth: s.availWidth, availHeight: s.availHeight,
      colorDepth: s.colorDepth, pixelDepth: s.pixelDepth,
      devicePixelRatio: window.devicePixelRatio,
      availLeft: s.availLeft, availTop: s.availTop,
      isExtended: s.isExtended,
      orientationType: s.orientation ? s.orientation.type : null,
    },
    webgl,
    surface: {
      globalCount: Object.getOwnPropertyNames(globalThis).length,
      hasIterator: typeof Iterator,
    },
  }, null, 2);
})();
</` + `script></body></html>`;

function findEdge(explicit) {
  const candidates = explicit ? [explicit, ...EDGE_CANDIDATES] : EDGE_CANDIDATES;
  for (const candidate of candidates) {
    try {
      readFileSync(candidate);
      return candidate;
    } catch {
      // 试下一个
    }
  }
  throw new Error(
    `Edge not found. Pass --edge <path>. Tried:\n  ${candidates.join('\n  ')}`
  );
}

/**
 * WSL 路径转 Windows 路径。
 *
 * `msedge.exe` 是 Windows 进程，收到 `/tmp/...` 会找不到文件。
 */
function toBrowserUrl(filePath) {
  if (filePath.startsWith('/mnt/')) {
    const [, , drive, ...rest] = filePath.split('/');
    return `file:///${drive.toUpperCase()}:/${rest.join('/')}`;
  }
  return `file://${filePath}`;
}

/**
 * 把 headless UA 还原为有头模式。
 *
 * headless Edge 的 UA 是 `HeadlessChrome/151.0.0.0`，有头模式是
 * `Chrome/151.0.0.0`。profile 要写有头形态——否则目标站点一眼看出是无头。
 */
function normalizeHeadlessUserAgent(userAgent) {
  return userAgent.replace(/HeadlessChrome\//g, 'Chrome/');
}

function collect(edgePath) {
  // 采集页必须落在 Windows 可见的位置
  const isWindowsEdge = edgePath.startsWith('/mnt/');
  const baseDir = isWindowsEdge ? '/mnt/c/temp' : tmpdir();
  const workDir = mkdtempSync(path.join(baseDir, 'nv8-fp-'));
  const pagePath = path.join(workDir, 'collect.html');

  try {
    writeFileSync(pagePath, COLLECTOR_PAGE);
    const output = execFileSync(edgePath, [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--virtual-time-budget=5000',
      '--dump-dom',
      toBrowserUrl(pagePath),
    ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 120_000 });

    const match = /<pre id="out">([\s\S]*?)<\/pre>/.exec(output);
    if (match === null) {
      throw new Error('Could not find the collector output in the dumped DOM');
    }
    // dump-dom 会把引号转成实体
    const decoded = match[1]
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    const data = JSON.parse(decoded);
    data.navigator.userAgentHeadless = data.navigator.userAgent;
    data.navigator.userAgent = normalizeHeadlessUserAgent(data.navigator.userAgent);
    data.navigator.appVersion = normalizeHeadlessUserAgent(data.navigator.appVersion);
    data.edgePath = edgePath;
    return data;
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

const args = process.argv.slice(2);
const edgeIndex = args.indexOf('--edge');
const outIndex = args.indexOf('--out');

const fingerprint = collect(findEdge(edgeIndex === -1 ? null : args[edgeIndex + 1]));

if (outIndex !== -1) {
  const target = args[outIndex + 1];
  writeFileSync(target, `${JSON.stringify(fingerprint, null, 2)}\n`);
  console.log(`wrote ${target}`);
  console.log(`  UA:     ${fingerprint.navigator.userAgent}`);
  console.log(`  brands: ${fingerprint.userAgentData.brands.map((b) => `${b.brand}/${b.version}`).join(', ')}`);
} else {
  console.log(JSON.stringify(fingerprint, null, 2));
}
