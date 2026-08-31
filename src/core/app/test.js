/**
 * 🧪 App & Sandbox 测试套件
 */

import { createApp } from './app.js';
import { definePlugin } from '../plugin-sdk/define-plugin.js';

console.log('🧪 Testing App & Sandbox...\n');

// ============================================================================
// Test 1: 创建 App
// ============================================================================
console.log('Test 1: Create Nv8App');
const app = createApp({
  plugins: ['test-plugin-a@^1.0.0', 'test-plugin-b@^1.0.0'],
  defaultRealm: 'node',
  enableLogging: false,
});

if (app.state !== 'created') {
  throw new Error('App state should be "created"');
}
console.log('✅ App creation works\n');

// ============================================================================
// Test 2: 注册插件
// ============================================================================
console.log('Test 2: Register plugins');

const pluginA = definePlugin({
  id: 'test-plugin-a',
  version: '1.0.0',
  install(ctx) {
    ctx.log('Plugin A installed');
    return {
      name: 'Plugin A',
      getValue() {
        return 'A';
      },
    };
  },
});

const pluginB = definePlugin({
  id: 'test-plugin-b',
  version: '1.0.0',
  requires: ['test-plugin-a@^1.0.0'],
  install(ctx) {
    const pluginA = ctx.getPlugin('test-plugin-a');
    ctx.log(`Plugin B installed, got A: ${pluginA.getValue()}`);
    return {
      name: 'Plugin B',
      getValue() {
        return 'B + ' + pluginA.getValue();
      },
    };
  },
});

app.registerPlugins([pluginA, pluginB]);

if (app.availablePlugins.size !== 2) {
  throw new Error('Should have 2 registered plugins');
}
console.log('✅ Plugin registration works\n');

// ============================================================================
// Test 3: 初始化 App（加载插件）
// ============================================================================
console.log('Test 3: Initialize app and load plugins');

// 更新 config 来请求这些插件
app.config.plugins = ['test-plugin-a@^1.0.0', 'test-plugin-b@^1.0.0'];

await app.initialize();

console.log('App state:', app.state);
console.log('Loaded plugins:', app.loadedPlugins.size);
console.log('Plugin load order:', app.pluginLoadOrder.map(p => p.id));

if (app.state !== 'ready') {
  throw new Error('App state should be "ready"');
}

if (app.loadedPlugins.size !== 2) {
  throw new Error('Should have 2 loaded plugins');
}

// 检查加载顺序（A 应该在 B 前面）
const loadOrder = app.pluginLoadOrder.map(p => p.id);
const indexA = loadOrder.indexOf('test-plugin-a');
const indexB = loadOrder.indexOf('test-plugin-b');

if (indexA >= indexB) {
  throw new Error('Plugin A should be loaded before B');
}

console.log('✅ App initialization works\n');

// ============================================================================
// Test 4: 获取插件实例
// ============================================================================
console.log('Test 4: Get plugin instances');

const instanceA = app.getPlugin('test-plugin-a');
const instanceB = app.getPlugin('test-plugin-b');

if (!instanceA || instanceA.getValue() !== 'A') {
  throw new Error('Plugin A instance incorrect');
}

if (!instanceB || instanceB.getValue() !== 'B + A') {
  throw new Error('Plugin B instance incorrect');
}

console.log('✅ Plugin instances work correctly\n');

// ============================================================================
// Test 5: 创建 Sandbox
// ============================================================================
console.log('Test 5: Create sandbox');

const pluginWithSandboxAPI = definePlugin({
  id: 'sandbox-api-plugin',
  version: '1.0.0',
  install(ctx) {
    return {
      contributeToSandbox(sandbox) {
        return {
          globals: {
            customAPI: {
              greet(name) {
                return `Hello, ${name}!`;
              },
            },
          },
          helpers: {
            formatMessage(msg) {
              return `[Formatted] ${msg}`;
            },
          },
        };
      },
    };
  },
});

app.registerPlugin(pluginWithSandboxAPI);
await app.loadPlugin(pluginWithSandboxAPI);

const sandbox = app.createSandbox({
  realm: 'node',
  plugins: ['test-plugin-a', 'sandbox-api-plugin'],
});

if (!sandbox || !sandbox.id) {
  throw new Error('Sandbox should be created');
}

console.log('✅ Sandbox creation works\n');

// ============================================================================
// Test 6: 初始化 Sandbox 并注入 API
// ============================================================================
console.log('Test 6: Initialize sandbox and inject APIs');

await sandbox.initialize();

if (sandbox.state !== 'ready') {
  throw new Error('Sandbox state should be "ready"');
}

// 检查贡献的 API 数量
if (sandbox.contributedAPIs.size === 0) {
  throw new Error('Sandbox should have contributed APIs');
}

// 检查全局对象
if (!sandbox.globals.customAPI) {
  throw new Error('customAPI should be in globals');
}

console.log('✅ Sandbox initialization works\n');

// ============================================================================
// Test 7: 在 Sandbox 中执行代码
// ============================================================================
console.log('Test 7: Execute code in sandbox');

const result = await sandbox.execute(`
  const greeting = customAPI.greet('Nv8');
  greeting;
`);

if (result !== 'Hello, Nv8!') {
  throw new Error(`Expected "Hello, Nv8!" but got "${result}"`);
}

console.log('✅ Sandbox code execution works\n');

// ============================================================================
// Test 8: 使用插件的 Helper
// ============================================================================
console.log('Test 8: Use plugin helpers');

const helper = sandbox.getHelper('sandbox-api-plugin', 'formatMessage');

if (!helper) {
  throw new Error('Helper should exist');
}

const formatted = helper('Test message');

if (formatted !== '[Formatted] Test message') {
  throw new Error(`Expected "[Formatted] Test message" but got "${formatted}"`);
}

console.log('✅ Plugin helpers work\n');

// ============================================================================
// Test 9: Sandbox 信息
// ============================================================================
console.log('Test 9: Sandbox info');

const info = sandbox.getInfo();

if (info.realm !== 'node') {
  throw new Error('Realm should be "node"');
}

if (info.state !== 'ready') {
  throw new Error('State should be "ready"');
}

if (info.globalCount === 0) {
  throw new Error('Should have globals');
}

console.log('✅ Sandbox info works\n');

// ============================================================================
// Test 10: 销毁 Sandbox
// ============================================================================
console.log('Test 10: Destroy sandbox');

sandbox.destroy();

if (sandbox.state !== 'destroyed') {
  throw new Error('Sandbox state should be "destroyed"');
}

if (Object.keys(sandbox.globals).length !== 0) {
  throw new Error('Globals should be cleared');
}

console.log('✅ Sandbox destruction works\n');

// ============================================================================
// Test 11: 启动和停止 App
// ============================================================================
console.log('Test 11: Start and stop app');

await app.start();

if (app.state !== 'running') {
  throw new Error('App state should be "running"');
}

await app.stop();

if (app.state !== 'stopped') {
  throw new Error('App state should be "stopped"');
}

if (app.loadedPlugins.size !== 0) {
  throw new Error('Plugins should be unloaded');
}

console.log('✅ App lifecycle works\n');

// ============================================================================
// Test 12: 错误处理 - 缺失依赖
// ============================================================================
console.log('Test 12: Error handling - missing dependency');

const app2 = createApp({
  plugins: ['test-plugin-b@1.0.0'], // B 依赖 A，但 A 未注册
  enableLogging: false,
});

app2.registerPlugin(pluginB);

try {
  await app2.initialize();
  throw new Error('Should have thrown an error');
} catch (error) {
  if (!error.message.includes('requires')) {
    throw new Error('Error message should mention missing requirement');
  }
}

console.log('✅ Missing dependency detection works\n');

// ============================================================================
// 总结
// ============================================================================
console.log('━'.repeat(60));
console.log('✨ All App & Sandbox tests passed!');
console.log('━'.repeat(60));
console.log('\nVerified functionality:');
console.log('  ✓ App creation and configuration');
console.log('  ✓ Plugin registration');
console.log('  ✓ Dependency resolution and plugin loading');
console.log('  ✓ Plugin instance access');
console.log('  ✓ Sandbox creation');
console.log('  ✓ Sandbox initialization and API injection');
console.log('  ✓ Code execution in sandbox');
console.log('  ✓ Plugin helper functions');
console.log('  ✓ Sandbox info and state management');
console.log('  ✓ Sandbox destruction');
console.log('  ✓ App lifecycle (start/stop)');
console.log('  ✓ Error handling');
console.log('\n🎯 App & Sandbox system is production-ready!');
