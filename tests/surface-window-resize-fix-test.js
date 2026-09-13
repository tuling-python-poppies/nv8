/**
 * Gitee IKFD9Y 回归：页面内联脚本里的 resizeTo / resizeBy 不能破坏 Realm 创建。
 *
 * 迁移前 `resizeWindowTo/By` 把 innerWidth / innerHeight / outerWidth /
 * outerHeight 从访问器重写成数据属性；inline 脚本执行完之后
 * `finalizeWindowSurfaceOrder()` 的形状检查（表声明访问器、实际是数据属性）
 * 直接抛错，整个 Realm 创建失败。浏览器语义是只改值、不改 descriptor 形状。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

test('inline resizeTo/resizeBy keeps the accessor shape and creation succeeds', async () => {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://resize.test/', {
    page: {
      html: `<!doctype html><html><head></head><body><script>
        window.__resizeProbe = (() => {
          const before = innerWidth;
          resizeTo(1024, 768);
          const afterResizeTo = [innerWidth, innerHeight, outerWidth, outerHeight];
          resizeBy(10, 20);
          const afterResizeBy = [innerWidth, innerHeight];
          const descriptors = {};
          for (const name of ['innerWidth', 'innerHeight', 'outerWidth', 'outerHeight']) {
            const descriptor = Object.getOwnPropertyDescriptor(window, name);
            descriptors[name] = {
              accessor: typeof descriptor.get === 'function'
                || typeof descriptor.set === 'function',
              isData: 'value' in descriptor,
            };
          }
          return { before, afterResizeTo, afterResizeBy, descriptors };
        })();
      </script></body></html>`,
    },
    limits: { timeoutMs: 30_000 },
  });
  try {
    const probe = JSON.parse(await sandbox.run('JSON.stringify(window.__resizeProbe)'));
    assert.deepEqual(probe.afterResizeTo, [1024, 768, 1024, 825], 'resizeTo 必须更新四个尺寸值');
    assert.deepEqual(probe.afterResizeBy, [1034, 788], 'resizeBy 在此基础上累加');
    for (const [name, descriptor] of Object.entries(probe.descriptors)) {
      assert.equal(descriptor.accessor, true, name + ' 必须保持访问器');
      assert.equal(descriptor.isData, false, name + ' 不能被替换成数据属性');
    }
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
});
