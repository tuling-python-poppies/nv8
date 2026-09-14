/**
 * 同源 `parent` / `top` 的对象身份与跨帧 DOM 访问
 *
 * 这一组锁 ADR-0007 选项 A + C 的结果。原实现用
 * `createSameOriginParentFacade()` 返回 `Object.create(parentWindow)`，实测证明
 * **原型委托对 vm 全局只有一半有效**：
 *
 * | 访问方式 | 普通数据属性 | `document` / `location` |
 * |---|---|---|
 * | `Object.create(parentWindow)` | 委托成功 | **返回子自己的** |
 * | 直接持有父 global | 正确 | 正确 |
 *
 * 后果是同源子帧里 `parent.document === document` 为 true——读到的是自己的文档。
 * 不报错、不为 null，返回一个形状完全正常的 `HTMLDocument`。
 *
 * 对协议恢复来说这是最坏的一类失败：反爬 SDK 与验证码组件**故意**跑在 iframe 里
 * （为了拿干净的 intrinsics），然后回头读 `parent.document.referrer` /
 * `parent.location.href` / `parent.document.cookie`，这些经常直接进签名 payload。
 * 读错了脚本照样跑完、照样吐出格式正常的 token，只是算错了输入——本地零信号，
 * 只在服务端被拒。
 *
 * 所以断言分两组：**身份**与**跨帧 DOM 读取**。后者才是真正的目的，
 * 前者只是同一个根因的另一面。
 */

import assert from 'node:assert/strict';
import test from 'node:test';

const PAGE_HTML = '<!doctype html><html><head><title>parent-title</title></head><body>'
  + '<div id="parent-only">P</div>'
  + '<iframe id="same" srcdoc="<!doctype html><html><body>'
  + '<div id=child-only>C</div></body></html>"></iframe>'
  + '<iframe id="cross" src="https://other.test/frame"></iframe>'
  + '</body></html>';

let sandboxPromise = null;

function sharedSandbox() {
  if (sandboxPromise === null) {
    sandboxPromise = (async () => {
      const { createSandbox } = await import('../src/public/create-sandbox.js');
      return createSandbox('https://parent.test/page', {
        page: { html: PAGE_HTML },
        limits: { timeoutMs: 30_000 },
      });
    })();
  }
  return sandboxPromise;
}

test.after(async () => {
  if (sandboxPromise === null) return;
  const sandbox = await sandboxPromise;
  await sandbox.close();
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  createSandbox.drain();
});

/** 在**子 Realm 内部**求值——真实脚本就在那里跑。 */
async function inChild(expression, frameId = 'same') {
  const sandbox = await sharedSandbox();
  const source = `JSON.stringify(${expression})`;
  return JSON.parse(await sandbox.run(
    `document.getElementById(${JSON.stringify(frameId)})`
    + `.contentWindow.eval(${JSON.stringify(source)})`,
  ));
}

async function inParent(expression) {
  const sandbox = await sharedSandbox();
  return JSON.parse(await sandbox.run(`JSON.stringify(${expression})`));
}

// ------------------------------------------------------ 跨帧 DOM 读取（目的）

test('a same-origin child reads the real parent document', async () => {
  const observed = await inChild(`({
    hasParentOnly:  parent.document.getElementById('parent-only') !== null,
    hasChildOnly:   parent.document.getElementById('child-only') !== null,
    sameAsOwn:      parent.document === document,
    parentTitle:    parent.document.title,
    ownTitle:       document.title,
  })`);

  assert.equal(observed.hasParentOnly, true, 'parent.document must be the parent document');
  assert.equal(observed.hasChildOnly, false, 'parent.document must not be the child document');
  assert.equal(observed.sameAsOwn, false);
  assert.equal(observed.parentTitle, 'parent-title');
  // srcdoc 子文档没有 title
  assert.equal(observed.ownTitle, '');
});

test('a same-origin child reads the real parent location', async () => {
  const observed = await inChild(`({
    parentHref: parent.location.href,
    sameObject: parent.location === location,
  })`);

  assert.equal(observed.parentHref, 'https://parent.test/page');
  assert.equal(observed.sameObject, false);
});

// ------------------------------------------------------ 身份

test('same-origin parent and top are the parent window itself', async () => {
  const observed = await inParent(`(() => {
    const inner = document.getElementById('same').contentWindow;
    return {
      parentIsWindow:  inner.parent === window,
      topIsWindow:     inner.top === window,
      parentDotWindow: inner.parent === inner.parent.window,
      parentDotSelf:   inner.parent === inner.parent.self,
      // facade 的原型是父 window 本身；真实 window 的原型是 Window.prototype。
      // 这条比数自有属性可靠——真实 window 本来就有 postMessage/window/self。
      protoIsParentWindow: Object.getPrototypeOf(inner.parent) === window,
    };
  })()`);

  assert.equal(observed.parentIsWindow, true);
  assert.equal(observed.topIsWindow, true);
  assert.equal(observed.parentDotWindow, true);
  assert.equal(observed.parentDotSelf, true);
  assert.equal(observed.protoIsParentWindow, false, 'no facade shim should remain');
});

test('in-frame embedding detection still reports being framed', async () => {
  // 这一组在改动前**本来就是对的**，容易在重构里被弄坏：子帧里
  // `parent !== window` 必须仍为 true，否则脚本会以为自己是顶层窗口。
  const observed = await inChild(`({
    topNotSelf:      top !== self,
    parentNotWindow: parent !== window,
    parentIsSelf:    parent === self,
    framed:          window.frameElement !== null,
  })`);

  assert.equal(observed.topNotSelf, true);
  assert.equal(observed.parentNotWindow, true);
  assert.equal(observed.parentIsSelf, false);
  assert.equal(observed.framed, true);
});

// ------------------------------------------------------ 跨源不受影响

test('a cross-origin parent still gets the restricted facade', async () => {
  // 跨源那条路径走 createWindowFacade()，只暴露规范允许的成员，不依赖原型委托，
  // 所以没有同一个问题。这条断言防止「顺手把跨源也改成真对象」。
  const observed = await inParent(`(() => {
    const frame = document.getElementById('cross');
    const inner = frame.contentWindow;
    return {
      contentDocumentIsNull: frame.contentDocument === null,
      // 门面是 Object.create(null) + 白名单成员，所以 document 压根不存在
      documentOnFacade: typeof inner.document,
      protoIsNull: Object.getPrototypeOf(inner) === null,
    };
  })()`);

  assert.equal(observed.contentDocumentIsNull, true, 'cross-origin contentDocument must be null');
  assert.equal(observed.documentOnFacade, 'undefined');
  assert.equal(observed.protoIsNull, true, 'the cross-origin facade is a null-prototype object');
});

// ------------------------------------------------------ incumbent 的方向安全

/**
 * `event.source` 靠 incumbent 近似还原（见 `window-messaging.js`）。
 *
 * 直写形式 `parent.postMessage(x, '*')` 精确正确，由
 * `iframe-parent-message-test.js` 覆盖。这里锁的是**方向安全**：无论近似何时失效，
 * 都不能把 A 的消息记成 B 的。
 *
 * 刻意**不**断言别名写法（`const p = parent; setTimeout(...)`）具体退化到哪个值。
 * 那取决于微任务与宏任务的相对时序，把它写成契约就是把一次偶然调度当契约
 * ——async 脚本的调度断言踩过同一个坑。
 */
test('a message from one child is never attributed to its sibling', async () => {
  const sandbox = await sharedSandbox();
  await sandbox.run(`(() => {
    globalThis.__attributed = null;
    const same = document.getElementById('same');
    const cross = document.getElementById('cross');
    window.addEventListener('message', (event) => {
      if (event.data !== 'sibling-probe') return;
      globalThis.__attributed = {
        isSame:  event.source === same.contentWindow,
        isCross: event.source === cross.contentWindow,
        isSelf:  event.source === window,
      };
    });
    // 先让**另一个** frame 读一次 parent，再由 same 发消息。
    // 如果 incumbent 记错了归属，这里就会把消息记到 cross 头上。
    cross.contentWindow.parent;
    same.contentWindow.eval("parent.postMessage('sibling-probe', '*')");
  })()`);

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const value = await sandbox.run('JSON.stringify(globalThis.__attributed)');
    if (value !== 'null') {
      const observed = JSON.parse(value);
      assert.equal(observed.isCross, false, 'must never be attributed to the sibling');
      assert.equal(
        observed.isSame || observed.isSelf, true,
        'source must be the sending child or degrade to the parent window',
      );
      return;
    }
    await new Promise((resolve) => { setTimeout(resolve, 2); });
  }
  assert.fail('the probe message never arrived');
});
