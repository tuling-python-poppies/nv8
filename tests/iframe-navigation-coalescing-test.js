/**
 * iframe 导航的合并语义
 *
 * 这条差距曾被长期登记：「NV8 对每次属性变更立即导航；真实浏览器
 * 把导航排成任务，`removeAttribute('srcdoc')` + `setAttribute('src')` 合并为
 * 一次。NV8 会先派发一次中间 blank 的 `load`」。
 *
 * **重测后这条不成立。** 实测（Node 22，本文件的四个场景）：
 *
 * ```
 * 同步块内 srcdoc 后改 src   loads = [target]      ← 三次触发点塌成一次
 * 同步连设两次 src           loads = [second]      ← 已合并，最后一个胜出
 * append 后立刻设 src        loads = [target]      ← 已合并
 * append 后立刻 remove       不留下子 Realm
 * ```
 *
 * 原因是合并发生在**完成时**而不是调度时：`navigate()` 每次都给元素记录上的
 * `version` 加一，在飞的那次导航完成后要检查 `current.version === version`，
 * 不相等就 `handle.close()` 并且**不派发 `load`**。所以被顶掉的那次导航既不
 * 提交文档也不派事件。
 *
 * 曾按那条记录实现了「用微任务排队合并」，实测前后**四个场景的可观察行为完全
 * 一致**，于是回滚——为一个测不出收益的改动引入 `navigateClient()` 的 promise
 * 身份变化，是纯风险。这份测试改为把**已经正确的行为锁住**，防止哪天
 * version 机制被改坏。
 *
 * 现在连资源路径也对齐：非空白导航在真正创建子 Realm 前检查版本和连接状态，
 * 被顶掉的导航不会把子 Realm **建出来再关掉**。空白 iframe 仍可从预热池同步取得
 * contentWindow，保持已验证的 opt-in 语义。
 *
 * ## 怎么断言「没有多余的 load」
 *
 * 不用「等 200ms 看还有没有第三个」——那是时长赌注，而且赌不赢：一次子 Realm
 * 构建要几百毫秒，等太短抓不到，等太长又成了 CI 抖动源。
 *
 * 改用**因果顺序**：目标 load 到达后再触发一次导向哨兵 URL 的导航。任何多余的
 * 中间 load 都是更早排队的，必然出现在哨兵之前。于是「有没有多余项」变成
 * 「序列是否恰好等于预期」——确定性断言，不依赖任何时长。
 */

import assert from 'node:assert/strict';
import test from 'node:test';

import { createNv8, domPreset } from '../src/index.js';
import { windowPlugin } from '../src/plugins/window/index.js';
import { messagingPlugin } from '../src/plugins/messaging/index.js';
import { waitUntil } from './helpers/async-wait.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

const SENTINEL = 'https://example.test/sentinel';

async function createDomRuntime() {
  return createNv8({
    plugins: [...domPreset, messagingPlugin, windowPlugin],
    profile: {
      id: 'iframe-navigation-coalescing',
      version: '1.0.0',
      name: 'Test Profile',
      url: 'https://example.test/',
    },
    logger,
  });
}

/**
 * 全文件共用一个 runtime，每个用例只开一个新的 root Realm。
 *
 * 起初每个用例各建一个 `createNv8`。四个 runtime 在并行跑整套测试时把机器压得
 * 足够重，`performance-budget` 的冷启动断言（3000ms 预算）被挤到 3977ms 而
 * 变红——一个新测试文件把另一个文件搞红，是测试成本没控制住，不是预算太紧。
 *
 * 数 Realm 数量的那条用例仍然安全：`before` 是当场取的，不假设从 0 开始。
 */
let runtimePromise = null;

function sharedRuntime() {
  if (runtimePromise === null) runtimePromise = createDomRuntime();
  return runtimePromise;
}

test.after(async () => {
  if (runtimePromise === null) return;
  await (await runtimePromise).destroy();
});

async function withRoot(body) {
  const nv8 = await sharedRuntime();
  const realm = await nv8.sandbox.createRealm({ type: 'root' });
  try {
    return await body({ realm, sandbox: nv8.sandbox });
  } finally {
    await nv8.sandbox.destroyRealm(realm.id).catch(() => {});
  }
}

/**
 * 跑一个场景并返回 `load` 序列。
 *
 * `setup` 是一段在 Realm 里执行的源码，可以用 `frame` 这个绑定。它跑完之后
 * 测试等到哨兵导航的 load 到达，再把整段序列取回来。
 *
 * @param {object} realm
 * @param {string} setup
 * @returns {Promise<string[]>}
 */
async function loadSequence(realm, setup) {
  await realm.evaluate(`(() => {
    globalThis.__loads = [];
    const frame = document.createElement('iframe');
    globalThis.__frame = frame;
    frame.addEventListener('load', () => {
      globalThis.__loads.push(
        frame.contentDocument === null ? 'cross-origin' : frame.contentDocument.URL,
      );
    });
    ${setup}
  })()`);

  // 等场景自己的导航都落地：序列不再增长就说明这一批完成了。
  // 这里等的是"出现至少一个 load"，随后靠哨兵封尾，不靠时长判断结束。
  await waitUntil(
    async () => JSON.parse(await realm.evaluate('JSON.stringify(globalThis.__loads)')).length > 0,
    { label: 'the first iframe load' },
  );

  // 哨兵：任何多余的中间 load 都排在它前面，所以只要序列以哨兵结尾且中间没有
  // 意外项，就证明没有多余导航。
  await realm.evaluate(`(() => {
    globalThis.__frame.removeAttribute('srcdoc');
    globalThis.__frame.setAttribute('src', ${JSON.stringify(SENTINEL)});
  })()`);
  await waitUntil(
    async () => {
      const loads = JSON.parse(await realm.evaluate('JSON.stringify(globalThis.__loads)'));
      return loads[loads.length - 1] === SENTINEL;
    },
    { label: 'the sentinel navigation' },
  );

  return JSON.parse(await realm.evaluate('JSON.stringify(globalThis.__loads)'));
}

// ------------------------------------------------------ 合并

test('replacing srcdoc with src commits no intermediate blank document', async () => {
  const loads = await withRoot(({ realm }) => loadSequence(realm, `
    frame.srcdoc = '<!doctype html><html><body><main id="old">old</main></body></html>';
    document.body.appendChild(frame);
    frame.removeAttribute('srcdoc');
    frame.setAttribute('src', 'https://example.test/second');
  `));

  // 同一个同步块里的三次导航触发点（append 的 srcdoc、移除 srcdoc 后的空白、
  // 设置 src）全部塌成一次：只有最后那个提交并派发 `load`。
  //
  // 另一种写法（在 srcdoc 的 `load` 处理器里再改属性）会得到两个 load，
  // 因为那时第一次导航已经完成了——真实浏览器同样是两次。合并只作用于
  // 同一个同步块。
  assert.deepEqual(loads, [
    'https://example.test/second',
    SENTINEL,
  ]);
});

test('two synchronous src assignments navigate once, to the last value', async () => {
  const loads = await withRoot(({ realm }) => loadSequence(realm, `
    frame.src = 'https://example.test/first';
    frame.src = 'https://example.test/second';
    document.body.appendChild(frame);
  `));

  assert.deepEqual(loads, ['https://example.test/second', SENTINEL]);
});

test('setting src right after append yields a single load', async () => {
  const loads = await withRoot(({ realm }) => loadSequence(realm, `
    document.body.appendChild(frame);
    frame.src = 'https://example.test/target';
  `));

  // append 本身也是一次导航触发点；它和紧随的属性变更必须合并。
  assert.deepEqual(loads, ['https://example.test/target', SENTINEL]);
});

// ------------------------------------------------------ 排队期间被移除

test('an iframe appended and removed in one block leaves no child Realm', async () => {
  await withRoot(async ({ realm, sandbox }) => {
    const before = sandbox.inspect().realms.length;

    await realm.evaluate(`(() => {
      const frame = document.createElement('iframe');
      frame.src = 'https://example.test/never';
      document.body.appendChild(frame);
      frame.remove();
    })()`);

    // 用一次真实的 iframe 加载当作时钟：它完成时，被移除的那个如果留下了
    // Realm，数量就会比预期多一个。比等固定时长可靠。
    await realm.evaluate(`(() => {
      globalThis.__probe = document.createElement('iframe');
      globalThis.__probe.src = ${JSON.stringify(SENTINEL)};
      document.body.appendChild(globalThis.__probe);
    })()`);
    await waitUntil(
      () => sandbox.inspect().realms.length >= before + 1,
      { label: 'the probe iframe realm' },
    );

    assert.equal(
      sandbox.inspect().realms.length, before + 1,
      'the removed iframe must not leave a child Realm behind'
    );
  });
});
