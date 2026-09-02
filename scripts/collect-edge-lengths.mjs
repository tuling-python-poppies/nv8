#!/usr/bin/env node
/**
 * 采集真实 Edge 每个原型方法与构造器的 `length`。
 *
 * WebIDL 里方法的 `length` **等于必需参数个数**（可选参数不计入）。实测对比
 * 3476 个方法全部一致，因此它是可靠的必需参数信息源——`definePrototypeMethod`
 * 就是靠它自动推导 arity 检查，不需要在 757 个调用点逐个手写个数。
 *
 * 走临时本地 HTTP 服务器（仅绑 127.0.0.1，用完即关）。
 *
 * 用法：node scripts/collect-edge-lengths.mjs --out fixtures/fingerprint/edge-lengths.json
 */
import http from 'node:http';
import { execFile } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import process from 'node:process';

/**
 * 定位本机 Edge。
 *
 * 原来这里把路径直接写成 `execFile` 的第一个实参，且只有 WSL 的 `/mnt/c` 形式，
 * 在原生 Windows 上必然失败。而「基准跟随本机 Edge」要成为常规做法，就不能依赖
 * 每次手动传 `--edge`。
 */
const EDGE_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/mnt/c/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/microsoft-edge',
  '/usr/bin/microsoft-edge-stable',
];

function findEdge() {
  const explicitIndex = process.argv.indexOf('--edge');
  const candidates = explicitIndex === -1
    ? EDGE_CANDIDATES
    : [process.argv[explicitIndex + 1], ...EDGE_CANDIDATES];
  for (const candidate of candidates) {
    if (candidate !== undefined && existsSync(candidate)) return candidate;
  }
  throw new Error('Edge not found; pass --edge <path>');
}

const PAGE = `<!doctype html><html><body><pre id="out">p</pre><script>
const out = {};
for (const name of Object.getOwnPropertyNames(globalThis)) {
  let value;
  try { value = globalThis[name]; } catch { continue; }
  if (typeof value !== 'function' || !value.prototype) continue;
  const methods = {};
  for (const key of Object.getOwnPropertyNames(value.prototype)) {
    let d;
    try { d = Object.getOwnPropertyDescriptor(value.prototype, key); } catch { continue; }
    if (!d || typeof d.value !== 'function') continue;
    methods[key] = d.value.length;
  }
  const ctorLength = value.length;
  if (Object.keys(methods).length > 0 || ctorLength > 0) {
    out[name] = { ctorLength, methods };
  }
}
document.getElementById('out').textContent = JSON.stringify(out);
</` + `script></body></html>`;

const server = http.createServer((q, r) => { r.writeHead(200, {'content-type':'text/html; charset=utf-8'}); r.end(PAGE); });
await new Promise(r => server.listen(0, '127.0.0.1', r));
const { port } = server.address();
const dom = await new Promise((res, rej) => execFile(
  findEdge(),
  ['--headless=new','--disable-gpu','--no-sandbox','--virtual-time-budget=6000','--dump-dom',`http://127.0.0.1:${port}/`],
  { encoding:'utf8', maxBuffer: 200*1024*1024, timeout: 180000 },
  (e, out) => (e && !out ? rej(e) : res(out))));
server.close();
const m = /<pre id="out">([\s\S]*?)<\/pre>/.exec(dom);
const data = JSON.parse(m[1].replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
const total = Object.values(data).reduce((s, e) => s + Object.keys(e.methods).length, 0);
const outIndex = process.argv.indexOf('--out');
const outPath = outIndex === -1
  ? 'fixtures/fingerprint/edge-lengths.json'
  : process.argv[outIndex + 1];
writeFileSync(outPath,
  JSON.stringify({ collectedAt: new Date().toISOString(), interfaces: data }, null, 1) + '\n');
console.log(`wrote edge-lengths.json: ${Object.keys(data).length} 接口 / ${total} 方法`);
