/**
 * Script Injector 测试
 * 
 * 测试脚本异步注入和时序控制，解决 Bug 2
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createRealm } from '../src/core/realm-factory.js';
import { createStateRegistry } from '../src/core/state-registry.js';
import { createLogger } from '../src/utils/logger.js';
import { 
  ScriptInjector, 
  createScriptInjector, 
  SCRIPT_LOAD_STRATEGY 
} from '../src/core/script-injector.js';
import { drainTasks, waitUntil } from './helpers/async-wait.js';

let testRealmCounter = 0;

async function createTestRealm() {
  return createRealm({
    sandboxId: `script-test-${++testRealmCounter}`,
    type: 'root',
    plugins: [],
    stateRegistry: createStateRegistry(),
    globals: {},
    trace: false,
    logger: createLogger({ enabled: false }),
  });
}

describe('Script Injector', () => {
  it('应该异步注入脚本', async () => {
    const realm = await createTestRealm();
    const injector = createScriptInjector(realm, {
      strategy: SCRIPT_LOAD_STRATEGY.ASYNC,
    });
    
    let executed = false;
    
    const script = injector.registerScript(
      'test.js',
      'globalThis.testExecuted = true;',
      { async: true }
    );
    
    // 脚本应该还没有执行（异步）
    assert.strictEqual(script.executed, false);
    
    // 等待脚本执行
    await drainTasks();
    
    // 现在脚本应该已执行
    assert.strictEqual(script.executed, true);
    assert.strictEqual(realm.globalThis.testExecuted, true);
    
    injector.dispose();
    realm.dispose();
  });
  
  it('应该在下一轮任务中触发回调', async () => {
    const realm = await createTestRealm();
    const injector = createScriptInjector(realm);
    
    const callbackOrder = [];
    
    // 注册回调
    injector.onScriptLoad('lib.js', () => {
      callbackOrder.push('callback');
    });
    
    // 同步代码
    callbackOrder.push('sync-before');
    
    // 注册脚本
    injector.registerScript('lib.js', 'globalThis.lib = true;', { async: true });
    
    // 同步代码
    callbackOrder.push('sync-after');
    
    // 等待异步执行。轮询而非固定延时：并行跑测试时固定 20ms 在负载下不够，
    // 会造成与实现无关的偶发失败。
    const deadline = Date.now() + 2000;
    while (!callbackOrder.includes('callback') && Date.now() < deadline) {
      await drainTasks();
    }
    
    // 验证执行顺序
    assert.deepStrictEqual(callbackOrder, [
      'sync-before',
      'sync-after',
      'callback',
    ]);
    
    injector.dispose();
    realm.dispose();
  });
  
  it('应该支持脚本已加载后注册回调', async () => {
    const realm = await createTestRealm();
    const injector = createScriptInjector(realm);
    
    // 先注册脚本
    injector.registerScript('lib.js', 'globalThis.lib = true;', { async: true });
    
    // 等待脚本加载
    await drainTasks();
    
    assert.strictEqual(injector.isScriptLoaded('lib.js'), true);
    
    // 脚本已加载，现在注册回调
    const callbackOrder = [];
    callbackOrder.push('before-callback');
    
    injector.onScriptLoad('lib.js', () => {
      callbackOrder.push('callback');
    });
    
    callbackOrder.push('after-callback');
    
    // 等待回调执行（应该异步）
    await drainTasks();
    
    // 验证回调是异步的
    assert.deepStrictEqual(callbackOrder, [
      'before-callback',
      'after-callback',
      'callback',
    ]);
    
    injector.dispose();
    realm.dispose();
  });
  
  it('应该支持多个回调', async () => {
    const realm = await createTestRealm();
    const injector = createScriptInjector(realm);
    
    const callbacks = [];
    
    injector.onScriptLoad('lib.js', () => callbacks.push('callback-1'));
    injector.onScriptLoad('lib.js', () => callbacks.push('callback-2'));
    injector.onScriptLoad('lib.js', () => callbacks.push('callback-3'));
    
    injector.registerScript('lib.js', 'globalThis.lib = true;', { async: true });
    
    await drainTasks();
    
    assert.deepStrictEqual(callbacks, [
      'callback-1',
      'callback-2',
      'callback-3',
    ]);
    
    injector.dispose();
    realm.dispose();
  });
  
  it('应该等待所有脚本加载完成', async () => {
    const realm = await createTestRealm();
    const injector = createScriptInjector(realm);
    
    injector.registerScript('lib1.js', 'globalThis.lib1 = true;', { async: true });
    injector.registerScript('lib2.js', 'globalThis.lib2 = true;', { async: true });
    injector.registerScript('lib3.js', 'globalThis.lib3 = true;', { async: true });
    
    assert.strictEqual(injector.getPendingCount(), 3);
    
    await injector.waitForAllScripts();
    
    assert.strictEqual(injector.getPendingCount(), 0);
    assert.strictEqual(realm.globalThis.lib1, true);
    assert.strictEqual(realm.globalThis.lib2, true);
    assert.strictEqual(realm.globalThis.lib3, true);
    
    injector.dispose();
    realm.dispose();
  });
  
  it('应该模拟真实的 AWSC.use 行为', async () => {
    const realm = await createTestRealm();
    const injector = createScriptInjector(realm);
    
    // 在 Realm 中注入 AWSC 模拟
    realm.evaluate(`
      globalThis.AWSC = {
        _modules: {},
        _callbacks: {},
        
        register(name, module) {
          this._modules[name] = module;
          
          // 触发等待的回调（异步）
          if (this._callbacks[name]) {
            for (const callback of this._callbacks[name]) {
              setTimeout(() => callback(module), 0);
            }
            delete this._callbacks[name];
          }
        },
        
        use(name, callback) {
          if (this._modules[name]) {
            // 模块已加载，异步调用回调
            setTimeout(() => callback(this._modules[name]), 0);
          } else {
            // 模块未加载，等待
            if (!this._callbacks[name]) {
              this._callbacks[name] = [];
            }
            this._callbacks[name].push(callback);
          }
        },
      };
    `);
    
    const executionOrder = [];
    realm.globalThis.executionOrder = executionOrder;
    
    // 场景 1: 先注册 use，后加载脚本
    realm.evaluate(`
      globalThis.AWSC.use('nc', (nc) => {
        globalThis.executionOrder.push('nc-loaded');
      });
      globalThis.executionOrder.push('after-use');
    `);
    
    executionOrder.push('before-script');
    
    // 加载 nc 模块
    injector.registerScript(
      'nc.js',
      `globalThis.AWSC.register('nc', { init: () => {} });`,
      { async: true }
    );
    
    executionOrder.push('after-script');
    
    await drainTasks();
    
    // 验证执行顺序
    assert.deepStrictEqual(executionOrder, [
      'after-use',
      'before-script',
      'after-script',
      'nc-loaded',
    ]);
    
    injector.dispose();
    realm.dispose();
  });
  
  it('应该处理延迟加载脚本', async () => {
    const realm = await createTestRealm();
    const injector = createScriptInjector(realm);
    
    const script = injector.registerScript(
      'deferred.js',
      'globalThis.deferred = true;',
      { strategy: SCRIPT_LOAD_STRATEGY.DEFERRED }
    );
    
    // 延迟脚本应该还没有执行
    await drainTasks();
    
    // 现在应该已执行
    await drainTasks();
    assert.strictEqual(script.executed, true);
    assert.strictEqual(realm.globalThis.deferred, true);
    
    injector.dispose();
    realm.dispose();
  });
});

describe('Script Injector - Bug 2 场景', () => {
  it('应该解决 Bug 2: 脚本时序问题', async () => {
    const realm = await createTestRealm();
    const injector = createScriptInjector(realm);
    
    // 模拟真实场景：
    // 1. 页面先执行 AWSC.use("nc", callback)
    // 2. 然后异步加载 nc 脚本
    // 3. nc 脚本执行 AWSC.register("nc", module)
    // 4. callback 应该在下一轮任务中执行
    
    realm.evaluate(`
      globalThis.AWSC = {
        _modules: {},
        _callbacks: {},
        register(name, module) {
          this._modules[name] = module;
          if (this._callbacks[name]) {
            for (const callback of this._callbacks[name]) {
              setTimeout(() => callback(module), 0);
            }
            delete this._callbacks[name];
          }
        },
        use(name, callback) {
          if (this._modules[name]) {
            setTimeout(() => callback(this._modules[name]), 0);
          } else {
            if (!this._callbacks[name]) {
              this._callbacks[name] = [];
            }
            this._callbacks[name].push(callback);
          }
        },
      };
      
      globalThis.timeline = [];
      globalThis.timeline.push('page-start');
      
      globalThis.AWSC.use('nc', (nc) => {
        globalThis.timeline.push('nc-callback');
        globalThis.ncInstance = nc;
      });
      
      globalThis.timeline.push('page-after-use');
    `);
    
    // 异步加载 nc 脚本
    injector.registerScript(
      'nc.js',
      `
        globalThis.timeline.push('nc-script-start');
        globalThis.AWSC.register('nc', {
          init: function() {
            globalThis.timeline.push('nc-init');
          }
        });
        globalThis.timeline.push('nc-script-end');
      `,
      { async: true }
    );
    
    // 等待所有异步任务完成
    await injector.waitForAllScripts();
    await drainTasks();
    
    // 验证时序
    const timeline = Array.from(realm.globalThis.timeline);
    assert.deepStrictEqual(timeline, [
      'page-start',
      'page-after-use',
      'nc-script-start',
      'nc-script-end',
      'nc-callback',
    ]);
    
    // 验证 nc 实例已创建
    assert.ok(realm.globalThis.ncInstance);
    assert.strictEqual(typeof realm.globalThis.ncInstance.init, 'function');
    
    injector.dispose();
    realm.dispose();
  });
});
