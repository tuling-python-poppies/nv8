/**
 * Gitee IKFDA5 回归：cookie path / Secure 与同源 iframe 存储。
 *
 * - cookie path 用 RFC6265 path-match：`Path=/alpha` 不能匹配 `/alphabet`
 * - 非安全源（http）写 Secure cookie 必须被整体忽略
 * - 同源 iframe 的 localStorage 互通；跨源 iframe 仍隔离
 *
 * cookie 部分走 legacy bootstrap；跨源 iframe 隔离走 plugin 路径。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { waitUntil } from './helpers/async-wait.js';

async function withLegacySandbox(url, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox(url, {
    page: { html: '<!doctype html><html><head></head><body></body></html>' },
    limits: { timeoutMs: 30_000 },
    ...options,
  });
  try {
    return await callback(sandbox);
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
}

test('cookie path uses RFC6265 path-match rather than startsWith', async () => {
  const result = await withLegacySandbox('https://cookie.test/alpha/page', async sandbox => (
    JSON.parse(await sandbox.run(`JSON.stringify((() => {
      document.cookie = 'a=1; Path=/alpha';
      document.cookie = 'b=2; Path=/alpha/';
      document.cookie = 'c=3; Path=/';
      const atSet = document.cookie;
      history.pushState({}, '', '/alphabet');
      const atAlphabet = document.cookie;
      history.pushState({}, '', '/alpha/sub');
      const atSub = document.cookie;
      history.pushState({}, '', '/alpha');
      const atAlpha = document.cookie;
      return { atSet, atAlphabet, atSub, atAlpha };
    })())`))
  ));

  assert.match(result.atSet, /a=1/, '设置处应可见');
  assert.doesNotMatch(result.atAlphabet, /a=1/, '/alphabet 不能匹配 Path=/alpha');
  assert.doesNotMatch(result.atAlphabet, /b=2/, '/alphabet 不能匹配 Path=/alpha/');
  assert.match(result.atAlphabet, /c=3/, 'Path=/ 在所有路径可见');
  assert.match(result.atSub, /a=1/, '/alpha/sub 匹配 Path=/alpha');
  assert.match(result.atSub, /b=2/, '/alpha/sub 匹配 Path=/alpha/');
  assert.doesNotMatch(result.atAlpha, /b=2/, '/alpha 自身不匹配 Path=/alpha/');
  assert.match(result.atAlpha, /a=1/, '/alpha 精确匹配 Path=/alpha');
});

test('a Secure cookie cannot be set from an insecure origin', async () => {
  const result = await withLegacySandbox('http://insecure.test/page', async sandbox => (
    JSON.parse(await sandbox.run(`JSON.stringify((() => {
      document.cookie = 'n=1; Path=/';
      document.cookie = 's=1; Secure; Path=/';
      return { cookie: document.cookie };
    })())`))
  ));

  assert.match(result.cookie, /n=1/, '普通 cookie 正常写入');
  assert.doesNotMatch(result.cookie, /s=1/, 'http 页面写 Secure cookie 必须被忽略');
});

test('cross-origin iframe storage stays isolated', { timeout: 60_000 }, async () => {
  const childDocument = `<!doctype html><html><body><script>
    localStorage.setItem('child-only', 'child');
    sessionStorage.setItem('child-session', 'child');
    parent.postMessage(JSON.stringify({
      childOnly: localStorage.getItem('child-only'),
      childSession: sessionStorage.getItem('child-session'),
      parentValue: localStorage.getItem('parent'),
      parentSession: sessionStorage.getItem('parent-session'),
    }), '*');
  </script></body></html>`;

  const result = await withLegacySandbox('https://isolation.test/', {
    replay: { 'https://other-origin.test/': childDocument },
  }, async sandbox => {
    // 只负责注册监听并插入子帧；「子帧消息到达」是正向信号，由宿主轮询，
    // 不再用 5000ms 定时器赌它一定会到。
    await sandbox.run(`(() => {
      localStorage.setItem('parent', 'kept');
      sessionStorage.setItem('parent-session', 'kept');
      globalThis.__childReport = null;
      addEventListener('message', event => {
        globalThis.__childReport = event.data;
      }, { once: true });
      const frame = document.createElement('iframe');
      frame.src = 'https://other-origin.test/';
      document.body.appendChild(frame);
      return 'attached';
    })()`);
    await waitUntil(
      async () => (await sandbox.run('globalThis.__childReport')) !== null,
      { label: 'cross-origin child postMessage' },
    );
    const child = JSON.parse(await sandbox.run('globalThis.__childReport'));
    return {
      child,
      parentSeesChild: await sandbox.run("localStorage.getItem('child-only')"),
      parentSessionSeesChild: await sandbox.run("sessionStorage.getItem('child-session')"),
    };
  });

  assert.equal(result.child.parentValue, null, '跨源子帧不得读到父 origin 的 localStorage');
  assert.equal(result.child.parentSession, null, '跨源子帧不得读到父 origin 的 sessionStorage');
  assert.equal(result.parentSeesChild, null, '跨源子帧的 localStorage 不得写入父 origin');
  assert.equal(result.parentSessionSeesChild, null, '跨源子帧的 sessionStorage 不得写入父 origin');
  assert.equal(result.child.childOnly, 'child', '子帧自己的存储正常工作');
});
