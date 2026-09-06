/**
 * 预热子 Realm 池（ADR-0004 选项 A，opt-in）
 *
 * 反爬脚本最常用的「从干净 iframe 取原生函数」写法是**同步**的：
 *
 * ```js
 * const f = document.createElement('iframe');
 * document.body.appendChild(f);
 * f.contentWindow.Function.prototype.toString    // NV8 默认: TypeError
 * ```
 *
 * 这不是「指纹不对」而是「跑不起来」——脚本在那一行抛 TypeError，整个目标无法运行。
 *
 * ## 为什么预热「已激活的 Realm」而不是「shell」
 *
 * 仓库里本来就有异步准备 + 同步激活的机制（`createRealmShellAsync` /
 * `activateRealmShell`，根 Realm 一直在用）。实测把 254ms 拆开：
 *
 * ```
 * createRealmShellAsync  (异步：模块图加载+链接)   median 148ms
 * activateRealmShell     (同步：337 个 install)    median 106ms
 * ```
 *
 * 只预热 shell 的话，`appendChild` 里仍要同步跑 106ms。真实浏览器建初始
 * about:blank 文档是微秒级——同步卡 106ms 本身就是一个浏览器没有的时序特征。
 * 预热**已激活**的 Realm 把开销全部前移到 `create()`：逆向场景里启动慢无所谓，
 * 运行时的时序异常才要命。
 *
 * ## 为什么默认关闭
 *
 * 每个池位 254ms 且占一个子 Realm 的堆额度（512MB 默认只装得下 11 个）。
 * NV8 每个目标本来就有自己的 Profile / evidence / replay，按目标付这笔钱才合理。
 *
 * 默认关闭还是上一次实现被回滚的教训：那次池永远开着，池位与业务 Realm 在账目上
 * 无法区分，全量套件 59 项红。默认 0 意味着现有测试看到零个池位，账目完全不变。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const PAGE_HTML = '<!doctype html><html><head></head><body></body></html>';

async function withSandbox(limits, body) {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://pool.test/page', {
    page: { html: PAGE_HTML },
    limits: { timeoutMs: 30_000, ...limits },
  });
  try {
    return await body(sandbox);
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
}

/** 同步建 iframe 并立刻读 `contentWindow`——不给任何 await 的机会。 */
const SYNC_PROBE = `JSON.stringify((() => {
  const frame = document.createElement('iframe');
  document.body.appendChild(frame);
  const win = frame.contentWindow;
  if (win === null) return { syncAvailable: false };
  return {
    syncAvailable: true,
    windowTag: Object.prototype.toString.call(win),
    documentTag: Object.prototype.toString.call(win.document),
    arrayDiffers: win.Array !== Array,
    selfRef: win.window === win && win.self === win,
    parentIsWindow: win.parent === window,
    topIsWindow: win.top === window,
    frameElementMatches: win.frameElement === frame,
    nativeToString: win.Function.prototype.toString.call(
      win.EventTarget.prototype.addEventListener,
    ),
  };
})())`;

// ------------------------------------------------------ 默认关闭

test('the pool is off by default and the gap is unchanged', async () => {
  await withSandbox({}, async (sandbox) => {
    const observed = JSON.parse(await sandbox.run(SYNC_PROBE));
    // 默认行为必须一个字节都不变：这是上次回滚的教训
    assert.equal(observed.syncAvailable, false);
  });
});

test('an explicit zero is the same as the default', async () => {
  await withSandbox({ prewarmChildRealms: 0 }, async (sandbox) => {
    const observed = JSON.parse(await sandbox.run(SYNC_PROBE));
    assert.equal(observed.syncAvailable, false);
  });
});

// ------------------------------------------------------ 开启后

test('a prewarmed slot makes contentWindow synchronously usable', async () => {
  await withSandbox({ prewarmChildRealms: 1 }, async (sandbox) => {
    const observed = JSON.parse(await sandbox.run(SYNC_PROBE));

    assert.equal(observed.syncAvailable, true, 'contentWindow must not be null');
    assert.equal(observed.windowTag, '[object Window]');
    assert.equal(observed.documentTag, '[object HTMLDocument]');
    // 池位必须是**独立的** Realm：共用 intrinsics 的话「从干净 iframe 取原生函数」
    // 这套探测就失去意义，而脚本一比就能发现
    assert.equal(observed.arrayDiffers, true, 'the slot needs its own intrinsics');
    assert.equal(observed.selfRef, true);
    assert.equal(
      observed.nativeToString,
      'function addEventListener() { [native code] }',
      'the whole point is that this line runs and returns the native form',
    );
  });
});

test('a prewarmed slot is reparented to the real parent window', async () => {
  // 池位在根 Realm **之前**就建好了（否则 contentWindow 无法同步可用），那时还没有
  // parentWindow 可传，所以它是以「自己是顶层」的状态引导的。被领走时
  // `reparentRealm()` 补上父子关系——这一条正是验证那次补配生效。
  await withSandbox({ prewarmChildRealms: 1 }, async (sandbox) => {
    const observed = JSON.parse(await sandbox.run(SYNC_PROBE));

    assert.equal(observed.parentIsWindow, true, 'parent must be the real parent window');
    assert.equal(observed.topIsWindow, true);
    assert.equal(observed.frameElementMatches, true, 'frameElement must be the container');
  });
});

test('the pool closes the cross-realm identity probe', async () => {
  // 这段表达式与 `src/baseline/behavior-probes.js` 的 realm/identity-bundle 同源。
  // 那两条探针在默认配置下登记为已知差异（池关着，contentWindow 为 null）；
  // 开池后必须逐字等于真实 Edge 151 的采集值。
  //
  // 空白 iframe 的 `href` 与 origin 已解耦：URL 是 `about:blank`，origin 仍继承
  // 父页面。这条和预热池本身无关，但池位重配时也必须保持这一契约。
  await withSandbox({ prewarmChildRealms: 1 }, async (sandbox) => {
    const observed = JSON.parse(await sandbox.run(`JSON.stringify((() => {
      const frame = document.createElement('iframe');
      document.body.appendChild(frame);
      const win = frame.contentWindow;
      if (win === null) return 'contentWindow-null';
      const doc = win.document;
      const foreignArray = new win.Array(1, 2);
      const foreignElement = doc.createElement('div');
      const foreignError = new win.TypeError('probe');
      const parts = [
        Object.prototype.toString.call(win),
        Object.prototype.toString.call(doc),
        'docMatches=' + (doc === win.document),
        'arrayDiffers=' + (win.Array !== Array),
        'instanceofAcross=' + ([] instanceof win.Array),
        'isArrayForeign=' + Array.isArray(foreignArray),
        'foreignInstanceofLocal=' + (foreignArray instanceof Array),
        Object.prototype.toString.call(foreignElement),
        'elementInstanceofLocal=' + (foreignElement instanceof HTMLDivElement),
        'elementInstanceofForeign=' + (foreignElement instanceof win.HTMLDivElement),
        'errorInstanceofLocal=' + (foreignError instanceof TypeError),
        Object.prototype.toString.call(foreignError),
        'selfRef=' + (win.window === win) + ',' + (win.self === win),
        'parentIsUs=' + (win.parent === window),
        'topMatches=' + (win.top === window.top),
        'frameElementMatches=' + (win.frameElement === frame),
      ];
      frame.remove();
      return parts.join(' | ');
    })())`));

    assert.equal(observed, [
      '[object Window]',
      '[object HTMLDocument]',
      'docMatches=true',
      'arrayDiffers=true',
      'instanceofAcross=false',
      'isArrayForeign=true',
      'foreignInstanceofLocal=false',
      '[object HTMLDivElement]',
      'elementInstanceofLocal=false',
      'elementInstanceofForeign=true',
      'errorInstanceofLocal=false',
      '[object Error]',
      'selfRef=true,true',
      'parentIsUs=true',
      'topMatches=true',
      'frameElementMatches=true',
    ].join(' | '));
  });
});

// ------------------------------------------------------ 账目与边界

/**
 * 账目断言必须走 `EdgeSandbox` —— `createSandbox()` 返回的对象**没有**
 * `resources()`。第一版用了 `sandbox.resources?.()` 加空值保护，结果是它永远
 * 返回 undefined、断言一条都没跑：一个静默通过的测试比没有测试更糟。
 */
async function withEdgeSandbox(limits, body) {
  const { EdgeSandbox } = await import('../src/public/edge-sandbox.js');
  const sandbox = await EdgeSandbox.create({
    page: { url: 'https://pool.test/page', html: PAGE_HTML },
    limits: { timeoutMs: 30_000, ...limits },
  });
  try {
    return await body(sandbox);
  } finally {
    await sandbox.close();
  }
}

test('idle slots are reported separately from business realms', async () => {
  // 池位同时在 childRealms 里（它们是真实的 Realm，占真实的堆），所以必须参与容量
  // 守卫和关闭清理。单列出来才能回答「当前有几个业务 Realm」。
  // 假装池位不占内存就是重犯 heapSafeRealmLimitFor 修掉的那个错。
  await withEdgeSandbox({ prewarmChildRealms: 2 }, async (sandbox) => {
    const before = await sandbox.resources();
    assert.equal(before.idlePrewarmedRealms, 2);
    assert.equal(before.childRealms, 2, 'slots count as real realms');

    await sandbox.evaluate(`(() => {
      document.body.appendChild(document.createElement('iframe'));
    })()`);

    const after = await sandbox.resources();
    assert.equal(after.idlePrewarmedRealms, 1, 'one slot was handed over');
    assert.equal(after.childRealms, 2, 'the total is unchanged — it was reused');
  });
});

test('an iframe with srcdoc does not consume a prewarmed slot', async () => {
  // 池位的文档是空白骨架。带 src / srcdoc 的 iframe 需要不同的文档，重建文档和
  // 新建一个 Realm 没有区别，走池只会多一层复杂度还容易发错文档。
  await withEdgeSandbox({ prewarmChildRealms: 1 }, async (sandbox) => {
    const observed = JSON.parse((await sandbox.evaluate(`JSON.stringify((() => {
      const frame = document.createElement('iframe');
      frame.srcdoc = '<!doctype html><html><body>x</body></html>';
      document.body.appendChild(frame);
      return { syncAvailable: frame.contentWindow !== null };
    })())`)).value);

    assert.equal(observed.syncAvailable, false, 'srcdoc must not take a slot');
    assert.equal(
      (await sandbox.resources()).idlePrewarmedRealms, 1,
      'the slot is still idle',
    );
  });
});

test('the pool is exhausted rather than unbounded', async () => {
  // 池深 N 只覆盖建 ≤N 个 iframe 的目标，超出退回原行为。这条把「缓解不是根治」
  // 写成断言：以为「iframe 已经修好了」比知道自己在赌更危险。
  await withSandbox({ prewarmChildRealms: 1 }, async (sandbox) => {
    const observed = JSON.parse(await sandbox.run(`JSON.stringify((() => {
      const first = document.createElement('iframe');
      document.body.appendChild(first);
      const second = document.createElement('iframe');
      document.body.appendChild(second);
      return {
        first: first.contentWindow !== null,
        second: second.contentWindow !== null,
      };
    })())`));

    assert.equal(observed.first, true);
    assert.equal(observed.second, false, 'the second falls back to the async path');
  });
});
