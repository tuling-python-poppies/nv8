/**
 * 事件处理器 IDL 属性与内容属性
 *
 * 两个曾经的缺陷：
 *
 * 1. **`el.onclick = fn` 不参与派发。** 属性能读能写，
 *    `typeof el.onclick === 'function'`，但事件派发时处理器从未被调用。
 *    `el.onclick = fn` 在真实页面里极其常见，静默失效会让整段逻辑消失。
 *    window 的处理器早已接好，element 与 document 漏了。
 *
 * 2. **`<div onclick="...">` 不编译成函数。** `getAttribute('onclick')` 能拿到
 *    源码，但 `el.onclick` 是 `null`——属性存在而处理器不存在。
 *
 * 规范把事件处理器实现为**一个事件监听器**，因此它和 `addEventListener` 注册的
 * 监听器在同一个列表里按注册顺序触发；重新赋值**不改变位置**。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * 在沙箱里求值一段表达式。
 *
 * 复用同一个沙箱：这些断言互不干扰，每个用例各起一个会明显拖慢套件。
 */
let sandboxPromise = null;

function sandbox() {
  sandboxPromise ??= (async () => {
    const { createSandbox } = await import('../src/public/create-sandbox.js');
    return createSandbox('https://handler.test/', {
      page: {
        html: `<!doctype html><html><body>
<div id=attr onclick="window.__attrHits = (window.__attrHits || []).concat('attr')"></div>
<div id=broken onclick="this is not valid javascript("></div>
</body></html>`,
      },
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

// ------------------------------------------------ IDL 属性参与派发

test('element on* handlers are invoked during dispatch', async () => {
  const log = await evaluate(`
    const out = [];
    const element = document.createElement('div');
    element.onclick = () => out.push('handler');
    element.dispatchEvent(new Event('click'));
    return out;
  `);

  assert.deepEqual(log, ['handler'], 'el.onclick must participate in dispatch');
});

test('document on* handlers are invoked during dispatch', async () => {
  const log = await evaluate(`
    const out = [];
    document.onclick = () => out.push('document');
    document.dispatchEvent(new Event('click'));
    document.onclick = null;
    return out;
  `);

  assert.deepEqual(log, ['document']);
});

test('handlers and addEventListener listeners fire in registration order', async () => {
  const log = await evaluate(`
    const out = [];
    const element = document.createElement('div');
    element.onclick = () => out.push('handler');
    element.addEventListener('click', () => out.push('listener'));
    element.dispatchEvent(new Event('click'));
    return out;
  `);

  // 处理器是先注册的，所以先触发
  assert.deepEqual(log, ['handler', 'listener']);
});

test('the full bubble path reaches element, document and window handlers', async () => {
  const log = await evaluate(`
    const out = [];
    const element = document.createElement('div');
    document.body.appendChild(element);
    element.onclick = () => out.push('element');
    element.addEventListener('click', () => out.push('elementListener'));
    document.onclick = () => out.push('document');
    window.onclick = () => out.push('window');
    element.dispatchEvent(new Event('click', { bubbles: true }));
    document.body.removeChild(element);
    document.onclick = null;
    window.onclick = null;
    return out;
  `);

  assert.deepEqual(log, ['element', 'elementListener', 'document', 'window']);
});

// ------------------------------------------------ 重新赋值保持位置

test('reassigning a handler keeps its original position', async () => {
  const log = await evaluate(`
    const out = [];
    const element = document.createElement('div');
    element.onclick = () => out.push('first');
    element.addEventListener('click', () => out.push('listener'));
    element.onclick = () => out.push('third');
    element.dispatchEvent(new Event('click'));
    return out;
  `);

  // 先移除再重新添加会让处理器跳到列表末尾，得到 ['listener','third']
  assert.deepEqual(log, ['third', 'listener'], 'the handler must not move to the end');
});

test('setting a handler to null stops it without disturbing listeners', async () => {
  const observed = await evaluate(`
    const out = [];
    const element = document.createElement('div');
    element.onclick = () => out.push('handler');
    element.addEventListener('click', () => out.push('listener'));
    element.onclick = null;
    element.dispatchEvent(new Event('click'));
    return { out, type: typeof element.onclick, value: element.onclick };
  `);

  assert.deepEqual(observed.out, ['listener']);
  assert.equal(observed.value, null, 'an unset handler reads back as null');
});

test('a non-callable assignment is treated as null', async () => {
  const observed = await evaluate(`
    const element = document.createElement('div');
    element.onclick = 'not a function';
    return { value: element.onclick };
  `);

  assert.equal(observed.value, null);
});

test('an object with handleEvent is accepted', async () => {
  const log = await evaluate(`
    const out = [];
    const element = document.createElement('div');
    element.onclick = { handleEvent() { out.push('handleEvent'); } };
    element.dispatchEvent(new Event('click'));
    return out;
  `);

  assert.deepEqual(log, ['handleEvent']);
});

// ------------------------------------------------ 内容属性编译

test('an inline handler attribute compiles into a function', async () => {
  const observed = await evaluate(`
    const element = document.getElementById('attr');
    return {
      type: typeof element.onclick,
      attribute: element.getAttribute('onclick'),
    };
  `);

  assert.equal(observed.type, 'function', '<div onclick="..."> must compile');
  // 编译不能吃掉原始属性值
  assert.match(observed.attribute, /__attrHits/);
});

test('an inline handler attribute runs on dispatch', async () => {
  const log = await evaluate(`
    const element = document.getElementById('attr');
    window.__attrHits = [];
    element.dispatchEvent(new Event('click'));
    return window.__attrHits;
  `);

  assert.deepEqual(log, ['attr']);
});

test('the compiled handler receives the event as "event"', async () => {
  const observed = await evaluate(`
    const element = document.createElement('div');
    element.setAttribute('onclick', 'window.__seen = event.type');
    element.dispatchEvent(new Event('click'));
    return { seen: window.__seen };
  `);

  // 形参名必须是 event：内联处理器里写 event.preventDefault() 是普遍用法
  assert.equal(observed.seen, 'click');
});

test('a syntactically invalid handler attribute yields null instead of throwing', async () => {
  const observed = await evaluate(`
    const element = document.getElementById('broken');
    return { type: typeof element.onclick, value: element.onclick };
  `);

  // 浏览器把编译失败当脚本错误报告，而不是从 setAttribute 里抛出
  assert.equal(observed.value, null);
});

test('setAttribute after an assignment overrides the handler', async () => {
  const log = await evaluate(`
    const out = [];
    window.__override = () => out.push('fromAttribute');
    const element = document.createElement('div');
    element.onclick = () => out.push('fromProperty');
    element.setAttribute('onclick', 'window.__override()');
    element.dispatchEvent(new Event('click'));
    return out;
  `);

  assert.deepEqual(log, ['fromAttribute'], 'the later attribute wins');
});

test('an unrelated on-prefixed attribute is not treated as a handler', async () => {
  const observed = await evaluate(`
    const element = document.createElement('div');
    element.setAttribute('onfoo', 'window.__never = 1');
    return {
      attribute: element.getAttribute('onfoo'),
      compiled: typeof element.onfoo,
      leaked: window.__never === undefined,
    };
  `);

  // onfoo 不是事件处理器 IDL 属性，只能是普通属性
  assert.equal(observed.attribute, 'window.__never = 1');
  assert.equal(observed.compiled, 'undefined');
  assert.equal(observed.leaked, true, 'it must never be executed');
});
