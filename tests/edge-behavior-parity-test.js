/**
 * 行为层对等性
 *
 * 前两层只看**形状**：`edge-surface-parity-test.js` 比全局名，
 * `edge-member-parity-test.js` 比原型成员名与 descriptor。两者都通过了，
 * 但形状对不代表行为对——`getComputedStyle` 存在、成员齐全，返回值仍可能是错的。
 *
 * 这一层跑同一段代码，比结果。探针定义在 `src/baseline/behavior-probes.js`，
 * 与采集脚本**共用同一份**：各写一份必然漂移，漂移后比较就没有意义。
 *
 * ## 探针只取「结构性事实」
 *
 * 准入条件是跨运行确定、与机器无关、可序列化。因此不取 CPU 核数、屏幕尺寸、
 * 时区这类机器指纹，只取引擎固定产出的东西：报错类型与文案、`toString` 形态、
 * 类型标签、非法接收者行为。这些恰恰是检测脚本最常摸的地方。
 *
 * ## 首轮发现的偏差（33 个探针，15 项不一致）
 *
 * 1. **legacy 模式完全没有原生函数伪装**（5 项）。`setNativeFunctionContext`
 *    只有 webidl 插件会调用，legacy（默认模式）从未建过上下文，于是所有
 *    `registerNativeFunction` 永久滞留在队列里、`Function.prototype.toString`
 *    从未被接管：
 *
 *    ```
 *    Function.prototype.toString.call(document.addEventListener)
 *      真实: "function addEventListener() { [native code] }"
 *      迁移前: "call(...args) { return invoke(this, args); }"
 *    ```
 *
 * 2. **WebIDL 实参个数完全不检查**（6 项）。`document.addEventListener()`
 *    静默返回 undefined，真实浏览器抛 TypeError。
 *
 * 3. **构造器报错文案缺后半句**（4 项）。真实文案是
 *    `Please use the 'new' operator, this DOM object constructor cannot be
 *    called as a function.`，`Illegal constructor` 还缺 `Failed to construct
 *    'X': ` 前缀。`new Document()` 在真实浏览器里**允许**，NV8 却抛错。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

import { BEHAVIOR_PROBES, buildProbeExpression } from '../src/baseline/behavior-probes.js';

const FIXTURE_URL = new URL('../fixtures/fingerprint/edge-behavior.json', import.meta.url);
const hasFixture = existsSync(FIXTURE_URL);
const fixture = hasFixture
  ? JSON.parse(await readFile(FIXTURE_URL, 'utf8'))
  : null;

/**
 * 在 NV8 里跑一遍全部探针。只跑一次，给所有断言复用。
 */
let probePromise = null;

function runProbes() {
  probePromise ??= (async () => {
    const { createSandbox } = await import('../src/public/create-sandbox.js');
    const sandbox = await createSandbox('https://behavior.test/page', {
      page: { html: '<!doctype html><html><head></head><body></body></html>' },
      // 116 个探针里有 14 个会创建 iframe（各自触发一次子 Realm 创建），
      // 一轮下来超过默认的 1000ms。那个默认值是给不受信页面脚本的生产安全
      // 上限，不是「探针该跑多快」的断言。
      limits: { timeoutMs: 30_000 },
    });
    try {
      return JSON.parse(await sandbox.run(buildProbeExpression()));
    } finally {
      await sandbox.close();
      createSandbox.drain();
    }
  })();
  return probePromise;
}

/** 把结果压成一行，便于在断言消息里读。 */
function describe(result) {
  if (result === undefined) return '(缺失)';
  return result.threw ? `${result.name}: ${result.message}` : result.value;
}

/**
 * 已登记的行为差异。
 *
 * 两条跨 Realm 探针，根因是**动态 iframe 的 contentWindow 同步为 null**。
 *
 * 反爬脚本最常用的写法是同步的：
 *
 * ```js
 * const frame = document.createElement('iframe');
 * document.body.appendChild(frame);
 * frame.contentWindow.Function.prototype.toString   // 立即使用
 * ```
 *
 * 实测 NV8 时序：同步 `null` → 微任务后 `null` → 一个宏任务后仍 `null`
 * → 约 265ms 后才可用。真实浏览器在 `appendChild` 返回时就有初始 about:blank
 * 文档。
 *
 * **预热池方案已实现并回滚**（见 `docs/adr/0004-dynamic-iframe-timing.md`）。
 * 池确实让 `contentWindow` 同步可用、intrinsics 独立、原生 toString 正确，
 * 但池位与普通子 Realm 在账目上无法区分，导致 59 项既有测试失败——
 * 所有断言 Realm 数量与清理的测试都会看到多出来的池位。要落地必须先设计
 * 独立的池位账目，那是 ADR-0004 未决的部分。
 *
 * 静态写在页面 HTML 里的 iframe **没有**这个问题。
 */
const DYNAMIC_IFRAME_REASON = '动态 iframe 的 contentWindow 同步为 null；'
  + '预热池方案已实现并回滚（池位与普通子 Realm 账目无法区分，导致 59 项测试失败）；'
  + '见 docs/adr/0004-dynamic-iframe-timing.md';

/**
 * `new URL()` 的校验与规范化都太宽松。
 *
 * 实测三方对比：
 *
 * | 输入 | 真实 Edge | Node | NV8 |
 * |---|---|---|---|
 * | `http://%` | THROWS | THROWS | `http://%/` |
 * | `http://[` | THROWS | THROWS | `http://[/` |
 * | `http://` | THROWS | THROWS | `http:///` |
 * | `http://a:b:c/` | THROWS | THROWS | `http://a:b:c/` |
 * | `https://a b/` | `https://a%20b/` | THROWS | `https://a b/` |
 * | `nv8-unknown://x` | `nv8-unknown://x` | 同 | `nv8-unknown://x/` |
 *
 * `new URL()` 放在 try/catch 里做输入校验是极常见的写法，`url.href` 的
 * 规范化结果也常被直接比较，所以这条不是边角问题。
 *
 * 注意**不能拿 Node 的 URL 当基准**：`https://a b/` 浏览器接受并编码成
 * `%20`，Node 直接抛。基准必须是浏览器。
 *
 * 修它要实现 WHATWG URL 的校验与规范化，是独立工作量。
 */
const URL_PARSING_REASON = 'NV8 的 URL 构造器几乎不校验也不规范化；'
  + '真实 Edge 对 http://% 、http://[ 、http:// 、http://a:b:c/ 均抛 TypeError，'
  + '且把 https://a b/ 编码为 https://a%20b/ 、不给未知 scheme 补尾斜杠';

const KNOWN_BEHAVIOR_DIFFERENCES = Object.freeze({
  'realm/identity-bundle': DYNAMIC_IFRAME_REASON,
  'realm/foreign-native-toString': DYNAMIC_IFRAME_REASON,
  'url/malformed-percent': URL_PARSING_REASON,
  'url/malformed-bracket': URL_PARSING_REASON,
  'url/empty-host': URL_PARSING_REASON,
  'url/multiple-colons-in-authority': URL_PARSING_REASON,
  'url/space-in-host-encoded': URL_PARSING_REASON,
  'url/unknown-scheme-normalization': URL_PARSING_REASON,
});

/**
 * 已知但**探针未覆盖**的行为差距。
 *
 * 探针只锁已建模的部分；这些是明知不一致、刻意不写探针的地方——写了就必然红，
 * 而它们各自需要独立的子系统。列在这里是为了不被遗忘。
 *
 * - **CSS 属性 descriptor 形状**：真实 Edge 的 745 个 CSS 属性是可写**数据属性**
 *   （V8 named property interceptor 在赋值时拦截），NV8 用访问器实现。
 *   纯 JS 复刻不出「数据属性同时拦截赋值」，只能在访问器与 Proxy 之间选。
 *   选访问器是因为读写语义正确比 descriptor 形状更重要。
 * - **布局相关计算值**：`width` / `height` / `blockSize` / `inlineSize` /
 *   `transformOrigin` / `perspectiveOrigin` 及其 webkit 版共 10 项需要布局引擎。
 *   这 10 项是差分实测出来的，不是手写名单。
 */
const UNPROBED_KNOWN_GAPS = Object.freeze({
  cssPropertyDescriptorShape: '访问器 vs 可写数据属性；见 css-style-declaration-properties.js',
  layoutDependentValues: '10 个布局相关属性需要布局引擎；清单见 LAYOUT_DEPENDENT_PROPERTIES',
});

test('unprobed gaps stay documented', () => {
  // 这条不检查行为，只保证清单不被悄悄清空。
  // 原先有三条，「未建模属性的计算值」已解决（40 → 693 个属性）。
  assert.equal(Object.keys(UNPROBED_KNOWN_GAPS).length, 2);
  for (const [name, reason] of Object.entries(UNPROBED_KNOWN_GAPS)) {
    assert.ok(reason.length > 10, `${name} needs a real explanation`);
  }
});

// ------------------------------------------------------ 前提

test('the real-Edge behavior fixture is present and complete', () => {
  assert.ok(hasFixture, 'run: npm run fingerprint:behavior');
  assert.equal(
    fixture.probeCount, BEHAVIOR_PROBES.length,
    'fixture was collected with a different probe set; re-collect it'
  );
  for (const entry of BEHAVIOR_PROBES) {
    assert.ok(
      fixture.results[entry.id] !== undefined,
      `fixture is missing probe ${entry.id}`
    );
  }
});

test('every probe id is unique and carries a category', () => {
  const ids = BEHAVIOR_PROBES.map(entry => entry.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate probe id');
  for (const entry of BEHAVIOR_PROBES) {
    assert.ok(entry.category.length > 0, `${entry.id} has no category`);
    assert.ok(entry.expression.startsWith('()'), `${entry.id} must be a thunk`);
  }
});

// ------------------------------------------------------ 逐类比较

/**
 * 为一个分类生成断言。
 *
 * 按分类切分而不是一个大断言：一个分类整体退化时，报错能直接指出是哪一类
 * 行为坏了，而不是给出一份 30 行的 diff。
 */
function categoryTest(category, label) {
  test(`${label} matches real Edge`, async () => {
    const observed = await runProbes();
    const failures = [];

    for (const entry of BEHAVIOR_PROBES.filter(item => item.category === category)) {
      if (KNOWN_BEHAVIOR_DIFFERENCES[entry.id] !== undefined) continue;
      const expected = fixture.results[entry.id];
      const actual = observed[entry.id];
      if (JSON.stringify(expected) === JSON.stringify(actual)) continue;
      failures.push(
        `${entry.id}\n    真实: ${describe(expected)}\n    NV8 : ${describe(actual)}`
      );
    }

    assert.deepEqual(failures, [], `${label} deviations:\n  ${failures.join('\n  ')}`);
  });
}

categoryTest('nativeToString', 'native function toString');
categoryTest('illegalInvocation', 'illegal receiver handling');
categoryTest('argumentCount', 'WebIDL argument-count errors');
categoryTest('constructorGuard', 'constructor guards');
categoryTest('typeTag', 'Object.prototype.toString tags');
categoryTest('arityMetadata', 'method and constructor length');
categoryTest('errorShape', 'error identity and stack shape');
categoryTest('collections', 'collection iterability and tags');
categoryTest('cssom', 'CSSOM computed values and declaration semantics');
categoryTest('canvas', 'canvas and TextMetrics interface shape');
categoryTest('eventTiming', 'event phases and propagation control');
categoryTest('crossRealm', 'cross-realm object identity');
categoryTest('urlParsing', 'URL validation and normalization');

// ------------------------------------------------------ 整体与登记

test('no behavior probe deviates without being registered', async () => {
  const observed = await runProbes();
  const unregistered = BEHAVIOR_PROBES
    .filter(entry => KNOWN_BEHAVIOR_DIFFERENCES[entry.id] === undefined)
    .filter(entry => (
      JSON.stringify(fixture.results[entry.id]) !== JSON.stringify(observed[entry.id])
    ))
    .map(entry => entry.id);

  assert.deepEqual(
    unregistered, [],
    'fix these or register them in KNOWN_BEHAVIOR_DIFFERENCES with a reason'
  );
});

test('the registry has no stale entries', async () => {
  const observed = await runProbes();
  const stale = Object.keys(KNOWN_BEHAVIOR_DIFFERENCES).filter(id => (
    JSON.stringify(fixture.results[id]) === JSON.stringify(observed[id])
  ));

  // 登记了但其实已经一致的条目要删掉，否则清单会慢慢变成谎言
  assert.deepEqual(stale, [], 'these probes now match; drop them from the registry');
});

// ------------------------------------------------------ 探针自身的确定性

test('probe results are stable across repeated runs', async () => {
  const first = await runProbes();

  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://behavior.test/page', {
    page: { html: '<!doctype html><html><head></head><body></body></html>' },
    limits: { timeoutMs: 30_000 },
  });
  let second;
  try {
    second = JSON.parse(await sandbox.run(buildProbeExpression()));
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }

  // 沿用 observability 的规则：字段只要在重复运行间变化，
  // 它就不属于行为契约，不该待在探针清单里。
  const unstable = BEHAVIOR_PROBES
    .filter(entry => JSON.stringify(first[entry.id]) !== JSON.stringify(second[entry.id]))
    .map(entry => entry.id);

  assert.deepEqual(unstable, [], 'these probes are not deterministic; remove or rewrite them');
});

// ------------------------------------------------------ 回归锚点

test('native function toString hides the JS implementation', async () => {
  const observed = await runProbes();

  // 这是最经典的检测手法。legacy 模式曾完全没有伪装，
  // 因为 setNativeFunctionContext 只有 webidl 插件会调用。
  for (const id of ['toString/addEventListener', 'toString/documentGetElementById']) {
    const value = observed[id].value;
    assert.match(value, /\{ \[native code\] \}$/, `${id} leaks implementation source`);
    assert.equal(value.includes('invoke('), false, `${id} exposes the wrapper body`);
  }
});

test('argument-count errors use the Chromium message template', async () => {
  const observed = await runProbes();
  const result = observed['args/addEventListener-zero'];

  assert.equal(result.threw, true, 'a missing argument must throw');
  // 单复数、接口名、句点都是文案的一部分
  assert.equal(
    result.message,
    "Failed to execute 'addEventListener' on 'EventTarget': 2 arguments required, but only 0 present."
  );
});

test('single-argument errors use the singular noun', async () => {
  const observed = await runProbes();
  assert.match(
    observed['args/getElementById-zero'].message,
    /1 argument required/,
    'one argument must read "argument", not "arguments"'
  );
});

test('new Document() constructs an empty XML document', async () => {
  const observed = await runProbes();

  // 真实浏览器允许构造；迁移前抛 Illegal constructor
  assert.equal(observed['ctor/Document-allowed'].threw, false);
  assert.equal(observed['ctor/Document-allowed'].value, 'true');
});

test('a static iframe exposes contentWindow synchronously', async () => {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://behavior.test/page', {
    page: { html: '<!doctype html><html><body><iframe id="f"></iframe></body></html>' },
    limits: { timeoutMs: 30_000 },
  });

  try {
    const observed = JSON.parse(await sandbox.run(`JSON.stringify({
      windowTag: Object.prototype.toString.call(document.getElementById('f').contentWindow),
      documentTag: Object.prototype.toString.call(document.getElementById('f').contentDocument),
      arrayDiffers: document.getElementById('f').contentWindow.Array !== Array,
    })`));

    // 静态 iframe 在页面构建时已 await，所以能用——这条断言把
    // KNOWN_BEHAVIOR_DIFFERENCES 的范围钉死在**动态创建**上，
    // 避免把整个 iframe Realm 支持误记成缺失。
    assert.equal(observed.windowTag, '[object Window]');
    assert.equal(observed.documentTag, '[object HTMLDocument]');
    assert.equal(observed.arrayDiffers, true, 'child realm must have its own intrinsics');
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
});

test('the dynamic-iframe gap is a timing gap, not a missing feature', async () => {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const { waitForValue } = await import('./helpers/async-wait.js');
  const sandbox = await createSandbox('https://behavior.test/page', {
    page: { html: '<!doctype html><html><body></body></html>' },
    limits: { timeoutMs: 30_000 },
  });

  try {
    await sandbox.run(`
      globalThis.__frame = document.createElement('iframe');
      document.body.appendChild(globalThis.__frame);
      globalThis.__immediate = String(globalThis.__frame.contentWindow);
    `);

    // 同步为 null——这是登记的差异
    assert.equal(await sandbox.run('globalThis.__immediate'), 'null');

    // 但子 Realm 最终会建好：说明这是**时序**差距而不是功能缺失。
    // 轮询而不是固定等待——固定时长是对调度的赌注。
    const tag = await waitForValue(
      () => sandbox.run(
        'Object.prototype.toString.call(globalThis.__frame.contentWindow)'
      ),
      '[object Window]',
      { label: 'dynamic iframe contentWindow' },
    );
    assert.equal(tag, '[object Window]');
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
});
