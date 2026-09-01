/**
 * `window.frameElement`
 *
 * 迁移前它是硬编码的 `() => null`（`window-state-globals-runtime.js`），于是
 * iframe 里的脚本永远看不到自己的容器元素。
 *
 * 这不只是「少一个值」：广告与反爬代码常用 `frameElement` 判断「我是不是被嵌在
 * 别人页面里」，恒为 null 等于声称自己是顶层窗口，而同时 `parent !== window`
 * ——**两个信号自相矛盾**，比单独一处错更容易被识别。
 *
 * ## 跨 Realm 语义
 *
 * `frameElement` 返回的是**父 Realm 的 DOM 对象**，这是正确的：真实浏览器里该
 * 元素属于父文档。所以在子 Realm 里
 *
 * ```
 * frameElement instanceof HTMLIFrameElement          // false（子 Realm 的构造器）
 * frameElement instanceof parent.HTMLIFrameElement   // true
 * ```
 *
 * 这条容易被误当成 bug 而"修"成子 Realm 的对象——那才是偏差。
 *
 * ## 只在 legacy 模式
 *
 * plugin 模式的 Window 表面里没有 `frameElement`（surface fixture 的 plugin
 * 档是 ABSENT），按 ADR-0001 这是按需组装的结果而非缺陷。所以本文件只测
 * legacy 入口。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const PAGE_HTML = '<!doctype html><html><head></head><body>'
  + '<iframe id="same"></iframe>'
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

async function probe(expression) {
  const sandbox = await sharedSandbox();
  return JSON.parse(await sandbox.run(`JSON.stringify(${expression})`));
}

test('the top-level window has no frameElement', async () => {
  const observed = await probe(`(() => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'frameElement');
    return {
      value: window.frameElement,
      isNull: window.frameElement === null,
      // 必须是访问器而不是数据属性，且不可写——真实 Edge 如此
      hasGetter: typeof descriptor.get,
      hasSetter: typeof descriptor.set,
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
    };
  })()`);

  assert.equal(observed.isNull, true, 'a top-level window is not framed');
  assert.equal(observed.hasGetter, 'function');
  assert.equal(observed.enumerable, true);
  assert.equal(observed.configurable, true);
});

test('a same-origin iframe sees its own container element', async () => {
  const observed = await probe(`(() => {
    const frame = document.getElementById('same');
    const inner = frame.contentWindow;
    return {
      identical: inner.frameElement === frame,
      tag: Object.prototype.toString.call(inner.frameElement),
      id: inner.frameElement.id,
      // 容器元素属于**父**文档
      ownerIsParentDocument: inner.frameElement.ownerDocument === document,
    };
  })()`);

  assert.equal(observed.identical, true, 'frameElement must be the very element');
  assert.equal(observed.tag, '[object HTMLIFrameElement]');
  assert.equal(observed.id, 'same');
  assert.equal(observed.ownerIsParentDocument, true);
});

test('frameElement keeps cross-realm instanceof semantics', async () => {
  // 真实浏览器里这两个结果就是一 false 一 true。把它"修"成子 Realm 的对象
  // 才是偏差——那会让 `frameElement.ownerDocument === parent.document` 变 false。
  const observed = await probe(`(() => {
    const frame = document.getElementById('same');
    const inner = frame.contentWindow;
    return {
      viaChildConstructor: inner.frameElement instanceof inner.HTMLIFrameElement,
      viaParentConstructor: inner.frameElement instanceof HTMLIFrameElement,
    };
  })()`);

  assert.equal(observed.viaChildConstructor, false);
  assert.equal(observed.viaParentConstructor, true);
});

test('a cross-origin iframe gets null, not the element', async () => {
  // 规范要求容器文档与本文档不同源时返回 null。泄露元素等于把跨源隔离打穿：
  // 拿到元素就能顺着 ownerDocument 读父文档。
  const observed = await probe(`(() => {
    const frame = document.getElementById('cross');
    try {
      // 跨源 iframe 的 contentWindow 是门面，只暴露允许的成员
      return { frameElement: frame.contentWindow.frameElement ?? null };
    } catch (error) {
      return { threw: error.name };
    }
  })()`);

  assert.equal(observed.frameElement ?? null, null);
});
