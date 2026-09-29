#!/usr/bin/env node
/**
 * probe-intrinsics.mjs — JS 内在函数自省探测（目标适配用）。
 *
 * 用途：判断反爬脚本是否对 window / navigator 等敏感对象做**内省枚举**
 * （Object.getOwnPropertyNames / keys / getOwnPropertyDescriptor /
 * Reflect.ownKeys 等）。这类枚举会读到 Window 表面全集——若 nv8 的全局名
 * 集合与真机 Edge 有差（例如 152 基准 1238 项 vs 真机 154 的 1300+ 项），
 * 结果会被哈希进指纹，需要触发「Window 表面基准升级」。
 *
 * 用法（整页自然加载，与各案例求解器一致；外链脚本用 replay 提供）：
 *   node --allow-natives-syntax --experimental-vm-modules scripts/probe-intrinsics.mjs \
 *     --page <challenge.html> [--url https://target/...] [--external <vm.js>] \
 *     [--seed "<cookie header>"] [--wait 2500] [--json]
 *
 * 自检（合成页主动枚举，断言钩子捕获）：
 *   node --allow-natives-syntax --experimental-vm-modules scripts/probe-intrinsics.mjs --self-check
 *
 * 判定：输出出现 `getOwnPropertyNames(window)` / `keys(navigator)` /
 * `ownKeys(window)` 等行即说明目标会枚举表面；按 README「换基准三步」
 * （fingerprint:globals → check:surface-order → build-window-surface-order --write）
 * 升级表面基准并补新增 API。
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");

const INTRINSIC_PRELUDE = `(function () {
  var log = [];
  window.__intrLog = log;
  var seen = {};
  function record(line) {
    line = String(line).slice(0, 160);
    if (seen[line]) return;
    seen[line] = 1;
    if (log.length < 500) log.push(line);
  }
  function kindOf(target) {
    try {
      if (target === window) return "window";
      if (target === document) return "document";
      if (target === navigator) return "navigator";
      if (target === screen) return "screen";
      if (target === location) return "location";
      if (target === history) return "history";
      if (target === performance) return "performance";
      if (target === crypto) return "crypto";
      if (target === localStorage) return "localStorage";
      if (target === sessionStorage) return "sessionStorage";
    } catch (error) {}
    return null;
  }
  function wrap(object, name) {
    try {
      var original = object[name];
      object[name] = function () {
        try {
          var kind = kindOf(arguments[0]);
          if (kind) record(name + "(" + kind + ") n=" + arguments.length);
        } catch (error) {}
        return original.apply(this, arguments);
      };
    } catch (error) {}
  }
  ["getOwnPropertyNames", "keys", "getOwnPropertyDescriptor", "getOwnPropertySymbols", "getPrototypeOf"]
    .forEach(function (name) { wrap(Object, name); });
  ["ownKeys", "get", "has", "getOwnPropertyDescriptor"].forEach(function (name) { wrap(Reflect, name); });
})();`;

const SEED_TEMPLATE = (pairs) => `(function () {
  var list = ${pairs};
  for (var i = 0; i < list.length; i++) { try { document.cookie = list[i] + "; path=/"; } catch (error) {} }
  window.__errors = [];
  try { addEventListener("error", function (event) { try { window.__errors.push(String((event.error && event.error.stack) || event.message || "error").slice(0, 300)); } catch (x) {} }); } catch (error) {}
})();`;

const SENSITIVE_ENUMERATION = /(getOwnPropertyNames|keys|ownKeys|getOwnPropertySymbols)\((window|document|navigator|screen|location|history|performance|crypto|localStorage|sessionStorage)\)/;

function injectIntoHead(html, source) {
  const script = `<script>${source}</script>`;
  return /<head\b[^>]*>/iu.test(html)
    ? html.replace(/<head\b[^>]*>/iu, match => match + script)
    : html.replace(/<script\b/iu, script + "<script");
}

async function runProbe({ pageHtml, url, replay, waitMs }) {
  const { createSandbox } = await import(
    pathToFileURL(path.join(ROOT, "src", "public", "create-sandbox.js")).href
  );
  const sandbox = await createSandbox(url, {
    page: { html: pageHtml },
    replay,
    limits: { timeoutMs: 30_000, maxOutputBytes: 8 * 1024 * 1024 },
  });
  try {
    await sandbox.run(`new Promise(resolve => setTimeout(resolve, ${waitMs}))`);
    const intrLog = JSON.parse(await sandbox.run("JSON.stringify(window.__intrLog || [])"));
    const errors = JSON.parse(await sandbox.run("JSON.stringify(window.__errors || [])"));
    return { intrLog, errors };
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
}

function parseArgs(argv) {
  const args = { wait: 2500, json: false, selfCheck: false };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === "--json") args.json = true;
    else if (flag === "--self-check") args.selfCheck = true;
    else if (flag === "--page") args.page = argv[++index];
    else if (flag === "--url") args.url = argv[++index];
    else if (flag === "--external") args.external = argv[++index];
    else if (flag === "--seed") args.seed = argv[++index];
    else if (flag === "--wait") args.wait = Number(argv[++index]);
  }
  return args;
}

async function selfCheck() {
  const html = `<!doctype html><html><head></head><body><script>
    Object.getOwnPropertyNames(window);
    Object.keys(navigator);
    Reflect.ownKeys(window);
    Object.getOwnPropertyDescriptor(document, 'cookie');
  </script></body></html>`;
  const { intrLog } = await runProbe({
    pageHtml: injectIntoHead(html, INTRINSIC_PRELUDE),
    url: "https://self-check.test/",
    replay: [],
    waitMs: 300,
  });
  const required = [
    "getOwnPropertyNames(window)",
    "keys(navigator)",
    "ownKeys(window)",
    "getOwnPropertyDescriptor(document)",
  ];
  const missing = required.filter(token => !intrLog.some(line => line.includes(token)));
  if (missing.length > 0) {
    console.log(`SELF-CHECK FAIL: 未捕获 ${missing.join(", ")}；log=${JSON.stringify(intrLog)}`);
    process.exit(1);
  }
  console.log(`SELF-CHECK PASS（${intrLog.length} 条）: ${intrLog.join(" | ")}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.selfCheck) {
    await selfCheck();
    return;
  }
  if (!args.page) {
    console.error("用法: --page <challenge.html> [--url <pageUrl>] [--external <vm.js>] [--seed <cookie>] [--wait ms] [--json]");
    process.exit(2);
  }
  const pageUrl = args.url ?? "https://target.test/";
  const html = await readFile(args.page, "utf8");
  const replay = [];
  const seed = args.seed ? SEED_TEMPLATE(JSON.stringify(
    args.seed.split(";").map(part => part.trim()).filter(part => part.includes("=")),
  )) : "";
  if (args.external) {
    const source = await readFile(args.external, "utf8");
    const match = /<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/iu.exec(html);
    if (match) {
      const externalUrl = new URL(match[1], pageUrl).href;
      replay.push({
        method: "GET",
        url: externalUrl,
        status: 200,
        headers: { "content-type": "application/javascript; charset=utf-8" },
        body: source,
      });
    }
  }
  let pageHtml = injectIntoHead(html, INTRINSIC_PRELUDE);
  if (seed) pageHtml = injectIntoHead(pageHtml, seed);
  replay.push({
    method: "GET",
    url: pageUrl,
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
    body: pageHtml,
  });

  const { intrLog, errors } = await runProbe({
    pageHtml,
    url: pageUrl,
    replay,
    waitMs: args.wait,
  });
  const enumerations = intrLog.filter(line => SENSITIVE_ENUMERATION.test(line));
  if (args.json) {
    console.log(JSON.stringify({ enumerations, intrLog, errors }, null, 2));
  } else {
    console.log(`[intrinsics] 敏感目标自省调用：${intrLog.length}`);
    for (const line of intrLog) console.log("  " + line);
    if (errors.length > 0) {
      console.log(`[intrinsics] 页面错误：${errors.length}`);
      for (const line of errors.slice(0, 5)) console.log("  " + String(line).slice(0, 200));
    }
    console.log(enumerations.length > 0
      ? ">>> ⚠ 目标枚举了敏感表面：需要升级 Window 表面基准（README「换基准三步」）"
      : ">>> 未发现对敏感表面的枚举（getOwnPropertyDescriptor 单项探测不构成面枚举）");
  }
}

await main();
