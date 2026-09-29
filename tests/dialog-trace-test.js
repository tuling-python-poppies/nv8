/**
 * 对话框调用的可观测性（proxy trace）
 *
 * `alert` / `confirm` / `prompt` 是页面行为的重要信号：反爬组件与调试探测器
 * 常用「有没有弹窗」判断代码路径。NV8 里它们是 no-op，此前在本地完全不可见
 * ——跑了哪个分支看不出任何区别。现在调用会进 proxy trace。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

let sandboxPromise = null;

function sandbox() {
  sandboxPromise ??= (async () => {
    const { createSandbox } = await import('../src/public/create-sandbox.js');
    return createSandbox('https://dialog.test/', {
      page: { html: '<!doctype html><html><body></body></html>' },
    });
  })();
  return sandboxPromise;
}

test.after(async () => {
  if (sandboxPromise === null) return;
  const instance = await sandboxPromise;
  await instance.close();
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  createSandbox.drain();
});

test('alert, confirm and prompt calls show up in the proxy trace', async () => {
  const instance = await sandbox();
  await instance.enableProxyTrace();
  await instance.run(`
    alert('alert-probe');
    confirm('confirm-probe');
    prompt('prompt-probe', 'default');
  `);
  const trace = await instance.proxyTrace();
  await instance.disableProxyTrace();

  const dialogApis = trace
    .filter(entry => /window\.(alert|confirm|prompt)/.test(entry.api))
    .map(entry => entry.api);

  assert.deepEqual(dialogApis, [
    'window.alert',
    'window.confirm',
    'window.prompt',
  ]);
});
