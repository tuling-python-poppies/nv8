/**
 * 动态 `import()` 测试（ADR-0003）
 *
 * 覆盖三层：
 * 1. specifier 解析规则——与浏览器一致，包括哪些形式该被拒绝
 * 2. 离线重放命中与未命中，未命中必须给可行动诊断
 * 3. 缓存作用域与循环依赖
 *
 * 最后一条边界断言：任何情况下不触达真实网络。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

import {
  MODULE_REPLAY_MISS_CODE,
  MODULE_SPECIFIER_CODE,
  createDynamicImporter,
  decodeDataModule,
  rejectDynamicImport,
  resolveModuleSpecifier,
} from '../src/realm/dynamic-import.js';

const REFERRER = 'https://target.test/app/main.js';

// ------------------------------------------------------ specifier 解析

test('relative specifiers resolve against the referrer', () => {
  assert.deepEqual(
    resolveModuleSpecifier('./util.js', REFERRER),
    { kind: 'url', url: 'https://target.test/app/util.js' }
  );
  assert.deepEqual(
    resolveModuleSpecifier('../lib/x.js', REFERRER),
    { kind: 'url', url: 'https://target.test/lib/x.js' }
  );
});

test('root-relative specifiers resolve against the origin', () => {
  // 旧实现把 `/` 当绝对文件路径拦掉，导致 import('/mod/a.js') 这种最常见的
  // 写法直接失败。浏览器里它是根相对 URL，完全合法。
  assert.deepEqual(
    resolveModuleSpecifier('/mod/a.js', REFERRER),
    { kind: 'url', url: 'https://target.test/mod/a.js' }
  );
});

test('absolute http(s) URLs pass through', () => {
  assert.deepEqual(
    resolveModuleSpecifier('https://cdn.test/x.js', REFERRER),
    { kind: 'url', url: 'https://cdn.test/x.js' }
  );
});

test('data: URLs are treated as self-contained', () => {
  const resolved = resolveModuleSpecifier('data:text/javascript,export default 1', REFERRER);
  assert.equal(resolved.kind, 'data');
});

test('bare specifiers are rejected the way browsers reject them', () => {
  // 没有 import map 时浏览器同样抛 "Failed to resolve module specifier"。
  // 保持一致比擅自支持更好。
  assert.throws(
    () => resolveModuleSpecifier('lodash', REFERRER),
    (error) => {
      assert.equal(error.code, MODULE_SPECIFIER_CODE);
      assert.match(error.message, /Failed to resolve module specifier "lodash"/);
      return true;
    }
  );
});

test('node: specifiers never expose host modules', () => {
  assert.throws(
    () => resolveModuleSpecifier('node:fs', REFERRER),
    (error) => {
      assert.equal(error.code, MODULE_SPECIFIER_CODE);
      assert.match(error.message, /host modules are not exposed/);
      return true;
    }
  );
});

test('non-network protocols are rejected by the protocol allowlist', () => {
  for (const specifier of ['file:///etc/passwd', 'blob:https://x.test/abc']) {
    assert.throws(
      () => resolveModuleSpecifier(specifier, REFERRER),
      (error) => error.code === MODULE_SPECIFIER_CODE,
      `${specifier} must be rejected`
    );
  }
});

test('a path that looks like a file read resolves to a harmless URL', () => {
  // /etc/passwd 配 http referrer 就是普通 URL，走 replay 未命中即可，
  // 不构成文件读取风险——这正是改用协议白名单而非前缀拦截的理由。
  assert.deepEqual(
    resolveModuleSpecifier('/etc/passwd', REFERRER),
    { kind: 'url', url: 'https://target.test/etc/passwd' }
  );
});

test('non-string specifiers are rejected', () => {
  assert.throws(
    () => resolveModuleSpecifier(42, REFERRER),
    (error) => error.code === MODULE_SPECIFIER_CODE
  );
});

// ---------------------------------------------------------- data: 解码

test('decodeDataModule handles plain and base64 payloads', () => {
  assert.equal(
    decodeDataModule('data:text/javascript,export%20default%201'),
    'export default 1'
  );
  const encoded = Buffer.from('export default 2', 'utf8').toString('base64');
  assert.equal(
    decodeDataModule(`data:text/javascript;base64,${encoded}`),
    'export default 2'
  );
});

test('decodeDataModule rejects a malformed URL', () => {
  assert.throws(
    () => decodeDataModule('data:text/javascript'),
    (error) => error.code === MODULE_SPECIFIER_CODE
  );
});

// ------------------------------------------------------------ 重放执行

/** 用内存模块表建一个 importer */
function importerFor(modules, options = {}) {
  const context = vm.createContext({});
  const importDynamic = createDynamicImporter({
    context,
    defaultReferrer: REFERRER,
    resolveSource: (url) => modules[url] ?? null,
    availableUrls: () => Object.keys(modules),
    ...options,
  });
  return { context, importDynamic };
}

test('a replayed module is evaluated and its namespace returned', async () => {
  const { importDynamic } = importerFor({
    'https://target.test/app/util.js': 'export const value = 7;',
  });

  const namespace = await importDynamic('./util.js', REFERRER);
  assert.equal(namespace.value, 7);
});

test('static imports inside a dynamically imported module also resolve', async () => {
  const { importDynamic } = importerFor({
    'https://target.test/app/a.js': 'export default 41;',
    'https://target.test/app/b.js': 'import a from "./a.js"; export const b = a + 1;',
  });

  const namespace = await importDynamic('./b.js', REFERRER);
  assert.equal(namespace.b, 42);
});

test('nested dynamic imports resolve through the same path', async () => {
  const { importDynamic } = importerFor({
    'https://target.test/app/leaf.js': 'export const leaf = "deep";',
    'https://target.test/app/branch.js':
      'export const load = () => import("./leaf.js");',
  });

  const branch = await importDynamic('./branch.js', REFERRER);
  const leaf = await branch.load();
  assert.equal(leaf.leaf, 'deep');
});

test('data: modules need no replay entry', async () => {
  const { importDynamic } = importerFor({});
  const namespace = await importDynamic(
    'data:text/javascript,export default 9',
    REFERRER
  );
  assert.equal(namespace.default, 9);
});

// ---------------------------------------------------------- 未命中诊断

test('a replay miss reports specifier, resolved URL and referrer', async () => {
  const { importDynamic } = importerFor({
    'https://target.test/app/known.js': 'export default 1;',
  });

  await assert.rejects(
    () => importDynamic('./missing.js', REFERRER),
    (error) => {
      assert.equal(error.code, MODULE_REPLAY_MISS_CODE);
      assert.equal(error.specifier, './missing.js');
      assert.equal(error.resolvedUrl, 'https://target.test/app/missing.js');
      assert.equal(error.referrer, REFERRER);
      return true;
    }
  );
});

test('a replay miss lists known module URLs to expose typos', async () => {
  const { importDynamic } = importerFor({
    'https://target.test/app/known.js': 'export default 1;',
  });

  await assert.rejects(
    () => importDynamic('./knownn.js', REFERRER),
    (error) => {
      assert.deepEqual(error.availableModules, ['https://target.test/app/known.js']);
      assert.ok(
        error.suggestions.some((hint) => hint.includes('known.js')),
        'suggestions must surface the near-miss URL'
      );
      return true;
    }
  );
});

test('a miss inside a static import chain is also structured', async () => {
  const { importDynamic } = importerFor({
    'https://target.test/app/entry.js': 'import "./gone.js"; export default 1;',
  });

  await assert.rejects(
    () => importDynamic('./entry.js', REFERRER),
    (error) => {
      assert.equal(error.code, MODULE_REPLAY_MISS_CODE);
      assert.equal(error.resolvedUrl, 'https://target.test/app/gone.js');
      return true;
    }
  );
});

// ---------------------------------------------------------- 缓存与循环

test('the same URL is evaluated only once per realm', async () => {
  let evaluations = 0;
  const context = vm.createContext({ record: () => { evaluations += 1; } });
  const importDynamic = createDynamicImporter({
    context,
    defaultReferrer: REFERRER,
    resolveSource: (url) => (
      url === 'https://target.test/app/once.js'
        ? 'record(); export const ok = true;'
        : null
    ),
  });

  const first = await importDynamic('./once.js', REFERRER);
  const second = await importDynamic('./once.js', REFERRER);

  assert.equal(evaluations, 1, 'module body must run once');
  assert.equal(first, second, 'the same namespace object is returned');
});

test('different specifiers resolving to one URL share the cache entry', async () => {
  let evaluations = 0;
  const context = vm.createContext({ record: () => { evaluations += 1; } });
  const importDynamic = createDynamicImporter({
    context,
    defaultReferrer: REFERRER,
    resolveSource: (url) => (
      url === 'https://target.test/app/shared.js'
        ? 'record(); export const ok = true;'
        : null
    ),
  });

  // 缓存键是解析后的绝对 URL，不是原始 specifier
  await importDynamic('./shared.js', REFERRER);
  await importDynamic('/app/shared.js', REFERRER);
  await importDynamic('https://target.test/app/shared.js', REFERRER);

  assert.equal(evaluations, 1);
});

test('circular dependencies do not deadlock', async () => {
  const { importDynamic } = importerFor({
    'https://target.test/app/left.js':
      'import { right } from "./right.js"; export const left = "L"; export const seesRight = () => right;',
    'https://target.test/app/right.js':
      'import { left } from "./left.js"; export const right = "R"; export const seesLeft = () => left;',
  });

  const namespace = await importDynamic('./left.js', REFERRER);
  assert.equal(namespace.left, 'L');
  assert.equal(namespace.seesRight(), 'R');
});

test('caches are independent across importers', async () => {
  let firstCount = 0;
  let secondCount = 0;
  const build = (counter) => {
    const context = vm.createContext({ record: counter });
    return createDynamicImporter({
      context,
      defaultReferrer: REFERRER,
      resolveSource: () => 'record(); export const ok = true;',
    });
  };

  await build(() => { firstCount += 1; })('./x.js', REFERRER);
  await build(() => { secondCount += 1; })('./x.js', REFERRER);

  // 模块状态按 Realm 隔离，两个 importer 不共享缓存
  assert.equal(firstCount, 1);
  assert.equal(secondCount, 1);
});

// -------------------------------------------------------------- 拒绝入口

test('rejectDynamicImport names the context it refuses', () => {
  assert.throws(
    () => rejectDynamicImport('./x.js', 'worklet scripts'),
    (error) => {
      assert.equal(error.code, MODULE_SPECIFIER_CODE);
      assert.match(error.message, /worklet scripts/);
      return true;
    }
  );
});

// ---------------------------------------------------------------- 边界

test('dynamic import never reaches the real network', async () => {
  // resolveSource 是唯一的取源入口，返回 null 即未命中。实现里没有任何
  // fetch/http 路径可以绕过它。
  const attempted = [];
  const context = vm.createContext({});
  const importDynamic = createDynamicImporter({
    context,
    defaultReferrer: REFERRER,
    resolveSource: (url) => {
      attempted.push(url);
      return null;
    },
  });

  await assert.rejects(() => importDynamic('https://evil.test/payload.js', REFERRER));
  assert.deepEqual(attempted, ['https://evil.test/payload.js']);
});

test('dynamic-import module imports no network or filesystem modules', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(
    new URL('../src/realm/dynamic-import.js', import.meta.url),
    'utf8'
  );
  const specifiers = [...source.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);
  for (const specifier of specifiers) {
    assert.ok(
      !/^node:(http|https|net|tls|fs|child_process)/.test(specifier),
      `must not import ${specifier}`
    );
  }
});
