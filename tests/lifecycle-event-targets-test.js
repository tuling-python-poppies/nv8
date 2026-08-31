/**
 * 生命周期事件的派发目标
 *
 * 「事件有没有触发」不够——**在哪个对象上触发**同样是可观测的契约。
 * 目标搞错会让最常见的写法静默失效，或者让真实浏览器里不该触发的监听器触发。
 *
 * 全部结论来自真实 Edge 151 实测（临时本地 HTTP 服务器 + headless，
 * `file://` 下 iframe 是不同的 opaque origin 拿不到 parent）：
 *
 * ```
 * 页面加载:  ["document:DCL", "window:DCL", "window:load"]
 * iframe 内导航: ["window:beforeunload", "window:pagehide", "window:unload"]
 * ```
 *
 * 两条规律：
 * - `DOMContentLoaded` 在 document 上派发并**冒泡**到 window，两侧都触发。
 * - `load` / `pagehide` / `unload` / `beforeunload` **只在 window 上**派发，
 *   document 监听器一个都不触发。
 *
 * 修掉的三处偏差：
 * 1. `load` 曾以「向后兼容」为由额外在 document 上补派一份。真实浏览器里
 *    `document.addEventListener('load')` 从不触发，补派是可检测的偏差。
 * 2. `pagehide` / `unload` 曾**只**在 document 上派发——两侧都与真实相反。
 * 3. `document.close()` 的兜底路径派发的 `DOMContentLoaded` 不带 `bubbles`，
 *    `window.addEventListener('DOMContentLoaded')` 收不到；`load` 也派在 document 上。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

/** 记录 window 与 document 两侧监听器的探针。 */
const RECORDER = `
  globalThis.log = [];
  for (const type of ['DOMContentLoaded', 'load']) {
    window.addEventListener(type, () => globalThis.log.push('window:' + type));
    document.addEventListener(type, () => globalThis.log.push('document:' + type));
  }
`;

/**
 * 起一个 legacy 沙箱。legacy 是默认运行模式，也是唯一拥有完整
 * `BeforeUnloadEvent` / `onbeforeunload` 表面的模式。
 */
async function withSandbox(html, body) {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://lifecycle.test/page', {
    page: { html },
  });
  try {
    return await body(sandbox);
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
}

// ------------------------------------------------ 页面加载

test('load fires on window only; DOMContentLoaded reaches both by bubbling', async () => {
  const log = await withSandbox(
    `<!doctype html><html><head><script>${RECORDER}</script></head><body></body></html>`,
    sandbox => sandbox.run('JSON.stringify(globalThis.log)').then(JSON.parse),
  );

  assert.deepEqual(log, ['document:DOMContentLoaded', 'window:DOMContentLoaded', 'window:load']);
});

test('a document load listener never fires', async () => {
  const log = await withSandbox(
    `<!doctype html><html><head><script>${RECORDER}</script></head><body></body></html>`,
    sandbox => sandbox.run('JSON.stringify(globalThis.log)').then(JSON.parse),
  );

  // 曾经为「向后兼容」额外派一份，真实浏览器里不存在
  assert.equal(log.includes('document:load'), false);
});

// ------------------------------------------------ document.open/write/close

test('document.close dispatches a bubbling DOMContentLoaded and a window load', async () => {
  const observed = await withSandbox(
    '<!doctype html><html><head></head><body>old</body></html>',
    sandbox => sandbox.run(`JSON.stringify((() => {
      const seen = [];
      for (const type of ['DOMContentLoaded', 'load']) {
        window.addEventListener(type, () => seen.push('window:' + type));
        document.addEventListener(type, () => seen.push('document:' + type));
      }
      document.open();
      document.write('<!doctype html><html><body><main>fresh</main></body></html>');
      document.close();
      return { seen, text: document.querySelector('main').textContent };
    })())`).then(JSON.parse),
  );

  assert.equal(observed.text, 'fresh', 'the document must actually be replaced');
  // DCL 冒泡 → 两侧都有；load 只在 window
  assert.ok(observed.seen.includes('document:DOMContentLoaded'));
  assert.ok(observed.seen.includes('window:DOMContentLoaded'), 'DCL must bubble to window');
  assert.ok(observed.seen.includes('window:load'));
  assert.equal(observed.seen.includes('document:load'), false);
});

// ------------------------------------------------ beforeunload

/**
 * `beforeunload` 的取消判定在 `dispatchBeforeUnload()` 里，只在真实导航时触发。
 * 页面脚本**无法构造** `BeforeUnloadEvent`（真实 Edge 实测抛
 * `Illegal constructor`），所以这里只能断言可观测的形状与守卫；三条取消路径的
 * 端到端验证在 `tests/root-window-client-navigation-test.js`。
 */
test('BeforeUnloadEvent is not constructible from page script', async () => {
  const observed = await withSandbox(
    '<!doctype html><html><body></body></html>',
    sandbox => sandbox.run(`JSON.stringify((() => {
      try { new BeforeUnloadEvent('beforeunload'); return { threw: false }; }
      catch (error) { return { threw: true, name: error.name, message: error.message }; }
    })())`).then(JSON.parse),
  );

  // 真实 Edge：TypeError: Failed to construct 'BeforeUnloadEvent': Illegal constructor
  assert.equal(observed.threw, true);
  assert.equal(observed.name, 'TypeError');
  assert.match(observed.message, /Failed to construct 'BeforeUnloadEvent': Illegal constructor/);
});

test('BeforeUnloadEvent keeps returnValue on its prototype', async () => {
  const observed = await withSandbox(
    '<!doctype html><html><body></body></html>',
    sandbox => sandbox.run(`JSON.stringify({
      members: Object.getOwnPropertyNames(BeforeUnloadEvent.prototype).sort(),
      length: BeforeUnloadEvent.length,
    })`).then(JSON.parse),
  );

  assert.deepEqual(observed.members, ['constructor', 'returnValue']);
  // 实测真实 Edge 的 BeforeUnloadEvent.length 是 0（它没有必需参数）
  assert.equal(observed.length, 0);
});

/**
 * 真实 Edge 里不可构造的 longtail 事件接口。
 *
 * 实测方式：headless Edge 对 25 个构造器逐个 `new`，8 个抛
 * `TypeError: Illegal constructor`。不是靠 WebIDL 推断——规范里有没有
 * `[Constructor]` 与浏览器实际实现常有出入。
 */
const NON_CONSTRUCTIBLE = Object.freeze([
  'PictureInPictureEvent',
  'BeforeUnloadEvent',
  'AudioProcessingEvent',
  'ClipboardChangeEvent',
  'PresentationConnectionAvailableEvent',
  'PresentationConnectionCloseEvent',
  'DocumentPictureInPictureEvent',
  'SnapEvent',
]);

/** 实测可构造的，抽样几个防止把不该封的也封了。 */
const CONSTRUCTIBLE = Object.freeze([
  'InterestEvent', 'CommandEvent', 'PageRevealEvent',
  'IDBVersionChangeEvent', 'AnimationPlaybackEvent',
]);

test('events that real Edge refuses to construct throw here too', async () => {
  const observed = await withSandbox(
    '<!doctype html><html><body></body></html>',
    sandbox => sandbox.run(`JSON.stringify((() => {
      const result = {};
      for (const name of ${JSON.stringify(NON_CONSTRUCTIBLE)}) {
        const Ctor = globalThis[name];
        if (typeof Ctor !== 'function') { result[name] = 'absent'; continue; }
        try { new Ctor('probe'); result[name] = 'constructible'; }
        catch (error) { result[name] = error.name; }
      }
      return result;
    })())`).then(JSON.parse),
  );

  for (const name of NON_CONSTRUCTIBLE) {
    assert.equal(observed[name], 'TypeError', `${name} must not be constructible`);
  }
});

test('events that real Edge does construct stay constructible', async () => {
  const observed = await withSandbox(
    '<!doctype html><html><body></body></html>',
    sandbox => sandbox.run(`JSON.stringify((() => {
      const result = {};
      for (const name of ${JSON.stringify(CONSTRUCTIBLE)}) {
        const Ctor = globalThis[name];
        if (typeof Ctor !== 'function') { result[name] = 'absent'; continue; }
        try { new Ctor('probe'); result[name] = 'constructible'; }
        catch (error) { result[name] = error.name; }
      }
      return result;
    })())`).then(JSON.parse),
  );

  for (const name of CONSTRUCTIBLE) {
    assert.equal(observed[name], 'constructible', `${name} must remain constructible`);
  }
});

/**
 * 不可构造的接口各自的 `length`（实测真实 Edge，逐个不同，不能一刀切）。
 */
const NON_CONSTRUCTIBLE_LENGTHS = Object.freeze({
  PictureInPictureEvent: 2,
  BeforeUnloadEvent: 0,
  AudioProcessingEvent: 2,
  ClipboardChangeEvent: 0,
  PresentationConnectionAvailableEvent: 2,
  PresentationConnectionCloseEvent: 2,
  DocumentPictureInPictureEvent: 2,
  SnapEvent: 0,
});

test('non-constructible event constructors keep their declared length', async () => {
  const observed = await withSandbox(
    '<!doctype html><html><body></body></html>',
    sandbox => sandbox.run(`JSON.stringify((() => {
      const result = {};
      for (const name of ${JSON.stringify(NON_CONSTRUCTIBLE)}) {
        const Ctor = globalThis[name];
        result[name] = typeof Ctor === 'function' ? Ctor.length : 'absent';
      }
      return result;
    })())`).then(JSON.parse),
  );

  // 守卫函数容易把 length 抹成 0。实测每个接口的 length 不同——
  // 一刀切成 2 会把本来就是 0 的那几个改错。
  for (const [name, expected] of Object.entries(NON_CONSTRUCTIBLE_LENGTHS)) {
    assert.equal(observed[name], expected, `${name}.length must stay ${expected}`);
  }
});

// ------------------------------------------------ beforeunload 端到端取消

/**
 * 走**真实导航**验证 `beforeunload` 的三条异议路径。
 *
 * 规范有三条，Chromium 全部支持，真实页面里后两条比第一条更常见：
 *
 * 1. `event.preventDefault()`
 * 2. `event.returnValue = '非空字符串'`
 * 3. `onbeforeunload` 处理器返回非空字符串
 *
 * 第 2 条的判定必须在决策点 `dispatchBeforeUnload()` 而不是 `returnValue` 的
 * setter 里——真实 Edge 实测赋值**不会**置上 canceled 标志
 * （`defaultPrevented` 仍是 false），塞进 setter 会让它说谎。
 *
 * 这些用例只能在 legacy 模式跑：plugin 模式（含 `fullPreset`）不提供
 * `BeforeUnloadEvent` 与 `onbeforeunload`，`dispatchBeforeUnload()` 会降级到
 * 普通 `Event`，那时 `returnValue` 是旧 IE 的**布尔**语义（赋 falsy 值等于
 * preventDefault），与 beforeunload 的字符串语义正好相反。
 */
async function navigationOutcome(setup) {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://lifecycle.test/page', {
    page: { html: '<!doctype html><html><body></body></html>' },
  });
  try {
    return JSON.parse(await sandbox.run(`(() => {
      globalThis.unloadLog = [];
      window.addEventListener('pagehide', () => unloadLog.push('pagehide'));
      window.addEventListener('unload', () => unloadLog.push('unload'));
      ${setup}
      location.assign('/moved');
      return JSON.stringify({ href: location.href, unloadLog });
    })()`));
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
}

const START = 'https://lifecycle.test/page';

test('preventDefault cancels the navigation', async () => {
  const outcome = await navigationOutcome(
    "window.addEventListener('beforeunload', event => event.preventDefault());"
  );

  assert.equal(outcome.href, START, 'the URL must not change');
  // 取消的导航不该派发卸载事件
  assert.deepEqual(outcome.unloadLog, []);
});

test('a non-empty returnValue cancels the navigation', async () => {
  const outcome = await navigationOutcome(
    "window.addEventListener('beforeunload', event => { event.returnValue = 'stay'; });"
  );

  assert.equal(outcome.href, START);
  assert.deepEqual(outcome.unloadLog, []);
});

test('an onbeforeunload handler returning a string cancels the navigation', async () => {
  const outcome = await navigationOutcome("window.onbeforeunload = () => 'stay';");

  assert.equal(outcome.href, START);
});

test('an empty returnValue is not an objection', async () => {
  const outcome = await navigationOutcome(
    "window.addEventListener('beforeunload', event => { event.returnValue = ''; });"
  );

  assert.notEqual(outcome.href, START, 'navigation must proceed');
  // 继续的导航按序派发 pagehide 再 unload，都在 window 上
  assert.deepEqual(outcome.unloadLog, ['pagehide', 'unload']);
});

test('a handler returning undefined is not an objection', async () => {
  const outcome = await navigationOutcome('window.onbeforeunload = () => undefined;');

  // 只有返回**字符串**才算异议
  assert.notEqual(outcome.href, START);
});

test('navigation proceeds and unloads when nothing objects', async () => {
  const outcome = await navigationOutcome('');

  assert.equal(outcome.href, 'https://lifecycle.test/moved');
  assert.deepEqual(outcome.unloadLog, ['pagehide', 'unload']);
});

test('the beforeunload event is a BeforeUnloadEvent', async () => {
  const observed = await navigationOutcome(`
    window.addEventListener('beforeunload', event => {
      globalThis.__shape = {
        ctor: event.constructor && event.constructor.name,
        isBUE: event instanceof BeforeUnloadEvent,
        cancelable: event.cancelable,
        initialReturnValue: event.returnValue,
      };
      event.preventDefault();
    });
  `);

  assert.equal(observed.href, START);

  // 页面脚本造不出这个事件，只能在处理器里观察它
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://lifecycle.test/page', {
    page: { html: '<!doctype html><html><body></body></html>' },
  });
  try {
    const shape = JSON.parse(await sandbox.run(`(() => {
      window.addEventListener('beforeunload', event => {
        globalThis.__shape = {
          ctor: event.constructor && event.constructor.name,
          isBUE: event instanceof BeforeUnloadEvent,
          cancelable: event.cancelable,
          initialReturnValue: event.returnValue,
        };
        event.preventDefault();
      });
      location.assign('/moved');
      return JSON.stringify(globalThis.__shape);
    })()`));

    assert.equal(shape.ctor, 'BeforeUnloadEvent');
    assert.equal(shape.isBUE, true, 'instanceof must hold');
    assert.equal(shape.cancelable, true);
    assert.equal(shape.initialReturnValue, '', 'returnValue starts as an empty string');
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
});
