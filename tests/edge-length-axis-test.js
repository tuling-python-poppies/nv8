/**
 * 与真实 Edge 的**方法 length** 对等性（Gitee IKF3A3）
 *
 * `edge-member-parity-test.js` 比成员名与 descriptor 形状，但 WebIDL 方法的
 * `length`（= 必需参数个数）是第三个可检测轴：它既是检测脚本推断参数个数的
 * 直接来源，也是 NV8 `definePrototypeMethod` 自动推导 arity 检查的输入
 * （见 `src/engine/webidl/descriptor.js`）。方向反过来也成立——这条轴必须有
 * 测试消费者，否则 `edge-lengths.json` 的 3508 个采集值没有任何断言在守护。
 *
 * 数据来源：
 * - 真实 Edge 152：`fixtures/fingerprint/edge-lengths.json`
 *   （`npm run fingerprint:lengths`，969 接口 / 3508 方法）
 * - NV8：实时捕获。只读取 fixture 覆盖的接口，输出很小。
 *
 * 与 `tests/prototype-order-version-gate-test.js` 的关系：那条测 153 profile
 * 下顺序修正表的版本门控不变量，本文件测 152 基准下方法 arity 的数值对等，
 * 两者互补，不重复。
 *
 * 断言策略：只比较 fixture 与 NV8 都存在的方法；宿主 Node 版本的 V8 缺口
 * 跳过并计入覆盖率下限，避免同一份代码在 Node 18/20 上永久红。真实的宿主
 * 差异登记在 `KNOWN_LENGTH_DIFFERENCES`，随宿主版本自动失效。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const REAL_LENGTHS_URL = new URL(
  '../fixtures/fingerprint/edge-lengths.json',
  import.meta.url,
);

const hasFixture = existsSync(REAL_LENGTHS_URL);
const realLengths = hasFixture
  ? JSON.parse(await readFile(REAL_LENGTHS_URL, 'utf8')).interfaces
  : null;

const TOTAL_CAPTURED_METHODS = hasFixture
  ? Object.values(realLengths)
    .reduce((sum, entry) => sum + Object.keys(entry.methods).length, 0)
  : 0;

/**
 * 已登记的 length 差异。
 *
 * 目前只有一条，且是**宿主 Node 的 V8 版本差异**而不是 NV8 实现缺陷：
 * Node 18–22 的 V8 还没有 `Float16Array`（Node 24 才有）。NV8 用
 * `class Float16Array extends Float32Array` 补构造器形状
 * （`install-modern-builtins.js`），该 class 的 arity 是 0，而真实 Edge 152
 * 的原生构造器 length 为 3。
 *
 * `appliesWhen()` 让条目随宿主版本自动失效：Node 24+ 自带原生
 * `Float16Array` 时 shim 不再安装，这条登记不会变成谎言（stale 检查会抓）。
 */
const KNOWN_LENGTH_DIFFERENCES = Object.freeze([
  Object.freeze({
    prototype: 'Float16Array',
    member: 'constructor',
    reason: 'Node 18–22 的 V8 没有 Float16Array（Node 24 才有）；NV8 的 '
      + '`class ... extends Float32Array` shim arity 为 0，真实 Edge 为 3；'
      + '宿主自带原生实现时此条自动失效',
    appliesWhen: () => typeof globalThis.Float16Array !== 'function',
  }),
]);

// ---------------------------------------------------- 共享捕获

/**
 * 只捕获一次 NV8 的方法 length 供全部断言复用。
 *
 * 采集表达式与 `scripts/collect-edge-lengths.mjs` 的口径一致：只读
 * descriptor 取 `value.length`，不调用方法、不触发 getter。
 */
let capturePromise = null;

function captureNv8Lengths() {
  if (capturePromise === null) {
    capturePromise = (async () => {
      if (realLengths === null) {
        throw new Error('edge-lengths fixture is missing; run: npm run fingerprint:lengths');
      }
      const { createSandbox } = await import('../src/public/create-sandbox.js');
      const { edge152Fingerprint } = await import('../src/infra/fingerprint/edge-152.js');
      const names = Object.keys(realLengths);
      const sandbox = await createSandbox('https://baseline.test/', {
        page: { html: '<!doctype html><html><head></head><body></body></html>' },
        // 采集基准是真实 Edge 152，与 edge-member-parity-test.js 同一条理由：
        // 版本门控的成员必须用 152 profile 才不会误报。
        fingerprint: { ...edge152Fingerprint, browserMajorVersion: 152 },
        limits: { maxOutputBytes: 4 * 1024 * 1024, timeoutMs: 30_000 },
      });
      try {
        const serialized = await sandbox.run(`JSON.stringify((() => {
          const out = {};
          for (const name of ${JSON.stringify(names)}) {
            const value = globalThis[name];
            if (typeof value !== 'function' || !value.prototype) continue;
            const methods = {};
            for (const key of Object.getOwnPropertyNames(value.prototype)) {
              const descriptor = Object.getOwnPropertyDescriptor(value.prototype, key);
              if (!descriptor || typeof descriptor.value !== 'function') continue;
              methods[key] = descriptor.value.length;
            }
            out[name] = { ctorLength: value.length, methods };
          }
          return out;
        })())`);
        return JSON.parse(serialized);
      } finally {
        await sandbox.close();
        createSandbox.drain();
      }
    })();
  }
  return capturePromise;
}

/**
 * 逐方法比较 `Function.prototype.length`，返回 `{ comparedMethods,
 * comparedConstructors, skipped, diffs }`。
 *
 * `constructor` 在 fixture 里有两份账：接口级的 `ctorLength` 与
 * `methods.constructor`。两者指向同一个函数，比较时先去重，失败只报一次。
 */
function collectLengthDiffs(observed) {
  const diffs = [];
  const seenKeys = new Set();
  let comparedMethods = 0;
  let comparedConstructors = 0;
  let skipped = 0;

  const compare = (name, member, expected) => {
    const key = `${name}.${member}`;
    const actual = member === 'constructor'
      ? observed[name]?.ctorLength
      : observed[name]?.methods?.[member];
    if (actual === undefined) {
      skipped += 1;
      return;
    }
    if (member === 'constructor') comparedConstructors += 1;
    else comparedMethods += 1;
    if (actual === expected) return;
    if (seenKeys.has(key)) return;
    seenKeys.add(key);
    diffs.push({ prototype: name, member, key, expected, actual });
  };

  for (const [name, entry] of Object.entries(realLengths)) {
    compare(name, 'constructor', entry.ctorLength);
    for (const [member, length] of Object.entries(entry.methods)) {
      if (member === 'constructor') continue;
      compare(name, member, length);
    }
  }
  return { comparedMethods, comparedConstructors, skipped, diffs };
}

// ---------------------------------------------------- 前提

test('the real-Edge length fixture is present and complete', () => {
  assert.ok(hasFixture, 'run: npm run fingerprint:lengths');
  const interfaceCount = Object.keys(realLengths).length;
  assert.ok(interfaceCount > 900, `expected a full browser surface, got ${interfaceCount}`);
  assert.ok(
    TOTAL_CAPTURED_METHODS > 3000,
    `expected the collector to record method lengths, got ${TOTAL_CAPTURED_METHODS}`,
  );

  // 抽查：这些接口的方法 length 必须被采到，否则说明采集被截断
  for (const name of ['Event', 'Response', 'Array', 'Element']) {
    assert.ok(realLengths[name], `fixture is missing interface ${name}`);
    assert.ok(
      Object.keys(realLengths[name].methods).length > 0,
      `${name} has suspiciously few captured methods`,
    );
  }
});

// ---------------------------------------------------- length 对等

test('method lengths match real Edge for every comparable method', async () => {
  const observed = await captureNv8Lengths();
  const { comparedMethods, comparedConstructors, skipped, diffs } =
    collectLengthDiffs(observed);

  // 覆盖面可量化：3508 个采集方法 = 2540 个普通方法 + 968 个 constructor
  // 形态（fixture 里 constructor 同时记在 `ctorLength` 与 `methods.constructor`，
  // 比较时已去重）。152 基准下应全部比到；下限留出宿主 Node 版本缺口的余量
  // （见 known-differences.js），但任何大幅缩水都会在这里被抓住。
  const comparedTotal = comparedMethods + comparedConstructors;
  assert.ok(
    comparedMethods >= 2400,
    `method-length sample too small: only ${comparedMethods} non-constructor methods`
  );
  assert.ok(
    comparedTotal / TOTAL_CAPTURED_METHODS >= 0.9,
    `method-length sample covers only ${comparedTotal}/${TOTAL_CAPTURED_METHODS}`
  );
  assert.ok(
    comparedConstructors >= 900,
    `constructor-length sample too small: ${comparedConstructors}`,
  );

  const failures = diffs
    .filter((diff) => !KNOWN_LENGTH_DIFFERENCES.some((entry) => (
      entry.prototype === diff.prototype
      && entry.member === diff.member
      && entry.appliesWhen()
    )))
    .map((diff) => `${diff.key}\n    真实: ${diff.expected}\n    NV8 : ${diff.actual}`);

  assert.deepEqual(
    failures,
    [],
    `these method lengths deviate (skipped ${skipped} host gaps); fix them or `
    + 'register them in KNOWN_LENGTH_DIFFERENCES with a reason'
  );
});

test('the length registry has no stale entries', async () => {
  const observed = await captureNv8Lengths();
  const actual = new Set(collectLengthDiffs(observed).diffs.map((diff) => diff.key));

  const stale = [];
  for (const entry of KNOWN_LENGTH_DIFFERENCES) {
    assert.ok(entry.reason.length > 10, `${entry.prototype}.${entry.member} needs a real reason`);
    const key = `${entry.prototype}.${entry.member}`;
    // 条目只对「宿主 V8 仍缺该能力」的版本生效；生效却没差异 = 陈旧
    if (entry.appliesWhen() && !actual.has(key)) stale.push(key);
  }

  assert.deepEqual(stale, [], 'these lengths now match; drop them from the registry');
});
