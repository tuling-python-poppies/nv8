import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, domPreset } from '../src/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

test('document.open/write/close replaces the document and completes lifecycle', async () => {
  const nv8 = await createNv8({
    plugins: domPreset,
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile',      url: 'https://example.test/',
      pageHtml: '<!doctype html><html><head><title>old</title></head><body><p>old</p></body></html>',
    },
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    const result = realm.evaluate(`(() => {
      const lifecycle = [];
      document.addEventListener('DOMContentLoaded', () => lifecycle.push('dom:' + document.readyState));
      window.addEventListener('load', () => lifecycle.push('load:' + document.readyState));
      document.open();
      const loading = document.readyState;
      document.write('<!doctype html><html><head><title>new</title></head><body><script>globalThis.writtenScript = document.currentScript !== null;</script><main id="app">fresh</main></body></html>');
      const beforeClose = document.getElementById('app');
      document.close();
      return JSON.stringify({
        loading,
        beforeClose: beforeClose === null,
        title: document.title,
        text: document.getElementById('app').textContent,
        writtenScript,
        readyState: document.readyState,
        lifecycle,
      });
    })()`);
    assert.deepEqual(JSON.parse(result), {
      loading: 'loading',
      beforeClose: true,
      title: 'new',
      text: 'fresh',
      writtenScript: true,
      readyState: 'complete',
      lifecycle: ['dom:interactive', 'load:complete'],
    });
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('document.close reruns replay external and module scripts in the new document', async () => {
  const nv8 = await createNv8({
    plugins: domPreset,
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile', url: 'https://example.test/' },
    replay: [
      {
        method: 'GET',
        url: 'https://example.test/close-classic.js',
        body: 'globalThis.closeOrder.push("classic");',
      },
      {
        method: 'GET',
        url: 'https://example.test/close-module.js',
        body: 'import { value } from "./close-helper.js"; closeOrder.push(value);',
      },
      {
        method: 'GET',
        url: 'https://example.test/close-helper.js',
        body: 'export const value = "module";',
      },
    ],
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    const result = await realm.evaluate(`(async () => {
      globalThis.closeOrder = [];
      const lifecycle = [];
      document.addEventListener('DOMContentLoaded', () => lifecycle.push('dom'));
      window.addEventListener('load', () => lifecycle.push('load'));
      document.open();
      document.write('<!doctype html><html><body><script src="/close-classic.js"></script><script type="module" src="/close-module.js"></script></body></html>');
      document.close();
      // 轮询到两个脚本都真的执行完，而不是赌一个固定时长。
      // 注意不能只等 readyState：当前实现下 module 脚本完成晚于 load，
      // 只等生命周期会在 module 跑完前就提前退出。
      for (let attempt = 0; attempt < 500; attempt += 1) {
        if (closeOrder.length >= 2 && document.readyState === 'complete') break;
        await new Promise(resolve => setTimeout(resolve, 2));
      }
      return JSON.stringify({ order: closeOrder, lifecycle, state: document.readyState });
    })()`);
    assert.deepEqual(JSON.parse(result), {
      order: ['classic', 'module'],
      lifecycle: ['dom', 'load'],
      state: 'complete',
    });
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('document.write outside an open transaction appends parsed content', async () => {
  const nv8 = await createNv8({ plugins: domPreset, logger });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    const result = realm.evaluate(`(() => {
      document.write('<p id="written">content</p>');
      return JSON.stringify([document.getElementById('written')?.textContent, document.readyState]);
    })()`);
    assert.deepEqual(JSON.parse(result), ['content', 'complete']);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
