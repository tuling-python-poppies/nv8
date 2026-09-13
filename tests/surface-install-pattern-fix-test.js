/**
 * Gitee IKF3A7 回归：表面安装模式。
 *
 * - `window.postMessage` 不再裸写 `globalThis`，改走 `defineGlobalFunction`
 * - `CSS` 命名空间的构造在 api 层，全局定义在 install 层
 * - `install-webgl.js` 去掉未使用 import 与空 do/while，接口仍正常安装
 */

import test from 'node:test';
import assert from 'node:assert/strict';

let sandboxPromise = null;

function sandbox() {
  sandboxPromise ??= (async () => {
    const { createSandbox } = await import('../src/public/create-sandbox.js');
    return createSandbox('https://install-pattern.test/', {
      page: { html: '<!doctype html><html><head></head><body></body></html>' },
      limits: { timeoutMs: 30_000 },
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

test('window.postMessage keeps its surface shape through defineGlobalFunction', async () => {
  const instance = await sandbox();
  const result = JSON.parse(await instance.run(`JSON.stringify((() => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'postMessage');
    return {
      kind: 'value' in descriptor ? 'value' : 'accessor',
      writable: descriptor.writable,
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      name: postMessage.name,
      length: postMessage.length,
      nativeSource: /\\[native code\\]/.test(Function.prototype.toString.call(postMessage)),
    };
  })())`));
  assert.deepEqual(result, {
    kind: 'value',
    writable: true,
    enumerable: true,
    configurable: true,
    name: 'postMessage',
    length: 1,
    nativeSource: true,
  });
});

test('CSS namespace is defined with the standard hidden-global shape', async () => {
  const instance = await sandbox();
  const result = JSON.parse(await instance.run(`JSON.stringify((() => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'CSS');
    return {
      kind: 'value' in descriptor ? 'value' : 'accessor',
      writable: descriptor.writable,
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      tag: CSS[Symbol.toStringTag],
      escape: CSS.escape('a b'),
      supports: CSS.supports('(display: block)'),
      unit: CSS.px(10).value,
    };
  })())`));
  assert.deepEqual(result, {
    kind: 'value',
    writable: true,
    enumerable: false,
    configurable: true,
    tag: 'CSS',
    escape: 'a\\ b',
    supports: true,
    unit: 10,
  });
});

test('WebGL constructors are still installed after the cleanup', async () => {
  const instance = await sandbox();
  const result = JSON.parse(await instance.run(`JSON.stringify({
    uniformLocation: typeof WebGLUniformLocation,
    vertexArray: typeof WebGLVertexArrayObject,
    uniformPrototype: Object.getPrototypeOf(WebGLUniformLocation.prototype)
      === Object.prototype,
    vertexArrayPrototype: Object.getPrototypeOf(WebGLVertexArrayObject.prototype)
      === WebGLObject.prototype,
  })`));
  assert.deepEqual(result, {
    uniformLocation: 'function',
    vertexArray: 'function',
    uniformPrototype: true,
    vertexArrayPrototype: true,
  });
});
