/**
 * 跨源窗口访问的 Edge 语义
 *
 * 门面此前是 `Object.create(null)` + 白名单：白名单之外的属性读取返回
 * **静默 `undefined`**。真实 Edge 抛 SecurityError——两者对探测脚本的含义
 * 完全不同：`typeof win.document === 'undefined'` 会让脚本走进「拿到了一个
 * 没有 document 的 window」的错误分支，而不是「被隔离了」的正确分支。
 *
 * 本组锁定：
 * - 非白名单命名属性读取 → `Failed to read a named property ... from 'Window'`
 *   SecurityError（caller origin 按访问方给出）；
 * - 白名单成员照常（`closed` / `postMessage` / `window` / `self` / `frames`）；
 * - 符号键与 `in` / 属性描述符查询必须**不抛**（否则 Promise 解析、
 *   `instanceof` 等内部机制会被误伤）；
 * - `Location` 的受限读取同样给 Edge 文案；
 * - 子 Realm 读 `parent` 门面时，文案里的 origin 是子 Realm 自己。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const PAGE_HTML = '<!doctype html><html><head></head><body>'
  + '<iframe id="cross" src="https://other.test/frame"></iframe>'
  + '</body></html>';

let sandboxPromise = null;

function sandbox() {
  sandboxPromise ??= (async () => {
    const { createSandbox } = await import('../src/public/create-sandbox.js');
    return createSandbox('https://parent.test/page', {
      page: { html: PAGE_HTML },
      limits: { timeoutMs: 30_000 },
    });
  })();
  return sandboxPromise;
}

async function evaluate(source) {
  const instance = await sandbox();
  return JSON.parse(await instance.run(`JSON.stringify((() => { ${source} })())`));
}

test.after(async () => {
  if (sandboxPromise === null) return;
  const instance = await sandboxPromise;
  await instance.close();
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  createSandbox.drain();
});

test('reading a non-allowlisted property throws the Edge SecurityError', async () => {
  const observed = await evaluate(`
    const frame = document.getElementById('cross');
    const inner = frame.contentWindow;
    const read = property => {
      try { void inner[property]; return { value: 'readable' }; }
      catch (error) { return { name: error.name, message: error.message }; }
    };
    return { document: read('document'), frameElement: read('frameElement') };
  `);

  assert.equal(observed.document.name, 'SecurityError');
  assert.equal(
    observed.document.message,
    'Failed to read a named property \'document\' from \'Window\': '
      + 'Blocked a frame with origin "https://parent.test" '
      + 'from accessing a cross-origin frame.',
  );
  assert.equal(observed.frameElement.name, 'SecurityError');
  assert.match(
    observed.frameElement.message,
    /Failed to read a named property 'frameElement' from 'Window'/,
  );
});

test('allowlisted members keep working', async () => {
  const observed = await evaluate(`
    const frame = document.getElementById('cross');
    const inner = frame.contentWindow;
    return {
      closedType: typeof inner.closed,
      postMessageType: typeof inner.postMessage,
      windowSelf: inner.window === inner && inner.self === inner,
      framesSelf: inner.frames === inner,
      contentDocument: frame.contentDocument,
      protoIsNull: Object.getPrototypeOf(inner) === null,
    };
  `);

  assert.equal(observed.closedType, 'boolean');
  assert.equal(observed.postMessageType, 'function');
  assert.equal(observed.windowSelf, true);
  assert.equal(observed.framesSelf, true);
  assert.equal(observed.contentDocument, null);
  assert.equal(observed.protoIsNull, true);
});

test('probes and internal protocols do not throw on symbol reads', async () => {
  const observed = await evaluate(`
    const inner = document.getElementById('cross').contentWindow;
    const attempt = operation => {
      try { return operation(); } catch (error) { return 'threw:' + error.name; }
    };
    return {
      hasIn: 'document' in inner,
      descriptor: attempt(() => Object.getOwnPropertyDescriptor(inner, 'document')),
      prototype: attempt(() => Object.getPrototypeOf(inner)),
      instanceOf: attempt(() => inner instanceof Object),
      stringTag: attempt(() => Object.prototype.toString.call(inner)),
      ownKeys: attempt(() => Object.getOwnPropertyNames(inner).sort().join(',')),
    };
  `);

  assert.equal(observed.hasIn, false, '`in` must not throw');
  assert.equal(observed.descriptor, undefined, 'descriptors must not throw');
  assert.equal(observed.prototype, null);
  assert.equal(observed.instanceOf, false);
  assert.equal(typeof observed.stringTag, 'string');
  assert.match(observed.ownKeys, /window/);
  assert.match(observed.ownKeys, /postMessage/);
  assert.ok(
    !observed.ownKeys.includes('document'),
    'the facade must not expose a document own property',
  );

  // Promise 解析会读 `then`（符号机制之外的命名属性），必须不抛。
  const thenResult = await (await sandbox()).run(`
    Promise.resolve(document.getElementById('cross').contentWindow)
      .then(() => 'then-read-ok', () => 'then-read-threw')
  `);
  assert.equal(thenResult, 'then-read-ok');
});

test('cross-origin location reads use the Location message', async () => {
  const observed = await evaluate(`
    const inner = document.getElementById('cross').contentWindow;
    try { void inner.location.href; return { value: 'readable' }; }
    catch (error) { return { name: error.name, message: error.message }; }
  `);

  assert.equal(observed.name, 'SecurityError');
  assert.equal(
    observed.message,
    'Failed to read a named property \'href\' from \'Location\': '
      + 'Blocked a frame with origin "https://parent.test" '
      + 'from accessing a cross-origin frame.',
  );
});

test('the child reads a restricted parent facade with its own origin in the message', async () => {
  // 子 Realm 的页面脚本读 `parent.document`，把结果 postMessage 回父页。
  // 父侧无法直接进跨源子 Realm（`inner.eval` 本身就该抛 SecurityError），
  // 所以走真实的消息通道。
  const CHILD_HTML = '<!doctype html><html><body><script>'
    + 'var outcome;'
    + 'try { void parent.document; outcome = { value: "readable" }; }'
    + 'catch (error) { outcome = { name: error.name, message: error.message }; }'
    + 'parent.postMessage(JSON.stringify(outcome), "*");'
    + '</' + 'script></body></html>';
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const instance = await createSandbox('https://parent.test/probe', {
    page: { html: '<!doctype html><html><body></body></html>' },
    replay: [{
      method: 'GET',
      url: 'https://other.test/child-probe',
      status: 200,
      headers: { 'Content-Type': 'text/html' },
      body: CHILD_HTML,
    }],
    limits: { timeoutMs: 30_000 },
  });
  try {
    const raw = await instance.run(`
      new Promise(resolve => {
        addEventListener('message', event => resolve(JSON.stringify({
          origin: event.origin,
          outcome: event.data,
        })), { once: true });
        const frame = document.createElement('iframe');
        frame.src = 'https://other.test/child-probe';
        document.body.appendChild(frame);
      })
    `);
    const observed = JSON.parse(raw);
    assert.equal(observed.origin, 'https://other.test');
    const outcome = JSON.parse(observed.outcome);
    assert.equal(outcome.name, 'SecurityError');
    assert.equal(
      outcome.message,
      'Failed to read a named property \'document\' from \'Window\': '
        + 'Blocked a frame with origin "https://other.test" '
        + 'from accessing a cross-origin frame.',
      'the caller origin in the message is the reading frame',
    );
  } finally {
    await instance.close();
    createSandbox.drain();
  }
});
