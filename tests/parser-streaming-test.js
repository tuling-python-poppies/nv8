/**
 * 流式解析语义
 *
 * 真实浏览器边解析边执行：遇到 parser-blocking 脚本就**暂停解析**，执行脚本，
 * 再继续。因此脚本运行时只能看到自己**之前**的 DOM。
 *
 * ```html
 * <div id=a></div>
 * <script>
 *   document.getElementById('a')  // 元素存在
 *   document.getElementById('b')  // null —— 还没解析到
 *   document.readyState           // 'loading'
 * </script>
 * <div id=b></div>
 * ```
 *
 * NV8 迁移前是 one-shot：整个文档解析并组装完成后才批量执行 inline 脚本。
 * 脚本看到的是**完整** DOM，且 `readyState` 已是 `'complete'`。
 *
 * 这不是细节。大量反爬与指纹脚本依赖「我运行时后面的 DOM 还不存在」，
 * `readyState === 'complete'` 更是明确信号——正常页面里 inline 脚本绝不可能
 * 在 complete 状态下首次运行。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

/** 在沙箱里加载一段 HTML 并取回脚本记录的观测值。 */
async function observe(html, expression = 'JSON.stringify(window.__log ?? null)') {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://parser.test/', { page: { html } });
  try {
    const raw = await sandbox.run(expression);
    return raw === undefined ? null : JSON.parse(raw);
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
}

/** 记录探针，避免每个用例重复一遍样板。 */
const RECORD = `window.__log = window.__log || []; window.__log.push`;

// ------------------------------------------------- 可见性

test('a parser-blocking script cannot see DOM that follows it', async () => {
  const log = await observe(`<!doctype html><html><body>
<div id=a></div>
<script>${RECORD}({
  before: document.getElementById('a') !== null,
  after: document.getElementById('b') !== null,
});</script>
<div id=b></div>
</body></html>`);

  assert.equal(log.length, 1);
  assert.equal(log[0].before, true, 'preceding elements are already inserted');
  assert.equal(log[0].after, false, 'following elements are not parsed yet');
});

test('document.readyState is "loading" while the parser is running', async () => {
  const log = await observe(`<!doctype html><html><body>
<script>${RECORD}({ readyState: document.readyState });</script>
</body></html>`);

  // 迁移前这里是 'complete'——正常页面里 inline 脚本绝不可能在 complete
  // 状态下首次运行，这是最直接的可检测信号。
  assert.equal(log[0].readyState, 'loading');
});

test('body only contains nodes parsed so far', async () => {
  const log = await observe(`<!doctype html><html><body>
<div id=a></div>
<span></span>
<script>${RECORD}({ count: document.body.children.length });</script>
<div id=b></div>
<div id=c></div>
</body></html>`);

  // div#a、span、script 自身 —— 后面两个 div 还没解析到
  assert.equal(log[0].count, 3);
});

// ------------------------------------------------- 多脚本递进

test('successive scripts each see more of the document', async () => {
  const log = await observe(`<!doctype html><html><body>
<div id=a></div>
<script>${RECORD}({ step: 1, count: document.body.children.length });</script>
<div id=b></div>
<script>${RECORD}({ step: 2, count: document.body.children.length });</script>
<div id=c></div>
<script>${RECORD}({ step: 3, count: document.body.children.length });</script>
</body></html>`);

  assert.equal(log.length, 3);
  assert.deepEqual(log.map((entry) => entry.step), [1, 2, 3], 'document order');

  // 每一步都严格递增：解析是单向推进的
  for (let index = 1; index < log.length; index += 1) {
    assert.ok(
      log[index].count > log[index - 1].count,
      `step ${index + 1} must see more nodes than step ${index}`
    );
  }
});

test('a script can observe its own element as the last child', async () => {
  const log = await observe(`<!doctype html><html><body>
<div id=a></div>
<script id=probe>${RECORD}({
  lastIsSelf: document.body.lastElementChild.id === 'probe',
  currentIsSelf: document.currentScript !== null
    && document.currentScript.id === 'probe',
});</script>
<div id=b></div>
</body></html>`);

  // 解析暂停时脚本元素就是文档最后一个节点
  assert.equal(log[0].lastIsSelf, true);
  assert.equal(log[0].currentIsSelf, true, 'document.currentScript points at the running script');
});

// ------------------------------------------------- head 与 body 的边界

test('a script in head runs before body is parsed', async () => {
  const log = await observe(`<!doctype html><html>
<head>
<script>${RECORD}({
  bodyExists: document.body !== null,
  headChildren: document.head.children.length,
});</script>
</head>
<body><div id=a></div></body>
</html>`);

  // 真实浏览器里 head 脚本运行时 document.body 还是 null
  assert.equal(log[0].bodyExists, false, 'body is not created until parsing reaches it');
  assert.equal(log[0].headChildren, 1, 'only the script itself is in head');
});

// ------------------------------------------------- 解析完成后

test('the document is fully assembled once parsing completes', async () => {
  const final = await observe(`<!doctype html><html><body>
<div id=a></div>
<script>${RECORD}({ mid: true });</script>
<div id=b></div>
<div id=c></div>
</body></html>`, `JSON.stringify({
    readyState: document.readyState,
    count: document.body.children.length,
    bFound: document.getElementById('b') !== null,
    cFound: document.getElementById('c') !== null,
  })`);

  // 流式解析不能以「文档没组装完」为代价
  assert.equal(final.readyState, 'complete');
  assert.equal(final.count, 4, 'div#a, script, div#b, div#c');
  assert.equal(final.bFound, true);
  assert.equal(final.cFound, true);
});

test('deferred scripts still run after the document is parsed', async () => {
  const log = await observe(`<!doctype html><html><body>
<script>${RECORD}({ phase: 'inline', count: document.body.children.length });</script>
<div id=a></div>
<script>
  document.addEventListener('DOMContentLoaded', function () {
    ${RECORD}({ phase: 'dcl', count: document.body.children.length });
  });
</script>
<div id=b></div>
</body></html>`);

  const inline = log.find((entry) => entry.phase === 'inline');
  const dcl = log.find((entry) => entry.phase === 'dcl');

  assert.ok(inline, 'the inline script must run');
  assert.ok(dcl, 'DOMContentLoaded must fire after the parser finishes');
  assert.ok(
    dcl.count > inline.count,
    'DOMContentLoaded sees the complete document, the inline script does not'
  );
});
